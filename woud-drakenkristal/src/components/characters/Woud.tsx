interface WoudProps {
  size?: number
  animate?: boolean
  className?: string
}

export function Woud({ size = 140, animate = true, className }: WoudProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 200 200"
      role="img"
      aria-label="Woud, de jonge held"
      className={[animate ? 'idle-float' : '', className].filter(Boolean).join(' ')}
    >
      <ellipse cx="100" cy="170" rx="48" ry="14" fill="rgba(0,0,0,0.08)" />
      {/* legs */}
      <rect x="82" y="128" width="15" height="36" rx="7" fill="#5c4f42" />
      <rect x="103" y="128" width="15" height="36" rx="7" fill="#5c4f42" />
      {/* tunic */}
      <path d="M65 80 Q100 65 135 80 L140 140 Q100 155 60 140 Z" fill="#16a34a" />
      <rect x="88" y="120" width="24" height="24" rx="6" fill="#f5b942" />
      {/* arms */}
      <circle cx="58" cy="100" r="13" fill="#f6c9a0" />
      <circle cx="142" cy="100" r="13" fill="#f6c9a0" />
      {/* head */}
      <circle cx="100" cy="55" r="36" fill="#f6c9a0" />
      {/* hair */}
      <path d="M64 50 Q60 15 100 20 Q140 15 136 50 Q120 30 100 32 Q80 30 64 50 Z" fill="#7a4a2b" />
      {/* eyes */}
      <circle cx="88" cy="58" r="5" fill="#3a2f26" />
      <circle cx="112" cy="58" r="5" fill="#3a2f26" />
      {/* smile */}
      <path d="M86 72 Q100 82 114 72" stroke="#3a2f26" strokeWidth="3" fill="none" strokeLinecap="round" />
      {/* headband */}
      <rect x="64" y="38" width="72" height="10" rx="5" fill="#e0393f" />
    </svg>
  )
}
