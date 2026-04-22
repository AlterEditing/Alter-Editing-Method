import re
import shutil
import subprocess
import tempfile
from pathlib import Path
from typing import Callable, Optional

TIME_RE = re.compile(r"time=(\d+):(\d+):(\d+(?:\.\d+)?)")


class VideoPatcherEngine:
    """
    Ядро программы. Отвечает только за бизнес-логику: вызов ffmpeg и патчинг байтов.
    Не содержит зависимостей от графического интерфейса.
    """

    def __init__(self, size_per_sec_mb: float = 1.4):
        self.size_per_sec_mb = size_per_sec_mb

    def process(self, input_path: str, output_path: str,
                progress_callback: Optional[Callable[[int], None]] = None) -> str:
        """Основной метод обработки."""
        in_path = Path(input_path)
        out_path = Path(output_path)

        self._require_tools()
        duration = self._get_duration(in_path, progress_callback)

        target_size_mb = duration * self.size_per_sec_mb
        total_kbps = (target_size_mb * 8192) / duration
        audio_kbps = 128.0
        video_kbps = max(300.0, total_kbps - audio_kbps)

        with tempfile.TemporaryDirectory() as td:
            temp_output = Path(td) / 'rendered.mp4'
            self._run_ffmpeg(in_path, temp_output, duration, video_kbps, audio_kbps, progress_callback)

            if progress_callback:
                progress_callback(97)

            self._patch_first_elst(temp_output, out_path)

        if progress_callback:
            progress_callback(100)

        return str(out_path)

    def _require_tools(self) -> None:
        if shutil.which('ffmpeg') is None:
            raise RuntimeError('ffmpeg не найден в PATH.')
        if shutil.which('ffprobe') is None:
            raise RuntimeError('ffprobe не найден в PATH.')

    def _get_duration(self, path: Path, progress_callback: Optional[Callable[[int], None]]) -> float:
        if progress_callback:
            progress_callback(2)

        cmd = [
            'ffprobe', '-v', 'error',
            '-show_entries', 'format=duration',
            '-of', 'default=noprint_wrappers=1:nokey=1',
            str(path),
        ]
        result = subprocess.run(cmd, capture_output=True, text=True, check=True)
        value = result.stdout.strip()
        if not value:
            raise RuntimeError('Не удалось получить длительность через ffprobe.')
        return float(value)

    def _run_ffmpeg(self, input_path: Path, temp_output: Path, duration: float, video_kbps: float, audio_kbps: float,
                    progress_callback: Optional[Callable[[int], None]]) -> None:
        if progress_callback:
            progress_callback(5)

        cmd = [
            'ffmpeg', '-y', '-i', str(input_path),
            '-c:v', 'libx264', '-preset', 'medium',
            '-b:v', f'{int(video_kbps)}k', '-maxrate', f'{int(video_kbps)}k',
            '-bufsize', f'{int(video_kbps * 2)}k', '-pix_fmt', 'yuv420p',
            '-movflags', '+faststart',
            '-c:a', 'aac', '-b:a', f'{int(audio_kbps)}k',
            str(temp_output),
        ]
        self._run_with_progress(cmd, duration, 5, 95, progress_callback)

    def _run_with_progress(self, cmd: list[str], duration: float, start_pct: int, end_pct: int,
                           progress_callback: Optional[Callable[[int], None]]) -> None:
        proc = subprocess.Popen(
            cmd, stdout=subprocess.DEVNULL, stderr=subprocess.PIPE,
            text=True, universal_newlines=True,
        )
        if proc.stderr is None:
            raise RuntimeError('Не удалось открыть stderr ffmpeg.')

        last_pct = start_pct
        for line in proc.stderr:
            match = TIME_RE.search(line)
            if not match or duration <= 0:
                continue
            h, m, s = match.groups()
            seconds = int(h) * 3600 + int(m) * 60 + float(s)
            ratio = max(0.0, min(1.0, seconds / duration))
            pct = start_pct + int((end_pct - start_pct) * ratio)

            if pct != last_pct and progress_callback:
                progress_callback(pct)
                last_pct = pct

        rc = proc.wait()
        if rc != 0:
            raise RuntimeError(f'ffmpeg завершился с кодом {rc}.')

    def _patch_first_elst(self, src: Path, dst: Path) -> None:
        data = bytearray(src.read_bytes())
        patched = False
        for i in range(len(data) - 12):
            if data[i:i + 4] == b'elst' and data[i + 4:i + 8] == b'\x00\x00\x00\x00':
                data[i + 8:i + 12] = b'\x10\x00\x00\x01'
                patched = True
                break
        if not patched:
            raise RuntimeError('Подходящий elst не найден для патча.')
        dst.write_bytes(data)