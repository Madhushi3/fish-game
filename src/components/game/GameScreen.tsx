import React, { useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import GameEngine from './GameEngine'
import type { EnvironmentConfig } from './EnvironmentManager'

export const GameScreen: React.FC = () => {
  const navigate = useNavigate()
  const [bgImage, setBgImage] = useState<string>('/ocean-bg.jpg')

  const handleEnvironmentChange = useCallback((env: EnvironmentConfig) => {
    if (env.id === 'deep_ocean') {
      setBgImage('/game-assets/arctic-snow-bg.jpg')
    } else if (env.id === 'sunken_treasure_zone') {
      setBgImage('/game-assets/sunken-treasure-bg.jpg')
    } else {
      setBgImage('/ocean-bg.jpg')
    }
  }, [])

  return (
    <div
      className="min-h-screen w-full bg-cover bg-center bg-no-repeat p-1 sm:p-3 flex flex-col justify-center items-center overflow-x-hidden relative transition-all duration-700"
      style={{
        backgroundImage: `url('${bgImage}')`,
        backgroundColor: '#0284c7',
      }}
    >
      {/* Soft atmospheric overlay */}
      <div className="absolute inset-0 bg-sky-950/25 backdrop-blur-[1px] pointer-events-none" />
      <div className="relative z-10 w-full flex justify-center">
        <GameEngine
          onMainMenu={() => navigate('/dashboard')}
          onLeaderboard={() => navigate('/leaderboard')}
          onEnvironmentChange={handleEnvironmentChange}
        />
      </div>
    </div>
  )
}

export default GameScreen

