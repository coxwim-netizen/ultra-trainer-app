import { screen, fireEvent, waitFor } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { renderWithGame } from '../../test/testUtils'
import { MathExercise } from './MathExercise'
import { MATH_QUESTIONS } from '../../data/mathQuestions'

function correctLabelFor(instructionText: string): string {
  const question = MATH_QUESTIONS.find((q) => q.instruction === instructionText)
  if (!question) throw new Error(`Onbekende vraag: ${instructionText}`)
  const correctOption = question.options.find((o) => o.id === question.correctAnswerId)
  if (!correctOption) throw new Error('Geen correct antwoord gevonden')
  return correctOption.label
}

describe('MathExercise', () => {
  it('completes all 5 questions and calls onSessionFinished', async () => {
    const onSessionFinished = vi.fn()
    renderWithGame(<MathExercise onSessionFinished={onSessionFinished} />)

    for (let i = 0; i < 5; i++) {
      const instructionEl = await screen.findByTestId('exercise-instruction')
      const label = correctLabelFor(instructionEl.textContent ?? '')
      const button = screen.getByRole('button', { name: `${label} kristallen` })

      fireEvent.click(button)
      await waitFor(() => expect(button).toHaveAttribute('data-state', 'correct'))

      if (i < 4) {
        await waitFor(
          () => expect(screen.getByRole('status')).toHaveAttribute('aria-label', `Vraag ${i + 2} van 5`),
          { timeout: 2500 },
        )
      }
    }

    await waitFor(() => expect(onSessionFinished).toHaveBeenCalledTimes(1), { timeout: 2500 })
  }, 20000)

  it('allows another attempt after an incorrect answer without losing progress', async () => {
    const onSessionFinished = vi.fn()
    renderWithGame(<MathExercise onSessionFinished={onSessionFinished} />)

    const instructionEl = await screen.findByTestId('exercise-instruction')
    const label = correctLabelFor(instructionEl.textContent ?? '')
    const buttons = screen.getAllByRole('button', { name: /kristallen$/ })
    const wrongButton = buttons.find((btn) => !btn.getAttribute('aria-label')?.startsWith(`${label} `))
    expect(wrongButton).toBeDefined()

    fireEvent.click(wrongButton!)
    await waitFor(() => expect(wrongButton).toHaveAttribute('data-state', 'incorrect'))

    // Options remain visible and clickable again after the gentle shake.
    await waitFor(() => expect(wrongButton).not.toBeDisabled(), { timeout: 2000 })

    const correctButton = screen.getByRole('button', { name: `${label} kristallen` })
    fireEvent.click(correctButton)
    await waitFor(() => expect(correctButton).toHaveAttribute('data-state', 'correct'))
  }, 10000)
})
