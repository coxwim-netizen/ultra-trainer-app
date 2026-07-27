import { useEffect, useRef, useState } from 'react'
import { useExerciseSession } from '../../hooks/useExerciseSession'
import { useSpeech } from '../../hooks/useSpeech'
import { useSound } from '../../hooks/useSound'
import { ExerciseShell } from './ExerciseShell'
import { Kage } from '../characters/Kage'
import { getLocation } from '../../data/locations'

const location = getLocation('ninjabos')!

interface LetterExerciseProps {
  onSessionFinished: () => void
}

export function LetterExercise({ onSessionFinished }: LetterExerciseProps) {
  const session = useExerciseSession('letters', onSessionFinished)
  const { speak } = useSpeech()
  const { playSuccess, playGentleRetry } = useSound()
  const prevStatusRef = useRef(session.status)
  const [objectPulse, setObjectPulse] = useState(0)

  useEffect(() => {
    if (prevStatusRef.current !== 'correct' && session.status === 'correct') playSuccess()
    if (prevStatusRef.current !== 'wrong' && session.status === 'wrong') playGentleRetry()
    prevStatusRef.current = session.status
  }, [session.status, playSuccess, playGentleRetry])

  const question = session.currentQuestion

  const handleHelp = () => {
    session.requestHelp()
    speak(question.hint ?? question.instruction)
    setObjectPulse((p) => p + 1)
  }

  return (
    <ExerciseShell
      locationName={location.name}
      themeClass={location.themeClass}
      guide={<Kage size={110} jump={session.status === 'correct'} />}
      instruction={question.instruction}
      spokenInstruction={question.spokenInstruction ?? question.instruction}
      totalQuestions={session.questions.length}
      currentIndex={session.currentIndex}
      onHelp={handleHelp}
      sparkleTrigger={session.status === 'correct' ? session.currentIndex + 1 : 0}
      feedback={
        session.status === 'correct'
          ? 'De geheime poort gaat verder open! ✨'
          : session.status === 'wrong'
            ? 'Goed geprobeerd! Luister nog eens.'
            : undefined
      }
    >
      {question.subject && (
        <span
          key={objectPulse}
          data-testid="exercise-subject"
          style={{ fontSize: '4rem' }}
          className={objectPulse > 0 ? 'idle-flicker' : ''}
          aria-hidden="true"
        >
          {question.subject}
        </span>
      )}

      <div className="options-grid" role="group" aria-label="Kies het juiste antwoord">
        {question.options.map((option) => {
          const state =
            session.selectedId === option.id
              ? session.status === 'correct'
                ? 'correct'
                : session.status === 'wrong'
                  ? 'incorrect'
                  : undefined
              : undefined
          return (
            <button
              key={option.id}
              type="button"
              className="option-card"
              data-state={state}
              onClick={() => session.submit(option.id)}
              disabled={session.status !== 'idle'}
            >
              {option.label}
            </button>
          )
        })}
      </div>
    </ExerciseShell>
  )
}
