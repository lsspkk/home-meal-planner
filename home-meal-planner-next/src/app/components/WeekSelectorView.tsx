"use client";
import { Recipe } from "../recipes";
import { RecipeModal } from "./RecipeModal";
import { Button } from "./Button";
import { WeekCard } from "./WeekCard";

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
  selectedWeekIdx: number;
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
  selectedWeekIdx,
  onPrevWeek,
  onNextWeek,
}: WeekSelectorViewProps) {
  function formatDate(date: Date) {
    return new Date(date).toLocaleDateString("fi-FI", { day: "2-digit", month: "2-digit", year: "numeric" });
  }

  return (
    <div className="flex flex-col gap-8">
      {weeks.length > 1 && onPrevWeek && onNextWeek && (
      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
          <Button onClick={onPrevWeek} disabled={selectedWeekIdx === 0} variant="secondary">
            Edellinen viikko
          </Button>
          <div className="text-center font-semibold">
            Viikko {weeks[selectedWeekIdx].weekNumber}
            <div className="text-sm text-gray-500">
              ({formatDate(weeks[selectedWeekIdx].start)} - {formatDate(weeks[selectedWeekIdx].end)})
            </div>
          </div>
          <Button onClick={onNextWeek} disabled={selectedWeekIdx >= weeks.length - 1} variant="secondary">
            Seuraava viikko
          </Button>
        </div>
      )}
      <WeekCard
        key={weeks[selectedWeekIdx].idx}
        week={weeks[selectedWeekIdx]}
        recipes={recipes}
        selected={selected}
        onAdd={onAdd}
        onRemove={onRemove}
        onView={onView}
        openAccordionIdx={openAccordionIdx}
        setOpenAccordionIdx={setOpenAccordionIdx}
      />
      <RecipeModal recipe={modalRecipe} open={modalOpen} onClose={closeModal} />
    </div>
  );
} 