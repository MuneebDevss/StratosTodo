'use client'

import { useState, useRef, useCallback, useLayoutEffect } from 'react'

import { useTheme } from '@/features/settings/hooks/use-theme'
import { TASK_THEMES } from '@/Common/Constants/ThemeConstants'

/**
 * EditableField
 * ─────────────
 * A single profile field that's read-only text until clicked, at which
 * point it becomes an inline input/select in the exact same position.
 *
 * Kinds:
 *   - 'text'   → plain text input
 *   - 'select' → dropdown (timezone)
 *   - 'number' → numeric input (daily capacity)
 *
 * Why no "sync draft to value" useEffect:
 *   The original code had useEffect(() => { if (!isEditing) setDraft(value) })
 *   which triggers a setState synchronously inside an effect body — React
 *   flags this as a cascading render (the lint rule is correct: you rarely
 *   need to respond to a prop change by immediately re-setting state in an
 *   effect; drive it from events instead).
 *
 *   The fix: draft is reset to the latest server value at the TWO explicit
 *   moments it needs to be:
 *     1. When the user opens the field (startEditing) — always starts from
 *        latest confirmed data, not whatever `value` was at mount time.
 *     2. When the user cancels (cancel) — discards unsaved edits.
 *   There is no need to watch `value` reactively while closed.
 */

type FieldKind = 'text' | 'select' | 'number'

interface EditableFieldProps {
  label: string
  value: string
  displayValue?: string   // formatted read-mode label (e.g. "8h 0m" for 480)
  kind: FieldKind
  options?: { value: string; label: string }[]
  onSave: (newValue: string) => void
  isSaving?: boolean
  disabled?: boolean
  theme?: 'light' | 'dark'
  suffix?: string
  min?: number
}

export function EditableField({
  label,
  value,
  displayValue,
  kind,
  options,
  onSave,
  isSaving = false,
  disabled = false,
  theme: themeProp,
  suffix,
  min,
}: EditableFieldProps) {
  const { theme: contextTheme } = useTheme()
  const theme = themeProp ?? contextTheme
  const t = TASK_THEMES[theme]
  const [isEditing, setIsEditing] = useState(false)
  const [draft, setDraft] = useState(value)
  const inputRef = useRef<HTMLInputElement | HTMLSelectElement>(null)

  // Focus before paint so there's no visible delay between the input
  // appearing and being ready to type.
  useLayoutEffect(() => {
    if (isEditing) inputRef.current?.focus()
  }, [isEditing])

  // Open: snapshot the current confirmed value so the user always edits
  // from the latest server state, not whatever value was at component mount.
  const startEditing = useCallback(() => {
    if (disabled) return
    setDraft(value)
    setIsEditing(true)
  }, [disabled, value])

  const commit = useCallback(() => {
    if (draft !== value) onSave(draft)
    setIsEditing(false)
  }, [draft, value, onSave])

  // Cancel: discard unsaved edits by resetting draft to confirmed value.
  const cancel = useCallback(() => {
    setDraft(value)
    setIsEditing(false)
  }, [value])

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') commit()
    if (e.key === 'Escape') cancel()
  }

  return (
    <div className="flex items-center justify-between py-3 gap-4">
      <span className={`text-[13px] font-medium shrink-0 ${t.description}`}>{label}</span>

      {!isEditing ? (
        <button
          type="button"
          disabled={disabled}
          onClick={startEditing}
          className={`text-[13px] text-right truncate max-w-[260px] rounded-[6px] px-2 py-1 -mr-2 transition-colors duration-150 ${disabled
              ? `cursor-default ${t.title}`
              : `cursor-pointer ${t.title} hover:${theme === 'dark' ? 'bg-[#24243a]' : 'bg-[#f5f5f7]'}`
            }`}
          aria-label={`Edit ${label}`}
        >
          {displayValue ?? value}
          {suffix && !disabled ? ` ${suffix}` : ''}
        </button>
      ) : kind === 'select' ? (
        <select
          ref={inputRef as React.RefObject<HTMLSelectElement>}
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onBlur={commit}
          onKeyDown={handleKeyDown}
          className={t.select}
          disabled={isSaving}
        >
          {options?.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      ) : (
        <div className="flex items-center gap-1.5">
          <input
            ref={inputRef as React.RefObject<HTMLInputElement>}
            type={kind === 'number' ? 'number' : 'text'}
            value={draft}
            min={min}
            onChange={(e) => setDraft(e.target.value)}
            onBlur={commit}
            onKeyDown={handleKeyDown}
            disabled={isSaving}
            className={`text-[13px] text-right w-[120px] ${t.input}`}
          />
          {suffix && <span className={`text-[12px] ${t.description}`}>{suffix}</span>}
        </div>
      )}
    </div>
  )
}