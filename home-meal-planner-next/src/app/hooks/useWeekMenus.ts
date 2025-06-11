import { useState, useEffect, useCallback } from 'react'
import { useAppState } from '../AppStateContext'
import { TimestampedWeeklyMenus, StaleDataError } from '@/types'

// API functions for backend operations
const fetchWeekMenusFromBackend = async (credentials: string): Promise<TimestampedWeeklyMenus> => {
  const response = await fetch('http://localhost:23003/weekmenus', {
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

const saveWeekMenusToBackend = async (
  credentials: string,
  data: Record<string, string[]>,
  lastModified: number
): Promise<TimestampedWeeklyMenus> => {
  const response = await fetch('http://localhost:23003/weekmenus', {
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

export function useWeeklyMenus() {
  const { userMode, showToast } = useAppState()
  const [weeklyMenus, setWeeklyMenus] = useState<Record<string, string[]>>({})
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

    const timestampedData = await fetchWeekMenusFromBackend(credentials)
    setWeeklyMenus(timestampedData.data)
    setLastModified(timestampedData.lastModified)
  }

  const loadFromLocalStorage = () => {
    const savedMenus = localStorage.getItem('weeklyMenus')
    if (savedMenus) {
      try {
        setWeeklyMenus(JSON.parse(savedMenus))
      } catch {
        setWeeklyMenus({})
      }
    } else {
      setWeeklyMenus({})
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
      const message = error instanceof Error ? error.message : 'Viikkomenuvien lataus epäonnistui'
      showToast(message, 'error')

      // Fallback to localStorage on error
      if (userMode === 'authenticated') {
        const savedMenus = localStorage.getItem('weeklyMenus')
        if (savedMenus) {
          try {
            setWeeklyMenus(JSON.parse(savedMenus))
            showToast('Käytetään paikallisesti tallennettuja viikkomenuja', 'warning')
          } catch {
            setWeeklyMenus({})
          }
        }
      }
    } finally {
      setIsLoading(false)
    }
  }

  const saveToBackend = async (newWeeklyMenus: Record<string, string[]>) => {
    const credentials = localStorage.getItem('auth_credentials')
    if (!credentials) {
      throw new Error('Ei kirjautumistietoja')
    }

    const timestampedData = await saveWeekMenusToBackend(credentials, newWeeklyMenus, lastModified)
    setWeeklyMenus(timestampedData.data)
    setLastModified(timestampedData.lastModified)

    // Also save to localStorage as cache
    localStorage.setItem('weeklyMenus', JSON.stringify(timestampedData.data))
    showToast('Viikkomenuvit tallennettu palvelimelle', 'success')
  }

  const saveToLocalStorage = (newWeeklyMenus: Record<string, string[]>) => {
    localStorage.setItem('weeklyMenus', JSON.stringify(newWeeklyMenus))
    setWeeklyMenus(newWeeklyMenus)
    showToast('Viikkomenuvit tallennettu paikallisesti', 'success')
  }

  const save = async (newWeeklyMenus: Record<string, string[]>) => {
    if (isLoading) return // Prevent concurrent saves

    setIsLoading(true)

    try {
      if (userMode === 'authenticated') {
        await saveToBackend(newWeeklyMenus)
      } else {
        saveToLocalStorage(newWeeklyMenus)
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Viikkomenuvien tallennus epäonnistui'
      showToast(message, 'error')

      // On error, save to localStorage as fallback
      localStorage.setItem('weeklyMenus', JSON.stringify(newWeeklyMenus))
      setWeeklyMenus(newWeeklyMenus)

      if (userMode === 'authenticated') {
        showToast('Tallennettu paikallisesti - yritä synkronointia myöhemmin', 'warning')
      }
    } finally {
      setIsLoading(false)
    }
  }

  const onAdd = (weekKey: string, recipeId: string) => {
    const newSelection = { ...weeklyMenus }
    if (!newSelection[weekKey]) {
      newSelection[weekKey] = []
    }
    // Avoid duplicates
    if (!newSelection[weekKey].includes(recipeId)) {
      newSelection[weekKey] = [...newSelection[weekKey], recipeId]
      save(newSelection)
    }
  }

  const onRemove = (weekKey: string, recipeId: string) => {
    const newSelection = { ...weeklyMenus }
    if (newSelection[weekKey]) {
      newSelection[weekKey] = newSelection[weekKey].filter((id) => id !== recipeId)
      save(newSelection)
    }
  }

  // Only useCallback for refresh since it's used in useEffect dependency
  const refresh = useCallback(async () => {
    if (userMode === 'authenticated') {
      await loadData()
    }
  }, [userMode]) // loadData is not in deps since it's internal

  return {
    weeklyMenus,
    save,
    onAdd,
    onRemove,
    refresh,
    isLoading,
    lastModified,
  }
}
