"use client";
import { useMemo } from "react";
import { DateNavigation, DateNavigationProps } from "./DateNavigation";
import { WeekCard } from "./WeekCard";

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
}

interface MonthlyViewProps {
  weeks: Week[];
  months: Month[];
  selectedMonthIdx: number;
  dateNavProps: DateNavigationProps;
}

export default function MonthlyView({
  weeks,
  months,
  selectedMonthIdx,
  dateNavProps,
}: MonthlyViewProps) {
  const currentMonth = months[selectedMonthIdx];
  const weeksInMonth = useMemo(() => weeks.filter((w) => w.start <= currentMonth.end && w.end >= currentMonth.start), [weeks, currentMonth]);

  return (
    <div className="flex flex-col gap-6">
      {/* Top: month title */}
      <div className="text-lg font-bold mb-2">
        {finnishMonths[currentMonth.month - 1]} {currentMonth.year}
      </div>
      {/* List all weeks in the month */}
      {weeksInMonth.map((week) => (
        <WeekCard
          key={week.idx}
          week={week}
          recipes={[]}
          selected={{}}
          onAdd={() => {}}
          onRemove={() => {}}
          onView={() => {}}
          openAccordionIdx={null}
          setOpenAccordionIdx={() => {}}
        />
      ))}
      {/* Bottom: week/month navigation */}
      <DateNavigation {...dateNavProps} />
    </div>
  );
} 