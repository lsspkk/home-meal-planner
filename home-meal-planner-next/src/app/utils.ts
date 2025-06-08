export function generateId(length = 8): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

export function getWeekNumber(date: Date): number {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  return Math.ceil(((d.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);
}

export interface WeekRange {
  weekNumber: number;
  start: Date;
  end: Date;
  idx: number;
}

export function getWeeksInRange(start: Date, end: Date): WeekRange[] {
  const weeks: WeekRange[] = [];
  const current = new Date(start);
  current.setDate(current.getDate() - current.getDay() + 1); // Monday as first day
  let weekIdx = 0;
  while (current <= end) {
    const weekStart = new Date(current);
    const weekEnd = new Date(current);
    weekEnd.setDate(current.getDate() + 6);
    weeks.push({
      weekNumber: getWeekNumber(weekStart),
      start: new Date(weekStart),
      end: new Date(weekEnd),
      idx: weekIdx++
    });
    current.setDate(current.getDate() + 7);
  }
  return weeks;
}

export interface MonthRange {
  month: number;
  year: number;
  start: Date;
  end: Date;
  idx: number;
}

export function getMonthsInRange(start: Date, end: Date): MonthRange[] {
  const months: MonthRange[] = [];
  const current = new Date(start.getFullYear(), start.getMonth(), 1);
  let monthIdx = 0;
  while (current <= end) {
    const monthStart = new Date(current);
    const monthEnd = new Date(current.getFullYear(), current.getMonth() + 1, 0);
    months.push({
      month: monthStart.getMonth() + 1,
      year: monthStart.getFullYear(),
      start: new Date(monthStart),
      end: new Date(monthEnd),
      idx: monthIdx++
    });
    current.setMonth(current.getMonth() + 1);
  }
  return months;
} 