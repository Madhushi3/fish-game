import React from 'react'
import { Play, Home } from 'lucide-react'
import soundService from '../../services/soundService'

interface RoundWinModalProps {
  isOpen: boolean
  roundNumber: number
  score: number
  roundBonus: number
  fishesCollected: number
  targetFish: number
  treasuresCollected: number
  targetTreasures: number
  nextSpeedMultiplier?: number
  onNextRound: () => void
  onMainMenu: () => void
}

export const RoundWinModal: React.FC<RoundWinModalProps> = ({
  isOpen,
  roundNumber,
  score,
  fishesCollected,
  targetFish,
  treasuresCollected,
  targetTreasures,
  onNextRound,
  onMainMenu,
}) => {
  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-cover bg-center bg-no-repeat overflow-hidden select-none animate-fade-in"
      style={{
        backgroundImage: "url('/ocean-bg.jpg')",
        backgroundColor: '#02244a',
      }}
    >
      {/* ========================================================================= */}
      {/* 1. ATMOSPHERIC OVERLAYS & AMBIENT OCEAN LIFE (Identical to GameOver)       */}
      {/* ========================================================================= */}
      {/* Dark Cavern Vignette at Top & Underwater Depth */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#02182e]/80 via-[#022c52]/40 to-[#011425]/70 pointer-events-none" />

      {/* Surface Sunlight & Water Caustics Shimmer */}
      <div
        className="absolute inset-x-0 top-0 h-80 opacity-35 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse at 50% -10%, rgba(255,255,255,0.7) 0%, rgba(125,211,252,0.3) 40%, transparent 80%)',
        }}
      />

      {/* Ambient Rising Bubbles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {Array.from({ length: 20 }).map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full border border-white/40 bg-white/20 animate-float-bubble backdrop-blur-[0.5px]"
            style={{
              width: `${10 + (i % 4) * 8}px`,
              height: `${10 + (i % 4) * 8}px`,
              left: `${(i * 19) % 96}%`,
              animationDuration: `${7 + (i % 4) * 2.5}s`,
              animationDelay: `${(i * 1.2) % 6}s`,
            }}
          />
        ))}
      </div>

      {/* Bottom Left Animated 3D Clownfish (Matching Figma) */}
      <div className="absolute bottom-6 left-4 sm:left-12 opacity-90 pointer-events-none animate-bob">
        <img
          src="/game-assets/fish-clownfish.png"
          alt="Clownfish"
          className="w-14 h-12 sm:w-18 sm:h-14 object-contain filter drop-shadow-lg"
          onError={(e) => {
            ;(e.currentTarget as HTMLImageElement).src = '/game-assets/fish.svg'
          }}
        />
      </div>

      {/* Bottom Right Little 3D Blue Fish Peeking Out (Matching Figma) */}
      <div
        className="absolute bottom-6 right-4 sm:right-14 opacity-90 pointer-events-none animate-bob"
        style={{ animationDelay: '1.5s' }}
      >
        <img
          src="/game-assets/fish-blue-tang.png"
          alt="Blue Fish"
          className="w-12 h-10 sm:w-16 sm:h-12 object-contain filter drop-shadow-lg -scale-x-100"
          onError={(e) => {
            ;(e.currentTarget as HTMLImageElement).src = '/game-assets/fish-clownfish.png'
          }}
        />
      </div>

      {/* ========================================================================= */}
      {/* 2. MAIN CREATIVE GAME WIN STAGE (Exact counterpart of GameOver stage)     */}
      {/* ========================================================================= */}
      <div className="relative z-10 w-full max-w-sm sm:max-w-md flex flex-col items-center">
        {/* Top Rustic Wooden "You Win!" Sign Banner */}
        <div className="flex justify-center -mb-2">
          <img
            src="/game-assets/game-win-banner.svg"
            alt="You Win!"
            className="w-72 sm:w-84 object-contain drop-shadow-[0_14px_28px_rgba(0,0,0,0.7)] animate-bob"
          />
        </div>

        {/* Happy Champion Swimmer Boy with Trophy */}
        <div className="relative z-10 -mt-2 -mb-5 flex justify-center items-center">
          {/* Surface Water Splash & Wake behind him */}
          <div className="absolute -bottom-2 inset-x-0 flex items-center justify-center gap-1.5 opacity-80 pointer-events-none">
            <span
              className="w-28 h-6 rounded-full bg-cyan-300/30 blur-md animate-pulse"
              style={{ animationDuration: '1.8s' }}
            />
          </div>

          <img
            src="/game-assets/swimmer-champion-3d.png"
            alt="Champion Swimmer Boy"
            className="w-40 h-32 sm:w-48 sm:h-38 object-contain filter drop-shadow-[0_12px_24px_rgba(0,0,0,0.6)] animate-bob select-none pointer-events-none"
            onError={(e) => {
              ;(e.currentTarget as HTMLImageElement).src = '/game-assets/swimmer-overhead.png'
            }}
          />
        </div>

        {/* ========================================================================= */}
        {/* 3. FLOATING OCEAN SCORE CARD (Identical to GameOver score card)           */}
        {/* ========================================================================= */}
        <div className="w-full bg-[#0c3258]/95 backdrop-blur-md rounded-[28px] sm:rounded-[32px] p-5 sm:p-6 shadow-[0_24px_60px_rgba(0,0,0,0.7)] border-2 border-cyan-400/40 relative flex flex-col items-center text-center">
          {/* Inner Gloss Header Highlight */}
          <div className="absolute top-0 inset-x-6 h-px bg-gradient-to-r from-transparent via-cyan-300/40 to-transparent pointer-events-none" />

          {/* "Round X - Your Score" Title */}
          <span className="text-xs sm:text-sm font-black text-cyan-200 uppercase tracking-widest drop-shadow-sm">
            Round {roundNumber} Cleared • Your Score
          </span>

          {/* Glowing Golden Score Number */}
          <span className="text-4xl sm:text-5xl font-black text-[#facc15] font-mono my-1 drop-shadow-[0_4px_12px_rgba(250,204,21,0.5)]">
            {score}
          </span>

          {/* Subtle Horizontal Divider */}
          <div className="w-full h-px bg-cyan-400/25 my-2.5" />

          {/* Stat Row 1: Fishes Collected */}
          <div className="w-full flex justify-between items-center text-xs sm:text-sm font-bold text-cyan-100 px-3 py-1.5">
            <div className="flex items-center gap-2.5">
              <img
                src="/game-assets/fish-clownfish.png"
                alt="Fish"
                className="w-6 h-6 object-contain filter drop-shadow"
                onError={(e) => {
                  ;(e.currentTarget as HTMLImageElement).src = '/game-assets/fish.svg'
                }}
              />
              <span className="font-sans font-bold">Fishes Collected</span>
            </div>
            <span className="font-mono font-black text-white text-base sm:text-lg">
              {fishesCollected} / {targetFish}
            </span>
          </div>

          {/* Stat Row 2: Treasures Collected */}
          <div className="w-full flex justify-between items-center text-xs sm:text-sm font-bold text-cyan-100 px-3 py-1.5">
            <div className="flex items-center gap-2.5">
              <img
                src="/game-assets/treasure-chest-3d.png"
                alt="Treasure"
                className="w-6 h-6 object-contain filter drop-shadow"
                onError={(e) => {
                  ;(e.currentTarget as HTMLImageElement).src = '/game-assets/treasure.svg'
                }}
              />
              <span className="font-sans font-bold">Treasures Collected</span>
            </div>
            <span className="font-mono font-black text-white text-base sm:text-lg">
              {treasuresCollected} / {targetTreasures}
            </span>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 4. THE TWO COLORFUL ACTION BUTTONS (Next Round & Main Menu)               */}
        {/* ========================================================================= */}
        <div className="w-full flex flex-row gap-3 justify-center items-center mt-4 sm:mt-5 relative z-10">
          {/* Green "Next Round" Button */}
          <button
            onClick={() => {
              soundService.playClick()
              onNextRound()
            }}
            className="flex-1 py-3.5 px-4 rounded-full bg-gradient-to-r from-[#22c55e] to-[#15803d] hover:from-[#16a34a] hover:to-[#166534] active:scale-95 text-white font-black text-sm sm:text-base shadow-xl shadow-green-900/40 border-2 border-white/90 flex items-center justify-center gap-2 transition-transform cursor-pointer"
          >
            <Play size={20} className="fill-white stroke-[2.5]" />
            <span>Next Round</span>
          </button>

          {/* Blue "Main Menu" Button */}
          <button
            onClick={() => {
              soundService.playClick()
              onMainMenu()
            }}
            className="flex-1 py-3.5 px-4 rounded-full bg-gradient-to-r from-[#3b82f6] to-[#1d4ed8] hover:from-[#2563eb] hover:to-[#1e40af] active:scale-95 text-white font-black text-sm sm:text-base shadow-xl shadow-blue-900/40 border-2 border-white/90 flex items-center justify-center gap-2 transition-transform cursor-pointer"
          >
            <Home size={20} className="stroke-[2.5]" />
            <span>Main Menu</span>
          </button>
        </div>
      </div>
    </div>
  )
}

export default RoundWinModal
