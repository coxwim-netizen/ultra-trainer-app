import { useEffect, useRef, useState } from 'react'

type Phase = 'idle' | 'shake' | 'crack' | 'reveal'

interface EggHatchProps {
  trigger: number
  onDone?: () => void
}

const TIMINGS: Record<Phase, number> = { idle: 0, shake: 650, crack: 350, reveal: 900 }

export function EggHatch({ trigger, onDone }: EggHatchProps) {
  const [phase, setPhase] = useState<Phase>('idle')
  const onDoneRef = useRef(onDone)
  onDoneRef.current = onDone

  useEffect(() => {
    if (trigger === 0) return
    const timeouts: number[] = []
    let elapsed = 0
    const sequence: Phase[] = ['shake', 'crack', 'reveal']
    sequence.forEach((step) => {
      timeouts.push(window.setTimeout(() => setPhase(step), elapsed))
      elapsed += TIMINGS[step]
    })
    timeouts.push(
      window.setTimeout(() => {
        setPhase('idle')
        onDoneRef.current?.()
      }, elapsed),
    )
    return () => timeouts.forEach((id) => window.clearTimeout(id))
  }, [trigger])

  if (phase === 'idle') return null

  return (
    <div className="egg-hatch" aria-hidden="true">
      {phase === 'shake' && <span className="egg-hatch__egg egg-hatch__shake">🥚</span>}
      {phase === 'crack' && <span className="egg-hatch__egg egg-hatch__crack">🥚</span>}
      {phase === 'reveal' && (
        <span className="egg-hatch__reveal">
          🐣<span className="egg-hatch__sparkle">✨</span>
        </span>
      )}
    </div>
  )
}
