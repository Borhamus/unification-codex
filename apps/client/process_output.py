"""
process_output.py
Processes the raw output.json from the Corsix Lua macro
into a clean, categorized JSON ready for Supabase.

Usage:
    python process_output.py <input_json> <output_json> <faction_name>
Example:
    python apps\client\process_output.py docs\Stats\Raw\output.json docs\Stats\death_guard_full.json death_guard
"""

import json, sys, re
from pathlib import Path

EXCLUDE = [
    '_ktgm', '_sp_dxp3', '_advance_sp', '_hg_dxp3',
    '_stronghold_sp', '_single_player', '_dummy',
    '_hazard', '_clone', '_prisoner', 'tree_',
    'sh_', 'td_', '_surv', '_bonus', 'placeholder',
    '_bolt.', '_child', 'spawn_', 'projectile',
    'environment', 'gameplay', '_spawner', '_body',
    'airstrike', '_pox_dummy',
]

def is_excluded(name):
    n = name.lower()
    return any(s in n for s in EXCLUDE)

def categorize(path):
    p = path.lower().replace('\\', '/')
    if '/abilities/' in p:  return 'ability'
    if '/weapon/' in p:     return 'weapon'
    if '/research/' in p:   return 'research'
    if '/sbps/' in p:       return 'squad'
    if '/racebps/' in p:    return 'racebp'
    if '/addons/' in p:     return 'addon'
    if '/troops/' in p:     return 'troop'
    if '/structures/' in p: return 'structure'
    return 'other'

def process(input_path, output_path, faction):
    with open(input_path, encoding='utf-8') as f:
        raw = json.load(f)

    print(f"Input: {len(raw)} entries")

    clean = []
    skipped = 0

    for entry in raw:
        path      = entry.get('path', '')
        unit_name = Path(path).stem

        if is_excluded(unit_name):
            skipped += 1
            continue

        category = categorize(path)

        unit = {
            'unit_name':   unit_name,
            'faction':     faction,
            'category':    category,
            'source_path': path,
        }

        # Copy all non-null values except path
        for k, v in entry.items():
            if k == 'path': continue
            if v is None: continue
            if v == 'null': continue
            unit[k] = v

        # name_id cleanup
        if unit.get('name_id') == 'nil':
            del unit['name_id']

        clean.append(unit)

    # Sort: structures first, then troops, then weapons, etc.
    order = {'structure': 0, 'troop': 1, 'weapon': 2, 
             'ability': 3, 'research': 4, 'squad': 5, 'other': 6}
    clean.sort(key=lambda u: order.get(u['category'], 9))

    with open(output_path, 'w', encoding='utf-8') as f:
        json.dump(clean, f, indent=2, ensure_ascii=False)

    # Stats
    from collections import Counter
    cats = Counter(u['category'] for u in clean)
    with_hp = sum(1 for u in clean if u.get('hp'))
    with_range = sum(1 for u in clean if u.get('max_range'))

    print(f"Output: {len(clean)} entries  ({skipped} skipped)")
    print(f"  With HP:       {with_hp}")
    print(f"  With max_range: {with_range}")
    print(f"  By category:")
    for cat, count in sorted(cats.items()):
        print(f"    {cat}: {count}")
    print(f"\nSaved to: {output_path}")

if __name__ == '__main__':
    if len(sys.argv) < 4:
        print("Usage: python process_output.py <input.json> <output.json> <faction>")
        sys.exit(1)
    process(sys.argv[1], sys.argv[2], sys.argv[3])