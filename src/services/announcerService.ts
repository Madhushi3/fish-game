class AnnouncerService {
  private enabled: boolean = true
  private lastSpokenTime: number = 0
  private minIntervalMs: number = 1800
  private selectedVoice: SpeechSynthesisVoice | null = null

  constructor() {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('fish_game_announcer_enabled')
      if (saved !== null) {
        this.enabled = saved === 'true'
      }
      this.initVoice()
    }
  }

  private initVoice() {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return

    const loadVoice = () => {
      const voices = window.speechSynthesis.getVoices()
      if (!voices.length) return
      const preferred = voices.find(
        (v) =>
          (v.name.includes('Natural') ||
            v.name.includes('Google') ||
            v.name.includes('Samantha') ||
            v.name.includes('Daniel') ||
            v.name.includes('Karen') ||
            v.lang.startsWith('en')) &&
          !v.name.includes('Bad')
      )
      this.selectedVoice = preferred || voices[0] || null
    }

    loadVoice()
    if (window.speechSynthesis.onvoiceschanged !== undefined) {
      window.speechSynthesis.onvoiceschanged = loadVoice
    }
  }

  public setEnabled(enabled: boolean) {
    this.enabled = enabled
    try {
      localStorage.setItem('fish_game_announcer_enabled', String(enabled))
      if (!enabled && typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel()
      }
    } catch {
      // Ignore storage errors
    }
  }

  public isEnabled(): boolean {
    return this.enabled
  }

  public toggle(): boolean {
    const next = !this.enabled
    this.setEnabled(next)
    if (next) {
      this.speak('Voice announcer activated!')
    }
    return next
  }

  public speak(text: string, priority: boolean = false) {
    if (!this.enabled || typeof window === 'undefined' || !('speechSynthesis' in window)) return

    const now = Date.now()
    if (!priority && now - this.lastSpokenTime < this.minIntervalMs) {
      return
    }

    try {
      window.speechSynthesis.cancel()
      const utterance = new SpeechSynthesisUtterance(text)

      if (this.selectedVoice) {
        utterance.voice = this.selectedVoice
      }

      utterance.pitch = 1.08
      utterance.rate = 1.06
      utterance.volume = 0.95

      this.lastSpokenTime = now
      window.speechSynthesis.speak(utterance)
    } catch {
      // Ignore speech synthesis errors
    }
  }

  public announceWelcome(name: string) {
    const greetings = [
      `Welcome back, ${name}! Ready to dive into the pool?`,
      `Hey ${name}! Let's make some waves today!`,
      `Great to see you, ${name}! The swimming pool is ready!`,
    ]
    const pick = greetings[Math.floor(Math.random() * greetings.length)]
    this.speak(pick, true)
  }

  public announceRoundStart(round: number, envName: string) {
    const msgs = [
      `Round ${round}! Dive into ${envName}!`,
      `Starting Round ${round}! Swimmer take your mark!`,
      `Round ${round}! Keep your eyes on the fish!`,
    ]
    const pick = msgs[(round - 1) % msgs.length]
    this.speak(pick, true)
  }

  public announcePuzzleCleared() {
    const msgs = ['Puzzle cleared! Start swimming!', 'Correct! Go for the gold!', 'Great math! Dive in!']
    const pick = msgs[Math.floor(Math.random() * msgs.length)]
    this.speak(pick, true)
  }

  public announceCombo(streak: number) {
    if (streak >= 5) {
      this.speak('Mega streak! Five in a row!')
    } else if (streak === 3) {
      this.speak('Triple catch! Awesome!')
    }
  }

  public announceChest() {
    const msgs = ['Golden treasure collected!', 'Chest unlocked! Plus 150!', 'Treasure found!']
    const pick = msgs[Math.floor(Math.random() * msgs.length)]
    this.speak(pick)
  }

  public announceHit() {
    const msgs = ['Watch out for obstacles!', 'Ouch! Obstacle hit!', 'Careful, rock ahead!']
    const pick = msgs[Math.floor(Math.random() * msgs.length)]
    this.speak(pick)
  }

  public announceVictory(score: number) {
    this.speak(`Victory! Fantastic swimming! Final score: ${score}!`, true)
  }

  public announceGameOver() {
    this.speak('Good effort swimmer! Try again to beat your high score!', true)
  }
}

export const announcerService = new AnnouncerService()
export default announcerService

