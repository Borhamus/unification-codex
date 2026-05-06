'use client'

import { useEffect, useState } from 'react'
import { createClient } from '../../src/lib/supabase/client'
import UnitCard from './components/UnitCard'
import FactionSidebar from './components/FactionSidebar'
import ComparePanel from './components/ComparePanel'
import { ICONS as DG_ICONS } from './icons/death_guard'

export type Unit = {
  id: number
  unit_name: string
  faction: string
  category: string
  hp: number | null
  armour: number | null
  regen: number | null
  req: number | null
  power: number | null
  pop: number | null
  build_time: number | null
  speed_max: number | null
  sight: number | null
  max_range: number | null
  accuracy: number | null
  reload_time: number | null
  is_structure: boolean
  is_builder: boolean
  has_melee: boolean
  description: string | null
  mod_version: string
}

export type FactionScore = {
  faction: string
  total_score: number
  combat_score: number
  mobility_score: number
  damage_score: number
  economy_score: number
}

const CATEGORIES = ['all', 'troop', 'structure', 'weapon', 'ability', 'research', 'squad']

const FACTIONS = [
  { id: 'death_guard', label: 'Death Guard' },
  { id: '13th_company', label: '13th Company' },
  { id: 'tyranids', label: 'Tyranids' },
]

const ICON_BASE = 'https://hjolwvintrwrgegkmgdk.supabase.co/storage/v1/object/public/icons'

const FACTION_ICON_FOLDER: Record<string, string> = {
  death_guard:   'death_guard',
  tyranids:      'tyranids_icons',
  '13th_company': 'space_marine_icons',
  blood_angels:  'space_marine_icons',
  dark_angels:   'darkangels_icons',
  emperors_children: 'emperors_children_icons',
  chaos_daemons: 'chaos_icons',
  witch_hunters: 'witch_hunters_icons',
  steel_legion:  'guard_icons',
  praetorian_guard: 'guard_icons',
  salamanders:   'salamanders_icons',
  renegade_guard: 'renegade_icons',
  inquisition_daemonhunters: 'inquisition_icons',
}

const FACTION_ICONS: Record<string, Record<string, string>> = {
  death_guard: DG_ICONS,
}

export function getIconUrl(unit: Unit): string {
  const folder = FACTION_ICON_FOLDER[unit.faction] || 'common_icons'
  const iconMap = FACTION_ICONS[unit.faction]
  const iconFile = iconMap?.[unit.unit_name]
  if (!iconFile) return ''
  return `${ICON_BASE}/${folder}/${iconFile}`
}

