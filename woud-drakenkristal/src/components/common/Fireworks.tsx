import { useEffect, useRef } from 'react'

interface FireworksProps {
  trigger: number
  bursts?: number
}

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  color: string
  life: number
}

const COLORS = ['#f5b942', '#e0393f', '#7c3aed', '#38bdf8', '#22d3ee', '#ffffff']

function spawnBurst(x: number, y: number): Particle[] {
  const count = 26
  return Array.from({ length: count }, (_, i) => {
    const angle = (Math.PI * 2 * i) / count + Math.random() * 0.3
    const speed = 2 + Math.random() * 3
    return {
      x,
      y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      life: 1,
    }
  })
}

export function Fireworks({ trigger, bursts = 3 }: FireworksProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const frameRef = useRef<number | null>(null)

  useEffect(() => {
    if (trigger === 0) return
    const canvas = canvasRef.current
    if (!canvas) return
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reducedMotion) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const parent = canvas.parentElement
    const width = parent?.clientWidth ?? canvas.clientWidth
    const height = parent?.clientHeight ?? canvas.clientHeight
    canvas.width = width
    canvas.height = height

    let particles: Particle[] = []
    let burstsLaunched = 0
    const launchTimers: number[] = []

    const launchNext = () => {
      const x = width * (0.2 + Math.random() * 0.6)
      const y = height * (0.2 + Math.random() * 0.4)
      particles = particles.concat(spawnBurst(x, y))
      burstsLaunched += 1
      if (burstsLaunched < bursts) {
        launchTimers.push(window.setTimeout(launchNext, 350 + Math.random() * 300))
      }
    }
    launchNext()

    const tick = () => {
      ctx.clearRect(0, 0, width, height)
      particles = particles
        .map((p) => ({
          ...p,
          x: p.x + p.vx,
          y: p.y + p.vy + 0.04,
          vx: p.vx * 0.98,
          life: p.life - 0.018,
        }))
        .filter((p) => p.life > 0)

      particles.forEach((p) => {
        ctx.globalAlpha = Math.max(p.life, 0)
        ctx.fillStyle = p.color
        ctx.beginPath()
        ctx.arc(p.x, p.y, 2.4, 0, Math.PI * 2)
        ctx.fill()
      })
      ctx.globalAlpha = 1

      if (particles.length > 0 || burstsLaunched < bursts) {
        frameRef.current = requestAnimationFrame(tick)
      }
    }
    frameRef.current = requestAnimationFrame(tick)

    return () => {
      if (frameRef.current !== null) cancelAnimationFrame(frameRef.current)
      launchTimers.forEach((id) => window.clearTimeout(id))
      ctx.clearRect(0, 0, width, height)
    }
  }, [trigger, bursts])

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none' }}
    />
  )
}
