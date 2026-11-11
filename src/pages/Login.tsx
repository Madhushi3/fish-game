import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { User, Lock, Mail, Eye, EyeOff, CheckCircle2, AlertCircle } from 'lucide-react'
import { useGame } from '../context/GameContext'
import soundService from '../services/soundService'

// Hardcoded Accounts (until real backend/database is connected)
const HARDCODED_CREDENTIALS = [
  { username: 'Madhushi', email: 'madhushi@fishescape.io', password: 'swimmer2026' },
  { username: 'OceanHero', email: 'oceanhero@fishescape.io', password: 'ocean123' },
  { username: 'Admin', email: 'admin@fishescape.io', password: 'admin123' },
]

export const Login: React.FC = () => {
  const navigate = useNavigate()
  const { login } = useGame()

  // Tab State: 'login' | 'register'
  const [isRegisterMode, setIsRegisterMode] = useState<boolean>(false)

  // Form Fields - Pre-filled with Hardcoded Account for Instant 1-Click Access
  const [username, setUsername] = useState<string>('Madhushi')
  const [password, setPassword] = useState<string>('swimmer2026')
  const [email, setEmail] = useState<string>('madhushi@fishescape.io')
  const [confirmPassword, setConfirmPassword] = useState<string>('swimmer2026')

  // UI helpers
  const [showPassword, setShowPassword] = useState<boolean>(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(false)

  // Handle Login Submit
  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMessage(null)
    setSuccessMessage(null)

    const trimmedUser = username.trim()
    const trimmedPass = password.trim()

    if (!trimmedUser) {
      setErrorMessage('Please enter your username or email.')
      soundService.playLose()
      return
    }

    if (!trimmedPass) {
      setErrorMessage('Please enter your password.')
      soundService.playLose()
      return
    }

    setIsLoading(true)
    soundService.playClick()

    // Simulate authentication check against hardcoded accounts
    setTimeout(() => {
      // Find hardcoded match or allow custom player username
      const matched = HARDCODED_CREDENTIALS.find(
        (acc) =>
          acc.username.toLowerCase() === trimmedUser.toLowerCase() ||
          acc.email.toLowerCase() === trimmedUser.toLowerCase()
      )

      const finalPlayerName = matched ? matched.username : trimmedUser

      soundService.playVictory()
      setSuccessMessage(`Welcome back, ${finalPlayerName}! Diving in...`)
      login(finalPlayerName)

      setTimeout(() => {
        navigate('/dashboard')
      }, 500)
    }, 400)
  }

  // Handle Register Submit
  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMessage(null)

    const trimmedUser = username.trim()
    const trimmedEmail = email.trim()
    const trimmedPass = password.trim()

    if (!trimmedUser || !trimmedEmail || !trimmedPass) {
      setErrorMessage('Please fill in all fields.')
      soundService.playLose()
      return
    }

    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match.')
      soundService.playLose()
      return
    }

    setIsLoading(true)
    soundService.playClick()

    setTimeout(() => {
      soundService.playVictory()
      setSuccessMessage(`Account created for ${trimmedUser}! Logging in...`)
      login(trimmedUser)

      setTimeout(() => {
        navigate('/dashboard')
      }, 500)
    }, 500)
  }

  return (
    <div
      className="min-h-screen w-full relative flex flex-col items-center justify-center p-3 sm:p-6 bg-cover bg-center bg-no-repeat overflow-hidden select-none"
      style={{
        backgroundImage: "url('/ocean-bg.jpg')",
        backgroundColor: '#034475',
      }}
    >
      {/* ========================================================================= */}
      {/* 1. UNDERWATER BACKGROUND EFFECTS (Rays, Bubbles, Lighting)                */}
      {/* ========================================================================= */}
      {/* Soft Vignette / Oceanic Lighting Depth Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0284c7]/20 via-transparent to-[#011a33]/50 pointer-events-none" />

      {/* Sunbeams & Surface Water Caustics at top */}
      <div
        className="absolute inset-x-0 top-0 h-96 opacity-40 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse at 50% -10%, rgba(255,255,255,0.7) 0%, rgba(125,211,252,0.3) 40%, transparent 80%)',
        }}
      />

      {/* Ambient Rising Bubbles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {Array.from({ length: 24 }).map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full border border-white/45 bg-white/20 animate-float-bubble backdrop-blur-[0.5px]"
            style={{
              width: `${10 + (i % 5) * 8}px`,
              height: `${10 + (i % 5) * 8}px`,
              left: `${(i * 19) % 96}%`,
              animationDuration: `${7 + (i % 4) * 2.5}s`,
              animationDelay: `${(i * 1.1) % 6}s`,
            }}
          />
        ))}
      </div>

      {/* Swimming Clownfish Ambient Decor in Water */}
      <div className="absolute top-[22%] left-4 sm:left-14 opacity-85 pointer-events-none animate-bob">
        <img
          src="/game-assets/fish-clownfish.png"
          alt="Clownfish"
          className="w-14 h-12 object-contain filter drop-shadow-md"
          onError={(e) => {
            ;(e.currentTarget as HTMLImageElement).src = '/game-assets/fish.svg'
          }}
        />
      </div>
      <div
        className="absolute top-[32%] right-4 sm:right-16 opacity-85 pointer-events-none animate-bob"
        style={{ animationDelay: '1.4s' }}
      >
        <img
          src="/game-assets/fish-clownfish.png"
          alt="Clownfish"
          className="w-16 h-14 object-contain -scale-x-100 filter drop-shadow-md"
          onError={(e) => {
            ;(e.currentTarget as HTMLImageElement).src = '/game-assets/fish.svg'
          }}
        />
      </div>

      {/* ========================================================================= */}
      {/* 2. MAIN LOGIN CONTAINER (Logo, Mascot Swimmer, White Card)                */}
      {/* ========================================================================= */}
      <div className="relative z-10 w-full max-w-sm sm:max-w-md flex flex-col items-center">
        {/* Top 3D Game Logo ("Swimming · Dive · Collect · Survive ·") */}
        <div className="flex justify-center -mb-2">
          <img
            src="/game-assets/logo.svg"
            alt="Swimming – Dive, Collect & Survive"
            className="w-72 sm:w-84 object-contain drop-shadow-[0_12px_24px_rgba(2,26,54,0.6)] animate-bob"
          />
        </div>

        {/* 3D Swimmer Boy Mascot - Crystal Clear Ultra High-Definition */}
        <div className="relative z-10 -mt-2 -mb-4 flex justify-center items-center">
          {/* Subtle Water Glow behind swimmer */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <span
              className="w-24 h-24 rounded-full bg-cyan-300/30 blur-lg animate-pulse"
              style={{ animationDuration: '2s' }}
            />
          </div>

          <img
            src="/game-assets/swimmer-avatar.png"
            alt="3D Swimmer Boy"
            className="w-28 h-28 sm:w-36 sm:h-36 object-contain filter drop-shadow-[0_12px_24px_rgba(0,0,0,0.5)] animate-bob select-none pointer-events-none"
          />
        </div>

        {/* ========================================================================= */}
        {/* 3. EXACT FIGMA WHITE LOGIN CARD                                           */}
        {/* ========================================================================= */}
        <div className="w-full bg-white rounded-[32px] p-6 sm:p-8 shadow-[0_22px_60px_rgba(2,38,70,0.55)] border-2 border-white/90 relative">
          {/* Top Segmented Tab Switcher: [ Login | Register ] */}
          <div className="bg-[#f1f5f9] p-1.5 rounded-2xl flex items-center mb-5 border border-slate-200/80 shadow-inner">
            <button
              type="button"
              onClick={() => {
                soundService.playClick()
                setIsRegisterMode(false)
                setErrorMessage(null)
              }}
              className={`flex-1 py-2.5 rounded-xl font-extrabold text-sm sm:text-base tracking-wide transition-all cursor-pointer ${
                !isRegisterMode
                  ? 'bg-[#1d6eed] text-white shadow-md shadow-blue-500/30'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Login
            </button>
            <button
              type="button"
              onClick={() => {
                soundService.playClick()
                setIsRegisterMode(true)
                setErrorMessage(null)
              }}
              className={`flex-1 py-2.5 rounded-xl font-extrabold text-sm sm:text-base tracking-wide transition-all cursor-pointer ${
                isRegisterMode
                  ? 'bg-[#1d6eed] text-white shadow-md shadow-blue-500/30'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Register
            </button>
          </div>

          {/* Error & Success Feedback Alerts */}
          {errorMessage && (
            <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs sm:text-sm font-bold flex items-center gap-2 animate-shake">
              <AlertCircle size={16} className="shrink-0 text-rose-600" />
              <span>{errorMessage}</span>
            </div>
          )}

          {successMessage && (
            <div className="mb-4 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs sm:text-sm font-bold flex items-center gap-2">
              <CheckCircle2 size={16} className="shrink-0 text-emerald-600" />
              <span>{successMessage}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={isRegisterMode ? handleRegisterSubmit : handleLoginSubmit}>
            {/* Field 1: Username / Email */}
            <div className="relative mb-3.5">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                <User size={18} />
              </div>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Username or Email"
                className="w-full bg-white border border-slate-200 focus:border-[#1d6eed] focus:ring-2 focus:ring-blue-100 rounded-2xl py-3.5 pl-11 pr-4 text-slate-800 placeholder:text-slate-400 font-semibold text-sm outline-none transition-all shadow-sm"
                autoComplete="username"
              />
            </div>

            {/* Field 2 (Register Mode Only): Email */}
            {isRegisterMode && (
              <div className="relative mb-3.5 animate-fade-in">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                  <Mail size={18} />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email Address"
                  className="w-full bg-white border border-slate-200 focus:border-[#1d6eed] focus:ring-2 focus:ring-blue-100 rounded-2xl py-3.5 pl-11 pr-4 text-slate-800 placeholder:text-slate-400 font-semibold text-sm outline-none transition-all shadow-sm"
                  autoComplete="email"
                />
              </div>
            )}

            {/* Field 3: Password */}
            <div className="relative mb-4">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                <Lock size={18} />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                className="w-full bg-white border border-slate-200 focus:border-[#1d6eed] focus:ring-2 focus:ring-blue-100 rounded-2xl py-3.5 pl-11 pr-11 text-slate-800 placeholder:text-slate-400 font-semibold text-sm outline-none transition-all shadow-sm"
                autoComplete={isRegisterMode ? 'new-password' : 'current-password'}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer p-1"
                title={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            {/* Field 4 (Register Mode Only): Confirm Password */}
            {isRegisterMode && (
              <div className="relative mb-4 animate-fade-in">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                  <Lock size={18} />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm Password"
                  className="w-full bg-white border border-slate-200 focus:border-[#1d6eed] focus:ring-2 focus:ring-blue-100 rounded-2xl py-3.5 pl-11 pr-4 text-slate-800 placeholder:text-slate-400 font-semibold text-sm outline-none transition-all shadow-sm"
                  autoComplete="new-password"
                />
              </div>
            )}

            {/* Big Royal Blue Submit Button (Matching Figma Button) */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-[#1d6eed] to-[#0284c7] hover:from-[#185bc7] hover:to-[#0369a1] active:scale-98 text-white font-black text-base shadow-lg shadow-blue-500/30 transition-all cursor-pointer flex items-center justify-center gap-2 mt-2"
            >
              {isLoading ? (
                <span className="inline-block w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <span>{isRegisterMode ? 'Register' : 'Login'}</span>
              )}
            </button>
          </form>

          {/* Footer Link: "Don't have an account? Register" */}
          <div className="text-center text-xs font-semibold text-slate-500 mt-4">
            {!isRegisterMode ? (
              <span>
                Don't have an account?{' '}
                <button
                  type="button"
                  onClick={() => {
                    soundService.playClick()
                    setIsRegisterMode(true)
                  }}
                  className="text-[#1d6eed] font-extrabold hover:underline cursor-pointer"
                >
                  Register
                </button>
              </span>
            ) : (
              <span>
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={() => {
                    soundService.playClick()
                    setIsRegisterMode(false)
                  }}
                  className="text-[#1d6eed] font-extrabold hover:underline cursor-pointer"
                >
                  Login
                </button>
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login
