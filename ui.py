import random
from pathlib import Path
 
from PySide6.QtCore import (
    Qt, QRectF, QRect, Signal, QTimer, QUrl, QVariantAnimation,
    QPropertyAnimation, QEasingCurve, QPoint, QParallelAnimationGroup
)
from PySide6.QtGui import (
    QColor, QFont, QIcon, QPainter, QPen, QLinearGradient, QRadialGradient,
    QDesktopServices, QPixmap, QBrush, QConicalGradient,
)
from PySide6.QtWidgets import (
    QApplication, QFileDialog, QLabel, QMainWindow,
    QPushButton, QVBoxLayout, QWidget, QGraphicsBlurEffect,
    QGraphicsOpacityEffect, QHBoxLayout
)
 
from core import PatchWorker, resource_path, get_app_language, set_app_language
 
 
UI_BLOCK_OFFSET = 0
_MARGIN = 24
 
LANG_BTN_RIGHT = 14
LANG_BTN_TOP = 14
LANG_BTN_SIZE = 38
 
LANG_BLUR_MAX = 3.2
LANG_BLUR_IN_MS = 90
LANG_BLUR_OUT_MS = 110
SHAKE_OFFSETS = [0, 2, 0, -2, 0]
SHAKE_STEP_MS = 14
 
TOAST_WIDTH = 330
TOAST_MIN_HEIGHT = 62
TOAST_BOTTOM_OFFSET = 20
TOAST_RISE_PX = 14
TOAST_SHOW_MS = 2400
TOAST_FADE_MS = 700
TOAST_FAST_FADE_MS = 180
 
# ── Colour palette ──────────────────────────────────────────────────────────
BG_DEEP   = QColor("#06070d")
BG_MID    = QColor("#080a12")
ACCENT    = QColor("#c8a96e")       # warm amber-gold
ACCENT2   = QColor("#e2c98a")       # highlight
ACCENT_DIM = QColor(200, 169, 110, 80)
TEXT_HI   = QColor("#f0ece4")
TEXT_MED  = QColor("#a89880")
TEXT_LO   = QColor("#5c5448")
BORDER    = QColor(255, 255, 255, 22)
BORDER_HI = QColor(200, 169, 110, 90)
 
 
UI_TRANSLATIONS = {
    "ru": {
        "header": "ALTER  ·  EDITING",
        "title": "Video Patcher",
        "patch": "PATCH",
        "select_video_dialog": "Выбрать видео",
        "click_to_select_video": "Нажмите, чтобы выбрать видео",
        "busy_title": "Занято",
        "busy_message": "Обработка уже идёт.",
        "error_title": "Ошибка",
        "choose_existing_mp4": "Выберите существующий MP4 файл.",
        "done_title": "Готово",
        "saved_message": "Файл сохранён:\n{path}",
        "source_error": "Ошибка: {text}",
    },
    "en": {
        "header": "ALTER  ·  EDITING",
        "title": "Video Patcher",
        "patch": "PATCH",
        "select_video_dialog": "Select video",
        "click_to_select_video": "Click to select video",
        "busy_title": "Busy",
        "busy_message": "Processing is already running.",
        "error_title": "Error",
        "choose_existing_mp4": "Select an existing MP4 file.",
        "done_title": "Done",
        "saved_message": "File saved:\n{path}",
        "source_error": "Error: {text}",
    },
    "tr": {
        "header": "ALTER  ·  EDITING",
        "title": "Video Yaması",
        "patch": "İŞLEM",
        "select_video_dialog": "Video seç",
        "click_to_select_video": "Video seçmek için tıklayın",
        "busy_title": "Meşgul",
        "busy_message": "İşlem zaten devam ediyor.",
        "error_title": "Hata",
        "choose_existing_mp4": "Geçerli bir MP4 dosyası seçin.",
        "done_title": "Tamamlandı",
        "saved_message": "Dosya kaydedildi:\n{path}",
        "source_error": "Hata: {text}",
    },
}
 
 
def ui_tr(lang: str, key: str, **kwargs) -> str:
    table = UI_TRANSLATIONS.get(lang, UI_TRANSLATIONS["ru"])
    text = table.get(key, UI_TRANSLATIONS["en"].get(key, key))
    if kwargs:
        try:
            return text.format(**kwargs)
        except Exception:
            return text
    return text
 
 
def _ease_out_quint(t):
    t = 1.0 - t
    return 1.0 - t**5
 
 
def _ease_in_out_quad(t):
    return 2 * t * t if t < 0.5 else -1 + (4 - 2 * t) * t
 
 
# ── Helper: rounded rect with separate corner control ────────────────────────
def _draw_rounded_border(painter, rect, radius, color, width=1.0):
    pen = QPen(color, width)
    pen.setCapStyle(Qt.RoundCap)
    painter.setPen(pen)
    painter.setBrush(Qt.NoBrush)
    painter.drawRoundedRect(rect, radius, radius)
 
 
class HoverHitBox(QWidget):
    entered = Signal()
    left = Signal()
    clicked = Signal()
 
    def __init__(self, parent=None):
        super().__init__(parent)
        self.setMouseTracking(True)
        self.setAttribute(Qt.WA_StyledBackground, False)
        self.setStyleSheet("background: transparent;")
 
    def enterEvent(self, e):
        self.entered.emit()
        super().enterEvent(e)
 
    def leaveEvent(self, e):
        self.left.emit()
        super().leaveEvent(e)
 
    def mousePressEvent(self, e):
        if e.button() == Qt.LeftButton:
            self.clicked.emit()
        super().mousePressEvent(e)
 
 
