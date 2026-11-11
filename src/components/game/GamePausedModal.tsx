import React from 'react'
import { Play, Home, Trophy } from 'lucide-react'
import soundService from '../../services/soundService'

interface GamePausedModalProps {
  isOpen: boolean
  onResume: () => void
  onRestart?: () => void
  onMainMenu: () => void
  onLeaderboard: () => void
}

export const GamePausedModal: React.FC<GamePausedModalProps> = ({
  isOpen,
  onResume,
  onMainMenu,
  onLeaderboard,
}) => {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-sky-950/70 backdrop-blur-sm animate-fade-in select-none">
      {/* Modal Dialog Card (Matching Figma Top-Right Screen) */}
      <div className="relative w-full max-w-sm rounded-[32px] p-6 sm:p-8 bg-gradient-to-b from-[#e0f7ff] via-[#bae6fd] to-[#7dd3fc] border-4 border-white shadow-2xl overflow-hidden text-center">
        {/* Gloss highlight arc at top */}
        <div className="absolute -top-12 -left-12 -right-12 h-28 bg-white/40 rounded-full blur-sm pointer-events-none" />

        {/* Modal Header Pill */}
        <div className="relative inline-block mb-6">
          <div className="px-6 py-2.5 rounded-full bg-gradient-to-r from-sky-600 via-blue-600 to-sky-700 border-2 border-white shadow-lg">
            <h2 className="text-xl sm:text-2xl font-black text-white tracking-wide drop-shadow-[0_2px_4px_rgba(0,0,0,0.4)]">
              Game Paused
            </h2>
          </div>
        </div>

        {/* Button Action List */}
        <div className="flex flex-col gap-3.5 relative z-10">
          {/* Resume Button (Green) */}
          <button
            onClick={() => {
              soundService.playClick()
              onResume()
            }}
            className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-400 hover:to-green-500 active:scale-95 text-white font-black text-base sm:text-lg shadow-lg border-2 border-white/80 flex items-center justify-center gap-3 transition-transform cursor-pointer"
          >
            <Play size={22} className="fill-white" />
            <span>Resume</span>
          </button>

          {/* Main Menu Button (Blue) */}
          <button
            onClick={() => {
              soundService.playClick()
              onMainMenu()
            }}
            className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 active:scale-95 text-white font-black text-base sm:text-lg shadow-lg border-2 border-white/80 flex items-center justify-center gap-3 transition-transform cursor-pointer"
          >
            <Home size={22} />
            <span>Main Menu</span>
          </button>

          {/* Leaderboard Button (Orange) */}
          <button
            onClick={() => {
              soundService.playClick()
              onLeaderboard()
            }}
            className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 active:scale-95 text-white font-black text-base sm:text-lg shadow-lg border-2 border-white/80 flex items-center justify-center gap-3 transition-transform cursor-pointer"
          >
            <Trophy size={22} />
            <span>Leaderboard</span>
          </button>
        </div>
      </div>
    </div>
  )
}

export default GamePausedModal

