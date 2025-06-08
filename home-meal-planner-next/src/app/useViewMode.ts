"use client";
import { useEffect, useState } from "react";

export type ViewMode = "week" | "month";

export function useViewMode() {
  const [viewMode, setViewModeState] = useState<ViewMode>(() => {
    if (typeof window !== "undefined") {
      return (localStorage.getItem("viewMode") as ViewMode) || "week";
    }
    return "week";
  });

  useEffect(() => {
    const loadedMode = localStorage.getItem("viewMode") as ViewMode;
    console.log("loadedMode", loadedMode);
    if (loadedMode) {
      setViewModeState(loadedMode);
    }
  }, []);


  const save = (mode: ViewMode) => {
    localStorage.setItem("viewMode", mode);
    setViewModeState(mode);
  };

  return { viewMode, save };
} 