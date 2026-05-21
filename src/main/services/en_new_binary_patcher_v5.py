# EN New Binary Patcher V5
# Universal safer mode: keeps full duration/audio by stream-copying all audio tracks, no re-encode.
# Safe AVCC repacker: remux first, then remove H.264 SEI/AUD NAL units from MP4 samples
# by rebuilding length-prefixed AVCC packets and updating stsz/stco/mdat.

import os, sys, json, shutil, struct, subprocess, bisect
from pathlib import Path

REMOVE_NAL_TYPES = {6, 9}  # SEI, AUD
CONTAINERS = {b'moov', b'trak', b'mdia', b'minf', b'stbl', b'edts', b'udta', b'meta', b'ilst', b'dinf', b'avc1', b'mp4a'}

def die(msg, code=1):
    print('[ERROR]', msg); sys.exit(code)

def find_tool(name, override=None):
    if override:
        p = Path(str(override)).resolve()
        if p.exists():
            return str(p)
        die(f'Not found: {p}')
    here=Path(__file__).resolve().parent
    for c in (here/f'{name}.exe', here/name):
        if c.exists(): return str(c)
    w=shutil.which(name)
    if w: return w
    die(f'{name}.exe was not found near the patcher and not found in PATH')

def run(cmd):
    print('[RUN]', ' '.join(('"%s"'%x) if ' ' in x else x for x in cmd))
    p=subprocess.run(cmd, stdout=subprocess.PIPE, stderr=subprocess.STDOUT, text=True)
    if p.stdout: print(p.stdout)
    if p.returncode: die('Command failed with exit code: %s' % p.returncode)

def ffprobe_json(ffprobe, file_path):
    p=subprocess.run([ffprobe,'-v','error','-show_format','-show_streams','-of','json',file_path], stdout=subprocess.PIPE, stderr=subprocess.STDOUT, text=True)
    if p.returncode: die('ffprobe failed:\n'+p.stdout)
    return json.loads(p.stdout)

def be32(b,o): return struct.unpack_from('>I', b, o)[0]
def wr32(b,o,v): struct.pack_into('>I', b, o, v & 0xffffffff)
def be64(b,o): return struct.unpack_from('>Q', b, o)[0]
def wr64(b,o,v): struct.pack_into('>Q', b, o, v)

class Box:
    __slots__=('type','start','header','end','children')
    def __init__(self,t,s,h,e): self.type=t; self.start=s; self.header=h; self.end=e; self.children=[]

def parse_boxes(data, start=0, end=None, depth=0):
    if end is None: end=len(data)
    out=[]; p=start
    while p+8<=end:
        size=be32(data,p); typ=bytes(data[p+4:p+8]); header=8
        if size==1:
            if p+16>end: break
            size=be64(data,p+8); header=16
        elif size==0:
            size=end-p
        if size< header or p+size>end: break
        box=Box(typ,p,header,p+size)
        child_start=p+header
        if typ==b'meta': child_start += 4  # version/flags
        elif typ in (b'avc1', b'mp4a'):
            # sample entry reserved fields; child boxes start after entry header
            child_start = p + header + (78 if typ==b'avc1' else 28)
        if typ in CONTAINERS and child_start < p+size:
            box.children=parse_boxes(data, child_start, p+size, depth+1)
        out.append(box); p += size
    return out

def walk(boxes):
    for b in boxes:
        yield b
        yield from walk(b.children)

def find_path(box, path):
    cur=[box]
    for typ in path:
        nxt=[]
        for c in cur:
            nxt += [x for x in c.children if x.type==typ]
        cur=nxt
    return cur

def hdlr_type(trak, data):
    hs=find_path(trak, [b'mdia', b'hdlr'])
    if not hs: return None
    h=hs[0]
    # hdlr fullbox: version/flags(4), pre_defined(4), handler_type(4)
    return bytes(data[h.start+h.header+8:h.start+h.header+12])

def get_child(trak, path):
    r=find_path(trak,path)
    return r[0] if r else None

def parse_stsz(data, box):
    p=box.start+box.header
    sample_size=be32(data,p+4); count=be32(data,p+8)
    if sample_size:
        return [sample_size]*count, p+12
    arr=[]; q=p+12
    for i in range(count): arr.append(be32(data,q+4*i))
    return arr, q

def parse_stco(data, box):
    p=box.start+box.header
    count=be32(data,p+4); q=p+8
    return [be32(data,q+4*i) for i in range(count)], q, 4

def parse_co64(data, box):
    p=box.start+box.header
    count=be32(data,p+4); q=p+8
    return [be64(data,q+8*i) for i in range(count)], q, 8

def parse_stsc(data, box):
    p=box.start+box.header
    count=be32(data,p+4); q=p+8; entries=[]
    for i in range(count):
        entries.append((be32(data,q+12*i), be32(data,q+12*i+4), be32(data,q+12*i+8)))
    return entries

