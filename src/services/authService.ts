/**
 * Auth Service - Virtual Identity Management
 * CIS045-3 Theme: Virtual Identity, Sessions, and Cookies
 * 
 * Provides simulated token-based authentication and cookie storage
 * designed for seamless replacement with Laravel Sanctum or JWT REST API.
 */

export interface UserProfile {
  id: string
  name: string
  email: string
  avatar: string
  level: number
  experience: number
  score: number
  coins: number
  role: 'student' | 'admin' | 'guest'
  createdAt: string
}

export interface AuthState {
  isAuthenticated: boolean
  user: UserProfile | null
  token: string | null
}

const STORAGE_AUTH_KEY = 'fish_escape_auth_user'
const STORAGE_TOKEN_KEY = 'fish_escape_auth_token'

class AuthService {
  /**
   * Helper to set a cookie representing the session (Virtual Identity)
   */
  private setSessionCookie(token: string, days: number = 7) {
    if (typeof document === 'undefined') return
    const expires = new Date(Date.now() + days * 864e5).toUTCString()
    document.cookie = `fish_escape_session=${encodeURIComponent(token)}; expires=${expires}; path=/; SameSite=Lax`
  }

  private clearSessionCookie() {
    if (typeof document === 'undefined') return
    document.cookie = 'fish_escape_session=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;'
  }

  /**
   * Initializes auth state from LocalStorage and Cookie
   */
  public getInitialAuth(): AuthState {
    try {
      const storedUser = localStorage.getItem(STORAGE_AUTH_KEY)
      const storedToken = localStorage.getItem(STORAGE_TOKEN_KEY)

      if (storedUser && storedToken) {
        return {
          isAuthenticated: true,
          user: JSON.parse(storedUser),
          token: storedToken,
        }
      }
    } catch (e) {
      console.warn('Failed to parse stored auth session:', e)
    }

    // Default authenticated guest profile matching Figma screenshot
    const defaultUser: UserProfile = {
      id: 'usr_oceanhero_01',
      name: 'OceanHero',
      email: 'oceanhero@fishescape.io',
      avatar: '🤿',
      level: 3,
      experience: 620,
      score: 5210,
      coins: 250,
      role: 'student',
      createdAt: new Date().toISOString(),
    }

    const defaultToken = 'mock_jwt_token_cis045_' + Date.now()
    localStorage.setItem(STORAGE_AUTH_KEY, JSON.stringify(defaultUser))
    localStorage.setItem(STORAGE_TOKEN_KEY, defaultToken)
    this.setSessionCookie(defaultToken)

    return {
      isAuthenticated: true,
      user: defaultUser,
      token: defaultToken,
    }
  }

  /**
   * Login simulation compatible with Laravel /api/login
   */
  public async login(identifier: string, password: string): Promise<UserProfile> {
    await new Promise((r) => setTimeout(r, 400)) // network delay

    // Honor the University of Bedfordshire sample login credentials (Marc / hello26)
    const isMarc = identifier.toLowerCase() === 'marc' && password === 'hello26'
    
    if (!password || password.length < 4) {
      throw new Error('Password must be at least 4 characters')
    }

    const user: UserProfile = {
      id: 'usr_' + Date.now(),
      name: isMarc ? 'Marc' : (identifier.includes('@') ? identifier.split('@')[0] : identifier),
      email: identifier.includes('@') ? identifier : `${identifier.toLowerCase()}@fishescape.io`,
      avatar: isMarc ? '🎓' : '🤿',
      level: isMarc ? 10 : 3,
      experience: isMarc ? 2500 : 620,
      score: isMarc ? 15000 : 5210,
      coins: isMarc ? 999 : 250,
      role: isMarc ? 'admin' : 'student',
      createdAt: new Date().toISOString(),
    }

    const token = 'bearer_token_laravel_' + Math.random().toString(36).substring(2)
    localStorage.setItem(STORAGE_AUTH_KEY, JSON.stringify(user))
    localStorage.setItem(STORAGE_TOKEN_KEY, token)
    this.setSessionCookie(token)

    return user
  }

  /**
   * Register simulation compatible with Laravel /api/register
   */
  public async register(name: string, email: string, password: string): Promise<UserProfile> {
    await new Promise((r) => setTimeout(r, 400))

    if (!name.trim()) throw new Error('Player Name is required')
    if (!email.includes('@')) throw new Error('Valid email address is required')
    if (password.length < 6) throw new Error('Password must be at least 6 characters')

    const user: UserProfile = {
      id: 'usr_' + Date.now(),
      name,
      email,
      avatar: '🤿',
      level: 1,
      experience: 0,
      score: 0,
      coins: 100, // starting welcome bonus
      role: 'student',
      createdAt: new Date().toISOString(),
    }

    const token = 'bearer_token_laravel_' + Math.random().toString(36).substring(2)
    localStorage.setItem(STORAGE_AUTH_KEY, JSON.stringify(user))
    localStorage.setItem(STORAGE_TOKEN_KEY, token)
    this.setSessionCookie(token)

    return user
  }

  /**
   * Logout simulation
   */
  public async logout(): Promise<void> {
    await new Promise((r) => setTimeout(r, 200))
    localStorage.removeItem(STORAGE_AUTH_KEY)
    localStorage.removeItem(STORAGE_TOKEN_KEY)
    this.clearSessionCookie()
  }

  /**
   * Updates profile information (e.g. name, avatar)
   */
  public updateProfile(updated: Partial<UserProfile>): UserProfile {
    const current = this.getInitialAuth().user
    const newUser = { ...current, ...updated } as UserProfile
    localStorage.setItem(STORAGE_AUTH_KEY, JSON.stringify(newUser))
    return newUser
  }
}

export const authService = new AuthService()
export default authService

