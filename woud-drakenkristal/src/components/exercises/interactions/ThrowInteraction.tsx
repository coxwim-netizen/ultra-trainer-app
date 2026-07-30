import { useRef, useState, type PointerEvent as ReactPointerEvent } from 'react'
import { keyboardOnlyActivation, stateFor, type AnswerStageProps } from './types'

interface Offset {
  x: number
  y: number
}

export function ThrowInteraction({ options, status, selectedId, onSubmit, renderOption, ariaLabel, groupLabel }: AnswerStageProps) {
  const disabled = status !== 'idle'
  const optionRefs = useRef<Record<string, HTMLButtonElement | null>>({})
  const [offset, setOffset] = useState<Offset>({ x: 0, y: 0 })
  const [isDragging, setIsDragging] = useState(false)
  const [hoveredId, setHoveredId] = useState<string | null>(null)
  const dragStart = useRef<Offset>({ x: 0, y: 0 })

  const optionAtPoint = (clientX: number, clientY: number): string | null => {
    for (const option of options) {
      const el = optionRefs.current[option.id]
      if (!el) continue
      const rect = el.getBoundingClientRect()
      if (clientX >= rect.left && clientX <= rect.right && clientY >= rect.top && clientY <= rect.bottom) {
        return option.id
      }
    }
    return null
  }

  const handlePointerDown = (event: ReactPointerEvent<HTMLButtonElement>) => {
    if (disabled) return
    event.currentTarget.setPointerCapture(event.pointerId)
    dragStart.current = { x: event.clientX, y: event.clientY }
    setIsDragging(true)
  }

  const handlePointerMove = (event: ReactPointerEvent<HTMLButtonElement>) => {
    if (!isDragging) return
    setOffset({ x: event.clientX - dragStart.current.x, y: event.clientY - dragStart.current.y })
    setHoveredId(optionAtPoint(event.clientX, event.clientY))
  }

  const handlePointerUp = (event: ReactPointerEvent<HTMLButtonElement>) => {
    if (!isDragging) return
    setIsDragging(false)
    setOffset({ x: 0, y: 0 })
    setHoveredId(null)
    const landedId = optionAtPoint(event.clientX, event.clientY)
    if (landedId) onSubmit(landedId)
  }

  return (
    <div className="stack" style={{ alignItems: 'center' }}>
      <p className="interaction-caption">🎯 Sleep het sterretje naar het juiste antwoord!</p>
      <div className="options-grid" role="group" aria-label={groupLabel}>
        {options.map((option) => {
          const state = stateFor(option, selectedId, status)
          return (
            <button
              key={option.id}
              ref={(el) => {
                optionRefs.current[option.id] = el
              }}
              type="button"
              className="option-card option-card--cone"
              data-state={state}
              data-hovered={hoveredId === option.id}
              disabled={disabled}
              aria-label={ariaLabel(option)}
              onClick={keyboardOnlyActivation(() => onSubmit(option.id))}
            >
              {renderOption(option)}
            </button>
          )
        })}
      </div>
      <button
        type="button"
        className="throw-launcher"
        disabled={disabled}
        aria-hidden="true"
        tabIndex={-1}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        style={{
          touchAction: 'none',
          transform: `translate(${offset.x}px, ${offset.y}px)`,
          transition: isDragging ? 'none' : 'transform 0.3s ease',
        }}
      >
        ⭐
      </button>
    </div>
  )
}
