import { useState, useEffect } from "react";

export function useWeeklySelection(): [
  { [weekIdx: string]: string[] },
  React.Dispatch<React.SetStateAction<{ [weekIdx: string]: string[] }>>
] {
  const [selected, setSelected] = useState<{ [weekIdx: string]: string[] }>({});

  useEffect(() => {
    const saved = localStorage.getItem("weeklySelection");
    if (saved) setSelected(JSON.parse(saved));
  }, []);

  return [selected, setSelected];
} 