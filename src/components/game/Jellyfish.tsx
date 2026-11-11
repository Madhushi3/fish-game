import React from 'react'

interface JellyfishProps {
  size?: number
  color?: string
  className?: string
}

export const Jellyfish: React.FC<JellyfishProps> = ({
  size = 56,
  color = '#c084fc',
  className = '',
}) => {
  return (
    <div
      className={`relative inline-block select-none pointer-events-none animate-jellyfish ${className}`}
      style={{ width: `${size}px`, height: `${(size * 1.3).toFixed(0)}px` }}
    >
      <svg viewBox="0 0 100 130" className="w-full h-full drop-shadow-[0_0_15px_rgba(192,132,252,0.8)]" fill="none">
        <defs>
          <radialGradient id="jfBell" cx="50%" cy="40%" r="50%">
            <stop offset="0%" stopColor="#f5d0fe" stopOpacity="0.9" />
            <stop offset="60%" stopColor={color} stopOpacity="0.7" />
            <stop offset="100%" stopColor="#7e22ce" stopOpacity="0.5" />
          </radialGradient>
        </defs>

        {/* Jellyfish Bell Umbrella */}
        <path
          d="M15 50 C15 15 85 15 85 50 C85 60 75 62 65 58 C55 54 45 54 35 58 C25 62 15 60 15 50 Z"
          fill="url(#jfBell)"
          stroke="#e879f9"
          strokeWidth="2"
        />

        {/* Glowing Rim Beads */}
        {Array.from({ length: 7 }).map((_, i) => (
          <circle
            key={i}
            cx={22 + i * 9.5}
            cy="54"
            r="2"
            fill="#ffffff"
            className="animate-pulse"
          />
        ))}

        {/* Inner Luminous Organs */}
        <ellipse cx="50" cy="38" rx="16" ry="12" fill="#ffffff" opacity="0.4" />
        <ellipse cx="50" cy="38" rx="8" ry="6" fill="#fef08a" opacity="0.7" />

        {/* Waving Tentacles */}
        <g className="animate-fin-flutter">
          {/* Outer Left Tentacle */}
          <path d="M25 58 Q18 80 26 100 Q34 118 24 128" stroke="#e879f9" strokeWidth="2" strokeLinecap="round" fill="none" opacity="0.8" />
          {/* Inner Left Tentacle */}
          <path d="M38 56 Q30 78 40 98 Q48 116 38 126" stroke="#c084fc" strokeWidth="2.5" strokeLinecap="round" fill="none" opacity="0.85" />
          {/* Center Oral Arm (Frilly) */}
          <path d="M50 55 Q56 75 46 95 Q54 115 50 125" stroke="#f0abfc" strokeWidth="3" strokeLinecap="round" fill="none" />
          {/* Inner Right Tentacle */}
          <path d="M62 56 Q70 78 60 98 Q52 116 62 126" stroke="#c084fc" strokeWidth="2.5" strokeLinecap="round" fill="none" opacity="0.85" />
          {/* Outer Right Tentacle */}
          <path d="M75 58 Q82 80 74 100 Q66 118 76 128" stroke="#e879f9" strokeWidth="2" strokeLinecap="round" fill="none" opacity="0.8" />
        </g>
      </svg>
    </div>
  )
}

export default Jellyfish

