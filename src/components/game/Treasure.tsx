import React from 'react'
import type { TreasureDefinition } from './EnvironmentManager'

interface TreasureProps {
  type?: TreasureDefinition['type']
  size?: number
  isCollected?: boolean
  className?: string
}

export const Treasure: React.FC<TreasureProps> = React.memo(({
  type = 'gold_chest',
  size = 62,
  isCollected = false,
  className = '',
}) => {
  return (
    <div
      className={`relative inline-block select-none pointer-events-none transition-all duration-300 ${
        isCollected ? 'scale-150 opacity-0' : 'opacity-100'
      } ${className}`}
      style={{ width: `${size}px`, height: `${size}px` }}
    >
      {/* 1. GOLD CHEST - 3D GLOWING CHEST FROM FIGMA WITH SUNBURST HALO */}
      {type === 'gold_chest' && (
        <div className="relative w-full h-full flex items-center justify-center animate-bob">
          {/* Radiant Sunburst Glow */}
          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-amber-400/40 via-yellow-300/60 to-amber-400/40 blur-md animate-pulse scale-125" />
          <img
            src="/game-assets/treasure-chest-3d.png"
            alt="Treasure Chest"
            className="w-full h-full object-contain filter drop-shadow-[0_0_24px_rgba(253,224,71,1)]"
            onError={(e) => {
              ;(e.currentTarget as HTMLImageElement).src = '/game-assets/treasure.svg'
            }}
          />
        </div>
      )}

      {/* 2. PEARL OYSTER SHELL */}
      {type === 'pearl_shell' && (
        <div className="relative w-full h-full animate-bob">
          <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-xl" fill="none">
            <defs>
              <linearGradient id="shellPink" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#fdf2f8" />
                <stop offset="50%" stopColor="#fbcfe8" />
                <stop offset="100%" stopColor="#f472b6" />
              </linearGradient>
            </defs>
            <path d="M15 65 C15 88 85 88 85 65 L80 60 C80 82 20 82 20 60 Z" fill="url(#shellPink)" stroke="#be185d" strokeWidth="2" />
            <path d="M20 58 C15 25 85 25 80 58 Z" fill="url(#shellPink)" stroke="#be185d" strokeWidth="2.5" />
            <path d="M50 26 L50 58" stroke="#ffffff" strokeWidth="2" />
            <path d="M35 32 L40 58" stroke="#ffffff" strokeWidth="1.5" />
            <path d="M65 32 L60 58" stroke="#ffffff" strokeWidth="1.5" />
            <circle cx="50" cy="58" r="14" fill="#ffffff" stroke="#fbcfe8" strokeWidth="2" className="drop-shadow-[0_0_12px_rgba(255,255,255,1)]" />
            <circle cx="46" cy="54" r="4" fill="#ffffff" />
            <polygon points="50,40 52,44 56,45 52,46 50,50 48,46 44,45 48,44" fill="#fef08a" />
          </svg>
        </div>
      )}

      {/* 3. GLOWING ABYSSAL PEARL / ARTIFACT */}
      {type === 'glowing_pearl' && (
        <div className="relative w-full h-full flex items-center justify-center animate-bob">
          <div className="absolute inset-2 rounded-full bg-cyan-400/30 blur-md animate-ping" />
          <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-[0_0_20px_rgba(56,189,248,1)]" fill="none">
            <radialGradient id="pearlGlow" cx="40%" cy="40%" r="60%">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="40%" stopColor="#a5f3fc" />
              <stop offset="80%" stopColor="#0891b2" />
              <stop offset="100%" stopColor="#0e7490" />
            </radialGradient>
            <circle cx="50" cy="50" r="32" fill="url(#pearlGlow)" stroke="#ffffff" strokeWidth="3" />
            <ellipse cx="40" cy="40" rx="10" ry="6" transform="rotate(-30 40 40)" fill="#ffffff" opacity="0.8" />
          </svg>
        </div>
      )}

      {/* 4. GHOST MAGIC POTION - 3D ELIXIR FROM FIGMA */}
      {type === 'magic_potion' && (
        <div className="relative w-full h-full flex items-center justify-center animate-bob">
          <div className="absolute inset-1 rounded-full bg-purple-500/35 blur-md animate-pulse" />
          <img
            src="/game-assets/potion-ghost-3d.png"
            alt="Ghost Potion"
            className="w-full h-full object-contain filter drop-shadow-[0_0_22px_rgba(192,132,252,1)]"
            onError={(e) => {
              ;(e.currentTarget as HTMLImageElement).src = '/game-assets/potion.svg'
            }}
          />
        </div>
      )}

      {/* 5. SPANISH GOLD COINS SACK - 3D RADIANT GOLDEN MONEY BAG */}
      {type === 'coin_sack' && (
        <div className="relative w-full h-full flex items-center justify-center animate-bob">
          {/* Golden Coin Shimmer Glow */}
          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-amber-400/35 via-yellow-300/50 to-amber-400/35 blur-md animate-pulse scale-110" />
          <img
            src="/game-assets/coin-sack-3d.png"
            alt="Gold Coin Sack"
            className="w-full h-full object-contain filter drop-shadow-[0_4px_16px_rgba(234,179,8,0.85)]"
          />
        </div>
      )}

      {/* 6. STARFISH GEM */}
      {type === 'starfish_gem' && (
        <div className="relative w-full h-full animate-bob">
          <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-xl" fill="none">
            <linearGradient id="starGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#fb7185" />
              <stop offset="50%" stopColor="#f43f5e" />
              <stop offset="100%" stopColor="#be123c" />
            </linearGradient>
            <polygon points="50,10 62,38 92,38 68,56 78,85 50,68 22,85 32,56 8,38 38,38" fill="url(#starGrad)" stroke="#881337" strokeWidth="2.5" />
            <circle cx="50" cy="48" r="9" fill="#fef08a" stroke="#ca8a04" strokeWidth="2" className="animate-pulse" />
          </svg>
        </div>
      )}
    </div>
  )
})

export default Treasure
