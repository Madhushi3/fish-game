import React from 'react'

export type FishSpecies = 'clownfish' | 'blue_tang' | 'angelfish' | 'lanternfish' | 'golden_snapper'

interface FishProps {
  species?: FishSpecies
  size?: number
  isCollected?: boolean
  className?: string
}

export const Fish: React.FC<FishProps> = React.memo(({
  species = 'clownfish',
  size = 58,
  isCollected = false,
  className = '',
}) => {
  // Determine image source and filter based on species
  const getFishAsset = () => {
    switch (species) {
      case 'blue_tang':
        return {
          src: '/game-assets/fish-blue-tang.png',
          alt: '3D Blue Tang',
          filter: 'drop-shadow-[0_4px_8px_rgba(0,0,0,0.35)]',
        }
      case 'angelfish':
        return {
          src: '/game-assets/fish-tropical-green.png',
          alt: '3D Tropical Green Fish',
          filter: 'drop-shadow-[0_4px_8px_rgba(0,0,0,0.35)]',
        }
      case 'lanternfish':
        return {
          src: '/game-assets/fish-blue-tang.png',
          alt: '3D Bioluminescent Fish',
          filter: 'drop-shadow-[0_0_16px_rgba(56,189,248,0.95)] brightness(1.15)',
        }
      case 'golden_snapper':
        return {
          src: '/game-assets/fish-clownfish.png',
          alt: '3D Golden Snapper',
          filter: 'drop-shadow-[0_0_14px_rgba(250,204,21,0.9)] hue-rotate(20deg) brightness(1.1)',
        }
      case 'clownfish':
      default:
        return {
          src: '/game-assets/fish-clownfish.png',
          alt: '3D Clownfish',
          filter: 'drop-shadow-[0_4px_8px_rgba(0,0,0,0.35)]',
        }
    }
  }

  const asset = getFishAsset()

  return (
    <div
      className={`relative inline-block select-none pointer-events-none transition-all duration-300 ${
        isCollected ? 'scale-150 opacity-0' : 'opacity-100'
      } ${className}`}
      style={{ width: `${size}px`, height: `${(size * 0.75).toFixed(0)}px` }}
    >
      <div className="relative w-full h-full animate-bob">
        <img
          src={asset.src}
          alt={asset.alt}
          className={`w-full h-full object-contain ${asset.filter} animate-tail-wag`}
          onError={(e) => {
            ;(e.currentTarget as HTMLImageElement).src = '/game-assets/fish-clownfish.png'
          }}
        />
      </div>
    </div>
  )
})

export default Fish
