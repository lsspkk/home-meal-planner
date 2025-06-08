"use client";
import { useState } from "react";
import { Recipe } from "../recipes";
import { WeekSelectorView } from "./WeekSelectorView";
import { useWeekMenus } from "../hooks/useWeekMenus";

interface Week {
  weekNumber: number;
  start: Date;
  end: Date;
  idx: number;
}

interface WeekSelectorProps {
  weeks: Week[];
  recipes: Recipe[];
}

export function WeekSelector({ weeks, recipes, }: WeekSelectorProps) {
  const { selection, setSelection, save: saveMenus } = useWeekMenus();
  const [modalRecipe, setModalRecipe] = useState<Recipe | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [openAccordionIdx, setOpenAccordionIdx] = useState<number | null>(null);
  const [selectedWeekIdx, setSelectedWeekIdx] = useState(0);

  const handleAdd = (weekIdx: number, recipeId: string) => {
    setSelection((prev) => {
      const prevIds = prev[weekIdx] || [];
      if (!prevIds.includes(recipeId)) {
        return { ...prev, [weekIdx]: [...prevIds, recipeId] };
      }
      return prev;
    });
    saveMenus();
  };

  const handleRemove = (weekIdx: number, recipeId: string) => {
    setSelection((prev) => {
      const prevIds = prev[weekIdx] || [];
      const newIds = prevIds.filter((id) => id !== recipeId);
      return { ...prev, [weekIdx]: newIds };
    });
    saveMenus();
  };

  const handleView = (recipe: Recipe) => {
    setModalRecipe(recipe);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setModalRecipe(null);
  };

  const handlePrevWeek = () => {
    setSelectedWeekIdx((idx) => Math.max(0, idx - 1));
    setOpenAccordionIdx(null);
  };

  const handleNextWeek = () => {
    setSelectedWeekIdx((idx) => Math.min(weeks.length - 1, idx + 1));
    setOpenAccordionIdx(null);
  };

  return (
    <WeekSelectorView
      weeks={weeks}
      recipes={recipes}
      selected={selection}
      onAdd={handleAdd}
      onRemove={handleRemove}
      onView={handleView}
      modalRecipe={modalRecipe}
      modalOpen={modalOpen}
      closeModal={closeModal}
      openAccordionIdx={openAccordionIdx}
      setOpenAccordionIdx={setOpenAccordionIdx}
      selectedWeekIdx={selectedWeekIdx}
      onPrevWeek={handlePrevWeek}
      onNextWeek={handleNextWeek}
    />
  );
} 