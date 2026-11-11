import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { GameProvider, useGame } from './context/GameContext'

// Pages matching the Figma screens
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Play from './pages/Play'
import Leaderboard from './pages/Leaderboard'
import GameHistory from './pages/GameHistory'

const RootRoute: React.FC = () => {
  const { isLoggedIn } = useGame()
  return isLoggedIn ? <Navigate to="/dashboard" replace /> : <Navigate to="/login" replace />
}

const ProtectedRoute: React.FC<{ children: React.ReactElement }> = ({ children }) => {
  const { isLoggedIn } = useGame()
  return isLoggedIn ? children : <Navigate to="/login" replace />
}

export const App: React.FC = () => {
  return (
    <GameProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<RootRoute />} />
          <Route path="/login" element={<Login />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/play"
            element={
              <ProtectedRoute>
                <Play />
              </ProtectedRoute>
            }
          />
          <Route
            path="/leaderboard"
            element={
              <ProtectedRoute>
                <Leaderboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/history"
            element={
              <ProtectedRoute>
                <GameHistory />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </GameProvider>
  )
}

export default App
