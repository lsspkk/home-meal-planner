'use client'
import { createContext, useContext, useState, useMemo, useCallback } from 'react'
import { getWeekNumber } from './utils'
import { UserMode, User } from '../types'
import { Toast } from './components/Toast'
import React from 'react'
import { BACKEND_URL } from './utils'

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
  username: string
  password: string
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
  const [authState, setAuthState] = useState<{
    userMode: UserMode
    userInfo: User | null
    username: string
    password: string
    isLoading: boolean
    lastSyncTime: number | null
  }>(() => {
    let username = ''
    if (typeof window !== 'undefined') {
      username = localStorage.getItem('auth_username') || ''
    }
    return {
      userMode: 'visitor',
      userInfo: null,
      username,
      password: '',
      isLoading: false,
      lastSyncTime: null,
    }
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
      setAuthState((prev) => ({ ...prev, isLoading: true }))
      try {
        const credentials = btoa(`${username}:${password}`)
        const userResponse = await fetch(BACKEND_URL + '/user', {
          headers: {
            Authorization: `Basic ${credentials}`,
          },
        })
        if (!userResponse.ok) {
          throw new Error('Virheelliset kirjautumistiedot')
        }
        const userInfo = await userResponse.json()
        // Store username for future logins, but NOT password
        if (typeof window !== 'undefined') {
          localStorage.setItem('auth_username', username)
        }
        setAuthState({
          userMode: 'authenticated',
          userInfo,
          username,
          password, // Only in memory
          isLoading: false,
          lastSyncTime: Date.now(),
        })
        showToast('Kirjautuminen onnistui!', 'success')
      } catch (error: unknown) {
        setAuthState((prev) => ({ ...prev, isLoading: false, password: '' }))
        const message = error instanceof Error ? error.message : 'Kirjautuminen epäonnistui'
        showToast(message, 'error')
        throw error
      }
    },
    [showToast]
  )

  const logout = useCallback(() => {
    if (typeof window !== 'undefined') {
      // Do NOT clear username from localStorage
    }
    setAuthState({
      userMode: 'visitor',
      userInfo: null,
      username: authState.username,
      password: '',
      isLoading: false,
      lastSyncTime: null,
    })
    showToast('Kirjauduttu ulos', 'info')
  }, [showToast, authState.username])

  // On mount, prefill username from localStorage if present
  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      const username = localStorage.getItem('auth_username') || ''
      setAuthState((prev) => ({ ...prev, username }))
    }
  }, [])

  const value = useMemo(
    () => ({
      selectedWeekIdx,
      setSelectedWeekIdx,
      userMode: authState.userMode,
      userInfo: authState.userInfo,
      username: authState.username,
      password: authState.password,
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
