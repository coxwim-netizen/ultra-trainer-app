interface ProgressDotsProps {
  total: number
  currentIndex: number
}

export function ProgressDots({ total, currentIndex }: ProgressDotsProps) {
  return (
    <div className="progress-dots" role="status" aria-label={`Vraag ${currentIndex + 1} van ${total}`}>
      {Array.from({ length: total }).map((_, index) => (
        <span
          key={index}
          className="progress-dot"
          data-done={index < currentIndex}
          data-current={index === currentIndex}
        />
      ))}
    </div>
  )
}
