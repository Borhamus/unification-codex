'use client'
import { useState } from 'react'
import { Unit } from '../page'
 
type Props = {
  unit: Unit
  compareUnit: Unit | null
  setCompareUnit: (u: Unit | null) => void
  allUnits: Unit[]
  formatName: (name: string) => string
  categoryColor: (cat: string) => string
  getIconUrl: (unit: Unit) => string
}
 
const STAT_DEFS: { key: keyof Unit; label: string; desc: string; max: number }[] = [
  { key: 'hp', label: 'HP', desc: 'Total hit points before the unit is destroyed.', max: 10000 },
  { key: 'armour', label: 'Armour', desc: 'Damage reduction. Higher = tougher against all attacks.', max: 120 },
  { key: 'regen', label: 'Regen', desc: 'HP regenerated per second when out of combat.', max: 20 },
  { key: 'speed_max', label: 'Speed', desc: 'Maximum movement speed. Infantry ~14, vehicles ~20-30.', max: 40 },
  { key: 'sight', label: 'Sight', desc: 'Vision radius. Determines how far the unit can spot enemies.', max: 40 },
  { key: 'req', label: 'Req cost', desc: 'Requisition cost to build or reinforce.', max: 400 },
  { key: 'power', label: 'Power cost', desc: 'Power resource cost. Limits on how many high-cost units you can field.', max: 300 },
  { key: 'pop', label: 'Pop', desc: 'Population cap used. Higher = fewer squads simultaneously.', max: 10 },
  { key: 'build_time', label: 'Build time', desc: 'Seconds to produce this unit from its building.', max: 120 },
  { key: 'max_range', label: 'Range', desc: 'Maximum weapon engagement distance.', max: 40 },
  { key: 'accuracy', label: 'Accuracy', desc: 'Base hit chance per shot (0-1). Affected by cover and upgrades.', max: 1 },
  { key: 'reload_time', label: 'Reload', desc: 'Seconds between shots. Lower = faster fire rate.', max: 10 },
]
 
function StatRow({ statDef, unit, compareUnit }: {
  statDef: typeof STAT_DEFS[0]
  unit: Unit
  compareUnit: Unit | null
}) {
  const val = unit[statDef.key] as number | null
  const cVal = compareUnit ? compareUnit[statDef.key] as number | null : null
 
  if (val == null && cVal == null) return null
 
  const pct = val != null ? Math.min((val / statDef.max) * 100, 100) : 0
  const cPct = cVal != null ? Math.min((cVal / statDef.max) * 100, 100) : 0
 
  const displayVal = statDef.key === 'accuracy' && val != null
    ? `${Math.round(val * 100)}%`
    : val ?? '—'
  const displayCVal = statDef.key === 'accuracy' && cVal != null
    ? `${Math.round(cVal * 100)}%`
    : cVal ?? '—'
 
  let delta = null
  if (val != null && cVal != null) {
    const diff = val - cVal
    // For cost stats, lower is better
    const costStats = ['req', 'power', 'pop', 'build_time', 'reload_time']
    const better = costStats.includes(statDef.key as string) ? diff < 0 : diff > 0
    delta = { diff, better }
  }
 
  return (
    <div style={{ marginBottom: 10 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 3 }}>
        <div style={{ fontSize: 11, color: '#666', width: 80 }}>{statDef.label}</div>
        <div style={{ flex: 1, height: 5, background: '#f0f0f0', borderRadius: 3, overflow: 'hidden', position: 'relative' }}>
          <div style={{ position: 'absolute', left: 0, top: 0, height: '100%', width: `${pct}%`, background: '#534AB7', borderRadius: 3, opacity: 0.9 }} />
          {compareUnit && cVal != null && (
            <div style={{ position: 'absolute', left: 0, top: 0, height: '100%', width: `${cPct}%`, background: '#1D9E75', borderRadius: 3, opacity: 0.6 }} />
          )}
        </div>
        <div style={{ fontSize: 11, fontWeight: 500, width: 40, textAlign: 'right', color: '#333' }}>{displayVal}</div>
        {compareUnit && (
          <div style={{ fontSize: 11, width: 40, textAlign: 'right', color: '#1D9E75' }}>{displayCVal}</div>
        )}
        {delta && (
          <div style={{ fontSize: 10, width: 36, textAlign: 'right', color: delta.better ? '#1D9E75' : '#993C1D' }}>
            {delta.better ? '+' : ''}{typeof delta.diff === 'number' ? Math.round(delta.diff) : ''}
          </div>
        )}
      </div>
      <div style={{ fontSize: 10, color: '#bbb', paddingLeft: 88 }}>{statDef.desc}</div>
    </div>
  )
}
 
