import os
import random
import re
import shutil
import subprocess
import sys
import tempfile
from pathlib import Path

from PySide6.QtCore import QThread, Qt, QRectF, Signal, QTimer
from PySide6.QtGui import QColor, QFont, QIcon, QPainter, QPen, QLinearGradient
from PySide6.QtWidgets import (
    QApplication,
    QFileDialog,
    QLabel,
    QMainWindow,
    QMessageBox,
    QPushButton,
    QVBoxLayout,
    QWidget,
)

TIME_RE = re.compile(r"time=(\d+):(\d+):(\d+(?:\.\d+)?)")
#1
# Ручной сдвиг центрального блока (title + card + patch + footer)
#  20  -> ниже
# -20  -> выше
UI_BLOCK_OFFSET = 0



def resource_path(relative_path: str) -> str:
    try:
        base_path = sys._MEIPASS  # type: ignore[attr-defined]
    except Exception:
        base_path = os.path.abspath('.')
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

    def run(self) -> None:
        try:
            self._require_tools()
            duration = self._get_duration(self.input_path)
            target_size_mb = duration * self.size_per_sec_mb
            total_kbps = (target_size_mb * 8192) / duration
            audio_kbps = 128.0
            video_kbps = max(300.0, total_kbps - audio_kbps)

            with tempfile.TemporaryDirectory() as td:
                temp_output = Path(td) / 'rendered.mp4'
                self._run_ffmpeg(self.input_path, temp_output, duration, video_kbps, audio_kbps)
                self.progress_changed.emit(97)
                self._patch_first_elst(temp_output, self.output_path)

            self.progress_changed.emit(100)
            self.finished_ok.emit(str(self.output_path))
        except Exception as exc:
            self.failed.emit(str(exc))

    def _require_tools(self) -> None:
        if shutil.which('ffmpeg') is None:
            raise RuntimeError('ffmpeg не найден в PATH.')
        if shutil.which('ffprobe') is None:
            raise RuntimeError('ffprobe не найден в PATH.')

    def _get_duration(self, path: Path) -> float:
        self.progress_changed.emit(2)
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
            'ffmpeg', '-y', '-i', str(input_path),
            '-c:v', 'libx264',
            '-preset', 'medium',
            '-b:v', f'{int(video_kbps)}k',
            '-maxrate', f'{int(video_kbps)}k',
            '-bufsize', f'{int(video_kbps * 2)}k',
            '-pix_fmt', 'yuv420p',
            '-movflags', '+faststart',
            '-c:a', 'aac',
            '-b:a', f'{int(audio_kbps)}k',
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
            if pct != last_pct:
                self.progress_changed.emit(pct)
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


class ParticlesBackground(QWidget):
    def __init__(self) -> None:
        super().__init__()
        self.particles: list[dict[str, float]] = []
        self.timer = QTimer(self)
        self.timer.timeout.connect(self._tick)
        self.timer.start(16)
        self._ensure_particles()

    def resizeEvent(self, event) -> None:  # noqa: N802
        super().resizeEvent(event)
        self._ensure_particles(reset=True)

    def _ensure_particles(self, reset: bool = False) -> None:
        if self.width() <= 0 or self.height() <= 0:
            return
        count = 56
        if reset or not self.particles:
            self.particles = [self._new_particle(randomize_y=True) for _ in range(count)]
        else:
            while len(self.particles) < count:
                self.particles.append(self._new_particle(randomize_y=True))

    def _new_particle(self, randomize_y: bool = False) -> dict[str, float]:
        w = max(1, self.width())
        h = max(1, self.height())
        return {
            'x': random.uniform(10, w - 10),
            'y': random.uniform(-h, h) if randomize_y else random.uniform(-20, -4),
            'speed': random.uniform(0.18, 0.62),
            'size': random.uniform(1.1, 2.6),
            'alpha': random.uniform(0.16, 0.56),
            'drift': random.uniform(-0.08, 0.08),
        }

    def _tick(self) -> None:
        h = max(1, self.height())
        w = max(1, self.width())
        for idx, p in enumerate(self.particles):
            p['y'] += p['speed']
            p['x'] += p['drift']
            if p['x'] < 8:
                p['x'] = 8
                p['drift'] *= -1
            elif p['x'] > w - 8:
                p['x'] = w - 8
                p['drift'] *= -1
            if p['y'] > h + 6:
                self.particles[idx] = self._new_particle(randomize_y=False)
        self.update()

    def paintEvent(self, event) -> None:  # noqa: N802
        painter = QPainter(self)
        painter.setRenderHint(QPainter.Antialiasing)

        grad = QLinearGradient(0, 0, 0, self.height())
        grad.setColorAt(0.0, QColor('#02050a'))
        grad.setColorAt(0.55, QColor('#03060b'))
        grad.setColorAt(1.0, QColor('#02050a'))
        painter.fillRect(self.rect(), grad)

        painter.setPen(Qt.NoPen)
        for p in self.particles:
            alpha = int(255 * p['alpha'])
            size = p['size']
            x = p['x']
            y = p['y']

            glow_size = size * 2.8
            painter.setBrush(QColor(255, 255, 255, max(0, int(alpha * 0.18))))
            painter.drawEllipse(QRectF(x - glow_size / 2, y - glow_size / 2, glow_size, glow_size))

            painter.setBrush(QColor(247, 249, 255, alpha))
            painter.drawEllipse(QRectF(x - size / 2, y - size / 2, size, size))

        painter.end()


