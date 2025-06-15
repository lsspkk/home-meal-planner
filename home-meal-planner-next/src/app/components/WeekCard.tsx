import React from 'react';
import { Recipe } from '../recipes'
import { RecipeCard } from './RecipeCard'
import { Button } from './Button'
import { DocumentPlusIcon, ShoppingCartIcon, XMarkIcon } from '@heroicons/react/24/outline'
import { useRouter } from 'next/navigation'
import { Card } from './Card'
import { useState } from 'react'
import { RecipeModal } from './RecipeModal'
import { useWeeklyMenus } from '../hooks/useWeekMenus'
import { useRecipeCollection } from '../hooks/useRecipeCollection'

interface Week {
  weekNumber: number
  start: Date
  end: Date
  idx: number
  key: string
}

interface WeekCardProps {
  week: Week
}

export function WeekCard({
  week,
}: WeekCardProps) {
  const { recipeCollection } = useRecipeCollection()
  const recipes = Object.values(recipeCollection)
  const [isAccordionOpen, setIsAccordionOpen] = useState(false)
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null)
  const { weeklyMenus: selected, onAdd, onRemove } = useWeeklyMenus()
  const router = useRouter()
  
  const onView = (recipe: Recipe) => setSelectedRecipe(recipe);
  const closeModal = () => setSelectedRecipe(null);

  function formatDate(date: Date) {
    return new Date(date).toLocaleDateString('fi-FI', { day: '2-digit', month: '2-digit', year: 'numeric' })
  }
  return (
    <>
      <Card padding="tight">
        <div className='flex flex-row items-center sm:justify-between mb-2 gap-2 p-2'>
          <div className='flex-1 flex-col'>
            <span className='font-semibold text-lg'>Viikko {week.weekNumber}</span>
            <span className='text-sm text-gray-500 sm:inline block sm:mt-0 mt-1'>
              {formatDate(week.start)} - {formatDate(week.end)}
            </span>
          </div>
          {!isAccordionOpen && (
            <Button
              variant='primary'
              onClick={() => setIsAccordionOpen(true)}
              icon={<DocumentPlusIcon className='w-5 h-5' />}
              rounded
            >
              <span className='hidden sm:inline'>Lisää</span>
            </Button>
          )}
          <Button
            aria-label='Siirry kauppalistaan'
            onClick={() => router.push(`/market?week=${week.key}`)}
            icon={<ShoppingCartIcon className='w-5 h-5' />}
            rounded
          >
            <span className='hidden sm:inline'>Kauppalista</span>
          </Button>
        </div>
        <div className='mb-2 flex items-center hidden sm:flex'>
          <div className='font-medium mb-1'>Valitut reseptit:</div>
        </div>
        <div className='mb-2'>
          <div className='flex flex-col gap-1 md:gap-4'>
            {(selected[week.key] || []).map((id: string) => {
              const recipe = recipes.find((r) => r.id === id)
              return recipe ? (
                <RecipeCard
                  key={id}
                  recipe={recipe}
                  selected={true}
                  onAdd={() => {}}
                  onRemove={() => onRemove(week.key, id)}
                  onView={() => onView(recipe)}
                />
              ) : null
            })}
          </div>
        </div>
        <div className={isAccordionOpen ? 'mb-8' : 'mb-2'}>
          {isAccordionOpen && (
            <div className='flex flex-col gap-2 mt-4 sm:p-2 bg-blue-50 rounded'>
              <div className='flex items-center justify-between mb-2'>
                <div className='font-semibold text-base'>Lisää reseptejä</div>
                <Button
                  variant='secondary'
                  onClick={() => setIsAccordionOpen(false)}
                  type='button'
                  icon={<XMarkIcon className='w-5 h-5' />}
                >
                  Sulje
                </Button>
              </div>
              {recipes
                .filter((r) => !(selected[week.key] || []).includes(r.id))
                .map((recipe) => (
                  <RecipeCard
                    key={recipe.id}
                    recipe={recipe}
                    selected={false}
                    onAdd={() => onAdd(week.key, recipe.id)}
                    onRemove={() => {}}
                    onView={() => onView(recipe)}
                  />
                ))}
            </div>
          )}
        </div>
      </Card>
      <RecipeModal recipe={selectedRecipe} open={!!selectedRecipe} onClose={closeModal} />
    </>
  )
}
