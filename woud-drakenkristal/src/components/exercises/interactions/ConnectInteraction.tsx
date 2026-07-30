import { useRef, useState, type PointerEvent as ReactPointerEvent } from 'react'
import { keyboardOnlyActivation, stateFor, type AnswerStageProps } from './types'

interface Point {
  x: number
  y: number
}

export function ConnectInteraction({
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
  const containerRef = useRef<HTMLDivElement>(null)
  const startRef = useRef<HTMLDivElement>(null)
  const optionRefs = useRef<Record<string, HTMLButtonElement | null>>({})
  const [line, setLine] = useState<{ from: Point; to: Point } | null>(null)
  const [hoveredId, setHoveredId] = useState<string | null>(null)

  const relativePoint = (clientX: number, clientY: number): Point => {
    const containerRect = containerRef.current?.getBoundingClientRect()
    return { x: clientX - (containerRect?.left ?? 0), y: clientY - (containerRect?.top ?? 0) }
  }

  const startCenter = (): Point => {
    const rect = startRef.current?.getBoundingClientRect()
    const containerRect = containerRef.current?.getBoundingClientRect()
    if (!rect || !containerRect) return { x: 0, y: 0 }
    return { x: rect.left + rect.width / 2 - containerRect.left, y: rect.top + rect.height / 2 - containerRect.top }
  }

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

  const handleStartPointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (disabled) return
    event.currentTarget.setPointerCapture(event.pointerId)
    setLine({ from: startCenter(), to: relativePoint(event.clientX, event.clientY) })
  }

  const handleStartPointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (!line) return
    setLine({ from: startCenter(), to: relativePoint(event.clientX, event.clientY) })
    setHoveredId(optionAtPoint(event.clientX, event.clientY))
  }

  const handleStartPointerUp = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (!line) return
    const landedId = optionAtPoint(event.clientX, event.clientY)
    setLine(null)
    setHoveredId(null)
    if (landedId) onSubmit(landedId)
  }

  return (
    <div className="stack" style={{ alignItems: 'center' }}>
      <p className="interaction-caption">🔗 Trek een lijn naar het juiste antwoord!</p>
      <div ref={containerRef} className="connect-stage">
        <svg className="connect-line-layer" aria-hidden="true">
          {line && (
            <line x1={line.from.x} y1={line.from.y} x2={line.to.x} y2={line.to.y} className="connect-line" />
          )}
        </svg>
        <div
          ref={startRef}
          className="connect-start"
          aria-hidden="true"
          style={{ touchAction: 'none' }}
          onPointerDown={handleStartPointerDown}
          onPointerMove={handleStartPointerMove}
          onPointerUp={handleStartPointerUp}
        >
          {targetIcon}
          <span>{targetLabel}</span>
        </div>
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
                className="option-card"
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
      </div>
    </div>
  )
}
