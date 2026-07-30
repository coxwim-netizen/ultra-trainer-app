import { stateFor, type AnswerStageProps } from './types'

export function ThrowInteraction({ options, status, selectedId, onSubmit, renderOption, ariaLabel, groupLabel }: AnswerStageProps) {
  const disabled = status !== 'idle'

  return (
    <div className="stack" style={{ alignItems: 'center' }}>
      <p className="interaction-caption">🎯 Gooi een sterretje naar het juiste antwoord!</p>
      <div className="options-grid" role="group" aria-label={groupLabel}>
        {options.map((option) => {
          const state = stateFor(option, selectedId, status)
          return (
            <button
              key={option.id}
              type="button"
              className="option-card option-card--cone"
              data-state={state}
              disabled={disabled}
              aria-label={ariaLabel(option)}
              onClick={() => onSubmit(option.id)}
            >
              <span className="throw-star" aria-hidden="true">
                ⭐
              </span>
              {renderOption(option)}
            </button>
          )
        })}
      </div>
    </div>
  )
}
