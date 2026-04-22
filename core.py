import json
import os
import sys
import subprocess
from pathlib import Path

from PySide6.QtCore import QThread, Signal


APP_NAME = "Alter Editing Method"
DEFAULT_LANG = "en"
SUPPORTED_LANGS = {"ru", "en", "tr"}


_TRANSLATIONS = {
    "ru": {
        "file_not_found": "Файл не найден: {path}",
        "mp4_required": "Нужен именно MP4 файл.",
        "elst_not_found": "Подходящий elst не найден для патча.",
        "source_not_found": "Исходный файл не найден.",
        "select_mp4": "Выберите MP4 файл.",
        "ffmpeg_missing": "Встроенный ffmpeg не найден.",
        "ffprobe_missing": "Встроенный ffprobe не найден.",
        "cli_description": "GUI video patcher + прямой режим elst patch",
        "cli_input_help": "Путь к MP4 для прямого patch-режима",
        "cli_output_help": "Путь выходного файла для прямого patch-режима",
        "cli_patch_only_help": "Запустить режим как patch.ps1/run.bat без GUI",
        "cli_specify_mp4": "Укажи путь к MP4 файлу.",
        "cli_done": "Готово: {path}",
    },
    "en": {
        "file_not_found": "File not found: {path}",
        "mp4_required": "MP4 file required.",
        "elst_not_found": "Suitable elst not found for patching.",
        "source_not_found": "Source file not found.",
        "select_mp4": "Select an MP4 file.",
        "ffmpeg_missing": "Embedded ffmpeg not found.",
        "ffprobe_missing": "Embedded ffprobe not found.",
        "cli_description": "GUI video patcher + direct elst patch mode",
        "cli_input_help": "Path to MP4 for direct patch mode",
        "cli_output_help": "Output file path for direct patch mode",
        "cli_patch_only_help": "Run as patch.ps1/run.bat mode without GUI",
        "cli_specify_mp4": "Specify the path to the MP4 file.",
        "cli_done": "Done: {path}",
    },
    "tr": {
        "file_not_found": "Dosya bulunamadı: {path}",
        "mp4_required": "MP4 dosyası gerekli.",
        "elst_not_found": "Yamalama için uygun elst bulunamadı.",
        "source_not_found": "Kaynak dosya bulunamadı.",
        "select_mp4": "Bir MP4 dosyası seçin.",
        "ffmpeg_missing": "Gömülü ffmpeg bulunamadı.",
        "ffprobe_missing": "Gömülü ffprobe bulunamadı.",
        "cli_description": "GUI video patcher + doğrudan elst yama modu",
        "cli_input_help": "Doğrudan yama modu için MP4 yolu",
        "cli_output_help": "Doğrudan yama modu için çıktı dosyası yolu",
        "cli_patch_only_help": "GUI olmadan patch.ps1/run.bat modu olarak çalıştır",
        "cli_specify_mp4": "MP4 dosyasının yolunu belirtin.",
        "cli_done": "Tamamlandı: {path}",
    },
}


def tr(key: str, lang: str | None = None, **kwargs) -> str:
    language = lang or get_app_language()
    table = _TRANSLATIONS.get(language, _TRANSLATIONS[DEFAULT_LANG])
    text = table.get(key, _TRANSLATIONS["en"].get(key, key))

    if kwargs:
        try:
            return text.format(**kwargs)
        except Exception:
            return text
    return text


def resource_path(relative_path: str) -> str:
    try:
        base_path = sys._MEIPASS  # type: ignore[attr-defined]
    except Exception:
        base_path = os.path.abspath(".")
    return os.path.join(base_path, relative_path)


def get_ffmpeg_path() -> str:
    return resource_path("ffmpeg.exe")


def get_ffprobe_path() -> str:
    return resource_path("ffprobe.exe")


def ensure_embedded_ffmpeg() -> None:
    if not Path(get_ffmpeg_path()).exists():
        raise FileNotFoundError(tr("ffmpeg_missing"))


def ensure_embedded_ffprobe() -> None:
    if not Path(get_ffprobe_path()).exists():
        raise FileNotFoundError(tr("ffprobe_missing"))


def _subprocess_flags() -> int:
    if os.name == "nt":
        return getattr(subprocess, "CREATE_NO_WINDOW", 0)
    return 0


def run_embedded_ffmpeg(args: list[str], check: bool = True) -> subprocess.CompletedProcess:
    ensure_embedded_ffmpeg()
    cmd = [get_ffmpeg_path(), *args]
    return subprocess.run(
        cmd,
        check=check,
        creationflags=_subprocess_flags(),
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE,
        text=True,
    )


