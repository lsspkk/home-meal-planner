import { TimestampedRecipeCollection, StaleDataError, TimestampedWeeklyMenus, User } from '@/types'
import { Recipe } from './recipes'
import { encodeBasicAuth } from './utils'

export const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL ?? 'http://localhost:23003' // API functions for backend operations
export const fetchRecipesFromBackend = async (credentials: string): Promise<TimestampedRecipeCollection> => {
  const response = await fetch(BACKEND_URL + '/recipes', {
    headers: {
      Authorization: `Basic ${credentials}`,
    },
  })

  if (!response.ok) {
    if (response.status === 429) {
      throw new Error('Liian monta pyyntöä - yritä hetken kuluttua')
    }
    throw new Error('Reseptien lataus epäonnistui')
  }

  return response.json()
}
export const saveRecipesToBackend = async (
  credentials: string,
  data: Record<string, Recipe>,
  lastModified: number
): Promise<TimestampedRecipeCollection> => {
  const response = await fetch(BACKEND_URL + '/recipes', {
    method: 'POST',
    headers: {
      Authorization: `Basic ${credentials}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ data, lastModified }),
  })

  if (!response.ok) {
    if (response.status === 409) {
      const error: StaleDataError = await response.json()
      throw new Error(`Tiedot on muutettu toisessa istunnossa. ${error.message}`)
    }
    if (response.status === 413) {
      throw new Error('Tiedosto on liian suuri palvelimelle')
    }
    if (response.status === 429) {
      throw new Error('Liian monta pyyntöä - yritä hetken kuluttua')
    }
    throw new Error('Reseptien tallennus epäonnistui')
  }

  return response.json()
} // API functions for backend operations
export const fetchWeekMenusFromBackend = async (credentials: string): Promise<TimestampedWeeklyMenus> => {
  const response = await fetch(BACKEND_URL + '/weekmenus', {
    headers: {
      Authorization: `Basic ${credentials}`,
    },
  })

  if (!response.ok) {
    if (response.status === 429) {
      throw new Error('Liian monta pyyntöä - yritä hetken kuluttua')
    }
    throw new Error('Viikkomenuvien lataus epäonnistui')
  }

  return response.json()
}
export const saveWeekMenusToBackend = async (
  credentials: string,
  data: Record<string, string[]>,
  lastModified: number
): Promise<TimestampedWeeklyMenus> => {
  const response = await fetch(BACKEND_URL + '/weekmenus', {
    method: 'POST',
    headers: {
      Authorization: `Basic ${credentials}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ data, lastModified }),
  })

  if (!response.ok) {
    if (response.status === 409) {
      const error: StaleDataError = await response.json()
      throw new Error(`Tiedot on muutettu toisessa istunnossa. ${error.message}`)
    }
    if (response.status === 413) {
      throw new Error('Tiedosto on liian suuri palvelimelle')
    }
    if (response.status === 429) {
      throw new Error('Liian monta pyyntöä - yritä hetken kuluttua')
    }
    throw new Error('Viikkomenuvien tallennus epäonnistui')
  }

  return response.json()
}

export async function authenticateUser(username: string, password: string) {
  const credentials = encodeBasicAuth(username, password)
  const userResponse = await fetch(BACKEND_URL + '/user', {
    headers: {
      Authorization: `Basic ${credentials}`,
    },
  })
  if (!userResponse.ok) {
    throw new Error('Virheelliset kirjautumistiedot')
  }
  const userInfo = (await userResponse.json()) as User
  return userInfo
}
