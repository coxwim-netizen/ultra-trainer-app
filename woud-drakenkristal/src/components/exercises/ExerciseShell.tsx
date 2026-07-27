import type { ReactNode } from 'react'
import { ProgressDots } from '../common/ProgressDots'
import { AudioButton } from '../common/AudioButton'
import { HelpButton } from '../common/HelpButton'
import { Sparkles } from '../common/Sparkles'

interface ExerciseShellProps {
  locationName: string
  themeClass: string
  guide: ReactNode
  instruction: ReactNode
  spokenInstruction: string
  totalQuestions: number
  currentIndex: number
  onHelp: () => void
  feedback?: ReactNode
  sparkleTrigger: number
  children: ReactNode
}

export function ExerciseShell({
  locationName,
  themeClass,
  guide,
  instruction,
  spokenInstruction,
  totalQuestions,
  currentIndex,
  onHelp,
  feedback,
  sparkleTrigger,
  children,
}: ExerciseShellProps) {
  return (
    <div className={`stack ${themeClass}`} style={{ position: 'relative' }}>
      <Sparkles trigger={sparkleTrigger} />
      <div className="row-between">
        <h2>{locationName}</h2>
        <ProgressDots total={totalQuestions} currentIndex={currentIndex} />
      </div>

      <div className="card stack center-col">
        {guide}
        <div className="row" style={{ justifyContent: 'center' }}>
          <p data-testid="exercise-instruction" style={{ fontSize: '1.4rem', fontWeight: 700, maxWidth: 480 }}>
            {instruction}
          </p>
          <AudioButton text={spokenInstruction} autoPlay />
        </div>

        {children}

        <div aria-live="polite" style={{ minHeight: 32, fontSize: '1.2rem', fontWeight: 700, color: 'var(--success)' }}>
          {feedback}
        </div>

        <HelpButton onHelp={onHelp} />
      </div>
    </div>
  )
}
