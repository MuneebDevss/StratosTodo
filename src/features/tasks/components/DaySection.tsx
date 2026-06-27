'use client'

import { forwardRef, useState, useCallback } from 'react'
import { TaskCard } from './TaskCard'
import { TaskEditShell } from './TaskEditShell'
import { isToday, formatSectionHeading } from '../utils/format'
import { useCreateTask, useUpdateTask } from '../api/use-tasks'
import { DaySectionProps, DropZoneProps, EditFields } from '../types'
import { TASK_THEMES } from '@/Common/Constants/ThemeConstants'
import { useTheme } from '@/features/settings/hooks/use-theme'
import { AnimatePresence } from 'framer-motion'


// ─── Helpers ──────────────────────────────────────────────────────────────────
const EMPTY_FIELDS: EditFields = {
  title: '',
  description: '',
  priority: 'medium',
  minutes: '30',
}

// ─── DropZone sub-component ───────────────────────────────────────────────────
// Handles reschedule-via-drop for a single day section.
// Kept separate so hooks run unconditionally (no task.id needed at render time).



function DropZone({ date, theme, children }: DropZoneProps) {
  const [isDragOver, setIsDragOver] = useState(false)
  // We need a stable mutate reference; task id is unknown until drop time,
  // so we grab a generic updater that accepts id as part of payload.
  // useUpdateTask requires an id — we'll instantiate a tiny internal hook adapter.
  const [draggedTaskId, setDraggedTaskId] = useState<string | null>(null)
  const { mutate: updateTask } = useUpdateTask(draggedTaskId ?? '__placeholder__')

  const handleDragOver = (e: React.DragEvent) => {
    // Only accept our own task drags
    if (!e.dataTransfer.types.includes('application/task-id')) return
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
    setIsDragOver(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    // Only clear if actually leaving the zone (not entering a child)
    if ((e.currentTarget as HTMLElement).contains(e.relatedTarget as Node)) return
    setIsDragOver(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)

    const taskId = e.dataTransfer.getData('application/task-id')
    const fromDate = e.dataTransfer.getData('application/task-date')

    if (!taskId || fromDate === date) return // same day — no-op

    // updateTask is keyed to task id via the hook; since hooks can't be called
    // conditionally we set the id state and fire in the next tick.
    setDraggedTaskId(taskId)
    // Use a timeout so the state update re-render provides the correct hook instance
    setTimeout(() => {
      updateTask({ scheduleDate: date })
    }, 0)
  }

  const dropRingLight = 'ring-2 ring-[#1a6bff]/30 bg-[#f0f4ff]/60'
  const dropRingDark = 'ring-2 ring-[#3b5bdb]/40 bg-[#1a1a30]/60'

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`rounded-[10px] transition-[box-shadow,background] duration-150 ${isDragOver
        ? theme === 'dark' ? dropRingDark : dropRingLight
        : ''
        }`}
    >
      {children}
    </div>
  )
}


// ─── Component ────────────────────────────────────────────────────────────────

export const DaySection = forwardRef<HTMLDivElement, DaySectionProps>(
  ({ group, theme: themeProp }, ref) => {
    const { theme: contextTheme } = useTheme()
    const theme = themeProp ?? contextTheme
    const heading = formatSectionHeading(group.date)
    const today = isToday(group.date)
    const t = TASK_THEMES[theme]

    const { mutate: createTask, isPending: isCreating } = useCreateTask()

    // ── Create-inline state ──
    const [isAdding, setIsAdding] = useState(false)
    const [fields, setFields] = useState<EditFields>(EMPTY_FIELDS)

    const openShell = () => {
      setFields(EMPTY_FIELDS)
      setIsAdding(true)
    }

    const cancelCreate = useCallback(() => {
      setIsAdding(false)
      setFields(EMPTY_FIELDS)
    }, [])

    const submitCreate = useCallback(() => {
      if (!fields.title.trim()) return
      const minutes = parseInt(fields.minutes, 10)
      createTask(
        {
          title: fields.title.trim(),
          description: fields.description,
          basePriority: fields.priority as 'high' | 'medium' | 'low',
          estimatedMinutes: isNaN(minutes) ? 30 : minutes,
          scheduleDate: group.date,
        },
        {
          onSuccess: () => {
            setIsAdding(false)
            setFields(EMPTY_FIELDS)
          },
        }
      )
    }, [fields, group.date, createTask])

    return (
      <section aria-label={heading}>
        {/* Section heading */}
        <div
          ref={ref}
          className={`text-[13px] font-medium mb-2 py-1 ${today ? 'text-[#1a6bff]' : t.description}`}
          data-date={group.date}
        >
          {heading}
        </div>

        {/* Drop zone wraps the task list area */}
        <DropZone date={group.date} theme={theme}>
          {/* Task list */}
          {group.tasks.length === 0 && !isAdding ? (
            <div className={`flex items-center gap-2 py-2 text-[13px] mb-4 ${t.description}`}>
              Nothing scheduled
            </div>
          ) : (
            <div className="flex flex-col gap-1.5 mb-2" role="list">
              <AnimatePresence mode="popLayout">
                {group.tasks.map((task) => (
                  <div key={task.id} role="listitem">
                    <TaskCard task={task} theme={theme} />
                  </div>
                ))}
              </AnimatePresence>

              {/* Inline create shell — appears at bottom of the list */}
              {isAdding && (
                <div
                  role="listitem"
                  className={`border rounded-[10px] px-3.5 py-[11px] transition-[border-color,box-shadow] duration-150 ${t.cardEditing}`}
                >
                  <TaskEditShell
                    fields={fields}
                    onChange={setFields}
                    onSave={submitCreate}
                    onCancel={cancelCreate}
                    isSaving={isCreating}
                    saveLabel="Add task"
                    t={t}
                    theme={theme}
                  />
                </div>
              )}
            </div>
          )}
        </DropZone>

        {/* Add task button — hidden while shell is open */}
        {!isAdding && (
          <button
            className={`flex items-center gap-2 px-3.5 py-2.5 border-[1.5px] border-dashed rounded-[10px] text-[13px] cursor-pointer bg-transparent w-full mb-6 transition-[border-color,color] duration-150 ${t.actionBtn}`}
            onClick={openShell}
            aria-label={`Add task for ${heading}`}
          >
            <svg width="13" height="13" viewBox="0 0 13 13" fill="none" aria-hidden="true">
              <path d="M6.5 1v11M1 6.5h11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
            Add task
          </button>
        )}

        {/* Spacing when shell is open (replaces button's mb-6) */}
        {isAdding && <div className="mb-6" />}
      </section>
    )
  }
)

DaySection.displayName = 'DaySection'
