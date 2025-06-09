import { useState, useEffect } from "react";

export function useWeekMenus() {
  const [selection, setSelection] = useState<Record<string, string[]>>({});

  useEffect(() => {
    const savedMenus = localStorage.getItem("weeklyMenus");
    if (savedMenus) {
      setSelection(JSON.parse(savedMenus));
    }
  }, []);

  const save = (selection: Record<string, string[]>) => {
    localStorage.setItem("weeklyMenus", JSON.stringify(selection));
    setSelection(selection);
  };

  return {
    selection,
    save,
  };
} 