'use client'
import { FactionScore } from '../page'

type Props = {
  score: FactionScore | undefined
  factionLabel: string
  unitCount: number
}

export default function UnitCard({ score, factionLabel, unitCount }: Props) {
  return (
    <div style={{ maxWidth: 600 }}>
      <div style={{ marginBottom: 20 }}>
        <h1 style={{ fontSize: 22, fontWeight: 500, color: '#1a1a1a', marginBottom: 4 }}>{factionLabel}</h1>
        <div style={{ fontSize: 13, color: '#999' }}>{unitCount} entries loaded from Supabase</div>
      </div>

      {score && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 10, marginBottom: 20 }}>
          {[
            { label: 'Total Score', value: score.total_score, color: '#534AB7' },
            { label: 'Combat', value: score.combat_score, color: '#534AB7' },
            { label: 'Mobility', value: score.mobility_score, color: '#D85A30' },
            { label: 'Damage', value: score.damage_score, color: '#993C1D' },
            { label: 'Economy', value: score.economy_score, color: '#1D9E75' },
          ].map(item => (
            <div key={item.label} style={{ background: '#fff', border: '1px solid #e5e5e5', borderRadius: 8, padding: '12px 14px' }}>
              <div style={{ fontSize: 10, color: '#999', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 4 }}>{item.label}</div>
              <div style={{ fontSize: 24, fontWeight: 500, color: item.color }}>{item.value}</div>
              <div style={{ height: 3, background: '#f0f0f0', borderRadius: 2, marginTop: 8, overflow: 'hidden' }}>
                <div style={{ width: `${item.value}%`, height: '100%', background: item.color, borderRadius: 2 }} />
              </div>
            </div>
          ))}
        </div>
      )}

      <div style={{ background: '#fff', border: '1px solid #e5e5e5', borderRadius: 8, padding: '14px 16px' }}>
        <div style={{ fontSize: 11, fontWeight: 500, color: '#999', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Balance delta</div>
        <div style={{ fontSize: 13, color: '#999', lineHeight: 1.6 }}>
          Balance delta shows how far a faction is from 50% win rate.<br />
          <span style={{ color: '#1D9E75' }}>+1 to +10</span> means overtuned, <span style={{ color: '#993C1D' }}>−1 to −10</span> means undertuned.<br /><br />
          No match data recorded yet. Delta will appear automatically once 20+ matches are logged.
        </div>
      </div>

      <div style={{ marginTop: 14, fontSize: 12, color: '#bbb', lineHeight: 1.6 }}>
        Select a unit from the list on the left to see its full stat breakdown, weapon loadout, and power budget contribution.
      </div>
    </div>
  )
}