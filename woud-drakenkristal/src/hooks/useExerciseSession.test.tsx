import { act, renderHook, waitFor } from '@testing-library/react'
import type { ReactNode } from 'react'
import { describe, expect, it, vi } from 'vitest'
import { useExerciseSession } from './useExerciseSession'
import { GameProvider } from '../state/GameContext'
import { INTERACTION_KINDS } from '../components/exercises/interactions/types'

function wrapper({ children }: { children: ReactNode }) {
  return <GameProvider>{children}</GameProvider>
}

describe('useExerciseSession interaction cycling', () => {
  it('uses each of the 5 answer mechanics exactly once per session', async () => {
    const onSessionFinished = vi.fn()
    const { result } = renderHook(() => useExerciseSession('math', onSessionFinished), { wrapper })

    const seenMechanics: string[] = []
    for (let i = 0; i < 5; i++) {
      seenMechanics.push(result.current.currentInteraction)
      const correctId = result.current.currentQuestion.correctAnswerId

      act(() => {
        result.current.submit(correctId)
      })

      if (i < 4) {
        await waitFor(() => expect(result.current.currentIndex).toBe(i + 1), { timeout: 2500 })
      } else {
        await waitFor(() => expect(onSessionFinished).toHaveBeenCalledTimes(1), { timeout: 2500 })
      }
    }

    expect(seenMechanics).toHaveLength(5)
    expect(new Set(seenMechanics)).toEqual(new Set(INTERACTION_KINDS))
  }, 20000)
})
