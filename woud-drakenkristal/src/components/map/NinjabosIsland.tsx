interface IslandProps {
  size?: number
}

export function NinjabosIsland({ size = 120 }: IslandProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 140 130" role="img" aria-label="Eiland met het Ninjabos">
      <defs>
        <linearGradient id="ninjabos-tree" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#2fae7a" />
          <stop offset="100%" stopColor="#1e3a5f" />
        </linearGradient>
      </defs>
      {/* island base */}
      <ellipse cx="70" cy="100" rx="62" ry="24" fill="#d9b56b" />
      <ellipse cx="70" cy="96" rx="56" ry="20" fill="#3c8f5e" opacity="0.6" />
      {/* trees */}
      <path d="M32 92 L48 50 L64 92 Z" fill="url(#ninjabos-tree)" />
      <path d="M60 96 L82 40 L104 96 Z" fill="url(#ninjabos-tree)" />
      <path d="M92 92 L106 58 L120 92 Z" fill="url(#ninjabos-tree)" />
      {/* secret gate */}
      <rect x="66" y="78" width="6" height="20" fill="#22303f" />
      <rect x="90" y="78" width="6" height="20" fill="#22303f" />
      <rect x="62" y="74" width="38" height="6" rx="2" fill="#22d3ee" />
    </svg>
  )
}
