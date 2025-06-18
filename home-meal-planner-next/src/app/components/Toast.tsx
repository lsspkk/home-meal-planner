'use client'
import React from 'react'
import { XMarkIcon, ExclamationTriangleIcon, CheckCircleIcon, InformationCircleIcon, ExclamationCircleIcon } from '@heroicons/react/24/outline'
import { useTheme } from './ThemeProvider'

export interface ToastProps {
  message: string
  type: 'error' | 'success' | 'info' | 'warning'
  onClose: () => void
  duration?: number
}

export function Toast({ message, type, onClose, duration = 1000 }: ToastProps) {
  const { theme } = useTheme()
  const [isVisible, setIsVisible] = React.useState(true)
  
  React.useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        setIsVisible(false)
        setTimeout(onClose, 300) // Wait for animation to complete
      }, duration)
      return () => clearTimeout(timer)
    }
  }, [duration, onClose])

  const getThemeColors = () => {
    switch (theme) {
      case 'white':
        return {
          border: 'border-gray-300',
          bg: 'bg-white',
          text: 'text-gray-900',
          iconBg: 'bg-gray-100',
          iconColor: 'text-gray-600'
        }
      case 'dark':
        return {
          border: 'border-gray-600',
          bg: 'bg-gray-800',
          text: 'text-white',
          iconBg: 'bg-gray-700',
          iconColor: 'text-gray-300'
        }
      case 'pink':
        return {
          border: 'border-pink-300',
          bg: 'bg-white',
          text: 'text-gray-900',
          iconBg: 'bg-pink-100',
          iconColor: 'text-pink-600'
        }
      case 'green':
        return {
          border: 'border-green-300',
          bg: 'bg-white',
          text: 'text-gray-900',
          iconBg: 'bg-green-100',
          iconColor: 'text-green-600'
        }
      case 'sky':
        return {
          border: 'border-sky-300',
          bg: 'bg-white',
          text: 'text-gray-900',
          iconBg: 'bg-sky-100',
          iconColor: 'text-sky-600'
        }
      case 'rainbow':
        return {
          border: 'border-yellow-300',
          bg: 'bg-white',
          text: 'text-gray-900',
          iconBg: 'bg-yellow-100',
          iconColor: 'text-yellow-600'
        }
      default:
        return {
          border: 'border-gray-300',
          bg: 'bg-white',
          text: 'text-gray-900',
          iconBg: 'bg-gray-100',
          iconColor: 'text-gray-600'
        }
    }
  }

  const getTypeIcon = () => {
    switch (type) {
      case 'error':
        return <ExclamationCircleIcon className='w-5 h-5' />
      case 'success':
        return <CheckCircleIcon className='w-5 h-5' />
      case 'info':
        return <InformationCircleIcon className='w-5 h-5' />
      case 'warning':
        return <ExclamationTriangleIcon className='w-5 h-5' />
      default:
        return <InformationCircleIcon className='w-5 h-5' />
    }
  }

  const getTypeBorderColor = () => {
    switch (type) {
      case 'error':
        return 'border-l-red-500'
      case 'success':
        return 'border-l-green-500'
      case 'info':
        return 'border-l-blue-500'
      case 'warning':
        return 'border-l-yellow-500'
      default:
        return 'border-l-gray-500'
    }
  }

  const colors = getThemeColors()

  const handleClose = () => {
    setIsVisible(false)
    setTimeout(onClose, 300) // Wait for animation to complete
  }

  return (
    <div className={`fixed top-4 right-4 z-50 max-w-md w-full mx-auto transition-all duration-300 ${
      isVisible ? 'animate-in slide-in-from-right-2' : 'animate-out'
    }`}>
      <div className={`
        border rounded-lg shadow-lg overflow-hidden
        ${colors.border} ${colors.bg} ${colors.text}
        ${getTypeBorderColor()}
        border-l-4
      `}>
        <div className='flex items-start p-4'>
          <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center mr-3 ${colors.iconBg}`}>
            <div className={colors.iconColor}>
              {getTypeIcon()}
            </div>
          </div>
          <div className='flex-1 text-sm font-medium pr-2' key={message}>
            {message}
          </div>
          <button
            onClick={handleClose}
            className='flex-shrink-0 p-1 rounded hover:bg-black/10 transition-colors'
            aria-label='Sulje ilmoitus'
          >
            <XMarkIcon className='w-4 h-4' />
          </button>
        </div>
      </div>
    </div>
  )
}
