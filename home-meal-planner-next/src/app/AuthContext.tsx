'use client'
import React, { createContext, useContext, useState, useMemo, useCallback } from 'react'
import { UserMode, User } from '../types'
import { authenticateUser } from './api'
import { encodeBasicAuth } from './utils'

interface AuthContextType {
  userMode: UserMode
  userInfo: User | null
  username: string
  password: string
  isLoading: boolean
  lastSyncTime: number | null
  login: (username: string, password: string) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
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

  const login = useCallback(async (username: string, password: string) => {
    setAuthState((prev) => ({ ...prev, isLoading: true }))
    try {
      const userInfo = await authenticateUser(username, password)
      if (typeof window !== 'undefined') {
        localStorage.setItem('auth_credentials', encodeBasicAuth(username, password))
        localStorage.setItem('auth_username', username)
      }
      setAuthState({
        userMode: 'authenticated',
        userInfo,
        username,
        password,
        isLoading: false,
        lastSyncTime: Date.now(),
      })
    } catch (error) {
      setAuthState((prev) => ({ ...prev, isLoading: false, password: '' }))
      throw error
    }
  }, [])

  const logout = useCallback(() => {
    setAuthState((prev) => ({
      userMode: 'visitor',
      userInfo: null,
      username: prev.username,
      password: '',
      isLoading: false,
      lastSyncTime: null,
    }))
  }, [])

  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      const username = localStorage.getItem('auth_username') || ''
      setAuthState((prev) => ({ ...prev, username }))
    }
  }, [])

  const value = useMemo(
    () => ({
      userMode: authState.userMode,
      userInfo: authState.userInfo,
      username: authState.username,
      password: authState.password,
      isLoading: authState.isLoading,
      lastSyncTime: authState.lastSyncTime,
      login,
      logout,
    }),
    [authState, login, logout]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
