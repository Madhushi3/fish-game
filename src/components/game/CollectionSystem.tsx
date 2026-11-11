import React from 'react'

export interface FloatingNotification {
  id: string
  x: string // CSS left e.g. '50%'
  y: number // percentage
  text: string
  color: string
}

export interface CatchSplash {
  id: string
  x: string // CSS left e.g. '50%'
  y: number // percentage
  color: string
}

interface CollectionSystemProps {
  notifications: FloatingNotification[]
  splashes?: CatchSplash[]
}

export const CollectionSystem: React.FC<CollectionSystemProps> = ({
  notifications,
  splashes = [],
}) => {
  return (
    <div className="absolute inset-0 pointer-events-none z-30 overflow-hidden select-none">
      {/* ── EXPANDING WATER CATCH RIPPLES ── */}
      {splashes.map((splash) => (
        <div
          key={splash.id}
          className="absolute -translate-x-1/2 -translate-y-1/2 pointer-events-none flex items-center justify-center"
          style={{
            left: splash.x,
            top: `${splash.y}%`,
          }}
        >
          {/* Outer Ripple Wave */}
          <div
            className="w-16 h-16 rounded-full border-2 animate-ping"
            style={{ borderColor: splash.color, opacity: 0.85 }}
          />
          {/* Inner Splash Core */}
          <div
            className="absolute w-8 h-8 rounded-full blur-[2px] animate-pulse"
            style={{ backgroundColor: splash.color, opacity: 0.6 }}
          />
          {/* Catch Sparkles */}
          <span className="absolute text-xl animate-bounce">✨</span>
        </div>
      ))}

      {/* ── FLOATING SCORE NOTIFICATIONS ── */}
      {notifications.map((notif) => (
        <div
          key={notif.id}
          className="absolute -translate-x-1/2 -translate-y-1/2 animate-float-score select-none font-black text-base sm:text-xl font-mono drop-shadow-[0_2px_8px_rgba(0,0,0,0.85)] z-40"
          style={{
            left: notif.x,
            top: `${notif.y}%`,
            color: notif.color,
          }}
        >
          {notif.text}
        </div>
      ))}
    </div>
  )
}

export default CollectionSystem
