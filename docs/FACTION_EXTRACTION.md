# Faction Extraction Checklist

> Para cada facción: abrí el `.sga` en Corsix → click derecho en `attrib` → Run Macro → pegá `corsix_macro.lua` → Run → luego corré el comando de abajo.
>
> ⚠️ Cambiá el `output.json` generado por Corsix por el path correcto si no lo guardaste en la raíz del repo.

---

## Estado de extracción

### Vanilla (core_data_attrib.sga)
- [ ] Space Marines
- [ ] Chaos
- [ ] Eldar
- [ ] Orks
- [ ] Imperial Guard
- [ ] Necrons
- [ ] Tau
- [ ] Sisters of Battle

### Facciones Extra
- [x] Death Guard ✅
- [x] 13th Company
- [ ] Adeptus Mechanicus
- [ ] Blood Angels
- [ ] Black Templars
- [ ] Chaos Daemons
- [ ] Dark Angels
- [ ] Death Korps of Krieg
- [ ] Emperor's Children (parte 1)
- [ ] Emperor's Children (parte 2 — mergear con parte 1)
- [ ] Farsight Enclaves
- [ ] Fallen Angels
- [ ] Harlequins
- [ ] Inquisition Daemonhunters
- [ ] Imperial Fists
- [ ] Legion of the Damned
- [ ] Night Lords
- [ ] Praetorian Guard
- [ ] Renegade Guard
- [ ] Raven Guard (parte 1)
- [ ] Raven Guard (parte 2 — mergear con parte 1)
- [ ] Salamanders
- [ ] Steel Legion
- [ ] Thousand Sons
- [ ] Tyranids
- [ ] Vostroyan Firstborn
- [ ] World Eaters
- [ ] Witch Hunters
- [ ] Ynnari

---

## Comandos por facción

### 🗡️ Death Guard (`dg_data.sga`) ✅ YA PROCESADA
```bash
python apps\client\process_output.py output.json docs\Stats\death_guard.json death_guard
```

---

### Vanilla — Space Marines, Chaos, Eldar, Orks, Guard, Necrons, Tau, Sisters (`core_data_attrib.sga`)
```bash
python apps\client\process_output.py output.json docs\Stats\vanilla.json vanilla
```

---

### 13th Company (`13th_data.sga`)
```bash
python apps\client\process_output.py "docs\Stats\Raw\output.json" "docs\Stats\13th_company.json" 13th_company
```

---

### Adeptus Mechanicus (`admech_data.sga`)
```bash
python apps\client\process_output.py output.json docs\Stats\adeptus_mechanicus.json adeptus_mechanicus
```

---

### Blood Angels (`ba_data.sga`)
```bash
python apps\client\process_output.py output.json docs\Stats\blood_angels.json blood_angels
```

---

### Black Templars (`bt_data.sga`)
```bash
python apps\client\process_output.py output.json docs\Stats\black_templars.json black_templars
```

---

### Chaos Daemons (`cd_data.sga`)
```bash
python apps\client\process_output.py output.json docs\Stats\chaos_daemons.json chaos_daemons
```

---

### Dark Angels (`da_data.sga`)
```bash
python apps\client\process_output.py output.json docs\Stats\dark_angels.json dark_angels
```

---

### Death Korps of Krieg (`dkok_data.sga`)
```bash
python apps\client\process_output.py output.json docs\Stats\death_korps_krieg.json death_korps_krieg
```

---

### Emperor's Children — Parte 1 (`ec_data_1.sga`)
```bash
python apps\client\process_output.py output.json docs\Stats\emperors_children.json emperors_children
```

### Emperor's Children — Parte 2 (`ec_data_2.sga`)
> ⚠️ Este merge: el script agrega al JSON existente automáticamente
```bash
python apps\client\process_output.py output.json docs\Stats\emperors_children.json emperors_children
```

---

### Farsight Enclaves (`enclaves_data.sga`)
```bash
python apps\client\process_output.py output.json docs\Stats\farsight_enclaves.json farsight_enclaves
```

---

### Fallen Angels (`fa_data.sga`)
```bash
python apps\client\process_output.py output.json docs\Stats\fallen_angels.json fallen_angels
```

---

### Harlequins (`harlies_data.sga`)
```bash
python apps\client\process_output.py output.json docs\Stats\harlequins.json harlequins
```

---

### Inquisition Daemonhunters (`idh_data.sga`)
```bash
python apps\client\process_output.py output.json docs\Stats\inquisition_daemonhunters.json inquisition_daemonhunters
```

---

### Imperial Fists (`if_data.sga`)
```bash
python apps\client\process_output.py output.json docs\Stats\imperial_fists.json imperial_fists
```

---

### Legion of the Damned (`lotd_data.sga`)
```bash
python apps\client\process_output.py output.json docs\Stats\legion_of_the_damned.json legion_of_the_damned
```

---

### Night Lords (`nl_data.sga`)
```bash
python apps\client\process_output.py output.json docs\Stats\night_lords.json night_lords
```

---

### Praetorian Guard (`pg_data.sga`)
```bash
python apps\client\process_output.py output.json docs\Stats\praetorian_guard.json praetorian_guard
```

---

### Renegade Guard (`rg_data_1.sga`)
```bash
python apps\client\process_output.py output.json docs\Stats\renegade_guard.json renegade_guard
```

---

### Raven Guard — Parte 1 (`rg_data_2.sga`)
```bash
python apps\client\process_output.py output.json docs\Stats\raven_guard.json raven_guard
```

### Raven Guard — Parte 2 (`rv_data.sga`)
> ⚠️ Este merge: agrega al JSON existente automáticamente
```bash
python apps\client\process_output.py output.json docs\Stats\raven_guard.json raven_guard
```

---

### Salamanders (`salies_data.sga`)
```bash
python apps\client\process_output.py output.json docs\Stats\salamanders.json salamanders
```

---

### Steel Legion (`sl_data.sga`)
```bash
python apps\client\process_output.py output.json docs\Stats\steel_legion.json steel_legion
```

---

### Thousand Sons (`ts_data.sga`)
```bash
python apps\client\process_output.py output.json docs\Stats\thousand_sons.json thousand_sons
```

---

### Tyranids (`tyranids_data.sga`)
```bash
python apps\client\process_output.py "docs\Stats\Raw\output.json" "docs\Stats\tyranids.json" tyranids
```

---

### Vostroyan Firstborn (`vf_data.sga`)
```bash
python apps\client\process_output.py output.json docs\Stats\vostroyan_firstborn.json vostroyan_firstborn
```

---

### World Eaters (`we_data.sga`)
```bash
python apps\client\process_output.py output.json docs\Stats\world_eaters.json world_eaters
```

---

### Witch Hunters (`wh_data.sga`)
```bash
python apps\client\process_output.py output.json docs\Stats\witch_hunters.json witch_hunters
```

---

### Ynnari (`ynnari_data.sga`)
```bash
python apps\client\process_output.py output.json docs\Stats\ynnari.json ynnari
```

---

## Notas

- **Facciones con múltiples `.sga`** (Emperor's Children, Raven Guard): correr el comando de cada parte por separado. `process_output.py` detecta si el JSON ya existe y hace merge automático.
- **output.json** es siempre sobreescrito por Corsix en cada run. Procesarlo antes de pasar a la siguiente facción.
- **Mod version**: cuando salga una nueva versión de Unification, repetir el proceso completo y actualizar todos los JSONs.