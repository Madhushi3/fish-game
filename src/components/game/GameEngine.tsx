import React, { useState, useEffect, useRef, useCallback } from 'react'
import soundService from '../../services/soundService'
import { useGame } from '../../context/GameContext'
import {
  getRandomEnvironment,
  type EnvironmentConfig,
  type EnvironmentId,
  type FishDefinition,
  type TreasureDefinition,
  type ObstacleDefinition,
} from './EnvironmentManager'
import Player from './Player'
import Fish from './Fish'
import Treasure from './Treasure'
import GameHUD from './GameHUD'
import CollectionSystem, { type FloatingNotification, type CatchSplash } from './CollectionSystem'
import GamePausedModal from './GamePausedModal'
import GameOverScreen from './GameOverScreen'
import RoundWinModal from './RoundWinModal'
import FishPuzzleModal from './FishPuzzleModal'
import GameIntroModal from './GameIntroModal'
import OceanWavesCanvas from './OceanWavesCanvas'
import announcerService from '../../services/announcerService'
import { fetchFishPuzzle, type FishPuzzleData } from '../../services/fishApiService'

// ─────────────────────────────────────────────────────────────────────────────
// POOL STAGE CSS HELPERS – Returns inline style objects for each environment
// ─────────────────────────────────────────────────────────────────────────────

function getPoolStyle(env: EnvironmentConfig): React.CSSProperties {
  const floorTextures: Record<EnvironmentId, string> = {
    swimming_pool: '/game-assets/pool-floor-3d.jpg',
    tropical_coral_reef: '/game-assets/pool-floor-3d.jpg',
    deep_ocean: '/game-assets/arctic-floor-3d.jpg',
    sunken_treasure_zone: '/game-assets/pirate-floor-3d.jpg',
  }

  // Atmospheric water depth gradients layered smoothly above the 3D tank floor beds
  const gradients: Record<EnvironmentId, string> = {
    swimming_pool:
      'radial-gradient(ellipse at 50% 20%, rgba(94, 234, 212, 0.42) 0%, rgba(56, 189, 248, 0.52) 25%, rgba(2, 132, 199, 0.72) 60%, rgba(3, 105, 161, 0.88) 100%)',
    tropical_coral_reef:
      'radial-gradient(ellipse at 50% 20%, rgba(103, 232, 249, 0.42) 0%, rgba(6, 182, 212, 0.52) 35%, rgba(8, 145, 178, 0.72) 70%, rgba(14, 116, 144, 0.88) 100%)',
    deep_ocean:
      'radial-gradient(ellipse at 50% 20%, rgba(224, 242, 254, 0.35) 0%, rgba(125, 211, 252, 0.45) 30%, rgba(2, 132, 199, 0.7) 70%, rgba(3, 105, 161, 0.88) 100%)',
    sunken_treasure_zone:
      'radial-gradient(ellipse at 50% 25%, rgba(45, 212, 191, 0.38) 0%, rgba(15, 118, 110, 0.58) 40%, rgba(17, 94, 89, 0.78) 75%, rgba(4, 47, 46, 0.92) 100%)',
  }

  const texture = floorTextures[env.id] ?? floorTextures.swimming_pool
  const gradient = gradients[env.id] ?? gradients.swimming_pool

  return {
    backgroundImage: `${gradient}, url('${texture}')`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
  }
}

function getWaterStyle(env: EnvironmentConfig): React.CSSProperties {
  if (env.id === 'swimming_pool') {
    return {
      backgroundImage:
        'radial-gradient(circle at 50% 30%, rgba(255,255,255,0.18) 0%, transparent 65%)',
    }
  }
  if (env.id === 'deep_ocean') {
    return {
      backgroundImage:
        'radial-gradient(circle at 50% 30%, rgba(224,242,254,0.3) 0%, transparent 70%)',
    }
  }
  if (env.id === 'sunken_treasure_zone') {
    return {
      backgroundImage:
        'radial-gradient(circle at 50% 35%, rgba(253,230,138,0.16) 0%, transparent 65%)',
    }
  }
  return {}
}

function getDeckStyle(env: EnvironmentConfig, side: 'left' | 'right'): React.CSSProperties {
  const isLeft = side === 'left'

  const deckTextures: Record<string, { img: string; border: string; shadow: string }> = {
    swimming_pool: {
      img: '/game-assets/pool-deck-3d.jpg',
      border: 'rgba(56, 189, 248, 0.85)',
      shadow: isLeft ? 'inset -6px 0 14px rgba(12, 74, 110, 0.45)' : 'inset 6px 0 14px rgba(12, 74, 110, 0.45)',
    },
    deep_ocean: {
      img: '/game-assets/arctic-ice-deck.jpg',
      border: 'rgba(186, 230, 253, 0.9)',
      shadow: isLeft ? 'inset -6px 0 14px rgba(3, 105, 161, 0.45)' : 'inset 6px 0 14px rgba(3, 105, 161, 0.45)',
    },
    sunken_treasure_zone: {
      img: '/game-assets/pirate-deck-texture.jpg',
      border: 'rgba(245, 158, 11, 0.75)',
      shadow: isLeft ? 'inset -6px 0 14px rgba(69, 26, 3, 0.65)' : 'inset 6px 0 14px rgba(69, 26, 3, 0.65)',
    },
  }

  const currentDeck = deckTextures[env.id] ?? deckTextures.swimming_pool

  return {
    backgroundImage: `url('${currentDeck.img}')`,
    backgroundSize: 'cover',
    backgroundPosition: isLeft ? 'left center' : 'right center',
    backgroundRepeat: 'no-repeat',
    borderRight: isLeft ? `2px solid ${currentDeck.border}` : undefined,
    borderLeft: !isLeft ? `2px solid ${currentDeck.border}` : undefined,
    boxShadow: `${currentDeck.shadow}, ${isLeft ? 'inset 2px 0 6px rgba(255, 255, 255, 0.35)' : 'inset -2px 0 6px rgba(255, 255, 255, 0.35)'}`,
  }
}

