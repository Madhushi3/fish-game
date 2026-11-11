import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Home, Trophy, History, LogOut, Play, Star, ChevronRight, Edit3 } from 'lucide-react'
import { useGame } from '../context/GameContext'
import soundService from '../services/soundService'
import EditProfileModal from '../components/profile/EditProfileModal'

export const Dashboard: React.FC = () => {
  const navigate = useNavigate()
  const {
    playerName,
    playerTitle,
    playerAvatar,
    updateProfile,
    totalFish,
    totalTreasures,
    highestScore,
    recentGames,
    logout,
  } = useGame()
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false)

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <div
      className="min-h-screen w-full relative bg-cover bg-center bg-no-repeat p-3 sm:p-6 flex flex-col justify-between select-none"
      style={{
        backgroundImage: "url('/ocean-bg.jpg')",
        backgroundColor: '#023859',
      }}
    >
      {/* Oceanic Depth Overlay */}
      <div className="absolute inset-0 bg-[#022646]/70 backdrop-blur-[2px] pointer-events-none" />

      <div className="relative z-10 w-full max-w-6xl mx-auto flex flex-col md:flex-row gap-4 sm:gap-6 items-stretch">
        {/* ========================================================================= */}
        {/* LEFT SIDEBAR (Matching Figma Bottom-Left Sidebar)                         */}
        {/* ========================================================================= */}
        <div className="w-full md:w-64 bg-[#034475]/95 backdrop-blur-md rounded-3xl border-3 border-cyan-400/80 shadow-2xl p-5 flex flex-col justify-between shrink-0">
          <div>
            {/* User Profile Avatar & Name */}
            <div className="flex flex-col items-center text-center pb-5 border-b border-cyan-400/30">
              <div
                onClick={() => {
                  soundService.playClick()
                  setIsEditProfileOpen(true)
                }}
                className="group relative w-20 h-20 rounded-full bg-gradient-to-tr from-sky-400 to-cyan-200 border-3 border-white shadow-xl flex items-center justify-center overflow-hidden mb-3 cursor-pointer hover:scale-105 transition-all"
                title="Click to edit profile"
              >
                {playerAvatar && (playerAvatar.startsWith('/') || playerAvatar.startsWith('http') || playerAvatar.startsWith('data:')) ? (
                  <img
                    src={playerAvatar}
                    alt="Avatar"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      ;(e.currentTarget as HTMLImageElement).src = '/game-assets/swimmer-avatar.png'
                    }}
                  />
                ) : (
                  <span className="text-4xl select-none leading-none">{playerAvatar || '🏊‍♂️'}</span>
                )}
                {/* Hover overlay hint */}
                <div className="absolute inset-0 bg-sky-950/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                  <Edit3 size={18} className="text-cyan-200" />
                </div>
              </div>
              <h3 className="text-xl font-black text-white tracking-wide">{playerName}</h3>

              {/* Edit Profile Button */}
              <button
                onClick={() => {
                  soundService.playClick()
                  setIsEditProfileOpen(true)
                }}
                className="mt-3 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-sky-500/90 to-blue-600/90 hover:from-sky-400 hover:to-blue-500 border border-cyan-300/60 text-xs font-bold text-white flex items-center gap-1.5 transition-all shadow-md hover:shadow-cyan-400/30 active:scale-95 cursor-pointer group"
              >
                <Edit3 size={12} className="text-cyan-200 group-hover:rotate-12 transition-transform" />
                <span>Edit Profile</span>
              </button>
            </div>

            {/* Navigation Menu Links */}
            <nav className="flex flex-col gap-2 mt-6">
              {/* Dashboard (Active) */}
              <button
                onClick={() => soundService.playClick()}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl bg-gradient-to-r from-sky-500 to-blue-600 text-white font-black text-sm shadow-md border border-white/60 cursor-pointer"
              >
                <Home size={18} />
                <span>Dashboard</span>
              </button>

              {/* Leaderboard */}
              <button
                onClick={() => {
                  soundService.playClick()
                  navigate('/leaderboard')
                }}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-cyan-100 hover:text-white hover:bg-sky-800/60 font-bold text-sm transition-all cursor-pointer"
              >
                <Trophy size={18} className="text-amber-400" />
                <span>Leaderboard</span>
              </button>

              {/* Game History */}
              <button
                onClick={() => {
                  soundService.playClick()
                  navigate('/history')
                }}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-cyan-100 hover:text-white hover:bg-sky-800/60 font-bold text-sm transition-all cursor-pointer"
              >
                <History size={18} className="text-cyan-300" />
                <span>Game History</span>
              </button>
            </nav>
          </div>

          {/* Bottom Logout Button */}
          <div className="pt-6 border-t border-cyan-400/30">
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-2.5 rounded-2xl text-rose-300 hover:text-white hover:bg-rose-900/50 font-bold text-sm transition-all cursor-pointer"
            >
              <LogOut size={18} />
              <span>Logout</span>
            </button>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* MAIN DASHBOARD CONTENT AREA                                               */}
        {/* ========================================================================= */}
        <div className="flex-1 flex flex-col gap-5">
          {/* Top Welcome Bar */}
          <div className="w-full bg-[#034475]/95 backdrop-blur-md rounded-3xl border-3 border-cyan-400/80 shadow-2xl p-4 sm:p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-2xl font-black text-white">Dashboard</h1>
              <p className="text-xs font-bold text-cyan-200">
                Track your stats, view scores, and dive into the endless swimming lanes!
              </p>
            </div>

            {/* Welcome Greeting */}
            <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-amber-500/20 border border-amber-400 text-amber-300 text-xs sm:text-sm font-black shadow">
              <span>Welcome back, {playerName}!</span>
            </div>
          </div>

          {/* Three Stat Cards (Total Fish, Total Treasures, Highest Score) */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Stat Card 1: Total Fish */}
            <div className="bg-[#034475]/90 rounded-3xl border-3 border-cyan-400/70 p-5 shadow-xl flex flex-col items-center text-center">
              <img
                src="/game-assets/fish-clownfish.png"
                alt="Fish"
                className="w-14 h-12 object-contain"
                onError={(e) => {
                  ;(e.currentTarget as HTMLImageElement).src = '/game-assets/fish.svg'
                }}
              />
              <span className="text-xs font-bold text-cyan-200 uppercase tracking-wider mt-2">
                Total Fish
              </span>
              <span className="text-3xl sm:text-4xl font-black text-white font-mono mt-1">
                {totalFish}
              </span>
            </div>

            {/* Stat Card 2: Total Treasures */}
            <div className="bg-[#034475]/90 rounded-3xl border-3 border-amber-400/70 p-5 shadow-xl flex flex-col items-center text-center">
              <img
                src="/game-assets/treasure-chest-3d.png"
                alt="Treasure"
                className="w-14 h-12 object-contain"
                onError={(e) => {
                  ;(e.currentTarget as HTMLImageElement).src = '/game-assets/treasure.svg'
                }}
              />
              <span className="text-xs font-bold text-amber-200 uppercase tracking-wider mt-2">
                Total Treasures
              </span>
              <span className="text-3xl sm:text-4xl font-black text-white font-mono mt-1">
                {totalTreasures}
              </span>
            </div>

            {/* Stat Card 3: Highest Score */}
            <div className="bg-[#034475]/90 rounded-3xl border-3 border-yellow-400/70 p-5 shadow-xl flex flex-col items-center text-center">
              <div className="w-12 h-12 rounded-full bg-amber-400/20 flex items-center justify-center text-3xl">
                <Star size={36} className="fill-amber-400 text-amber-500 animate-spin" style={{ animationDuration: '8s' }} />
              </div>
              <span className="text-xs font-bold text-yellow-200 uppercase tracking-wider mt-2">
                Highest Score
              </span>
              <span className="text-3xl sm:text-4xl font-black text-amber-300 font-mono mt-1">
                {highestScore}
              </span>
            </div>
          </div>

          {/* ========================================================================= */}
          {/* BOTTOM SPLIT SECTION (Left: Play Now Card | Right: Recent Games Card)     */}
          {/* ========================================================================= */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 items-stretch">
            {/* ── LEFT CARD: Hero Banner with Background Image, Logo & Play Now Button ── */}
            <div
              className="relative rounded-3xl border-3 border-cyan-400/80 shadow-2xl p-6 flex flex-col justify-between overflow-hidden group min-h-[330px]"
              style={{
                backgroundImage: "url('/game-assets/play-card-banner.jpg')",
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }}
            >
              {/* Oceanic Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#021832]/90 via-[#023359]/50 to-sky-950/20 backdrop-blur-[0.5px] pointer-events-none" />

              {/* Underwater Ambient Glow */}
              <div className="absolute -top-12 -right-12 w-48 h-48 rounded-full bg-cyan-400/20 blur-3xl pointer-events-none" />
              <div className="absolute -bottom-12 -left-12 w-48 h-48 rounded-full bg-blue-500/20 blur-3xl pointer-events-none" />

              {/* Content Header & Logo */}
              <div className="relative z-10 flex flex-col items-center text-center">
                <img
                  src="/game-assets/logo.svg"
                  alt="Swimming – Dive, Collect & Survive"
                  className="w-60 sm:w-68 object-contain drop-shadow-[0_10px_20px_rgba(0,0,0,0.65)] group-hover:scale-105 transition-transform duration-300"
                />

                {/* 3D Mascot Swimmer */}
                <div className="relative mt-1 mb-2">
                  <img
                    src="/game-assets/swimmer-avatar.png"
                    alt="Swimmer"
                    className="w-20 h-20 object-contain drop-shadow-[0_8px_16px_rgba(0,0,0,0.5)] animate-bob select-none pointer-events-none"
                  />
                </div>

                <p className="text-xs font-bold text-cyan-200 max-w-xs drop-shadow">
                  Dive into endless 3D swimming lanes, count target fish & collect treasures!
                </p>
              </div>

              {/* Play Now CTA Button */}
              <div className="relative z-10 mt-4">
                <button
                  onClick={() => {
                    soundService.playFanfare()
                    navigate('/play')
                  }}
                  className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-emerald-500 via-green-500 to-teal-500 hover:from-emerald-400 hover:to-green-400 active:scale-98 text-white font-black text-base sm:text-lg shadow-[0_8px_25px_rgba(16,185,129,0.45)] border-2 border-white flex items-center justify-center gap-2.5 transition-all cursor-pointer group/btn"
                >
                  <Play size={22} className="fill-white group-hover/btn:translate-x-0.5 transition-transform" />
                  <span className="tracking-wide uppercase">Play Now</span>
                </button>
              </div>
            </div>

            {/* ── RIGHT CARD: Recent Games History ── */}
            <div className="bg-[#034475]/95 backdrop-blur-md rounded-3xl border-3 border-cyan-400/80 shadow-2xl p-5 sm:p-6 flex flex-col justify-between min-h-[330px]">
              <div>
                <div className="flex justify-between items-center mb-3 pb-2 border-b border-cyan-400/20">
                  <div className="flex items-center gap-2">
                    <History size={18} className="text-cyan-300" />
                    <h2 className="text-lg font-black text-white">Your Recent Games</h2>
                  </div>
                  <button
                    onClick={() => navigate('/history')}
                    className="flex items-center gap-1 text-xs font-bold text-cyan-300 hover:text-white transition-colors cursor-pointer"
                  >
                    <span>View All</span>
                    <ChevronRight size={14} />
                  </button>
                </div>

                {/* Table */}
                <div className="w-full overflow-x-auto">
                  <table className="w-full text-left text-xs sm:text-sm text-cyan-100">
                    <thead>
                      <tr className="border-b border-cyan-400/30 text-[11px] uppercase text-cyan-300 font-black">
                        <th className="py-2 px-2.5">Date</th>
                        <th className="py-2 px-2.5">Score</th>
                        <th className="py-2 px-2.5">Fish</th>
                        <th className="py-2 px-2.5">Chest</th>
                        <th className="py-2 px-2.5">Result</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-cyan-400/20 font-bold">
                      {recentGames.slice(0, 4).map(game => (
                        <tr key={game.id} className="hover:bg-sky-800/40 transition-colors">
                          <td className="py-2.5 px-2.5 text-white whitespace-nowrap">{game.date}</td>
                          <td className="py-2.5 px-2.5 font-mono font-black text-amber-300">{game.score}</td>
                          <td className="py-2.5 px-2.5 text-cyan-200">{game.fishes}</td>
                          <td className="py-2.5 px-2.5 text-amber-200">{game.treasures}</td>
                          <td className="py-2.5 px-2.5">
                            <span
                              className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-black ${
                                game.result === 'Won'
                                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-400/50'
                                  : 'bg-rose-500/20 text-rose-300 border border-rose-400/50'
                              }`}
                            >
                              {game.result === 'Won' ? '🏆 Won' : '🛑 Ended'}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Profile Modal */}
      <EditProfileModal
        isOpen={isEditProfileOpen}
        currentName={playerName}
        currentTitle={playerTitle}
        currentAvatar={playerAvatar}
        onClose={() => setIsEditProfileOpen(false)}
        onSave={(newName, newTitle, newAvatar) => updateProfile(newName, newTitle, newAvatar)}
      />
    </div>
  )
}

export default Dashboard

