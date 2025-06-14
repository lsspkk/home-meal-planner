import { useState, useEffect, useCallback } from 'react'
import { Recipe, recipes as staticRecipes } from '../recipes'
import { fetchRecipesFromBackend, saveRecipesToBackend } from '../api'
import { useAuth } from '../AuthContext'
import { useToast } from '../ToastContext'

const arrayToRecord = (recipes: Recipe[]): Record<string, Recipe> => {
  return recipes.reduce((acc, recipe) => {
    acc[recipe.id] = recipe
    return acc
  }, {} as Record<string, Recipe>)
}

export function useRecipeCollection() {
  const { userMode } = useAuth()
  const { showToast } = useToast()
  const [recipeCollection, setRecipeCollection] = useState<Record<string, Recipe>>({})
  const [lastModified, setLastModified] = useState<number>(0)
  const [isLoading, setIsLoading] = useState(false)

  const loadFromBackend = useCallback(async () => {
    const credentials = localStorage.getItem('auth_credentials')
    if (!credentials) {
      throw new Error('Ei kirjautumistietoja')
    }

    const timestampedData = await fetchRecipesFromBackend(credentials)
    if (!timestampedData.data || Object.keys(timestampedData.data).length === 0) {
      // Backend is empty, initialize with static recipes
      const initial = arrayToRecord(staticRecipes)
      const saved = await saveRecipesToBackend(credentials, initial, 0)
      setRecipeCollection(saved.data)
      setLastModified(saved.lastModified)
      localStorage.setItem('recipeCollection', JSON.stringify(saved.data))
      return
    }
    setRecipeCollection(timestampedData.data)
    setLastModified(timestampedData.lastModified)
  }, [])

  const loadFromLocalStorage = useCallback(() => {
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
  }, [])

  const loadData = useCallback(async () => {
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
  }, [userMode, loadFromBackend, loadFromLocalStorage, showToast])

  // Load data on mount and when user mode changes
  useEffect(() => {
    loadData()
  }, [userMode, loadData])

  // Only useCallback for refresh since it's used in useEffect dependency
  const refresh = useCallback(async () => {
    if (userMode === 'authenticated') {
      await loadData()
    }
  }, [userMode, loadData])

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

  return {
    recipeCollection,
    save,
    refresh,
    isLoading,
    lastModified,
  }
}
