import React from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, History, Trophy } from 'lucide-react'
import { useGame } from '../context/GameContext'
import soundService from '../services/soundService'

export const GameHistory: React.FC = () => {
  const navigate = useNavigate()
  const { recentGames } = useGame()

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-[#0284c7] via-[#0369a1] to-[#011a33] p-4 sm:p-8 flex flex-col items-center justify-between select-none">
      <div className="w-full max-w-2xl flex flex-col items-center">
        {/* Header */}
        <div className="mb-6">
          <div className="px-8 py-3 rounded-full bg-gradient-to-r from-sky-600 via-blue-600 to-sky-700 border-3 border-white shadow-2xl flex items-center gap-3">
            <History size={26} className="text-cyan-300" />
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-wide drop-shadow-md">
              Game History
            </h1>
          </div>
        </div>

        {/* History Card Container */}
        <div className="w-full rounded-[32px] p-5 sm:p-6 bg-[#034475]/95 backdrop-blur-md border-4 border-cyan-400/80 shadow-2xl flex flex-col gap-3">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-cyan-100">
              <thead>
                <tr className="border-b border-cyan-400/30 text-xs uppercase text-cyan-300 font-black">
                  <th className="py-3 px-3">Date</th>
                  <th className="py-3 px-3">Score</th>
                  <th className="py-3 px-3">Fishes</th>
                  <th className="py-3 px-3">Treasures</th>
                  <th className="py-3 px-3">Result</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-cyan-400/20 font-bold">
                {recentGames.map((game) => (
                  <tr key={game.id} className="hover:bg-sky-800/40 transition-colors">
                    <td className="py-3 px-3 text-white">{game.date}</td>
                    <td className="py-3 px-3 font-mono font-black text-amber-300 text-base">{game.score}</td>
                    <td className="py-3 px-3 text-cyan-200">{game.fishes}</td>
                    <td className="py-3 px-3 text-amber-200">{game.treasures}</td>
                    <td className="py-3 px-3">
                      <span
                        className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-black ${
                          game.result === 'Won'
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-400/50'
                            : 'bg-rose-500/20 text-rose-300 border border-rose-400/50'
                        }`}
                      >
                        {game.result === 'Won' ? <Trophy size={14} className="text-amber-400" /> : '🛑'}
                        <span>{game.result}</span>
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Back Button */}
        <div className="w-full mt-6">
          <button
            onClick={() => {
              soundService.playClick()
              navigate(-1)
            }}
            className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 active:scale-95 text-white font-black text-base shadow-xl border-2 border-white flex items-center justify-center gap-2 cursor-pointer transition-transform"
          >
            <ArrowLeft size={20} />
            <span>Back to Dashboard</span>
          </button>
        </div>
      </div>
    </div>
  )
}

export default GameHistory

