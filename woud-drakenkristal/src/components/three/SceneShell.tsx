import { Suspense, type ReactNode } from 'react'
import { Canvas } from '@react-three/fiber'
import { ContactShadows } from '@react-three/drei'
import { EffectComposer, Bloom, Vignette } from '@react-three/postprocessing'

interface SceneShellProps {
  children: ReactNode
  backgroundColor: string
  groundColor: string
  fogColor: string
  cameraPosition?: [number, number, number]
}

/**
 * The reusable camera + lighting + environment rig every 3D scene in the
 * remake sits inside. Kept deliberately simple/cheap (a handful of lights,
 * one contact-shadow blob, no realtime environment map) so it stays
 * tablet-friendly - see plan Stage 0 bundle/perf notes.
 */
export function SceneShell({
  children,
  backgroundColor,
  groundColor,
  fogColor,
  cameraPosition = [7, 6, 10],
}: SceneShellProps) {
  return (
    <Canvas
      shadows
      dpr={[1, 2]}
      gl={{ antialias: true }}
      camera={{ position: cameraPosition, fov: 55 }}
      style={{ width: '100%', height: '100%', display: 'block' }}
    >
      <color attach="background" args={[backgroundColor]} />
      <fog attach="fog" args={[fogColor, 12, 30]} />

      <hemisphereLight args={[backgroundColor, groundColor, 0.65]} />
      <directionalLight
        position={[5, 8, 4]}
        intensity={1.8}
        color="#fff3d6"
        castShadow
        shadow-mapSize={[1024, 1024]}
        shadow-bias={-0.0005}
      />
      <directionalLight position={[-6, 4, -3]} intensity={0.5} color="#8fd6ff" />

      <mesh position={[0, -0.51, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <circleGeometry args={[10, 48]} />
        <meshStandardMaterial color={groundColor} roughness={0.9} />
      </mesh>
      <ContactShadows position={[0, -0.5, 0]} opacity={0.55} blur={2.2} scale={16} far={4} />

      <Suspense fallback={null}>{children}</Suspense>

      <EffectComposer multisampling={0}>
        <Bloom luminanceThreshold={0.5} luminanceSmoothing={0.3} intensity={0.7} mipmapBlur />
        <Vignette eskil={false} offset={0.15} darkness={0.6} />
      </EffectComposer>
    </Canvas>
  )
}
