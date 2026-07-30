import type { BadgeInfo, LocationId, LocationInfo } from '../types'

export const LOCATIONS: LocationInfo[] = [
  {
    id: 'drakengrot',
    name: 'Drakengrot',
    category: 'math',
    tagline: 'Help Vonk de grot verlichten!',
    guideName: 'Vonk',
    badgeName: 'Vuurrekenaar',
    crystalName: 'Rode Drakensteen',
    crystalEmoji: '🔴',
    themeClass: 'theme-drakengrot',
    mapPosition: { x: 16, y: 76 },
  },
  {
    id: 'arendsberg',
    name: 'Arendsberg',
    category: 'reading',
    tagline: 'Lees mee met Arend!',
    guideName: 'Arend',
    badgeName: 'Arendslezer',
    crystalName: 'Gouden Luchtsteen',
    crystalEmoji: '🟡',
    themeClass: 'theme-arendsberg',
    mapPosition: { x: 50, y: 26 },
  },
  {
    id: 'ninjabos',
    name: 'Ninjabos',
    category: 'letters',
    tagline: 'Open de geheime poort met Kage!',
    guideName: 'Kage',
    badgeName: 'Letter-ninja',
    crystalName: 'Blauwe Schaduwsteen',
    crystalEmoji: '🔵',
    themeClass: 'theme-ninjabos',
    mapPosition: { x: 82, y: 70 },
  },
]

export const BADGES: BadgeInfo[] = [
  { id: 'vuurrekenaar', name: 'Vuurrekenaar', locationId: 'drakengrot', icon: '🐉' },
  { id: 'arendslezer', name: 'Arendslezer', locationId: 'arendsberg', icon: '🦅' },
  { id: 'letter-ninja', name: 'Letter-ninja', locationId: 'ninjabos', icon: '🥷' },
]

export function getLocation(id: string): LocationInfo | undefined {
  return LOCATIONS.find((location) => location.id === id)
}

export function getBadgeForLocation(locationId: string): BadgeInfo | undefined {
  return BADGES.find((badge) => badge.locationId === locationId)
}

/**
 * The map path unlocks in order: the first stop is always open, and each next
 * stop opens once the previous one is completed. A completed stop stays
 * unlocked (and replayable) even if visited out of order.
 */
export function isLocationUnlocked(completedLocations: LocationId[], locationId: LocationId): boolean {
  const index = LOCATIONS.findIndex((location) => location.id === locationId)
  if (index <= 0) return true
  if (completedLocations.includes(locationId)) return true
  return completedLocations.includes(LOCATIONS[index - 1].id)
}

/** The next not-yet-completed stop on the path, or null once all are done. */
export function getFrontierLocation(completedLocations: LocationId[]): LocationInfo | null {
  return LOCATIONS.find((location) => !completedLocations.includes(location.id)) ?? null
}
