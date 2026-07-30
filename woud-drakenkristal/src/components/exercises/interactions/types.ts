import type { ReactNode } from 'react'
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