class Divider(QWidget):
    def __init__(self, width: int = 300) -> None:
        super().__init__()
        self.setFixedSize(width, 2)

    def paintEvent(self, event) -> None:  # noqa: N802
        painter = QPainter(self)
        painter.setRenderHint(QPainter.Antialiasing)
        painter.setPen(Qt.NoPen)
        painter.setBrush(QColor(255, 255, 255, 28))
        painter.drawRoundedRect(QRectF(0, 0, self.width(), 1.15), 1, 1)
        painter.end()


class UploadCard(QWidget):
    clicked = Signal()

    def __init__(self) -> None:
        super().__init__()
        self.setFixedSize(300, 138)
        self.setCursor(Qt.PointingHandCursor)
        self.hovered = False
        self.busy = False
        self.progress = 0
        self.filename = 'Click to select video'

    def set_progress(self, value: int) -> None:
        self.progress = max(0, min(100, value))
        self.update()

    def set_busy(self, busy: bool) -> None:
        self.busy = busy
        self.update()

    def set_filename(self, name: str) -> None:
        self.filename = name
        self.update()

    def enterEvent(self, event) -> None:  # noqa: N802
        self.hovered = True
        self.update()
        super().enterEvent(event)

    def leaveEvent(self, event) -> None:  # noqa: N802
        self.hovered = False
        self.update()
        super().leaveEvent(event)

    def mousePressEvent(self, event) -> None:  # noqa: N802
        if event.button() == Qt.LeftButton and not self.busy:
            self.clicked.emit()
        super().mousePressEvent(event)

    def paintEvent(self, event) -> None:  # noqa: N802
        painter = QPainter(self)
        painter.setRenderHint(QPainter.Antialiasing)

        outer = QRectF(1.5, 1.5, self.width() - 3, self.height() - 3)
        inner = QRectF(18.0, 20.0, self.width() - 36.0, self.height() - 40.0)

        bg = QColor('#060910')
        outer_border = QColor(255, 255, 255, 34)
        inner_border = QColor(255, 255, 255, 42)
        arrow_color = QColor('#eef2fa')
        text_color = QColor('#9ea8ba')

        if self.hovered and not self.busy:
            bg = QColor('#070b12')
            outer_border = QColor(255, 255, 255, 48)
            inner_border = QColor(255, 255, 255, 58)

        painter.setPen(QPen(outer_border, 1.1))
        painter.setBrush(bg)
        painter.drawRoundedRect(outer, 22, 22)

        dash_pen = QPen(inner_border, 1.0)
        dash_pen.setDashPattern([8, 7])
        painter.setPen(dash_pen)
        painter.setBrush(Qt.NoBrush)
        painter.drawRoundedRect(inner, 18, 18)

        if self.progress > 0:
            progress_w = (inner.width() - 12) * (self.progress / 100.0)
            progress_rect = QRectF(inner.left() + 6, outer.bottom() - 10, progress_w, 3.0)
            painter.setPen(Qt.NoPen)
            painter.setBrush(QColor(255, 255, 255, 76))
            painter.drawRoundedRect(progress_rect, 2, 2)

        icon_font = QFont('Segoe UI Symbol', 22)
        painter.setFont(icon_font)
        painter.setPen(arrow_color)
        painter.drawText(QRectF(0, 47, self.width(), 22), Qt.AlignHCenter | Qt.AlignVCenter, '↥')

        text_font = QFont('Segoe UI', 10)
        text_font.setWeight(QFont.Medium)
        painter.setFont(text_font)
        painter.setPen(text_color)
        painter.drawText(QRectF(22, 75, self.width() - 44, 24), Qt.AlignCenter, self.filename)

        painter.end()


class PatchButton(QPushButton):
    def __init__(self) -> None:
        super().__init__('PATCH')
        self.setCursor(Qt.PointingHandCursor)
        self.setFixedSize(166, 48)
        self.setFlat(True)
        self.setStyleSheet(
            '''
            QPushButton {
                background-color: rgba(8, 11, 18, 232);
                color: #f2f5fb;
                border: 1px solid rgba(255, 255, 255, 36);
                border-radius: 16px;
                font-family: 'Segoe UI';
                font-size: 15px;
                font-weight: 600;
                letter-spacing: 2px;
                padding-bottom: 1px;
            }
            QPushButton:hover {
                background-color: rgba(10, 14, 22, 238);
                border: 1px solid rgba(255, 255, 255, 54);
            }
            QPushButton:pressed {
                background-color: rgba(6, 8, 14, 236);
            }
            QPushButton:disabled {
                color: rgba(242, 245, 251, 120);
                border: 1px solid rgba(255, 255, 255, 22);
            }
            '''
        )


