import { useEffect } from 'react'
import { useGame } from '../../state/GameContext'
import { BADGES } from '../../data/locations'
import { Sparkles } from '../common/Sparkles'
import { useSound } from '../../hooks/useSound'
import { Vonk } from '../characters/Vonk'

export function VictoryScreen() {
  const { progress, goTo, resetProgress } = useGame()
  const { playCelebrate } = useSound()

  useEffect(() => {
    playCelebrate()
  }, [])

  return (
    <div className="center-col" style={{ position: 'relative', paddingTop: 20 }}>
      <Sparkles trigger={1} count={24} />
      <div style={{ position: 'relative', width: 220, height: 220 }}>
        <p style={{ fontSize: '6rem', margin: 0 }} aria-hidden="true">
          💎
        </p>
        <div style={{ position: 'absolute', top: -30, right: -20 }}>
          <Vonk size={110} breatheFire />
        </div>
      </div>

      <h1 style={{ fontSize: 'clamp(1.6rem, 5vw, 2.4rem)', color: 'var(--crystal)' }}>
        Fantastisch, {progress.playerName}! Het Drakenkristal is weer heel!
      </h1>

      <div className="card stack">
        <h3>Jouw badges</h3>
        <div className="row" style={{ justifyContent: 'center', flexWrap: 'wrap' }}>
          {BADGES.map((badge) => (
            <span
              key={badge.id}
              className="badge-chip"
              style={{ opacity: progress.earnedBadges.includes(badge.id) ? 1 : 0.4 }}
            >
              <span aria-hidden="true">{badge.icon}</span> {badge.name}
            </span>
          ))}
        </div>
      </div>

      <div className="stack" style={{ width: '100%', maxWidth: 320 }}>
        <button type="button" className="btn btn-primary btn-large" onClick={() => goTo({ name: 'map' })}>
          🗺️ Kies een avontuur
        </button>
        <button
          type="button"
          className="btn btn-secondary"
          onClick={() => {
            resetProgress()
            goTo({ name: 'start' })
          }}
        >
          🔁 Speel opnieuw
        </button>
      </div>
    </div>
  )
}
