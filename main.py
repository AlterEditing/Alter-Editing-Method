import sys
from PySide6.QtWidgets import QApplication

from core.engine import VideoPatcherEngine
from ui.main_window import MainWindow


def main() -> None:
    app = QApplication(sys.argv)

    # 1. Инициализируем бизнес-логику (Ядро)
    engine = VideoPatcherEngine(size_per_sec_mb=1.4)

    # 2. Инициализируем UI, внедряя в него ядро (Dependency Injection)
    window = MainWindow(engine=engine)
    window.show()

    sys.exit(app.exec())


if __name__ == '__main__':
    main()