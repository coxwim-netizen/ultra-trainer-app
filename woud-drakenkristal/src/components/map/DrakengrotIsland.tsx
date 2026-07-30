interface IslandProps {
  size?: number
}

export function DrakengrotIsland({ size = 120 }: IslandProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 140 130" role="img" aria-label="Eiland met de Drakengrot">
      <defs>
        <radialGradient id="drakengrot-glow" cx="50%" cy="45%" r="55%">
          <stop offset="0%" stopColor="#ffd27a" />
          <stop offset="55%" stopColor="#ff8a3d" />
          <stop offset="100%" stopColor="#c1272d" />
        </radialGradient>
        <linearGradient id="drakengrot-rock" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#8a7062" />
          <stop offset="100%" stopColor="#5c4636" />
        </linearGradient>
      </defs>
      {/* island base */}
      <ellipse cx="70" cy="100" rx="62" ry="24" fill="#d9b56b" />
      <ellipse cx="70" cy="96" rx="56" ry="20" fill="#8fae55" opacity="0.5" />
      {/* rocky mound */}
      <path d="M28 92 Q40 30 70 24 Q100 30 112 92 Z" fill="url(#drakengrot-rock)" />
      <path d="M45 88 Q52 55 70 50 Q88 55 95 88 Z" fill="#6d5645" opacity="0.6" />
      {/* crater glow */}
      <ellipse cx="70" cy="54" rx="16" ry="12" fill="url(#drakengrot-glow)" className="idle-flicker" />
      {/* small side rocks */}
      <path d="M20 96 Q26 78 34 90 Q30 98 20 96 Z" fill="#7a6350" />
      <path d="M120 96 Q114 78 106 90 Q110 98 120 96 Z" fill="#7a6350" />
    </svg>
  )
}
