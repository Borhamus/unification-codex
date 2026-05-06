# Unification Codex

> The definitive competitive platform for **Dawn of War: Definitive Edition + Unification Mod** — bringing structured data, ranked play, and analytical tools to one of Warhammer 40,000's most ambitious community projects.

---

## Vision

The Unification Mod is a remarkable achievement: over 30 playable factions, each faithful to its lore, each mechanically distinct. But with that richness comes a challenge that every competitive game faces — **balance**. Without data, balance is guesswork. Without a ranked system, skill has no measure. Without a platform, the community has no home.

Unification Codex is built to solve all three.

---

## Modules

### Module 1 — Data Analytics & Balance Tool *(Active)*

### Module 2 — Ranked Ladder & MMR System *(In Development)*

### Module 3 — Tournament Infrastructure *(Future Scope)*

---

## Module 1 — Data Analytics & Balance Tool

### The Problem

Warhammer 40,000 is defined by asymmetry. A Space Marine is not an Ork. A Death Guard Plague Marine is not a Blood Angel Assault Marine. Their differences are not cosmetic — they are mechanical, lore-driven, and intentional.

Balancing the Unification mod across 30+ factions cannot and should not mean making every faction identical. It means ensuring that each faction's **total power budget** — distributed across its unique identity — is equivalent to every other faction's. A faction that is slow and resilient should have the same competitive viability as one that is fast and fragile.

The Data Analytics module exists to make that judgment **data-driven instead of subjective**.

### What We Built

#### Data Pipeline

Every unit, structure, weapon, ability, and research entry in the Unification mod is encoded in binary `.rgd` (Relic Game Data) files, packaged inside `.sga` archives. These files are not human-readable.

We built a full extraction pipeline to solve this:

```
.sga archive (e.g. dg_data.sga)
    ↓  Corsix Mod Studio — Lua Macro (corsix_macro.lua)
output.json  (raw stats — all 493 entries for Death Guard)
    ↓  process_output.py
faction_full.json  (445 clean entries, categorized)
    ↓  [next step]
Supabase database → Web dashboard
```

**Tools developed:**

- `apps/client/corsix_macro.lua` — A Lua macro that runs inside Corsix Mod Studio and extracts all attribute data (HP, armour, regeneration, costs, speed, sight radius, weapon range, damage, reload time, accuracy, and more) from every `.rgd` file in a mod's `attrib` folder. Outputs a single `output.json` per faction.

- `apps/client/process_output.py` — A Python post-processor that cleans the raw output: filters non-playable entities, categorizes entries (troop, structure, weapon, ability, research, squad), and produces a structured JSON ready for database ingestion.

- `apps/client/parse_lua.py` — An alternative parser for Corsix Lua dump files (`.lua` text format), capable of extracting the same stats from a different export format.

#### What the Data Contains

For each faction, we extract data across five categories:

| Category | What it contains |
|---|---|
| **Troops** | HP, armour, regen, speed, cost, sight, melee flag |
| **Structures** | HP, armour, regen, build time, cost, power/req income |
| **Weapons** | Range, damage, reload time, accuracy, melee flag |
| **Abilities** | Ability metadata and references |
| **Research** | Technology tree entries and unlock conditions |

**Death Guard — first faction processed:**

```
Total entries:    445
Troops:            56
Structures:        15
Weapons:          127
Abilities:        119
Research:          70
```

#### What We Confirmed

Through direct binary analysis and Corsix exploration, we confirmed the internal structure of the Unification mod's faction system. Notably, some factions implement **sub-factions** — for example, Death Guard has 7 distinct company variants, each with different unit and structure availability. The data model and balance system account for this: each sub-faction is measured independently, not averaged.

### The Asymmetric Balance System

Unlike symmetric games, DoW:Unification balance cannot be reduced to a single number. We are building a **Faction Power Budget** framework with the following axes:

