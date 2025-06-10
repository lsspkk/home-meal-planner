"use client";
import { useState, useMemo } from "react";
import { WeekCard } from "./WeekCard";
import { Button } from "./Button";
import { DateNavContainer } from "./DateNavContainer";
import React from "react";

const finnishMonths = [
  "Tammikuu", "Helmikuu", "Maaliskuu", "Huhtikuu", "Toukokuu", "Kesäkuu",
  "Heinäkuu", "Elokuu", "Syyskuu", "Lokakuu", "Marraskuu", "Joulukuu"
];

interface Month {
  month: number;
  year: number;
  start: Date;
  end: Date;
}

interface Week {
  weekNumber: number;
  start: Date;
  end: Date;
  idx: number;
  key: string;
}

interface MonthlyViewProps {
  weeks: Week[];
  months: Month[];
}

export default function MonthlyView({
  weeks,
  months,
}: MonthlyViewProps) {
  const [selectedMonthIdx, setSelectedMonthIdx] = useState(new Date().getMonth());

  const handlePrevMonth = () => {
    setSelectedMonthIdx(prev => (prev === 0 ? 11 : prev - 1));
  };

  const handleNextMonth = () => {
    setSelectedMonthIdx(prev => (prev === 11 ? 0 : prev + 1));
  };

  const currentMonth = months[selectedMonthIdx];
  const weeksInMonth = useMemo(() => weeks.filter((w) => w.start.getMonth() === currentMonth.month -1), [weeks, currentMonth]);

  const isFirstMonth = selectedMonthIdx === 0 || months.length === 0 || months[selectedMonthIdx].month === months[0].month;
  const isLastMonth = selectedMonthIdx === months.length - 1 || months.length === 0 || months[selectedMonthIdx].month === months[months.length - 1].month;

  return (
    <div className="flex flex-col gap-6 pb-20">
      {weeksInMonth.map((week) => (
        <WeekCard
          key={week.key}
          week={week}
        />
      ))}
      <DateNavContainer>
        <Button onClick={handlePrevMonth} variant="secondary" className="py-3" disabled={isFirstMonth}>
          &lt;
        </Button>
        <h2 className="text-xl font-bold">
          {finnishMonths[currentMonth.month - 1]} {currentMonth.year}
        </h2>
        <Button onClick={handleNextMonth} variant="secondary" className="py-3" disabled={isLastMonth}>
          &gt;
        </Button>
      </DateNavContainer>
    </div>
  );
} 