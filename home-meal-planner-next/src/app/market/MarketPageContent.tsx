'use client'
import { useWeeklyMenus } from '../hooks/useWeekMenus'
import { useRecipeCollection } from '../hooks/useRecipeCollection'
import { useSearchParams } from 'next/navigation'
import React, { useState } from 'react'
import { recipes as staticRecipes, Recipe } from '../recipes'
import { useAppState } from '../AppStateContext'

// Regex patterns to remove quantities and units from ingredient strings for sorting/grouping
const QUANTITY_REGEXES = [
  /^\s*(\d+[.,]?\d*|\d+\s*-\s*\d+|½|¼|¾)\s*(kg|g|l|dl|ml|tl|rkl|ps|pkt|kpl|rasia|tlk|pussi|annos|viipale|pala|levy|prk|nippu|ruukku|astia|purkki|pnt)?\s*/i,
  /^\(+|\)+$/g,
  /\s*(\d+[.,]?\d*|\d+\s*-\s*\d+|½|¼|¾)\s*(kg|g|l|dl|ml|tl|rkl|ps|pkt|kpl|rasia|tlk|pussi|annos|viipale|pala|levy|prk|nippu|ruukku|astia|purkki|pnt)?\s*$/i,
  /\(\s*(\d+[.,]?\d*|\d+\s*-\s*\d+|½|¼|¾)\s*(kg|g|l|dl|ml|tl|rkl|ps|pkt|kpl|rasia|tlk|pussi|annos|viipale|pala|levy|prk|nippu|ruukku|astia|purkki|pnt)?\s*\)/gi,
]
function stripQuantity(ingredient: string) {
  let result = ingredient
  for (const regex of QUANTITY_REGEXES) {
    result = result.replace(regex, '')
  }
  return result.trim().toLowerCase()
}

type IngredientRecipe = {
  ingredient: string
  recipeKey: string
}

