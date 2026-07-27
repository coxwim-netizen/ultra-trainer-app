import { useState } from 'react'
import { useGame } from '../../state/GameContext'
import type { CategoryStats, ExerciseCategory } from '../../types'

const CATEGORY_LABELS: Record<ExerciseCategory, string> = {
  math: 'Rekenen (Drakengrot)',
  reading: 'Lezen (Arendsberg)',
  letters: 'Letters en woorden (Ninjabos)',
}

function describeCategory(stats: CategoryStats): string {
  if (stats.attempts === 0) return 'Nog niet geoefend'
  if (stats.attempts >= 8) return 'Vaak geoefend'
  const ratio = stats.correctFirstTry / stats.attempts
  if (ratio >= 0.6) return 'Goed op weg'
  return 'Nog wat extra oefenen'
}

function formatDate(iso: string | null): string {
  if (!iso) return 'Nog geen sessie gespeeld'
  return new Date(iso).toLocaleDateString('nl-BE', { day: 'numeric', month: 'long', year: 'numeric' })
}

export function ParentArea() {
  const { progress, resetProgress, goTo } = useGame()
  const [confirmingReset, setConfirmingReset] = useState(false)

  const mostPractised = (Object.entries(progress.statsByCategory) as [ExerciseCategory, CategoryStats][]).reduce(
    (best, current) => (current[1].attempts > best[1].attempts ? current : best),
  )

  return (
    <div className="stack">
      <div className="row-between">
        <h2>Oudergebied</h2>
        <button type="button" className="btn btn-ghost" onClick={() => goTo({ name: 'start' })}>
          ← Terug
        </button>
      </div>

      <div className="card stack">
        <p>
          <strong>Oefeningen afgerond:</strong> {progress.exercisesCompleted}
        </p>
        <p>
          <strong>Juist bij eerste poging:</strong> {progress.correctFirstAttempts}
        </p>
        <p>
          <strong>Totaal aantal pogingen:</strong> {progress.totalAttempts}
        </p>
        <p>
          <strong>Meest geoefend:</strong>{' '}
          {mostPractised[1].attempts > 0 ? CATEGORY_LABELS[mostPractised[0]] : 'Nog geen oefeningen gedaan'}
        </p>
        <p>
          <strong>Laatste sessie:</strong> {formatDate(progress.lastSessionDate)}
        </p>
      </div>

      <div className="card stack">
        <h3>Overzicht per onderdeel</h3>
        {(Object.keys(CATEGORY_LABELS) as ExerciseCategory[]).map((category) => (
          <div key={category} className="row-between">
            <span>{CATEGORY_LABELS[category]}</span>
            <span className="badge-chip">{describeCategory(progress.statsByCategory[category])}</span>
          </div>
        ))}
      </div>

      {!confirmingReset ? (
        <button type="button" className="btn btn-secondary" onClick={() => setConfirmingReset(true)}>
          🗑️ Wis voortgang
        </button>
      ) : (
        <div className="card stack" style={{ background: 'rgba(224,57,63,0.08)' }}>
          <p>Weet je zeker dat je alle voortgang wilt wissen?</p>
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
    </div>
  )
}
