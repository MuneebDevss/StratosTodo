'use client'

import React, { createContext, useContext, useCallback, useMemo, useState, useEffect } from 'react'
import { useUserQuery, useUpdateUser, type User } from '@/features/auth/api/use-user'

const STORAGE_KEY = 'stratostodo:theme'
export type ThemeKey = 'light' | 'dark'
type UserWithTheme = User & { theme?: ThemeKey }

function readCachedTheme(): ThemeKey {
  if (typeof window === 'undefined') return 'dark'
  const cached = window.localStorage.getItem(STORAGE_KEY)
  return cached === 'light' ? 'light' : 'dark'
}

export interface ThemeContextType {
  theme: ThemeKey
  setTheme: (next: ThemeKey) => void
  toggleTheme: () => void
}

export const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export function useThemeState(): ThemeContextType {
  const { data: user } = useUserQuery()
  const { mutate: updateUser } = useUpdateUser()

  const [theme, setThemeState] = useState<ThemeKey>(() => readCachedTheme())

  // Sync with user's persisted theme when loaded
  const userTheme = (user as UserWithTheme | undefined)?.theme
  useEffect(() => {
    if (userTheme) {
      setThemeState(userTheme)
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(STORAGE_KEY, userTheme)
      }
    }
  }, [userTheme])

  // Keep DOM in sync
  useEffect(() => {
    if (typeof window !== 'undefined') {
      document.documentElement.setAttribute('data-theme', theme)
    }
  }, [theme])

  const setTheme = useCallback(
    (next: ThemeKey) => {
      setThemeState(next)
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(STORAGE_KEY, next)
      }
      updateUser({ theme: next } as Partial<User>)
    },
    [updateUser],
  )

  const toggleTheme = useCallback(() => {
    setTheme(theme === 'light' ? 'dark' : 'light')
  }, [theme, setTheme])

  return useMemo(() => ({ theme, setTheme, toggleTheme }), [theme, setTheme, toggleTheme])
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const themeState = useThemeState()
  return (
    <ThemeContext.Provider value={themeState}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme(): ThemeContextType {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context;
}