import os, sys, urllib.request, urllib.error
from pathlib import Path

SUPABASE_URL = os.getenv("SUPABASE_URL") or os.getenv("NEXT_PUBLIC_SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY") or os.getenv("NEXT_PUBLIC_SUPABASE_ANON_KEY")
BUCKET = "icons"

def check_config():
    if not SUPABASE_URL or not SUPABASE_KEY:
        print("Set SUPABASE_URL and SUPABASE_KEY environment variables")
        sys.exit(1)

def sanitize(path_str):
    return path_str.replace(" ", "_").replace("\\", "/")

def upload_file(local_path, storage_path):
    safe_path = sanitize(storage_path)
    url = f"{SUPABASE_URL}/storage/v1/object/{BUCKET}/{safe_path}"
    with open(local_path, "rb") as f:
        data = f.read()
    req = urllib.request.Request(
        url, data=data, method="POST",
        headers={
            "apikey": SUPABASE_KEY,
            "Authorization": f"Bearer {SUPABASE_KEY}",
            "Content-Type": "image/png",
            "x-upsert": "true",
        }
    )
    try:
        with urllib.request.urlopen(req) as resp:
            return True, safe_path
    except urllib.error.HTTPError as e:
        body = e.read().decode("utf-8")[:120]
        return False, f"{e.code}: {body}"

def main():
    if len(sys.argv) < 2:
        print("Usage:")
        print("  python upload_icons.py docs/Icons/PNG              <- upload all")
        print("  python upload_icons.py docs/Icons/PNG death_guard  <- upload one folder")
        sys.exit(1)

    check_config()
    base = Path(sys.argv[1])

    # Optional folder filter
    folder_filter = sys.argv[2] if len(sys.argv) > 2 else None

    if folder_filter:
        # Upload only files inside base/folder_filter/
        # but store them as folder_filter/filename.png
        target = base / folder_filter
        pngs = list(target.rglob("*.png"))
        print(f"Found {len(pngs)} PNG files in {target}")
    else:
        pngs = list(base.rglob("*.png"))
        print(f"Found {len(pngs)} PNG files in {base}")

    uploaded, errors = 0, 0
    for i, png in enumerate(pngs):
        # Always relative to base so subfolder name is preserved
        storage_path = str(png.relative_to(base))
        ok, info = upload_file(png, storage_path)
        if ok:
            uploaded += 1
        else:
            errors += 1
            if errors <= 3:
                print(f"  Error: {storage_path} -> {info}")

        if (i + 1) % 50 == 0:
            print(f"  Progress: {i+1}/{len(pngs)} ({uploaded} ok, {errors} errors)")

    print(f"\nDone: {uploaded} uploaded, {errors} errors")
    print(f"Base URL: {SUPABASE_URL}/storage/v1/object/public/{BUCKET}/")

if __name__ == "__main__":
    main()