import random
from pathlib import Path

from PySide6.QtCore import Qt, QRectF, Signal, QTimer, QEasingCurve, QUrl, QVariantAnimation
from PySide6.QtGui import QColor, QFont, QIcon, QPainter, QPen, QLinearGradient, QDesktopServices
from PySide6.QtWidgets import (
    QFileDialog,
    QLabel,
    QMainWindow,
    QMessageBox,
    QPushButton,
    QVBoxLayout,
    QWidget,
)

from core import PatchWorker, resource_path

UI_BLOCK_OFFSET = 0


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
            "x": random.uniform(10, w - 10),
            "y": random.uniform(-h, h) if randomize_y else random.uniform(-20, -4),
            "speed": random.uniform(0.18, 0.62),
            "size": random.uniform(1.1, 2.6),
            "alpha": random.uniform(0.16, 0.56),
            "drift": random.uniform(-0.08, 0.08),
        }

    def _tick(self) -> None:
        h = max(1, self.height())
        w = max(1, self.width())
        for idx, p in enumerate(self.particles):
            p["y"] += p["speed"]
            p["x"] += p["drift"]
            if p["x"] < 8:
                p["x"] = 8
                p["drift"] *= -1
            elif p["x"] > w - 8:
                p["x"] = w - 8
                p["drift"] *= -1
            if p["y"] > h + 6:
                self.particles[idx] = self._new_particle(randomize_y=False)
        self.update()

    def paintEvent(self, event) -> None:  # noqa: N802
        painter = QPainter(self)
        painter.setRenderHint(QPainter.Antialiasing)

        grad = QLinearGradient(0, 0, 0, self.height())
        grad.setColorAt(0.0, QColor("#02050a"))
        grad.setColorAt(0.55, QColor("#03060b"))
        grad.setColorAt(1.0, QColor("#02050a"))
        painter.fillRect(self.rect(), grad)

        painter.setPen(Qt.NoPen)
        for p in self.particles:
            alpha = int(255 * p["alpha"])
            size = p["size"]
            x = p["x"]
            y = p["y"]

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


class SmoothScaleMixin:
    def _init_smooth_scale(self, hover_scale: float = 1.045, duration: int = 300) -> None:
        self._scale = 1.0
        self._hover_scale = hover_scale
        self._scale_anim = QVariantAnimation(self)
        self._scale_anim.setDuration(duration)
        self._scale_anim.setEasingCurve(QEasingCurve.InOutCubic)
        self._scale_anim.setStartValue(1.0)
        self._scale_anim.setEndValue(1.0)
        self._scale_anim.valueChanged.connect(self._on_scale_value_changed)

    def _on_scale_value_changed(self, value) -> None:
        self._scale = float(value)
        self.update()

    def _animate_to(self, target: float) -> None:
        self._scale_anim.stop()
        self._scale_anim.setStartValue(self._scale)
        self._scale_anim.setEndValue(target)
        self._scale_anim.start()

    def _begin_scaled_paint(self, painter: QPainter) -> None:
        cx = self.width() / 2.0
        cy = self.height() / 2.0
        painter.translate(cx, cy)
        painter.scale(self._scale, self._scale)
        painter.translate(-cx, -cy)


class FooterLink(QLabel, SmoothScaleMixin):
    def __init__(self, text: str) -> None:
        super().__init__(text)
        self._hovered = False
        self._init_smooth_scale(hover_scale=1.05, duration=320)
        self.setFixedHeight(22)

    def enterEvent(self, event) -> None:  # noqa: N802
        self._hovered = True
        self._animate_to(self._hover_scale)
        self.update()
        super().enterEvent(event)

    def leaveEvent(self, event) -> None:  # noqa: N802
        self._hovered = False
        self._animate_to(1.0)
        self.update()
        super().leaveEvent(event)

    def paintEvent(self, event) -> None:  # noqa: N802
        painter = QPainter(self)
        painter.setRenderHint(QPainter.TextAntialiasing)
        painter.setRenderHint(QPainter.Antialiasing)
        self._begin_scaled_paint(painter)

        color = QColor(245, 248, 255, 210) if self._hovered else QColor(235, 240, 250, 170)
        painter.setPen(color)

        font = QFont("Segoe UI", 11)
        font.setWeight(QFont.Medium)
        painter.setFont(font)
        painter.drawText(self.rect(), Qt.AlignCenter, self.text())
        painter.end()


