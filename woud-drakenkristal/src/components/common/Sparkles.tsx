import { useEffect, useRef, useState } from 'react'

interface SparkleItem {
  id: number
  left: number
  top: number
  emoji: string
  delay: number
}

interface SparklesProps {
  trigger: number
  count?: number
  emojis?: string[]
}

const DEFAULT_EMOJIS = ['✨', '⭐', '💫']

export function Sparkles({ trigger, count = 10, emojis = DEFAULT_EMOJIS }: SparklesProps) {
  const [sparkles, setSparkles] = useState<SparkleItem[]>([])
  const nextId = useRef(0)

  useEffect(() => {
    if (trigger === 0) return
    const created: SparkleItem[] = Array.from({ length: count }).map(() => ({
      id: nextId.current++,
      left: Math.random() * 100,
      top: Math.random() * 100,
      emoji: emojis[Math.floor(Math.random() * emojis.length)],
      delay: Math.random() * 0.3,
    }))
    setSparkles(created)
    const timeout = window.setTimeout(() => setSparkles([]), 1300)
    return () => window.clearTimeout(timeout)
  }, [trigger])

  return (
    <div className="sparkle-layer" aria-hidden="true" style={{ position: 'absolute', inset: 0 }}>
      {sparkles.map((s) => (
        <span
          key={s.id}
          className="sparkle"
          style={{ left: `${s.left}%`, top: `${s.top}%`, animationDelay: `${s.delay}s` }}
        >
          {s.emoji}
        </span>
      ))}
    </div>
  )
}