/** Vertical lane buoy rope – creative 3D themed floats matching each environment */
const LaneBuoyRope = React.memo<{ leftPercent: string; envId: EnvironmentId }>(({
  leftPercent,
  envId,
}) => {
  const isDeep = envId === 'deep_ocean'
  const isPirate = envId === 'sunken_treasure_zone'
  const count = 28

  // Theme-specific tension cable / nautical rigging rope
  const ropeStyle: React.CSSProperties = isPirate
    ? {
        width: '3.5px',
        background: 'repeating-linear-gradient(45deg, #78350f, #78350f 3px, #b45309 3px, #b45309 6px)',
        boxShadow: '0 0 5px rgba(69, 26, 3, 0.7)',
      }
    : isDeep
    ? {
        width: '3px',
        background: 'linear-gradient(to bottom, #ffffff, #bae6fd, #e0f2fe, #ffffff)',
        boxShadow: '0 0 8px rgba(186, 230, 253, 0.85)',
      }
    : {
        width: '3px',
        background: 'linear-gradient(to bottom, #dbeafe, #ffffff, #bfdbfe, #ffffff)',
        boxShadow: '0 0 6px rgba(56, 189, 248, 0.55)',
      }

  return (
    <div
      className="absolute inset-y-0 z-[8] flex flex-col items-center justify-between py-1 pointer-events-none select-none"
      style={{ left: leftPercent, transform: 'translateX(-50%)', width: '20px' }}
    >
      {/* 1. Underlying water shadow for 3D depth */}
      <div className="absolute inset-y-0 w-[8px] bg-sky-950/25 blur-[2px] rounded-full translate-y-1 pointer-events-none" />

      {/* 2. Central Tension Cable */}
      <div className="absolute inset-y-0 rounded-full z-[1]" style={ropeStyle} />

      {/* 3. Themed 3D Floats */}
      {Array.from({ length: count }).map((_, i) => {
        const isPatternA = i % 2 === 0

        if (isPirate) {
          // ── PIRATE / SUNKEN TREASURE: Handcrafted Teak Wood Float & Polished Pirate Gold Rings ──
          return isPatternA ? (
            // Teak Wood Barrel Float with Brass Reinforcement Bands
            <div
              key={i}
              className="relative z-[3] rounded-[4px] flex items-center justify-center my-[1px]"
              style={{
                width: '13px',
                height: '18px',
                background:
                  'linear-gradient(90deg, #451a03 0%, #92400e 30%, #d97706 55%, #78350f 85%, #451a03 100%)',
                boxShadow:
                  '0 2px 4px rgba(0,0,0,0.65), inset 0 1px 0 rgba(254, 243, 199, 0.4), inset 0 -1px 0 rgba(0, 0, 0, 0.5)',
                border: '1px solid rgba(120, 53, 15, 0.9)',
              }}
            >
              {/* Twin Brass Reinforcement Bands */}
              <div className="absolute inset-x-0 top-[3px] h-[1.5px] bg-gradient-to-r from-amber-600 via-yellow-300 to-amber-700 shadow-sm" />
              <div className="absolute inset-x-0 bottom-[3px] h-[1.5px] bg-gradient-to-r from-amber-600 via-yellow-300 to-amber-700 shadow-sm" />
              {/* Center Brass Rivet */}
              <div className="w-[3px] h-[3px] rounded-full bg-yellow-200 shadow-xs" />
            </div>
          ) : (
            // Polished Pirate Gold Nautical Float Bead
            <div
              key={i}
              className="relative z-[3] rounded-full flex items-center justify-center my-[1px]"
              style={{
                width: '11px',
                height: '11px',
                background:
                  'radial-gradient(circle at 35% 35%, #fef08a 0%, #facc15 45%, #ca8a04 80%, #713f12 100%)',
                boxShadow: '0 2px 5px rgba(0,0,0,0.55), 0 0 6px rgba(250, 204, 21, 0.65)',
                border: '1px solid rgba(254, 240, 138, 0.9)',
              }}
            >
              {/* Gleam */}
              <div className="w-[3px] h-[3px] rounded-full bg-white/90 -mt-1 -ml-1 blur-[0.3px]" />
            </div>
          )
        }

        if (isDeep) {
          // ── ARCTIC / GLACIER: Crystalline Ice Floats & Snow Pearl Beads ──
          return isPatternA ? (
            // Translucent Glacier Ice Crystal Capsule
            <div
              key={i}
              className="relative z-[3] rounded-[6px] flex items-center justify-center my-[1px]"
              style={{
                width: '12px',
                height: '18px',
                background:
                  'linear-gradient(90deg, #0284c7 0%, #38bdf8 30%, #e0f2fe 55%, #7dd3fc 80%, #0369a1 100%)',
                boxShadow:
                  '0 2px 5px rgba(2, 6, 23, 0.35), 0 0 8px rgba(56, 189, 248, 0.65)',
                border: '1px solid rgba(255, 255, 255, 0.9)',
              }}
            >
              <div className="absolute inset-y-[2px] left-[3px] w-[2px] bg-white/80 rounded-full blur-[0.4px]" />
              <div className="w-[4px] h-[1.5px] bg-white rounded-full shadow-sm" />
            </div>
          ) : (
            // Pure Frosted Snow Pearl
            <div
              key={i}
              className="relative z-[3] rounded-full flex items-center justify-center my-[1px]"
              style={{
                width: '10px',
                height: '10px',
                background:
                  'radial-gradient(circle at 35% 35%, #ffffff 0%, #f0f9ff 50%, #bae6fd 85%, #38bdf8 100%)',
                boxShadow: '0 2px 4px rgba(0,0,0,0.25), 0 0 6px rgba(224, 242, 254, 0.85)',
                border: '1px solid rgba(255, 255, 255, 1)',
              }}
            >
              <div className="w-[2.5px] h-[2.5px] rounded-full bg-white -mt-0.5 -ml-0.5" />
            </div>
          )
        }

        // ── SWIMMING POOL: Official Olympic Racing Wave-Dispersing Anti-Turbulent Buoy Floats ──
        return isPatternA ? (
          // Vibrant Racing Cyan Cylindrical Float
          <div
            key={i}
            className="relative z-[3] rounded-[5px] flex items-center justify-center my-[1px]"
            style={{
              width: '13px',
              height: '19px',
              background:
                'linear-gradient(90deg, #0369a1 0%, #0284c7 25%, #38bdf8 45%, #e0f2fe 60%, #0284c7 85%, #075985 100%)',
              boxShadow:
                '0 3px 5px rgba(12, 74, 110, 0.4), inset 0 1px 0 rgba(255,255,255,0.7), inset 0 -1px 0 rgba(3, 105, 161, 0.6)',
              border: '1px solid rgba(224, 242, 254, 0.85)',
            }}
          >
            <div className="absolute inset-x-0 h-[2px] bg-sky-950/40 border-y border-white/60" />
            <div className="absolute inset-y-[2px] left-[3px] w-[2px] bg-white/70 rounded-full" />
          </div>
        ) : (
          // Glossy Olympic White Cylindrical Float
          <div
            key={i}
            className="relative z-[3] rounded-[5px] flex items-center justify-center my-[1px]"
            style={{
              width: '13px',
              height: '19px',
              background:
                'linear-gradient(90deg, #94a3b8 0%, #e2e8f0 25%, #ffffff 50%, #f8fafc 75%, #cbd5e1 100%)',
              boxShadow:
                '0 3px 5px rgba(15, 23, 42, 0.3), inset 0 1px 0 rgba(255,255,255,0.9), inset 0 -1px 0 rgba(148, 163, 184, 0.5)',
              border: '1px solid rgba(255, 255, 255, 0.95)',
            }}
          >
            <div className="absolute inset-x-0 h-[2px] bg-slate-400/40 border-y border-white" />
            <div className="absolute inset-y-[2px] left-[3px] w-[2px] bg-white rounded-full" />
          </div>
        )
      })}
    </div>
  )
})

