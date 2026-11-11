import React, { createContext, useContext, useState, useEffect } from 'react'
import soundService from '../services/soundService'
import leaderboardService from '../services/leaderboardService'
import confetti from 'canvas-confetti'

export interface GameHistoryEntry {
  id: string
  date: string
  score: number
  fishes: number
  treasures: number
  result: 'Won' | 'Ended'
}

export interface GameContextType {
  // Player Profile (Figma: Madhushi)
  playerName: string
  playerTitle: string
  playerAvatar: string
  isLoggedIn: boolean
  totalFish: number
  totalTreasures: number
  highestScore: number
  recentGames: GameHistoryEntry[]

  // Settings
  soundEnabled: boolean
  toggleSound: () => void

  // Auth & Profile
  login: (name: string) => void
  logout: () => void
  register: (name: string) => void
  updateProfile: (newName: string, newTitle?: string, newAvatar?: string) => void

  // Game Recording
  recordGameResult: (score: number, fishes: number, treasures: number, result: 'Won' | 'Ended') => void
  triggerCelebration: () => void
}

const STORAGE_KEY = 'swimming_game_state_v3'

const INITIAL_GAMES: GameHistoryEntry[] = [
  { id: 'g1', date: 'Nov 8, 2026', score: 850, fishes: 5, treasures: 3, result: 'Won' },
  { id: 'g2', date: 'Nov 7, 2026', score: 620, fishes: 4, treasures: 2, result: 'Won' },
  { id: 'g3', date: 'Nov 6, 2026', score: 510, fishes: 3, treasures: 1, result: 'Won' },
]

const GameContext = createContext<GameContextType | undefined>(undefined)

export const GameProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [playerName, setPlayerName] = useState<string>(() => {
    const saved = localStorage.getItem(STORAGE_KEY)
    return saved ? JSON.parse(saved).playerName : 'Madhushi'
  })

  const [playerTitle, setPlayerTitle] = useState<string>(() => {
    const saved = localStorage.getItem(STORAGE_KEY)
    return saved && JSON.parse(saved).playerTitle ? JSON.parse(saved).playerTitle : '⭐ Pro Swimmer'
  })

  const [playerAvatar, setPlayerAvatar] = useState<string>(() => {
    const saved = localStorage.getItem(STORAGE_KEY)
    return saved && JSON.parse(saved).playerAvatar ? JSON.parse(saved).playerAvatar : '/game-assets/swimmer-avatar.png'
  })

  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => {
    // Game starts on Login screen initially as requested
    const sessionActive = sessionStorage.getItem('swimming_active_session')
    return sessionActive === 'true'
  })

  const [totalFish, setTotalFish] = useState<number>(() => {
    const saved = localStorage.getItem(STORAGE_KEY)
    return saved ? JSON.parse(saved).totalFish ?? 248 : 248
  })

  const [totalTreasures, setTotalTreasures] = useState<number>(() => {
    const saved = localStorage.getItem(STORAGE_KEY)
    return saved ? JSON.parse(saved).totalTreasures ?? 72 : 72
  })

  const [highestScore, setHighestScore] = useState<number>(() => {
    const saved = localStorage.getItem(STORAGE_KEY)
    return saved ? JSON.parse(saved).highestScore ?? 1250 : 1250
  })

  const [recentGames, setRecentGames] = useState<GameHistoryEntry[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY)
    return saved ? JSON.parse(saved).recentGames ?? INITIAL_GAMES : INITIAL_GAMES
  })

  const [soundEnabled, setSoundEnabled] = useState<boolean>(true)

  // Save state whenever relevant fields update
  useEffect(() => {
    const stateToSave = {
      playerName,
      playerTitle,
      playerAvatar,
      isLoggedIn,
      totalFish,
      totalTreasures,
      highestScore,
      recentGames,
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(stateToSave))
  }, [playerName, playerTitle, playerAvatar, isLoggedIn, totalFish, totalTreasures, highestScore, recentGames])

  const toggleSound = () => {
    setSoundEnabled(prev => !prev)
  }

  const updateProfile = (newName: string, newTitle?: string, newAvatar?: string) => {
    const finalName = newName.trim() || 'Madhushi'
    setPlayerName(finalName)
    if (newTitle) setPlayerTitle(newTitle)
    if (newAvatar) setPlayerAvatar(newAvatar)
  }

  const login = (name: string) => {
    const finalName = name.trim() || 'Madhushi'
    setPlayerName(finalName)
    setIsLoggedIn(true)
    sessionStorage.setItem('swimming_active_session', 'true')
    soundService.playFanfare()
  }

  const register = (name: string) => {
    login(name)
  }

  const logout = () => {
    setIsLoggedIn(false)
    sessionStorage.removeItem('swimming_active_session')
    soundService.playClick()
  }

  const recordGameResult = (score: number, fishes: number, treasures: number, result: 'Won' | 'Ended') => {
    setTotalFish(prev => prev + fishes)
    setTotalTreasures(prev => prev + treasures)
    setHighestScore(prev => Math.max(prev, score))

    const newEntry: GameHistoryEntry = {
      id: 'game_' + Date.now(),
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      score,
      fishes,
      treasures,
      result,
    }

    setRecentGames(prev => [newEntry, ...prev].slice(0, 10))

    // Update leaderboard
    leaderboardService.submitScore(playerName, Math.max(highestScore, score))
  }

  const triggerCelebration = () => {
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
    })
  }

  return (
    <GameContext.Provider
      value={{
        playerName,
        playerTitle,
        playerAvatar,
        isLoggedIn,
        totalFish,
        totalTreasures,
        highestScore,
        recentGames,
        soundEnabled,
        toggleSound,
        login,
        logout,
        register,
        updateProfile,
        recordGameResult,
        triggerCelebration,
      }}
    >
      {children}
    </GameContext.Provider>
  )
}

export const useGame = (): GameContextType => {
  const context = useContext(GameContext)
  if (!context) {
    throw new Error('useGame must be used within a GameProvider')
  }
  return context
}

export default GameContext
