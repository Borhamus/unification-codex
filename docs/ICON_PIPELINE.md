# Icon Pipeline

Pasos para agregar o actualizar íconos de facciones.

## Requisitos
- Python con Pillow instalado: `pip install Pillow`
- Variables de entorno seteadas en PowerShell:
```powershell
$env:SUPABASE_URL = "https://hjolwvintrwrgegkmgdk.supabase.co"
$env:SUPABASE_KEY = "tu-anon-key"
```

---

## Paso 1 — Extraer íconos del juego

Abrís el `.sga` correspondiente en Corsix Mod Studio:
- Íconos vanilla + chaos: `core_data_art_1.sga`
- Íconos por facción extra: `dg_data.sga`, `ba_data.sga`, etc.

En Corsix: click derecho en `art\ui\ingame\` → **Dump all to files** → guardás en:
```
C:\Users\Administrator\Desktop\UNIFICATION RANKS\Icons\[nombre_faccion]\
```

---

## Paso 2 — Convertir TGA a PNG

Los íconos del juego están en `.tga`. El browser necesita `.png`.

```powershell
python apps\client\convert_icons.py "C:\...\Icons\[nombre_faccion]" "docs\Icons\PNG\[nombre_faccion]"
```

Ejemplo para Death Guard:
```powershell
python apps\client\convert_icons.py "C:\Users\Administrator\Desktop\UNIFICATION RANKS\Icons\death_guard" "docs\Icons\PNG\death_guard"
```

---

## Paso 3 — Subir a Supabase Storage

```powershell
$env:SUPABASE_URL = "https://hjolwvintrwrgegkmgdk.supabase.co"
$env:SUPABASE_KEY = "tu-anon-key"

python apps\client\upload_icons.py "docs\Icons\PNG\[nombre_faccion]"
```

Para subir una sola carpeta nueva sin repetir todo:
```powershell
python apps\client\upload_icons.py "docs\Icons\PNG\death_guard"
```

Para subir todo de una (si agregás varias facciones):
```powershell
python apps\client\upload_icons.py "docs\Icons\PNG"
```

---

## URL base de los íconos en Supabase

```
https://hjolwvintrwrgegkmgdk.supabase.co/storage/v1/object/public/icons/
```

Ejemplo de URL completa:
```
.../icons/death_guard/daemon_prince_icon.png
.../icons/chaos_icons/marine_icon.png
```

---

## Carpetas actuales en Supabase Storage

| Carpeta | Facciones cubiertas |
|---|---|
| `chaos_icons/` | Chaos Marines, Death Guard (provisorio) |
| `emperors_children_icons/` | Emperor's Children |
| `space_marine_icons/` | Blood Angels, 13th Company, Imperial Fists |
| `tyranids_icons/` | Tyranids |
| `race_tyranid_icons/` | Tyranids (íconos de raza) |
| `darkangels_icons/` | Dark Angels, Fallen Angels |
| `guard_icons/` | Steel Legion, Praetorian Guard |
| `sisters_icons/` | Witch Hunters |
| `eldar_icons/` | Eldar, Harlequins |
| `dark_eldar_icons/` | Dark Eldar |
| `necron_icons/` | Necrons |
| `ork_icons/` | Orks |
| `tau_icons/` | Tau, Farsight Enclaves |
| `inquisition_icons/` | Inquisition Daemonhunters |
| `renegade_icons/` | Renegade Guard |
| `salamanders_icons/` | Salamanders |
| `death_guard/` | Death Guard (íconos específicos) |

---

## Notas

- El script usa `x-upsert: true` — si un ícono ya existe lo reemplaza sin error.
- Los espacios en nombres de archivo se reemplazan automáticamente por `_`.
- Si un ícono no se encuentra en el frontend, se muestra un ícono genérico por categoría.