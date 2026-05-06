import os, sys
from pathlib import Path

def convert(input_dir, output_dir):
    try:
        from PIL import Image
    except ImportError:
        print("Run: pip install Pillow")
        sys.exit(1)

    input_path  = Path(input_dir)
    output_path = Path(output_dir)
    output_path.mkdir(parents=True, exist_ok=True)

    tga_files = list(input_path.rglob("*.tga"))
    print(f"Found {len(tga_files)} .tga files in {input_dir}")

    converted, errors = 0, 0

    for tga in tga_files:
        try:
            rel = tga.relative_to(input_path)
            out = output_path / rel.with_suffix(".png")
            out.parent.mkdir(parents=True, exist_ok=True)
            img = Image.open(tga)
            img.save(out, "PNG")
            converted += 1
        except Exception as e:
            errors += 1
            print(f"  Error: {tga.name} -> {e}")

    print(f"Done: {converted} converted, {errors} errors")
    print(f"Output: {output_path}")

if __name__ == "__main__":
    if len(sys.argv) < 3:
        print("Usage: python convert_icons.py <input_tga_folder> <output_png_folder>")
        print("Example: python apps\\client\\convert_icons.py docs\\Icons\\Raw docs\\Icons\\PNG")
        sys.exit(1)
    convert(sys.argv[1], sys.argv[2])