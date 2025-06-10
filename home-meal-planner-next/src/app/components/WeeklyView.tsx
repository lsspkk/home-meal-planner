"use client";
import { useState } from "react";
import { useAppState } from "../AppStateContext";
import { WeekCard } from "./WeekCard";
import { Button } from "./Button";
import { ArrowLeftIcon, ArrowRightIcon } from "@heroicons/react/24/outline";
import { DateNavContainer } from "./DateNavContainer";

interface Week {
  weekNumber: number;
  start: Date;
  end: Date;
  idx: number;
  key: string;
}

interface WeeklyViewProps {
  weeks: Week[];
}

export default function WeeklyView({
  weeks,
}: WeeklyViewProps) {
  const { selectedWeekIdx, setSelectedWeekIdx } = useAppState();
  const [currentWeekIdx, setCurrentWeekIdx] = useState(selectedWeekIdx);

  const handlePrevWeek = () => {
    const newIdx = Math.max(0, currentWeekIdx - 1);
    setCurrentWeekIdx(newIdx);
    setSelectedWeekIdx(newIdx);
  };

  const handleNextWeek = () => {
    const newIdx = Math.min(weeks.length - 1, currentWeekIdx + 1);
    setCurrentWeekIdx(newIdx);
    setSelectedWeekIdx(newIdx);
  };
  
  function formatDate(date: Date) {
    return new Date(date).toLocaleDateString("fi-FI", { day: "2-digit", month: "2-digit", year: "numeric" });
  }

  const currentWeek = weeks[currentWeekIdx];

  const isFirstWeek = currentWeekIdx === 0 || weeks.length === 0 || weeks[currentWeekIdx].idx === weeks[0].idx;
  const isLastWeek = currentWeekIdx === weeks.length - 1 || weeks.length === 0 || weeks[currentWeekIdx].idx === weeks[weeks.length - 1].idx;

  return (
    <div className="flex flex-col gap-6 pb-20">
      <WeekCard
        key={currentWeek.key}
        week={currentWeek}
      />
      <DateNavContainer>
        <Button onClick={handlePrevWeek} disabled={isFirstWeek} variant="secondary" className="py-3">
          <ArrowLeftIcon className="w-4 h-4" />
        </Button>
        <div className="text-center font-semibold">
          Viikko {currentWeek.weekNumber}
          <div className="text-sm text-gray-500">
            ({formatDate(currentWeek.start)} - {formatDate(currentWeek.end)})
          </div>
        </div>
        <Button onClick={handleNextWeek} disabled={isLastWeek} variant="secondary" className="py-3">
          <ArrowRightIcon className="w-4 h-4" />
        </Button>
      </DateNavContainer>
    </div>
  );
} 