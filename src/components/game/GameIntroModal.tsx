import React, { useState } from 'react'
import { ArrowLeft, ArrowRight, Play } from 'lucide-react'
import soundService from '../../services/soundService'

interface GameIntroModalProps {
  isOpen: boolean
  onClose: () => void
}

export const GameIntroModal: React.FC<GameIntroModalProps> = ({ isOpen, onClose }) => {
  const [dontShowAgain, setDontShowAgain] = useState(false)

  if (!isOpen) return null

  const handleStart = () => {
    soundService.playClick()
    if (dontShowAgain) {
      try {
        localStorage.setItem('fish_game_hide_intro', 'true')
      } catch {
        // LocalStorage fallback
      }
    }
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/75 backdrop-blur-md animate-fade-in select-none">
      <div
        className="relative w-full max-w-md rounded-3xl p-5 sm:p-6 flex flex-col gap-4 text-white shadow-2xl border-2 border-cyan-400/60 overflow-hidden"
        style={{
          background: 'linear-gradient(165deg, rgba(3, 29, 58, 0.97) 0%, rgba(2, 18, 38, 0.99) 100%)',
          boxShadow: '0 25px 60px rgba(0, 0, 0, 0.8), 0 0 35px rgba(34, 211, 238, 0.25)',
        }}
      >
        {/* Subtle Decorative Ambient Glow */}
        <div className="absolute -top-16 -right-16 w-44 h-44 rounded-full bg-cyan-500/20 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-16 -left-16 w-44 h-44 rounded-full bg-blue-600/20 blur-3xl pointer-events-none" />

        {/* ── TOPIC HEADER: EXACT 3D GAME LOGO FROM LOGIN ── */}
        <div className="flex flex-col items-center justify-center pt-1 pb-1">
          <img
            src="/game-assets/logo.svg"
            alt="Swimming – Dive, Collect & Survive"
            className="w-60 sm:w-68 object-contain filter drop-shadow-[0_8px_20px_rgba(0,0,0,0.55)]"
          />
        </div>

        {/* ── CONTROLS SECTION (A & D KEYS) ── */}
        <div className="flex flex-col gap-2.5 p-3.5 rounded-2xl bg-slate-900/70 border border-cyan-500/25">
          <span className="text-[11px] font-black uppercase tracking-wider text-cyan-400">
            Lane Movement
          </span>

          <div className="grid grid-cols-2 gap-2.5 pt-0.5">
            {/* Move Left */}
            <div className="flex items-center gap-2.5 p-2 rounded-xl bg-slate-800/80 border border-cyan-400/20">
              <div className="flex items-center gap-1">
                <kbd className="px-2.5 py-1 text-xs font-black rounded-lg bg-cyan-950 text-cyan-300 border border-cyan-400/50 shadow-inner">
                  A
                </kbd>
                <span className="text-[10px] text-slate-400">or</span>
                <kbd className="p-1 rounded-lg bg-cyan-950 text-cyan-300 border border-cyan-400/50 shadow-inner">
                  <ArrowLeft size={13} />
                </kbd>
              </div>
              <span className="text-xs font-bold text-slate-200">Move Left</span>
            </div>

            {/* Move Right */}
            <div className="flex items-center gap-2.5 p-2 rounded-xl bg-slate-800/80 border border-cyan-400/20">
              <div className="flex items-center gap-1">
                <kbd className="px-2.5 py-1 text-xs font-black rounded-lg bg-cyan-950 text-cyan-300 border border-cyan-400/50 shadow-inner">
                  D
                </kbd>
                <span className="text-[10px] text-slate-400">or</span>
                <kbd className="p-1 rounded-lg bg-cyan-950 text-cyan-300 border border-cyan-400/50 shadow-inner">
                  <ArrowRight size={13} />
                </kbd>
              </div>
              <span className="text-xs font-bold text-slate-200">Move Right</span>
            </div>
          </div>

          {/* Pause key */}
          <div className="flex items-center justify-between px-2.5 py-1.5 rounded-lg bg-slate-800/50 text-[11px] text-slate-300 border border-slate-700/50">
            <span className="text-slate-400">Pause / Resume:</span>
            <kbd className="px-2.5 py-0.5 text-[10px] font-black rounded bg-slate-900 text-cyan-300 border border-cyan-500/30">
              SPACE
            </kbd>
          </div>
        </div>

        {/* ── CLEAN GAME OBJECTIVES (NO EMOJIS OR AI GLYPHS) ── */}
        <div className="flex flex-col gap-2 text-xs text-slate-300 px-1">
          <div className="flex items-start gap-2.5">
            <span className="w-5 h-5 rounded-full bg-cyan-900/90 border border-cyan-400/60 flex items-center justify-center text-[10px] font-bold text-cyan-300 shrink-0 mt-0.5">
              1
            </span>
            <span>
              <strong className="text-cyan-200 font-bold">Math Puzzle:</strong> Count the target fish in the puzzle to unlock the swimming round.
            </span>
          </div>
          <div className="flex items-start gap-2.5">
            <span className="w-5 h-5 rounded-full bg-amber-900/90 border border-amber-400/60 flex items-center justify-center text-[10px] font-bold text-amber-300 shrink-0 mt-0.5">
              2
            </span>
            <span>
              <strong className="text-amber-200 font-bold">Collect & Score:</strong> Swim into target fish and open treasure chests.
            </span>
          </div>
          <div className="flex items-start gap-2.5">
            <span className="w-5 h-5 rounded-full bg-rose-900/90 border border-rose-400/60 flex items-center justify-center text-[10px] font-bold text-rose-300 shrink-0 mt-0.5">
              3
            </span>
            <span>
              <strong className="text-rose-200 font-bold">Avoid Obstacles:</strong> Dodge rocks and wooden logs (3 lives per game).
            </span>
          </div>
        </div>

        {/* ── FOOTER: "DO NOT SHOW AGAIN" + START BUTTON ── */}
        <div className="flex flex-col gap-3 pt-2 border-t border-cyan-500/20">
          <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-300 hover:text-white transition-colors group">
            <input
              type="checkbox"
              checked={dontShowAgain}
              onChange={(e) => setDontShowAgain(e.target.checked)}
              className="w-4 h-4 rounded border-cyan-400/40 bg-slate-900 text-cyan-500 focus:ring-0 focus:ring-offset-0 cursor-pointer"
            />
            <span className="group-hover:text-cyan-200 transition-colors">
              Do not show this intro again
            </span>
          </label>

          <button
            onClick={handleStart}
            className="w-full py-3 px-4 rounded-xl font-black text-sm tracking-wider uppercase text-white cursor-pointer active:scale-98 transition-all shadow-lg flex items-center justify-center gap-2 group"
            style={{
              background: 'linear-gradient(135deg, #0ea5e9 0%, #0284c7 50%, #0369a1 100%)',
              border: '1.5px solid rgba(255, 255, 255, 0.6)',
              boxShadow: '0 6px 20px rgba(14, 165, 233, 0.45)',
            }}
          >
            <Play size={16} className="fill-white text-white" />
            <span>Start Swimming</span>
          </button>
        </div>
      </div>
    </div>
  )
}

export default GameIntroModal
