"""
parse_lua.py  v3
Reads Corsix-dumped .lua files and extracts unit stats into JSON.

Usage:
    python parse_lua.py --input "docs/Stats/Death_Guard" --output "docs/Stats/death_guard.json" --faction "death_guard"
"""

import os, re, json, argparse


def parse_value(raw):
    raw = raw.rstrip(',').strip()
    if raw == 'true':  return True
    if raw == 'false': return False
    ref = re.match(r'Reference\(\[\[(.+?)\]\]\)', raw)
    if ref: return ref.group(1)          # keep as string placeholder
    emp = re.match(r'\[\[(.*?)\]\]', raw)
    if emp: return emp.group(1) or None
    try:
        return float(raw) if '.' in raw else int(raw)
    except ValueError:
        return raw


def parse_flat_lua(text):
    data = {}
    pat = re.compile(r'GameData((?:\["[^"]+"\])+)\s*=\s*(.+)')
    for line in text.splitlines():
        m = pat.match(line.strip())
        if not m:
            continue
        keys = re.findall(r'"([^"]+)"', m.group(1))
        value = parse_value(m.group(2).strip())

        node = data
        for k in keys[:-1]:
            existing = node.get(k)
            # If it was stored as a string (Reference placeholder), upgrade to dict
            if existing is None or isinstance(existing, str):
                node[k] = {}
            node = node[k]

        last = keys[-1]
        existing = node.get(last)
        # If we're assigning a Reference but a dict already exists, keep the dict
        if isinstance(existing, dict) and isinstance(value, str):
            pass  # keep existing dict, discard string
        elif isinstance(existing, str) and isinstance(value, dict):
            node[last] = value
        else:
            node[last] = value

    return data


def get(d, *keys, default=None):
    node = d
    for k in keys:
        if not isinstance(node, dict) or k not in node:
            return default
        node = node[k]
    return node


def ref_basename(val):
    if not val or not isinstance(val, str):
        return None
    return val.replace('\\', '/').split('/')[-1].replace('.lua', '')


EXCLUDE_CONTAINS = [
    '_ktgm', '_sp_dxp3', '_advance_sp', '_hg_dxp3',
    '_stronghold_sp', '_single_player',
    '_dummy', '_hazard', '_clone', '_prisoner',
    'tree_', 'fs_', 'nc_', 'sh_', 'td_',
    '_surv', '_bonus', '_gi.', '_wg.', '_nb.',
    '_dc.', 'placeholder',
]

def is_excluded(filename):
    name = filename.lower()
    return any(s in name for s in EXCLUDE_CONTAINS)


