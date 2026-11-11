import React, { useState, useRef } from 'react'
import { X, Check, User, Sparkles, Upload, Camera } from 'lucide-react'
import soundService from '../../services/soundService'

export interface EditProfileModalProps {
  isOpen: boolean
  currentName: string
  currentTitle?: string
  currentAvatar?: string
  onClose: () => void
  onSave: (newName: string, newTitle: string, newAvatar: string) => void
}

const PRESET_AVATARS = [
  { id: 'av_default', type: 'image', value: '/game-assets/swimmer-avatar.png', label: 'Classic' },
  { id: 'av_champ', type: 'image', value: '/game-assets/swimmer-champion-3d.png', label: 'Champion' },
  { id: 'av_girl', type: 'emoji', value: '🏊‍♀️', label: 'Speed Queen' },
  { id: 'av_diver', type: 'emoji', value: '🤿', label: 'Scuba Pro' },
  { id: 'av_dolphin', type: 'emoji', value: '🐬', label: 'Dolphin' },
  { id: 'av_pirate', type: 'emoji', value: '🏴‍☠️', label: 'Pirate' },
]

export const EditProfileModal: React.FC<EditProfileModalProps> = ({
  isOpen,
  currentName,
  currentTitle = '⭐ Pro Swimmer',
  currentAvatar = '/game-assets/swimmer-avatar.png',
  onClose,
  onSave,
}) => {
  const [name, setName] = useState(currentName)
  const [selectedAvatar, setSelectedAvatar] = useState(currentAvatar)
  const [customAvatar, setCustomAvatar] = useState<string | null>(() => {
    if (currentAvatar && currentAvatar.startsWith('data:image/')) {
      return currentAvatar
    }
    return null
  })
  const [error, setError] = useState<string | null>(null)
  const [isProcessingImage, setIsProcessingImage] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  if (!isOpen) return null

  // Compress and convert device image to safe lightweight Data URL (<50KB)
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith('image/')) {
      setError('Please upload an image file (PNG, JPG, WebP)')
      return
    }

    setIsProcessingImage(true)
    setError(null)

    const reader = new FileReader()
    reader.onload = (event) => {
      const result = event.target?.result as string
      if (!result) {
        setIsProcessingImage(false)
        return
      }

      const img = new Image()
      img.onload = () => {
        try {
          const canvas = document.createElement('canvas')
          const MAX_SIZE = 256
          let width = img.width
          let height = img.height

          if (width > height) {
            if (width > MAX_SIZE) {
              height = Math.round((height * MAX_SIZE) / width)
              width = MAX_SIZE
            }
          } else {
            if (height > MAX_SIZE) {
              width = Math.round((width * MAX_SIZE) / height)
              height = MAX_SIZE
            }
          }

          canvas.width = width
          canvas.height = height
          const ctx = canvas.getContext('2d')
          if (ctx) {
            ctx.drawImage(img, 0, 0, width, height)
            const compressed = canvas.toDataURL('image/jpeg', 0.85)
            setCustomAvatar(compressed)
            setSelectedAvatar(compressed)
            soundService.playFanfare()
          }
        } catch {
          setError('Failed to process image. Please try another one.')
        } finally {
          setIsProcessingImage(false)
        }
      }
      img.onerror = () => {
        setIsProcessingImage(false)
        setError('Could not load image. Please select another file.')
      }
      img.src = result
    }
    reader.onerror = () => {
      setIsProcessingImage(false)
      setError('Error reading file.')
    }
    reader.readAsDataURL(file)
  }

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()
    const trimmed = name.trim()
    if (!trimmed) {
      setError('Please enter a valid player name')
      return
    }
    if (trimmed.length < 2) {
      setError('Name must be at least 2 characters')
      return
    }
    soundService.playFanfare()
    onSave(trimmed, currentTitle, selectedAvatar)
    onClose()
  }

  const isCustomSelected = selectedAvatar === customAvatar && customAvatar !== null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/75 backdrop-blur-md animate-fade-in select-none">
      <div
        className="relative w-full max-w-md rounded-3xl p-5 sm:p-6 flex flex-col gap-5 text-white shadow-2xl border-2 border-cyan-400/60 overflow-hidden"
        style={{
          background: 'linear-gradient(165deg, rgba(3, 35, 70, 0.97) 0%, rgba(2, 20, 42, 0.99) 100%)',
          boxShadow: '0 25px 60px rgba(0, 0, 0, 0.8), 0 0 35px rgba(34, 211, 238, 0.25)',
        }}
      >
        {/* Ambient Glow */}
        <div className="absolute -top-16 -right-16 w-44 h-44 rounded-full bg-cyan-500/20 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-16 -left-16 w-44 h-44 rounded-full bg-blue-600/20 blur-3xl pointer-events-none" />

        {/* ── HEADER ── */}
        <div className="flex items-center justify-between border-b border-cyan-400/20 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center shadow-md border border-white/30">
              <User size={18} className="text-white" />
            </div>
            <div>
              <h2 className="text-lg font-black tracking-wide text-white">Edit Profile</h2>
              <p className="text-[11px] text-cyan-300 font-medium">Update player name or upload custom avatar</p>
            </div>
          </div>

          <button
            onClick={() => {
              soundService.playClick()
              onClose()
            }}
            className="w-8 h-8 rounded-full bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <X size={16} />
          </button>
        </div>

        <form onSubmit={handleSave} className="flex flex-col gap-4">
          {/* ── LIVE PREVIEW & UPLOAD TRIGGER ── */}
          <div className="flex items-center gap-4 p-3 rounded-2xl bg-sky-950/60 border border-cyan-500/30">
            <div
              onClick={() => fileInputRef.current?.click()}
              className="relative w-16 h-16 rounded-full bg-gradient-to-tr from-sky-400 to-cyan-200 border-2 border-white shadow-lg flex items-center justify-center overflow-hidden cursor-pointer group shrink-0"
              title="Click to upload image from device"
            >
              {selectedAvatar && (selectedAvatar.startsWith('/') || selectedAvatar.startsWith('data:') || selectedAvatar.startsWith('http')) ? (
                <img
                  src={selectedAvatar}
                  alt="Avatar Preview"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    ;(e.currentTarget as HTMLImageElement).src = '/game-assets/swimmer-avatar.png'
                  }}
                />
              ) : (
                <span className="text-3xl leading-none">{selectedAvatar}</span>
              )}
              {/* Overlay camera prompt */}
              <div className="absolute inset-0 bg-black/45 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                <Camera size={18} className="text-white drop-shadow" />
              </div>
            </div>

            <div className="flex-1 flex flex-col gap-1">
              <span className="text-xs font-black text-cyan-200 uppercase tracking-wide">Avatar Preview</span>
              <p className="text-[11px] text-slate-300">
                {isCustomSelected ? 'Custom image loaded from your device' : 'Select below or upload your own photo'}
              </p>

              {/* Upload Button */}
              <button
                type="button"
                onClick={() => {
                  soundService.playClick()
                  fileInputRef.current?.click()
                }}
                disabled={isProcessingImage}
                className="mt-1 w-fit px-3 py-1.5 rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white font-bold text-xs flex items-center gap-1.5 border border-white/40 shadow-sm active:scale-95 transition-all cursor-pointer"
              >
                <Upload size={12} />
                <span>{isProcessingImage ? 'Loading...' : 'Upload from Device'}</span>
              </button>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
              />
            </div>
          </div>

          {/* ── 1. PRESET AVATARS SELECTION ── */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-black text-cyan-300 uppercase tracking-wider flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Sparkles size={13} className="text-yellow-400" /> Presets & Avatars
              </span>
              {customAvatar && (
                <span className="text-[10px] text-cyan-300 font-medium">Custom Photo Available</span>
              )}
            </label>

            <div className="grid grid-cols-7 gap-2 pt-1">
              {/* Custom Upload Tile (if present) */}
              {customAvatar && (
                <button
                  type="button"
                  onClick={() => {
                    soundService.playClick()
                    setSelectedAvatar(customAvatar)
                  }}
                  className={`relative aspect-square rounded-2xl flex flex-col items-center justify-center p-0.5 transition-all cursor-pointer overflow-hidden ${
                    isCustomSelected
                      ? 'bg-gradient-to-tr from-sky-500 to-cyan-400 border-2 border-white shadow-lg scale-105'
                      : 'bg-slate-900/70 hover:bg-slate-800 border border-cyan-500/30'
                  }`}
                  title="Your Custom Upload"
                >
                  <img src={customAvatar} alt="Custom" className="w-full h-full object-cover rounded-xl" />
                  {isCustomSelected && (
                    <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 border border-white flex items-center justify-center z-10">
                      <Check size={10} className="text-white stroke-[3]" />
                    </div>
                  )}
                </button>
              )}

              {/* Preset Avatars */}
              {PRESET_AVATARS.map((av) => {
                const isSelected = selectedAvatar === av.value
                return (
                  <button
                    key={av.id}
                    type="button"
                    onClick={() => {
                      soundService.playClick()
                      setSelectedAvatar(av.value)
                    }}
                    className={`relative aspect-square rounded-2xl flex flex-col items-center justify-center p-1 transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-gradient-to-tr from-sky-500 to-cyan-400 border-2 border-white shadow-lg scale-105'
                        : 'bg-slate-900/70 hover:bg-slate-800 border border-cyan-500/30'
                    }`}
                    title={av.label}
                  >
                    {av.type === 'image' ? (
                      <img src={av.value} alt={av.label} className="w-9 h-9 object-contain" />
                    ) : (
                      <span className="text-2xl leading-none">{av.value}</span>
                    )}
                    {isSelected && (
                      <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 border border-white flex items-center justify-center">
                        <Check size={10} className="text-white stroke-[3]" />
                      </div>
                    )}
                  </button>
                )
              })}
            </div>
          </div>

          {/* ── 2. PLAYER NAME INPUT ── */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="playerNameInput" className="text-xs font-black text-cyan-300 uppercase tracking-wider flex items-center justify-between">
              <span>Player Name</span>
              <span className="text-[10px] text-slate-400 font-normal">{name.length}/18</span>
            </label>
            <input
              id="playerNameInput"
              type="text"
              value={name}
              maxLength={18}
              onChange={(e) => {
                setName(e.target.value)
                if (error) setError(null)
              }}
              placeholder="Enter your name"
              className="w-full px-4 py-2.5 rounded-xl bg-slate-900/90 border-2 border-cyan-400/40 focus:border-cyan-300 text-white font-bold text-sm outline-none transition-colors shadow-inner"
            />
            {error && <span className="text-xs text-rose-400 font-semibold">{error}</span>}
          </div>

          {/* ── FOOTER ACTIONS ── */}
          <div className="flex items-center gap-2.5 pt-2 border-t border-cyan-400/20">
            <button
              type="button"
              onClick={() => {
                soundService.playClick()
                onClose()
              }}
              className="flex-1 py-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 font-bold text-xs transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 py-2.5 rounded-xl font-black text-xs text-white tracking-wide cursor-pointer active:scale-95 transition-all shadow-md flex items-center justify-center gap-1.5"
              style={{
                background: 'linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%)',
                border: '1.5px solid rgba(255, 255, 255, 0.6)',
                boxShadow: '0 4px 15px rgba(14, 165, 233, 0.4)',
              }}
            >
              <Check size={14} />
              <span>Save Profile</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default EditProfileModal
