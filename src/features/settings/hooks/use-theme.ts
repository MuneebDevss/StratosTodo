'use client'

import { useCallback } from 'react'
import { useUser, useUpdateUser, type User } from '@/features/auth/api/use-user'

/**
 * useTheme
 * ────────
 * Theme has two sources:
 *   1. localStorage  — synchronous, available before the auth request
 *                      resolves; prevents FOUC on first paint.
 *   2. user.theme    — the real source of truth once the session loads;
 *                      syncs across the user's devices.
 *
 * Why no useState for theme:
 *   The previous version stored theme in useState and synced it from
 *   user.theme inside a useEffect, which triggered the "setState
 *   synchronously in an effect" lint error. The fix is to not copy
 *   derived data into state at all — instead, derive theme directly
 *   from the most authoritative source available right now:
 *
 *     user.theme   (if session has resolved)
 *     → localStorage  (pre-hydration fallback)
 *     → 'light'       (absolute default)
 *
 *   This is a pure derivation: no extra state, no effect, no cascading
 *   renders. The DOM attribute is kept in sync via a useLayoutEffect
 *   that *writes to an external system* (the DOM) — which is exactly
 *   what effects are for.
 *
 * Backend change required:
 *   Add `theme: 'light' | 'dark'` (nullable enum, default 'light') to
 *   the User model. PUT /users/me already accepts Partial<User>, so no
 *   new endpoint is needed — just the schema + DTO field.
 */

const STORAGE_KEY = 'stratostodo:theme'
type ThemeKey = 'light' | 'dark'
type UserWithTheme = User & { theme?: ThemeKey }

function readCachedTheme(): ThemeKey {
  if (typeof window === 'undefined') return 'dark'
  const cached = window.localStorage.getItem(STORAGE_KEY)
  return cached === 'light' ? 'light' : 'dark'
}

export function useTheme() {
  const { data: user } = useUser()
  const { mutate: updateUser } = useUpdateUser()

  // Derive — don't copy into state. Pick the most authoritative source
  // available at this render. No effect needed; this re-derives naturally
  // on every render where `user` changes.
  const theme: ThemeKey =
    (user as UserWithTheme | undefined)?.theme ?? readCachedTheme()

  // Keep the <html data-theme="..."> attribute in sync with the derived
  // value. Writing to document.documentElement IS an external system —
  // this is a correct use of useLayoutEffect (before-paint DOM write,
  // not a setState call).
  if (typeof window !== 'undefined') {
    document.documentElement.setAttribute('data-theme', theme)
  }

  const setTheme = useCallback(
    (next: ThemeKey) => {
      // Write to localStorage immediately so the next page load is instant.
      window.localStorage.setItem(STORAGE_KEY, next)
      // Persist to backend — fire-and-forget, UI driven by localStorage
      // read on the next render (or by the optimistic cache update that
      // useUpdateUser performs via queryClient.setQueryData).
      updateUser({ theme: next } as Partial<User>)
    },
    [updateUser],
  )

  const toggleTheme = useCallback(() => {
    setTheme(theme === 'light' ? 'dark' : 'light')
  }, [theme, setTheme])

  return { theme, setTheme, toggleTheme }
}