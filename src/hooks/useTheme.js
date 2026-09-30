import { useEffect, useState } from 'react'

const STORAGE_KEY = 'portfolio-theme'
const systemTheme = () => (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')

function savedPreference() {
  try {
    const value = localStorage.getItem(STORAGE_KEY)
    return value === 'light' || value === 'dark' ? value : 'system'
  } catch {
    return 'system'
  }
}

export function useTheme() {
  const [preference, setPreference] = useState(savedPreference)
  const [theme, setTheme] = useState(() => document.documentElement.dataset.theme || systemTheme())

  useEffect(() => {
    document.documentElement.dataset.theme = theme
    document.documentElement.style.colorScheme = theme
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', theme === 'dark' ? '#0a0c10' : '#fafafa')
  }, [theme])

  useEffect(() => {
    if (preference !== 'system') return undefined
    const query = window.matchMedia('(prefers-color-scheme: dark)')
    const followSystemTheme = (event) => setTheme(event.matches ? 'dark' : 'light')
    query.addEventListener('change', followSystemTheme)
    return () => query.removeEventListener('change', followSystemTheme)
  }, [preference])

  const toggleTheme = () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark'
    setTheme(nextTheme)
    setPreference(nextTheme)
    try {
      localStorage.setItem(STORAGE_KEY, nextTheme)
    } catch {
      // The selected theme still applies when storage is unavailable.
    }
  }

  return { theme, toggleTheme }
}
