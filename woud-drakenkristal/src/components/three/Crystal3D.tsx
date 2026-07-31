import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import type { Group } from 'three'
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion'

interface Crystal3DProps {
  position?: [number, number, number]
  scale?: number
  highlighted?: boolean
}

/** A small faceted gem cluster (main shard + two accent shards + a glowing core), not a single primitive. */
export function Crystal3D({ position = [0, 0, 0], scale = 1, highlighted = false }: Crystal3DProps) {
  const groupRef = useRef<Group>(null)
  const reducedMotion = usePrefersReducedMotion()

  useFrame((state, delta) => {
    if (!groupRef.current || reducedMotion) return
    groupRef.current.rotation.y += delta * 0.5
    groupRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 2 + position[0]) * 0.04
  })

  const color = highlighted ? '#f5b942' : '#7c3aed'
  const emissive = highlighted ? '#f5b942' : '#8b5cf6'
  const finalScale = highlighted ? scale * 1.25 : scale

  return (
    <group ref={groupRef} position={position} scale={finalScale}>
      <mesh castShadow>
        <icosahedronGeometry args={[0.22, 1]} />
        <meshPhysicalMaterial
          color={color}
          emissive={emissive}
          emissiveIntensity={highlighted ? 1.2 : 0.65}
          roughness={0.15}
          metalness={0.1}
          clearcoat={0.9}
          clearcoatRoughness={0.1}
        />
      </mesh>
      <mesh position={[0.14, 0.1, 0.05]} rotation={[0.4, 0.6, 0.2]} scale={0.5} castShadow>
        <icosahedronGeometry args={[0.22, 0]} />
        <meshPhysicalMaterial color={color} emissive={emissive} emissiveIntensity={0.5} roughness={0.2} clearcoat={0.7} />
      </mesh>
      <mesh position={[-0.12, -0.08, -0.08]} rotation={[0.8, 0.2, 0.5]} scale={0.38} castShadow>
        <icosahedronGeometry args={[0.22, 0]} />
        <meshPhysicalMaterial color={color} emissive={emissive} emissiveIntensity={0.5} roughness={0.2} clearcoat={0.7} />
      </mesh>
      <mesh scale={0.4}>
        <sphereGeometry args={[0.22, 12, 12]} />
        <meshStandardMaterial color="#fff7e0" emissive={emissive} emissiveIntensity={2} toneMapped={false} />
      </mesh>
    </group>
  )
}

interface CrystalGroup3DProps {
  count: number
  position?: [number, number, number]
  highlightIndex?: number
  compact?: boolean
}

/** Arranges `count` crystal clusters in a wrapping grid - the 3D equivalent of the 2D CrystalGroup. */
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
