// Types for data saved in localStorage

export interface Recipe {
  id: string
  title: string
  links: string[]
  contents: string[]
  text: string
}

// Maps week key (e.g. '2024-week-1') to array of recipe IDs
export type WeeklyMenus = Record<string, string[]>

// Maps recipe ID to Recipe object
export type RecipeCollection = Record<string, Recipe>

export interface User {
  uuid: string
  username: string
  password: string // This will be hashed, max length 64
}

// Rate limiting tracking
export interface RateLimit {
  minute: number
  hour: number
  day: number
  lastMinute: number
  lastHour: number
  lastDay: number
}
