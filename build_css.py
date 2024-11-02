import os
import subprocess
import argparse
import time
import signal
import sys
from typing import Optional


def signal_handler(sig: int, frame: Optional[signal.FrameType]) -> None:
    """Handle signals for graceful exit."""
    print("\nExiting...")  # Print a message on exit
    sys.exit(0)  # Exit the program gracefully


def build_css(watch: bool = False) -> None:
    """Build Tailwind CSS and optionally watch for changes."""
    # Define paths
    input_path = "app/static/css/input.css"
    output_path = "app/static/css/tailwind.css"

    # Determine the correct Tailwind CLI path based on the OS
    tailwind_cli_path: str = (
        "./tailwind/tailwindcss.exe" if os.name == "nt" else "./tailwind/tailwindcss"
    )

    # Check if input file exists
    if not os.path.isfile(input_path):
        print(f"Error: Input file '{input_path}' not found.")
        return

    # Check if Tailwind CLI is executable
    if not os.access(tailwind_cli_path, os.X_OK):
        print(f"Error: Tailwind CLI '{tailwind_cli_path}' is not executable.")
        return

    # Build CSS with Tailwind CLI
    command = [tailwind_cli_path, "-i", input_path, "-o", output_path, "--minify"]

    if watch:
        run_watch_mode(command)
    else:
        try:
            subprocess.run(command, check=True)
            print("CSS built successfully.")
        except subprocess.CalledProcessError as e:
            print(f"Error during CSS build: {e}")
        except Exception as e:
            print(f"An unexpected error occurred: {e}")


def run_watch_mode(command: list) -> None:
    """Run the Tailwind CLI in watch mode."""
    try:
        print("Watching for changes... (Press Ctrl+C to stop)")
        while True:
            subprocess.run(command, check=True)
            time.sleep(1)  # Optional: Sleep to avoid tight loop
    except KeyboardInterrupt:
        print("\nWatch mode stopped by user.")
    except subprocess.CalledProcessError as e:
        print(f"Error during CSS build: {e}")
    except Exception as e:
        print(f"An unexpected error occurred: {e}")


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Build Tailwind CSS.")
    parser.add_argument(
        "--watch",
        action="store_true",
        help="Watch for changes and rebuild CSS automatically.",
    )
    args = parser.parse_args()

    # Register the signal handler for safe exit
    signal.signal(signal.SIGINT, signal_handler)

    build_css(watch=args.watch)