| Axis | What it measures |
|---|---|
| **Combat Power** | Raw DPS and HP relative to cost |
| **Mobility** | Speed and deployment flexibility |
| **Economy** | Cost efficiency and resource generation |
| **Utility** | Abilities, debuffs, area control |
| **Scaling** | Power trajectory across tiers T1–T4 |
| **Role Coverage** | Anti-infantry, anti-vehicle, ranged, melee breadth |

Each faction receives a score per axis per tier. The goal is not zero across all axes — it is zero **total**, meaning strengths and weaknesses are intentional and equivalent.

This system produces:
- A **heatmap dashboard** showing which axes are over or undertuned per faction
- An **export JSON** that mod developers can use directly to inform `.rgd` edits
- A **comparison view** that overlays any two factions across all axes

### Roadmap for this Module

- [x] Extraction pipeline (Corsix macro + Python processor)
- [x] First faction dataset — Death Guard (445 entries)
- [ ] All 30+ factions extracted and processed
- [ ] Supabase schema and data ingestion
- [ ] Faction vs faction stat comparison charts (D3.js)
- [ ] Power Budget calculator with per-axis scoring
- [ ] Balance export JSON for Unification dev team
- [ ] Win rate overlay (from Module 2 match data)

---

## Module 2 — Ranked Ladder & MMR System

A W3Champions-inspired competitive platform for Unification, providing automated match tracking, ELO-based rankings, and player profiles.

**Core features:**
- Automated match result detection (no manual reporting)
- ELO/MMR calculation per match
- Player profiles with match history and MMR progression charts
- Faction win rate statistics filtered by skill bracket and mod version

**Status:** In development. Data schema designed. Match tracking approach under investigation.

*Full documentation: see [PROJECT_FORMAT.md](./PROJECT_FORMAT.md)*

---

## Module 3 — Tournament Infrastructure *(Future Scope)*

Structured tournament brackets with automated seeding from Module 2 MMR data, match scheduling, and results reporting.

This module is explicitly out of scope for v1. It will be designed once the competitive community has had time to develop around Modules 1 and 2.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 14, TypeScript, Tailwind CSS |
| Data visualization | D3.js (balance charts), Recharts (MMR history) |
| Backend + Database | Supabase (PostgreSQL + REST API + Auth) |
| Data extraction | Corsix Mod Studio (Lua macros) + Python |
| Hosting | Vercel (frontend) + Supabase (backend) |

---

## Project Structure

```
unification-codex/
├── apps/
│   ├── web/              ← Next.js frontend
│   └── client/           ← Data extraction tools
│       ├── corsix_macro.lua    ← Run in Corsix to extract faction data
│       ├── process_output.py  ← Clean and categorize raw output
│       └── parse_lua.py       ← Parse Corsix Lua dump files
├── docs/
│   └── Stats/            ← Processed faction JSON files
├── supabase/             ← Database schema and migrations
└── packages/shared/      ← Shared TypeScript types
```

---

## How to Extract Faction Data

1. Open the faction's `.sga` file in Corsix Mod Studio
   *(e.g. `Dawn of War Definitive Edition\Unification\dg_data.sga`)*
2. Right-click on the `attrib` folder → **Run Macro**
3. Paste the contents of `apps/client/corsix_macro.lua`
4. Set `OUTPUT_BASE` to your local repo path
5. Click **Run** — generates `output.json`
6. Run the processor:
   ```bash
   python apps\client\process_output.py output.json docs\Stats\death_guard.json death_guard
   ```

---

## Contributing

This project is open source and community-driven. Contributions are welcome from developers, modders, and competitive players alike.

If you are a member of the **Unification development team** and want to collaborate on the balance dashboard or advise on what data would be most useful — please open an issue or reach out directly on the Unification Discord.

The Warhammer 40,000 universe belongs to Games Workshop. The Unification mod belongs to its creators. This platform is a community tool built with deep respect for both.

---

*In the grim darkness of the far future, there is only war — and now, there is a codex.*