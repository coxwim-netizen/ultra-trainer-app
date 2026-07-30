export type ExerciseCategory = 'math' | 'reading' | 'letters'

export type LocationId = 'drakengrot' | 'arendsberg' | 'ninjabos'

export interface AnswerOption {
  id: string
  label: string
  /** Optional visual variant, e.g. a count of crystals to render instead of a number. */
  visualCount?: number
}

export interface Question {
  id: string
  category: ExerciseCategory
  /** Short on-screen instruction text. */
  instruction: string
  /** Text passed to speech synthesis; falls back to `instruction` when absent. */
  spokenInstruction?: string
  options: AnswerOption[]
  correctAnswerId: string
  /** Extra text spoken/shown when the child asks for help. */
  hint?: string
  difficulty: 1 | 2 | 3
  /** Word/emoji shown as the visual subject of the question, when relevant. */
  subject?: string
  /** Number represented visually with glowing crystals (math exercise). */
  visualNumber?: number
  /** Operator shown for math questions. */
  operator?: '+' | '-'
  operands?: [number, number]
  /** Word or letter this question highlights, used to bold it in a sentence. */
  highlightWord?: string
}

export interface LocationInfo {
  id: LocationId
  name: string
  category: ExerciseCategory
  tagline: string
  guideName: string
  badgeName: string
  crystalName: string
  crystalEmoji: string
  themeClass: string
  /** Emoji marker shown on the adventure map at this location's waypoint. */
  mapIcon: string
  /** Position of this location's waypoint on the map, in percentages. */
  mapPosition: { x: number; y: number }
}

export interface BadgeInfo {
  id: string
  name: string
  locationId: LocationId
  icon: string
}

export interface CategoryStats {
  attempts: number
  correctFirstTry: number
}

export interface ProgressState {
  playerName: string
  soundOn: boolean
  completedLocations: LocationId[]
  earnedBadges: string[]
  lastSessionDate: string | null
  exercisesCompleted: number
  correctFirstAttempts: number
  totalAttempts: number
  statsByCategory: Record<ExerciseCategory, CategoryStats>
}

export type Screen =
  | { name: 'start' }
  | { name: 'name' }
  | { name: 'map'; arrivingFrom?: LocationId }
  | { name: 'exercise'; location: LocationId }
  | { name: 'reward'; location: LocationId }
  | { name: 'victory' }
  | { name: 'parent' }
