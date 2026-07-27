import { screen, fireEvent, waitFor } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { renderWithGame } from '../../test/testUtils'
import { LetterExercise } from './LetterExercise'
import { LETTER_QUESTIONS } from '../../data/letterQuestions'

// The five "match the word" questions share the same instruction text, so the
// subject emoji is needed too in order to identify which question is showing.
function correctLabelFor(instructionText: string, subject: string): string {
  const question = LETTER_QUESTIONS.find((q) => q.instruction === instructionText && q.subject === subject)
  if (!question) throw new Error(`Onbekende vraag: ${instructionText} (${subject})`)
  const correctOption = question.options.find((o) => o.id === question.correctAnswerId)
  if (!correctOption) throw new Error('Geen correct antwoord gevonden')
  return correctOption.label
}

describe('LetterExercise', () => {
  it('completes all 5 questions (letters and words) and calls onSessionFinished', async () => {
    const onSessionFinished = vi.fn()
    renderWithGame(<LetterExercise onSessionFinished={onSessionFinished} />)

    for (let i = 0; i < 5; i++) {
      const instructionEl = await screen.findByTestId('exercise-instruction')
      const subjectEl = await screen.findByTestId('exercise-subject')
      const label = correctLabelFor(instructionEl.textContent ?? '', subjectEl.textContent ?? '')
      const button = screen.getByRole('button', { name: label })

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
})
