import json, os
from pathlib import Path

factions = ['death_guard', '13th_company', 'tyranids']

for faction in factions:
    mapping_file = Path(f'docs/Icons/{faction}_mapping.json')
    if not mapping_file.exists():
        print(f'Skipping {faction} — mapping not found')
        continue

    with open(mapping_file) as f:
        data = json.load(f)

    out_dir = Path('apps/web/app/balance/icons')
    out_dir.mkdir(parents=True, exist_ok=True)

    out_file = out_dir / f'{faction}.ts'
    lines = [f'export const ICONS: Record<string, string> = {{']
    for k, v in data.items():
        lines.append(f'  "{k}": "{v}",')
    lines.append('}')

    with open(out_file, 'w') as f:
        f.write('\n'.join(lines))

    print(f'{faction}: {len(data)} entries → {out_file}')

print('\nDone!')