def sample_offsets(sizes, chunk_offsets, stsc):
    offs=[]; idx=0
    stsc=sorted(stsc)
    for ci,co in enumerate(chunk_offsets, start=1):
        # find active stsc entry
        active=stsc[0]
        for e in stsc:
            if e[0] <= ci: active=e
            else: break
        spc=active[1]
        o=co
        for _ in range(spc):
            if idx>=len(sizes): break
            offs.append(o); o += sizes[idx]; idx += 1
    return offs

def avcc_repack_sample(sample):
    out=bytearray(); p=0; removed=0; kept=0
    n=len(sample)
    while p+4<=n:
        sz=be32(sample,p); p += 4
        if sz==0:
            # keep zero-size as-is, rare
            out += b'\x00\x00\x00\x00'; continue
        if p+sz>n:
            # invalid packet; keep original sample to avoid making it worse
            return sample, 0, 0, 0, False
        nal=sample[p:p+sz]; p += sz
        typ=nal[0] & 0x1f if nal else -1
        if typ in REMOVE_NAL_TYPES:
            removed += 1
            continue
        out += struct.pack('>I', len(nal)); out += nal; kept += 1
    if p != n:
        # trailing garbage: keep it exactly
        out += sample[p:]
    delta = n - len(out)
    return bytes(out), delta, removed, kept, True

def patch_tkhd_matrix(data):
    pos=data.find(b'tkhd')
    if pos<4: return False
    start=pos-4; size=be32(data,start)
    if size<84 or data[start+8] != 0: return False
    matrix_start=start+48
    if matrix_start+36 <= start+size:
        data[matrix_start+4:matrix_start+8]=b'\x00\x00\x00\x01'; return True
    return False

def patch_btrt(data, bitrate):
    pos=data.find(b'btrt')
    if pos<4: return False
    start=pos-4
    if be32(data,start)!=20: return False
    wr32(data,start+12,bitrate); wr32(data,start+16,bitrate); return True

def get_video_bitrate_from_packets(ffprobe, file_path):
    p=subprocess.run([ffprobe,'-v','error','-select_streams','v:0','-show_packets','-show_entries','packet=size','-of','json',file_path], stdout=subprocess.PIPE, stderr=subprocess.STDOUT, text=True)
    packets=json.loads(p.stdout).get('packets',[]) if p.returncode==0 else []
    total=sum(int(x.get('size',0)) for x in packets)
    info=ffprobe_json(ffprobe,file_path); v=next(s for s in info['streams'] if s.get('codec_type')=='video')
    dur=int(v.get('duration_ts') or 0); tb=v.get('time_base','1/90000'); num,den=map(int,tb.split('/'))
    if dur and den: return int(round(total*8/(dur*num/den)))
    return int(v.get('bit_rate') or 0)

def safe_avcc_repack_file(path):
    data=bytearray(Path(path).read_bytes())
    boxes=parse_boxes(data)
    moov=next((b for b in boxes if b.type==b'moov'), None)
    mdat=next((b for b in boxes if b.type==b'mdat'), None)
    if not moov or not mdat: die('moov/mdat was not found')
    traks=[b for b in moov.children if b.type==b'trak']
    video_trak=next((t for t in traks if hdlr_type(t,data)==b'vide'), None)
    if not video_trak: die('video track was not found')
    stsz_box=get_child(video_trak,[b'mdia',b'minf',b'stbl',b'stsz'])
    stsc_box=get_child(video_trak,[b'mdia',b'minf',b'stbl',b'stsc'])
    stco_box=get_child(video_trak,[b'mdia',b'minf',b'stbl',b'stco']) or get_child(video_trak,[b'mdia',b'minf',b'stbl',b'co64'])
    if not (stsz_box and stsc_box and stco_box): die('video stsz/stsc/stco was not found')
    vsizes, vsizes_pos=parse_stsz(data, stsz_box)
    vchunks, _, _ = parse_stco(data, stco_box) if stco_box.type==b'stco' else parse_co64(data, stco_box)
    vstsc=parse_stsc(data, stsc_box)
    voffs=sample_offsets(vsizes, vchunks, vstsc)
    if len(voffs)!=len(vsizes): print(f'[WARN] video offsets {len(voffs)} != sample count {len(vsizes)}')

    events=[]; video_map={}
    removed_count=0; bad_count=0; total_delta=0
    for i,(off,sz) in enumerate(zip(voffs,vsizes)):
        sample=bytes(data[off:off+sz])
        new,delta,rem,kept,ok=avcc_repack_sample(sample)
        if not ok: bad_count += 1; new=sample; delta=0
        if delta:
            video_map[off]=(sz,new)
            vsizes[i]=len(new)
            events.append((off+sz, delta))
            total_delta += delta; removed_count += rem

    if not total_delta:
        print('[INFO] AUD/SEI not found or already removed')
        return data, {'removed_nal':0,'bytes_removed':0,'bad_samples':bad_count}

    # patch video stsz table in moov
    for i,sz in enumerate(vsizes): wr32(data, vsizes_pos+4*i, sz)

    # prepare cumulative shift function
    events.sort(); positions=[]; cums=[]; c=0
    for pos,d in events:
        c += d; positions.append(pos); cums.append(c)
    def shift_before(offset):
        j=bisect.bisect_right(positions, offset)
        return cums[j-1] if j else 0

    # patch all stco/co64 offsets in every track
    for b in walk([moov]):
        if b.type==b'stco':
            offs,pos,w=parse_stco(data,b)
            for i,o in enumerate(offs): wr32(data,pos+4*i,o-shift_before(o))
        elif b.type==b'co64':
            offs,pos,w=parse_co64(data,b)
            for i,o in enumerate(offs): wr64(data,pos+8*i,o-shift_before(o))

    # rebuild full file bytes: keep all non-mdat bytes (with patched moov), rebuild mdat payload sample-by-sample
    old_payload_start=mdat.start+mdat.header; old_payload_end=mdat.end
    out=bytearray()
    out += data[:old_payload_start]
    p=old_payload_start
    # write payload, replacing video samples at known offsets
    for off in sorted(video_map):
        old_sz,new=video_map[off]
        if off < p: continue
        out += data[p:off]
        out += new
        p = off + old_sz
    out += data[p:old_payload_end]
    out += data[old_payload_end:]
    # patch mdat size at same start in output (moov before mdat, no before-size change)
    new_mdat_size=(mdat.end-mdat.start)-total_delta
    if mdat.header==8: wr32(out, mdat.start, new_mdat_size)
    else: wr64(out, mdat.start+8, new_mdat_size)
    return out, {'removed_nal':removed_count,'bytes_removed':total_delta,'bad_samples':bad_count}