class UploadCard(QWidget, SmoothScaleMixin):
    clicked = Signal()

    def __init__(self) -> None:
        super().__init__()
        self.setFixedSize(300, 138)
        self.setCursor(Qt.PointingHandCursor)
        self.hovered = False
        self.busy = False
        self.progress = 0
        self.filename = "Click to select video"
        self._init_smooth_scale(hover_scale=1.03, duration=360)

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
        self._animate_to(self._hover_scale)
        self.update()
        super().enterEvent(event)

    def leaveEvent(self, event) -> None:  # noqa: N802
        self.hovered = False
        self._animate_to(1.0)
        self.update()
        super().leaveEvent(event)

    def mousePressEvent(self, event) -> None:  # noqa: N802
        if event.button() == Qt.LeftButton and not self.busy:
            self.clicked.emit()
        super().mousePressEvent(event)

    def paintEvent(self, event) -> None:  # noqa: N802
        painter = QPainter(self)
        painter.setRenderHint(QPainter.Antialiasing)
        self._begin_scaled_paint(painter)

        outer = QRectF(1.5, 1.5, self.width() - 3, self.height() - 3)
        inner = QRectF(18.0, 20.0, self.width() - 36.0, self.height() - 40.0)

        bg = QColor("#060910")
        outer_border = QColor(255, 255, 255, 34)
        inner_border = QColor(255, 255, 255, 42)
        arrow_color = QColor("#eef2fa")
        text_color = QColor("#9ea8ba")

        if self.hovered and not self.busy:
            bg = QColor("#070b12")
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

        icon_font = QFont("Segoe UI Symbol", 22)
        painter.setFont(icon_font)
        painter.setPen(arrow_color)
        painter.drawText(QRectF(0, 42, self.width(), 22), Qt.AlignHCenter | Qt.AlignVCenter, "↥")

        text_font = QFont("Segoe UI", 10)
        text_font.setWeight(QFont.Medium)
        painter.setFont(text_font)
        painter.setPen(text_color)
        painter.drawText(QRectF(22, 72, self.width() - 44, 24), Qt.AlignCenter, self.filename)

        painter.end()


class PatchButton(QPushButton, SmoothScaleMixin):
    def __init__(self) -> None:
        super().__init__("PATCH")
        self.setCursor(Qt.PointingHandCursor)
        self.setFixedSize(166, 48)
        self.setFlat(True)
        self._hovered = False
        self._pressed = False
        self._init_smooth_scale(hover_scale=1.05, duration=320)

    def enterEvent(self, event) -> None:  # noqa: N802
        self._hovered = True
        self._animate_to(self._hover_scale)
        self.update()
        super().enterEvent(event)

    def leaveEvent(self, event) -> None:  # noqa: N802
        self._hovered = False
        self._animate_to(1.0)
        self.update()
        super().leaveEvent(event)

    def mousePressEvent(self, event) -> None:  # noqa: N802
        self._pressed = True
        self.update()
        super().mousePressEvent(event)

    def mouseReleaseEvent(self, event) -> None:  # noqa: N802
        self._pressed = False
        self.update()
        super().mouseReleaseEvent(event)

    def paintEvent(self, event) -> None:  # noqa: N802
        painter = QPainter(self)
        painter.setRenderHint(QPainter.Antialiasing)
        self._begin_scaled_paint(painter)

        rect = QRectF(1.5, 1.5, self.width() - 3, self.height() - 3)

        bg = QColor(8, 11, 18, 232)
        border = QColor(255, 255, 255, 36)
        text = QColor("#f2f5fb")

        if self.isEnabled():
            if self._hovered:
                bg = QColor(10, 14, 22, 238)
                border = QColor(255, 255, 255, 54)
            if self._pressed:
                bg = QColor(6, 8, 14, 236)
        else:
            border = QColor(255, 255, 255, 22)
            text = QColor(242, 245, 251, 120)

        painter.setPen(QPen(border, 1.0))
        painter.setBrush(bg)
        painter.drawRoundedRect(rect, 16, 16)

        font = QFont("Segoe UI", 15)
        font.setWeight(QFont.DemiBold)
        font.setLetterSpacing(QFont.AbsoluteSpacing, 2.0)
        painter.setFont(font)
        painter.setPen(text)
        painter.drawText(self.rect().adjusted(0, -1, 0, 0), Qt.AlignCenter, "PATCH")

        painter.end()


