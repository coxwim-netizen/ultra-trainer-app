import { useGame } from '../../state/GameContext'
import { getLocation } from '../../data/locations'
import type { LocationId } from '../../types'
import { MathExercise } from '../exercises/MathExercise'
import { ReadingExercise } from '../exercises/ReadingExercise'
import { LetterExercise } from '../exercises/LetterExercise'

interface ExerciseScreenProps {
  locationId: LocationId
}

export function ExerciseScreen({ locationId }: ExerciseScreenProps) {
  const { completeLocation, goTo } = useGame()
  const location = getLocation(locationId)!

  const onSessionFinished = () => {
    completeLocation(locationId)
    goTo({ name: 'reward', location: locationId })
  }

  if (location.category === 'math') return <MathExercise onSessionFinished={onSessionFinished} />
  if (location.category === 'reading') return <ReadingExercise onSessionFinished={onSessionFinished} />
  return <LetterExercise onSessionFinished={onSessionFinished} />
}
