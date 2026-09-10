/* global globalThis */
import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useMemo
} from 'react'

interface ThemeContextValue {
  theme: string
  toggleTheme: () => void
  isDark: boolean
}

interface ThemeProviderProps {
  children: React.ReactNode
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined)

export const useTheme = (): ThemeContextValue => {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}

const THEME_STORAGE_KEY = 'theme'

const readStoredTheme = (): string | null => {
  try {
    return localStorage.getItem(THEME_STORAGE_KEY)
  } catch {
    return null
  }
}

const writeStoredTheme = (theme: string): void => {
  try {
    localStorage.setItem(THEME_STORAGE_KEY, theme)
  } catch {
    // Storage unavailable (private mode, disabled cookies): theme is
    // session-only, which is an acceptable degradation.
  }
}

export const ThemeProvider = ({ children }: ThemeProviderProps) => {
  // Prefer whatever the pre-paint script in index.html already applied so the
  // first render matches the document; fall back to storage, then system.
  const getInitialTheme = (): string => {
    const applied = document.documentElement.dataset.theme
    if (applied === 'light' || applied === 'dark') {
      return applied
    }

    const savedTheme = readStoredTheme()
    if (savedTheme === 'light' || savedTheme === 'dark') {
      return savedTheme
    }

    // Check system preference
    if (
      globalThis.matchMedia &&
      globalThis.matchMedia('(prefers-color-scheme: dark)').matches
    ) {
      return 'dark'
    }

    return 'light'
  }

  const [theme, setTheme] = useState(getInitialTheme)

  useEffect(() => {
    // Apply theme to document root
    document.documentElement.dataset.theme = theme

    writeStoredTheme(theme)
  }, [theme])

  const toggleTheme = () => {
    setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'))
  }

  const value = useMemo(
    () => ({
      theme,
      toggleTheme,
      isDark: theme === 'dark'
    }),
    [theme]
  )

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}
