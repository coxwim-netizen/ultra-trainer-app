import { useGame } from '../../state/GameContext'
import { Vonk } from '../characters/Vonk'

export function StartScreen() {
  const { goTo } = useGame()

  return (
    <div className="center-col" style={{ paddingTop: 'clamp(12px, 6vh, 60px)' }}>
      <Vonk size={160} />
      <div>
        <h1 style={{ fontSize: 'clamp(1.8rem, 6vw, 3rem)', color: 'var(--crystal)' }}>
          Woud en het Drakenkristal
        </h1>
        <p style={{ fontSize: '1.2rem', marginTop: 8 }}>Een magisch avontuur vol draken, arenden en ninja's!</p>
      </div>
      <button type="button" className="btn btn-primary btn-large" onClick={() => goTo({ name: 'name' })}>
        🚀 Start avontuur
      </button>
    </div>
  )
}
