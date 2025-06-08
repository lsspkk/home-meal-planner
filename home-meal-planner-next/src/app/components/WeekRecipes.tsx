import { Recipe } from '../recipes'
import { RecipeCard } from './RecipeCard'

interface WeekRecipesProps {
  weekNumber: number
  recipes: Recipe[]
  selected: { [weekIdx: string]: string[] }
  onRemove: (weekIdx: number, recipeId: string) => void
  onView: (recipe: Recipe) => void
}

export function WeekRecipes({ weekNumber, recipes, selected, onRemove, onView }: WeekRecipesProps) {
  return (
    <>
      {/* Only show on sm and up */}
      <div className='mb-2 items-center sm:flex hidden'>
        <div className='font-medium mb-1'>Valitut reseptit:</div>
      </div>
      <div className='mb-2'>
        <div className='flex flex-col gap-2'>
          {(selected[weekNumber] || []).map((id: string) => {
            const recipe = recipes.find((r) => r.id === id)
            return recipe ? (
              <RecipeCard
                key={id}
                recipe={recipe}
                selected={true}
                onAdd={() => {}}
                onRemove={() => onRemove(weekNumber, id)}
                onView={() => onView(recipe)}
              />
            ) : null
          })}
        </div>
      </div>
    </>
  )
}
