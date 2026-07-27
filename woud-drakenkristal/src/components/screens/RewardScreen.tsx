import { useEffect } from 'react'
import { useGame } from '../../state/GameContext'
import { getLocation, getBadgeForLocation, LOCATIONS } from '../../data/locations'
import type { LocationId } from '../../types'
import { Sparkles } from '../common/Sparkles'
import { useSound } from '../../hooks/useSound'
import { Vonk } from '../characters/Vonk'
import { Arend } from '../characters/Arend'
import { Kage } from '../characters/Kage'

const GUIDE_ICON: Record<string, typeof Vonk> = {
  drakengrot: Vonk,
  arendsberg: Arend,
  ninjabos: Kage,
}

interface RewardScreenProps {
  locationId: LocationId
}

export function RewardScreen({ locationId }: RewardScreenProps) {
  const { progress, goTo } = useGame()
  const { playCelebrate } = useSound()
  const location = getLocation(locationId)!
  const badge = getBadgeForLocation(locationId)!
  const Guide = GUIDE_ICON[locationId]

  useEffect(() => {
    playCelebrate()
    // Runs once when the reward screen appears; playCelebrate is stable across sound-setting toggles.
  }, [])

  const allDone = LOCATIONS.every((loc) => progress.completedLocations.includes(loc.id))

  return (
    <div className={`center-col ${location.themeClass}`} style={{ position: 'relative', paddingTop: 20 }}>
      <Sparkles trigger={1} count={18} />
      <Guide size={140} />
      <h2>Je hebt het Drakenkristal-stuk gevonden!</h2>
      <p style={{ fontSize: '4rem' }} aria-hidden="true">
        {location.crystalEmoji}
      </p>
      <p style={{ fontSize: '1.2rem', fontWeight: 700 }}>{location.crystalName}</p>

      <div className="badge-chip" style={{ fontSize: '1.2rem' }}>
        <span aria-hidden="true">{badge.icon}</span> Nieuwe badge: {badge.name}
      </div>

      <p style={{ fontSize: '1.3rem' }}>Super gedaan, {progress.playerName}! ✨</p>

      <div className="stack" style={{ width: '100%', maxWidth: 320 }}>
        <button
          type="button"
          className="btn btn-primary btn-large"
          onClick={() => goTo(allDone ? { name: 'victory' } : { name: 'map' })}
        >
          {allDone ? '🏆 Naar het Drakenkristal!' : '🗺️ Terug naar de kaart'}
        </button>
      </div>
    </div>
  )
}
