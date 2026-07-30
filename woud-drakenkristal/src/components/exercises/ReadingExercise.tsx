import { useEffect, useRef, useState } from 'react'
import { useExerciseSession } from '../../hooks/useExerciseSession'
import { useSpeech } from '../../hooks/useSpeech'
import { useSound } from '../../hooks/useSound'
import { ExerciseShell } from './ExerciseShell'
import { Arend } from '../characters/Arend'
import { getLocation } from '../../data/locations'
import { READING_SCENES } from '../../data/readingQuestions'
import { AnswerStage } from './interactions/AnswerStage'

const location = getLocation('arendsberg')!

interface ReadingExerciseProps {
  onSessionFinished: () => void
}

function renderSentence(sentence: string, highlightWord?: string, active?: boolean) {
  if (!highlightWord) return sentence
  const index = sentence.toLowerCase().indexOf(highlightWord.toLowerCase())
  if (index === -1) return sentence
  const before = sentence.slice(0, index)
  const match = sentence.slice(index, index + highlightWord.length)
  const after = sentence.slice(index + highlightWord.length)
  return (
    <>
      {before}
      <mark
        style={{
          background: active ? 'var(--gold)' : 'transparent',
          color: 'inherit',
          borderRadius: 6,
          padding: '0 2px',
        }}
      >
        {match}
      </mark>
      {after}
    </>
  )
}

export function ReadingExercise({ onSessionFinished }: ReadingExerciseProps) {
  const session = useExerciseSession('reading', onSessionFinished)
  const { speak } = useSpeech()
  const { playSuccess, playGentleRetry } = useSound()
  const [feathers, setFeathers] = useState(0)
  const prevStatusRef = useRef(session.status)

  useEffect(() => {
    if (prevStatusRef.current !== 'correct' && session.status === 'correct') {
      playSuccess()
      setFeathers((f) => f + 1)
    }
    if (prevStatusRef.current !== 'wrong' && session.status === 'wrong') playGentleRetry()
    prevStatusRef.current = session.status
  }, [session.status, playSuccess, playGentleRetry])

  const question = session.currentQuestion
  const showHighlight = session.status === 'wrong' || session.helpVisible

  const handleHelp = () => {
    session.requestHelp()
    speak(question.spokenInstruction ?? question.instruction)
  }

  return (
    <ExerciseShell
      locationName={location.name}
      themeClass={location.themeClass}
      guide={<Arend size={110} />}
      instruction={renderSentence(question.instruction, question.highlightWord, showHighlight)}
      spokenInstruction={question.spokenInstruction ?? question.instruction}
      totalQuestions={session.questions.length}
      currentIndex={session.currentIndex}
      onHelp={handleHelp}
      sparkleTrigger={session.status === 'correct' ? session.currentIndex + 1 : 0}
      feedback={
        session.status === 'correct'
          ? 'De arend wijst je de weg! 🦅'
          : session.status === 'wrong'
            ? 'Bijna! Luister nog eens goed.'
            : undefined
      }
    >
      <div className="row" aria-label={`${feathers} veren verzameld`}>
        {Array.from({ length: feathers }).map((_, i) => (
          <span key={i} aria-hidden="true">
            🪶
          </span>
        ))}
      </div>

      <AnswerStage
        kind={session.currentInteraction}
        options={question.options}
        status={session.status}
        selectedId={session.selectedId}
        onSubmit={session.submit}
        renderOption={(option) => {
          const scene = READING_SCENES[option.id]
          return (
            <>
              <span style={{ fontSize: '2.4rem' }} aria-hidden="true">
                {scene.emoji}
              </span>
              <span style={{ fontSize: '0.95rem', fontWeight: 500 }}>{scene.label}</span>
            </>
          )
        }}
        ariaLabel={(option) => READING_SCENES[option.id].description}
        targetIcon={<Arend size={48} animate={false} />}
        targetLabel="Arend's nest"
        groupLabel="Kies het juiste plaatje"
      />
    </ExerciseShell>
  )
}
