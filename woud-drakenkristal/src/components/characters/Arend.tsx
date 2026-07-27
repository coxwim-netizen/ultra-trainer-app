interface ArendProps {
  size?: number
  animate?: boolean
  className?: string
}

export function Arend({ size = 140, animate = true, className }: ArendProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 200 200"
      role="img"
      aria-label="Arend de wijze arend"
      className={[animate ? 'idle-float' : '', className].filter(Boolean).join(' ')}
    >
      <ellipse cx="100" cy="160" rx="55" ry="16" fill="rgba(0,0,0,0.08)" />
      {/* wings */}
      <path d="M50 105 Q0 90 10 45 Q50 60 68 100 Z" fill="#f5b942" className={animate ? 'idle-flap' : ''} />
      <path d="M150 105 Q200 90 190 45 Q150 60 132 100 Z" fill="#f5b942" className={animate ? 'idle-flap' : ''} />
      {/* body */}
      <ellipse cx="100" cy="125" rx="42" ry="48" fill="#e5e7eb" />
      <ellipse cx="100" cy="140" rx="26" ry="30" fill="#ffffff" />
      {/* head */}
      <circle cx="100" cy="62" r="38" fill="#c9902b" />
      {/* head crest */}
      <path d="M85 28 Q100 10 115 28 Q100 24 85 28 Z" fill="#f5b942" />
      {/* eyes */}
      <circle cx="88" cy="58" r="8" fill="#fff" />
      <circle cx="112" cy="58" r="8" fill="#fff" />
      <circle cx="88" cy="58" r="4" fill="#3a2f26" />
      <circle cx="112" cy="58" r="4" fill="#3a2f26" />
      {/* beak */}
      <path d="M92 75 Q100 95 108 75 Q100 82 92 75 Z" fill="#f5b942" />
      {/* legs */}
      <path d="M90 168 L88 180 M110 168 L112 180" stroke="#f5b942" strokeWidth="4" strokeLinecap="round" />
    </svg>
  )
}
