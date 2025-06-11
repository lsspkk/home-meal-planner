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

// Timestamp-aware data wrappers for concurrency control
export interface TimestampedRecipeCollection {
  data: RecipeCollection
  lastModified: number
}

export interface TimestampedWeeklyMenus {
  data: WeeklyMenus
  lastModified: number
}

// Request types for POST operations with timestamp validation
export interface UpdateRecipeCollectionRequest {
  data: RecipeCollection
  lastModified: number
}

export interface UpdateWeeklyMenusRequest {
  data: WeeklyMenus
  lastModified: number
}

// Error response for stale data conflicts
export interface StaleDataError {
  error: string
  message: string
  code: 'STALE_DATA'
}

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
