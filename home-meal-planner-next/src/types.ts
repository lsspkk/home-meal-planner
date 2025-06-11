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