interface ActiveEntity {
  id: string
  lane: number // 0, 1, 2
  y: number // percentage
  kind: 'fish' | 'treasure' | 'obstacle'
  fishDef?: FishDefinition
  treasureDef?: TreasureDefinition
  obstacleDef?: ObstacleDefinition
  collected?: boolean
  width: number
  height: number
}

interface GameEngineProps {
  onMainMenu: () => void
  onLeaderboard: () => void
  onEnvironmentChange?: (env: EnvironmentConfig) => void
}

export const GameEngine: React.FC<GameEngineProps> = ({ onMainMenu, onLeaderboard, onEnvironmentChange }) => {
  const { recordGameResult, triggerCelebration } = useGame()

  // 1. RANDOM ENVIRONMENT: Picked from the 3 unique environments
  const [currentEnv, setCurrentEnv] = useState<EnvironmentConfig>(() => getRandomEnvironment())

  // 2. CORE GAMEPLAY STATES
  const [lane, setLane] = useState<number>(1) // Center lane default
  const [score, setScore] = useState<number>(0)
  const [fishesCollected, setFishesCollected] = useState<number>(0)
  const [treasuresCollected, setTreasuresCollected] = useState<number>(0)
  const [targetFish, setTargetFish] = useState<number>(5)
  const [targetTreasures, setTargetTreasures] = useState<number>(2)
  const [roundNumber, setRoundNumber] = useState<number>(1)
  const [gameTime, setGameTime] = useState<number>(0)
  const [roundTimeRemaining, setRoundTimeRemaining] = useState<number>(45)
  const [lives, setLives] = useState<number>(3)
  const [speedMultiplier, setSpeedMultiplier] = useState<number>(1.0)

  // Statuses
  const [isPaused, setIsPaused] = useState<boolean>(false)
  const [isGameOver, setIsGameOver] = useState<boolean>(false)
  const [isRoundWinOpen, setIsRoundWinOpen] = useState<boolean>(false)
  const [ghostModeSeconds, setGhostModeSeconds] = useState<number>(0)

  // Game Intro / Tutorial Modal
  const [isIntroOpen, setIsIntroOpen] = useState<boolean>(() => {
    try {
      return localStorage.getItem('fish_game_hide_intro') !== 'true'
    } catch {
      return true
    }
  })
  const isIntroOpenRef = useRef<boolean>(isIntroOpen)
  useEffect(() => {
    isIntroOpenRef.current = isIntroOpen
  }, [isIntroOpen])

  // 3. FISH MATH PUZZLE API STATES
  const [isPuzzleModalOpen, setIsPuzzleModalOpen] = useState<boolean>(true)
  const [puzzleData, setPuzzleData] = useState<FishPuzzleData | null>(null)
  const [isPuzzleLoading, setIsPuzzleLoading] = useState<boolean>(false)

  // Entities, Splashes & Notifications
  const [entities, setEntities] = useState<ActiveEntity[]>([])
  const [notifications, setNotifications] = useState<FloatingNotification[]>([])
  const [splashes, setSplashes] = useState<CatchSplash[]>([])

  // State Refs for 60fps loop
  const onEnvironmentChangeRef = useRef(onEnvironmentChange)
  useEffect(() => {
    onEnvironmentChangeRef.current = onEnvironmentChange
  }, [onEnvironmentChange])

  const laneRef = useRef<number>(lane)
  const ghostModeRef = useRef<number>(ghostModeSeconds)
  const isGameOverRef = useRef<boolean>(false)
  const isPausedRef = useRef<boolean>(false)
  const isRoundWinOpenRef = useRef<boolean>(false)
  const isPuzzleOpenRef = useRef<boolean>(true)
  const roundNumberRef = useRef<number>(roundNumber)
  const speedRef = useRef<number>(speedMultiplier)
  const currentEnvRef = useRef<EnvironmentConfig>(currentEnv)
  const lastSpawnRef = useRef<number>(0)
  const livesRef = useRef<number>(3)
  const collectedIdsRef = useRef<Set<string>>(new Set())
  const entitiesRef = useRef<ActiveEntity[]>([])
  const scoreRef = useRef<number>(0)
  const fishesCollectedRef = useRef<number>(0)
  const treasuresCollectedRef = useRef<number>(0)
  const targetFishRef = useRef<number>(targetFish)
  const targetTreasuresRef = useRef<number>(targetTreasures)

  // Keep refs in sync
  useEffect(() => {
    laneRef.current = lane
    ghostModeRef.current = ghostModeSeconds
    isGameOverRef.current = isGameOver
    isPausedRef.current = isPaused
    isRoundWinOpenRef.current = isRoundWinOpen
    isPuzzleOpenRef.current = isPuzzleModalOpen
    roundNumberRef.current = roundNumber
    speedRef.current = speedMultiplier
    currentEnvRef.current = currentEnv
    livesRef.current = lives
    scoreRef.current = score
    fishesCollectedRef.current = fishesCollected
    treasuresCollectedRef.current = treasuresCollected
    targetFishRef.current = targetFish
    targetTreasuresRef.current = targetTreasures
  }, [
    lane,
    ghostModeSeconds,
    isGameOver,
    isPaused,
    isRoundWinOpen,
    isPuzzleModalOpen,
    roundNumber,
    speedMultiplier,
    currentEnv,
    lives,
    score,
    fishesCollected,
    treasuresCollected,
    targetFish,
    targetTreasures,
  ])

  // 4. API FETCH FUNCTION
  const loadNewPuzzle = useCallback(async () => {
    setIsPuzzleLoading(true)
    setIsPuzzleModalOpen(true)
    collectedIdsRef.current.clear()
    setEntities([]) // Clear floating entities while solving puzzle

    // Select random environment from the 3 unique environments
    const nextEnv = getRandomEnvironment(currentEnvRef.current?.id)
    setCurrentEnv(nextEnv)
    currentEnvRef.current = nextEnv
    onEnvironmentChangeRef.current?.(nextEnv)

    try {
      const data = await fetchFishPuzzle()
      setPuzzleData(data)
    } catch (err) {
      console.error('Failed to load puzzle:', err)
    } finally {
      setIsPuzzleLoading(false)
    }
  }, [])

  // Initial Puzzle Load on Game Start
  useEffect(() => {
    loadNewPuzzle()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // 5. SOLVE PUZZLE HANDLER
  const handlePuzzleSolved = (fishCount: number, chestCount: number) => {
    const validChests = Math.max(1, chestCount)
    setTargetFish(fishCount)
    setTargetTreasures(validChests)
    targetFishRef.current = fishCount
    targetTreasuresRef.current = validChests
    fishesCollectedRef.current = 0
    treasuresCollectedRef.current = 0
    setFishesCollected(0)
    setTreasuresCollected(0)
    setRoundTimeRemaining(45)
    collectedIdsRef.current.clear()
    entitiesRef.current = []
    setEntities([])
    setIsPuzzleModalOpen(false)
    setIsPaused(false)
    soundService.playFanfare()
    announcerService.announcePuzzleCleared()
  }

  // Handle timeout on puzzle modal
  const handlePuzzleTimeout = useCallback(() => {
    soundService.playIncorrect()
    const nextLives = livesRef.current - 1
    setLives(nextLives)

    if (nextLives <= 0) {
      setIsGameOver(true)
      isGameOverRef.current = true
      recordGameResult(score, fishesCollected, treasuresCollected, 'Ended')
    } else {
      loadNewPuzzle()
    }
  }, [score, fishesCollected, treasuresCollected, recordGameResult, loadNewPuzzle])

  // 6. TIMER TICK (Game time & Round countdown & Ghost mode)
  useEffect(() => {
    if (isPaused || isGameOver || isPuzzleModalOpen) return

    const timer = setInterval(() => {
      setGameTime((t) => t + 1)
      setGhostModeSeconds((s) => (s > 0 ? s - 1 : 0))

      setRoundTimeRemaining((prevTime) => {
        if (prevTime <= 1) {
          // Time's up for this round! Player loses 1 life
          soundService.playIncorrect()
          const nextLives = livesRef.current - 1
          setLives(nextLives)

          if (nextLives <= 0) {
            setIsGameOver(true)
            recordGameResult(score, fishesCollected, treasuresCollected, 'Ended')
            return 0
          } else {
            loadNewPuzzle()
            return 45
          }
        }
        return prevTime - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [isPaused, isGameOver, isPuzzleModalOpen, score, fishesCollected, treasuresCollected, recordGameResult, loadNewPuzzle])

  // Movement Handlers
  const moveLeft = useCallback(() => {
    if (isPausedRef.current || isGameOverRef.current || isPuzzleOpenRef.current) return
    setLane((l) => {
      if (l > 0) {
        soundService.playClick()
        return l - 1
      }
      return l
    })
  }, [])

  const moveRight = useCallback(() => {
    if (isPausedRef.current || isGameOverRef.current || isPuzzleOpenRef.current) return
    setLane((l) => {
      if (l < 2) {
        soundService.playClick()
        return l + 1
      }
      return l
    })
  }, [])

  // Keyboard Controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isIntroOpenRef.current || isPuzzleOpenRef.current || isRoundWinOpenRef.current) return // Disable swimming keys while intro/puzzle/win modal is open
      if (e.code === 'ArrowLeft' || e.code === 'KeyA') {
        e.preventDefault()
        moveLeft()
      } else if (e.code === 'ArrowRight' || e.code === 'KeyD') {
        e.preventDefault()
        moveRight()
      } else if (e.code === 'Space') {
        e.preventDefault()
        setIsPaused((p) => !p)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [moveLeft, moveRight])

  // Spawn Generator with Progressive Difficulty Scaling
  const spawnItem = useCallback((timestamp: number) => {
    const round = roundNumberRef.current || 1
    // Progressive interval: spawns slightly more frequently in higher rounds
    const baseInterval = Math.max(700, 1320 - (round - 1) * 110)
    const interval = Math.max(480, baseInterval / speedRef.current)

    if (timestamp - lastSpawnRef.current < interval) return
    lastSpawnRef.current = timestamp

    const env = currentEnvRef.current

    const prev = entitiesRef.current
    // Pick a lane that doesn't already have an item right at the top (y < 22%)
    const occupiedLanes = new Set(
      prev.filter((e) => e.y < 22).map((e) => e.lane)
    )
    const availableLanes = [0, 1, 2].filter((l) => !occupiedLanes.has(l))
    const spawnLane =
      availableLanes.length > 0
        ? availableLanes[Math.floor(Math.random() * availableLanes.length)]
        : Math.floor(Math.random() * 3)

    // Progressive Obstacle Scaling:
    // Round 1: ~20% obstacles
    // Round 2: ~26% obstacles
    // Round 3: ~32% obstacles
    // Round 4: ~38% obstacles
    // Round 5+: ~44% max
    const obstacleChance = Math.min(0.44, 0.20 + (round - 1) * 0.06)
    const goodItemPool = 1.0 - obstacleChance

    const needChests = treasuresCollectedRef.current < targetTreasuresRef.current
    const needFish = fishesCollectedRef.current < targetFishRef.current

    let fishChance = goodItemPool * 0.68
    let treasureChance = goodItemPool * 0.32

    if (!needFish && needChests) {
      fishChance = goodItemPool * 0.20
      treasureChance = goodItemPool * 0.80
    } else if (!needChests && needFish) {
      fishChance = goodItemPool * 0.80
      treasureChance = goodItemPool * 0.20
    }

    const roll = Math.random()
    let newItem: ActiveEntity | null = null

    if (roll < fishChance && env.fishes.length > 0) {
      const fishDef = env.fishes[Math.floor(Math.random() * env.fishes.length)]
      newItem = {
        id: `fish_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
        lane: spawnLane,
        y: -12,
        kind: 'fish',
        fishDef,
        width: 58,
        height: 44,
      }
    } else if (roll < (fishChance + treasureChance) && env.treasures.length > 0) {
      // Ghost Potion is a rare drop (~12% chance when potion is in the pool)
      const normalTreasures = env.treasures.filter((t) => t.type !== 'magic_potion')
      const potionTreasures = env.treasures.filter((t) => t.type === 'magic_potion')
      const isRarePotionRoll = Math.random() < 0.12

      let treasureDef: TreasureDefinition
      if (isRarePotionRoll && potionTreasures.length > 0) {
        treasureDef = potionTreasures[Math.floor(Math.random() * potionTreasures.length)]
      } else if (normalTreasures.length > 0) {
        treasureDef = normalTreasures[Math.floor(Math.random() * normalTreasures.length)]
      } else {
        treasureDef = env.treasures[Math.floor(Math.random() * env.treasures.length)]
      }

      newItem = {
        id: `treasure_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
        lane: spawnLane,
        y: -12,
        kind: 'treasure',
        treasureDef,
        width: 62,
        height: 62,
      }
    } else if (env.obstacles.length > 0) {
      const obstacleDef = env.obstacles[Math.floor(Math.random() * env.obstacles.length)]
      newItem = {
        id: `obs_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
        lane: spawnLane,
        y: -12,
        kind: 'obstacle',
        obstacleDef,
        width: obstacleDef.width,
        height: obstacleDef.height,
      }
    }

    if (newItem) {
      const updated = [...prev, newItem]
      entitiesRef.current = updated
      setEntities(updated)
    }
  }, [])

  // Floating score notification helper
  const addNotification = (text: string, color: string, laneIdx: number) => {
    const laneLefts = ['23.3%', '50%', '76.7%']
    const id = `notif_${Date.now()}_${Math.random()}`
    setNotifications((prev) => [
      ...prev,
      {
        id,
        text,
        color,
        x: laneLefts[laneIdx],
        y: 68,
      },
    ])
    setTimeout(() => {
      setNotifications((prev) => prev.filter((n) => n.id !== id))
    }, 950)
  }

  // Water catch ripple & splash effect helper
  const addSplash = useCallback((laneIdx: number, y: number, color: string) => {
    const laneLefts = ['23.3%', '50%', '76.7%']
    const id = `splash_${Date.now()}_${Math.random()}`
    setSplashes((prev) => [
      ...prev,
      {
        id,
        x: laneLefts[laneIdx],
        y,
        color,
      },
    ])
    setTimeout(() => {
      setSplashes((prev) => prev.filter((s) => s.id !== id))
    }, 600)
  }, [])

  // 7. Check Progress when Target Fish AND Target Treasures are BOTH collected
  const checkProgress = useCallback(
    (currentFishes: number, currentTreasures: number) => {
      const requiredFish = targetFishRef.current
      const requiredTreasures = targetTreasuresRef.current

      // The round is ONLY complete when BOTH fish AND treasure boxes are collected!
      if (currentFishes >= requiredFish && currentTreasures >= requiredTreasures) {
        soundService.playFanfare()
        triggerCelebration()

        const roundBonus = 500
        setScore((s) => s + roundBonus)
        scoreRef.current += roundBonus

        // Pause animation and open Round Win celebration modal
        setIsPaused(true)
        isPausedRef.current = true
        setIsRoundWinOpen(true)
        isRoundWinOpenRef.current = true
      }
    },
    [triggerCelebration]
  )

  // Handle Next Round after Round Win modal
  const handleNextRound = useCallback(() => {
    setIsRoundWinOpen(false)
    isRoundWinOpenRef.current = false

    const nextRound = roundNumberRef.current + 1
    setRoundNumber(nextRound)
    roundNumberRef.current = nextRound

    // Scale swim speed progressively (+15% each round)
    const nextSpeed = Math.min(2.4, 1.0 + (nextRound - 1) * 0.15)
    setSpeedMultiplier(nextSpeed)
    speedRef.current = nextSpeed

    // Reset lane & clear existing entities
    setLane(1)
    laneRef.current = 1
    entitiesRef.current = []
    setEntities([])
    collectedIdsRef.current.clear()

    // Rotate to a fresh new environment for next round!
    const newEnv = getRandomEnvironment(currentEnvRef.current.id)
    setCurrentEnv(newEnv)
    if (onEnvironmentChangeRef.current) {
      onEnvironmentChangeRef.current(newEnv)
    }

    // Load next puzzle from API!
    loadNewPuzzle()
  }, [loadNewPuzzle])

  // 8. 60 FPS Optimized Animation Frame Loop
  useEffect(() => {
    const tracker = { lastTime: performance.now(), animId: 0 }

    const step = (timestamp: number) => {
      if (
        !isPausedRef.current &&
        !isGameOverRef.current &&
        !isPuzzleOpenRef.current &&
        !isRoundWinOpenRef.current
      ) {
        const rawDelta = (timestamp - tracker.lastTime) / 1000
        const delta = Math.min(rawDelta, 0.035) // Clamp to avoid stutter/jumps
        tracker.lastTime = timestamp

        spawnItem(timestamp)

        let hitObstacle = false
        const newlyCollectedFish: FishDefinition[] = []
        const newlyCollectedTreasures: TreasureDefinition[] = []
        const swimmerLane = laneRef.current
        const isGhost = ghostModeRef.current > 0

        // Synchronously calculate next entity positions and collisions
        const prevList = entitiesRef.current
        const updated: ActiveEntity[] = []

        for (const ent of prevList) {
          if (collectedIdsRef.current.has(ent.id)) {
            continue
          }

          const speed = 42 * speedRef.current
          const nextY = ent.y + speed * delta

          // Swimmer full catch/hit zone: 55% to 85%
          const inCollisionWindow = nextY >= 55 && nextY <= 85
          const isSameLane = ent.lane === swimmerLane

          if (inCollisionWindow && isSameLane) {
            collectedIdsRef.current.add(ent.id)
            if (ent.kind === 'fish' && ent.fishDef) {
              newlyCollectedFish.push(ent.fishDef)
            } else if (ent.kind === 'treasure' && ent.treasureDef) {
              newlyCollectedTreasures.push(ent.treasureDef)
            } else if (ent.kind === 'obstacle' && ent.obstacleDef) {
              if (isGhost) {
                addNotification(`👻 PHASED!`, '#67e8f9', swimmerLane)
              } else {
                hitObstacle = true
              }
            }
            continue
          }

          if (nextY <= 105) {
            updated.push({ ...ent, y: nextY })
          }
        }

        entitiesRef.current = updated
        setEntities(updated)

        // Process audio & state updates outside setEntities for optimal performance
        if (newlyCollectedFish.length > 0) {
          for (const fishDef of newlyCollectedFish) {
            soundService.playBubble()
            addSplash(swimmerLane, 60, '#38bdf8')
            setScore((s) => s + fishDef.points)
            addNotification(`+${fishDef.points} ${fishDef.name}`, '#fef08a', swimmerLane)

            fishesCollectedRef.current += 1
            const updatedFishes = fishesCollectedRef.current
            const currentTreasures = treasuresCollectedRef.current
            setFishesCollected(updatedFishes)
            checkProgress(updatedFishes, currentTreasures)
          }
        }

        if (newlyCollectedTreasures.length > 0) {
          for (const treasureDef of newlyCollectedTreasures) {
            soundService.playCoin()
            addSplash(swimmerLane, 60, '#facc15')
            setScore((s) => s + treasureDef.points)

            if (treasureDef.grantsGhostMode || treasureDef.type === 'magic_potion') {
              setGhostModeSeconds(5)
              addNotification(`+${treasureDef.points} 👻 GHOST 5s!`, '#c084fc', swimmerLane)
            } else {
              addNotification(`+${treasureDef.points} 💎 TREASURE!`, '#67e8f9', swimmerLane)
            }

            treasuresCollectedRef.current += 1
            const updatedTreasures = treasuresCollectedRef.current
            const currentFishes = fishesCollectedRef.current
            setTreasuresCollected(updatedTreasures)
            checkProgress(currentFishes, updatedTreasures)
          }
        }

        if (hitObstacle) {
          soundService.playIncorrect()
          const nextLives = livesRef.current - 1
          setLives(nextLives)

          if (nextLives <= 0) {
            setIsGameOver(true)
            isGameOverRef.current = true
            recordGameResult(
              scoreRef.current,
              fishesCollectedRef.current,
              treasuresCollectedRef.current,
              fishesCollectedRef.current >= targetFishRef.current ? 'Won' : 'Ended'
            )
          } else {
            // Temporary 2s invulnerability after collision so player isn't hit repeatedly
            setGhostModeSeconds(2)
          }
        }
      } else {
        tracker.lastTime = timestamp
      }

      tracker.animId = requestAnimationFrame(step)
    }

    tracker.animId = requestAnimationFrame(step)
    return () => cancelAnimationFrame(tracker.animId)
  }, [spawnItem, checkProgress, addSplash, recordGameResult])

  // Restart Handler
  const handleRestart = () => {
    const newEnv = getRandomEnvironment()
    setCurrentEnv(newEnv)
    if (onEnvironmentChange) {
      onEnvironmentChange(newEnv)
    }
    collectedIdsRef.current.clear()
    fishesCollectedRef.current = 0
    treasuresCollectedRef.current = 0
    entitiesRef.current = []
    setEntities([])
    setNotifications([])
    setScore(0)
    setFishesCollected(0)
    setTreasuresCollected(0)
    setGameTime(0)
    setRoundTimeRemaining(45)
    setLives(3)
    setRoundNumber(1)
    roundNumberRef.current = 1
    setLane(1)
    laneRef.current = 1
    setSpeedMultiplier(1.0)
    speedRef.current = 1.0
    setGhostModeSeconds(0)
    setIsGameOver(false)
    isGameOverRef.current = false
    setIsRoundWinOpen(false)
    isRoundWinOpenRef.current = false
    setIsPaused(false)
    isPausedRef.current = false
    soundService.playClick()
    loadNewPuzzle()
  }

  // Get lane percentage for entity (3 equal lanes in 10%–90% stage)
  const getLaneLeft = (l: number) => {
    if (l === 0) return '23.3%'
    if (l === 1) return '50%'
    return '76.7%'
  }

  const getPoolBorderClass = (envId: EnvironmentId) => {
    if (envId === 'deep_ocean') return 'border-cyan-200/95 shadow-[0_0_35px_rgba(186,230,253,0.6)]'
    if (envId === 'sunken_treasure_zone') return 'border-amber-400/90 shadow-[0_0_35px_rgba(245,158,11,0.45)]'
    return 'border-cyan-300/90 shadow-[0_0_35px_rgba(56,189,248,0.35)]'
  }

  return (
    <div className="w-full flex flex-col items-center select-none py-1 sm:py-2 px-1 sm:px-2 mx-auto z-10" style={{ maxWidth: '1100px' }}>

      {/* ── LEFT HUD CARD + POOL STAGE SIDE-BY-SIDE ROW ── */}
      <div className="flex flex-row items-start gap-4 w-full">

        {/* ── LEFT-SIDE COMPACT HUD CARD ── */}
        <div className="flex-shrink-0">
          <GameHUD
            fishesCollected={fishesCollected}
            targetFish={targetFish}
            treasuresCollected={treasuresCollected}
            targetTreasures={targetTreasures}
            gameTime={gameTime}
            roundTimeRemaining={roundTimeRemaining}
            lives={lives}
            ghostModeSeconds={ghostModeSeconds}
            onPause={() => setIsPaused(true)}
          />
        </div>

        {/* ========================================================================= */}
        {/* MAIN 3D OVERHEAD 3-LANE SWIMMING STAGE                                     */}
        {/* ========================================================================= */}
        <div
          className={`relative flex-1 h-[560px] sm:h-[660px] rounded-[36px] overflow-hidden border-4 select-none transition-all duration-500 ${getPoolBorderClass(currentEnv.id)}`}
          style={getPoolStyle(currentEnv)}
        >
          {/* Dynamic Procedural Ocean Waves & Swimmer Wake Physics */}
          <OceanWavesCanvas
            currentEnv={currentEnv}
            swimmerLane={lane}
            speedMultiplier={speedMultiplier}
          />

          {/* ── LEFT ENVIRONMENT DECK / RIBBON ───────────────────────── */}
          <div
            className="absolute inset-y-0 left-0 z-10 pointer-events-none transition-all duration-500"
            style={{ width: '10%', ...getDeckStyle(currentEnv, 'left') }}
          />

          {/* ── RIGHT ENVIRONMENT DECK / RIBBON (Symmetrically Mirrored) ─ */}
          <div
            className="absolute inset-y-0 right-0 z-10 pointer-events-none transition-all duration-500"
            style={{ width: '10%', ...getDeckStyle(currentEnv, 'right'), transform: 'scaleX(-1)' }}
          />

          {/* ── WATER AREA (between decks) ───────────────────────────── */}
          <div
            className="absolute inset-y-0 pointer-events-none"
            style={{ left: '10%', right: '10%', ...getWaterStyle(currentEnv) }}
          />

          {/* ── LANE BUOY ROPES (Symmetrical 3 Equal Lanes) ───────── */}
          <LaneBuoyRope leftPercent="36.7%" envId={currentEnv.id} />
          <LaneBuoyRope leftPercent="63.3%" envId={currentEnv.id} />

          {/* ── AMBIENT RISING BUBBLES ───────────────────────────────── */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden z-[5]">
            {Array.from({ length: 14 }).map((_, i) => (
              <div
                key={i}
                className="absolute rounded-full border border-white/50 bg-white/20 animate-float-bubble backdrop-blur-[1px]"
                style={{
                  width: `${8 + (i % 4) * 5}px`,
                  height: `${8 + (i % 4) * 5}px`,
                  left: `${12 + ((i * 23) % 76)}%`,
                  animationDuration: `${7 + (i % 3) * 2.5}s`,
                  animationDelay: `${(i * 1.3) % 5}s`,
                }}
              />
            ))}
          </div>

          {/* ========================================================================= */}
          {/* ENTITIES TRACK (Fish, Treasures, Obstacles)                               */}
          {/* ========================================================================= */}
          <div className="absolute inset-0 pointer-events-none z-[25]">
            {entities.map((ent) => (
              <div
                key={ent.id}
                className="absolute"
                style={{
                  left: getLaneLeft(ent.lane),
                  top: `${ent.y}%`,
                  transform: 'translate3d(-50%, -50%, 0)',
                  willChange: 'top',
                }}
              >
                {/* Fish: 100% 3D Rendered Graphics */}
                {ent.kind === 'fish' && ent.fishDef && (
                  <Fish species={ent.fishDef.species} size={58} isCollected={ent.collected} />
                )}

                {/* Treasure: 3D Chest with Sunburst Rays or 3D Ghost Potion */}
                {ent.kind === 'treasure' && ent.treasureDef && (
                  <Treasure type={ent.treasureDef.type} size={62} isCollected={ent.collected} />
                )}

                {/* Obstacles: 3D Slate Stone, 3D Floating Bark Log, 3D Aquatic Seaweed */}
                {ent.kind === 'obstacle' && ent.obstacleDef && (
                  <div className="relative">
                    {ent.obstacleDef.type === 'ship_log' && (
                      <img
                        src="/game-assets/log.svg"
                        alt="3D Floating Bark Log"
                        className="w-28 h-14 sm:w-32 sm:h-16 object-contain drop-shadow-md"
                      />
                    )}
                    {ent.obstacleDef.type === 'reef_rock' && (
                      <img
                        src="/game-assets/rock-3d.png"
                        alt="3D Reef Rock Boulder"
                        className="w-18 h-16 sm:w-22 sm:h-20 object-contain filter drop-shadow-[0_10px_20px_rgba(2,29,56,0.65)] select-none pointer-events-none"
                        onError={(e) => {
                          ;(e.currentTarget as HTMLImageElement).src = '/game-assets/rock.svg'
                        }}
                      />
                    )}
                    {ent.obstacleDef.type === 'abyss_rock' && (
                      <img
                        src="/game-assets/rock-3d.png"
                        alt="3D Abyss Rock Boulder"
                        className="w-18 h-16 sm:w-22 sm:h-20 object-contain filter hue-rotate-180 brightness-90 drop-shadow-[0_10px_20px_rgba(2,29,56,0.65)] select-none pointer-events-none"
                        onError={(e) => {
                          ;(e.currentTarget as HTMLImageElement).src = '/game-assets/rock.svg'
                        }}
                      />
                    )}
                    {ent.obstacleDef.type === 'seaweed' && (
                      <img
                        src="/game-assets/seaweed-3d.png"
                        alt="3D Aquatic Seaweed"
                        className="w-16 h-20 sm:w-20 sm:h-24 object-contain filter drop-shadow-[0_8px_16px_rgba(2,29,56,0.55)] animate-sway select-none pointer-events-none"
                        onError={(e) => {
                          ;(e.currentTarget as HTMLImageElement).src = '/game-assets/seaweed.svg'
                        }}
                      />
                    )}
                    {ent.obstacleDef.type === 'deep_mine' && (
                      <div className="relative w-18 h-18 sm:w-20 sm:h-20 flex items-center justify-center">
                        {/* Red danger pulsing ring */}
                        <div className="absolute inset-1 rounded-full bg-red-600/35 blur-md animate-ping" />
                        <img
                          src="/game-assets/naval-mine-3d.png"
                          alt="3D Naval Sea Mine Bomb"
                          className="w-full h-full object-contain filter drop-shadow-[0_10px_22px_rgba(220,38,38,0.75)] animate-pulse select-none pointer-events-none"
                        />
                      </div>
                    )}
                    {ent.obstacleDef.type === 'spiky_urchin' && (
                      <div className="relative w-16 h-16 sm:w-18 sm:h-18 flex items-center justify-center filter drop-shadow-[0_8px_16px_rgba(88,28,135,0.7)]">
                        <svg viewBox="0 0 100 100" className="w-full h-full animate-spin" style={{ animationDuration: '16s' }}>
                          <defs>
                            <radialGradient id="urchinGlow" cx="50%" cy="50%" r="50%">
                              <stop offset="0%" stopColor="#a855f7" />
                              <stop offset="60%" stopColor="#3b0764" />
                              <stop offset="100%" stopColor="#1e1b4b" />
                            </radialGradient>
                          </defs>
                          {Array.from({ length: 16 }).map((_, i) => (
                            <polygon
                              key={i}
                              points="50,4 47,48 53,48"
                              fill="#6b21a8"
                              stroke="#c084fc"
                              strokeWidth="1"
                              transform={`rotate(${i * 22.5} 50 50)`}
                            />
                          ))}
                          <circle cx="50" cy="50" r="22" fill="url(#urchinGlow)" stroke="#c084fc" strokeWidth="2" />
                          <circle cx="50" cy="50" r="7" fill="#f43f5e" className="animate-ping" />
                        </svg>
                      </div>
                    )}
                    {ent.obstacleDef.type === 'rusted_anchor' && (
                      <div className="relative w-16 h-16 sm:w-18 sm:h-18 flex items-center justify-center filter drop-shadow-[0_8px_16px_rgba(69,26,3,0.7)]">
                        <svg viewBox="0 0 100 100" className="w-full h-full">
                          <path
                            d="M50 16 A6 6 0 1 0 50 28 A6 6 0 1 0 50 16 M50 28 L50 82 M34 40 L66 40 M20 62 C24 82 76 82 80 62 L86 64 C81 90 19 90 14 64 Z"
                            fill="#78350f"
                            stroke="#451a03"
                            strokeWidth="3.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* ========================================================================= */}
          {/* SWIMMER CHARACTER (Clean Legs, Unbroken)                                    */}
          {/* ========================================================================= */}
          <Player lane={lane} isGhostMode={ghostModeSeconds > 0} />

          {/* Floating Scores & Catch Splash Ripple Effect */}
          <CollectionSystem notifications={notifications} splashes={splashes} />
        </div>

      </div>{/* end flex-row */}

      {/* ========================================================================= */}
      {/* 4. MODALS (Controls Intro, Fish Math Puzzle, Game Paused, Game Over)       */}
      {/* ========================================================================= */}
      <GameIntroModal
        isOpen={isIntroOpen}
        onClose={() => setIsIntroOpen(false)}
      />

      <FishPuzzleModal
        isOpen={isPuzzleModalOpen && !isIntroOpen}
        puzzle={puzzleData}
        isLoading={isPuzzleLoading}
        roundNumber={roundNumber}
        lives={lives}
        onSolveCorrect={handlePuzzleSolved}
        onTimeOut={handlePuzzleTimeout}
      />

      <GamePausedModal
        isOpen={isPaused && !isPuzzleModalOpen && !isRoundWinOpen}
        onResume={() => setIsPaused(false)}
        onRestart={handleRestart}
        onMainMenu={onMainMenu}
        onLeaderboard={onLeaderboard}
      />

      <RoundWinModal
        isOpen={isRoundWinOpen}
        roundNumber={roundNumber}
        score={score}
        roundBonus={500}
        fishesCollected={fishesCollected}
        targetFish={targetFish}
        treasuresCollected={treasuresCollected}
        targetTreasures={targetTreasures}
        nextSpeedMultiplier={Math.min(2.4, 1.0 + roundNumber * 0.15)}
        onNextRound={handleNextRound}
        onMainMenu={onMainMenu}
      />

      <GameOverScreen
        isOpen={isGameOver}
        score={score}
        fishes={fishesCollected}
        treasures={treasuresCollected}
        onPlayAgain={handleRestart}
        onMainMenu={onMainMenu}
      />
    </div>
  )
}

export default GameEngine
