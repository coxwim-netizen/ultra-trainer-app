import { useEffect, useRef, useState, type ReactElement } from 'react'
import { useGame } from '../../state/GameContext'
import { LOCATIONS, getLocation, getFrontierLocation, isLocationUnlocked } from '../../data/locations'
import { CrystalTracker } from '../common/CrystalTracker'
import { EggHatch } from '../common/EggHatch'
import { Fireworks } from '../common/Fireworks'
import { Woud } from '../characters/Woud'
import { DrakengrotIsland } from '../map/DrakengrotIsland'
import { ArendsbergIsland } from '../map/ArendsbergIsland'
import { NinjabosIsland } from '../map/NinjabosIsland'
import type { LocationInfo } from '../../types'

const ISLAND_ART: Record<string, (props: { size?: number }) => ReactElement> = {
  drakengrot: DrakengrotIsland,
  arendsberg: ArendsbergIsland,
  ninjabos: NinjabosIsland,
}

function pathD(points: { x: number; y: number }[]): string {
  const [first, ...rest] = points
  const segments = rest.map((point) => `L ${point.x} ${point.y}`)
  return `M ${first.x} ${first.y} ${segments.join(' ')}`
}

export function AdventureMap() {
  const { progress, goTo, screen } = useGame()
  const arrivingFrom = screen.name === 'map' ? screen.arrivingFrom : undefined

  const [cutscene, setCutscene] = useState<{ from: LocationInfo; to: LocationInfo | null } | null>(null)
  const [eggTrigger, setEggTrigger] = useState(0)
  const [fireworksTrigger, setFireworksTrigger] = useState(0)
  const [announcement, setAnnouncement] = useState('')
  const hasPlayedRef = useRef(false)

  useEffect(() => {
    if (!arrivingFrom || hasPlayedRef.current) return
    hasPlayedRef.current = true
    const fromLocation = getLocation(arrivingFrom)!
    const toLocation = getFrontierLocation(progress.completedLocations)
    setCutscene({ from: fromLocation, to: toLocation })
    setEggTrigger((t) => t + 1)
    setFireworksTrigger((t) => t + 1)
    setAnnouncement(
      toLocation
        ? `Het drakenei kraakt open! Woud gaat verder naar ${toLocation.name}.`
        : 'Het drakenei kraakt open!',
    )
    const timeout = window.setTimeout(() => {
      setCutscene(null)
      goTo({ name: 'map' })
    }, 2700)
    return () => window.clearTimeout(timeout)
  }, [arrivingFrom, progress.completedLocations, goTo])

  const allDone = LOCATIONS.every((location) => progress.completedLocations.includes(location.id))
  const frontier = getFrontierLocation(progress.completedLocations)
  const restingLocation = frontier ?? LOCATIONS[LOCATIONS.length - 1]
  // Before the arrival effect has run, still show Woud at the place they came
  // from — otherwise the very first paint already shows the destination (the
  // location is already marked completed by then) and there's nothing to
  // visibly walk from.
  const initialPosition = arrivingFrom ? getLocation(arrivingFrom)!.mapPosition : restingLocation.mapPosition
  const woudPosition = cutscene ? (cutscene.to ?? cutscene.from).mapPosition : initialPosition

  return (
    <div className="stack">
      <div className="center-col" style={{ gap: 8 }}>
        <h2>Avontuurkaart</h2>
        <p>Volg het pad en ontdek de volgende plek, {progress.playerName}!</p>
        <CrystalTracker completedLocations={progress.completedLocations} />
      </div>

      <div className="visually-hidden" role="status" aria-live="polite">
        {announcement}
      </div>

      <div className="pirate-map">
        <span className="pirate-map__compass" aria-hidden="true">
          🧭
        </span>

        <svg className="pirate-map__path" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
          <path d={pathD(LOCATIONS.map((l) => l.mapPosition))} className="pirate-map__path-line" />
        </svg>

        {LOCATIONS.map((location, index) => {
          const done = progress.completedLocations.includes(location.id)
          const unlocked = isLocationUnlocked(progress.completedLocations, location.id)
          const isFrontier = frontier?.id === location.id
          const Island = ISLAND_ART[location.id]

          return (
            <button
              key={location.id}
              type="button"
              className={`map-marker ${location.themeClass}`}
              style={{ left: `${location.mapPosition.x}%`, top: `${location.mapPosition.y}%` }}
              data-locked={!unlocked}
              data-frontier={isFrontier}
              onClick={() => {
                if (!unlocked) {
                  const previous = LOCATIONS[LOCATIONS.findIndex((l) => l.id === location.id) - 1]
                  setAnnouncement(`Rond eerst ${previous?.name ?? 'de vorige plek'} af om hier te komen.`)
                  return
                }
                goTo({ name: 'exercise', location: location.id })
              }}
              aria-label={
                unlocked
                  ? `Level ${index + 1}: ${location.name}${done ? ' (voltooid, opnieuw spelen)' : ''} — ${location.tagline}`
                  : `Level ${index + 1}: ${location.name} — nog gesloten`
              }
            >
              <span className="map-marker__number" aria-hidden="true">
                {index + 1}
              </span>
              <span className="map-marker__island">
                <Island size={100} />
                {!unlocked && (
                  <span className="map-marker__lock-overlay" aria-hidden="true">
                    🔒
                  </span>
                )}
              </span>
              <span className="map-marker__label">{location.name}</span>
              {done && (
                <span className="map-marker__badge" aria-hidden="true">
                  ⭐
                </span>
              )}
            </button>
          )
        })}

        <div
          className="map-woud"
          style={{ left: `${woudPosition.x}%`, top: `${woudPosition.y}%` }}
          aria-hidden="true"
        >
          <Woud size={56} />
        </div>

        {cutscene && (
          <div
            className="map-egg-slot"
            style={{ left: `${cutscene.from.mapPosition.x}%`, top: `${cutscene.from.mapPosition.y}%` }}
          >
            <EggHatch trigger={eggTrigger} />
          </div>
        )}

        <Fireworks trigger={fireworksTrigger} />
      </div>

      {allDone && (
        <button type="button" className="btn btn-primary btn-large" onClick={() => goTo({ name: 'victory' })}>
          🏆 Naar het Drakenkristal!
        </button>
      )}
    </div>
  )
}