export default function BalancePage() {
  const supabase = createClient()

  const [faction, setFaction] = useState('death_guard')
  const [category, setCategory] = useState('all')
  const [units, setUnits] = useState<Unit[]>([])
  const [scores, setScores] = useState<FactionScore[]>([])
  const [selected, setSelected] = useState<Unit | null>(null)
  const [compareUnit, setCompareUnit] = useState<Unit | null>(null)
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  useEffect(() => {
    async function load() {
      setLoading(true)
      setSelected(null)
      setCompareUnit(null)

      let query = supabase
        .from('units')
        .select('*')
        .eq('faction', faction)
        .order('category')
        .order('unit_name')

      if (category !== 'all') {
        query = query.eq('category', category)
      }

      const { data: unitData } = await query
      setUnits(unitData || [])

      const { data: scoreData } = await supabase
        .from('faction_scores')
        .select('*')

      setScores(scoreData || [])
      setLoading(false)
    }
    load()
  }, [faction, category])

  const currentScore = scores.find(s => s.faction === faction)

  const filtered = units.filter(u =>
    u.unit_name.toLowerCase().includes(search.toLowerCase())
  )

  function formatName(name: string) {
    return name
      .replace(/_/g, ' ')
      .replace(/^(death guard|13th company|tyranids|thirteenthcom|tyranid|blood angel|dark angel)\s*/i, '')
      .trim()
  }

  function categoryColor(cat: string) {
    const colors: Record<string, string> = {
      troop: '#534AB7',
      structure: '#185FA5',
      weapon: '#993C1D',
      ability: '#0F6E56',
      research: '#BA7517',
      squad: '#72243E',
    }
    return colors[cat] || '#888'
  }

  return (
    <div style={{ display: 'flex', height: '100vh', fontFamily: 'system-ui, sans-serif', fontSize: 13, color: '#1a1a1a', background: '#f8f8f7' }}>

      <FactionSidebar
        factions={FACTIONS}
        faction={faction}
        setFaction={setFaction}
        scores={scores}
        currentScore={currentScore}
      />

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>

        <div style={{ padding: '10px 16px', borderBottom: '1px solid #e5e5e5', background: '#fff', display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ display: 'flex', gap: 2 }}>
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                style={{
                  padding: '4px 12px',
                  fontSize: 12,
                  border: '1px solid #e0e0e0',
                  borderRadius: cat === CATEGORIES[0] ? '6px 0 0 6px' : cat === CATEGORIES[CATEGORIES.length - 1] ? '0 6px 6px 0' : 0,
                  background: category === cat ? '#EEEDFE' : '#fff',
                  color: category === cat ? '#3C3489' : '#666',
                  fontWeight: category === cat ? 500 : 400,
                  cursor: 'pointer',
                }}
              >
                {cat.charAt(0).toUpperCase() + cat.slice(1)}
              </button>
            ))}
          </div>
          <input
            placeholder="Search units..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{ marginLeft: 'auto', padding: '5px 10px', border: '1px solid #e0e0e0', borderRadius: 6, fontSize: 12, width: 200 }}
          />
        </div>

        <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>

          <div style={{ width: 280, borderRight: '1px solid #e5e5e5', overflow: 'auto', background: '#fff' }}>
            {loading ? (
              <div style={{ padding: 20, color: '#999', fontSize: 12 }}>Loading...</div>
            ) : filtered.length === 0 ? (
              <div style={{ padding: 20, color: '#999', fontSize: 12 }}>No units found</div>
            ) : filtered.map(u => (
              <div
                key={u.id}
                onClick={() => setSelected(u)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 8,
                  padding: '18px 22px',
                  borderBottom: '1px solid #f0f0f0',
                  cursor: 'pointer',
                  background: selected?.id === u.id ? '#EEEDFE' : 'transparent',
                }}
              >
                <div style={{ width: 36, height: 36, borderRadius: 6, flexShrink: 0, overflow: 'hidden', position: 'relative' }}>
                  <div style={{ position: 'absolute', inset: 0, background: categoryColor(u.category), opacity: 0.3 }} />
                  {getIconUrl(u) && (
                    <img
                      src={getIconUrl(u)}
                      alt=""
                      width={36}
                      height={36}
                      style={{ objectFit: 'cover', position: 'relative', zIndex: 1 }}
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = 'none'
                      }}
                    />
                  )}
                </div>

                <div style={{ flex: 1, overflow: 'hidden' }}>
                  <div style={{ fontSize: 12, fontWeight: selected?.id === u.id ? 500 : 400, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {formatName(u.unit_name)}
                  </div>
                  {u.hp && <div style={{ fontSize: 10, color: '#999' }}>HP {u.hp} · Armour {u.armour}</div>}
                </div>
                <div style={{ fontSize: 10, color: '#bbb' }}>{u.category}</div>
              </div>
            ))}
          </div>

          <div style={{ flex: 1, overflow: 'auto', padding: 20 }}>
            {selected ? (
              <ComparePanel
                unit={selected}
                compareUnit={compareUnit}
                setCompareUnit={setCompareUnit}
                allUnits={units}
                formatName={formatName}
                categoryColor={categoryColor}
                getIconUrl={getIconUrl}
              />
            ) : (
              <UnitCard
                score={currentScore}
                factionLabel={FACTIONS.find(f => f.id === faction)?.label || faction}
                unitCount={units.length}
              />
            )}
          </div>

        </div>
      </div>
    </div>
  )
}