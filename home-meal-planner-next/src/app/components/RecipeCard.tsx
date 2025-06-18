'use client'
import { Recipe } from '../recipes'
import { Button } from './Button'
import { useEffect, useState } from 'react'
import { ArrowUpOnSquareStackIcon, EyeIcon, TrashIcon } from '@heroicons/react/24/outline'
import React from "react";

interface RecipeCardProps {
  recipe: Recipe
  selected: boolean
  onAdd: () => void
  onRemove: () => void
  onView: () => void
}

export function RecipeCard({ recipe, selected, onAdd, onRemove, onView }: RecipeCardProps) {
  // Detect mobile (tailwind md: 768px)
  const [isMobile, setIsMobile] = useState(false)
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  return (
    <div
      className={`
        flex flex-col md:flex-row items-start md:items-center 
        justify-between border rounded-lg p-3 md:p-4
        bg-white shadow-sm w-full
        ${selected ? 'border-blue-500 bg-blue-50' : 'border-gray-200'}
      `}
    >
      <div className='flex-1 min-w-0 flex flex-col gap-1'>
        <div className='font-semibold text-base leading-tight break-words'>
          {recipe.title}
        </div>
        <div className='text-xs text-gray-500 leading-tight break-words'>
          {recipe.text}
        </div>
      </div>
      <div className='flex gap-2 md:gap-4 mt-3 md:mt-0 flex-row-reverse md:flex-row w-full md:w-auto justify-between md:justify-end md:ml-3'>
        {!selected && (
          <Button
            variant='primary'
            onClick={onAdd}
            type='button'
            rounded
            icon={<ArrowUpOnSquareStackIcon className='w-5 h-5' />}
          >
            <span className='hidden md:inline'>Lisää</span>
          </Button>
        )}
        <Button
          variant='primary'
          onClick={onView}
          type='button'
          icon={isMobile ? <EyeIcon className='w-5 h-5' /> : undefined}
          rounded
        >
          {!isMobile && 'Näytä'}
        </Button>
        {selected && (
          <Button 
            variant='primary' 
            onClick={onRemove} 
            type='button' 
            rounded 
            icon={<TrashIcon className='w-5 h-5' />}
          >
            {!isMobile && 'Poista'}
          </Button>
        )}
      </div>
    </div>
  )
}
