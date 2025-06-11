import React from 'react'
import { XMarkIcon, ExclamationTriangleIcon, CheckCircleIcon, InformationCircleIcon } from '@heroicons/react/24/outline'

export interface ToastProps {
  message: string
  type: 'error' | 'success' | 'info' | 'warning'
  onClose: () => void
  duration?: number
}

export function Toast({ message, type, onClose, duration = 5000 }: ToastProps) {
  React.useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(onClose, duration)
      return () => clearTimeout(timer)
    }
  }, [duration, onClose])

  const getTypeStyles = () => {
    switch (type) {
      case 'error':
        return 'bg-red-50 border-red-200 text-red-800'
      case 'success':
        return 'bg-green-50 border-green-200 text-green-800'
      case 'info':
        return 'bg-blue-50 border-blue-200 text-blue-800'
      case 'warning':
        return 'bg-yellow-50 border-yellow-200 text-yellow-800'
      default:
        return 'bg-gray-50 border-gray-200 text-gray-800'
    }
  }

  const getIcon = () => {
    switch (type) {
      case 'error':
        return <ExclamationTriangleIcon className='w-5 h-5 text-red-500' />
      case 'success':
        return <CheckCircleIcon className='w-5 h-5 text-green-500' />
      case 'info':
        return <InformationCircleIcon className='w-5 h-5 text-blue-500' />
      case 'warning':
        return <ExclamationTriangleIcon className='w-5 h-5 text-yellow-500' />
      default:
        return null
    }
  }

  return (
    <div className={`fixed top-4 right-4 z-50 max-w-md w-full mx-auto`}>
      <div className={`border rounded-lg shadow-lg p-4 ${getTypeStyles()}`}>
        <div className='flex items-start gap-3'>
          {getIcon()}
          <div className='flex-1 text-sm font-medium'>{message}</div>
          <button
            onClick={onClose}
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
