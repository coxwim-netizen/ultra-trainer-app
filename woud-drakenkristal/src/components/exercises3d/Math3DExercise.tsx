import { useEffect, useRef } from 'react'
import { useExerciseSession } from '../../hooks/useExerciseSession'
import { useSound } from '../../hooks/useSound'
import { getLocation } from '../../data/locations'
import { SceneShell } from '../three/SceneShell'
import { Vonk3D } from '../characters3d/Vonk3D'
import { CrystalGroup3D } from '../three/Crystal3D'
import { Drag3DInteraction } from './interactions3d/Drag3DInteraction'
import { AccessibleOverlay } from '../three/AccessibleOverlay'
import { ExerciseShell3D } from './ExerciseShell3D'
import { CaveDecor } from './CaveDecor'

const location = getLocation('drakengrot')!

interface Math3DExerciseProps {
  onSessionFinished: () => void
}

/**
 * Stage 2 checkpoint: Drakengrot fully rewritten for the 3D remake, using
 * the drag mechanic exclusively (all 5 mechanics being ported to 3D is
 * Stage 4 - see the plan). Reading and letters stay on the 2D pipeline
 * until then.
 */
export function Math3DExercise({ onSessionFinished }: Math3DExerciseProps) {
  const session = useExerciseSession('math', onSessionFinished)
  const { playSuccess, playGentleRetry } = useSound()
  const prevStatusRef = useRef(session.status)

  useEffect(() => {
    if (prevStatusRef.current !== 'correct' && session.status === 'correct') playSuccess()
    if (prevStatusRef.current !== 'wrong' && session.status === 'wrong') playGentleRetry()
    prevStatusRef.current = session.status
  }, [session.status, playSuccess, playGentleRetry])

  const question = session.currentQuestion

  return (
    <ExerciseShell3D
      locationName={location.name}
      instruction={question.instruction}
      spokenInstruction={question.spokenInstruction ?? question.instruction}
      totalQuestions={session.questions.length}
      currentIndex={session.currentIndex}
      onHelp={session.requestHelp}
      feedback={
        session.status === 'correct'
          ? 'Super gedaan! 🔥'
          : session.status === 'wrong'
            ? 'Bijna! Kijk nog eens goed. 👀'
            : undefined
      }
      scene={
        <SceneShell backgroundColor="#2a1a3d" groundColor="#4a2f1a" fogColor="#2a1a3d">
          <CaveDecor />
          <Vonk3D position={[0, 0, 1.8]} scale={1.1} breatheFire={session.status === 'correct'} />
          <CrystalGroup3D count={question.visualNumber ?? 0} position={[1.9, -0.15, 3.4]} compact />
          <Drag3DInteraction
            options={question.options}
            status={session.status}
            selectedId={session.selectedId}
            onSubmit={session.submit}
            targetPosition={[0, 0, 1.6]}
            renderOption={(option) => (
              <CrystalGroup3D count={option.visualCount ?? Number(option.label)} compact />
            )}
          />
        </SceneShell>
      }
      overlay={
        <AccessibleOverlay
          groupLabel="Kies het juiste antwoord"
          targets={question.options.map((option) => ({
            id: option.id,
            label: `${option.label} kristallen`,
            onActivate: () => session.submit(option.id),
            disabled: session.status !== 'idle',
          }))}
        />
      }
    />
  )
}
