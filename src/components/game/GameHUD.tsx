import React, { useState, useEffect, useRef } from 'react'
import { Pause, Ghost, Clock } from 'lucide-react'
import soundService from '../../services/soundService'

interface GameHUDProps {
  fishesCollected: number
  targetFish: number
  treasuresCollected: number
  targetTreasures: number
  gameTime: number
  roundTimeRemaining?: number
  lives?: number
  ghostModeSeconds: number
  onPause: () => void
}

export const GameHUD: React.FC<GameHUDProps> = React.memo(({
  fishesCollected,
  targetFish,
  treasuresCollected,
  targetTreasures,
  gameTime: _gameTime,
  roundTimeRemaining = 45,
  lives = 3,
  ghostModeSeconds,
  onPause,
}) => {
  const [shatteringHeart, setShatteringHeart] = useState<{ id: number; heartIndex: number } | null>(null)
  const [isDamaged, setIsDamaged] = useState<boolean>(false)
  const prevLivesRef = useRef<number>(lives)

  useEffect(() => {
    if (lives < prevLivesRef.current) {
      const lostIndex = prevLivesRef.current
      setShatteringHeart({ id: Date.now(), heartIndex: lostIndex })
      setIsDamaged(true)

      const timer1 = setTimeout(() => setIsDamaged(false), 550)
      const timer2 = setTimeout(() => setShatteringHeart(null), 1000)

      return () => {
        clearTimeout(timer1)
        clearTimeout(timer2)
      }
    }
    prevLivesRef.current = lives
  }, [lives])

  const formatTime = (s: number) =>
    `${Math.floor(s / 60).toString().padStart(2, '0')}:${(s % 60).toString().padStart(2, '0')}`

  return (
    /*
      2x2 Compact HUD Card Box with Heart Break Damage Shake on Left Card
    */
    <div
      className={`relative flex flex-col gap-2.5 p-3 select-none transition-all duration-300 ${
        isDamaged ? 'animate-damage-shake' : ''
      }`}
      style={{
        width: '210px',
        borderRadius: '24px',
        background: isDamaged
          ? 'linear-gradient(160deg, rgba(69, 10, 10, 0.95) 0%, rgba(3, 28, 56, 0.98) 100%)'
          : 'linear-gradient(160deg, rgba(3, 41, 80, 0.95) 0%, rgba(2, 28, 56, 0.98) 100%)',
        border: isDamaged
          ? '2.5px solid rgba(239, 68, 68, 0.85)'
          : '2.5px solid rgba(34, 211, 238, 0.6)',
        boxShadow: isDamaged
          ? '0 12px 35px rgba(239, 68, 68, 0.4), 0 0 28px rgba(239, 68, 68, 0.45), inset 0 1px 0 rgba(255, 255, 255, 0.2)'
          : '0 12px 35px rgba(0, 0, 0, 0.6), 0 0 24px rgba(34, 211, 238, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(12px)',
      }}
    >
      {/* ━━ LIVES ROW (3 Hearts with Heart Break Shatter Animation) ━━ */}
      <div
        className={`relative flex items-center justify-between px-2.5 py-1.5 rounded-xl bg-slate-900/70 border transition-all duration-300 shadow-inner overflow-visible ${
          isDamaged
            ? 'border-red-500/80 shadow-[0_0_18px_rgba(239,68,68,0.5)]'
            : 'border-cyan-500/30'
        }`}
      >
        <span
          className={`text-[10px] font-black uppercase tracking-wider transition-colors ${
            isDamaged ? 'text-red-400' : 'text-cyan-300'
          }`}
        >
          LIVES
        </span>

        {/* Floating "-1" Damage Badge on Left HUD */}
        {isDamaged && (
          <div className="absolute -top-2.5 right-1 z-30 flex items-center gap-0.5 px-1.5 py-0.5 rounded-full bg-red-950/90 border border-red-500 shadow-lg text-[9px] font-black text-red-200 animate-bounce">
            <span>💔</span>
            <span>-1</span>
          </div>
        )}

        <div className="relative flex items-center gap-1.5">
          {[1, 2, 3].map((heartIndex) => {
            const isAlive = heartIndex <= lives
            const isShattering = shatteringHeart?.heartIndex === heartIndex

            return (
              <div key={heartIndex} className="relative flex items-center justify-center">
                {/* Regular Heart (or empty gray) */}
                <span
                  className={`text-sm transition-all duration-300 ${
                    isAlive
                      ? 'scale-100 opacity-100 drop-shadow-[0_0_8px_rgba(239,68,68,0.8)]'
                      : 'scale-75 opacity-25 grayscale'
                  }`}
                >
                  ❤️
                </span>

                {/* Dramatic 3D Broken Heart Fracture Overlay on Lost Heart */}
                {isShattering && (
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-30">
                    {/* Expanding Red Shockwave Ring */}
                    <div className="absolute w-8 h-8 rounded-full border-2 border-red-500 animate-shockwave" />

                    {/* Left Breaking Half 💔 */}
                    <span className="absolute text-base animate-heart-left select-none drop-shadow-[0_0_8px_rgba(239,68,68,1)]">
                      💔
                    </span>

                    {/* Right Splinter Shard */}
                    <span className="absolute text-base animate-heart-right select-none drop-shadow-[0_0_8px_rgba(239,68,68,1)]">
                      💔
                    </span>

                    {/* Center Shatter Flash */}
                    <span className="absolute text-xs animate-ping font-bold select-none">
                      💥
                    </span>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* ━━ PAUSE BUTTON ━━ */}
      <button
        onClick={() => {
          soundService.playClick()
          onPause()
        }}
        className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl cursor-pointer active:scale-95 transition-all shadow-md group"
        style={{
          background: 'linear-gradient(135deg, #38bdf8 0%, #0284c7 100%)',
          border: '1.5px solid rgba(255, 255, 255, 0.7)',
          boxShadow: '0 4px 12px rgba(14, 165, 233, 0.35)',
        }}
        title="Pause (Space)"
      >
        <Pause size={16} className="fill-white text-white transition-transform group-hover:scale-110" />
        <span className="text-xs font-black text-white tracking-wider uppercase">PAUSE</span>
      </button>

      {/* ━━ 2x2 GRID OF STAT CARDS ━━ */}
      <div className="grid grid-cols-2 gap-2">
        {/* 1. FISH CARD */}
        <div
          className="flex flex-col items-center justify-center gap-1 py-2.5 px-2 rounded-2xl transition-transform hover:scale-102"
          style={{
            background:
              fishesCollected >= targetFish
                ? 'linear-gradient(135deg, rgba(16, 185, 129, 0.25) 0%, rgba(5, 150, 105, 0.15) 100%)'
                : 'linear-gradient(135deg, rgba(249, 115, 22, 0.2) 0%, rgba(194, 65, 12, 0.1) 100%)',
            border:
              fishesCollected >= targetFish
                ? '1.5px solid rgba(52, 211, 153, 0.8)'
                : '1.5px solid rgba(249, 115, 22, 0.5)',
            boxShadow: '0 4px 10px rgba(0,0,0,0.2)',
          }}
        >
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center ${
              fishesCollected >= targetFish ? 'bg-emerald-500/25 ring-1 ring-emerald-400' : 'bg-orange-500/20'
            }`}
          >
            <img
              src="/game-assets/fish-clownfish.png"
              alt="Fish"
              className="w-7 h-6 object-contain drop-shadow"
              onError={(e) => {
                ;(e.currentTarget as HTMLImageElement).src = '/game-assets/fish.svg'
              }}
            />
          </div>
          <span
            className={`font-mono font-black text-sm leading-none ${
              fishesCollected >= targetFish ? 'text-emerald-300' : 'text-orange-200'
            }`}
          >
            {fishesCollected}/{targetFish}
            {fishesCollected >= targetFish && ' ✓'}
          </span>
          <span
            className={`text-[9px] font-bold uppercase tracking-wider ${
              fishesCollected >= targetFish ? 'text-emerald-400' : 'text-orange-400/80'
            }`}
          >
            FISH
          </span>
        </div>

        {/* 2. TREASURE / GEMS CARD */}
        <div
          className="flex flex-col items-center justify-center gap-1 py-2.5 px-2 rounded-2xl transition-transform hover:scale-102"
          style={{
            background:
              treasuresCollected >= targetTreasures
                ? 'linear-gradient(135deg, rgba(16, 185, 129, 0.25) 0%, rgba(5, 150, 105, 0.15) 100%)'
                : 'linear-gradient(135deg, rgba(234, 179, 8, 0.2) 0%, rgba(161, 98, 7, 0.1) 100%)',
            border:
              treasuresCollected >= targetTreasures
                ? '1.5px solid rgba(52, 211, 153, 0.8)'
                : '1.5px solid rgba(234, 179, 8, 0.5)',
            boxShadow: '0 4px 10px rgba(0,0,0,0.2)',
          }}
        >
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center ${
              treasuresCollected >= targetTreasures ? 'bg-emerald-500/25 ring-1 ring-emerald-400' : 'bg-yellow-500/20'
            }`}
          >
            <img
              src="/game-assets/treasure-chest-3d.png"
              alt="Treasure"
              className="w-7 h-6 object-contain drop-shadow"
              onError={(e) => {
                ;(e.currentTarget as HTMLImageElement).src = '/game-assets/treasure.svg'
              }}
            />
          </div>
          <span
            className={`font-mono font-black text-sm leading-none ${
              treasuresCollected >= targetTreasures ? 'text-emerald-300' : 'text-yellow-200'
            }`}
          >
            {treasuresCollected}/{targetTreasures}
            {treasuresCollected >= targetTreasures && ' ✓'}
          </span>
          <span
            className={`text-[9px] font-bold uppercase tracking-wider ${
              treasuresCollected >= targetTreasures ? 'text-emerald-400' : 'text-yellow-400/80'
            }`}
          >
            GEMS
          </span>
        </div>

        {/* 3. TIME CARD (Countdown Timer for the Round) */}
        <div
          className={`flex flex-col items-center justify-center gap-1 py-2.5 px-2 rounded-2xl transition-transform hover:scale-102 ${
            roundTimeRemaining <= 10 ? 'animate-pulse' : ''
          }`}
          style={{
            background:
              roundTimeRemaining <= 10
                ? 'linear-gradient(135deg, rgba(239, 68, 68, 0.3) 0%, rgba(185, 28, 28, 0.2) 100%)'
                : 'linear-gradient(135deg, rgba(14, 165, 233, 0.2) 0%, rgba(3, 105, 161, 0.1) 100%)',
            border:
              roundTimeRemaining <= 10
                ? '1.5px solid rgba(239, 68, 68, 0.8)'
                : '1.5px solid rgba(14, 165, 233, 0.5)',
            boxShadow: '0 4px 10px rgba(0,0,0,0.2)',
          }}
        >
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center ${
              roundTimeRemaining <= 10 ? 'bg-red-500/30' : 'bg-sky-500/20'
            }`}
          >
            <Clock
              size={18}
              className={roundTimeRemaining <= 10 ? 'text-red-300' : 'text-cyan-300'}
            />
          </div>
          <span
            className={`font-mono font-black text-sm leading-none ${
              roundTimeRemaining <= 10 ? 'text-red-200' : 'text-cyan-200'
            }`}
          >
            {formatTime(roundTimeRemaining)}
          </span>
          <span
            className={`text-[9px] font-bold uppercase tracking-wider ${
              roundTimeRemaining <= 10 ? 'text-red-400' : 'text-cyan-400/80'
            }`}
          >
            TIME
          </span>
        </div>

        {/* 4. GHOST CARD */}
        <div
          className={`flex flex-col items-center justify-center gap-1 py-2.5 px-2 rounded-2xl transition-all ${
            ghostModeSeconds > 0 ? 'animate-pulse' : ''
          }`}
          style={
            ghostModeSeconds > 0
              ? {
                  background: 'linear-gradient(135deg, rgba(168, 85, 247, 0.35) 0%, rgba(126, 34, 206, 0.2) 100%)',
                  border: '1.5px solid rgba(192, 132, 252, 0.8)',
                  boxShadow: '0 0 16px rgba(168, 85, 247, 0.6)',
                }
              : {
                  background: 'linear-gradient(135deg, rgba(147, 51, 234, 0.12) 0%, rgba(88, 28, 135, 0.05) 100%)',
                  border: '1.5px solid rgba(168, 85, 247, 0.3)',
                  boxShadow: '0 4px 10px rgba(0,0,0,0.2)',
                }
          }
        >
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center ${
              ghostModeSeconds > 0 ? 'bg-purple-500/40' : 'bg-purple-500/20'
            }`}
          >
            <Ghost
              size={18}
              className={ghostModeSeconds > 0 ? 'text-white' : 'text-purple-400/70'}
            />
          </div>
          <span
            className={`font-mono font-black text-sm leading-none ${
              ghostModeSeconds > 0 ? 'text-purple-200' : 'text-purple-400/50'
            }`}
          >
            {ghostModeSeconds > 0 ? `${ghostModeSeconds}s` : '—'}
          </span>
          <span className="text-[9px] font-bold text-purple-400/80 uppercase tracking-wider">
            GHOST
          </span>
        </div>
      </div>
    </div>
  )
})

export default GameHUD
