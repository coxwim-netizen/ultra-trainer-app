import { render } from '@testing-library/react'
import type { ReactElement } from 'react'
import { GameProvider } from '../state/GameContext'

export function renderWithGame(ui: ReactElement) {
  return render(<GameProvider>{ui}</GameProvider>)
}
