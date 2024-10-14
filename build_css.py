import os
import subprocess
import argparse
import time
import signal
import sys


def signal_handler(sig, frame):
    print("\nExiting...")  # Print a message on exit
    sys.exit(0)  # Exit the program gracefully


def build_css(watch=False):
    # Define paths
    input_path = "app/static/css/input.css"
    output_path = "app/static/css/tailwind.css"

    # Determine the correct Tailwind CLI path based on the OS
    tailwind_cli_path: str  # Explicitly define the type
    if os.name == "nt":  # Windows
        tailwind_cli_path = "./tailwind/tailwindcss.exe"
    else:  # Linux/macOS
        tailwind_cli_path = "./tailwind/tailwindcss"

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
        command.append("--watch")

    try:
        # If watching, run in a loop
        while True:
            result = subprocess.run(command, check=True)
            if not watch:  # Exit after one run if not watching
                break
            time.sleep(1)  # Optional: Sleep to avoid tight loop
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
