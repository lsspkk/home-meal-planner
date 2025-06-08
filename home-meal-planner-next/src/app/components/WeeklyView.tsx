"use client";
import { DateNavigation, DateNavigationProps } from "./DateNavigation";
import { WeekSelectorView } from "./WeekSelectorView";
import { Recipe } from "../recipes";

interface Week {
  weekNumber: number;
  start: Date;
  end: Date;
  idx: number;
}
interface WeeklyViewProps {
  weeks: Week[];
  recipes: Recipe[];
  selection: Record<string, string[]>;
  selectedWeekIdx: number;
  addRecipeToDay: (weekIdx: number, recipeId: string) => void;
  removeRecipeFromDay: (weekIdx: number, recipeId: string) => void;
  modalRecipe: Recipe | null;
  modalOpen: boolean;
  closeModal: () => void;
  openAccordionIdx: number | null;
  setOpenAccordionIdx: (idx: number | null) => void;
  dateNavProps: DateNavigationProps;
  onView: (recipe: Recipe) => void;
}

export default function WeeklyView({
  weeks,
  recipes,
  selection,
  selectedWeekIdx,
  addRecipeToDay,
  removeRecipeFromDay,
  modalRecipe,
  modalOpen,
  closeModal,
  openAccordionIdx,
  setOpenAccordionIdx,
  dateNavProps,
  onView,
}: WeeklyViewProps) {
  // UI for edit mode, random button, etc. would go here
  // For now, just render WeekSelectorView and DateNavigation
  return (
    <div className="flex flex-col gap-6">
      {/* Top: current week */}
      <WeekSelectorView
        weeks={[weeks[selectedWeekIdx]]}
        recipes={recipes}
        selected={selection}
        onAdd={addRecipeToDay}
        onRemove={removeRecipeFromDay}
        onView={onView}
        modalRecipe={modalRecipe}
        modalOpen={modalOpen}
        closeModal={closeModal}
        openAccordionIdx={openAccordionIdx}
        setOpenAccordionIdx={setOpenAccordionIdx}
        selectedWeekIdx={0}
      />
      {/* Bottom: week/month navigation */}
      {/* On mobile, fixed at bottom; on desktop, normal flow. Hide when add list is open. */}
      {openAccordionIdx === null && (
        <div className="sm:static sm:mt-0 fixed bottom-0 left-0 w-full bg-white border-t z-40 sm:bg-transparent sm:border-0">
          <div className="max-w-2xl mx-auto">
            <DateNavigation {...dateNavProps} />
          </div>
        </div>
      )}
    </div>
  );
} 