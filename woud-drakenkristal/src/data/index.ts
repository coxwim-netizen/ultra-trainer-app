import type { ExerciseCategory, Question } from '../types'
import { MATH_QUESTIONS } from './mathQuestions'
import { READING_QUESTIONS } from './readingQuestions'
import { LETTER_QUESTIONS } from './letterQuestions'

export const QUESTION_BANKS: Record<ExerciseCategory, Question[]> = {
  math: MATH_QUESTIONS,
  reading: READING_QUESTIONS,
  letters: LETTER_QUESTIONS,
}

export const QUESTIONS_PER_SESSION = 5

export * from './locations'
export * from './mathQuestions'
export * from './readingQuestions'
export * from './letterQuestions'
