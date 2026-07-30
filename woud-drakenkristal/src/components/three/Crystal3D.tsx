import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import type { Mesh } from 'three'
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion'

interface Crystal3DProps {
  position?: [number, number, number]
  scale?: number
  highlighted?: boolean
}

export function Crystal3D({ position = [0, 0, 0], scale = 1, highlighted = false }: Crystal3DProps) {
  const meshRef = useRef<Mesh>(null)
  const reducedMotion = usePrefersReducedMotion()

  useFrame((state, delta) => {
    if (!meshRef.current || reducedMotion) return
    meshRef.current.rotation.y += delta * 0.5
    meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 2 + position[0]) * 0.04
  })

  return (
    <mesh ref={meshRef} position={position} scale={highlighted ? scale * 1.25 : scale} castShadow>
      <octahedronGeometry args={[0.26, 0]} />
      <meshStandardMaterial
        color={highlighted ? '#f5b942' : '#7c3aed'}
        emissive={highlighted ? '#f5b942' : '#8b5cf6'}
        emissiveIntensity={highlighted ? 1.1 : 0.6}
        roughness={0.25}
        metalness={0.15}
      />
    </mesh>
  )
}

interface CrystalGroup3DProps {
  count: number
  position?: [number, number, number]
  highlightIndex?: number
  compact?: boolean
}

/** Arranges `count` crystals in a wrapping grid - the 3D equivalent of the 2D CrystalGroup. */
export function CrystalGroup3D({ count, position = [0, 0, 0], highlightIndex, compact = false }: CrystalGroup3DProps) {
  const perRow = compact ? 3 : 5
  const spacing = compact ? 0.46 : 0.5
  return (
    <group position={position}>
      {Array.from({ length: count }, (_, i) => {
        const row = Math.floor(i / perRow)
        const col = i % perRow
        const rowCount = Math.min(perRow, count - row * perRow)
        const xOffset = (col - (rowCount - 1) / 2) * spacing
        return (
          <Crystal3D
            key={i}
            position={[xOffset, row * -spacing, 0]}
            scale={compact ? 0.75 : 1}
            highlighted={highlightIndex === i}
          />
        )
      })}
    </group>
  )
}
