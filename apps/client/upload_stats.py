import json, sys, os, urllib.request, urllib.error
from pathlib import Path
 
SUPABASE_URL = os.getenv("SUPABASE_URL") or os.getenv("NEXT_PUBLIC_SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY") or os.getenv("NEXT_PUBLIC_SUPABASE_ANON_KEY")
MOD_VERSION  = "1.0.0"
SKIP_CATEGORIES = {'other', 'addon', 'racebp', 'game'}
 
# Todos los campos de la tabla con sus valores por defecto
SCHEMA = {
    'unit_name':   None,
    'faction':     None,
    'category':    None,
    'mod_version': MOD_VERSION,
    'name_id':     None,
    'source_path': None,
    'hp':          None,
    'armour':      None,
    'regen':       None,
    'req':         None,
    'power':       None,
    'pop':         None,
    'build_time':  None,
    'speed_max':   None,
    'sight':       None,
    'max_range':   None,
    'accuracy':    None,
    'reload_time': None,
    'is_structure': False,
    'is_builder':   False,
    'has_melee':    False,
}
 
def check_config():
    if not SUPABASE_URL or not SUPABASE_KEY:
        print("ERROR: Missing Supabase credentials.")
        print("  set SUPABASE_URL=https://xxxx.supabase.co")
        print("  set SUPABASE_KEY=eyJxxx...")
        sys.exit(1)
 
def upsert_batch(rows):
    url = f"{SUPABASE_URL}/rest/v1/units?on_conflict=unit_name,faction,mod_version"
    data = json.dumps(rows).encode('utf-8')
    req = urllib.request.Request(
        url, data=data, method='POST',
        headers={
            'apikey':        SUPABASE_KEY,
            'Authorization': f'Bearer {SUPABASE_KEY}',
            'Content-Type':  'application/json',
            'Prefer':        'resolution=merge-duplicates',
        }
    )
    try:
        with urllib.request.urlopen(req) as resp:
            return True, resp.status
    except urllib.error.HTTPError as e:
        body = e.read().decode('utf-8')
        return False, f"{e.code} {body[:300]}"
 
def clean_unit(unit):
    # Start with all fields set to None/default
    row = dict(SCHEMA)
 
    # unit_name — just the filename
    name = unit.get('unit_name', '')
    row['unit_name'] = name.replace('\\', '/').split('/')[-1] if ('\\' in name or '/' in name) else name
 
    row['faction']     = unit.get('faction', '')
    row['category']    = unit.get('category', 'other')
    row['mod_version'] = MOD_VERSION
 
    if unit.get('name_id'):
        row['name_id'] = str(unit['name_id'])
    if unit.get('source_path'):
        row['source_path'] = unit['source_path']
 
    for field in ['hp', 'armour', 'regen', 'req', 'power', 'pop',
                  'build_time', 'speed_max', 'sight', 'max_range', 'reload_time']:
        val = unit.get(field)
        if val is not None:
            try:
                row[field] = int(round(float(val)))
            except (ValueError, TypeError):
                pass
 
    val = unit.get('accuracy')
    if val is not None:
        try:
            row['accuracy'] = round(float(val), 4)
        except (ValueError, TypeError):
            pass
 
    for field in ['is_structure', 'is_builder', 'has_melee']:
        if field in unit:
            row[field] = bool(unit[field])
 
    return row
 
def upload_file(json_path):
    with open(json_path, encoding='utf-8') as f:
        data = json.load(f)
 
    print(f"\nUploading: {json_path.name}  ({len(data)} entries)")
    units = [u for u in data if u.get('category') not in SKIP_CATEGORIES]
    print(f"  After filter: {len(units)} entries")
 
    rows = [clean_unit(u) for u in units]
    # Deduplicate by unit_name+faction
    seen = set()
    deduped = []
    for r in rows:
        key = (r.get("unit_name"), r.get("faction"))
        if key not in seen:
            seen.add(key)
            deduped.append(r)
    rows = deduped
    rows = [r for r in rows if r.get('unit_name') and r.get('faction')]
 
    BATCH = 100
    inserted, errors = 0, 0
 
    for i in range(0, len(rows), BATCH):
        batch = rows[i:i+BATCH]
        ok, status = upsert_batch(batch)
        if ok:
            inserted += len(batch)
            print(f"  Batch {i//BATCH + 1}: {len(batch)} rows OK")
        else:
            errors += len(batch)
            print(f"  Batch {i//BATCH + 1}: ERROR -> {status}")
 
    print(f"  Done: {inserted} inserted, {errors} errors")
    return inserted, errors
 
def main():
    if len(sys.argv) < 2:
        print("Usage:")
        print("  python upload_stats.py docs/Stats/death_guard.json")
        print("  python upload_stats.py docs/Stats/")
        sys.exit(1)
 
    check_config()
    target = Path(sys.argv[1])
    total_ins, total_err = 0, 0
 
    if target.is_dir():
        json_files = sorted(target.glob('*.json'))
        print(f"Found {len(json_files)} JSON files in {target}")
        for jf in json_files:
            ins, err = upload_file(jf)
            total_ins += ins
            total_err += err
    elif target.is_file():
        ins, err = upload_file(target)
        total_ins += ins
        total_err += err
    else:
        print(f"ERROR: {target} not found")
        sys.exit(1)
 
    print(f"\n{'='*40}")
    print(f"Total inserted: {total_ins}")
    print(f"Total errors:   {total_err}")
 
if __name__ == '__main__':
    main()