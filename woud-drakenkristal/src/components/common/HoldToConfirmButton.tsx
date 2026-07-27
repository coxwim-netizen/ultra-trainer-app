import { useRef, useState } from 'react'

interface HoldToConfirmButtonProps {
  label: string
  holdMs?: number
  onConfirm: () => void
}

export function HoldToConfirmButton({ label, holdMs = 3000, onConfirm }: HoldToConfirmButtonProps) {
  const [progress, setProgress] = useState(0)
  const frameRef = useRef<number | null>(null)
  const startRef = useRef<number>(0)

  const stop = () => {
    if (frameRef.current !== null) cancelAnimationFrame(frameRef.current)
    frameRef.current = null
    setProgress(0)
  }

  const tick = () => {
    const elapsed = performance.now() - startRef.current
    const ratio = Math.min(1, elapsed / holdMs)
    setProgress(ratio)
    if (ratio >= 1) {
      stop()
      onConfirm()
      return
    }
    frameRef.current = requestAnimationFrame(tick)
  }

  const start = () => {
    startRef.current = performance.now()
    frameRef.current = requestAnimationFrame(tick)
  }

  return (
    <button
      type="button"
      className="btn btn-ghost"
      onPointerDown={start}
      onPointerUp={stop}
      onPointerLeave={stop}
      onPointerCancel={stop}
      style={{
        position: 'relative',
        overflow: 'hidden',
        background:
          progress > 0
            ? `linear-gradient(to right, var(--crystal-light) ${progress * 100}%, rgba(255,255,255,0.6) ${progress * 100}%)`
            : undefined,
      }}
    >
      {label}
    </button>
  )
}
