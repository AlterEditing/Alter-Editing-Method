import argparse
import sys

from core import patch_ps1_mode, tr
from ui import run_gui


def main() -> None:
    parser = argparse.ArgumentParser(description=tr("cli_description"))
    parser.add_argument("input", nargs="?", help=tr("cli_input_help"))
    parser.add_argument("-o", "--output", help=tr("cli_output_help"))
    parser.add_argument("--patch-only", action="store_true", help=tr("cli_patch_only_help"))
    args = parser.parse_args()

    if args.patch_only or args.input:
        if not args.input:
            raise SystemExit(tr("cli_specify_mp4"))
        out = patch_ps1_mode(args.input, args.output)
        print(tr("cli_done", path=out))
        return

    run_gui(sys.argv)


if __name__ == "__main__":
    main()