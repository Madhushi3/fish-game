import React from 'react'

interface SharkProps {
  className?: string
  width?: number
  height?: number
  flip?: boolean
}

export const Shark: React.FC<SharkProps> = ({
  className = '',
  width = 160,
  height = 90,
  flip = false,
}) => {
  return (
    <div
      className={`relative inline-block select-none pointer-events-none ${
        flip ? '-scale-x-100' : ''
      } ${className}`}
      style={{ width: `${width}px`, height: `${height}px` }}
    >
      <svg viewBox="0 0 240 130" className="w-full h-full drop-shadow-2xl" fill="none">
        <defs>
          <linearGradient id="sharkBodyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#38bdf8" />
            <stop offset="40%" stopColor="#0284c7" />
            <stop offset="100%" stopColor="#0c4a6e" />
          </linearGradient>
          <linearGradient id="sharkBellyGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="100%" stopColor="#e0f2fe" />
          </linearGradient>
        </defs>

        {/* Animated Tail Fin */}
        <g className="animate-tail-wag">
          <path
            d="M32 65 C12 30 2 12 6 8 C12 4 28 28 46 52 C32 82 14 118 6 118 C0 118 10 92 32 65 Z"
            fill="url(#sharkBodyGrad)"
            stroke="#082f49"
            strokeWidth="2"
          />
        </g>

        {/* Dorsal Fin */}
        <path
          d="M120 34 C136 8 152 4 156 6 C160 10 152 22 146 38 Z"
          fill="url(#sharkBodyGrad)"
          stroke="#082f49"
          strokeWidth="2"
        />

        {/* Main Torso */}
        <path
          d="M30 65 C40 38 78 28 145 32 C195 36 230 55 230 68 C230 84 175 100 115 100 C68 100 35 84 30 65 Z"
          fill="url(#sharkBodyGrad)"
          stroke="#082f49"
          strokeWidth="2.5"
        />

        {/* White Underbelly */}
        <path
          d="M68 76 C105 76 155 72 210 68 C215 76 185 96 130 98 C88 99 68 88 68 76 Z"
          fill="url(#sharkBellyGrad)"
        />

        {/* Pectoral Fin with flutter */}
        <g className="animate-fin-flutter">
          <path
            d="M120 72 C140 92 155 112 145 116 C136 118 126 104 112 80 Z"
            fill="#0369a1"
            stroke="#082f49"
            strokeWidth="1.5"
          />
        </g>

        {/* Gills */}
        <path d="M144 54 Q140 60 144 66" stroke="#082f49" strokeWidth="2" strokeLinecap="round" />
        <path d="M150 55 Q146 61 150 67" stroke="#082f49" strokeWidth="2" strokeLinecap="round" />
        <path d="M156 56 Q152 62 156 68" stroke="#082f49" strokeWidth="2" strokeLinecap="round" />

        {/* Eye */}
        <circle cx="192" cy="52" r="8" fill="#ffffff" stroke="#082f49" strokeWidth="1.5" />
        <circle cx="194" cy="52" r="4.5" fill="#0f172a" />
        <circle cx="196" cy="50" r="1.5" fill="#ffffff" />

        {/* Menacing Grin with Cartoon Teeth */}
        <path d="M165 74 Q190 86 215 70" stroke="#082f49" strokeWidth="2.5" strokeLinecap="round" fill="none" />
        <polygon points="175,75 178,80 181,76" fill="#ffffff" stroke="#082f49" strokeWidth="0.8" />
        <polygon points="184,77 187,83 190,78" fill="#ffffff" stroke="#082f49" strokeWidth="0.8" />
        <polygon points="193,78 196,82 199,76" fill="#ffffff" stroke="#082f49" strokeWidth="0.8" />
      </svg>
    </div>
  )
}

export default Shark

