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

// The selected week index (number)
export type SelectedWeekIdx = number

// View mode: 'week' or 'month'
export type ViewMode = 'week' | 'month'

// Backend API types for timestamped data
export interface TimestampedRecipeCollection {
  data: RecipeCollection
  lastModified: number
}

export interface TimestampedWeeklyMenus {
  data: WeeklyMenus
  lastModified: number
}

export interface UpdateRecipeCollectionRequest {
  data: RecipeCollection
  lastModified: number
}

export interface UpdateWeeklyMenusRequest {
  data: WeeklyMenus
  lastModified: number
}

export interface User {
  uuid: string
}

export interface StaleDataError {
  error: string
  message: string
  code: 'STALE_DATA'
}

// Authentication state
export type UserMode = 'visitor' | 'authenticated'

export interface AuthState {
  userMode: UserMode
  userInfo: User | null
  isLoading: boolean
  lastSyncTime: number | null
}
