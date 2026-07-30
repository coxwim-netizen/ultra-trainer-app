import { useGame } from '../../state/GameContext'
import { getLocation } from '../../data/locations'
import type { LocationId } from '../../types'
import { Math3DExercise } from '../exercises3d/Math3DExercise'
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

  // Drakengrot (math) runs on the new 3D pipeline (see plan Stage 2). Reading
  // and letters stay on the 2D pipeline until Stage 4 ports them too.
  if (location.category === 'math') return <Math3DExercise onSessionFinished={onSessionFinished} />
  if (location.category === 'reading') return <ReadingExercise onSessionFinished={onSessionFinished} />
  return <LetterExercise onSessionFinished={onSessionFinished} />
}
