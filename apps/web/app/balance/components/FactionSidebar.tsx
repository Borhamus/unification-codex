'use client'
import { FactionScore } from '../page'

type Faction = { id: string; label: string }

type Props = {
  factions: Faction[]
  faction: string
  setFaction: (f: string) => void
  scores: FactionScore[]
  currentScore: FactionScore | undefined
}

function ScoreBar({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div style={{ marginBottom: 8 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, color: '#999', marginBottom: 3 }}>
        <span>{label}</span>
        <span>{value}</span>
      </div>
      <div style={{ height: 4, background: '#f0f0f0', borderRadius: 2, overflow: 'hidden' }}>
        <div style={{ width: `${value}%`, height: '100%', background: color, borderRadius: 2 }} />
      </div>
    </div>
  )
}

export default function FactionSidebar({ factions, faction, setFaction, scores, currentScore }: Props) {
  return (
    <div style={{ width: 220, borderRight: '1px solid #e5e5e5', background: '#fff', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>

      <div style={{ padding: '14px 14px 10px', borderBottom: '1px solid #f0f0f0' }}>
        <div style={{ fontSize: 11, fontWeight: 500, color: '#999', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 8 }}>Factions</div>
        {factions.map(f => {
          const s = scores.find(sc => sc.faction === f.id)
          return (
            <div
              key={f.id}
              onClick={() => setFaction(f.id)}
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '6px 8px', borderRadius: 6, cursor: 'pointer', marginBottom: 2,
                background: faction === f.id ? '#EEEDFE' : 'transparent',
              }}
            >
              <span style={{ fontSize: 12, fontWeight: faction === f.id ? 500 : 400, color: faction === f.id ? '#3C3489' : '#333' }}>
                {f.label}
              </span>
              {s && (
                <span style={{ fontSize: 10, color: '#999' }}>{s.total_score}</span>
              )}
            </div>
          )
        })}
      </div>

      {currentScore && (
        <div style={{ padding: '12px 14px', flex: 1, overflow: 'auto' }}>
          <div style={{ marginBottom: 12 }}>
            <div style={{ fontSize: 10, color: '#999', marginBottom: 2 }}>Power score</div>
            <div style={{ fontSize: 28, fontWeight: 500, color: '#3C3489' }}>{currentScore.total_score}</div>
            <div style={{ fontSize: 10, color: '#bbb' }}>/ 100 estimated</div>
          </div>

          <ScoreBar label="Combat" value={Number(currentScore.combat_score)} color="#534AB7" />
          <ScoreBar label="Mobility" value={Number(currentScore.mobility_score)} color="#D85A30" />
          <ScoreBar label="Damage" value={Number(currentScore.damage_score)} color="#993C1D" />
          <ScoreBar label="Economy" value={Number(currentScore.economy_score)} color="#1D9E75" />

          <div style={{ marginTop: 14, padding: '10px', background: '#f8f8f7', borderRadius: 6 }}>
            <div style={{ fontSize: 10, fontWeight: 500, color: '#666', marginBottom: 4 }}>Balance delta</div>
            <div style={{ fontSize: 11, color: '#999', lineHeight: 1.5 }}>
              No match data yet. Balance delta will appear once 20+ matches are recorded.
            </div>
          </div>

          <div style={{ marginTop: 10, padding: '10px', background: '#f8f8f7', borderRadius: 6 }}>
            <div style={{ fontSize: 10, fontWeight: 500, color: '#666', marginBottom: 6 }}>Score guide</div>
            <div style={{ fontSize: 10, color: '#999', lineHeight: 1.6 }}>
              <b style={{ color: '#666' }}>Combat</b> — HP × armour / cost<br />
              <b style={{ color: '#666' }}>Mobility</b> — avg speed of troops<br />
              <b style={{ color: '#666' }}>Damage</b> — accuracy / reload × range<br />
              <b style={{ color: '#666' }}>Economy</b> — cost efficiency
            </div>
          </div>
        </div>
      )}
    </div>
  )
}