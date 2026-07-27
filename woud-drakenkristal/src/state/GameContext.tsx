import { createContext, useContext, useMemo, useState, type ReactNode } from 'react'
import type { ExerciseCategory, LocationId, ProgressState, Screen } from '../types'
import { defaultProgress, loadProgress, saveProgress } from './progressStore'
import { getBadgeForLocation } from '../data/locations'

interface GameContextValue {
  screen: Screen
  goTo: (screen: Screen) => void
  progress: ProgressState
  setPlayerName: (name: string) => void
  toggleSound: () => void
  recordAnswer: (category: ExerciseCategory, isFirstAttempt: boolean, isCorrect: boolean) => void
  completeLocation: (locationId: LocationId) => void
  resetProgress: () => void
}

const GameContext = createContext<GameContextValue | null>(null)

export function GameProvider({ children }: { children: ReactNode }) {
  const [screen, setScreen] = useState<Screen>({ name: 'start' })
  const [progress, setProgress] = useState<ProgressState>(() => loadProgress())

  const update = (updater: (prev: ProgressState) => ProgressState) => {
    setProgress((prev) => {
      const next = updater(prev)
      saveProgress(next)
      return next
    })
  }

  const value = useMemo<GameContextValue>(
    () => ({
      screen,
      goTo: setScreen,
      progress,
      setPlayerName: (name: string) => {
        update((prev) => ({ ...prev, playerName: name.trim() || 'Woud' }))
      },
      toggleSound: () => {
        update((prev) => ({ ...prev, soundOn: !prev.soundOn }))
      },
      recordAnswer: (category, isFirstAttempt, isCorrect) => {
        update((prev) => {
          const categoryStats = prev.statsByCategory[category]
          return {
            ...prev,
            totalAttempts: prev.totalAttempts + 1,
            correctFirstAttempts: prev.correctFirstAttempts + (isFirstAttempt && isCorrect ? 1 : 0),
            statsByCategory: {
              ...prev.statsByCategory,
              [category]: {
                attempts: categoryStats.attempts + 1,
                correctFirstTry: categoryStats.correctFirstTry + (isFirstAttempt && isCorrect ? 1 : 0),
              },
            },
          }
        })
      },
      completeLocation: (locationId) => {
        update((prev) => {
          const badge = getBadgeForLocation(locationId)
          const completedLocations = prev.completedLocations.includes(locationId)
            ? prev.completedLocations
            : [...prev.completedLocations, locationId]
          const earnedBadges = badge && !prev.earnedBadges.includes(badge.id) ? [...prev.earnedBadges, badge.id] : prev.earnedBadges
          return {
            ...prev,
            completedLocations,
            earnedBadges,
            exercisesCompleted: prev.exercisesCompleted + 1,
            lastSessionDate: new Date().toISOString(),
          }
        })
      },
      resetProgress: () => {
        update((prev) => ({ ...defaultProgress(), playerName: prev.playerName, soundOn: prev.soundOn }))
      },
    }),
    [screen, progress],
  )

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>
}

export function useGame(): GameContextValue {
  const context = useContext(GameContext)
  if (!context) throw new Error('useGame must be used within a GameProvider')
  return context
}
