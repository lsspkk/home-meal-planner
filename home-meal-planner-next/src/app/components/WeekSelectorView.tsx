import { Recipe } from "../recipes";
import { RecipeCard } from "./RecipeCard";
import { RecipeModal } from "./RecipeModal";

interface Week {
  weekNumber: number;
  start: Date;
  end: Date;
  idx: number;
}

interface WeekSelectorViewProps {
  weeks: Week[];
  recipes: Recipe[];
  selected: { [weekIdx: string]: string[] };
  onAdd: (weekIdx: number, recipeId: string) => void;
  onRemove: (weekIdx: number, recipeId: string) => void;
  onView: (recipe: Recipe) => void;
  modalRecipe: Recipe | null;
  modalOpen: boolean;
  closeModal: () => void;
  openAccordionIdx: number | null;
  setOpenAccordionIdx: (idx: number | null) => void;
  layout: "vertical" | "horizontal";
  selectedWeekIdx?: number;
  onPrevWeek?: () => void;
  onNextWeek?: () => void;
}

export function WeekSelectorView({
  weeks,
  recipes,
  selected,
  onAdd,
  onRemove,
  onView,
  modalRecipe,
  modalOpen,
  closeModal,
  openAccordionIdx,
  setOpenAccordionIdx,
  layout,
  selectedWeekIdx = 0,
  onPrevWeek,
  onNextWeek,
}: WeekSelectorViewProps) {
  function formatDate(date: Date) {
    return new Date(date).toLocaleDateString("fi-FI", { day: "2-digit", month: "2-digit", year: "numeric" });
  }

  const renderWeek = (week: Week) => (
    <div key={week.idx} className="border week-theme-border rounded-lg p-4 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2 gap-2">
        <div className="font-semibold text-lg flex-1">
          Viikko {week.weekNumber} ({formatDate(week.start)} - {formatDate(week.end)})
        </div>
        {openAccordionIdx === week.idx ? null : (
          <button
            className="button-theme-small self-end sm:self-auto"
            onClick={() => setOpenAccordionIdx(week.idx)}
            type="button"
          >
            Lisää resepti
          </button>
        )}
      </div>
      <div className="mb-2 flex justify-between items-center">
        <div className="font-medium mb-1">Valitut reseptit:</div>
        {(selected[week.idx] || []).length > 0 && (
          <a
            href={`/market?week=${week.idx}`}
            className="button-theme-small px-3 py-1 rounded"
          >
            Market
          </a>
        )}
      </div>
      <div className="mb-2">
        <div className="flex flex-col gap-2">
          {(selected[week.idx] || []).map((id: string) => {
            const recipe = recipes.find((r) => r.id === id);
            return recipe ? (
              <RecipeCard
                key={id}
                recipe={recipe}
                selected={true}
                onAdd={() => {}}
                onRemove={() => onRemove(week.idx, id)}
                onView={() => onView(recipe)}
              />
            ) : null;
          })}
        </div>
      </div>
      <div className="mb-2">
        {openAccordionIdx === week.idx && (
          <div className="flex flex-col gap-2 mt-2 p-2 bg-blue-50 rounded">
            <div className="flex items-center justify-between mb-2">
              <div className="font-semibold text-base">Lisää reseptit</div>
              <button
                className="button-theme-small"
                onClick={() => setOpenAccordionIdx(null)}
                type="button"
              >
                Sulje
              </button>
            </div>
            {recipes.filter((r) => !(selected[week.idx] || []).includes(r.id)).map((recipe) => (
              <RecipeCard
                key={recipe.id}
                recipe={recipe}
                selected={false}
                onAdd={() => onAdd(week.idx, recipe.id)}
                onRemove={() => {}}
                onView={() => onView(recipe)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="flex flex-col gap-8">
      {layout === "vertical"
        ? weeks.map(renderWeek)
        : renderWeek(weeks[selectedWeekIdx])}
      <RecipeModal recipe={modalRecipe} open={modalOpen} onClose={closeModal} />
      {layout === "horizontal" && (
        <>
          {/* Desktop big edge arrows */}
          <div className="hidden sm:block">
            <div className="fixed left-6 top-1/2 z-30 -translate-y-1/2">
              <button
                onClick={onPrevWeek}
                disabled={selectedWeekIdx === 0}
                className="flex flex-col items-center gap-1"
                aria-label="Edellinen viikko"
              >
                <span className="rounded-full w-16 h-16 flex items-center justify-center text-4xl shadow-lg border-2 button-theme-small disabled:opacity-30">
                  ←
                </span>
                <span className="text-xs mt-1 text-theme-secondary-contrast">Edellinen</span>
              </button>
            </div>
            <div className="fixed right-6 top-1/2 z-30 -translate-y-1/2">
              <button
                onClick={onNextWeek}
                disabled={selectedWeekIdx === weeks.length - 1}
                className="flex flex-col items-center gap-1"
                aria-label="Seuraava viikko"
              >
                <span className="rounded-full w-16 h-16 flex items-center justify-center text-4xl shadow-lg border-2 button-theme-small disabled:opacity-30">
                  →
                </span>
                <span className="text-xs mt-1 text-theme-secondary-contrast">Seuraava</span>
              </button>
            </div>
          </div>
          {/* Mobile arrows as round fixed buttons at bottom corners */}
          <div className="sm:hidden">
            <div className="fixed left-4 bottom-4 z-30">
              <button
                onClick={onPrevWeek}
                disabled={selectedWeekIdx === 0}
                className="rounded-full aspect-square w-12 h-12 flex items-center justify-center text-2xl shadow-lg border-2 button-theme-small disabled:opacity-30"
                aria-label="Edellinen viikko"
              >
                ←
              </button>
            </div>
            <div className="fixed right-4 bottom-4 z-30">
              <button
                onClick={onNextWeek}
                disabled={selectedWeekIdx === weeks.length - 1}
                className="rounded-full aspect-square w-12 h-12 flex items-center justify-center text-2xl shadow-lg border-2 button-theme-small disabled:opacity-30"
                aria-label="Seuraava viikko"
              >
                →
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
} 