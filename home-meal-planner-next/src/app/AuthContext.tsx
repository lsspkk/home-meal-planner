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
  showLogin: () => void
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
    if (typeof window !== 'undefined') {
      localStorage.removeItem('auth_credentials')
      localStorage.removeItem('auth_username')
    }
    return {
      userMode: null,
      userInfo: null,
      username: '',
      password: '',
      isLoading: false,
      lastSyncTime: null,
    }
  })

  const showLogin = useCallback(() => {
    setAuthState(prev => ({
      ...prev,
      userMode: null,
      userInfo: null,
      password: ''
    }))
  }, [])

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
      showLogin,
    }),
    [authState, login, logout, showLogin]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
