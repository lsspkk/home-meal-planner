import { useState, useEffect, useCallback } from 'react'
import { fetchWeekMenusFromBackend, saveWeekMenusToBackend } from '../api'
import { useAuth } from '../AuthContext'
import { useToast } from '../ToastContext'

export function useWeeklyMenus() {
  const { userMode } = useAuth()
  const { showToast } = useToast()
  const [weeklyMenus, setWeeklyMenus] = useState<Record<string, string[]>>({})
  const [lastModified, setLastModified] = useState<number>(0)
  const [isLoading, setIsLoading] = useState(false)

  const loadFromBackend = useCallback(async () => {
    const credentials = localStorage.getItem('auth_credentials')
    if (!credentials) {
      throw new Error('Ei kirjautumistietoja')
    }
    const timestampedData = await fetchWeekMenusFromBackend(credentials)
    setWeeklyMenus(timestampedData.data)
    setLastModified(timestampedData.lastModified)
  }, [])

  const loadFromLocalStorage = useCallback(() => {
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
  }, [userMode, loadFromBackend, loadFromLocalStorage, showToast])

  // Load data on mount and when user mode changes
  useEffect(() => {
    loadData()
  }, [userMode, loadData])

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
  }, [userMode, loadData])

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
