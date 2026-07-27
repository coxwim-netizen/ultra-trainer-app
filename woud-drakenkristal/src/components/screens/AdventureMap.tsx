import { useGame } from '../../state/GameContext'
import { LOCATIONS } from '../../data/locations'
import { CrystalTracker } from '../common/CrystalTracker'
import { Vonk } from '../characters/Vonk'
import { Arend } from '../characters/Arend'
import { Kage } from '../characters/Kage'

const GUIDE_ICON: Record<string, typeof Vonk> = {
  drakengrot: Vonk,
  arendsberg: Arend,
  ninjabos: Kage,
}

export function AdventureMap() {
  const { progress, goTo } = useGame()

  const allDone = LOCATIONS.every((location) => progress.completedLocations.includes(location.id))

  return (
    <div className="stack">
      <div className="center-col" style={{ gap: 8 }}>
        <h2>Avontuurkaart</h2>
        <p>Kies een plek om te ontdekken, {progress.playerName}!</p>
        <CrystalTracker completedLocations={progress.completedLocations} />
      </div>

      <div className="stack" style={{ gap: 20 }}>
        {LOCATIONS.map((location) => {
          const Guide = GUIDE_ICON[location.id]
          const done = progress.completedLocations.includes(location.id)
          return (
            <button
              key={location.id}
              type="button"
              className={`card location-card ${location.themeClass}`}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 16,
                width: '100%',
                textAlign: 'left',
                cursor: 'pointer',
              }}
              onClick={() => goTo({ name: 'exercise', location: location.id })}
            >
              <Guide size={72} animate={false} />
              <span className="stack" style={{ gap: 4, flex: 1 }}>
                <span className="row-between">
                  <strong style={{ fontSize: '1.3rem' }}>{location.name}</strong>
                  {done && <span aria-label="Voltooid" title="Voltooid">⭐</span>}
                </span>
                <span>{location.tagline}</span>
              </span>
            </button>
          )
        })}
      </div>

      {allDone && (
        <button type="button" className="btn btn-primary btn-large" onClick={() => goTo({ name: 'victory' })}>
          🏆 Naar het Drakenkristal!
        </button>
      )}
    </div>
  )
}
