import type { MouseEvent as ReactMouseEvent, ReactNode } from 'react'
import type { AnswerOption } from '../../../types'
import type { AnswerStatus } from '../../../hooks/useExerciseSession'

export type InteractionKind = 'throw' | 'drag' | 'catch' | 'swipe' | 'connect'

export const INTERACTION_KINDS: InteractionKind[] = ['throw', 'drag', 'catch', 'swipe', 'connect']

export interface AnswerStageProps {
  options: AnswerOption[]
  status: AnswerStatus
  selectedId: string | null
  onSubmit: (optionId: string) => void
  renderOption: (option: AnswerOption) => ReactNode
  ariaLabel: (option: AnswerOption) => string | undefined
  targetIcon: ReactNode
  targetLabel: string
  groupLabel: string
}

export function stateFor(
  option: AnswerOption,
  selectedId: string | null,
  status: AnswerStatus,
): 'correct' | 'incorrect' | undefined {
  if (selectedId !== option.id) return undefined
  if (status === 'correct') return 'correct'
  if (status === 'wrong') return 'incorrect'
  return undefined
}

/**
 * For mechanics where the point is a drag/throw/swipe/draw gesture, a plain
 * pointer click would let a child skip the gesture entirely. Browsers set
 * `detail: 0` on the click event synthesized by a keyboard Enter/Space
 * activation (as opposed to `1+` for a real mouse/touch click), so this lets
 * keyboard and screen-reader users still select directly - the accessible
 * equivalent of performing the gesture - while pointer/touch users must
 * actually do it.
 */
export function keyboardOnlyActivation(onActivate: () => void) {
  return (event: ReactMouseEvent) => {
    if (event.detail === 0) onActivate()
  }
}