class ScaleHoverMixin:
    TARGET_SCALE = 1.055
    DURATION_IN = 300
    DURATION_OUT = 360
    TICK_MS = 14
 
    def _init_scale_hover(self, content_w: int, content_h: int):
        self._cw = content_w
        self._ch = content_h
        self._scale = 1.0
        self._scale_start = 1.0
        self._scale_end = 1.0
        self._anim_elapsed = 0
        self._anim_duration = self.DURATION_IN
        self._easing_fn = _ease_out_quint
 
        self.setFixedSize(content_w + _MARGIN * 2, content_h + _MARGIN * 2)
        self.setAttribute(Qt.WA_TranslucentBackground, True)
 
        self._stimer = QTimer(self)
        self._stimer.setInterval(self.TICK_MS)
        self._stimer.timeout.connect(self._scale_tick)
 
    def _scale_tick(self):
        self._anim_elapsed += self.TICK_MS
        t = min(1.0, self._anim_elapsed / self._anim_duration)
        self._scale = self._scale_start + (self._scale_end - self._scale_start) * self._easing_fn(t)
        self.update()
        if t >= 1.0:
            self._scale = self._scale_end
            self._stimer.stop()
 
    def _animate_to(self, target: float):
        self._stimer.stop()
        self._scale_start = self._scale
        self._scale_end = target
        self._anim_elapsed = 0
        if target > 1.0:
            self._anim_duration = self.DURATION_IN
            self._easing_fn = _ease_out_quint
        else:
            self._anim_duration = self.DURATION_OUT
            self._easing_fn = _ease_in_out_quad
        self._stimer.start()
 
    def _draw_pixmap_scaled(self, painter: QPainter, pixmap: QPixmap):
        s = self._scale
        cx = self.width() / 2.0
        cy = self.height() / 2.0
        sw = self._cw * s
        sh = self._ch * s
        dst = QRectF(cx - sw / 2, cy - sh / 2, sw, sh)
        painter.setRenderHint(QPainter.SmoothPixmapTransform, True)
        painter.setRenderHint(QPainter.Antialiasing, True)
        painter.drawPixmap(dst, pixmap, QRectF(pixmap.rect()))
 
 
# ── Toast ────────────────────────────────────────────────────────────────────
class ToastMessage(QWidget):
    closed = Signal()
 
    def __init__(self, title: str, message: str, parent: QWidget):
        super().__init__(parent)
        self._anim_group = None
        self._fade_anim = None
        self._closing = False
 
        self.setAttribute(Qt.WA_TranslucentBackground, True)
        self.setWindowFlags(Qt.FramelessWindowHint | Qt.SubWindow)
 
        self.opacity = QGraphicsOpacityEffect(self)
        self.opacity.setOpacity(1.0)
        self.setGraphicsEffect(self.opacity)
 
        outer = QVBoxLayout(self)
        outer.setContentsMargins(0, 0, 0, 0)
 
        self.card = QWidget(self)
        self.card.setObjectName("toastCard")
        self.card.setStyleSheet("""
            QWidget#toastCard {
                background-color: rgba(10, 9, 13, 250);
                border: 1px solid rgba(200, 169, 110, 55);
                border-radius: 14px;
            }
        """)
        outer.addWidget(self.card)
 
        inner = QHBoxLayout(self.card)
        inner.setContentsMargins(16, 14, 16, 14)
        inner.setSpacing(12)
 
        self.dot = QLabel(self.card)
        self.dot.setFixedSize(6, 6)
        self.dot.setStyleSheet("""
            QLabel {
                background-color: rgba(200, 169, 110, 200);
                border-radius: 3px;
            }
        """)
        inner.addWidget(self.dot, alignment=Qt.AlignTop | Qt.AlignVCenter)
        inner.setAlignment(self.dot, Qt.AlignTop)
 
        text_col = QVBoxLayout()
        text_col.setContentsMargins(0, 0, 0, 0)
        text_col.setSpacing(3)
 
        self.title_lbl = QLabel(title, self.card)
        self.title_lbl.setStyleSheet("""
            color: #e2c98a;
            font-family: 'Consolas';
            font-size: 11px;
            font-weight: 600;
            letter-spacing: 1px;
            background: transparent;
            border: none;
        """)
        text_col.addWidget(self.title_lbl)
 
        self.msg_lbl = QLabel(message, self.card)
        self.msg_lbl.setWordWrap(True)
        self.msg_lbl.setStyleSheet("""
            color: rgba(168, 152, 128, 200);
            font-family: 'Segoe UI';
            font-size: 11px;
            background: transparent;
            border: none;
        """)
        text_col.addWidget(self.msg_lbl)
 
        inner.addLayout(text_col, 1)
        self._finalize_size()
 
    def _finalize_size(self):
        self.setFixedWidth(TOAST_WIDTH)
        self.msg_lbl.setFixedWidth(TOAST_WIDTH - 16 - 16 - 12 - 6 - 12)
        self.msg_lbl.adjustSize()
        total_h = max(
            TOAST_MIN_HEIGHT,
            14 + 14 + self.title_lbl.sizeHint().height() + 3 + self.msg_lbl.sizeHint().height()
        )
        self.setFixedHeight(total_h)
 
    def show_with_animation(self):
        parent = self.parentWidget()
        if parent is None:
            self.deleteLater()
            return
 
        x = (parent.width() - self.width()) // 2
        end_y = parent.height() - TOAST_BOTTOM_OFFSET - self.height()
        start_y = end_y + TOAST_RISE_PX
 
        self.move(x, start_y)
        self.show()
        self.raise_()
 
        try:
            import winsound
            winsound.MessageBeep(winsound.MB_ICONASTERISK)
        except Exception:
            QApplication.beep()
 
        pos_anim = QPropertyAnimation(self, b"pos", self)
        pos_anim.setDuration(280)
        pos_anim.setStartValue(QPoint(x, start_y))
        pos_anim.setEndValue(QPoint(x, end_y))
        pos_anim.setEasingCurve(QEasingCurve.OutCubic)
 
        opacity_anim = QPropertyAnimation(self.opacity, b"opacity", self)
        opacity_anim.setDuration(250)
        opacity_anim.setStartValue(0.0)
        opacity_anim.setEndValue(1.0)
        opacity_anim.setEasingCurve(QEasingCurve.OutCubic)
 
        self._anim_group = QParallelAnimationGroup(self)
        self._anim_group.addAnimation(pos_anim)
        self._anim_group.addAnimation(opacity_anim)
        self._anim_group.start()
 
        QTimer.singleShot(TOAST_SHOW_MS, self.fade_out)
 
    def fade_out(self, duration: int = TOAST_FADE_MS):
        if self._closing:
            return
        self._closing = True
 
        self._fade_anim = QPropertyAnimation(self.opacity, b"opacity", self)
        self._fade_anim.setDuration(duration)
        self._fade_anim.setStartValue(self.opacity.opacity())
        self._fade_anim.setEndValue(0.0)
        self._fade_anim.finished.connect(self._finish)
        self._fade_anim.start()
 
    def fast_replace(self):
        self.fade_out(TOAST_FAST_FADE_MS)
 
    def _finish(self):
        self.closed.emit()
        self.deleteLater()
 
 
