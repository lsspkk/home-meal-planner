import { Recipe } from "../recipes";

interface RecipeCardProps {
  recipe: Recipe;
  selected: boolean;
  onAdd: () => void;
  onRemove: () => void;
  onView: () => void;
}

export function RecipeCard({ recipe, selected, onAdd, onRemove, onView }: RecipeCardProps) {
  return (
    <div className={`flex flex-col sm:flex-row items-start sm:items-center justify-between border rounded p-2 mb-2 bg-white shadow-sm w-full max-w-full ${selected ? "border-blue-500" : "border-gray-200"}`}>
      <div className="flex-1 min-w-0">
        <div className="font-semibold truncate text-base mb-1">{recipe.title}</div>
        <div className="text-xs text-gray-500 truncate mb-1">{recipe.text}</div>
      </div>
      <div className="flex gap-2 mt-2 sm:mt-0">
        <button
          className="button-theme-small"
          onClick={onView}
          type="button"
        >
          Näytä
        </button>
        {selected ? (
          <button
            className="button-theme-small"
            onClick={onRemove}
            type="button"
          >
            Poista
          </button>
        ) : (
          <button
            className="button-theme-small"
            onClick={onAdd}
            type="button"
          >
            Lisää
          </button>
        )}
      </div>
    </div>
  );
} 