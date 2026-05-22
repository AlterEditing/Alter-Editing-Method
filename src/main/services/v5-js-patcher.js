const fs = require("fs");
const path = require("path");

const REMOVE_NAL_TYPES = new Set([6, 9]); // SEI, AUD
const CONTAINERS = new Set(["moov", "trak", "mdia", "minf", "stbl", "edts", "udta", "meta", "ilst", "dinf", "avc1", "mp4a"]);

function be32(buf, o) {
  return buf.readUInt32BE(o);
}
function wr32(buf, o, v) {
  buf.writeUInt32BE(v >>> 0, o);
}
function be64(buf, o) {
  return Number(buf.readBigUInt64BE(o));
}
function wr64(buf, o, v) {
  buf.writeBigUInt64BE(BigInt(v), o);
}

function parseBoxes(data, start = 0, end = data.length) {
  const out = [];
  let p = start;
  while (p + 8 <= end) {
    let size = be32(data, p);
    const type = data.toString("ascii", p + 4, p + 8);
    let header = 8;
    if (size === 1) {
      if (p + 16 > end) break;
      size = be64(data, p + 8);
      header = 16;
    } else if (size === 0) {
      size = end - p;
    }
    if (size < header || p + size > end) break;
    const box = { type, start: p, header, end: p + size, children: [] };
    let childStart = p + header;
    if (type === "meta") childStart += 4;
    else if (type === "avc1" || type === "mp4a") childStart = p + header + (type === "avc1" ? 78 : 28);
    if (CONTAINERS.has(type) && childStart < p + size) box.children = parseBoxes(data, childStart, p + size);
    out.push(box);
    p += size;
  }
  return out;
}

function walk(boxes, fn) {
  for (const b of boxes) {
    fn(b);
    walk(b.children, fn);
  }
}

function findPath(root, pathTypes) {
  let cur = [root];
  for (const t of pathTypes) {
    const nxt = [];
    for (const c of cur) nxt.push(...c.children.filter((x) => x.type === t));
    cur = nxt;
  }
  return cur;
}

function parseStsz(data, box) {
  const p = box.start + box.header;
  const sampleSize = be32(data, p + 4);
  const count = be32(data, p + 8);
  if (sampleSize) return { sizes: Array(count).fill(sampleSize), tablePos: p + 12 };
  const sizes = [];
  let q = p + 12;
  for (let i = 0; i < count; i += 1) sizes.push(be32(data, q + i * 4));
  return { sizes, tablePos: q };
}
function parseStco(data, box) {
  const p = box.start + box.header;
  const count = be32(data, p + 4);
  const q = p + 8;
  const arr = [];
  for (let i = 0; i < count; i += 1) arr.push(be32(data, q + i * 4));
  return { offsets: arr, tablePos: q };
}
function parseCo64(data, box) {
  const p = box.start + box.header;
  const count = be32(data, p + 4);
  const q = p + 8;
  const arr = [];
  for (let i = 0; i < count; i += 1) arr.push(be64(data, q + i * 8));
  return { offsets: arr, tablePos: q };
}
function parseStsc(data, box) {
  const p = box.start + box.header;
  const count = be32(data, p + 4);
  const q = p + 8;
  const entries = [];
  for (let i = 0; i < count; i += 1) entries.push([be32(data, q + i * 12), be32(data, q + i * 12 + 4), be32(data, q + i * 12 + 8)]);
  return entries;
}
function sampleOffsets(sizes, chunkOffsets, stsc) {
  const offs = [];
  let idx = 0;
  for (let ci = 1; ci <= chunkOffsets.length; ci += 1) {
    const co = chunkOffsets[ci - 1];
    let active = stsc[0];
    for (const e of stsc) {
      if (e[0] <= ci) active = e;
      else break;
    }
    let o = co;
    for (let k = 0; k < active[1]; k += 1) {
      if (idx >= sizes.length) break;
      offs.push(o);
      o += sizes[idx];
      idx += 1;
    }
  }
  return offs;
}

function avccRepackSample(sample) {
  const out = [];
  let p = 0;
  let removed = 0;
  while (p + 4 <= sample.length) {
    const sz = be32(sample, p);
    p += 4;
    if (sz === 0) {
      out.push(Buffer.from([0, 0, 0, 0]));
      continue;
    }
    if (p + sz > sample.length) return { sample, delta: 0, removed, ok: false };
    const nal = sample.subarray(p, p + sz);
    p += sz;
    const typ = nal.length ? nal[0] & 0x1f : -1;
    if (REMOVE_NAL_TYPES.has(typ)) {
      removed += 1;
      continue;
    }
    const hdr = Buffer.alloc(4);
    hdr.writeUInt32BE(nal.length, 0);
    out.push(hdr, nal);
  }
  if (p < sample.length) out.push(sample.subarray(p));
  const packed = Buffer.concat(out);
  return { sample: packed, delta: sample.length - packed.length, removed, ok: true };
}

function patchTkhdMatrix(data) {
  const pos = data.indexOf(Buffer.from("tkhd"));
  if (pos < 4) return;
  const start = pos - 4;
  if (be32(data, start) < 84 || data[start + 8] !== 0) return;
  const matrixStart = start + 48;
  if (matrixStart + 36 <= start + be32(data, start)) data.set(Buffer.from([0, 0, 0, 1]), matrixStart + 4);
}

function patchBtrt(data, bitrate) {
  const pos = data.indexOf(Buffer.from("btrt"));
  if (pos < 4) return;
  const start = pos - 4;
  if (be32(data, start) !== 20) return;
  wr32(data, start + 12, bitrate);
  wr32(data, start + 16, bitrate);
}

