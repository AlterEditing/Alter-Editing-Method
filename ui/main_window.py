import os
import sys
from pathlib import Path

from PySide6.QtCore import QThread, Qt, Signal
from PySide6.QtGui import QIcon
from PySide6.QtWidgets import (
    QFileDialog,
    QLabel,
    QMainWindow,
    QMessageBox,
    QVBoxLayout,
)

from core.engine import VideoPatcherEngine
from ui.widgets import ParticlesBackground, Divider, UploadCard, PatchButton

UI_BLOCK_OFFSET = 0


def resource_path(relative_path: str) -> str:
    try:
        base_path = sys._MEIPASS
    except Exception:
        base_path = os.path.abspath('.')
    return os.path.join(base_path, relative_path)


class WorkerThread(QThread):
    """
    Обертка над логикой для Qt.
    Позволяет ядру (VideoPatcherEngine) работать в фоне, не блокируя UI.
    """
    progress_changed = Signal(int)
    finished_ok = Signal(str)
    failed = Signal(str)

    def __init__(self, engine: VideoPatcherEngine, input_path: str, output_path: str):
        super().__init__()
        self.engine = engine
        self.input_path = input_path
        self.output_path = output_path

    def run(self):
        try:
            # Передаем метод сигнала как коллбэк для прогресса
            result_path = self.engine.process(
                self.input_path,
                self.output_path,
                progress_callback=self.progress_changed.emit
            )
            self.finished_ok.emit(result_path)
        except Exception as exc:
            self.failed.emit(str(exc))


class MainWindow(QMainWindow):
    def __init__(self, engine: VideoPatcherEngine) -> None:
        super().__init__()
        self.engine = engine  # Сохраняем логику
        self.worker: WorkerThread | None = None

        self.input_path = ''
        self.output_path = ''

        self.setWindowTitle('pewpew')
        self.setFixedSize(394, 675)
        try:
            self.setWindowIcon(QIcon(resource_path('icon.ico')))
        except Exception:
            pass

        self._setup_ui()

    def _setup_ui(self):
        self.bg = ParticlesBackground()
        self.setCentralWidget(self.bg)

        self.root_layout = QVBoxLayout(self.bg)
        self.root_layout.setContentsMargins(28, 26, 28, 22)
        self.root_layout.setSpacing(0)

        self.header = QLabel('Editing - Easy Patcher')
        self.header.setStyleSheet(
            "color: rgba(245,248,255,220); font-family: 'Consolas'; font-size: 12px; letter-spacing: 1px;")
        self.root_layout.addWidget(self.header, alignment=Qt.AlignLeft)
        self.root_layout.addSpacing(14)
        self.root_layout.addWidget(Divider(), alignment=Qt.AlignHCenter)

        top_gap = max(0, 72 + UI_BLOCK_OFFSET)
        bottom_gap = max(0, 108 - UI_BLOCK_OFFSET)
        footer_gap = max(0, 22 - max(0, UI_BLOCK_OFFSET // 2))

        self.root_layout.addSpacing(top_gap)

        self.title = QLabel('Video Patcher')
        self.title.setAlignment(Qt.AlignCenter)
        self.title.setStyleSheet("color: #f2f5fb; font-family: 'Segoe UI'; font-size: 20px; font-weight: 600;")
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
            "color: rgba(235,240,250,170); font-family: 'Segoe UI'; font-size: 11px; font-weight: 500;")
        self.root_layout.addWidget(self.footer, alignment=Qt.AlignHCenter)
        self.root_layout.addSpacing(footer_gap)

    def pick_file(self) -> None:
        path, _ = QFileDialog.getOpenFileName(self, 'Select video', '', 'MP4 files (*.mp4);;All files (*.*)')
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

        # Создаем поток и прокидываем в него ядро
        self.worker = WorkerThread(self.engine, self.input_path, self.output_path)
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