'use client'
import { createContext, useContext, useState, useMemo } from 'react'
import { getWeekNumber } from './utils'
import React from 'react'

type AppState = {
  selectedWeekIdx: number
  setSelectedWeekIdx: (idx: number) => void
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

  const setSelectedWeekIdx = (idx: number) => {
    setSelectedWeekIdxState(idx)
    if (typeof window !== 'undefined') localStorage.setItem('selectedWeekIdx', String(idx))
  }

  const value = useMemo(
    () => ({
      selectedWeekIdx,
      setSelectedWeekIdx,
    }),
    [selectedWeekIdx]
  )

  return <AppStateContext.Provider value={value}>{children}</AppStateContext.Provider>
}

export function useAppState() {
  const ctx = useContext(AppStateContext)
  if (!ctx) throw new Error('useAppState must be used within AppStateProvider')
  return ctx
}
