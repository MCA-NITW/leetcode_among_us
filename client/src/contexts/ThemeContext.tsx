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

export const ThemeProvider = ({ children }: ThemeProviderProps) => {
  // Check localStorage or system preference for initial theme
  const getInitialTheme = (): string => {
    const savedTheme = localStorage.getItem('theme')
    if (savedTheme) {
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

    // Save to localStorage
    localStorage.setItem('theme', theme)
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
