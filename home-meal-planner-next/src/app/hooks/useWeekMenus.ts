import { useState, useEffect, useCallback } from "react";

export function useWeeklyMenus() {
  const [weeklyMenus, setWeeklyMenus] = useState<Record<string, string[]>>({});

  useEffect(() => {
    const savedMenus = localStorage.getItem("weeklyMenus");
    if (savedMenus) {
      setWeeklyMenus(JSON.parse(savedMenus));
    }
  }, []);

  const save = useCallback((newWeeklyMenus: Record<string, string[]>) => {
    localStorage.setItem("weeklyMenus", JSON.stringify(newWeeklyMenus));
    setWeeklyMenus(newWeeklyMenus);
  }, []);

  const onAdd = useCallback((weekKey: string, recipeId: string) => {
    const newSelection = { ...weeklyMenus };
    if (!newSelection[weekKey]) {
      newSelection[weekKey] = [];
    }
    // Avoid duplicates
    if (!newSelection[weekKey].includes(recipeId)) {
      newSelection[weekKey] = [...newSelection[weekKey], recipeId];
      save(newSelection);
    }
  }, [weeklyMenus, save]);

  const onRemove = useCallback((weekKey: string, recipeId: string) => {
    const newSelection = { ...weeklyMenus };
    if (newSelection[weekKey]) {
      newSelection[weekKey] = newSelection[weekKey].filter(id => id !== recipeId);
      save(newSelection);
    }
  }, [weeklyMenus, save]);

  return {
    weeklyMenus,
    save,
    onAdd,
    onRemove,
  };
} 