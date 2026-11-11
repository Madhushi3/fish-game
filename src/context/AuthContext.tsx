import React, { createContext, useContext, useState } from 'react'
import authService, { type UserProfile, type AuthState } from '../services/authService'

interface AuthContextType extends AuthState {
  login: (identifier: string, pass: string) => Promise<void>
  register: (name: string, email: string, pass: string) => Promise<void>
  logout: () => Promise<void>
  updateProfile: (updated: Partial<UserProfile>) => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [authState, setAuthState] = useState<AuthState>(() => authService.getInitialAuth())

  const login = async (identifier: string, pass: string) => {
    const user = await authService.login(identifier, pass)
    setAuthState({
      isAuthenticated: true,
      user,
      token: localStorage.getItem('fish_escape_auth_token'),
    })
  }

  const register = async (name: string, email: string, pass: string) => {
    const user = await authService.register(name, email, pass)
    setAuthState({
      isAuthenticated: true,
      user,
      token: localStorage.getItem('fish_escape_auth_token'),
    })
  }

  const logout = async () => {
    await authService.logout()
    setAuthState({
      isAuthenticated: false,
      user: null,
      token: null,
    })
  }

  const updateProfile = (updated: Partial<UserProfile>) => {
    const newUser = authService.updateProfile(updated)
    setAuthState((prev) => ({
      ...prev,
      user: newUser,
    }))
  }

  return (
    <AuthContext.Provider
      value={{
        ...authState,
        login,
        register,
        logout,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
