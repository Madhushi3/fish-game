import React, { useEffect, useRef } from 'react'
import type { EnvironmentConfig } from './EnvironmentManager'

export interface OceanWavesCanvasProps {
  currentEnv: EnvironmentConfig
  swimmerLane?: number // 0, 1, 2
  speedMultiplier: number
}

export const OceanWavesCanvas: React.FC<OceanWavesCanvasProps> = ({
  currentEnv,
  speedMultiplier,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animRef = useRef<number | null>(null)
  const causticsImgRef = useRef<HTMLImageElement | null>(null)

  const isDeep = currentEnv.id === 'deep_ocean'
  const isPirate = currentEnv.id === 'sunken_treasure_zone'

  // Preload caustics texture
  useEffect(() => {
    const img = new Image()
    img.src = '/game-assets/crystal-pool-caustics.jpg'
    img.onload = () => {
      causticsImgRef.current = img
    }
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let width = (canvas.width = canvas.parentElement?.clientWidth || 800)
    let height = (canvas.height = canvas.parentElement?.clientHeight || 600)

    const handleResize = () => {
      if (!canvas) return
      width = canvas.width = canvas.parentElement?.clientWidth || 800
      height = canvas.height = canvas.parentElement?.clientHeight || 600
    }
    window.addEventListener('resize', handleResize)

    let time = 0

    const render = () => {
      ctx.clearRect(0, 0, width, height)

      const dt = 0.016
      const flowSpeed = (speedMultiplier || 1) * 55
      time += dt

      // ── 1. CRYSTAL TURQUOISE WATER CAUSTICS (Reference Image Matching) ──
      const img = causticsImgRef.current
      if (img && img.complete && img.naturalWidth > 0) {
        ctx.save()

        // Layer A: Primary scrolling caustic light net
        const patternA = ctx.createPattern(img, 'repeat')
        if (patternA) {
          const offsetY = (time * flowSpeed * 0.8) % img.naturalHeight
          const offsetX = Math.sin(time * 0.6) * 12

          ctx.save()
          ctx.translate(offsetX, offsetY)
          ctx.fillStyle = patternA
          ctx.globalAlpha = isDeep ? 0.58 : isPirate ? 0.32 : 0.62
          if (!isPirate) {
            ctx.globalCompositeOperation = 'screen'
          }
          ctx.fillRect(-offsetX, -offsetY, width, height + img.naturalHeight)
          ctx.restore()
        }

        // Layer B: Shifting secondary refraction caustic net (creates liquid shimmer)
        const patternB = ctx.createPattern(img, 'repeat')
        if (patternB) {
          const offsetY2 = (time * flowSpeed * 1.15) % img.naturalHeight
          const offsetX2 = Math.cos(time * 0.8) * 18

          ctx.save()
          ctx.translate(offsetX2, offsetY2)
          ctx.scale(1.22, 1.22)
          ctx.fillStyle = patternB
          ctx.globalAlpha = isDeep ? 0.38 : isPirate ? 0.24 : 0.42
          ctx.globalCompositeOperation = 'screen'
          ctx.fillRect(-offsetX2, -offsetY2, width * 0.85, (height + img.naturalHeight) * 0.85)
          ctx.restore()
        }

        ctx.restore()
      }

      animRef.current = requestAnimationFrame(render)
    }

    render()

    return () => {
      window.removeEventListener('resize', handleResize)
      if (animRef.current) cancelAnimationFrame(animRef.current)
    }
  }, [isDeep, isPirate, speedMultiplier])

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none z-[6]"
      style={{ opacity: 0.95 }}
    />
  )
}

export default OceanWavesCanvas
