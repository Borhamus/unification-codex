import os, sys, json
from pathlib import Path

def normalize(name):
    return name.lower().replace('_', ' ').replace('-', ' ')

def score(unit_name, icon_name):
    u = normalize(unit_name)
    i = normalize(icon_name.replace('_icon', '').replace('.png', ''))
    u_words = set(u.split())
    i_words = set(i.split())
    common = u_words & i_words
    noise = {'death', 'guard', 'squad', 'infantry', 'icon', 'multi', 'old'}
    common -= noise
    if not common:
        return 0
    return len(common) / max(len(u_words), len(i_words))

def build_mapping(icons_dir, units_json, output_json):
    icon_path = Path(icons_dir)
    icons = [f.name for f in icon_path.glob('*.png')]
    print(f"Icons: {len(icons)}")

    with open(units_json) as f:
        units = json.load(f)
    print(f"Units: {len(units)}")

    mapping = {}
    unmatched = []

    for unit in units:
        name = unit.get('unit_name', '')
        faction = unit.get('faction', '')
        prefix = f"{faction}_"
        base = name.replace(prefix, '') if name.startswith(prefix) else name

        # Try exact match first
        exact = f"{base}_icon.png"
        if exact in icons:
            mapping[name] = exact
            continue

        # Try without _icon suffix
        plain = f"{base}.png"
        if plain in icons:
            mapping[name] = plain
            continue

        # Fuzzy match
        best_icon = None
        best_score = 0
        for icon in icons:
            s = score(base, icon)
            if s > best_score:
                best_score = s
                best_icon = icon

        if best_score >= 0.25:
            mapping[name] = best_icon
        else:
            unmatched.append(name)

    with open(output_json, 'w') as f:
        json.dump(mapping, f, indent=2)

    print(f"\nMapped: {len(mapping)}")
    print(f"Unmatched: {len(unmatched)}")
    if unmatched[:5]:
        print("Sample unmatched:")
        for u in unmatched[:5]:
            print(f"  - {u}")
    print(f"\nOutput: {output_json}")

    # Show sample matches
    print("\nSample matches:")
    for k, v in list(mapping.items())[:10]:
        print(f"  {k} → {v}")

if __name__ == '__main__':
    if len(sys.argv) < 4:
        print("Usage: python map_icons.py <icons_dir> <units.json> <output_mapping.json>")
        print("Example: python apps\\client\\map_icons.py docs\\Icons\\PNG\\death_guard docs\\Stats\\death_guard.json docs\\Icons\\death_guard_mapping.json")
        sys.exit(1)
    build_mapping(sys.argv[1], sys.argv[2], sys.argv[3])