import os
import re
import subprocess
import sys
import tempfile
from pathlib import Path

from PySide6.QtCore import QThread, Signal

TIME_RE = re.compile(r"time=(\d+):(\d+):(\d+(?:\.\d+)?)")


def resource_path(relative_path: str) -> str:
    try:
        base_path = sys._MEIPASS  # type: ignore[attr-defined]
    except Exception:
        base_path = os.path.abspath(".")
    return os.path.join(base_path, relative_path)


class PatchWorker(QThread):
    progress_changed = Signal(int)
    finished_ok = Signal(str)
    failed = Signal(str)

    def __init__(self, input_path: str, output_path: str, size_per_sec_mb: float = 1.4) -> None:
        super().__init__()
        self.input_path = Path(input_path)
        self.output_path = Path(output_path)
        self.size_per_sec_mb = size_per_sec_mb
        self.ffmpeg_path = resource_path("ffmpeg.exe")
        self.ffprobe_path = resource_path("ffprobe.exe")

    def run(self) -> None:
        try:
            self._require_tools()
            duration = self._get_duration(self.input_path)
            if duration <= 0:
                raise RuntimeError("Некорректная длительность файла.")

            target_size_mb = duration * self.size_per_sec_mb
            total_kbps = (target_size_mb * 8192) / duration
            audio_kbps = 128.0
            video_kbps = max(300.0, total_kbps - audio_kbps)

            with tempfile.TemporaryDirectory() as td:
                temp_output = Path(td) / "rendered.mp4"
                self._run_ffmpeg(self.input_path, temp_output, duration, video_kbps, audio_kbps)
                self.progress_changed.emit(97)
                self._patch_first_elst(temp_output, self.output_path)

            self.progress_changed.emit(100)
            self.finished_ok.emit(str(self.output_path))
        except Exception as exc:
            self.failed.emit(str(exc))

    def _require_tools(self) -> None:
        if not Path(self.ffmpeg_path).exists():
            raise RuntimeError("ffmpeg.exe не найден рядом с программой.")
        if not Path(self.ffprobe_path).exists():
            raise RuntimeError("ffprobe.exe не найден рядом с программой.")

    def _get_duration(self, path: Path) -> float:
        self.progress_changed.emit(2)
        cmd = [
            self.ffprobe_path, "-v", "error",
            "-show_entries", "format=duration",
            "-of", "default=noprint_wrappers=1:nokey=1",
            str(path),
        ]
        result = subprocess.run(cmd, capture_output=True, text=True, check=True)
        value = result.stdout.strip()
        if not value:
            raise RuntimeError("Не удалось получить длительность через ffprobe.")
        return float(value)

    def _run_ffmpeg(
        self,
        input_path: Path,
        temp_output: Path,
        duration: float,
        video_kbps: float,
        audio_kbps: float,
    ) -> None:
        self.progress_changed.emit(5)
        cmd = [
            self.ffmpeg_path, "-y", "-i", str(input_path),
            "-c:v", "libx264",
            "-preset", "medium",
            "-b:v", f"{int(video_kbps)}k",
            "-maxrate", f"{int(video_kbps)}k",
            "-bufsize", f"{int(video_kbps * 2)}k",
            "-pix_fmt", "yuv420p",
            "-movflags", "+faststart",
            "-c:a", "aac",
            "-b:a", f"{int(audio_kbps)}k",
            str(temp_output),
        ]
        self._run_with_progress(cmd, duration, 5, 95)

    def _run_with_progress(self, cmd: list[str], duration: float, start_pct: int, end_pct: int) -> None:
        proc = subprocess.Popen(
            cmd,
            stdout=subprocess.DEVNULL,
            stderr=subprocess.PIPE,
            text=True,
            universal_newlines=True,
        )
        if proc.stderr is None:
            raise RuntimeError("Не удалось открыть stderr ffmpeg.")

        last_pct = start_pct
        for line in proc.stderr:
            match = TIME_RE.search(line)
            if not match or duration <= 0:
                continue
            h, m, s = match.groups()
            seconds = int(h) * 3600 + int(m) * 60 + float(s)
            ratio = max(0.0, min(1.0, seconds / duration))
            pct = start_pct + int((end_pct - start_pct) * ratio)
            if pct != last_pct:
                self.progress_changed.emit(pct)
                last_pct = pct

        rc = proc.wait()
        if rc != 0:
            raise RuntimeError(f"ffmpeg завершился с кодом {rc}.")

        if not temp_output.exists():
            raise RuntimeError("ffmpeg не создал выходной файл.")

    def _patch_first_elst(self, src: Path, dst: Path) -> None:
        data = bytearray(src.read_bytes())
        patched = False
        for i in range(len(data) - 12):
            if data[i:i + 4] == b"elst" and data[i + 4:i + 8] == b"\x00\x00\x00\x00":
                data[i + 8:i + 12] = b"\x10\x00\x00\x01"
                patched = True
                break

        if not patched:
            raise RuntimeError("Подходящий elst не найден для патча.")

        dst.write_bytes(data)
