"use client";
import { useMemo } from "react";
import { useViewMode } from "./useViewMode";
import { getWeeksInRange, getMonthsInRange } from "./utils";
import WeeklyView from "./components/WeeklyView";
import MonthlyView from "./components/MonthlyView";
import { Page } from "./components/Page";
import React from "react";

export default function HomePage() {
  const { viewMode } = useViewMode();

  const today = useMemo(() => new Date(), []);
  const sixMonthsLater = useMemo(() => {
    const d = new Date(today);
    d.setMonth(today.getMonth() + 6);
    return d;
  }, [today]);
  const weeks = useMemo(() => getWeeksInRange(today, sixMonthsLater), [today, sixMonthsLater]);
  const months = useMemo(() => getMonthsInRange(today, sixMonthsLater), [today, sixMonthsLater]);

  return (
    <Page>
      {viewMode === "week" ? (
        <WeeklyView
          weeks={weeks}
        />
      ) : (
        <MonthlyView
          weeks={weeks}
          months={months}
        />
      )}
    </Page>
  );
} 