# ── Background: deep space with drifting ember particles ─────────────────────
class ParticlesBackground(QWidget):
    def __init__(self):
        super().__init__()
        self.particles = []
        self._timer = QTimer(self)
        self._timer.timeout.connect(self._tick)
        self._timer.start(16)
        self._ensure_particles()
 
    def resizeEvent(self, e):
        super().resizeEvent(e)
        self._ensure_particles(reset=True)
 
    def _ensure_particles(self, reset=False):
        if self.width() <= 0 or self.height() <= 0:
            return
        n = 48
        if reset or not self.particles:
            self.particles = [self._new_particle(True) for _ in range(n)]
        else:
            while len(self.particles) < n:
                self.particles.append(self._new_particle(True))
 
    def _new_particle(self, rand_y=False):
        w, h = max(1, self.width()), max(1, self.height())
        # mix of gold/amber and white particles
        kind = random.choice(["amber", "white", "white"])
        return {
            "x": random.uniform(10, w - 10),
            "y": random.uniform(-h, h) if rand_y else random.uniform(-20, -4),
            "speed": random.uniform(0.12, 0.45),
            "size": random.uniform(0.8, 2.2),
            "alpha": random.uniform(0.08, 0.40),
            "drift": random.uniform(-0.06, 0.06),
            "kind": kind,
        }
 
    def _tick(self):
        h, w = max(1, self.height()), max(1, self.width())
        for i, p in enumerate(self.particles):
            p["y"] += p["speed"]
            p["x"] += p["drift"]
            if p["x"] < 8:
                p["x"] = 8
                p["drift"] *= -1
            elif p["x"] > w - 8:
                p["x"] = w - 8
                p["drift"] *= -1
            if p["y"] > h + 6:
                self.particles[i] = self._new_particle()
        self.update()
 
    def paintEvent(self, e):
        p = QPainter(self)
        p.setRenderHint(QPainter.Antialiasing)
 
        # Deep gradient background
        g = QLinearGradient(0, 0, 0, self.height())
        g.setColorAt(0.0,  QColor("#06070d"))
        g.setColorAt(0.38, QColor("#080a12"))
        g.setColorAt(0.72, QColor("#07090f"))
        g.setColorAt(1.0,  QColor("#05060b"))
        p.fillRect(self.rect(), g)
 
        # Subtle vignette radial overlay
        vg = QRadialGradient(self.width() / 2, self.height() * 0.42, self.width() * 0.72)
        vg.setColorAt(0.0, QColor(0, 0, 0, 0))
        vg.setColorAt(1.0, QColor(0, 0, 0, 90))
        p.fillRect(self.rect(), vg)
 
        # Faint amber glow near center-bottom
        ag = QRadialGradient(self.width() / 2, self.height() * 0.78, self.width() * 0.55)
        ag.setColorAt(0.0, QColor(200, 169, 110, 14))
        ag.setColorAt(1.0, QColor(200, 169, 110, 0))
        p.fillRect(self.rect(), ag)
 
        # Particles
        p.setPen(Qt.NoPen)
        for pt in self.particles:
            a, sz, x, y = int(255 * pt["alpha"]), pt["size"], pt["x"], pt["y"]
            gs = sz * 3.2
            if pt["kind"] == "amber":
                glow_c = QColor(200, 155, 80, max(0, int(a * 0.25)))
                core_c = QColor(220, 175, 100, a)
            else:
                glow_c = QColor(240, 235, 220, max(0, int(a * 0.15)))
                core_c = QColor(235, 230, 215, a)
 
            p.setBrush(glow_c)
            p.drawEllipse(QRectF(x - gs / 2, y - gs / 2, gs, gs))
            p.setBrush(core_c)
            p.drawEllipse(QRectF(x - sz / 2, y - sz / 2, sz, sz))
        p.end()
 
 
