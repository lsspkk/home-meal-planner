import { getISOWeek } from 'date-fns'

export function generateId(length = 8): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  let result = ''
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return result
}

export function getWeekNumber(date: Date): number {
  // Use date-fns for robust ISO week calculation
  return getISOWeek(date)
}

export function getWeekKey(date: Date): string {
  const year = date.getFullYear()
  const week = getWeekNumber(date)
  return `${year}-week-${week}`
}

export function parseWeekKey(key: string): { year: number; week: number } {
  const match = key.match(/(\d+)-week-(\d+)/)
  if (!match) throw new Error('Invalid week key')
  return { year: Number(match[1]), week: Number(match[2]) }
}

export interface WeekRange {
  weekNumber: number
  start: Date
  end: Date
  idx: number
  key: string
}

export function getWeeksInRange(start: Date, end: Date): WeekRange[] {
  const weeks: WeekRange[] = []
  const current = new Date(start)
  current.setDate(current.getDate() - current.getDay() + 1) // Monday as first day
  let weekIdx = 0
  while (current <= end) {
    const weekStart = new Date(current)
    const weekEnd = new Date(current)
    weekEnd.setDate(current.getDate() + 6)
    weeks.push({
      weekNumber: getWeekNumber(weekStart),
      start: new Date(weekStart),
      end: new Date(weekEnd),
      idx: weekIdx++,
      key: getWeekKey(weekStart),
    })
    current.setDate(current.getDate() + 7)
  }
  return weeks
}

export interface MonthRange {
  month: number
  year: number
  start: Date
  end: Date
  idx: number
}

export function getMonthsInRange(start: Date, end: Date): MonthRange[] {
  const months: MonthRange[] = []
  const current = new Date(start.getFullYear(), start.getMonth(), 1)
  let monthIdx = 0
  while (current <= end) {
    const monthStart = new Date(current)
    const monthEnd = new Date(current.getFullYear(), current.getMonth() + 1, 0)
    months.push({
      month: monthStart.getMonth() + 1,
      year: monthStart.getFullYear(),
      start: new Date(monthStart),
      end: new Date(monthEnd),
      idx: monthIdx++,
    })
    current.setMonth(current.getMonth() + 1)
  }
  return months
}

/**
 * Encodes username and password for HTTP Basic Auth using:
 * 1. URL-encode username and password separately
 * 2. Base64-encode each separately
 * 3. Join with a colon (:) in between
 */
export function encodeBasicAuth(username: string, password: string): string {
  function b64(str: string): string {
    if (typeof window === 'undefined') {
      return Buffer.from(str, 'utf-8').toString('base64')
    } else {
      return btoa(encodeURIComponent(str))
    }
  }

  const userEnc = b64(username)
  const passEnc = b64(password)
  return `${userEnc}:${passEnc}`
}