def parse_args(argv):
    if len(argv) < 2:
        return None
    src = argv[1]
    out = None
    ffmpeg = None
    ffprobe = None
    i = 2
    while i < len(argv):
        arg = argv[i]
        if arg == "--ffmpeg" and i + 1 < len(argv):
            ffmpeg = argv[i + 1]
            i += 2
            continue
        if arg == "--ffprobe" and i + 1 < len(argv):
            ffprobe = argv[i + 1]
            i += 2
            continue
        if out is None and not arg.startswith("--"):
            out = arg
        i += 1
    return {"src": src, "out": out, "ffmpeg": ffmpeg, "ffprobe": ffprobe}

def main():
    parsed = parse_args(sys.argv)
    if not parsed:
        print("Usage: python en_new_binary_patcher_v5.py input.mp4 [output.mp4] [--ffmpeg path] [--ffprobe path]")
        return
    src=Path(parsed["src"]).resolve()
    if not src.exists(): die('File not found: '+str(src))
    ffmpeg=find_tool('ffmpeg', parsed["ffmpeg"]); ffprobe=find_tool('ffprobe', parsed["ffprobe"])
    out=Path(parsed["out"]).resolve() if parsed["out"] else src.with_name(src.stem+'_EN_V5.mp4')
    tmp=out.with_name(out.stem+'.tmp'+out.suffix)
    for f in (tmp,out):
        if f.exists(): f.unlink()
    # V5: first clean ffmpeg remux WITHOUT filter_units; then Python safely removes NALs and fixes tables.
    
    # V5 stream mapping:
    # - copy the first video as stream 0
    # - copy ALL audio tracks if they exist
    # - no audio re-encode, no resample, no -shortest => audio/duration are not intentionally compressed
    info0=ffprobe_json(ffprobe,str(src))
    v0=next((x for x in info0.get('streams',[]) if x.get('codec_type')=='video'), None)
    if not v0: die('No video stream in file')
    if v0.get('codec_name') != 'h264':
        die('V5 supports only H.264/AVC for no-reencode mode. Codec: '+str(v0.get('codec_name')))
    cmd=[ffmpeg,'-y','-v','error','-i',str(src),
         '-map','0:v:0','-map','0:a?',
         '-c','copy',
         '-video_track_timescale','90000',
         '-map_metadata','-1',
         '-brand','isom',
         '-movflags','+faststart',
         str(tmp)]
    run(cmd)
    packed,stats=safe_avcc_repack_file(tmp)
    out.write_bytes(packed)
    tmp.unlink(missing_ok=True)
    # patch post fields
    data=bytearray(out.read_bytes())
    if patch_tkhd_matrix(data): print('[OK] tkhd matrix patched')
    br=get_video_bitrate_from_packets(ffprobe,str(out))
    if patch_btrt(data,br): print(f'[OK] btrt patched: {br}')
    out.write_bytes(data)
    # validate decode read
    p=subprocess.run([ffmpeg,'-v','error','-i',str(out),'-f','null','-'], stdout=subprocess.PIPE, stderr=subprocess.STDOUT, text=True)
    if p.stdout.strip():
        print('[WARN] ffmpeg validation output:')
        print(p.stdout[:2000])
    else:
        print('[OK] validation: no decoder errors')
    print('[DONE]', out)
    print('[INFO] V5 copies audio without re-encode and does not use -shortest.')

if __name__=='__main__': main()