# ── Thin ornamental divider ───────────────────────────────────────────────────
class Divider(QWidget):
    def __init__(self, width=300):
        super().__init__()
        self.setFixedSize(width, 10)
 
    def paintEvent(self, e):
        p = QPainter(self)
        p.setRenderHint(QPainter.Antialiasing)
 
        W = self.width()
        mid = W / 2
        cy = self.height() / 2
 
        # Left line
        gl = QLinearGradient(0, 0, mid - 12, 0)
        gl.setColorAt(0.0, QColor(200, 169, 110, 0))
        gl.setColorAt(1.0, QColor(200, 169, 110, 70))
        p.setPen(QPen(QBrush(gl), 0.8))
        p.drawLine(QRectF(0, cy, mid - 12, 0).topLeft(),
                   QRectF(0, cy, mid - 12, 0).topRight())
 
        # Centre diamond
        p.setPen(Qt.NoPen)
        p.setBrush(QColor(200, 169, 110, 90))
        diamond = [
            QPoint(int(mid), int(cy - 3)),
            QPoint(int(mid + 3), int(cy)),
            QPoint(int(mid), int(cy + 3)),
            QPoint(int(mid - 3), int(cy)),
        ]
        from PySide6.QtGui import QPolygon
        p.drawPolygon(QPolygon(diamond))
 
        # Right line
        gr = QLinearGradient(mid + 12, 0, W, 0)
        gr.setColorAt(0.0, QColor(200, 169, 110, 70))
        gr.setColorAt(1.0, QColor(200, 169, 110, 0))
        p.setPen(QPen(QBrush(gr), 0.8))
        p.drawLine(QRectF(mid + 12, cy, W - mid - 12, 0).topLeft(),
                   QRectF(mid + 12, cy, W - mid - 12, 0).topRight())
 
        p.end()
 
 
# ── Footer link ───────────────────────────────────────────────────────────────
class FooterLink(QLabel, ScaleHoverMixin):
    def __init__(self, text):
        QLabel.__init__(self, text)
        self._init_scale_hover(200, 22)
 
        self.hitbox = HoverHitBox(self)
        self.hitbox.setGeometry(_MARGIN, _MARGIN, self._cw, self._ch)
        self.hitbox.entered.connect(lambda: self._animate_to(self.TARGET_SCALE))
        self.hitbox.left.connect(lambda: self._animate_to(1.0))
 
    def paintEvent(self, e):
        px = QPixmap(self._cw, self._ch)
        px.fill(Qt.transparent)
        p = QPainter(px)
        p.setRenderHint(QPainter.Antialiasing)
        font = QFont("Consolas", 8)
        font.setLetterSpacing(QFont.AbsoluteSpacing, 1.5)
        p.setFont(font)
        p.setPen(QColor(200, 169, 110, 130))
        p.drawText(QRect(0, 0, self._cw, self._ch), Qt.AlignCenter, self.text())
        p.end()
 
        op = QPainter(self)
        self._draw_pixmap_scaled(op, px)
        op.end()
 
 
