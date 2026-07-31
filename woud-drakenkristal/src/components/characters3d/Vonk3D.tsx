import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import type { Group } from 'three'
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion'

interface Vonk3DProps {
  position?: [number, number, number]
  scale?: number
  breatheFire?: boolean
}

const BODY = '#ff8a3d'
const BODY_DARK = '#e0722a'
const BELLY = '#ffd39b'
const HORN = '#6d28d9'
const HORN_DARK = '#5b1fb0'
const RED = '#e0393f'
const INK = '#2a1f18'

function Claw({ position }: { position: [number, number, number] }) {
  return (
    <mesh position={position} rotation={[Math.PI / 2.4, 0, 0]} castShadow>
      <coneGeometry args={[0.035, 0.12, 6]} />
      <meshStandardMaterial color="#3a2f26" roughness={0.4} />
    </mesh>
  )
}

function BackSpike({ position, scale = 1 }: { position: [number, number, number]; scale?: number }) {
  return (
    <mesh position={position} rotation={[0.5, 0, 0]} scale={scale} castShadow>
      <coneGeometry args={[0.05, 0.16, 6]} />
      <meshStandardMaterial color={HORN} roughness={0.35} metalness={0.1} />
    </mesh>
  )
}

function Wing({ side }: { side: 1 | -1 }) {
  return (
    <group position={[side * 0.32, 0.62, 0.15]} rotation={[0.25, side * 0.55, side * 0.35]}>
      {/* arm bone */}
      <mesh position={[side * 0.18, 0, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
        <cylinderGeometry args={[0.035, 0.05, 0.4, 8]} />
        <meshStandardMaterial color={BODY_DARK} roughness={0.5} />
      </mesh>
      {/* membrane */}
      <mesh position={[side * 0.42, -0.1, 0]} rotation={[0, 0, side * 0.15]} castShadow>
        <coneGeometry args={[0.5, 0.05, 4]} />
        <meshPhysicalMaterial color={BODY} roughness={0.4} clearcoat={0.4} transparent opacity={0.92} />
      </mesh>
      {/* finger spars */}
      {[0.16, 0.32, 0.46].map((len, i) => (
        <mesh
          key={i}
          position={[side * (0.2 + i * 0.14), -0.04 - i * 0.06, 0]}
          rotation={[0, 0, side * (0.3 + i * 0.18)]}
          castShadow
        >
          <coneGeometry args={[0.02, len, 5]} />
          <meshStandardMaterial color={BODY_DARK} roughness={0.5} />
        </mesh>
      ))}
    </group>
  )
}

/** A procedural low-poly Vonk with real wing structure, back spikes, claws, and facial detail. */
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
      {/* tail: three tapered segments curving back */}
      <mesh position={[-0.5, 0.12, -0.15]} rotation={[0, 0, 0.5]} castShadow>
        <cylinderGeometry args={[0.16, 0.12, 0.35, 10]} />
        <meshStandardMaterial color={RED} roughness={0.45} />
      </mesh>
      <mesh position={[-0.75, 0.02, -0.28]} rotation={[0, 0, 0.75]} castShadow>
        <cylinderGeometry args={[0.12, 0.07, 0.32, 10]} />
        <meshStandardMaterial color={RED} roughness={0.45} />
      </mesh>
      <mesh position={[-0.95, -0.12, -0.36]} rotation={[0, 0, 1]} castShadow>
        <coneGeometry args={[0.07, 0.28, 8]} />
        <meshStandardMaterial color={HORN} roughness={0.4} />
      </mesh>

      {/* back spikes along the spine */}
      {[0.05, -0.15, -0.38, -0.6].map((x, i) => (
        <BackSpike key={i} position={[x, 0.62 - i * 0.03, -0.12]} scale={1 - i * 0.12} />
      ))}

      {/* wings */}
      <Wing side={-1} />
      <Wing side={1} />

      {/* legs + clawed feet */}
      {[-0.2, 0.2].map((x) => (
        <group key={x} position={[x, -0.28, 0.18]}>
          <mesh castShadow>
            <cylinderGeometry args={[0.11, 0.13, 0.24, 10]} />
            <meshStandardMaterial color={BODY_DARK} roughness={0.5} />
          </mesh>
          <Claw position={[-0.06, -0.16, 0.05]} />
          <Claw position={[0, -0.17, 0.08]} />
          <Claw position={[0.06, -0.16, 0.05]} />
        </group>
      ))}

      {/* body + belly plates */}
      <mesh position={[0, 0.35, 0]} castShadow>
        <sphereGeometry args={[0.42, 28, 28]} />
        <meshPhysicalMaterial color={BODY} roughness={0.45} clearcoat={0.3} clearcoatRoughness={0.4} />
      </mesh>
      {[0.14, -0.02, -0.16].map((y, i) => (
        <mesh key={i} position={[0, 0.34 + y, 0.3 - i * 0.03]} scale={[1 - i * 0.12, 0.55 - i * 0.08, 0.4]} castShadow>
          <sphereGeometry args={[0.24, 16, 16]} />
          <meshStandardMaterial color={BELLY} roughness={0.6} />
        </mesh>
      ))}

      {/* head */}
      <mesh position={[0, 0.9, 0.08]} castShadow>
        <sphereGeometry args={[0.3, 28, 28]} />
        <meshPhysicalMaterial color={BODY} roughness={0.45} clearcoat={0.3} />
      </mesh>
      {/* snout */}
      <mesh position={[0, 0.82, 0.32]} scale={[1, 0.85, 1.1]}>
        <sphereGeometry args={[0.17, 20, 20]} />
        <meshStandardMaterial color={BELLY} roughness={0.6} />
      </mesh>
      {/* nostrils */}
      <mesh position={[-0.06, 0.85, 0.46]}>
        <sphereGeometry args={[0.02, 8, 8]} />
        <meshStandardMaterial color={INK} />
      </mesh>
      <mesh position={[0.06, 0.85, 0.46]}>
        <sphereGeometry args={[0.02, 8, 8]} />
        <meshStandardMaterial color={INK} />
      </mesh>
      {/* smile */}
      <mesh position={[0, 0.74, 0.42]} rotation={[Math.PI / 2, 0, Math.PI]}>
        <torusGeometry args={[0.1, 0.014, 8, 16, Math.PI * 0.9]} />
        <meshStandardMaterial color={INK} />
      </mesh>
      {/* fangs */}
      <mesh position={[-0.09, 0.7, 0.4]} rotation={[Math.PI, 0, 0]}>
        <coneGeometry args={[0.02, 0.06, 6]} />
        <meshStandardMaterial color="#fff7e0" />
      </mesh>
      <mesh position={[0.09, 0.7, 0.4]} rotation={[Math.PI, 0, 0]}>
        <coneGeometry args={[0.02, 0.06, 6]} />
        <meshStandardMaterial color="#fff7e0" />
      </mesh>

      {/* brow ridges */}
      <mesh position={[-0.12, 1.0, 0.28]} rotation={[0, 0, 0.3]} scale={[1, 0.5, 0.6]}>
        <sphereGeometry args={[0.06, 12, 12]} />
        <meshStandardMaterial color={BODY_DARK} roughness={0.5} />
      </mesh>
      <mesh position={[0.12, 1.0, 0.28]} rotation={[0, 0, -0.3]} scale={[1, 0.5, 0.6]}>
        <sphereGeometry args={[0.06, 12, 12]} />
        <meshStandardMaterial color={BODY_DARK} roughness={0.5} />
      </mesh>

      {/* horns: main pair + smaller crown pair */}
      <mesh position={[-0.16, 1.16, 0.02]} rotation={[0.2, 0, -0.35]} castShadow>
        <coneGeometry args={[0.06, 0.28, 6]} />
        <meshPhysicalMaterial color={HORN} roughness={0.3} clearcoat={0.5} />
      </mesh>
      <mesh position={[0.16, 1.16, 0.02]} rotation={[0.2, 0, 0.35]} castShadow>
        <coneGeometry args={[0.06, 0.28, 6]} />
        <meshPhysicalMaterial color={HORN} roughness={0.3} clearcoat={0.5} />
      </mesh>
      <mesh position={[-0.08, 1.18, -0.08]} rotation={[0.35, 0, -0.15]} castShadow>
        <coneGeometry args={[0.035, 0.15, 6]} />
        <meshStandardMaterial color={HORN_DARK} roughness={0.3} />
      </mesh>
      <mesh position={[0.08, 1.18, -0.08]} rotation={[0.35, 0, 0.15]} castShadow>
        <coneGeometry args={[0.035, 0.15, 6]} />
        <meshStandardMaterial color={HORN_DARK} roughness={0.3} />
      </mesh>

      {/* ear fins */}
      <mesh position={[-0.28, 0.92, -0.02]} rotation={[0, 0.4, 0.2]}>
        <coneGeometry args={[0.09, 0.03, 4]} />
        <meshStandardMaterial color={BODY_DARK} roughness={0.5} />
      </mesh>
      <mesh position={[0.28, 0.92, -0.02]} rotation={[0, -0.4, -0.2]}>
        <coneGeometry args={[0.09, 0.03, 4]} />
        <meshStandardMaterial color={BODY_DARK} roughness={0.5} />
      </mesh>

      {/* eyes */}
      <mesh position={[-0.11, 0.94, 0.32]}>
        <sphereGeometry args={[0.05, 14, 14]} />
        <meshStandardMaterial color={INK} />
      </mesh>
      <mesh position={[0.11, 0.94, 0.32]}>
        <sphereGeometry args={[0.05, 14, 14]} />
        <meshStandardMaterial color={INK} />
      </mesh>
      <mesh position={[-0.095, 0.955, 0.36]}>
        <sphereGeometry args={[0.016, 8, 8]} />
        <meshStandardMaterial color="#fff" />
      </mesh>
      <mesh position={[0.125, 0.955, 0.36]}>
        <sphereGeometry args={[0.016, 8, 8]} />
        <meshStandardMaterial color="#fff" />
      </mesh>

      {/* cheek blush */}
      <mesh position={[-0.22, 0.82, 0.24]}>
        <sphereGeometry args={[0.045, 10, 10]} />
        <meshStandardMaterial color="#ff6b6b" transparent opacity={0.45} />
      </mesh>
      <mesh position={[0.22, 0.82, 0.24]}>
        <sphereGeometry args={[0.045, 10, 10]} />
        <meshStandardMaterial color="#ff6b6b" transparent opacity={0.45} />
      </mesh>

      {breatheFire && (
        <group position={[0, 0.78, 0.55]}>
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <coneGeometry args={[0.14, 0.5, 12]} />
            <meshStandardMaterial color="#f5b942" emissive="#ff8a3d" emissiveIntensity={2} />
          </mesh>
          <mesh position={[0, 0, 0.15]} rotation={[Math.PI / 2, 0, 0]}>
            <coneGeometry args={[0.07, 0.3, 10]} />
            <meshStandardMaterial color="#fff3d6" emissive="#f5b942" emissiveIntensity={2.4} />
          </mesh>
        </group>
      )}
    </group>
  )
}
