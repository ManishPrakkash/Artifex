#!/usr/bin/env python3
"""
Update all Gemini model references to use gemini-flash-latest (ADK compatible)
"""

import os
from pathlib import Path

OLD_MODEL = "gemini-flash-latest"
NEW_MODEL = "gemini-flash-latest"

def update_file(filepath):
    """Update a single file."""
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
        
        original_content = content
        
        # Replace all occurrences
        content = content.replace(f'"{OLD_MODEL}"', f'"{NEW_MODEL}"')
        content = content.replace(f"'{OLD_MODEL}'", f"'{NEW_MODEL}'")
        
        if content != original_content:
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(content)
            return True
        return False
    except Exception as e:
        print(f"Error updating {filepath}: {e}")
        return False

def main():
    base_dir = Path(__file__).parent
    updated_files = []
    
    print("=" * 80)
    print("🔄 Updating to gemini-flash-latest (stable ADK model)")
    print("=" * 80)
    print(f"Old: {OLD_MODEL}")
    print(f"New: {NEW_MODEL}")
    print()
    
    for py_file in base_dir.rglob("*.py"):
        if py_file.name.startswith("update_"):
            continue
        if "__pycache__" in str(py_file) or ".venv" in str(py_file):
            continue
        
        if update_file(py_file):
            rel_path = py_file.relative_to(base_dir)
            updated_files.append(str(rel_path))
            print(f"✅ {rel_path}")
    
    print()
    print(f"✨ Updated {len(updated_files)} files")
    print("=" * 80)

if __name__ == "__main__":
    main()
