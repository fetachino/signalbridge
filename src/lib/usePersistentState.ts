import { useEffect, useState } from 'react'

/** Keeps TV preferences across browser reloads while remaining safe in non-browser runtimes. */
export function usePersistentState<T>(key: string, initialValue: T) {
  const [value, setValue] = useState<T>(() => {
    if (typeof window === 'undefined') return initialValue
    try {
      const saved = window.localStorage.getItem(key)
      return saved === null ? initialValue : (JSON.parse(saved) as T)
    } catch {
      return initialValue
    }
  })

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(value))
    } catch {
      // Preference persistence is optional. The TV experience still works if storage is unavailable.
    }
  }, [key, value])

  return [value, setValue] as const
}
