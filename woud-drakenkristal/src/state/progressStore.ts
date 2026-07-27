import type { ExerciseCategory, ProgressState } from '../types'

const STORAGE_KEY = 'woud-drakenkristal-progress'

const emptyCategoryStats = (): Record<ExerciseCategory, { attempts: number; correctFirstTry: number }> => ({
  math: { attempts: 0, correctFirstTry: 0 },
  reading: { attempts: 0, correctFirstTry: 0 },
  letters: { attempts: 0, correctFirstTry: 0 },
})

export function defaultProgress(): ProgressState {
  return {
    playerName: 'Woud',
    soundOn: true,
    completedLocations: [],
    earnedBadges: [],
    lastSessionDate: null,
    exercisesCompleted: 0,
    correctFirstAttempts: 0,
    totalAttempts: 0,
    statsByCategory: emptyCategoryStats(),
  }
}

export function loadProgress(): ProgressState {
  if (typeof window === 'undefined') return defaultProgress()
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return defaultProgress()
    const parsed = JSON.parse(raw) as Partial<ProgressState>
    return {
      ...defaultProgress(),
      ...parsed,
      statsByCategory: { ...emptyCategoryStats(), ...parsed.statsByCategory },
    }
  } catch {
    return defaultProgress()
  }
}

export function saveProgress(progress: ProgressState): void {
  if (typeof window === 'undefined') return
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(progress))
  } catch {
    // Storage may be unavailable (private browsing quota); progress just won't persist.
  }
}
