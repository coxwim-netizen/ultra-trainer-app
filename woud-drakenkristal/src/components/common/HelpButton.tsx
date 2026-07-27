interface HelpButtonProps {
  onHelp: () => void
}

export function HelpButton({ onHelp }: HelpButtonProps) {
  return (
    <button type="button" className="btn btn-ghost" onClick={onHelp}>
      <span aria-hidden="true">💡</span> Help mij
    </button>
  )
}
