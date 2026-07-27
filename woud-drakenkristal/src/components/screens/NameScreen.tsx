import { useState } from 'react'
import { useGame } from '../../state/GameContext'
import { Woud } from '../characters/Woud'
import { AudioButton } from '../common/AudioButton'

export function NameScreen() {
  const { progress, setPlayerName, goTo } = useGame()
  const [name, setName] = useState(progress.playerName)

  const confirm = () => {
    setPlayerName(name)
    goTo({ name: 'map' })
  }

  return (
    <div className="center-col" style={{ paddingTop: 'clamp(12px, 6vh, 60px)' }}>
      <Woud size={140} />
      <div className="row" style={{ gap: 10 }}>
        <h2 style={{ fontSize: '1.6rem' }}>Hoe heet onze held?</h2>
        <AudioButton text="Hoe heet onze held?" />
      </div>
      <form
        className="stack"
        style={{ width: '100%', maxWidth: 360 }}
        onSubmit={(event) => {
          event.preventDefault()
          confirm()
        }}
      >
        <label htmlFor="hero-name" className="visually-hidden">
          Naam van de held
        </label>
        <input
          id="hero-name"
          type="text"
          value={name}
          maxLength={16}
          onChange={(event) => setName(event.target.value)}
          className="card"
          style={{
            fontSize: '1.5rem',
            textAlign: 'center',
            border: '3px solid var(--stone)',
            fontWeight: 700,
          }}
        />
        <button type="submit" className="btn btn-primary btn-large">
          Verder ➜
        </button>
      </form>
    </div>
  )
}
