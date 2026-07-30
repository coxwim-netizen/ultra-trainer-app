import { useRef, useState, type PointerEvent as ReactPointerEvent } from 'react'
import { stateFor, type AnswerStageProps } from './types'

const SWIPE_THRESHOLD = 55

export function SwipeInteraction({
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
  const [dragX, setDragX] = useState<Record<string, number>>({})
  const [draggingId, setDraggingId] = useState<string | null>(null)
  const startX = useRef(0)

  const handlePointerDown = (event: ReactPointerEvent<HTMLButtonElement>, optionId: string) => {
    if (disabled) return
    event.currentTarget.setPointerCapture(event.pointerId)
    startX.current = event.clientX
    setDraggingId(optionId)
  }

  const handlePointerMove = (event: ReactPointerEvent<HTMLButtonElement>, optionId: string) => {
    if (draggingId !== optionId) return
    setDragX((prev) => ({ ...prev, [optionId]: event.clientX - startX.current }))
  }

  const handlePointerUp = (optionId: string) => {
    if (draggingId !== optionId) return
    setDraggingId(null)
    const delta = dragX[optionId] ?? 0
    setDragX((prev) => ({ ...prev, [optionId]: 0 }))
    if (Math.abs(delta) > SWIPE_THRESHOLD) onSubmit(optionId)
  }

  return (
    <div className="stack" style={{ alignItems: 'center' }}>
      <p className="interaction-caption">
        👉 Veeg het juiste antwoord naar {targetLabel}! <span aria-hidden="true">{targetIcon}</span>
      </p>
      <div className="options-grid" role="group" aria-label={groupLabel}>
        {options.map((option) => {
          const state = stateFor(option, selectedId, status)
          const x = dragX[option.id] ?? 0
          const isDragging = draggingId === option.id
          return (
            <button
              key={option.id}
              type="button"
              className="option-card option-card--swipe"
              data-state={state}
              disabled={disabled}
              aria-label={ariaLabel(option)}
              onClick={() => onSubmit(option.id)}
              onPointerDown={(e) => handlePointerDown(e, option.id)}
              onPointerMove={(e) => handlePointerMove(e, option.id)}
              onPointerUp={() => handlePointerUp(option.id)}
              style={{
                touchAction: 'none',
                transform: `translateX(${x}px) rotate(${x / 20}deg)`,
                transition: isDragging ? 'none' : 'transform 0.25s ease',
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
