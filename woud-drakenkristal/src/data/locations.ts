import type { BadgeInfo, LocationInfo } from '../types'

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
