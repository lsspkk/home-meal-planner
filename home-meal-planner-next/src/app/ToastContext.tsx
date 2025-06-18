'use client'
import React, { createContext, useContext, useState, useCallback, useMemo } from 'react'
import { Toast } from './components/Toast'

export interface ToastState {
  message: string
  type: 'error' | 'success' | 'info' | 'warning'
  id: string
  timestamp: number
}

interface ToastContextType {
  showToast: (message: string, type: 'error' | 'success' | 'info' | 'warning') => void
}

const ToastContext = createContext<ToastContextType | undefined>(undefined)

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastState[]>([])

  const showToast = useCallback((message: string, type: 'error' | 'success' | 'info' | 'warning') => {
    const id = Date.now().toString()
    const newToast = { message, type, id, timestamp: Date.now() }
    
    // Replace existing toast if it's the same type and recent (within 2 seconds)
    setToasts((prev) => {
      const recentToast = prev.find(toast => 
        toast.type === type && 
        Date.now() - toast.timestamp < 2000
      )
      
      if (recentToast) {
        // Update existing toast with new message and timestamp
        return prev.map(toast => 
          toast.id === recentToast.id 
            ? { ...newToast, id: recentToast.id }
            : toast
        )
      }
      
      // Add new toast
      return [...prev, newToast]
    })
  }, [])

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id))
  }, [])

  const value = useMemo(() => ({ showToast }), [showToast])

  return (
    <ToastContext.Provider value={value}>
      {children}
      {toasts.map((toast) => (
        <Toast 
          key={toast.id} 
          message={toast.message} 
          type={toast.type} 
          onClose={() => removeToast(toast.id)} 
        />
      ))}
    </ToastContext.Provider>
  )
}

export function useToast() {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast must be used within ToastProvider')
  return ctx
}
