'use client'
import { createContext, useContext, useState, useMemo, useCallback } from 'react'
import { getWeekNumber } from './utils'
import { AuthState, UserMode, User } from '../types'
import { Toast } from './components/Toast'
import React from 'react'

interface ToastState {
  message: string
  type: 'error' | 'success' | 'info' | 'warning'
  id: string
}

type AppState = {
  selectedWeekIdx: number
  setSelectedWeekIdx: (idx: number) => void
  // Authentication state
  userMode: UserMode
  userInfo: User | null
  isLoading: boolean
  lastSyncTime: number | null
  // Authentication actions
  login: (username: string, password: string) => Promise<void>
  logout: () => void
  // Error handling
  showToast: (message: string, type: 'error' | 'success' | 'info' | 'warning') => void
}

const AppStateContext = createContext<AppState | undefined>(undefined)

export function AppStateProvider({ children }: { children: React.ReactNode }) {
  const [selectedWeekIdx, setSelectedWeekIdxState] = useState(() => {
    if (typeof window !== 'undefined') {
      const v = localStorage.getItem('selectedWeekIdx')
      if (v) return Number(v)
    }
    return getWeekNumber(new Date())
  })

  // Authentication state
  const [authState, setAuthState] = useState<AuthState>({
    userMode: 'visitor',
    userInfo: null,
    isLoading: false,
    lastSyncTime: null,
  })

  // Toast state
  const [toasts, setToasts] = useState<ToastState[]>([])

  const setSelectedWeekIdx = (idx: number) => {
    setSelectedWeekIdxState(idx)
    if (typeof window !== 'undefined') localStorage.setItem('selectedWeekIdx', String(idx))
  }

  const showToast = useCallback((message: string, type: 'error' | 'success' | 'info' | 'warning') => {
    const id = Date.now().toString()
    setToasts((prev) => [...prev, { message, type, id }])
  }, [])

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id))
  }, [])

  const login = useCallback(
    async (username: string, password: string) => {
      setAuthState((prev: AuthState) => ({ ...prev, isLoading: true }))

      try {
        // First, authenticate and get user info
        const credentials = btoa(`${username}:${password}`)
        const userResponse = await fetch('http://localhost:23003/user', {
          headers: {
            Authorization: `Basic ${credentials}`,
          },
        })

        if (!userResponse.ok) {
          throw new Error('Virheelliset kirjautumistiedot')
        }

        const userInfo = await userResponse.json()

        // Store credentials for future requests
        if (typeof window !== 'undefined') {
          localStorage.setItem('auth_credentials', credentials)
          localStorage.setItem('auth_user', JSON.stringify(userInfo))
        }

        setAuthState({
          userMode: 'authenticated',
          userInfo,
          isLoading: false,
          lastSyncTime: Date.now(),
        })

        showToast('Kirjautuminen onnistui!', 'success')
      } catch (error: unknown) {
        setAuthState((prev: AuthState) => ({ ...prev, isLoading: false }))
        const message = error instanceof Error ? error.message : 'Kirjautuminen epäonnistui'
        showToast(message, 'error')
        throw error
      }
    },
    [showToast]
  )

  const logout = useCallback(() => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('auth_credentials')
      localStorage.removeItem('auth_user')
    }

    setAuthState({
      userMode: 'visitor',
      userInfo: null,
      isLoading: false,
      lastSyncTime: null,
    })

    showToast('Kirjauduttu ulos', 'info')
  }, [showToast])

  // Check for existing authentication on mount
  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      const credentials = localStorage.getItem('auth_credentials')
      const userInfo = localStorage.getItem('auth_user')

      if (credentials && userInfo) {
        try {
          const user = JSON.parse(userInfo)
          setAuthState({
            userMode: 'authenticated',
            userInfo: user,
            isLoading: false,
            lastSyncTime: Date.now(),
          })
        } catch {
          // Invalid stored data, clear it
          localStorage.removeItem('auth_credentials')
          localStorage.removeItem('auth_user')
        }
      }
    }
  }, [])

  const value = useMemo(
    () => ({
      selectedWeekIdx,
      setSelectedWeekIdx,
      userMode: authState.userMode,
      userInfo: authState.userInfo,
      isLoading: authState.isLoading,
      lastSyncTime: authState.lastSyncTime,
      login,
      logout,
      showToast,
    }),
    [selectedWeekIdx, authState, login, logout, showToast]
  )

  return (
    <AppStateContext.Provider value={value}>
      {children}
      {/* Render toasts */}
      {toasts.map((toast) => (
        <Toast key={toast.id} message={toast.message} type={toast.type} onClose={() => removeToast(toast.id)} />
      ))}
    </AppStateContext.Provider>
  )
}

export function useAppState() {
  const ctx = useContext(AppStateContext)
  if (!ctx) throw new Error('useAppState must be used within AppStateProvider')
  return ctx
}