# ── Upload card ───────────────────────────────────────────────────────────────
class UploadCard(QWidget, ScaleHoverMixin):
    clicked = Signal()
 
    def __init__(self, text_getter):
        QWidget.__init__(self)
        self.setCursor(Qt.PointingHandCursor)
        self.hovered = False
        self.busy = False
        self.progress = 0
        self._text_getter = text_getter
        self._selected_name = ""
        self.filename = self._text_getter("click_to_select_video")
        self._init_scale_hover(310, 148)
 
        self.hitbox = HoverHitBox(self)
        self.hitbox.setGeometry(_MARGIN, _MARGIN, self._cw, self._ch)
        self.hitbox.entered.connect(self._on_hover_enter)
        self.hitbox.left.connect(self._on_hover_leave)
        self.hitbox.clicked.connect(self._on_hitbox_clicked)
 
    def _on_hover_enter(self):
        self.hovered = True
        self._animate_to(self.TARGET_SCALE)
 
    def _on_hover_leave(self):
        self.hovered = False
        self._animate_to(1.0)
 
    def _on_hitbox_clicked(self):
        if not self.busy:
            self.clicked.emit()
 
    def set_progress(self, v):
        self.progress = max(0, min(100, v))
        self.update()
 
    def set_busy(self, b):
        self.busy = b
        self.update()
 
    def set_filename(self, n):
        self._selected_name = n
        self.filename = n
        self.update()
 
    def clear_selection(self):
        self._selected_name = ""
        self.filename = self._text_getter("click_to_select_video")
        self.progress = 0
        self.busy = False
        self.update()
 
    def refresh_language(self):
        if not self._selected_name:
            self.filename = self._text_getter("click_to_select_video")
            self.update()
 
    def _make_pixmap(self):
        W, H = self._cw, self._ch
        px = QPixmap(W, H)
        px.fill(Qt.transparent)
        p = QPainter(px)
        p.setRenderHint(QPainter.Antialiasing)
 
        hov = self.hovered and not self.busy
 
        # Outer card background
        outer = QRectF(1.0, 1.0, W - 2, H - 2)
        bg = QLinearGradient(0, 0, 0, H)
        if hov:
            bg.setColorAt(0.0, QColor("#0e0d14"))
            bg.setColorAt(1.0, QColor("#0a0910"))
        else:
            bg.setColorAt(0.0, QColor("#09080e"))
            bg.setColorAt(1.0, QColor("#07060c"))
        p.setPen(Qt.NoPen)
        p.setBrush(bg)
        p.drawRoundedRect(outer, 20, 20)
 
        # Outer border — amber tint on hover
        border_col = QColor(200, 169, 110, 80 if hov else 35)
        p.setPen(QPen(border_col, 0.9))
        p.setBrush(Qt.NoBrush)
        p.drawRoundedRect(outer, 20, 20)
 
        # Inner dashed drop zone
        inner = QRectF(16, 18, W - 32, H - 36)
        dp = QPen(QColor(200, 169, 110, 50 if hov else 28), 0.9)
        dp.setDashPattern([5, 7])
        dp.setCapStyle(Qt.RoundCap)
        p.setPen(dp)
        p.setBrush(Qt.NoBrush)
        p.drawRoundedRect(inner, 14, 14)
 
        # Subtle inner glow when hovered
        if hov:
            ig = QRadialGradient(W / 2, H / 2, W * 0.5)
            ig.setColorAt(0.0, QColor(200, 169, 110, 12))
            ig.setColorAt(1.0, QColor(200, 169, 110, 0))
            p.setPen(Qt.NoPen)
            p.setBrush(ig)
            p.drawRoundedRect(inner, 14, 14)
 
        # Progress bar
        if self.progress > 0:
            bar_rect = QRectF(inner.left() + 6, outer.bottom() - 9,
                              inner.width() - 12, 2.5)
            p.setPen(Qt.NoPen)
            p.setBrush(QColor(60, 50, 40, 100))
            p.drawRoundedRect(bar_rect, 1.5, 1.5)
 
            fill_w = (bar_rect.width()) * (self.progress / 100.0)
            fill_g = QLinearGradient(bar_rect.left(), 0,
                                     bar_rect.left() + fill_w, 0)
            fill_g.setColorAt(0.0, QColor(180, 140, 70, 200))
            fill_g.setColorAt(1.0, QColor(226, 201, 138, 255))
            p.setBrush(fill_g)
            p.drawRoundedRect(
                QRectF(bar_rect.left(), bar_rect.top(), fill_w, bar_rect.height()),
                1.5, 1.5
            )
 
        # Upload icon — minimalist upward arrow
        icon_x, icon_y = W / 2, 50
        p.setPen(QPen(QColor(200, 169, 110, 160 if hov else 110), 1.4,
                      Qt.SolidLine, Qt.RoundCap, Qt.RoundJoin))
        p.drawLine(QRectF(icon_x, icon_y - 10, 0, 18).topLeft(),
                   QRectF(icon_x, icon_y - 10, 0, 18).bottomLeft())
        # Arrowhead
        import math
        arrow_tip_y = icon_y - 11
        for dx in [-6, 6]:
            p.drawLine(
                int(icon_x), int(arrow_tip_y),
                int(icon_x + dx), int(arrow_tip_y + 7)
            )
        # Base serifs
        p.drawLine(
            int(icon_x - 7), int(icon_y + 7),
            int(icon_x + 7), int(icon_y + 7)
        )
 
        # Filename / prompt text
        font2 = QFont("Segoe UI", 9)
        font2.setLetterSpacing(QFont.AbsoluteSpacing, 0.3)
        p.setFont(font2)
        if self._selected_name:
            p.setPen(QColor(226, 201, 138, 220))
        else:
            p.setPen(QColor(140, 120, 90, 150))
        p.drawText(QRectF(22, 80, W - 44, 28), Qt.AlignCenter, self.filename)
 
        p.end()
        return px
 
    def paintEvent(self, e):
        op = QPainter(self)
        self._draw_pixmap_scaled(op, self._make_pixmap())
        op.end()
 
 
