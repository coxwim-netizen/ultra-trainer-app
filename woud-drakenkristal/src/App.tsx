import { useState } from 'react'
import { GameProvider, useGame } from './state/GameContext'
import { StartScreen } from './components/screens/StartScreen'
import { NameScreen } from './components/screens/NameScreen'
import { AdventureMap } from './components/screens/AdventureMap'
import { ExerciseScreen } from './components/screens/ExerciseScreen'
import { RewardScreen } from './components/screens/RewardScreen'
import { VictoryScreen } from './components/screens/VictoryScreen'
import { ParentArea } from './components/screens/ParentArea'
import { SettingsMenu } from './components/screens/SettingsMenu'

function TopBar() {
  const { progress, toggleSound } = useGame()
  const [settingsOpen, setSettingsOpen] = useState(false)

  return (
    <>
      <div className="row-between" style={{ marginBottom: 12 }}>
        <button
          type="button"
          className="btn btn-round btn-ghost"
          onClick={toggleSound}
          aria-label={progress.soundOn ? 'Geluid uitzetten' : 'Geluid aanzetten'}
        >
          <span aria-hidden="true">{progress.soundOn ? '🔊' : '🔇'}</span>
        </button>
        <button
          type="button"
          className="btn btn-round btn-ghost"
          onClick={() => setSettingsOpen(true)}
          aria-label="Instellingen"
        >
          <span aria-hidden="true">⚙️</span>
        </button>
      </div>
      {settingsOpen && <SettingsMenu onClose={() => setSettingsOpen(false)} />}
    </>
  )
}

function GameRouter() {
  const { screen } = useGame()

  const showTopBar = screen.name !== 'exercise'

  return (
    <div className="app-shell">
      {showTopBar && <TopBar />}
      {screen.name === 'start' && <StartScreen />}
      {screen.name === 'name' && <NameScreen />}
      {screen.name === 'map' && <AdventureMap />}
      {screen.name === 'exercise' && <ExerciseScreen locationId={screen.location} />}
      {screen.name === 'reward' && <RewardScreen locationId={screen.location} />}
      {screen.name === 'victory' && <VictoryScreen />}
      {screen.name === 'parent' && <ParentArea />}
    </div>
  )
}

function App() {
  return (
    <GameProvider>
      <GameRouter />
    </GameProvider>
  )
}

export default App
