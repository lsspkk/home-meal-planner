"use client";
import { useMemo, useState } from "react";
import { useRecipeCollection } from "./hooks/useRecipeCollection";
import { useViewMode } from "./useViewMode";
import { getWeeksInRange, getMonthsInRange } from "./utils";
import WeeklyView from "./components/WeeklyView";
import MonthlyView from "./components/MonthlyView";
import { useWeekMenus } from "./hooks/useWeekMenus";
import { DateNavigationProps } from "./components/DateNavigation";
import { Recipe } from "./recipes";
import { useAppState } from "./AppStateContext";

export default function HomePage() {
  const { selection, save } = useWeekMenus();
  const { recipeCollection } = useRecipeCollection();
  const { viewMode } = useViewMode();
  const { selectedWeekIdx } = useAppState();
  const [selectedMonthIdx, setSelectedMonthIdx] = useState(0);
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [openAccordionIdx, setOpenAccordionIdx] = useState<number | null>(null);

  const today = useMemo(() => new Date(), []);
  const sixMonthsLater = useMemo(() => {
    const d = new Date(today);
    d.setMonth(today.getMonth() + 6);
    return d;
  }, [today]);
  const weeks = useMemo(() => getWeeksInRange(today, sixMonthsLater), [today, sixMonthsLater]);
  const months = useMemo(() => getMonthsInRange(today, sixMonthsLater), [today, sixMonthsLater]);

  const dateNavProps: DateNavigationProps = {
    viewMode,
    selectedMonthIdx,
    setSelectedMonthIdx,
    weeks,
    months,
  };

  const modalOpen = !!selectedRecipe;
  const closeModal = () => setSelectedRecipe(null);
  const onView = (recipe: Recipe) => setSelectedRecipe(recipe);

  const onAdd = (weekIdx: number, recipeId: string) => {
    const newSelection = { ...selection };
    if (!newSelection[weekIdx]) {
      newSelection[weekIdx] = [];
    }
    newSelection[weekIdx] = [...newSelection[weekIdx], recipeId];
    save(newSelection);
  };
  const onRemove = (weekIdx: number, recipeId: string) => {
    const newSelection = { ...selection };
    newSelection[weekIdx] = newSelection[weekIdx].filter(id => id !== recipeId);
    save(newSelection);
  };

  if (viewMode === "week") {
    return (
      <WeeklyView
        weeks={weeks}
        recipes={Object.values(recipeCollection)}
        selection={selection}
        selectedWeekIdx={selectedWeekIdx}
        onAdd={onAdd}
        onRemove={onRemove}
        modalRecipe={selectedRecipe}
        modalOpen={modalOpen}
        closeModal={closeModal}
        openAccordionIdx={openAccordionIdx}
        setOpenAccordionIdx={setOpenAccordionIdx as (idx: number | null) => void}
        dateNavProps={dateNavProps}
        onView={onView}
      />
    );
  }
  return (
    <MonthlyView
      weeks={weeks}
      months={months}
      selectedMonthIdx={selectedMonthIdx}
      dateNavProps={dateNavProps}
    />
  );
} 