class MainWindow(QMainWindow):
    def __init__(self) -> None:
        super().__init__()
        self.setWindowTitle("pewpew")
        self.setFixedSize(394, 675)
        self.setWindowIcon(QIcon(resource_path("icon.ico")))

        self.input_path = ""
        self.output_path = ""
        self.worker: PatchWorker | None = None

        self.bg = ParticlesBackground()
        self.setCentralWidget(self.bg)

        self.root_layout = QVBoxLayout(self.bg)
        self.root_layout.setContentsMargins(28, 26, 28, 22)
        self.root_layout.setSpacing(0)

        self.header = QLabel("Editing - Unknown")
        self.header.setStyleSheet(
            "color: rgba(245,248,255,220); font-family: 'Consolas'; font-size: 12px; letter-spacing: 1px;"
        )
        self.root_layout.addWidget(self.header, alignment=Qt.AlignHCenter)
        self.root_layout.addSpacing(14)
        self.root_layout.addWidget(Divider(), alignment=Qt.AlignHCenter)

        top_gap = max(0, 72 + UI_BLOCK_OFFSET)
        bottom_gap = max(0, 108 - UI_BLOCK_OFFSET)
        footer_gap = max(0, 22 - max(0, UI_BLOCK_OFFSET // 2))

        self.root_layout.addSpacing(top_gap)

        self.title = QLabel("Video Patcher")
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

        self.footer = FooterLink("t.me/editing_unknown")
        self.footer.setAlignment(Qt.AlignCenter)
        self.footer.setCursor(Qt.PointingHandCursor)
        self.footer.mousePressEvent = self.open_link
        self.root_layout.addWidget(self.footer, alignment=Qt.AlignHCenter)
        self.root_layout.addSpacing(footer_gap)

    def pick_file(self) -> None:
        path, _ = QFileDialog.getOpenFileName(
            self,
            "Select video",
            "",
            "MP4 files (*.mp4);;All files (*.*)",
        )
        if not path:
            return
        self.input_path = path
        in_path = Path(path)
        self.output_path = str(in_path.with_name(f"{in_path.stem}_rendered_patched.mp4"))
        self.card.set_filename(in_path.name)

    def start_patch(self) -> None:
        if self.worker and self.worker.isRunning():
            QMessageBox.warning(self, "Busy", "Обработка уже идёт.")
            return

        if not self.input_path or not Path(self.input_path).exists():
            QMessageBox.critical(self, "Error", "Выберите существующий MP4 файл.")
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
        QMessageBox.information(self, "Done", f"Файл сохранён:\n{output_path}")

    def on_patch_failed(self, error_text: str) -> None:
        self.patch_btn.setEnabled(True)
        self.card.set_busy(False)
        self.card.set_progress(0)
        QMessageBox.critical(self, "Error", error_text)

    def open_link(self, event) -> None:
        if event.button() == Qt.LeftButton:
            QDesktopServices.openUrl(QUrl("https://t.me/editing_unknown"))
