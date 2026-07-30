import type { ReactNode } from 'react'
import { ProgressDots } from '../common/ProgressDots'
import { AudioButton } from '../common/AudioButton'
import { HelpButton } from '../common/HelpButton'

interface ExerciseShell3DProps {
  locationName: string
  instruction: string
  spokenInstruction: string
  totalQuestions: number
  currentIndex: number
  onHelp: () => void
  feedback?: ReactNode
  scene: ReactNode
  overlay: ReactNode
}

/**
 * The 3D remake's exercise chrome: a full-bleed <Canvas> (via `scene`) with a
 * modern floating-glass UI layer on top - header, instruction card,
 * feedback, help button - plus the accessible DOM overlay (`overlay`) as a
 * final sibling. Conceptually the same job as ExerciseShell.tsx, restyled.
 */
export function ExerciseShell3D({
  locationName,
  instruction,
  spokenInstruction,
  totalQuestions,
  currentIndex,
  onHelp,
  feedback,
  scene,
  overlay,
}: ExerciseShell3DProps) {
  return (
    <div className="scene3d-stage">
      <div className="scene3d-canvas-layer">{scene}</div>

      <div className="scene3d-chrome-top">
        <h2 className="scene3d-title">{locationName}</h2>
        <ProgressDots total={totalQuestions} currentIndex={currentIndex} />
      </div>

      <div className="scene3d-instruction-card">
        <p data-testid="exercise-instruction">{instruction}</p>
        <AudioButton text={spokenInstruction} autoPlay />
      </div>

      <div className="scene3d-chrome-bottom">
        <div aria-live="polite" className="scene3d-feedback">
          {feedback}
        </div>
        <HelpButton onHelp={onHelp} />
      </div>

      {overlay}
    </div>
  )
}
