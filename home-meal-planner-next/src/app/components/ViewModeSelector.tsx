"use client";
import { Button } from "./Button";
import { ViewMode } from "../useViewMode";
import React from "react";

export interface ViewModeSelectorProps {
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
}

export function ViewModeSelector({
  viewMode,
  setViewMode,
}: ViewModeSelectorProps) {
  return (
    <div
      className="flex justify-center items-center gap-2 py-2 select-none w-full"
    >
      <Button
        variant={viewMode === 'week' ? 'primary' : 'secondary'}
        onClick={() => setViewMode('week')}
        className="w-full"
      >
        Viikko
      </Button>
      <Button
        variant={viewMode === 'month' ? 'primary' : 'secondary'}
        onClick={() => setViewMode('month')}
        className="w-full"
      >
        Kuukausi
      </Button>
    </div>
  );
} 