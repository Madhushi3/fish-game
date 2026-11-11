import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Trophy, ArrowLeft, Medal } from 'lucide-react'
import { useGame } from '../context/GameContext'
import leaderboardService, { type LeaderboardEntry } from '../services/leaderboardService'
import soundService from '../services/soundService'

export const Leaderboard: React.FC = () => {
  const navigate = useNavigate()
  const { playerName, highestScore } = useGame()
  const [board, setBoard] = useState<LeaderboardEntry[]>([])

  useEffect(() => {
    leaderboardService.getLeaderboard(playerName, highestScore).then(setBoard)
  }, [playerName, highestScore])

  return (
    <div
      className="min-h-screen w-full relative bg-cover bg-center bg-no-repeat p-4 sm:p-8 flex flex-col items-center justify-between select-none"
      style={{
        backgroundImage: "url('/ocean-bg.jpg')",
        backgroundColor: '#023859',
      }}
    >
      {/* Oceanic Depth Overlay */}
      <div className="absolute inset-0 bg-[#022646]/75 backdrop-blur-[2px] pointer-events-none" />

      <div className="relative z-10 w-full max-w-5xl flex flex-col items-center">
        {/* Header Row with Top-Left Back Button & Centered Title */}
        <div className="w-full relative flex items-center justify-center mb-4 sm:mb-6 min-h-[52px]">
          {/* Top-Left Back Button */}
          <button
            onClick={() => {
              soundService.playClick()
              navigate(-1)
            }}
            className="absolute left-0 top-1/2 -translate-y-1/2 px-4 sm:px-6 py-2.5 rounded-full bg-gradient-to-r from-sky-600 via-blue-600 to-sky-700 hover:from-sky-500 hover:to-blue-500 active:scale-95 text-white font-black text-sm sm:text-base shadow-2xl border-3 border-white flex items-center gap-2 cursor-pointer transition-all z-20 group"
          >
            <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
            <span>Back</span>
          </button>

          {/* Centered Leaderboard Pill */}
          <div className="px-8 py-3 rounded-full bg-gradient-to-r from-sky-600 via-blue-600 to-sky-700 border-3 border-white shadow-2xl flex items-center gap-3">
            <Trophy size={26} className="text-amber-300 fill-amber-300" />
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-wide drop-shadow-md">
              Leaderboard
            </h1>
          </div>
        </div>

        {/* ── MAIN CONTENT ROW (Large 3D Swimmer Champion + Leaderboard Card) ── */}
        <div className="w-full flex flex-col lg:flex-row items-center justify-center gap-6 lg:gap-12">
          
          {/* ── 3D SWIMMING CHAMPION CHARACTER ── */}
          <div className="flex flex-col items-center justify-center flex-shrink-0 animate-float select-none">
            <div className="relative w-64 sm:w-72 lg:w-80 h-[380px] sm:h-[460px] lg:h-[530px] flex items-center justify-center">
              {/* Underwater Glow Aura */}
              <div className="absolute inset-4 rounded-full bg-cyan-400/25 blur-3xl animate-pulse pointer-events-none" />
              
              <img
                src="/game-assets/swimmer-champion-3d.png"
                alt="3D Swimming Champion"
                className="w-full h-full object-contain filter drop-shadow-[0_20px_35px_rgba(2,29,56,0.7)] hover:scale-105 transition-transform duration-500 pointer-events-none"
              />
            </div>
          </div>

          {/* ── LEADERBOARD CARD CONTAINER ── */}
          <div className="w-full max-w-lg flex flex-col items-center">
            <div className="w-full rounded-[32px] p-4 sm:p-6 bg-[#034475]/95 backdrop-blur-md border-4 border-cyan-400/80 shadow-2xl flex flex-col gap-2.5">
              {board.map((player) => {
                const isMe = player.isCurrentPlayer || player.name.toLowerCase() === playerName.toLowerCase()

                return (
                  <div
                    key={player.id}
                    className={`w-full py-3 px-4 rounded-2xl flex items-center justify-between transition-all ${
                      isMe
                        ? 'bg-gradient-to-r from-sky-500 to-blue-600 text-white border-2 border-white shadow-lg scale-[1.02]'
                        : 'bg-[#022646]/80 text-cyan-100 hover:bg-[#022646] border border-cyan-400/20'
                    }`}
                  >
                    {/* Left: Rank & Name */}
                    <div className="flex items-center gap-3">
                      {/* Rank Badge */}
                      <div className="w-8 h-8 rounded-full flex items-center justify-center font-black text-sm">
                        {player.rank === 1 && (
                          <span className="w-8 h-8 rounded-full bg-amber-400 text-amber-950 flex items-center justify-center shadow font-black">
                            1
                          </span>
                        )}
                        {player.rank === 2 && (
                          <span className="w-8 h-8 rounded-full bg-slate-300 text-slate-900 flex items-center justify-center shadow font-black">
                            2
                          </span>
                        )}
                        {player.rank === 3 && (
                          <span className="w-8 h-8 rounded-full bg-amber-600 text-white flex items-center justify-center shadow font-black">
                            3
                          </span>
                        )}
                        {player.rank > 3 && (
                          <span className="font-mono text-cyan-300 font-bold">{player.rank}</span>
                        )}
                      </div>

                      {/* Player Name */}
                      <span className={`font-black text-sm sm:text-base ${isMe ? 'text-white' : 'text-cyan-100'}`}>
                        {player.name} {isMe && '(You)'}
                      </span>
                    </div>

                    {/* Right: Score */}
                    <div className="flex items-center gap-1.5 font-mono font-black text-base sm:text-lg">
                      <span className={isMe ? 'text-amber-200' : 'text-amber-400'}>
                        {player.score.toLocaleString()}
                      </span>
                      {player.rank <= 3 && <Medal size={16} className="text-amber-300" />}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}

export default Leaderboard