def run_embedded_ffprobe(args: list[str], check: bool = True) -> subprocess.CompletedProcess:
    ensure_embedded_ffprobe()
    cmd = [get_ffprobe_path(), *args]
    return subprocess.run(
        cmd,
        check=check,
        creationflags=_subprocess_flags(),
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE,
        text=True,
    )


def appdata_dir() -> Path:
    appdata = os.getenv("APPDATA")
    if appdata:
        base = Path(appdata)
    else:
        base = Path.home() / "AppData" / "Roaming"

    path = base / APP_NAME
    path.mkdir(parents=True, exist_ok=True)
    return path


def settings_path() -> Path:
    return appdata_dir() / "settings.json"


def _default_settings() -> dict:
    return {"language": DEFAULT_LANG}


def load_settings() -> dict:
    path = settings_path()

    if not path.exists():
        data = _default_settings()
        save_settings(data)
        return data

    try:
        raw = json.loads(path.read_text(encoding="utf-8"))
        if not isinstance(raw, dict):
            raise ValueError("Settings root must be dict")
    except Exception:
        data = _default_settings()
        save_settings(data)
        return data

    lang = str(raw.get("language", DEFAULT_LANG)).lower().strip()
    if lang not in SUPPORTED_LANGS:
        raw["language"] = DEFAULT_LANG
        save_settings(raw)

    return raw


def save_settings(data: dict) -> None:
    path = settings_path()
    path.write_text(
        json.dumps(data, ensure_ascii=False, indent=2),
        encoding="utf-8",
    )


def get_app_language() -> str:
    data = load_settings()
    lang = str(data.get("language", DEFAULT_LANG)).lower().strip()
    return lang if lang in SUPPORTED_LANGS else DEFAULT_LANG


def set_app_language(lang: str) -> None:
    lang = (lang or "").lower().strip()
    if lang not in SUPPORTED_LANGS:
        lang = DEFAULT_LANG

    data = load_settings()
    data["language"] = lang
    save_settings(data)


def reset_app_language() -> None:
    data = load_settings()
    data["language"] = DEFAULT_LANG
    save_settings(data)


def patch_first_elst_bytes(src: Path, dst: Path) -> None:
    data = bytearray(src.read_bytes())
    patched = False

    for i in range(len(data) - 12):
        if data[i:i + 4] == b"elst" and data[i + 4:i + 8] == b"\x00\x00\x00\x00":
            data[i + 8:i + 12] = b"\x10\x00\x00\x01"
            patched = True
            break

    if not patched:
        raise RuntimeError(tr("elst_not_found"))

    dst.write_bytes(data)


def patch_ps1_mode(input_path: str, output_path: str | None = None) -> str:
    src = Path(input_path)

    if not src.exists():
        raise FileNotFoundError(tr("file_not_found", path=str(src)))

    if src.suffix.lower() != ".mp4":
        raise RuntimeError(tr("mp4_required"))

    if output_path:
        dst = Path(output_path)
    else:
        dst = src.with_name(f"{src.stem}_patched.mp4")

    patch_first_elst_bytes(src, dst)
    return str(dst)


class PatchWorker(QThread):
    progress_changed = Signal(int)
    finished_ok = Signal(str)
    failed = Signal(str)

    def __init__(self, input_path: str, output_path: str) -> None:
        super().__init__()
        self.input_path = Path(input_path)
        self.output_path = Path(output_path)

    def run(self) -> None:
        try:
            self.progress_changed.emit(5)

            if not self.input_path.exists():
                raise RuntimeError(tr("source_not_found"))

            if self.input_path.suffix.lower() != ".mp4":
                raise RuntimeError(tr("select_mp4"))

            self.progress_changed.emit(35)

            # Текущая логика проекта:
            patch_first_elst_bytes(self.input_path, self.output_path)

            # Если позже захочешь использовать встроенный ffmpeg,
            # то можешь заменить верхнюю строку на что-то вроде:
            #
            # run_embedded_ffmpeg([
            #     "-y",
            #     "-i", str(self.input_path),
            #     "-c:v", "copy",
            #     "-c:a", "copy",
            #     str(self.output_path),
            # ])

            self.progress_changed.emit(100)
            self.finished_ok.emit(str(self.output_path))

        except Exception as exc:
            self.failed.emit(str(exc))