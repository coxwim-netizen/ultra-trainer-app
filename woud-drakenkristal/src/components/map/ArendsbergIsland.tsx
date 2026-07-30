interface IslandProps {
  size?: number
}

export function ArendsbergIsland({ size = 120 }: IslandProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 140 130" role="img" aria-label="Eiland met Arendsberg">
      <defs>
        <linearGradient id="arendsberg-rock" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#9fb3c8" />
          <stop offset="100%" stopColor="#5c7188" />
        </linearGradient>
      </defs>
      {/* island base */}
      <ellipse cx="70" cy="100" rx="62" ry="24" fill="#d9b56b" />
      <ellipse cx="70" cy="96" rx="56" ry="20" fill="#6fae6a" opacity="0.6" />
      {/* mountain */}
      <path d="M22 94 L70 26 L118 94 Z" fill="url(#arendsberg-rock)" />
      <path d="M45 94 L70 55 L95 94 Z" fill="#4c6178" opacity="0.5" />
      {/* snow cap */}
      <path d="M70 26 L86 50 L70 46 L54 50 Z" fill="#f5f9ff" />
      {/* nest */}
      <ellipse cx="94" cy="88" rx="10" ry="6" fill="#8a6a45" />
      <ellipse cx="94" cy="85" rx="4" ry="3" fill="#e6f0ff" />
      <ellipse cx="100" cy="86" rx="4" ry="3" fill="#e6f0ff" />
    </svg>
  )
}
