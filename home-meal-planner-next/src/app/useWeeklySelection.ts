import { useState, useEffect } from "react";

export function useWeeklySelection() {
  // selectedWeek: week index (number)
  const [selectedWeek, setSelectedWeek] = useState<number>(0);
  // selection: { [weekIdx: string]: string[] }
  const [selection, setSelection] = useState<Record<string, string[]>>({});

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem("weeklySelection");
    if (saved) setSelection(JSON.parse(saved));
    const savedWeek = localStorage.getItem("selectedWeek");
    if (savedWeek) setSelectedWeek(Number(savedWeek));
  }, []);

  // Persist to localStorage
  useEffect(() => {
    localStorage.setItem("weeklySelection", JSON.stringify(selection));
  }, [selection]);
  useEffect(() => {
    localStorage.setItem("selectedWeek", String(selectedWeek));
  }, [selectedWeek]);

  // Add a recipe to a day (weekIdx)
  function addRecipeToDay(weekIdx: number, recipeId: string) {
    setSelection((prev) => {
      const prevIds = prev[weekIdx] || [];
      if (!prevIds.includes(recipeId)) {
        return { ...prev, [weekIdx]: [...prevIds, recipeId] };
      }
      return prev;
    });
  }

  // Remove a recipe from a day (weekIdx)
  function removeRecipeFromDay(weekIdx: number, recipeId: string) {
    setSelection((prev) => {
      const prevIds = prev[weekIdx] || [];
      return { ...prev, [weekIdx]: prevIds.filter((id) => id !== recipeId) };
    });
  }

  // Clear all recipes from a day (weekIdx)
  function clearDay(weekIdx: number) {
    setSelection((prev) => {
      const newSel = { ...prev };
      delete newSel[weekIdx];
      return newSel;
    });
  }

  // Clear all selections
  function clearAll() {
    setSelection({});
  }

  return {
    selectedWeek,
    setSelectedWeek,
    selection,
    setSelection,
    addRecipeToDay,
    removeRecipeFromDay,
    clearDay,
    clearAll,
  };
} 