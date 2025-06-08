import { Recipe } from "../recipes";
import { RecipeCard } from "./RecipeCard";
import { Button } from "./Button";
import { PlusIcon, ShoppingCartIcon } from "@heroicons/react/24/outline";
import { useRouter } from "next/navigation";

interface Week {
  weekNumber: number;
  start: Date;
  end: Date;
  idx: number;
}

interface WeekCardProps {
  week: Week;
  recipes: Recipe[];
  selected: { [weekIdx: string]: string[] };
  onAdd: (weekIdx: number, recipeId: string) => void;
  onRemove: (weekIdx: number, recipeId: string) => void;
  onView: (recipe: Recipe) => void;
  openAccordionIdx: number | null;
  setOpenAccordionIdx: (idx: number | null) => void;
}

export function WeekCard({
  week,
  recipes,
  selected,
  onAdd,
  onRemove,
  onView,
  openAccordionIdx,
  setOpenAccordionIdx,
}: WeekCardProps) {
  const router = useRouter();
  function formatDate(date: Date) {
    return new Date(date).toLocaleDateString("fi-FI", { day: "2-digit", month: "2-digit", year: "numeric" });
  }
  return (
    <div className="border-t border-b px-0 py-2 sm:border sm:rounded-lg sm:shadow-sm sm:p-4 week-theme-border">
      <div className="flex flex-row items-center sm:justify-between mb-2 gap-2">
        <div className="flex-1 flex flex-col">
          <span className="font-semibold text-lg">
            Viikko {week.weekNumber}
          </span>
          <span className="text-sm text-gray-500 sm:inline block sm:mt-0 mt-1">
            {formatDate(week.start)} - {formatDate(week.end)}
          </span>
        </div>
        <Button
          type="button"
          aria-label="Siirry kauppalistaan"
          onClick={() => router.push(`/market?week=${week.weekNumber}`)}
          icon={<ShoppingCartIcon className="w-5 h-5" />}
        >
          <span className="hidden sm:inline">Kauppalista</span>
        </Button>
        {openAccordionIdx === week.idx ? null : (
          <Button
            variant="primary"
            onClick={() => setOpenAccordionIdx(week.idx)}
            type="button"
            icon={<PlusIcon className="w-5 h-5" />}
          >
            <span className="hidden sm:inline">Lisää</span>
          </Button>
        )}
      </div>
      <div className="mb-2 flex items-center hidden sm:flex">
        <div className="font-medium mb-1">Valitut reseptit:</div>
      </div>
      <div className="mb-2">
        <div className="flex flex-col gap-2">
          {(selected[week.weekNumber] || []).map((id: string) => {
            const recipe = recipes.find((r) => r.id === id);
            return recipe ? (
              <RecipeCard
                key={id}
                recipe={recipe}
                selected={true}
                onAdd={() => {}}
                onRemove={() => onRemove(week.weekNumber, id)}
                onView={() => onView(recipe)}
              />
            ) : null;
          })}
        </div>
      </div>
      <div className={openAccordionIdx === week.idx ? "mb-8" : "mb-2"}>
        {openAccordionIdx === week.idx && (
          <div className="flex flex-col gap-2 mt-4 p-2 bg-blue-50 rounded">
            <div className="flex items-center justify-between mb-2">
              <div className="font-semibold text-base">Lisää reseptejä</div>
              <Button
                variant="primary"
                onClick={() => setOpenAccordionIdx(null)}
                type="button"
              >
                Sulje
              </Button>
            </div>
            {recipes.filter((r) => !(selected[week.weekNumber] || []).includes(r.id)).map((recipe) => (
              <RecipeCard
                key={recipe.id}
                recipe={recipe}
                selected={false}
                onAdd={() => onAdd(week.weekNumber, recipe.id)}
                onRemove={() => {}}
                onView={() => onView(recipe)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
} 