# ── Patch button ──────────────────────────────────────────────────────────────
class PatchButton(QPushButton, ScaleHoverMixin):
    def __init__(self, text_getter):
        QPushButton.__init__(self, text_getter("patch"))
        self._text_getter = text_getter
        self.setCursor(Qt.PointingHandCursor)
        self.setFlat(True)
        self._init_scale_hover(180, 50)
        self.setStyleSheet("QPushButton { background: transparent; border: none; }")
 
        self.hitbox = HoverHitBox(self)
        self.hitbox.setGeometry(_MARGIN, _MARGIN, self._cw, self._ch)
        self.hitbox.entered.connect(lambda: self._animate_to(self.TARGET_SCALE))
        self.hitbox.left.connect(lambda: self._animate_to(1.0))
        self.hitbox.clicked.connect(self.click)
 
    def refresh_language(self):
        self.setText(self._text_getter("patch"))
        self.update()
 
    def _make_pixmap(self):
        W, H = self._cw, self._ch
        px = QPixmap(W, H)
        px.fill(Qt.transparent)
        p = QPainter(px)
        p.setRenderHint(QPainter.Antialiasing)
 
        disabled = not self.isEnabled()
        pressed = self.isDown()
 
        r = QRectF(0.5, 0.5, W - 1, H - 1)
 
        if disabled:
            bg = QLinearGradient(0, 0, W, 0)
            bg.setColorAt(0, QColor("#0d0c13"))
            bg.setColorAt(1, QColor("#0a0910"))
            border = QColor(200, 169, 110, 22)
            tc = QColor(200, 169, 110, 70)
        elif pressed:
            bg = QLinearGradient(0, 0, W, 0)
            bg.setColorAt(0, QColor("#1a1608"))
            bg.setColorAt(1, QColor("#120f07"))
            border = QColor(200, 169, 110, 140)
            tc = ACCENT2
        else:
            bg = QLinearGradient(0, 0, W, 0)
            bg.setColorAt(0.0, QColor("#141108"))
            bg.setColorAt(0.5, QColor("#1c1709"))
            bg.setColorAt(1.0, QColor("#141108"))
            border = QColor(200, 169, 110, 90)
            tc = ACCENT2
 
        p.setPen(Qt.NoPen)
        p.setBrush(bg)
        p.drawRoundedRect(r, 14, 14)
 
        # Top highlight line
        if not disabled:
            hl = QLinearGradient(0, 0, W, 0)
            hl.setColorAt(0.0, QColor(200, 169, 110, 0))
            hl.setColorAt(0.35, QColor(200, 169, 110, 60))
            hl.setColorAt(0.65, QColor(200, 169, 110, 60))
            hl.setColorAt(1.0, QColor(200, 169, 110, 0))
            p.setPen(QPen(QBrush(hl), 0.7))
            p.drawLine(QRectF(14, 1, W - 28, 0).topLeft(),
                       QRectF(14, 1, W - 28, 0).topRight())
 
        p.setPen(QPen(border, 0.9))
        p.setBrush(Qt.NoBrush)
        p.drawRoundedRect(r, 14, 14)
 
        # Label
        font = QFont("Consolas", 11)
        font.setLetterSpacing(QFont.AbsoluteSpacing, 3.5)
        font.setWeight(QFont.DemiBold)
        p.setFont(font)
        p.setPen(tc)
        p.drawText(QRectF(0, -1, W, H), Qt.AlignCenter, self.text())
        p.end()
        return px
 
    def paintEvent(self, e):
        op = QPainter(self)
        self._draw_pixmap_scaled(op, self._make_pixmap())
        op.end()
 
 
# ── Language switcher ─────────────────────────────────────────────────────────
class LangSwitcherButton(QWidget, ScaleHoverMixin):
    clicked = Signal()
 
    def __init__(self):
        QWidget.__init__(self)
        self._code = "RU"
        self.hovered = False
        self.pressed = False
        self.setCursor(Qt.PointingHandCursor)
        self._init_scale_hover(LANG_BTN_SIZE, LANG_BTN_SIZE)
 
        self.hitbox = HoverHitBox(self)
        self.hitbox.setGeometry(_MARGIN, _MARGIN, self._cw, self._ch)
        self.hitbox.entered.connect(self._on_hover_enter)
        self.hitbox.left.connect(self._on_hover_leave)
        self.hitbox.clicked.connect(self._on_hitbox_clicked)
 
    def _on_hover_enter(self):
        self.hovered = True
        self._animate_to(self.TARGET_SCALE)
 
    def _on_hover_leave(self):
        self.hovered = False
        self.pressed = False
        self._animate_to(1.0)
        self.update()
 
    def _on_hitbox_clicked(self):
        self.clicked.emit()
 
    def set_code(self, code: str):
        self._code = (code or "RU").upper()
        self.update()
 
    def _make_pixmap(self):
        W, H = self._cw, self._ch
        px = QPixmap(W, H)
        px.fill(Qt.transparent)
 
        p = QPainter(px)
        p.setRenderHint(QPainter.Antialiasing)
 
        if self.pressed:
            bg = QColor(28, 22, 10, 250)
            bd = QColor(200, 169, 110, 130)
        elif self.hovered:
            bg = QColor(22, 18, 8, 240)
            bd = QColor(200, 169, 110, 100)
        else:
            bg = QColor(14, 12, 8, 220)
            bd = QColor(200, 169, 110, 50)
 
        p.setPen(QPen(bd, 0.9))
        p.setBrush(bg)
        p.drawRoundedRect(QRectF(0.5, 0.5, W - 1, H - 1), 10, 10)
 
        font = QFont("Consolas", 8)
        font.setWeight(QFont.DemiBold)
        font.setLetterSpacing(QFont.AbsoluteSpacing, 0.8)
        p.setFont(font)
        p.setPen(QColor(200, 169, 110, 200 if self.hovered else 140))
        p.drawText(QRectF(0, -1, W, H), Qt.AlignCenter, self._code)
 
        p.end()
        return px
 
    def paintEvent(self, e):
        op = QPainter(self)
        self._draw_pixmap_scaled(op, self._make_pixmap())
        op.end()
 
 
# ── Ornamental corner accents drawn on the background ─────────────────────────
class CornerAccents(QWidget):
    """Transparent overlay that draws four corner bracket decorations."""
 
    def __init__(self, parent=None):
        super().__init__(parent)
        self.setAttribute(Qt.WA_TransparentForMouseEvents, True)
        self.setAttribute(Qt.WA_TranslucentBackground, True)
 
    def paintEvent(self, e):
        p = QPainter(self)
        p.setRenderHint(QPainter.Antialiasing)
        pen = QPen(QColor(200, 169, 110, 38), 0.9)
        p.setPen(pen)
 
        M, L = 18, 20   # margin, leg length
        W, H = self.width(), self.height()
 
        corners = [
            (M, M, 1, 1),
            (W - M, M, -1, 1),
            (M, H - M, 1, -1),
            (W - M, H - M, -1, -1),
        ]
        for cx, cy, sx, sy in corners:
            p.drawLine(cx, cy, cx + sx * L, cy)
            p.drawLine(cx, cy, cx, cy + sy * L)
        p.end()
 
 