def parse_unit(filepath, faction):
    with open(filepath, 'r', encoding='utf-8', errors='ignore') as f:
        text = f.read()

    filename  = os.path.basename(filepath)
    unit_name = filename.replace('.lua', '')
    data      = parse_flat_lua(text)

    health = data.get('health_ext', {})
    hp = get(health, 'hitpoints')
    if hp is None:
        return None

    is_builder   = 'building_engineer_ext' in data
    is_structure = 'structure_ext' in data or 'structure_buildable_ext' in data
    has_melee    = 'melee_ext' in data
    has_ability  = 'ability_ext' in data
    has_synckill = 'synckill_ext' in data
    has_spawn    = 'spawn_ext' in data
    has_special  = 'special_attack_ext' in data

    entity_type = 'structure' if is_structure else ('builder' if is_builder else 'troop')

    cost = get(data, 'cost_ext', 'time_cost', 'cost') or {}
    moving = data.get('moving_ext', {})

    def cover_val(ct):
        return get(data, 'cover_ext', ct, 'modifiers', 'modifier_01', 'value')

    unit = {
        'unit_name':   unit_name,
        'faction':     faction,
        'entity_type': entity_type,
        'name_id':     get(data, 'ui_ext', 'ui_info', 'screen_name_id') or '',
    }

    def add(key, val, skip_zero=False):
        if val is None: return
        if skip_zero and val == 0: return
        unit[key] = val

    # Health
    add('hp',              hp)
    add('armour',          get(health, 'armour'))
    add('armour_minimum',  get(health, 'armour_minimum'))
    add('regen',           get(health, 'regeneration_rate'))
    add('regen_in_combat', get(health, 'regeneration_decrease_in_combat'))
    add('can_be_repaired', get(health, 'can_be_repaired'))
    add('invulnerable',    get(health, 'invulnerable'))
    add('morale_death',    get(health, 'morale_death'))
    add('poison_damage',   get(health, 'poison_damage'))
    add('poison_duration', get(health, 'poison_damage_duration'))
    add('poison_immunity', get(health, 'poison_immunity_duration'))

    # Cost
    add('req',        get(cost, 'requisition'))
    add('power',      get(cost, 'power'))
    add('pop',        get(cost, 'population'))
    add('faith',      get(cost, 'faith'),  skip_zero=True)
    add('souls',      get(cost, 'souls'),  skip_zero=True)
    add('build_time', get(data, 'cost_ext', 'time_cost', 'time_seconds'))

    # Movement
    add('speed_max', get(moving, 'speed_max'))
    add('speed_min', get(moving, 'speed_min'))
    add('move_type', ref_basename(get(moving, 'move_type')))

    # Sight
    add('sight',      get(data, 'sight_ext', 'sight_radius'))
    add('keen_sight', get(data, 'sight_ext', 'keen_sight_radius'))

    # Infiltration
    add('infiltrate_opacity', get(data, 'infiltration_ext', 'enemy_infiltrate_opacity'))
    add('infiltrate_delay',   get(data, 'infiltration_ext', 'initial_delay_time'))

    # Combat
    add('accuracy_mult', get(data, 'combat_ext', 'accuracy_multiplier'))
    add('melee_accuracy', get(data, 'melee_ext', 'accuracy'))

    # Cover
    add('cover_heavy',    cover_val('cover_heavy'))
    add('cover_light',    cover_val('cover_light'))
    add('cover_negative', cover_val('cover_negative'))
    add('cover_stealth',  cover_val('cover_stealth'))

    # Type
    add('type_armour',  ref_basename(get(data, 'type_ext', 'type_armour')))
    add('type_surface', ref_basename(get(data, 'type_ext', 'type_surface')))

    # Structure economy
    add('power_gift', get(data, 'structure_buildable_ext', 'power_gift'), skip_zero=True)
    add('req_gift',   get(data, 'structure_buildable_ext', 'requisition_gift'), skip_zero=True)

    # Flags
    unit.update({
        'is_builder': is_builder, 'is_structure': is_structure,
        'has_melee': has_melee, 'has_ability': has_ability,
        'has_synckill': has_synckill, 'has_spawn': has_spawn,
        'has_special_attack': has_special,
    })

    return unit


def main():
    p = argparse.ArgumentParser()
    p.add_argument('--input',            required=True)
    p.add_argument('--output',           required=True)
    p.add_argument('--faction',          required=True)
    p.add_argument('--include-excluded', action='store_true')
    args = p.parse_args()

    lua_files = sorted(f for f in os.listdir(args.input) if f.endswith('.lua'))
    print(f"Found {len(lua_files)} .lua files in {args.input}")

    units, skipped_filter, skipped_no_hp = [], [], []

    for filename in lua_files:
        if not args.include_excluded and is_excluded(filename):
            skipped_filter.append(filename)
            continue
        unit = parse_unit(os.path.join(args.input, filename), args.faction)
        if unit is None:
            skipped_no_hp.append(filename)
        else:
            units.append(unit)

    os.makedirs(os.path.dirname(args.output) or '.', exist_ok=True)
    with open(args.output, 'w', encoding='utf-8') as f:
        json.dump(units, f, indent=2, ensure_ascii=False)

    print(f"\n✅ Parsed {len(units)} units  →  {args.output}")
    print(f"   Skipped (filter): {len(skipped_filter)}")
    print(f"   Skipped (no HP):  {len(skipped_no_hp)}")
    if skipped_no_hp:
        print("\n   Files with no HP:")
        for fn in skipped_no_hp:
            print(f"     - {fn}")

    if units:
        print(f"\n   Preview — {units[0]['unit_name']}:")
        print(json.dumps({k:v for k,v in list(units[0].items())[:15]}, indent=4))


if __name__ == '__main__':
    main()