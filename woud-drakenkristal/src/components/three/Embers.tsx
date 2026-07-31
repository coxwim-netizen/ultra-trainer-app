import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { AdditiveBlending, BufferAttribute, type Points } from 'three'
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion'

interface EmbersProps {
  count?: number
  spread?: [number, number, number]
  color?: string
}

/**
 * A small drifting-ember particle effect built on plain three.js Points/
 * PointsMaterial (no drei <Sparkles>) - drei's Sparkles produced a fully
 * black canvas when combined with this project's EffectComposer/Bloom
 * setup, so this sticks to the plain, well-supported primitive instead.
 */
export function Embers({ count = 40, spread = [8, 3, 8], color = '#ff8a3d' }: EmbersProps) {
  const pointsRef = useRef<Points>(null)
  const reducedMotion = usePrefersReducedMotion()

  const { positions, speeds } = useMemo(() => {
    const positions = new Float32Array(count * 3)
    const speeds = new Float32Array(count)
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * spread[0]
      positions[i * 3 + 1] = Math.random() * spread[1]
      positions[i * 3 + 2] = (Math.random() - 0.5) * spread[2]
      speeds[i] = 0.15 + Math.random() * 0.25
    }
    return { positions, speeds }
  }, [count])

  useFrame((_, delta) => {
    if (!pointsRef.current || reducedMotion) return
    const attr = pointsRef.current.geometry.getAttribute('position') as BufferAttribute
    for (let i = 0; i < count; i++) {
      let y = attr.getY(i) + speeds[i] * delta
      if (y > spread[1]) y = 0
      attr.setY(i, y)
    }
    attr.needsUpdate = true
  })

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial color={color} size={0.06} transparent opacity={0.75} blending={AdditiveBlending} depthWrite={false} />
    </points>
  )
}
