#!/usr/bin/env python3
"""
Update all Gemini model references to use ADK-compatible format
This script updates all Python files in the project.
"""

import os
import re
from pathlib import Path

# Model to replace
OLD_MODEL = "models/gemini-flash-latest"
NEW_MODEL = "gemini-flash-latest-001"

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
    print("🔄 Updating Gemini Model References to ADK Format")
    print("=" * 80)
    print(f"Old model: {OLD_MODEL}")
    print(f"New model: {NEW_MODEL} (ADK compatible)")
    print()
    
    # Find all Python files
    for py_file in base_dir.rglob("*.py"):
        # Skip this script itself
        if py_file.name == "update_models_adk.py":
            continue
            
        # Skip __pycache__ and .venv
        if "__pycache__" in str(py_file) or ".venv" in str(py_file):
            continue
        
        if update_file(py_file):
            rel_path = py_file.relative_to(base_dir)
            updated_files.append(str(rel_path))
            print(f"✅ Updated: {rel_path}")
    
    print()
    print("=" * 80)
    print(f"✨ Updated {len(updated_files)} files")
    print("=" * 80)
    
    if updated_files:
        print("\nUpdated files:")
        for f in updated_files:
            print(f"  - {f}")
    else:
        print("\n✅ All files already using the correct model!")

if __name__ == "__main__":
    main()
