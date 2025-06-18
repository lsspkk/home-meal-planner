'use client'
import React, { useEffect, useState } from 'react'

interface ModalProps {
  open: boolean
  onClose: () => void
  children: React.ReactNode
}

export function Modal({ open, onClose, children }: ModalProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [isAnimating, setIsAnimating] = useState(false)

  useEffect(() => {
    if (open) {
      setIsVisible(true)
      setIsAnimating(true)
      // Prevent body scroll when modal is open
      document.body.style.overflow = 'hidden'
    } else {
      setIsAnimating(false)
      const timer = setTimeout(() => {
        setIsVisible(false)
        // Restore body scroll when modal is closed
        document.body.style.overflow = 'unset'
      }, 200) // Match animation duration
      return () => clearTimeout(timer)
    }
  }, [open])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [])

  if (!isVisible) return null

  const handleBackdropClick = () => {
    if (!isAnimating) {
      onClose()
    }
  }

  return (
    <div
      onClick={handleBackdropClick}
      className={`fixed inset-0 z-50 flex items-center justify-center transition-all duration-200 ${
        open 
          ? 'bg-black bg-opacity-50 backdrop-blur-sm' 
          : 'bg-black bg-opacity-0 backdrop-blur-none'
      }`}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className={`bg-white rounded-lg shadow-xl w-full max-w-full sm:max-w-md mx-4 sm:mx-0 overflow-hidden transition-all duration-200 ${
          open 
            ? 'transform scale-100 opacity-100' 
            : 'transform scale-95 opacity-0'
        }`}
      >
        <div className='modal-top-border'></div>
        <div className='p-2 sm:p-6 break-words lg:p-12'>{children}</div>
      </div>
    </div>
  )
}