export default function MarketPageContent() {
  const searchParams = useSearchParams()
  const { weeklyMenus } = useWeeklyMenus()
  const { recipeCollection } = useRecipeCollection()
  const { selectedWeekIdx } = useAppState()
  const weekParam = searchParams.get('week')
  const today = new Date()
  let weekNumber = 0
  if (weekParam) {
    // If weekParam is a string like "2025-week-24", extract week number; if number, use as is
    if (/^\d{4}-week-\d+$/.test(weekParam)) {
      weekNumber = Number(weekParam.split('-')[2])
    } else {
      weekNumber = Number(weekParam)
    }
  } else {
    // Use selectedWeekIdx as week number
    weekNumber = selectedWeekIdx
  }

  // Convert week number to weekKey for data lookup
  const year = today.getFullYear()
  const weekKey = `${year}-week-${weekNumber}`

  // 1. Get all recipe IDs for the selected week
  const recipeIds: string[] = weeklyMenus[weekKey] || []

  // 2. Build a map of recipeKey to recipeData
  const recipeMap: Record<string, { id: string; title: string; contents: string[] }> = {}
  recipeIds.forEach((id) => {
    recipeMap[id] = recipeCollection[id] || staticRecipes.find((r: Recipe) => r.id === id)
  })

  // 3. Build IngredientRecipe[] for all ingredients in the week's recipes
  const ingredientRecipes: IngredientRecipe[] = []
  recipeIds.forEach((id) => {
    const recipe = recipeMap[id]
    if (recipe && recipe.contents) {
      recipe.contents.forEach((ingredient) => {
        ingredientRecipes.push({ ingredient, recipeKey: id })
      })
    }
  })

  // --- Sorting logic ---
  type SortColumn = 'ingredient' | 'recipe'
  type SortState = { column: SortColumn; direction: 'asc' | 'desc' }[]
  // Default: sort by ingredient ascending
  const [sortState, setSortState] = useState<SortState>([{ column: 'ingredient', direction: 'asc' }])

  function getSortIcon(col: SortColumn) {
    const idx = sortState.findIndex((s) => s.column === col)
    if (idx === -1) return null
    return sortState[idx].direction === 'asc' ? (
      <span aria-label='nouseva' className='ml-1'>
        ▲
      </span>
    ) : (
      <span aria-label='laskeva' className='ml-1'>
        ▼
      </span>
    )
  }

  function handleHeaderClick(col: SortColumn, e: React.MouseEvent) {
    setSortState((prev) => {
      const idx = prev.findIndex((s) => s.column === col)
      if (e.shiftKey) {
        // Multi-sort: toggle/add/remove
        if (idx === -1) {
          return [...prev, { column: col, direction: 'asc' }]
        } else {
          // Toggle direction
          const newState = [...prev]
          newState[idx] = {
            column: col,
            direction: newState[idx].direction === 'asc' ? 'desc' : 'asc',
          }
          return newState
        }
      } else {
        // Single sort: toggle or set
        if (idx === -1) {
          return [{ column: col, direction: 'asc' }]
        } else {
          return [
            {
              column: col,
              direction: prev[idx].direction === 'asc' ? 'desc' : 'asc',
            },
          ]
        }
      }
    })
  }

  // Sort function
  function multiSort(a: IngredientRecipe, b: IngredientRecipe) {
    for (const s of sortState) {
      let cmp = 0
      if (s.column === 'ingredient') {
        cmp = stripQuantity(a.ingredient).localeCompare(stripQuantity(b.ingredient))
      } else if (s.column === 'recipe') {
        cmp = (recipeMap[a.recipeKey]?.title || '').localeCompare(recipeMap[b.recipeKey]?.title || '')
      }
      if (cmp !== 0) return s.direction === 'asc' ? cmp : -cmp
    }
    return 0
  }

  const sortedIngredientRecipes = [...ingredientRecipes].sort(multiSort)

  const pastelColors = [
    'bg-pink-50',
    'bg-blue-50',
    'bg-green-50',
    'bg-yellow-50',
    'bg-purple-50',
    'bg-orange-50',
    'bg-teal-50',
    'bg-indigo-50',
  ]

  return (
    <div className=''>
      <p className='text-gray-600 text-sm md:text-lg text-center px-4 md:px-0 md:my-3 lg:my-5'>Viikon {weekNumber} ainekset yhdellä listalla.</p>
      <div className='overflow-x-auto'>
        <table className='w-full border-collapse'>
          <thead>
            <tr>
              <th className='text-xs md:text-sm text-gray-400 font-normal px-2 md:px-3 py-2 md:py-3 text-left'>#</th>
              <th
                className='text-xs md:text-sm text-gray-700 font-semibold px-2 md:px-3 py-2 md:py-3 text-left cursor-pointer select-none'
                onClick={(e) => handleHeaderClick('ingredient', e)}
              >
                Ainesosa {getSortIcon('ingredient')}
              </th>
              <th
                className='text-xs md:text-sm text-gray-700 font-semibold px-2 md:px-3 py-2 md:py-3 text-left cursor-pointer select-none min-w-[120px] md:min-w-[140px] whitespace-nowrap'
                onClick={(e) => handleHeaderClick('recipe', e)}
              >
                Resepti {getSortIcon('recipe')}
              </th>
            </tr>
          </thead>
          <tbody>
            {sortedIngredientRecipes.length === 0 ? (
              <tr>
                <td className='text-gray-500 text-sm md:text-base px-2 md:px-3 py-2 md:py-3'>Ei valittuja reseptejä.</td>
              </tr>
            ) : (
              sortedIngredientRecipes.map((ir, i) => (
                <tr key={i} className={`${pastelColors[i % pastelColors.length]}`}>
                  <td className='text-xs md:text-sm text-gray-400 pr-2 md:pr-3 pl-2 md:pl-3 py-2 md:py-3 align-top'>{i + 1}</td>
                  <td className='py-2 md:py-3 px-2 md:px-3 align-top text-sm md:text-base'>{ir.ingredient}</td>
                  <td className='py-2 md:py-3 px-2 md:px-3 align-top text-xs md:text-sm text-gray-500 whitespace-nowrap'>
                    {recipeMap[ir.recipeKey]?.title.slice(0, 8) || ''}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
