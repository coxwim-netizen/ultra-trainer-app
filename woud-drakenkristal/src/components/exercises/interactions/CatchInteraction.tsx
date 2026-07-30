import { stateFor, type AnswerStageProps } from './types'

export function CatchInteraction({ options, status, selectedId, onSubmit, renderOption, ariaLabel, groupLabel }: AnswerStageProps) {
  const disabled = status !== 'idle'

  return (
    <div className="stack" style={{ alignItems: 'center' }}>
      <p className="interaction-caption">🖐️ Vang het juiste antwoord terwijl het zwiert!</p>
      <div className="options-grid" role="group" aria-label={groupLabel}>
        {options.map((option, index) => {
          const state = stateFor(option, selectedId, status)
          return (
            <button
              key={option.id}
              type="button"
              className={`option-card option-card--catch option-card--catch-${index % 3}`}
              data-state={state}
              disabled={disabled}
              aria-label={ariaLabel(option)}
              onClick={() => onSubmit(option.id)}
            >
              {renderOption(option)}
            </button>
          )
        })}
      </div>
    </div>
  )
}
