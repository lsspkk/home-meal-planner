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
  addMode?: boolean // Optional prop to indicate if in add mode
}

export function RecipeCard({ recipe, selected, onAdd, onRemove, onView }: RecipeCardProps) {
  // Detect mobile (tailwind sm: 640px)
  const [isMobile, setIsMobile] = useState(false)
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 640)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  return (
    <div
      className={`flex flex-col sm:flex-row items-start sm:items-center 
        justify-between border-t border-b sm:border rounded 
        p-1 sm:p-2 lg:p-4sm:mb-2 
        bg-white shadow-sm w-full max-w-full ${
        selected ? 'border-blue-500' : 'border-gray-200'
      }`}
    >
      <div className='flex-1 min-w-0 flex items-center gap-2'>
        <div className='font-semibold truncate text-base mb-1 flex items-center gap-1'>{recipe.title}</div>
      </div>
      <div className='text-xs text-gray-500 truncate mb-1'>{recipe.text}</div>
      <div className='flex gap-2 mt-2 sm:mt-0 flex-row-reverse sm:flex-row w-full md:w-auto justify-between md:justify-end md:ml-2'>
        {!selected && (
          <Button
            variant='primary'
            onClick={onAdd}
            type='button'
            rounded
            icon={<ArrowUpOnSquareStackIcon className='w-5 h-5' />}
          >
            Lisää
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
          <Button variant='primary' onClick={onRemove} type='button' rounded icon={<TrashIcon className='w-5 h-5' />}>
            {!isMobile && 'Poista'}
          </Button>
        )}
      </div>
    </div>
  )
}
