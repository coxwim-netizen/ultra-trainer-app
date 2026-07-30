import { useEffect, useMemo, useRef, useState } from 'react'
import type { ExerciseCategory, Question } from '../types'
import { QUESTION_BANKS, QUESTIONS_PER_SESSION } from '../data'
import { pickRandom, shuffle } from '../utils/random'
import { useGame } from '../state/GameContext'

export type AnswerStatus = 'idle' | 'correct' | 'wrong'

interface UseExerciseSessionResult {
  questions: Question[]
  currentIndex: number
  currentQuestion: Question
  status: AnswerStatus
  selectedId: string | null
  attemptsOnCurrent: number
  helpVisible: boolean
  finished: boolean
  submit: (optionId: string) => void
  requestHelp: () => void
}

const CORRECT_ADVANCE_DELAY = 1500
const WRONG_RESET_DELAY = 900

export function useExerciseSession(
  category: ExerciseCategory,
  onSessionFinished: () => void,
): UseExerciseSessionResult {
  const { recordAnswer } = useGame()
  // Re-shuffle each question's option order fresh per session, so the correct
  // answer's position varies both across questions and across replays.
  const questions = useMemo(
    () =>
      pickRandom(QUESTION_BANKS[category], QUESTIONS_PER_SESSION).map((question) => ({
        ...question,
        options: shuffle(question.options),
      })),
    [category],
  )

  const [currentIndex, setCurrentIndex] = useState(0)
  const [status, setStatus] = useState<AnswerStatus>('idle')
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [attemptsOnCurrent, setAttemptsOnCurrent] = useState(0)
  const [helpVisible, setHelpVisible] = useState(false)
  const [finished, setFinished] = useState(false)
  const timeoutRef = useRef<number | null>(null)
  const finishedCallback = useRef(onSessionFinished)
  finishedCallback.current = onSessionFinished

  useEffect(() => {
    return () => {
      if (timeoutRef.current !== null) window.clearTimeout(timeoutRef.current)
    }
  }, [])

  const currentQuestion = questions[Math.min(currentIndex, questions.length - 1)]

  const submit = (optionId: string) => {
    if (status !== 'idle' || finished) return
    const isCorrect = optionId === currentQuestion.correctAnswerId
    const isFirstAttempt = attemptsOnCurrent === 0
    recordAnswer(category, isFirstAttempt, isCorrect)
    setSelectedId(optionId)

    if (isCorrect) {
      setStatus('correct')
      timeoutRef.current = window.setTimeout(() => {
        setSelectedId(null)
        setStatus('idle')
        setAttemptsOnCurrent(0)
        setHelpVisible(false)
        if (currentIndex + 1 >= questions.length) {
          setFinished(true)
          finishedCallback.current()
        } else {
          setCurrentIndex((prev) => prev + 1)
        }
      }, CORRECT_ADVANCE_DELAY)
    } else {
      setStatus('wrong')
      setAttemptsOnCurrent((prev) => prev + 1)
      timeoutRef.current = window.setTimeout(() => {
        setStatus('idle')
        setSelectedId(null)
      }, WRONG_RESET_DELAY)
    }
  }

  const requestHelp = () => setHelpVisible(true)

  return {
    questions,
    currentIndex,
    currentQuestion,
    status,
    selectedId,
    attemptsOnCurrent,
    helpVisible,
    finished,
    submit,
    requestHelp,
  }
}
