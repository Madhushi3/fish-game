/**
 * Sound Service - Synthesizes game audio effects using the Web Audio API.
 * High-cohesion audio utility that works without requiring external audio assets.
 */

class SoundService {
  private audioCtx: AudioContext | null = null
  private soundEnabled: boolean = true
  private musicEnabled: boolean = true

  constructor() {
    // Lazily initialized on first user interaction to satisfy browser autoplay policies
  }

  private getContext(): AudioContext | null {
    if (!this.audioCtx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
      if (AudioCtx) {
        this.audioCtx = new AudioCtx()
      }
    }
    if (this.audioCtx && this.audioCtx.state === 'suspended') {
      this.audioCtx.resume()
    }
    return this.audioCtx
  }

  public setSoundEnabled(enabled: boolean) {
    this.soundEnabled = enabled
  }

  public setMusicEnabled(enabled: boolean) {
    this.musicEnabled = enabled
  }

  public isSoundEnabled() {
    return this.soundEnabled
  }

  public isMusicEnabled() {
    return this.musicEnabled
  }

  /** Plays a light, crisp underwater bubble sound */
  public playBubble() {
    if (!this.soundEnabled) return
    const ctx = this.getContext()
    if (!ctx) return

    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    const now = ctx.currentTime

    osc.type = 'sine'
    osc.frequency.setValueAtTime(320, now)
    osc.frequency.exponentialRampToValueAtTime(750, now + 0.12)

    gain.gain.setValueAtTime(0.2, now)
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12)

    osc.connect(gain)
    gain.connect(ctx.destination)

    osc.start(now)
    osc.stop(now + 0.12)
  }

  /** Plays a shiny double-chime coin collect sound */
  public playCoin() {
    if (!this.soundEnabled) return
    const ctx = this.getContext()
    if (!ctx) return

    const now = ctx.currentTime
    const notes = [987.77, 1318.51] // B5 to E6
    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      const start = now + idx * 0.08

      osc.type = 'triangle'
      osc.frequency.setValueAtTime(freq, start)

      gain.gain.setValueAtTime(0.25, start)
      gain.gain.exponentialRampToValueAtTime(0.001, start + 0.18)

      osc.connect(gain)
      gain.connect(ctx.destination)

      osc.start(start)
      osc.stop(start + 0.18)
    })
  }

  /** Plays an uplifting major chord chime for correct answers */
  public playCorrect() {
    if (!this.soundEnabled) return
    const ctx = this.getContext()
    if (!ctx) return

    const now = ctx.currentTime
    const chord = [523.25, 659.25, 783.99, 1046.5] // C5, E5, G5, C6
    chord.forEach((freq, idx) => {
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      const start = now + idx * 0.06

      osc.type = 'sine'
      osc.frequency.setValueAtTime(freq, start)

      gain.gain.setValueAtTime(0.2, start)
      gain.gain.exponentialRampToValueAtTime(0.001, start + 0.35)

      osc.connect(gain)
      gain.connect(ctx.destination)

      osc.start(start)
      osc.stop(start + 0.35)
    })
  }

  /** Plays a low friendly warning buzz for incorrect attempts */
  public playIncorrect() {
    if (!this.soundEnabled) return
    const ctx = this.getContext()
    if (!ctx) return

    const now = ctx.currentTime
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()

    osc.type = 'sawtooth'
    osc.frequency.setValueAtTime(220, now)
    osc.frequency.linearRampToValueAtTime(140, now + 0.25)

    gain.gain.setValueAtTime(0.25, now)
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25)

    osc.connect(gain)
    gain.connect(ctx.destination)

    osc.start(now)
    osc.stop(now + 0.25)
  }

  /** Plays a joyful game victory fanfare */
  public playFanfare() {
    if (!this.soundEnabled) return
    const ctx = this.getContext()
    if (!ctx) return

    const notes = [
      { f: 523.25, d: 0.15 },
      { f: 659.25, d: 0.15 },
      { f: 783.99, d: 0.15 },
      { f: 1046.5, d: 0.4 },
    ]
    let offset = 0
    const now = ctx.currentTime

    notes.forEach((note) => {
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      const start = now + offset

      osc.type = 'triangle'
      osc.frequency.setValueAtTime(note.f, start)

      gain.gain.setValueAtTime(0.25, start)
      gain.gain.exponentialRampToValueAtTime(0.001, start + note.d)

      osc.connect(gain)
      gain.connect(ctx.destination)

      osc.start(start)
      osc.stop(start + note.d)

      offset += note.d * 0.85
    })
  }

  /** Plays a gentle UI tap click */
  public playClick() {
    if (!this.soundEnabled) return
    const ctx = this.getContext()
    if (!ctx) return

    const now = ctx.currentTime
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()

    osc.type = 'sine'
    osc.frequency.setValueAtTime(600, now)
    osc.frequency.exponentialRampToValueAtTime(300, now + 0.05)

    gain.gain.setValueAtTime(0.15, now)
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05)

    osc.connect(gain)
    gain.connect(ctx.destination)

    osc.start(now)
    osc.stop(now + 0.05)
  }

  /** Plays a water splash sound for falling into the ocean */
  public playSplash() {
    if (!this.soundEnabled) return
    const ctx = this.getContext()
    if (!ctx) return

    const now = ctx.currentTime
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()

    osc.type = 'triangle'
    osc.frequency.setValueAtTime(180, now)
    osc.frequency.exponentialRampToValueAtTime(80, now + 0.35)

    gain.gain.setValueAtTime(0.35, now)
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35)

    osc.connect(gain)
    gain.connect(ctx.destination)

    osc.start(now)
    osc.stop(now + 0.35)
  }

  /** Plays an urgent shark chomp / attack sound */
  public playChomp() {
    if (!this.soundEnabled) return
    const ctx = this.getContext()
    if (!ctx) return

    const now = ctx.currentTime
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()

    osc.type = 'sawtooth'
    osc.frequency.setValueAtTime(260, now)
    osc.frequency.exponentialRampToValueAtTime(60, now + 0.18)

    gain.gain.setValueAtTime(0.4, now)
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.18)

    osc.connect(gain)
    gain.connect(ctx.destination)

    osc.start(now)
    osc.stop(now + 0.18)
  }

  /** Plays a magical mystery chest reward unlock sound */
  public playChestOpen() {
    if (!this.soundEnabled) return
    const ctx = this.getContext()
    if (!ctx) return

    const now = ctx.currentTime
    const notes = [523.25, 659.25, 783.99, 1046.5, 1318.51] // C5, E5, G5, C6, E6
    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      const start = now + idx * 0.06

      osc.type = 'triangle'
      osc.frequency.setValueAtTime(freq, start)

      gain.gain.setValueAtTime(0.25, start)
      gain.gain.exponentialRampToValueAtTime(0.001, start + 0.25)

      osc.connect(gain)
      gain.connect(ctx.destination)

      osc.start(start)
      osc.stop(start + 0.25)
    })
  }

  /** Plays game over / lose audio */
  public playLose() {
    this.playIncorrect()
  }

  /** Plays victory / power-up audio */
  public playVictory() {
    this.playChestOpen()
  }
}

export const soundService = new SoundService()
export default soundService

