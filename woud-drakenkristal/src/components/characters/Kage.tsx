interface KageProps {
  size?: number
  animate?: boolean
  className?: string
  jump?: boolean
}

export function Kage({ size = 140, animate = true, className, jump = false }: KageProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 200 200"
      role="img"
      aria-label="Kage de vriendelijke ninja"
      className={[animate ? 'idle-float' : '', jump ? 'idle-flap' : '', className].filter(Boolean).join(' ')}
    >
      <ellipse cx="100" cy="170" rx="50" ry="14" fill="rgba(0,0,0,0.08)" />
      {/* legs */}
      <rect x="80" y="130" width="16" height="38" rx="8" fill="#1e3a5f" />
      <rect x="104" y="130" width="16" height="38" rx="8" fill="#1e3a5f" />
      {/* body */}
      <rect x="68" y="80" width="64" height="60" rx="24" fill="#22d3ee" />
      <rect x="80" y="80" width="40" height="60" rx="18" fill="#1e3a5f" />
      {/* arms */}
      <circle cx="60" cy="105" r="14" fill="#22d3ee" />
      <circle cx="140" cy="105" r="14" fill="#22d3ee" />
      {/* head */}
      <circle cx="100" cy="55" r="34" fill="#f6c9a0" />
      {/* mask */}
      <path d="M66 55 Q100 25 134 55 Q134 40 100 32 Q66 40 66 55 Z" fill="#1e3a5f" />
      <rect x="66" y="55" width="68" height="14" fill="#1e3a5f" />
      {/* eyes */}
      <circle cx="88" cy="58" r="5" fill="#0f172a" />
      <circle cx="112" cy="58" r="5" fill="#0f172a" />
      {/* headband tails */}
      <path d="M132 50 Q150 55 145 75" stroke="#16a34a" strokeWidth="6" fill="none" strokeLinecap="round" />
      {/* glowing star */}
      <g transform="translate(150 120)">
        <path
          d="M0 -10 L3 -3 L10 -3 L4 2 L6 9 L0 4 L-6 9 L-4 2 L-10 -3 L-3 -3 Z"
          fill="#22d3ee"
          opacity="0.9"
        />
      </g>
    </svg>
  )
}
