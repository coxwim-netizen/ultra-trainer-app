import { screen, fireEvent, waitFor } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { renderWithGame } from '../../test/testUtils'
import { ReadingExercise } from './ReadingExercise'
import { READING_QUESTIONS, READING_SCENES } from '../../data/readingQuestions'

function correctSceneDescription(sentence: string): string {
  const question = READING_QUESTIONS.find((q) => q.instruction === sentence)
  if (!question) throw new Error(`Onbekende zin: ${sentence}`)
  return READING_SCENES[question.correctAnswerId].description
}

describe('ReadingExercise', () => {
  it('completes all 5 questions and calls onSessionFinished', async () => {
    const onSessionFinished = vi.fn()
    renderWithGame(<ReadingExercise onSessionFinished={onSessionFinished} />)

    for (let i = 0; i < 5; i++) {
      const instructionEl = await screen.findByTestId('exercise-instruction')
      const description = correctSceneDescription(instructionEl.textContent ?? '')
      const button = screen.getByRole('button', { name: description })

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

  it('shows three scene options to choose from', async () => {
    renderWithGame(<ReadingExercise onSessionFinished={() => {}} />)
    await screen.findByTestId('exercise-instruction')
    expect(screen.getAllByRole('button', { name: /^Een .+\.$/ })).toHaveLength(3)
  })
})
