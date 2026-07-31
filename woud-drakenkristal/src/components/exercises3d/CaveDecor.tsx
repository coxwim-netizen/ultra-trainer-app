import { Embers } from '../three/Embers'

const STALACTITES: [number, number, number][] = [
  [-3.2, 3.4, -1.5],
  [2.8, 3.6, -2.2],
  [-1.8, 3.2, -3],
  [3.6, 3.3, 0.5],
  [-3.6, 3.5, 1.2],
]

const ROCKS: [number, number, number, number][] = [
  [-3.4, -0.35, 1.8, 0.5],
  [3.2, -0.35, 2.2, 0.6],
  [-2.6, -0.4, -2.4, 0.4],
  [2.4, -0.38, -2.8, 0.45],
]

/** Cave dressing for Drakengrot: hanging stalactites, floor rocks, drifting embers. Purely decorative. */
export function CaveDecor() {
  return (
    <group>
      {STALACTITES.map(([x, y, z], i) => (
        <mesh key={i} position={[x, y, z]} rotation={[Math.PI, 0, 0]} castShadow>
          <coneGeometry args={[0.3 + (i % 2) * 0.15, 1.1 + (i % 3) * 0.4, 7]} />
          <meshStandardMaterial color="#4a3324" roughness={0.95} />
        </mesh>
      ))}
      {ROCKS.map(([x, y, z, s], i) => (
        <mesh key={i} position={[x, y, z]} scale={s} castShadow>
          <dodecahedronGeometry args={[0.6, 0]} />
          <meshStandardMaterial color="#5c4636" roughness={0.9} />
        </mesh>
      ))}
      <Embers count={36} spread={[7, 3, 7]} color="#ff8a3d" />
    </group>
  )
}
