import type { ReactElement } from 'react'
import type { InteractionKind, AnswerStageProps } from './types'
import { ThrowInteraction } from './ThrowInteraction'
import { DragInteraction } from './DragInteraction'
import { CatchInteraction } from './CatchInteraction'
import { SwipeInteraction } from './SwipeInteraction'
import { ConnectInteraction } from './ConnectInteraction'

const COMPONENTS: Record<InteractionKind, (props: AnswerStageProps) => ReactElement> = {
  throw: ThrowInteraction,
  drag: DragInteraction,
  catch: CatchInteraction,
  swipe: SwipeInteraction,
  connect: ConnectInteraction,
}

export function AnswerStage({ kind, ...props }: AnswerStageProps & { kind: InteractionKind }) {
  const Interaction = COMPONENTS[kind]
  return <Interaction {...props} />
}
