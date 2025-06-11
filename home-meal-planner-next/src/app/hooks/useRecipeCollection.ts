import { useState, useEffect, useCallback } from 'react'
import { Recipe, recipes as staticRecipes } from '../recipes'
import { useAppState } from '../AppStateContext'
import { TimestampedRecipeCollection, StaleDataError } from '@/types'

const arrayToRecord = (recipes: Recipe[]): Record<string, Recipe> => {
  return recipes.reduce((acc, recipe) => {
    acc[recipe.id] = recipe
    return acc
  }, {} as Record<string, Recipe>)
}

// API functions for backend operations
const fetchRecipesFromBackend = async (credentials: string): Promise<TimestampedRecipeCollection> => {
  const response = await fetch('http://localhost:23003/recipes', {
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

const saveRecipesToBackend = async (
  credentials: string,
  data: Record<string, Recipe>,
  lastModified: number
): Promise<TimestampedRecipeCollection> => {
  const response = await fetch('http://localhost:23003/recipes', {
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
}

export function useRecipeCollection() {
  const { userMode, showToast } = useAppState()
  const [recipeCollection, setRecipeCollection] = useState<Record<string, Recipe>>({})
  const [lastModified, setLastModified] = useState<number>(0)
  const [isLoading, setIsLoading] = useState(false)

  // Load data on mount and when user mode changes
  useEffect(() => {
    loadData()
  }, [userMode])

  const loadFromBackend = async () => {
    const credentials = localStorage.getItem('auth_credentials')
    if (!credentials) {
      throw new Error('Ei kirjautumistietoja')
    }

    const timestampedData = await fetchRecipesFromBackend(credentials)
    setRecipeCollection(timestampedData.data)
    setLastModified(timestampedData.lastModified)
  }

  const loadFromLocalStorage = () => {
    const savedRecipes = localStorage.getItem('recipeCollection')
    let shouldInit = false
    let parsed: Record<string, Recipe> = {}

    if (savedRecipes) {
      try {
        parsed = JSON.parse(savedRecipes)
        // If parsed is empty object or array, treat as uninitialized
        if (
          !parsed ||
          (Array.isArray(parsed) && parsed.length === 0) ||
          (typeof parsed === 'object' && Object.keys(parsed).length === 0)
        ) {
          shouldInit = true
        }
      } catch {
        shouldInit = true
      }
    } else {
      shouldInit = true
    }

    if (shouldInit) {
      const initial = arrayToRecord(staticRecipes)
      localStorage.setItem('recipeCollection', JSON.stringify(initial))
      setRecipeCollection(initial)
    } else {
      setRecipeCollection(parsed)
    }
    setLastModified(0) // No timestamp for localStorage
  }

  const loadData = async () => {
    setIsLoading(true)

    try {
      if (userMode === 'authenticated') {
        await loadFromBackend()
      } else {
        loadFromLocalStorage()
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Reseptien lataus epäonnistui'
      showToast(message, 'error')

      // Fallback to localStorage on error
      if (userMode === 'authenticated') {
        const savedRecipes = localStorage.getItem('recipeCollection')
        if (savedRecipes) {
          try {
            setRecipeCollection(JSON.parse(savedRecipes))
            showToast('Käytetään paikallisesti tallennettuja reseptejä', 'warning')
          } catch {
            const initial = arrayToRecord(staticRecipes)
            setRecipeCollection(initial)
          }
        }
      }
    } finally {
      setIsLoading(false)
    }
  }

  const saveToBackend = async (newRecipeCollection: Record<string, Recipe>) => {
    const credentials = localStorage.getItem('auth_credentials')
    if (!credentials) {
      throw new Error('Ei kirjautumistietoja')
    }

    const timestampedData = await saveRecipesToBackend(credentials, newRecipeCollection, lastModified)
    setRecipeCollection(timestampedData.data)
    setLastModified(timestampedData.lastModified)

    // Also save to localStorage as cache
    localStorage.setItem('recipeCollection', JSON.stringify(timestampedData.data))
    showToast('Reseptit tallennettu palvelimelle', 'success')
  }

  const saveToLocalStorage = (newRecipeCollection: Record<string, Recipe>) => {
    localStorage.setItem('recipeCollection', JSON.stringify(newRecipeCollection))
    setRecipeCollection(newRecipeCollection)
    showToast('Reseptit tallennettu paikallisesti', 'success')
  }

  const save = async (newRecipeCollection: Record<string, Recipe>) => {
    if (isLoading) return // Prevent concurrent saves

    setIsLoading(true)

    try {
      if (userMode === 'authenticated') {
        await saveToBackend(newRecipeCollection)
      } else {
        saveToLocalStorage(newRecipeCollection)
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Reseptien tallennus epäonnistui'
      showToast(message, 'error')

      // On error, save to localStorage as fallback
      localStorage.setItem('recipeCollection', JSON.stringify(newRecipeCollection))
      setRecipeCollection(newRecipeCollection)

      if (userMode === 'authenticated') {
        showToast('Tallennettu paikallisesti - yritä synkronointia myöhemmin', 'warning')
      }
    } finally {
      setIsLoading(false)
    }
  }

  // Only useCallback for refresh since it's used in useEffect dependency
  const refresh = useCallback(async () => {
    if (userMode === 'authenticated') {
      await loadData()
    }
  }, [userMode]) // loadData is not in deps since it's internal

  return {
    recipeCollection,
    save,
    refresh,
    isLoading,
    lastModified,
  }
}