# ── Main window ───────────────────────────────────────────────────────────────
class MainWindow(QMainWindow):
    LANG_ORDER = ["ru", "en", "tr"]
 
    def __init__(self):
        super().__init__()
        self.lang = get_app_language()
        self._lang_anim_running = False
        self._pending_lang = None
        self._blur_anim_in = None
        self._blur_anim_out = None
        self._original_pos = None
        self._blur_effect = None
        self._lang_btn_blur_effect = None
 
        self._active_toast = None
        self._pending_replacement_toast = None
 
        self.setWindowTitle("Alter — Editing Method")
        self.setFixedSize(400, 680)
        try:
            self.setWindowIcon(QIcon(resource_path("icon1.ico")))
        except Exception:
            pass
 
        self.input_path = ""
        self.output_path = ""
        self.worker = None
 
        # Background
        self.bg = ParticlesBackground()
        self.setCentralWidget(self.bg)
 
        # Corner accents overlay
        self._corners = CornerAccents(self.bg)
        self._corners.setGeometry(0, 0, self.bg.width(), self.bg.height())
        self._corners.raise_()
 
        L = QVBoxLayout(self.bg)
        L.setContentsMargins(32, 28, 32, 24)
        L.setSpacing(0)
 
        # ── Header ──
        self.header = QLabel()
        self.header.setAlignment(Qt.AlignCenter)
        self.header.setStyleSheet(
            "color: rgba(200, 169, 110, 180);"
            "font-family: 'Consolas';"
            "font-size: 10px;"
            "letter-spacing: 4px;"
            "background: transparent;"
        )
        L.addWidget(self.header, alignment=Qt.AlignHCenter)
        L.addSpacing(16)
 
        # Divider
        L.addWidget(Divider(width=280), alignment=Qt.AlignHCenter)
 
        top_gap = max(0, 60 + UI_BLOCK_OFFSET)
        bottom_gap = max(0, 92 - UI_BLOCK_OFFSET)
        footer_gap = max(0, 20 - max(0, UI_BLOCK_OFFSET // 2))
 
        L.addSpacing(top_gap)
 
        # ── Title ──
        self.title = QLabel()
        self.title.setAlignment(Qt.AlignCenter)
        self.title.setStyleSheet(
            "color: #f0ece4;"
            "font-family: 'Palatino Linotype', 'Book Antiqua', 'Palatino', serif;"
            "font-size: 26px;"
            "font-weight: 400;"
            "letter-spacing: 2px;"
            "background: transparent;"
        )
        L.addWidget(self.title, alignment=Qt.AlignHCenter)
        L.addSpacing(22)
 
        # ── Upload card ──
        self.card = UploadCard(self.t)
        self.card.clicked.connect(self.pick_file)
        L.addWidget(self.card, alignment=Qt.AlignHCenter)
        L.addSpacing(bottom_gap)
 
        # ── Patch button ──
        self.patch_btn = PatchButton(self.t)
        self.patch_btn.clicked.connect(self.start_patch)
        L.addWidget(self.patch_btn, alignment=Qt.AlignHCenter)
        L.addSpacing(16)
 
        # Thin divider above footer
        L.addWidget(Divider(width=200), alignment=Qt.AlignHCenter)
        L.addSpacing(10)
 
        # ── Footer ──
        self.footer = FooterLink("☽  t.me/alterediting")
        self.footer.setAlignment(Qt.AlignCenter)
        self.footer.setCursor(Qt.PointingHandCursor)
        self.footer.mousePressEvent = self.open_link
        L.addWidget(self.footer, alignment=Qt.AlignHCenter)
        L.addSpacing(footer_gap)
 
        # ── Language button ──
        self.lang_btn = LangSwitcherButton()
        self.lang_btn.setParent(self.bg)
        self.lang_btn.clicked.connect(self.switch_language_with_fx)
        self.lang_btn.raise_()
        self._place_lang_button()
 
        self.apply_language()
 
    def resizeEvent(self, event):
        super().resizeEvent(event)
        if hasattr(self, "_corners"):
            self._corners.setGeometry(0, 0, self.bg.width(), self.bg.height())
        self._place_lang_button()
 
    def _place_lang_button(self):
        x = self.bg.width() - self.lang_btn.width() - LANG_BTN_RIGHT + _MARGIN
        y = LANG_BTN_TOP - _MARGIN + 4
        self.lang_btn.move(x, y)
 
    def t(self, key: str, **kwargs) -> str:
        return ui_tr(self.lang, key, **kwargs)
 
    def show_toast(self, title: str, message: str):
        if self._active_toast is None:
            toast = ToastMessage(title, message, self)
            self._active_toast = toast
            toast.closed.connect(self._on_toast_closed)
            toast.show_with_animation()
            return
 
        self._pending_replacement_toast = (title, message)
        self._active_toast.fast_replace()
 
    def _on_toast_closed(self):
        self._active_toast = None
        if self._pending_replacement_toast is not None:
            title, message = self._pending_replacement_toast
            self._pending_replacement_toast = None
            QTimer.singleShot(10, lambda: self.show_toast(title, message))
 
    def next_language(self) -> str:
        try:
            idx = self.LANG_ORDER.index(self.lang)
        except ValueError:
            return self.LANG_ORDER[0]
        return self.LANG_ORDER[(idx + 1) % len(self.LANG_ORDER)]
 
    def switch_language_with_fx(self):
        if self._lang_anim_running:
            return
 
        self._lang_anim_running = True
        self._pending_lang = self.next_language()
        self.lang_btn.setEnabled(False)
        self._original_pos = self.pos()
 
        self._blur_effect = QGraphicsBlurEffect()
        self._blur_effect.setBlurRadius(0)
        self.bg.setGraphicsEffect(self._blur_effect)
 
        self._lang_btn_blur_effect = QGraphicsBlurEffect()
        self._lang_btn_blur_effect.setBlurRadius(0)
        self.lang_btn.setGraphicsEffect(self._lang_btn_blur_effect)
 
        self._blur_anim_in = QVariantAnimation(self)
        self._blur_anim_in.setDuration(LANG_BLUR_IN_MS)
        self._blur_anim_in.setStartValue(0.0)
        self._blur_anim_in.setEndValue(LANG_BLUR_MAX)
        self._blur_anim_in.valueChanged.connect(self._set_blur_value)
        self._blur_anim_in.finished.connect(self._apply_language_after_fx)
        self._blur_anim_in.start()
 
        self._run_shake()
 
    def _set_blur_value(self, value):
        blur_value = float(value)
        if self._blur_effect is not None:
            try:
                self._blur_effect.setBlurRadius(blur_value)
            except RuntimeError:
                self._blur_effect = None
        if self._lang_btn_blur_effect is not None:
            try:
                self._lang_btn_blur_effect.setBlurRadius(blur_value)
            except RuntimeError:
                self._lang_btn_blur_effect = None
 
    def _run_shake(self):
        for i, dx in enumerate(SHAKE_OFFSETS):
            QTimer.singleShot(i * SHAKE_STEP_MS, lambda d=dx: self._move_for_shake(d))
 
    def _move_for_shake(self, dx):
        if self._original_pos is None:
            return
        self.move(self._original_pos.x() + dx, self._original_pos.y())
 
    def _apply_language_after_fx(self):
        if self._pending_lang:
            self.lang = self._pending_lang
            set_app_language(self.lang)
            self.apply_language()
 
        self._blur_anim_out = QVariantAnimation(self)
        self._blur_anim_out.setDuration(LANG_BLUR_OUT_MS)
        self._blur_anim_out.setStartValue(LANG_BLUR_MAX)
        self._blur_anim_out.setEndValue(0.0)
        self._blur_anim_out.valueChanged.connect(self._set_blur_value)
        self._blur_anim_out.finished.connect(self._finish_language_fx)
        self._blur_anim_out.start()
 
    def _finish_language_fx(self):
        if self._original_pos is not None:
            self.move(self._original_pos)
 
        self.bg.setGraphicsEffect(None)
        self.lang_btn.setGraphicsEffect(None)
 
        self._blur_effect = None
        self._lang_btn_blur_effect = None
 
        self.lang_btn.setEnabled(True)
        self._lang_anim_running = False
        self._pending_lang = None
 
    def apply_language(self):
        self.header.setText(self.t("header"))
        self.title.setText(self.t("title"))
        self.patch_btn.refresh_language()
        self.card.refresh_language()
        self.lang_btn.set_code(self.lang)
 
    def pick_file(self):
        path, _ = QFileDialog.getOpenFileName(
            self,
            self.t("select_video_dialog"),
            "",
            "MP4 files (*.mp4);;All files (*.*)"
        )
        if not path:
            return
 
        self.input_path = path
        in_path = Path(path)
        self.output_path = str(in_path.with_name(f"{in_path.stem}_AlterE.mp4"))
 
        self.card.set_busy(False)
        self.card.set_progress(0)
        self.card.set_filename(in_path.name)
 
    def start_patch(self):
        if self.worker and self.worker.isRunning():
            self.show_toast(self.t("busy_title"), self.t("busy_message"))
            return
 
        if not self.input_path or not Path(self.input_path).exists():
            self.show_toast(self.t("error_title"), self.t("choose_existing_mp4"))
            return
 
        self.patch_btn.setEnabled(False)
        self.card.set_busy(True)
        self.card.set_progress(0)
 
        self.worker = PatchWorker(self.input_path, self.output_path)
        self.worker.progress_changed.connect(self.card.set_progress)
        self.worker.finished_ok.connect(self.on_patch_done)
        self.worker.failed.connect(self.on_patch_failed)
        self.worker.start()
 
    def on_patch_done(self, out):
        self.patch_btn.setEnabled(True)
        self.card.set_busy(False)
        self.card.set_progress(100)
 
        self.worker = None
        self.input_path = ""
        self.output_path = ""
 
        self.show_toast(
            self.t("done_title"),
            self.t("saved_message", path=out).replace("\n", " ")
        )
        QTimer.singleShot(150, self.card.clear_selection)
 
    def on_patch_failed(self, err):
        self.patch_btn.setEnabled(True)
        self.card.set_busy(False)
        self.card.set_progress(0)
 
        self.worker = None
 
        self.show_toast(
            self.t("error_title"),
            self.t("source_error", text=err).replace("\n", " ")
        )
 
    def open_link(self, event):
        if event.button() != Qt.LeftButton:
            return
        self.footer._animate_to(0.93)
        QTimer.singleShot(160, self._restore_footer_and_open)
 
    def _restore_footer_and_open(self):
        self.footer._animate_to(1.0)
        QDesktopServices.openUrl(QUrl("https://t.me/alterediting"))
 
 
def run_gui(argv):
    app = QApplication(argv)
    window = MainWindow()
    window.show()
    raise SystemExit(app.exec())
 