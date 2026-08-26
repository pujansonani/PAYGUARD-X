#!/usr/bin/env python3
"""
PAYGUARD-X Submission Packager & Build Script
Creates a clean, production-ready distribution ZIP archive excluding heavy dependencies (node_modules, venv, caches, etc.)
"""

import os
import zipfile
import sys
from pathlib import Path

# Directories and patterns to exclude from submission zip
EXCLUDE_DIRS = {
    "node_modules",
    "venv",
    ".venv",
    "__pycache__",
    ".pytest_cache",
    ".git",
    ".idea",
    ".vscode",
    "dist",
    "build",
    ".coverage",
    ".next",
    ".turbo"
}

EXCLUDE_EXTENSIONS = {
    ".pyc",
    ".pyo",
    ".pyd",
    ".DS_Store",
    ".zip",
    ".tar.gz",
    ".tgz"
}

def should_exclude(rel_path: str) -> bool:
    parts = Path(rel_path).parts
    for part in parts:
        if part in EXCLUDE_DIRS or part.startswith("."):
            if part not in [".", ".."]:
                return True
    _, ext = os.path.splitext(rel_path)
    if ext in EXCLUDE_EXTENSIONS:
        return True
    return False

def build_zip(output_zip_name: str = "PAYGUARD_X_SUBMISSION.zip"):
    root_dir = Path(__file__).resolve().parent
    output_path = root_dir / output_zip_name

    print("=" * 60)
    print(f"📦 PAYGUARD-X Archive Builder")
    print(f"📂 Root Directory: {root_dir}")
    print(f"🎁 Target Archive: {output_path.name}")
    print("=" * 60)

    if output_path.exists():
        os.remove(output_path)
        print(f"ℹ️  Removed existing archive: {output_path.name}")

    included_count = 0
    total_uncompressed_bytes = 0

    with zipfile.ZipFile(output_path, "w", zipfile.ZIP_DEFLATED, compresslevel=9) as zipf:
        for foldername, subfolders, filenames in os.walk(root_dir):
            # Prune excluded subfolders in-place to speed up walking
            subfolders[:] = [d for d in subfolders if d not in EXCLUDE_DIRS and not d.startswith(".")]

            for filename in filenames:
                full_path = os.path.join(foldername, filename)
                rel_path = os.path.relpath(full_path, root_dir)

                if should_exclude(rel_path) or filename == output_zip_name:
                    continue

                zipf.write(full_path, rel_path)
                file_size = os.path.getsize(full_path)
                total_uncompressed_bytes += file_size
                included_count += 1

    archive_size_bytes = os.path.getsize(output_path)
    archive_size_mb = archive_size_bytes / (1024 * 1024)
    uncompressed_mb = total_uncompressed_bytes / (1024 * 1024)
    ratio = (1.0 - (archive_size_bytes / (total_uncompressed_bytes + 1e-9))) * 100

    print(f"✅ Archive created successfully!")
    print(f"📄 Total files packaged: {included_count}")
    print(f"📊 Uncompressed size: {uncompressed_mb:.2f} MB")
    print(f"🗜️  Compressed zip size: {archive_size_mb:.2f} MB (Compression savings: {ratio:.1f}%)")
    print(f"📍 Location: {output_path}")
    print("=" * 60)

if __name__ == "__main__":
    zip_name = sys.argv[1] if len(sys.argv) > 1 else "PAYGUARD_X_SUBMISSION.zip"
    build_zip(zip_name)
