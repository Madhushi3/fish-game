import React, { useState, useEffect } from 'react'
import soundService from '../../services/soundService'
import type { FishPuzzleData } from '../../services/fishApiService'

interface FishPuzzleModalProps {
  isOpen: boolean
  puzzle: FishPuzzleData | null
  isLoading: boolean
  roundNumber: number
  lives: number
  onSolveCorrect: (fishCount: number, chestCount: number) => void
  onTimeOut?: () => void
  onSkip?: () => void
}

export const FishPuzzleModal: React.FC<FishPuzzleModalProps> = ({
  isOpen,
  puzzle,
  isLoading,
  roundNumber,
  lives,
  onSolveCorrect,
  onTimeOut,
}) => {
  const [selectedNumber, setSelectedNumber] = useState<number | null>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [isSuccess, setIsSuccess] = useState<boolean>(false)
  const [timeLeft, setTimeLeft] = useState<number>(45)

  // Reset selection & timer on new puzzle
  useEffect(() => {
    setSelectedNumber(null)
    setErrorMessage(null)
    setIsSuccess(false)
    setTimeLeft(45)
  }, [puzzle])

  // Live countdown timer for answering the puzzle
  useEffect(() => {
    if (!isOpen || isLoading || isSuccess || !puzzle) return

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer)
          soundService.playIncorrect()
          if (onTimeOut) {
            onTimeOut()
          }
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [isOpen, isLoading, isSuccess, puzzle, onTimeOut])

  // Keyboard shortcut listener (0-9 to select, Enter to submit)
  useEffect(() => {
    if (!isOpen) return

    const handleKey = (e: KeyboardEvent) => {
      if (isLoading || isSuccess) return
      const num = parseInt(e.key, 10)
      if (!isNaN(num) && num >= 0 && num <= 9) {
        soundService.playClick()
        setSelectedNumber(num)
        setErrorMessage(null)
      } else if (e.key === 'Enter' && selectedNumber !== null) {
        e.preventDefault()
        verifyAnswer(selectedNumber)
      }
    }

    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [isOpen, isLoading, isSuccess, selectedNumber, puzzle])

  if (!isOpen) return null

  const verifyAnswer = (num: number) => {
    if (!puzzle) return

    if (num === puzzle.fishCount) {
      soundService.playFanfare()
      setIsSuccess(true)
      setErrorMessage(null)
      setTimeout(() => {
        onSolveCorrect(puzzle.fishCount, puzzle.chestCount)
      }, 550)
    } else {
      soundService.playIncorrect()
      setErrorMessage(`That's ${num}. Count again carefully!`)
    }
  }

  const handleSelect = (num: number) => {
    soundService.playClick()
    setSelectedNumber(num)
    setErrorMessage(null)
  }

  const handleSubmit = () => {
    if (selectedNumber === null) {
      setErrorMessage('Please select a number first.')
      return
    }
    verifyAnswer(selectedNumber)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md select-none animate-fade-in">
      {/* ━━ DEDICATED 3D UNDERWATER GAME CARD WITH CUSTOM BACKGROUND ━━ */}
      <div
        className="relative w-full max-w-[430px] rounded-[28px] p-6 shadow-2xl text-slate-100 flex flex-col gap-4 overflow-hidden border-2 border-cyan-400/50"
        style={{
          backgroundImage:
            "linear-gradient(180deg, rgba(3, 20, 45, 0.70) 0%, rgba(2, 24, 52, 0.78) 100%), url('/game-assets/puzzle-modal-bg.jpg')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          boxShadow:
            '0 25px 60px rgba(0, 0, 0, 0.85), 0 0 35px rgba(34, 211, 238, 0.35)',
        }}
      >
        {/* Subtle top water shimmer */}
        <div
          className="absolute -top-12 inset-x-0 h-24 pointer-events-none opacity-25"
          style={{
            background: 'radial-gradient(ellipse at 50% 0%, #38bdf8 0%, transparent 70%)',
          }}
        />

        {/* Top Bar: Round & Live Timer & Lives */}
        <div className="relative flex items-center justify-between pb-2 border-b border-cyan-500/25">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-cyan-400/15 text-cyan-200 border border-cyan-400/30">
              Round {roundNumber}
            </span>
            <div
              className={`flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-mono font-bold transition-all ${
                timeLeft <= 10
                  ? 'bg-red-500/25 text-red-400 border border-red-500/50 animate-pulse'
                  : 'bg-slate-900/80 text-cyan-300 border border-cyan-500/30'
              }`}
            >
              <span>⏱️</span>
              <span>{timeLeft}s</span>
            </div>
          </div>

          {/* Hearts */}
          <div className="flex items-center gap-1.5">
            {[1, 2, 3].map((heart) => (
              <span
                key={heart}
                className={`text-sm transition-opacity duration-300 ${
                  heart <= lives ? 'opacity-100' : 'opacity-20 grayscale'
                }`}
              >
                ❤️
              </span>
            ))}
          </div>
        </div>

        {/* Puzzle Image Tank */}
        <div className="relative w-full h-[200px] rounded-2xl bg-slate-950/80 backdrop-blur-sm border border-cyan-400/30 flex items-center justify-center overflow-hidden shadow-inner">
          {isLoading ? (
            <div className="flex flex-col items-center gap-2 text-slate-400 text-xs">
              <div className="w-8 h-8 border-2 border-sky-400 border-t-transparent rounded-full animate-spin" />
              <span>Loading puzzle...</span>
            </div>
          ) : puzzle?.imageData ? (
            <img
              src={puzzle.imageData}
              alt="Fish puzzle"
              className="w-full h-full object-contain p-2"
            />
          ) : (
            <span className="text-xs text-slate-500">Failed to load puzzle.</span>
          )}

          {/* Success Overlay */}
          {isSuccess && (
            <div className="absolute inset-0 bg-emerald-950/90 backdrop-blur-sm flex flex-col items-center justify-center gap-1 text-emerald-300 animate-fade-in">
              <span className="text-3xl">✓</span>
              <span className="text-sm font-bold">Correct! Starting round...</span>
            </div>
          )}
        </div>

        {/* Question Prompt */}
        <div className="text-center">
          <p className="text-sm font-bold text-white tracking-wide">
            How many fish do you see?
          </p>
        </div>

        {/* Clean Number Chips (0 - 9 in 2 rows of 5) */}
        <div className="flex flex-col gap-2">
          {/* Row 1: 0, 1, 2, 3, 4 */}
          <div className="grid grid-cols-5 gap-2">
            {[0, 1, 2, 3, 4].map((num) => {
              const isPicked = selectedNumber === num
              return (
                <button
                  key={num}
                  type="button"
                  disabled={isLoading || isSuccess}
                  onClick={() => handleSelect(num)}
                  className={`h-11 rounded-xl text-base font-bold font-mono transition-all cursor-pointer backdrop-blur-sm ${
                    isPicked
                      ? 'bg-sky-500 text-white shadow-lg shadow-sky-500/40 scale-105 border-2 border-white'
                      : 'bg-slate-900/75 hover:bg-cyan-500/20 text-slate-200 border border-cyan-400/30 active:scale-95'
                  }`}
                >
                  {num}
                </button>
              )
            })}
          </div>

          {/* Row 2: 5, 6, 7, 8, 9 */}
          <div className="grid grid-cols-5 gap-2">
            {[5, 6, 7, 8, 9].map((num) => {
              const isPicked = selectedNumber === num
              return (
                <button
                  key={num}
                  type="button"
                  disabled={isLoading || isSuccess}
                  onClick={() => handleSelect(num)}
                  className={`h-11 rounded-xl text-base font-bold font-mono transition-all cursor-pointer backdrop-blur-sm ${
                    isPicked
                      ? 'bg-sky-500 text-white shadow-lg shadow-sky-500/40 scale-105 border-2 border-white'
                      : 'bg-slate-900/75 hover:bg-cyan-500/20 text-slate-200 border border-cyan-400/30 active:scale-95'
                  }`}
                >
                  {num}
                </button>
              )
            })}
          </div>
        </div>

        {/* Error message */}
        {errorMessage && (
          <p className="text-xs text-rose-300 bg-rose-950/80 border border-rose-500/50 py-1 px-3 rounded-xl font-medium text-center animate-shake">
            {errorMessage}
          </p>
        )}

        {/* Action Button */}
        <button
          type="button"
          disabled={isLoading || isSuccess || selectedNumber === null}
          onClick={handleSubmit}
          className="w-full py-3 rounded-xl bg-gradient-to-r from-sky-500 to-cyan-500 hover:from-sky-400 hover:to-cyan-400 disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold text-sm tracking-wide transition-all shadow-lg shadow-sky-950/50 cursor-pointer active:scale-[0.99] flex items-center justify-center gap-1.5 border border-white/20"
        >
          <span>Start Swimming</span>
          <span className="text-xs">→</span>
        </button>

        {/* Target summary hint & live ticking countdown */}
        <div className="flex items-center justify-between text-xs text-cyan-200/70 pt-2 border-t border-cyan-500/20">
          <span>Target: Fish & Chests</span>
          <span
            className={`font-mono font-bold transition-colors ${
              timeLeft <= 10 ? 'text-red-400 animate-pulse' : 'text-cyan-300'
            }`}
          >
            Time: {timeLeft}s
          </span>
        </div>
      </div>
    </div>
  )
}

export default FishPuzzleModal
