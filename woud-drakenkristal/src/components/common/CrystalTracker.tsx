import { LOCATIONS } from '../../data/locations'
import type { LocationId } from '../../types'

interface CrystalTrackerProps {
  completedLocations: LocationId[]
}

export function CrystalTracker({ completedLocations }: CrystalTrackerProps) {
  return (
    <div className="crystal-tracker" role="status" aria-label="Verzamelde drakenkristal-stukken">
      {LOCATIONS.map((location) => {
        const filled = completedLocations.includes(location.id)
        return (
          <span
            key={location.id}
            className="crystal-slot"
            data-filled={filled}
            title={filled ? location.crystalName : `Nog te vinden in ${location.name}`}
          >
            {filled ? location.crystalEmoji : '❔'}
          </span>
        )
      })}
    </div>
  )
}
