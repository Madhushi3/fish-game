import React from 'react'
import GameOverModal from './GameOverModal'

interface GameOverScreenProps {
  isOpen: boolean
  score: number
  fishes: number
  treasures: number
  onPlayAgain: () => void
  onMainMenu: () => void
}

export const GameOverScreen: React.FC<GameOverScreenProps> = (props) => {
  return <GameOverModal {...props} />
}

export default GameOverScreen

