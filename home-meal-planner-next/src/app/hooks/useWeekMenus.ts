import { useState, useEffect, useCallback } from "react";

export function useWeekMenus() {
  const [selectedWeek, setSelectedWeek] = useState<number>(0);
  const [selection, setSelection] = useState<Record<string, string[]>>({});

  // Load from localStorage on initial mount
  useEffect(() => {
    const savedWeek = localStorage.getItem("selectedWeek");
    if (savedWeek) {
      setSelectedWeek(Number(savedWeek));
    }
    const savedMenus = localStorage.getItem("weeklyMenus");
    if (savedMenus) {
      setSelection(JSON.parse(savedMenus));
    }
  }, []);

  // Save state to localStorage
  const save = useCallback(() => {
    localStorage.setItem("selectedWeek", String(selectedWeek));
    localStorage.setItem("weeklyMenus", JSON.stringify(selection));
  }, [selectedWeek, selection]);

  return {
    selectedWeek,
    setSelectedWeek,
    selection,
    setSelection,
    save,
  };
} 