import { useState } from 'react'
import { useGame } from '../../state/GameContext'
import { Modal } from '../common/Modal'
import { HoldToConfirmButton } from '../common/HoldToConfirmButton'

interface SettingsMenuProps {
  onClose: () => void
}

export function SettingsMenu({ onClose }: SettingsMenuProps) {
  const { progress, toggleSound, resetProgress, goTo } = useGame()
  const [confirmingReset, setConfirmingReset] = useState(false)

  return (
    <Modal title="Instellingen" onClose={onClose}>
      <div className="stack">
        <button type="button" className="btn btn-secondary" onClick={toggleSound}>
          <span aria-hidden="true">{progress.soundOn ? '🔊' : '🔇'}</span>
          {progress.soundOn ? 'Geluid: aan' : 'Geluid: uit'}
        </button>

        {!confirmingReset ? (
          <button type="button" className="btn btn-ghost" onClick={() => setConfirmingReset(true)}>
            🗑️ Wis voortgang
          </button>
        ) : (
          <div className="card stack" style={{ background: 'rgba(224,57,63,0.08)' }}>
            <p>Weet je zeker dat je alle sterren en kristallen wilt wissen?</p>
            <div className="row">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => {
                  resetProgress()
                  setConfirmingReset(false)
                }}
              >
                Ja, wis alles
              </button>
              <button type="button" className="btn btn-ghost" onClick={() => setConfirmingReset(false)}>
                Annuleren
              </button>
            </div>
          </div>
        )}

        <div className="card stack" style={{ background: 'rgba(0,0,0,0.03)' }}>
          <p>Voor ouders: hou de knop 3 seconden ingedrukt.</p>
          <HoldToConfirmButton
            label="👪 Oudergebied"
            onConfirm={() => {
              onClose()
              goTo({ name: 'parent' })
            }}
          />
        </div>
      </div>
    </Modal>
  )
}
