'use client'

/**
 * TaskEditShell
 * ─────────────
 * The shared inline-editing skeleton used by:
 *   • TaskCard   — double-click to edit an existing task
 *   • DaySection — "Add task" expands into this for task creation
 *
 * Renders the same fields (title, priority, duration, description)
 * plus a Save / Cancel footer with ⌘↵ hint.
 */

import { useRef, useEffect } from 'react'
import type { THEMES } from './TaskCard'

// ─── Public types ─────────────────────────────────────────────────────────────

export interface EditFields {
  title: string
  description: string
  priority: string
  minutes: string
}

export interface TaskEditShellProps {
  fields: EditFields
  onChange: (fields: EditFields) => void
  onSave: () => void
  onCancel: () => void
  isSaving?: boolean
  saveLabel?: string
  /** Themed token set from THEMES['light'] or THEMES['dark'] */
  t: (typeof THEMES)[keyof typeof THEMES]
  theme: 'light' | 'dark'
}

// ─── Component ────────────────────────────────────────────────────────────────

export function TaskEditShell({
  fields,
  onChange,
  onSave,
  onCancel,
  isSaving = false,
  saveLabel = 'Save',
  t,
  theme,
}: TaskEditShellProps) {
  const titleRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    titleRef.current?.focus()
  }, [])

  const set =
    (key: keyof EditFields) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
      onChange({ ...fields, [key]: e.target.value })

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') onCancel()
    if (e.key === 'Enter' && e.metaKey) onSave()
  }

  return (
    <div className="flex flex-col gap-2.5" onKeyDown={handleKeyDown}>
      {/* ── Main row ── */}
      <div className="flex items-start gap-3">
        {/* Placeholder checkbox — visual alignment, not interactive during create */}
        <div
          className={`mt-[1px] w-[17px] h-[17px] rounded-[5px] border-[1.5px] shrink-0 ${
            theme === 'dark' ? 'border-[#3a3a55]' : 'border-[#d0d0da]'
          }`}
          aria-hidden="true"
        />

        <div className="flex-1 min-w-0">
          {/* Title input */}
          <input
            ref={titleRef}
            value={fields.title}
            onChange={set('title')}
            className={`w-full text-[13px] font-medium mb-1.5 ${t.input}`}
            placeholder="Task title"
            aria-label="Task title"
          />

          {/* Chips row */}
          <div className="flex items-center gap-1.5 flex-wrap">
            {/* Priority select */}
            <select
              value={fields.priority}
              onChange={set('priority')}
              className={t.select}
              aria-label="Priority"
            >
              <option value="high">🔴 High</option>
              <option value="medium">🟡 Medium</option>
              <option value="low">🔵 Low</option>
            </select>

            {/* Duration input */}
            <div className="inline-flex items-center gap-1">
              <svg width="11" height="11" viewBox="0 0 11 11" fill="none" aria-hidden="true" className={t.score}>
                <circle cx="5.5" cy="5.5" r="4.5" stroke="currentColor" strokeWidth="1"/>
                <path d="M5.5 3v2.5l1.5 1" stroke="currentColor" strokeWidth="1" strokeLinecap="round"/>
              </svg>
              <input
                type="number"
                value={fields.minutes}
                onChange={set('minutes')}
                className={t.durationInput}
                min={1}
                aria-label="Estimated minutes"
                title="Estimated minutes"
              />
              <span className={`text-[11px] ${t.description}`}>min</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Description textarea ── */}
      <textarea
        value={fields.description}
        onChange={set('description')}
        className={t.textarea}
        rows={2}
        placeholder="Add a description… (optional)"
        aria-label="Description"
      />

      {/* ── Footer ── */}
      <div className="flex items-center justify-between">
        <span className={`text-[10px] ${t.score}`}>⌘↵ save · Esc cancel</span>
        <div className="flex gap-1.5">
          <button
            type="button"
            className={`h-6 px-2.5 rounded-[6px] border text-[11px] font-medium cursor-pointer transition-[background,color] duration-150 ${t.cancelBtn}`}
            onClick={onCancel}
            disabled={isSaving}
          >
            Cancel
          </button>
          <button
            type="button"
            className={`h-6 px-2.5 rounded-[6px] text-[11px] font-medium cursor-pointer transition-[background] duration-150 ${t.saveBtn} disabled:opacity-50`}
            onClick={onSave}
            disabled={isSaving || !fields.title.trim()}
          >
            {isSaving ? 'Adding…' : saveLabel}
          </button>
        </div>
      </div>
    </div>
  )
}