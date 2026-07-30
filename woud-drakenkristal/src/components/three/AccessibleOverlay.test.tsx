import { render, screen, fireEvent } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { AccessibleOverlay } from './AccessibleOverlay'

describe('AccessibleOverlay', () => {
  it('exposes one labeled, activatable button per target without any 3D rendering involved', () => {
    const onActivate = vi.fn()
    render(
      <AccessibleOverlay
        groupLabel="Kies het juiste antwoord"
        targets={[
          { id: 'a', label: '4 kristallen', onActivate: () => onActivate('a') },
          { id: 'b', label: '5 kristallen', onActivate: () => onActivate('b') },
          { id: 'c', label: '6 kristallen', onActivate: () => onActivate('c'), disabled: true },
        ]}
      />,
    )

    expect(screen.getByRole('group', { name: 'Kies het juiste antwoord' })).toBeInTheDocument()

    const second = screen.getByRole('button', { name: '5 kristallen' })
    fireEvent.click(second)
    expect(onActivate).toHaveBeenCalledWith('b')

    expect(screen.getByRole('button', { name: '6 kristallen' })).toBeDisabled()
  })
})
