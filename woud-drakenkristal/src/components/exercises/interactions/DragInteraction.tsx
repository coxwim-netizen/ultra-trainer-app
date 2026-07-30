import { useRef, useState, type PointerEvent as ReactPointerEvent } from 'react'
import { keyboardOnlyActivation, stateFor, type AnswerStageProps } from './types'

interface Offset {
  x: number
  y: number
}

function rectsOverlap(a: DOMRect, b: DOMRect): boolean {
  return a.left < b.right && a.right > b.left && a.top < b.bottom && a.bottom > b.top
}

export function DragInteraction({
  options,
  status,
  selectedId,
  onSubmit,
  renderOption,
  ariaLabel,
  targetIcon,
  targetLabel,
  groupLabel,
}: AnswerStageProps) {
  const disabled = status !== 'idle'
  const targetRef = useRef<HTMLDivElement>(null)
  const [offsets, setOffsets] = useState<Record<string, Offset>>({})
  const [draggingId, setDraggingId] = useState<string | null>(null)
  const dragStart = useRef<Offset>({ x: 0, y: 0 })

  const handlePointerDown = (event: ReactPointerEvent<HTMLButtonElement>, optionId: string) => {
    if (disabled) return
    event.currentTarget.setPointerCapture(event.pointerId)
    dragStart.current = { x: event.clientX, y: event.clientY }
    setDraggingId(optionId)
  }

  const handlePointerMove = (event: ReactPointerEvent<HTMLButtonElement>, optionId: string) => {
    if (draggingId !== optionId) return
    setOffsets((prev) => ({
      ...prev,
      [optionId]: { x: event.clientX - dragStart.current.x, y: event.clientY - dragStart.current.y },
    }))
  }

  const handlePointerUp = (event: ReactPointerEvent<HTMLButtonElement>, optionId: string) => {
    if (draggingId !== optionId) return
    setDraggingId(null)
    const tileRect = event.currentTarget.getBoundingClientRect()
    const targetRect = targetRef.current?.getBoundingClientRect()
    const droppedOnTarget = targetRect ? rectsOverlap(tileRect, targetRect) : false
    setOffsets((prev) => ({ ...prev, [optionId]: { x: 0, y: 0 } }))
    if (droppedOnTarget) onSubmit(optionId)
  }

  return (
    <div className="stack" style={{ alignItems: 'center' }}>
      <p className="interaction-caption">✋ Sleep het juiste antwoord naar {targetLabel}!</p>
      <div ref={targetRef} className="drag-target" aria-hidden="true">
        {targetIcon}
        <span>{targetLabel}</span>
      </div>
      <div className="options-grid" role="group" aria-label={groupLabel}>
        {options.map((option) => {
          const state = stateFor(option, selectedId, status)
          const offset = offsets[option.id] ?? { x: 0, y: 0 }
          const isDragging = draggingId === option.id
          return (
            <button
              key={option.id}
              type="button"
              className="option-card option-card--drag"
              data-state={state}
              disabled={disabled}
              aria-label={ariaLabel(option)}
              onClick={keyboardOnlyActivation(() => onSubmit(option.id))}
              onPointerDown={(e) => handlePointerDown(e, option.id)}
              onPointerMove={(e) => handlePointerMove(e, option.id)}
              onPointerUp={(e) => handlePointerUp(e, option.id)}
              style={{
                touchAction: 'none',
                transform: `translate(${offset.x}px, ${offset.y}px)`,
                transition: isDragging ? 'none' : 'transform 0.25s ease',
                zIndex: isDragging ? 2 : 1,
              }}
            >
              {renderOption(option)}
            </button>
          )
        })}
      </div>
    </div>
  )
}
