import { createContext, useContext, useState, useCallback } from 'react'
import { loginUser, registerUser } from '../services/insforge'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    // Rehydrate from sessionStorage so a refresh doesn't log out
    const stored = sessionStorage.getItem('lofty_user')
    return stored ? JSON.parse(stored) : null
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const login = useCallback(async ({ email, password }) => {
    setLoading(true)
    setError(null)
    const result = await loginUser({ email, password })
    setLoading(false)
    if (result.success) {
      setUser(result.user)
      sessionStorage.setItem('lofty_user', JSON.stringify(result.user))
    } else {
      setError(result.error)
    }
    return result
  }, [])

  const register = useCallback(async ({ email, password, full_name, role }) => {
    setLoading(true)
    setError(null)
    const result = await registerUser({ email, password, full_name, role })
    setLoading(false)
    if (!result.success) {
      setError(result.error)
    }
    return result
  }, [])

  const logout = useCallback(() => {
    setUser(null)
    setError(null)
    sessionStorage.removeItem('lofty_user')
  }, [])

  const clearError = useCallback(() => setError(null), [])

  return (
    <AuthContext.Provider value={{ user, loading, error, login, register, logout, clearError }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