class MainWindow(QMainWindow):
    def __init__(self) -> None:
        super().__init__()
        self.setWindowTitle('pewpew')
        self.setFixedSize(394, 675)
        try:
            self.setWindowIcon(QIcon(resource_path('icon.ico')))
        except Exception:
            pass

        self.input_path = ''
        self.output_path = ''
        self.worker: PatchWorker | None = None

        self.bg = ParticlesBackground()
        self.setCentralWidget(self.bg)

        self.root_layout = QVBoxLayout(self.bg)
        self.root_layout.setContentsMargins(28, 26, 28, 22)
        self.root_layout.setSpacing(0)

        self.header = QLabel('Editing - Easy Patcher')
        self.header.setStyleSheet(
            "color: rgba(245,248,255,220); font-family: 'Consolas'; font-size: 12px; letter-spacing: 1px;"
        )
        self.root_layout.addWidget(self.header, alignment=Qt.AlignLeft)
        self.root_layout.addSpacing(14)
        self.root_layout.addWidget(Divider(), alignment=Qt.AlignHCenter)

        # Базовые отступы + ручной сдвиг через UI_BLOCK_OFFSET
        top_gap = max(0, 72 + UI_BLOCK_OFFSET)
        bottom_gap = max(0, 108 - UI_BLOCK_OFFSET)
        footer_gap = max(0, 22 - max(0, UI_BLOCK_OFFSET // 2))

        self.root_layout.addSpacing(top_gap)

        self.title = QLabel('Video Patcher')
        self.title.setAlignment(Qt.AlignCenter)
        self.title.setStyleSheet(
            "color: #f2f5fb; font-family: 'Segoe UI'; font-size: 20px; font-weight: 600;"
        )
        self.root_layout.addWidget(self.title, alignment=Qt.AlignHCenter)
        self.root_layout.addSpacing(18)

        self.card = UploadCard()
        self.card.clicked.connect(self.pick_file)
        self.root_layout.addWidget(self.card, alignment=Qt.AlignHCenter)

        self.root_layout.addSpacing(bottom_gap)

        self.patch_btn = PatchButton()
        self.patch_btn.clicked.connect(self.start_patch)
        self.root_layout.addWidget(self.patch_btn, alignment=Qt.AlignHCenter)
        self.root_layout.addSpacing(12)

        self.footer = QLabel('◯  t.me/example_tgc')
        self.footer.setAlignment(Qt.AlignCenter)
        self.footer.setStyleSheet(
            "color: rgba(235,240,250,170); font-family: 'Segoe UI'; font-size: 11px; font-weight: 500;"
        )
        self.root_layout.addWidget(self.footer, alignment=Qt.AlignHCenter)
        self.root_layout.addSpacing(footer_gap)

    def pick_file(self) -> None:
        path, _ = QFileDialog.getOpenFileName(
            self,
            'Select video',
            '',
            'MP4 files (*.mp4);;All files (*.*)',
        )
        if not path:
            return
        self.input_path = path
        in_path = Path(path)
        self.output_path = str(in_path.with_name(f'{in_path.stem}_rendered_patched.mp4'))
        self.card.set_filename(in_path.name)

    def start_patch(self) -> None:
        if self.worker and self.worker.isRunning():
            QMessageBox.warning(self, 'Busy', 'Обработка уже идёт.')
            return

        if not self.input_path or not Path(self.input_path).exists():
            QMessageBox.critical(self, 'Error', 'Выберите существующий MP4 файл.')
            return

        self.patch_btn.setEnabled(False)
        self.card.set_busy(True)
        self.card.set_progress(0)

        self.worker = PatchWorker(self.input_path, self.output_path)
        self.worker.progress_changed.connect(self.card.set_progress)
        self.worker.finished_ok.connect(self.on_patch_done)
        self.worker.failed.connect(self.on_patch_failed)
        self.worker.start()

    def on_patch_done(self, output_path: str) -> None:
        self.patch_btn.setEnabled(True)
        self.card.set_busy(False)
        self.card.set_progress(100)
        self.card.set_filename(Path(output_path).name)
        QMessageBox.information(self, 'Done', f'Файл сохранён:\n{output_path}')

    def on_patch_failed(self, error_text: str) -> None:
        self.patch_btn.setEnabled(True)
        self.card.set_busy(False)
        self.card.set_progress(0)
        QMessageBox.critical(self, 'Error', error_text)


def main() -> None:
    app = QApplication(sys.argv)
    window = MainWindow()
    window.show()
    sys.exit(app.exec())


if __name__ == '__main__':
    main()
