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

export default function HomePage() {
  const { 
    selectedWeek, 
    setSelectedWeek, 
    selection, 
  } = useWeekMenus();
  const { recipeCollection } = useRecipeCollection();
  const [viewMode] = useViewMode();
  const [selectedMonthIdx, setSelectedMonthIdx] = useState(0);
  const [selectedWeekIdx, setSelectedWeekIdx] = useState(selectedWeek);
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [openAccordionIdx, setOpenAccordionIdx] = useState<number | null>(null);

  const today = useMemo(() => new Date(), []);
  const twoMonthsLater = useMemo(() => {
    const d = new Date(today);
    d.setMonth(today.getMonth() + 2);
    return d;
  }, [today]);
  const weeks = useMemo(() => getWeeksInRange(today, twoMonthsLater), [today, twoMonthsLater]);
  const months = useMemo(() => getMonthsInRange(today, twoMonthsLater), [today, twoMonthsLater]);

  const dateNavProps: DateNavigationProps = {
    viewMode,
    selectedWeekIdx,
    setSelectedWeekIdx: (idx: number) => {
      setSelectedWeekIdx(idx);
      setSelectedWeek(idx);
    },
    selectedMonthIdx,
    setSelectedMonthIdx,
    weeks,
    months,
  };

  const modalOpen = !!selectedRecipe;
  const closeModal = () => setSelectedRecipe(null);
  const onView = (recipe: Recipe) => setSelectedRecipe(recipe);

  if (viewMode === "week") {
    return (
      <WeeklyView
        weeks={weeks}
        recipes={Object.values(recipeCollection)}
        selection={selection}
        selectedWeekIdx={selectedWeekIdx}
        addRecipeToDay={() => {}}
        removeRecipeFromDay={() => {}}
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