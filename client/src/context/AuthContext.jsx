import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import api from '../api/axios.js'

const AuthContext = createContext(null)

const readStoredUser = () => {
  try {
    return JSON.parse(localStorage.getItem('studyPlannerUser') || 'null')
  } catch {
    return null
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(readStoredUser)
  const [loading, setLoading] = useState(Boolean(localStorage.getItem('studyPlannerToken')))

  useEffect(() => {
    const loadProfile = async () => {
      const token = localStorage.getItem('studyPlannerToken')
      if (!token) {
        setLoading(false)
        return
      }

      try {
        const { data } = await api.get('/users/profile')
        setUser(data.user)
        localStorage.setItem('studyPlannerUser', JSON.stringify(data.user))
      } catch {
        localStorage.removeItem('studyPlannerToken')
        localStorage.removeItem('studyPlannerUser')
        setUser(null)
      } finally {
        setLoading(false)
      }
    }

    loadProfile()
  }, [])

  const saveSession = (data) => {
    localStorage.setItem('studyPlannerToken', data.token)
    localStorage.setItem('studyPlannerUser', JSON.stringify(data.user))
    setUser(data.user)
  }

  const register = async (payload) => {
    const { data } = await api.post('/auth/register', payload)
    saveSession(data)
    return data
  }

  const login = async (payload) => {
    const { data } = await api.post('/auth/login', payload)
    saveSession(data)
    return data
  }

  const logout = async () => {
    try {
      if (localStorage.getItem('studyPlannerToken')) await api.post('/auth/logout')
    } catch {
      // Local logout still completes if the API is unavailable.
    } finally {
      localStorage.removeItem('studyPlannerToken')
      localStorage.removeItem('studyPlannerUser')
      setUser(null)
    }
  }

  const refreshProfile = async () => {
    const { data } = await api.get('/users/profile')
    setUser(data.user)
    localStorage.setItem('studyPlannerUser', JSON.stringify(data.user))
    return data.user
  }

  const value = useMemo(
    () => ({ user, loading, register, login, logout, refreshProfile, setUser }),
    [user, loading],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used inside AuthProvider')
  return context
}
