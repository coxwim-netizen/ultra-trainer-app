interface CrystalGroupProps {
  count: number
  size?: number
  highlightIndex?: number
}

export function CrystalGroup({ count, size = 28, highlightIndex }: CrystalGroupProps) {
  return (
    <div className="row" style={{ flexWrap: 'wrap', justifyContent: 'center', gap: 6 }} aria-hidden="true">
      {Array.from({ length: count }).map((_, index) => (
        <span
          key={index}
          style={{
            fontSize: size,
            filter:
              highlightIndex !== undefined && index === highlightIndex
                ? 'drop-shadow(0 0 8px #f5b942)'
                : 'drop-shadow(0 0 3px #c4b5fd)',
            transform: highlightIndex !== undefined && index === highlightIndex ? 'scale(1.3)' : undefined,
            transition: 'transform 0.2s ease',
          }}
        >
          💎
        </span>
      ))}
    </div>
  )
}
