interface VonkProps {
  size?: number
  animate?: boolean
  className?: string
  breatheFire?: boolean
}

export function Vonk({ size = 140, animate = true, className, breatheFire = false }: VonkProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 200 200"
      role="img"
      aria-label="Vonk de vriendelijke draak"
      className={[animate ? 'idle-float' : '', className].filter(Boolean).join(' ')}
    >
      <ellipse cx="100" cy="150" rx="55" ry="18" fill="rgba(0,0,0,0.1)" />
      {/* tail */}
      <path d="M60 140 Q20 150 30 110 Q45 125 60 130 Z" fill="#e0393f" />
      {/* wings */}
      <path d="M55 90 Q10 70 25 40 Q55 55 65 85 Z" fill="#f2a65a" className={animate ? 'idle-flap' : ''} />
      <path d="M145 90 Q190 70 175 40 Q145 55 135 85 Z" fill="#f2a65a" className={animate ? 'idle-flap' : ''} />
      {/* body */}
      <ellipse cx="100" cy="120" rx="55" ry="50" fill="#ff8a3d" />
      {/* belly */}
      <ellipse cx="100" cy="130" rx="30" ry="28" fill="#ffd39b" />
      {/* head */}
      <circle cx="100" cy="65" r="42" fill="#ff8a3d" />
      {/* horns */}
      <path d="M75 35 Q70 15 82 20 Q80 32 78 40 Z" fill="#6d28d9" />
      <path d="M125 35 Q130 15 118 20 Q120 32 122 40 Z" fill="#6d28d9" />
      {/* snout */}
      <ellipse cx="100" cy="78" rx="22" ry="16" fill="#ffd39b" />
      {/* eyes */}
      <circle cx="87" cy="60" r="7" fill="#3a2f26" />
      <circle cx="113" cy="60" r="7" fill="#3a2f26" />
      <circle cx="89" cy="57" r="2" fill="#fff" />
      <circle cx="115" cy="57" r="2" fill="#fff" />
      {/* smile */}
      <path d="M85 82 Q100 92 115 82" stroke="#3a2f26" strokeWidth="3" fill="none" strokeLinecap="round" />
      {/* cheeks */}
      <circle cx="72" cy="72" r="7" fill="#ff6b6b" opacity="0.5" />
      <circle cx="128" cy="72" r="7" fill="#ff6b6b" opacity="0.5" />
      {breatheFire && (
        <g className="idle-flicker">
          <path d="M100 92 Q90 110 100 128 Q110 110 100 92 Z" fill="#f5b942" />
          <path d="M100 98 Q94 112 100 122 Q106 112 100 98 Z" fill="#ff8a3d" />
        </g>
      )}
    </svg>
  )
}
