import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import type { Group } from 'three'
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion'

interface Vonk3DProps {
  position?: [number, number, number]
  scale?: number
  breatheFire?: boolean
}

/** A procedural low-poly Vonk, matching the 2D version's orange/purple/cream palette and silhouette. */
export function Vonk3D({ position = [0, 0, 0], scale = 1, breatheFire = false }: Vonk3DProps) {
  const groupRef = useRef<Group>(null)
  const reducedMotion = usePrefersReducedMotion()

  useFrame((state) => {
    if (!groupRef.current || reducedMotion) return
    const t = state.clock.elapsedTime
    groupRef.current.position.y = position[1] + Math.sin(t * 1.6) * 0.06
    groupRef.current.rotation.y = Math.sin(t * 0.5) * 0.08
  })

  return (
    <group ref={groupRef} position={position} scale={scale}>
      {/* tail */}
      <mesh position={[-0.55, 0.05, -0.1]} rotation={[0, 0, 0.6]} castShadow>
        <coneGeometry args={[0.22, 0.6, 8]} />
        <meshStandardMaterial color="#e0393f" roughness={0.5} />
      </mesh>

      {/* wings */}
      <mesh position={[-0.35, 0.55, 0.25]} rotation={[0.3, 0.6, 0.4]} castShadow>
        <coneGeometry args={[0.32, 0.06, 4]} />
        <meshStandardMaterial color="#f2a65a" roughness={0.6} />
      </mesh>
      <mesh position={[0.35, 0.55, 0.25]} rotation={[0.3, -0.6, -0.4]} castShadow>
        <coneGeometry args={[0.32, 0.06, 4]} />
        <meshStandardMaterial color="#f2a65a" roughness={0.6} />
      </mesh>

      {/* body */}
      <mesh position={[0, 0.35, 0]} castShadow>
        <sphereGeometry args={[0.42, 24, 24]} />
        <meshStandardMaterial color="#ff8a3d" roughness={0.5} />
      </mesh>
      <mesh position={[0, 0.28, 0.28]}>
        <sphereGeometry args={[0.26, 20, 20]} />
        <meshStandardMaterial color="#ffd39b" roughness={0.6} />
      </mesh>

      {/* head */}
      <mesh position={[0, 0.9, 0.08]} castShadow>
        <sphereGeometry args={[0.3, 24, 24]} />
        <meshStandardMaterial color="#ff8a3d" roughness={0.5} />
      </mesh>
      {/* snout */}
      <mesh position={[0, 0.82, 0.32]}>
        <sphereGeometry args={[0.16, 16, 16]} />
        <meshStandardMaterial color="#ffd39b" roughness={0.6} />
      </mesh>

      {/* horns */}
      <mesh position={[-0.16, 1.14, 0.02]} rotation={[0.2, 0, -0.3]} castShadow>
        <coneGeometry args={[0.06, 0.24, 8]} />
        <meshStandardMaterial color="#6d28d9" roughness={0.4} />
      </mesh>
      <mesh position={[0.16, 1.14, 0.02]} rotation={[0.2, 0, 0.3]} castShadow>
        <coneGeometry args={[0.06, 0.24, 8]} />
        <meshStandardMaterial color="#6d28d9" roughness={0.4} />
      </mesh>

      {/* eyes */}
      <mesh position={[-0.11, 0.94, 0.32]}>
        <sphereGeometry args={[0.045, 12, 12]} />
        <meshStandardMaterial color="#2a1f18" />
      </mesh>
      <mesh position={[0.11, 0.94, 0.32]}>
        <sphereGeometry args={[0.045, 12, 12]} />
        <meshStandardMaterial color="#2a1f18" />
      </mesh>

      {breatheFire && (
        <mesh position={[0, 0.78, 0.55]} rotation={[Math.PI / 2, 0, 0]}>
          <coneGeometry args={[0.14, 0.5, 12]} />
          <meshStandardMaterial color="#f5b942" emissive="#ff8a3d" emissiveIntensity={2} />
        </mesh>
      )}
    </group>
  )
}
