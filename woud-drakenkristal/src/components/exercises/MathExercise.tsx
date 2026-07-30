import { useEffect, useRef, useState } from 'react'
import { useExerciseSession } from '../../hooks/useExerciseSession'
import { useSpeech } from '../../hooks/useSpeech'
import { ExerciseShell } from './ExerciseShell'
import { Vonk } from '../characters/Vonk'
import { CrystalGroup } from '../common/CrystalGroup'
import { getLocation } from '../../data/locations'
import { useSound } from '../../hooks/useSound'
import { AnswerStage } from './interactions/AnswerStage'

const location = getLocation('drakengrot')!

interface MathExerciseProps {
  onSessionFinished: () => void
}

export function MathExercise({ onSessionFinished }: MathExerciseProps) {
  const session = useExerciseSession('math', onSessionFinished)
  const { speak } = useSpeech()
  const { playSuccess, playGentleRetry } = useSound()
  const [highlightIndex, setHighlightIndex] = useState<number | undefined>(undefined)
  const helpTimeoutsRef = useRef<number[]>([])
  const prevStatusRef = useRef(session.status)

  useEffect(() => {
    if (prevStatusRef.current !== 'correct' && session.status === 'correct') playSuccess()
    if (prevStatusRef.current !== 'wrong' && session.status === 'wrong') playGentleRetry()
    prevStatusRef.current = session.status
  }, [session.status, playSuccess, playGentleRetry])

  useEffect(() => {
    setHighlightIndex(undefined)
    helpTimeoutsRef.current.forEach((id) => window.clearTimeout(id))
    helpTimeoutsRef.current = []
  }, [session.currentQuestion.id])

  const question = session.currentQuestion
  const total = question.visualNumber ?? 0

  const handleHelp = () => {
    session.requestHelp()
    const numbers = Array.from({ length: total }, (_, i) => String(i + 1)).join(', ')
    speak(`Laten we samen tellen. ${numbers}.`)
    helpTimeoutsRef.current.forEach((id) => window.clearTimeout(id))
    helpTimeoutsRef.current = []
    for (let i = 0; i < total; i++) {
      const id = window.setTimeout(() => setHighlightIndex(i), i * 550)
      helpTimeoutsRef.current.push(id)
    }
    const clearId = window.setTimeout(() => setHighlightIndex(undefined), total * 550 + 400)
    helpTimeoutsRef.current.push(clearId)
  }

  return (
    <ExerciseShell
      locationName={location.name}
      themeClass={location.themeClass}
      guide={<Vonk size={110} breatheFire={session.status === 'correct'} />}
      instruction={question.instruction}
      spokenInstruction={question.spokenInstruction ?? question.instruction}
      totalQuestions={session.questions.length}
      currentIndex={session.currentIndex}
      onHelp={handleHelp}
      sparkleTrigger={session.status === 'correct' ? session.currentIndex + 1 : 0}
      feedback={
        session.status === 'correct'
          ? 'Super gedaan! 🔥'
          : session.status === 'wrong'
            ? 'Bijna! Kijk nog eens goed. 👀'
            : undefined
      }
    >
      <CrystalGroup count={total} size={34} highlightIndex={highlightIndex} />
      {question.operator === '-' && (
        <p style={{ opacity: 0.7 }}>Hij geeft er {question.operands?.[1]} weg.</p>
      )}

      <AnswerStage
        kind={session.currentInteraction}
        options={question.options}
        status={session.status}
        selectedId={session.selectedId}
        onSubmit={session.submit}
        renderOption={(option) => (
          <>
            <CrystalGroup count={option.visualCount ?? Number(option.label)} size={20} />
            {option.label}
          </>
        )}
        ariaLabel={(option) => `${option.label} kristallen`}
        targetIcon={<Vonk size={48} animate={false} />}
        targetLabel="Vonk"
        groupLabel="Kies het juiste antwoord"
      />
    </ExerciseShell>
  )
}
