"use client";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import { useRef } from "react";
import { Button } from "./Button";
import { useAppState } from "../AppStateContext";

export interface DateNavigationProps {
  viewMode: "week" | "month";
  selectedMonthIdx: number;
  setSelectedMonthIdx: (idx: number) => void;
  weeks: { weekNumber: number; start: Date; end: Date; idx: number }[];
  months: { month: number; year: number; start: Date; end: Date; idx: number }[];
}

export function DateNavigation({
  viewMode,
  selectedMonthIdx,
  setSelectedMonthIdx,
  weeks,
  months,
}: DateNavigationProps) {
  const navRef = useRef<HTMLDivElement>(null);
  const { selectedWeekIdx, setSelectedWeekIdx } = useAppState();

  // Swipe support for mobile
  let touchStartX = 0;
  let touchEndX = 0;
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX = e.changedTouches[0].screenX;
  };
  const handleTouchEnd = (e: React.TouchEvent) => {
    touchEndX = e.changedTouches[0].screenX;
    if (touchEndX < touchStartX - 40) {
      // swipe left
      if (viewMode === "week" && selectedWeekIdx < weeks.length - 1) setSelectedWeekIdx(selectedWeekIdx + 1);
      if (viewMode === "month" && selectedMonthIdx < months.length - 1) setSelectedMonthIdx(selectedMonthIdx + 1);
    }
    if (touchEndX > touchStartX + 40) {
      // swipe right
      if (viewMode === "week" && selectedWeekIdx > 0) setSelectedWeekIdx(selectedWeekIdx - 1);
      if (viewMode === "month" && selectedMonthIdx > 0) setSelectedMonthIdx(selectedMonthIdx - 1);
    }
  };

  // Format week/month label
  const week = weeks[selectedWeekIdx];
  const month = months[selectedMonthIdx];
  const formatDate = (date: Date) => new Date(date).toLocaleDateString("fi-FI", { day: "2-digit", month: "2-digit" });

  return (
    <div
      ref={navRef}
      className="flex justify-between md:justify-center items-center justify-center gap-2 md:gap-8 py-2 select-none w-full md:w-auto"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <Button
        variant="ghost"
        className="p-1 sm:p-2 rounded"
        onClick={() => {
          if (viewMode === "week") setSelectedWeekIdx(Math.max(0, selectedWeekIdx - 1));
          if (viewMode === "month") setSelectedMonthIdx(selectedMonthIdx > 0 ? selectedMonthIdx - 1 : 0);
        }}
        disabled={viewMode === "week" ? selectedWeekIdx === 0 : selectedMonthIdx === 0}
        aria-label="Edellinen viikko"
      >
        <ChevronLeftIcon className="w-5 h-5 sm:w-7 sm:h-7" />
      </Button>
      <div className="mx-2 text-xs sm:text-base font-semibold">
        {viewMode === "week" && week && (
          <>
            Viikko {week.weekNumber} ({formatDate(week.start)} - {formatDate(week.end)})
          </>
        )}
        {viewMode === "month" && month && (
          <>
            {month.month}.{month.year} ({formatDate(month.start)} - {formatDate(month.end)})
          </>
        )}
      </div>
      <Button
        variant="ghost"
        className="p-1 sm:p-2 rounded"
        onClick={() => {
          if (viewMode === "week") setSelectedWeekIdx(Math.min(weeks.length - 1, selectedWeekIdx + 1));
          if (viewMode === "month") setSelectedMonthIdx(Math.min(months.length - 1, selectedMonthIdx + 1));
        }}
        disabled={viewMode === "week" ? selectedWeekIdx === weeks.length - 1 : selectedMonthIdx === months.length - 1}
        aria-label="Seuraava viikko"
      >
        <ChevronRightIcon className="w-5 h-5 sm:w-7 sm:h-7" />
      </Button>
    </div>
  );
} 