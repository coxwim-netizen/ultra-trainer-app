import { useState, type ReactNode } from 'react'
import type { ThreeEvent } from '@react-three/fiber'
import type { AnswerOption } from '../../../types'
import type { AnswerStatus } from '../../../hooks/useExerciseSession'
import { stateFor3D } from './types3d'

const DROP_RADIUS = 0.9
const SLOT_SPACING = 1.5

interface Drag3DInteractionProps {
  options: AnswerOption[]
  status: AnswerStatus
  selectedId: string | null
  onSubmit: (optionId: string) => void
  renderOption: (option: AnswerOption, state: { highlighted: boolean }) => ReactNode
  targetPosition?: [number, number, number]
}

/**
 * 3D rewrite of DragInteraction.tsx: drag a tile across an invisible ground
 * plane (using R3F's built-in pointer events - event.point is already the
 * world-space intersection, no manual raycasting needed) and drop it near
 * the target. Dropping on the wrong spot snaps back to its slot; nothing is
 * lost. This is the mechanic Stage 2 exists to prove out in 3D.
 */
export function Drag3DInteraction({
  options,
  status,
  selectedId,
  onSubmit,
  renderOption,
  targetPosition = [0, 0, 1.8],
}: Drag3DInteractionProps) {
  const disabled = status !== 'idle'
  const [draggingId, setDraggingId] = useState<string | null>(null)
  const [offsets, setOffsets] = useState<Record<string, { x: number; z: number }>>({})
  const [hovering, setHovering] = useState(false)

  const slotPosition = (index: number): [number, number, number] => {
    const x = (index - (options.length - 1) / 2) * SLOT_SPACING
    return [x, 0.3, -0.4]
  }

  const distanceToTarget = (x: number, z: number) => {
    const dx = x - targetPosition[0]
    const dz = z - targetPosition[2]
    return Math.sqrt(dx * dx + dz * dz)
  }

  const handlePointerDown = (event: ThreeEvent<PointerEvent>, optionId: string) => {
    if (disabled) return
    event.stopPropagation()
    setDraggingId(optionId)
  }

  const handleGroundPointerMove = (event: ThreeEvent<PointerEvent>) => {
    if (!draggingId) return
    const [baseX, , baseZ] = slotPosition(options.findIndex((o) => o.id === draggingId))
    const x = event.point.x - baseX
    const z = event.point.z - baseZ
    setOffsets((prev) => ({ ...prev, [draggingId]: { x, z } }))
    setHovering(distanceToTarget(event.point.x, event.point.z) < DROP_RADIUS)
  }

  const handleGroundPointerUp = (event: ThreeEvent<PointerEvent>) => {
    if (!draggingId) return
    const landedOnTarget = distanceToTarget(event.point.x, event.point.z) < DROP_RADIUS
    const finishedId = draggingId
    setDraggingId(null)
    setHovering(false)
    setOffsets((prev) => ({ ...prev, [finishedId]: { x: 0, z: 0 } }))
    if (landedOnTarget) onSubmit(finishedId)
  }

  return (
    <group>
      {/* invisible ground plane that captures drag movement across the whole scene */}
      <mesh
        position={[0, 0.3, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
        visible={false}
        onPointerMove={handleGroundPointerMove}
        onPointerUp={handleGroundPointerUp}
        onPointerLeave={handleGroundPointerUp}
      >
        <planeGeometry args={[12, 12]} />
      </mesh>

      {/* drop-target marker (a soft glowing ring) */}
      <mesh position={[targetPosition[0], 0.02, targetPosition[2]]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[DROP_RADIUS * 0.75, DROP_RADIUS, 32]} />
        <meshStandardMaterial
          color={hovering ? '#f5b942' : '#c4b5fd'}
          emissive={hovering ? '#f5b942' : '#7c3aed'}
          emissiveIntensity={hovering ? 1 : 0.4}
          transparent
          opacity={0.8}
        />
      </mesh>

      {options.map((option, index) => {
        const [x, y, z] = slotPosition(index)
        const offset = offsets[option.id] ?? { x: 0, z: 0 }
        const state = stateFor3D(option, selectedId, status)
        return (
          <group
            key={option.id}
            position={[x + offset.x, y, z + offset.z]}
            onPointerDown={(e) => handlePointerDown(e, option.id)}
          >
            {renderOption(option, { highlighted: state === 'correct' })}
          </group>
        )
      })}
    </group>
  )
}
