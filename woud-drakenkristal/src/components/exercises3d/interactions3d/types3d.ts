import type { ReactNode } from 'react'
import type { AnswerOption } from '../../../types'
import type { AnswerStatus } from '../../../hooks/useExerciseSession'

/**
 * The 3D equivalent of AnswerStageProps (src/components/exercises/interactions/types.ts).
 * Same shape and names on purpose - only what implements it changes.
 * `renderOption` now returns 3D primitives (JSX meshes) rather than DOM markup.
 */
export interface AnswerStage3DProps {
  options: AnswerOption[]
  status: AnswerStatus
  selectedId: string | null
  onSubmit: (optionId: string) => void
  renderOption: (option: AnswerOption, state: { highlighted: boolean }) => ReactNode
  ariaLabel: (option: AnswerOption) => string
  targetLabel: string
  groupLabel: string
}

export function stateFor3D(
  option: AnswerOption,
  selectedId: string | null,
  status: AnswerStatus,
): 'correct' | 'incorrect' | undefined {
  if (selectedId !== option.id) return undefined
  if (status === 'correct') return 'correct'
  if (status === 'wrong') return 'incorrect'
  return undefined
}