export default function ComparePanel({ unit, compareUnit, setCompareUnit, allUnits, formatName, categoryColor, getIconUrl }: Props) {
  const [showPicker, setShowPicker] = useState(false)
  const [pickerSearch, setPickerSearch] = useState('')
 
  const filteredPicker = allUnits.filter(u =>
    u.id !== unit.id &&
    u.unit_name.toLowerCase().includes(pickerSearch.toLowerCase())
  )
 
  return (
    <div style={{ maxWidth: 700 }}>
 
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 16 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
            <div style={{ width: 36, height: 36, borderRadius: 6, background: '#f0f0f0', overflow: 'hidden', flexShrink: 0 }}>
              {getIconUrl(unit) && (
                <img
                  src={getIconUrl(unit)}
                  alt=""
                  width={36}
                  height={36}
                  style={{ objectFit: 'cover' }}
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none'
                  }}
                />
              )}
            </div>
            <h2 style={{ fontSize: 18, fontWeight: 500, color: '#1a1a1a' }}>{formatName(unit.unit_name)}</h2>
            <span style={{ fontSize: 10, padding: '2px 8px', borderRadius: 20, background: '#EEEDFE', color: '#3C3489' }}>{unit.category}</span>
          </div>
          <div style={{ fontSize: 12, color: '#999' }}>
            {unit.is_structure ? 'Structure' : unit.is_builder ? 'Builder unit' : 'Combat unit'} ·{' '}
            {unit.has_melee ? 'Melee capable' : 'Ranged'} ·{' '}
            {unit.faction.replace(/_/g, ' ')}
          </div>
        </div>
 
        <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
          {compareUnit && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#1D9E75' }} />
              <span style={{ fontSize: 12, color: '#1D9E75' }}>{formatName(compareUnit.unit_name)}</span>
              <button onClick={() => setCompareUnit(null)} style={{ fontSize: 11, color: '#bbb', border: 'none', background: 'none', cursor: 'pointer' }}>✕</button>
            </div>
          )}
          <div style={{ position: 'relative' }}>
            <button
              onClick={() => setShowPicker(!showPicker)}
              style={{ fontSize: 11, padding: '5px 12px', border: '1px solid #B5D4F4', borderRadius: 6, background: '#E6F1FB', color: '#185FA5', cursor: 'pointer' }}
            >
              {compareUnit ? 'Change compare' : 'Compare with...'}
            </button>
            {showPicker && (
              <div style={{ position: 'absolute', right: 0, top: '110%', width: 260, background: '#fff', border: '1px solid #e5e5e5', borderRadius: 8, boxShadow: '0 4px 16px rgba(0,0,0,0.1)', zIndex: 100 }}>
                <div style={{ padding: 8 }}>
                  <input
                    autoFocus
                    placeholder="Search unit..."
                    value={pickerSearch}
                    onChange={e => setPickerSearch(e.target.value)}
                    style={{ width: '100%', padding: '5px 8px', border: '1px solid #e0e0e0', borderRadius: 6, fontSize: 12 }}
                  />
                </div>
                <div style={{ maxHeight: 200, overflow: 'auto' }}>
                  {filteredPicker.slice(0, 30).map(u => (
                    <div
                      key={u.id}
                      onClick={() => { setCompareUnit(u); setShowPicker(false); setPickerSearch('') }}
                      style={{ padding: '6px 12px', cursor: 'pointer', fontSize: 12, color: '#333', borderTop: '1px solid #f5f5f5' }}
                      onMouseEnter={e => { (e.target as HTMLElement).style.background = '#f8f8f7' }}
                      onMouseLeave={e => { (e.target as HTMLElement).style.background = 'transparent' }}
                    >
                      <span style={{ color: categoryColor(u.category), fontSize: 10, marginRight: 6 }}>●</span>
                      {formatName(u.unit_name)}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
 
      {/* Stats */}
      <div style={{ background: '#fff', border: '1px solid #e5e5e5', borderRadius: 8, padding: '14px 16px', marginBottom: 12 }}>
        {compareUnit && (
          <div style={{ display: 'flex', gap: 16, marginBottom: 12, paddingBottom: 10, borderBottom: '1px solid #f0f0f0' }}>
            <div style={{ fontSize: 11, color: '#534AB7' }}>━ {formatName(unit.unit_name)}</div>
            <div style={{ fontSize: 11, color: '#1D9E75' }}>━ {formatName(compareUnit.unit_name)}</div>
            {compareUnit && <div style={{ fontSize: 11, color: '#bbb', marginLeft: 'auto' }}>delta →</div>}
          </div>
        )}
        {STAT_DEFS.map(def => (
          <StatRow key={def.key as string} statDef={def} unit={unit} compareUnit={compareUnit} />
        ))}
      </div>
 
      {/* Power budget */}
      <div style={{ background: '#fff', border: '1px solid #e5e5e5', borderRadius: 8, padding: '14px 16px' }}>
        <div style={{ fontSize: 11, fontWeight: 500, color: '#999', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 10 }}>Power budget contribution</div>
        {[
          { label: 'Survivability (HP × Armour / cost)', value: unit.hp && unit.req ? Math.min(Math.round((unit.hp * (unit.armour || 100) / 100) / Math.max((unit.req || 0) + (unit.power || 0) * 2, 1) * 10), 100) : 0, color: '#534AB7' },
          { label: 'Mobility penalty vs avg', value: unit.speed_max ? Math.min(Math.round(unit.speed_max / 30 * 100), 100) : 0, color: '#D85A30' },
          { label: 'Damage potential (accuracy × range)', value: unit.accuracy && unit.max_range ? Math.min(Math.round(unit.accuracy * unit.max_range / 40 * 100), 100) : 0, color: '#993C1D' },
        ].map(item => (
          <div key={item.label} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
            <div style={{ fontSize: 11, color: '#666', flex: 1 }}>{item.label}</div>
            <div style={{ width: 120, height: 5, background: '#f0f0f0', borderRadius: 3, overflow: 'hidden' }}>
              <div style={{ width: `${item.value}%`, height: '100%', background: item.color, borderRadius: 3 }} />
            </div>
            <div style={{ fontSize: 11, color: '#999', width: 28, textAlign: 'right' }}>{item.value}</div>
          </div>
        ))}
      </div>
 
    </div>
  )
}