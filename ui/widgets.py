import random
from PySide6.QtCore import Qt, QRectF, Signal, QTimer
from PySide6.QtGui import QColor, QFont, QPainter, QPen, QLinearGradient
from PySide6.QtWidgets import QWidget, QPushButton

class ParticlesBackground(QWidget):
    def __init__(self) -> None:
        super().__init__()
        self.particles: list[dict[str, float]] = []
        self.timer = QTimer(self)
        self.timer.timeout.connect(self._tick)
        self.timer.start(16)
        self._ensure_particles()

    def resizeEvent(self, event) -> None:
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

    def paintEvent(self, event) -> None:
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

    def paintEvent(self, event) -> None:
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

    def enterEvent(self, event) -> None:
        self.hovered = True
        self.update()
        super().enterEvent(event)

    def leaveEvent(self, event) -> None:
        self.hovered = False
        self.update()
        super().leaveEvent(event)

    def mousePressEvent(self, event) -> None:
        if event.button() == Qt.LeftButton and not self.busy:
            self.clicked.emit()
        super().mousePressEvent(event)

    def paintEvent(self, event) -> None:
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