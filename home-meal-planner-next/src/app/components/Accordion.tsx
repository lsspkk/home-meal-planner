'use client'
import React, { useState } from 'react'
import { Button } from './Button'
import { XMarkIcon } from '@heroicons/react/24/outline'

interface AccordionProps {
  title: string
  children: React.ReactNode
  isOpen?: boolean
  onToggle?: (isOpen: boolean) => void
  className?: string
}

export function Accordion({ 
  title, 
  children, 
  isOpen: controlledIsOpen, 
  onToggle,
  className = '' 
}: AccordionProps) {
  const [internalIsOpen, setInternalIsOpen] = useState(false)
  
  // Use controlled state if provided, otherwise use internal state
  const isOpen = controlledIsOpen !== undefined ? controlledIsOpen : internalIsOpen
  const setIsOpen = (open: boolean) => {
    if (onToggle) {
      onToggle(open)
    } else {
      setInternalIsOpen(open)
    }
  }

  return (
    <div className={`${isOpen ? 'mb-8' : 'mb-2'} ${className}`}>
      {isOpen && (
        <div className='flex flex-col gap-3 md:gap-4 mt-4 px-1 md:px-4 py-4 bg-blue-50 rounded-lg -mx-2 md:-mx-4'>
          <div className='flex items-center justify-between mb-3 md:mb-4 pl-2 md:pl-0'>
            <div className='font-semibold text-base md:text-lg'>{title}</div>
            <Button
              variant='secondary'
              onClick={() => setIsOpen(false)}
              type='button'
              icon={<XMarkIcon className='w-5 h-5' />}
            >
              <span className='hidden md:inline'>Sulje</span>
            </Button>
          </div>
          {children}
        </div>
      )}
    </div>
  )
} 