import { screen, fireEvent, waitFor } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { renderWithGame } from '../../test/testUtils'
import { Math3DExercise } from './Math3DExercise'
import { MATH_QUESTIONS } from '../../data/mathQuestions'

// jsdom cannot mount <Canvas> (no ResizeObserver, no WebGL - confirmed in
// plan Stage 0), and per the plan's testing strategy, gameplay tests should
// never need to: the accessible overlay is a full alternative path. Stubbing
// out the 3D scene subtree keeps this test focused on real session logic
// (question progression, labels, completion) without touching WebGL at all.
vi.mock('../three/SceneShell', () => ({ SceneShell: () => null }))

function correctLabelFor(instructionText: string): string {
  const question = MATH_QUESTIONS.find((q) => q.instruction === instructionText)
  if (!question) throw new Error(`Onbekende vraag: ${instructionText}`)
  const correctOption = question.options.find((o) => o.id === question.correctAnswerId)
  if (!correctOption) throw new Error('Geen correct antwoord gevonden')
  return correctOption.label
}

describe('Math3DExercise (3D remake, Stage 2 checkpoint)', () => {
  it('completes all 5 questions via the accessible overlay and calls onSessionFinished', async () => {
    const onSessionFinished = vi.fn()
    renderWithGame(<Math3DExercise onSessionFinished={onSessionFinished} />)

    for (let i = 0; i < 5; i++) {
      const instructionEl = await screen.findByTestId('exercise-instruction')
      const label = correctLabelFor(instructionEl.textContent ?? '')
      const button = screen.getByRole('button', { name: `${label} kristallen` })

      fireEvent.click(button)

      if (i < 4) {
        await waitFor(
          () => expect(screen.getByRole('status')).toHaveAttribute('aria-label', `Vraag ${i + 2} van 5`),
          { timeout: 2500 },
        )
      }
    }

    await waitFor(() => expect(onSessionFinished).toHaveBeenCalledTimes(1), { timeout: 2500 })
  }, 20000)

  it('disables the overlay while a correct/wrong result is resolving', async () => {
    renderWithGame(<Math3DExercise onSessionFinished={() => {}} />)

    const instructionEl = await screen.findByTestId('exercise-instruction')
    const label = correctLabelFor(instructionEl.textContent ?? '')
    const button = screen.getByRole('button', { name: `${label} kristallen` })

    fireEvent.click(button)
    await waitFor(() => expect(button).toBeDisabled())
  })
})