function shiftBefore(events, offset) {
  let s = 0;
  for (const [pos, delta] of events) {
    if (pos <= offset) s += delta;
    else break;
  }
  return s;
}

async function runV5JsPatcher({ inputPath, outputPath, runFfmpeg, runFfprobe }) {
  const probe = JSON.parse((await runFfprobe(["-v", "error", "-show_format", "-show_streams", "-of", "json", inputPath])).stdout || "{}");
  const v0 = (probe.streams || []).find((s) => s.codec_type === "video");
  if (!v0) throw new Error("No video stream in file");
  if (String(v0.codec_name) !== "h264") throw new Error(`V5 supports only H.264/AVC. Codec: ${v0.codec_name}`);

  const tmp = path.join(path.dirname(outputPath), `${path.parse(outputPath).name}.tmp${path.parse(outputPath).ext || ".mp4"}`);
  await runFfmpeg([
    "-y",
    "-v",
    "error",
    "-i",
    inputPath,
    "-map",
    "0:v:0",
    "-map",
    "0:a?",
    "-c",
    "copy",
    "-video_track_timescale",
    "90000",
    "-map_metadata",
    "-1",
    "-brand",
    "isom",
    "-movflags",
    "+faststart",
    tmp,
  ]);

  const data = fs.readFileSync(tmp);
  const mut = Buffer.from(data);
  const boxes = parseBoxes(mut);
  const moov = boxes.find((b) => b.type === "moov");
  const mdat = boxes.find((b) => b.type === "mdat");
  if (!moov || !mdat) throw new Error("moov/mdat was not found");

  // HEVC path: the render above already keeps HEVC, sets hvc1/90k/isom/clean metadata.
  // Do not run H.264 AVCC NAL repacker on HEVC samples.
  const traks = moov.children.filter((x) => x.type === "trak");
  let videoTrak = null;
  for (const t of traks) {
    const h = findPath(t, ["mdia", "hdlr"])[0];
    if (!h) continue;
    const handler = mut.toString("ascii", h.start + h.header + 8, h.start + h.header + 12);
    if (handler === "vide") {
      videoTrak = t;
      break;
    }
  }
  if (!videoTrak) throw new Error("video track was not found");

  const stszBox = findPath(videoTrak, ["mdia", "minf", "stbl", "stsz"])[0];
  const stscBox = findPath(videoTrak, ["mdia", "minf", "stbl", "stsc"])[0];
  const stcoBox = findPath(videoTrak, ["mdia", "minf", "stbl", "stco"])[0] || findPath(videoTrak, ["mdia", "minf", "stbl", "co64"])[0];
  if (!stszBox || !stscBox || !stcoBox) throw new Error("video stsz/stsc/stco was not found");

  const { sizes, tablePos } = parseStsz(mut, stszBox);
  const chunk = stcoBox.type === "stco" ? parseStco(mut, stcoBox) : parseCo64(mut, stcoBox);
  const stsc = parseStsc(mut, stscBox);
  const voffs = sampleOffsets(sizes, chunk.offsets, stsc);

  const videoMap = new Map();
  const events = [];
  let totalDelta = 0;
  for (let i = 0; i < Math.min(voffs.length, sizes.length); i += 1) {
    const off = voffs[i];
    const sz = sizes[i];
    const sample = mut.subarray(off, off + sz);
    const r = avccRepackSample(sample);
    if (!r.ok || !r.delta) continue;
    videoMap.set(off, { oldSize: sz, sample: r.sample });
    sizes[i] = r.sample.length;
    events.push([off + sz, r.delta]);
    totalDelta += r.delta;
  }

  if (totalDelta > 0) {
    for (let i = 0; i < sizes.length; i += 1) wr32(mut, tablePos + i * 4, sizes[i]);
    events.sort((a, b) => a[0] - b[0]);
    walk([moov], (b) => {
      if (b.type === "stco") {
        const x = parseStco(mut, b);
        x.offsets.forEach((o, i) => wr32(mut, x.tablePos + i * 4, o - shiftBefore(events, o)));
      } else if (b.type === "co64") {
        const x = parseCo64(mut, b);
        x.offsets.forEach((o, i) => wr64(mut, x.tablePos + i * 8, o - shiftBefore(events, o)));
      }
    });
  }

  const payloadStart = mdat.start + mdat.header;
  const payloadEnd = mdat.end;
  const out = [];
  out.push(mut.subarray(0, payloadStart));
  let p = payloadStart;
  const keys = Array.from(videoMap.keys()).sort((a, b) => a - b);
  for (const off of keys) {
    const { oldSize, sample } = videoMap.get(off);
    if (off < p) continue;
    out.push(mut.subarray(p, off));
    out.push(sample);
    p = off + oldSize;
  }
  out.push(mut.subarray(p, payloadEnd));
  out.push(mut.subarray(payloadEnd));
  const packed = Buffer.concat(out);

  if (totalDelta > 0) {
    const newMdatSize = (mdat.end - mdat.start) - totalDelta;
    if (mdat.header === 8) wr32(packed, mdat.start, newMdatSize);
    else wr64(packed, mdat.start + 8, newMdatSize);
  }

  patchTkhdMatrix(packed);
  const pprobe = JSON.parse((await runFfprobe(["-v", "error", "-show_format", "-show_streams", "-of", "json", tmp])).stdout || "{}");
  const vv = (pprobe.streams || []).find((s) => s.codec_type === "video");
  const br = Number(vv?.bit_rate || 0);
  if (br > 0) patchBtrt(packed, br);

  fs.writeFileSync(outputPath, packed);
  try {
    fs.rmSync(tmp, { force: true });
  } catch {}
}

module.exports = {
  runV5JsPatcher,
};
