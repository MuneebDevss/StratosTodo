'use client'

import { useState, useCallback } from 'react'
import { useDaySchedule, useCreateTask } from '../api/use-tasks'
import { CapacityBar } from './CapacityBar'
import { TaskCard } from './TaskCard'
import { TaskEditShell } from './TaskEditShell'
import { OverdueBanner } from './OverdueBanner'
import { formatDayTitle } from '../utils/format'
import type { DayColumnProps, EditFields } from '../types'
import { useTheme } from '@/features/settings/hooks/use-theme'
import { PAGE_THEME, TASK_THEMES } from '@/Common/Constants/ThemeConstants'


// ─── Helpers ──────────────────────────────────────────────────────────────────
const EMPTY_FIELDS: EditFields = {
  title: '',
  description: '',
  priority: 'medium',
  minutes: '30',
}


export function DayColumn({ date }: DayColumnProps) {
  const { data: schedule, isLoading, isError } = useDaySchedule(date)
  const { main, sub } = formatDayTitle(date)

  const { theme } = useTheme()
  const t = PAGE_THEME[theme]
  const tt = TASK_THEMES[theme]   // for TaskEditShell

  const tasks = schedule?.tasks ?? []
  const pending = tasks.filter((t) => t.status === 'pending')
  const completed = tasks.filter((t) => t.status === 'completed')
  const usedMinutes = schedule?.totalScheduledMinutes ?? 0
  const totalMinutes = schedule?.dailyCapacityMinutes ?? 480

  // ── Inline create ──
  const { mutate: createTask, isPending: isCreating } = useCreateTask()
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
        scheduleDate: date,
      },
      {
        onSuccess: () => {
          setIsAdding(false)
          setFields(EMPTY_FIELDS)
        },
      }
    )
  }, [fields, date, createTask])

  return (
    <div className="flex flex-col h-full">
      {/* Day Header */}
      <div className="flex items-end justify-between mb-6">
        <div>
          <h2 className={`text-2xl font-semibold tracking-tight ${t.heading}`}>
            {main}
          </h2>
          {sub && (
            <p className={`text-sm mt-0.5 ${t.subheading}`}>
              {sub}
            </p>
          )}
        </div>
        <div className={`px-3 py-1 text-xs font-medium rounded-full border ${t.bg} ${t.subheading} ${t.border}`}>
          {new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
        </div>
      </div>

      {/* Capacity Bar */}
      <div className={`${t.bg} ${t.border} border rounded-lg p-4 sm:p-5 lg:p-6 shadow-sm mb-6 transition-all`}>
        <CapacityBar usedMinutes={usedMinutes} totalMinutes={totalMinutes} theme={theme} />
      </div>

      {/* Loading */}
      {isLoading && (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className={`h-20 rounded-2xl animate-pulse ${t.skeleton}`} />
          ))}
        </div>
      )}

      {/* Error */}
      {isError && (
        <div className="bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-900 rounded-2xl p-6 text-center">
          <p className="text-red-600 dark:text-red-400 text-sm">Failed to load tasks for this day.</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-3 inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 active:bg-red-800 rounded-xl transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
          >
            Retry
          </button>
        </div>
      )}

      {/* Main Content */}
      {!isLoading && !isError && (
        <div className="flex-1 flex flex-col">

          {/* Pending section */}
          <div className="flex-1">
            {pending.length > 0 && (
              <div className={`uppercase tracking-[0.075em] text-[10px] font-semibold mb-3 pl-1 ${t.subheading}`}>
                Pending
              </div>
            )}

            <div className="space-y-2.5" role="list">
              {pending.length === 0 && !isAdding && (
                <div>
                  <p className={`font-medium ${t.emptyBody}`}>No pending tasks</p>
                  <p className={`text-sm mt-1 ${t.body}`}>Add one below to get started</p>
                </div>
              )}

              {pending.map((task) => (
                <div key={task.id} role="listitem">
                  <TaskCard task={task} theme={theme} />
                </div>
              ))}

              {/* Inline create shell */}
              {isAdding && (
                <div
                  role="listitem"
                  className={`border rounded-[10px] px-3.5 py-[11px] transition-[border-color,box-shadow] duration-150 ${tt.cardEditing}`}
                >
                  <TaskEditShell
                    fields={fields}
                    onChange={setFields}
                    onSave={submitCreate}
                    onCancel={cancelCreate}
                    isSaving={isCreating}
                    saveLabel="Add task"
                    t={tt}
                    theme={theme}
                  />
                </div>
              )}
            </div>

            {/* Add task button — hidden while shell is open */}
            {!isAdding && (
              <button
                onClick={openShell}
                className={`mt-5 w-full group flex items-center justify-center gap-2.5 py-3.5 px-5 border border-dashed rounded-2xl text-[13px] transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#1a6bff]/40 focus:ring-offset-2 ${tt.actionBtn}`}
                aria-label={`Add task for ${main}`}
              >
                <div className={`w-5 h-5 rounded-full flex items-center justify-center transition-colors ${tt.chipDuration}`}>
                  <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                    <path d="M8 3V13M3 8H13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                </div>
                <span className="font-medium text-sm">Add task</span>
              </button>
            )}

            {/* Spacing when shell is open */}
            {isAdding && <div className="mb-6" />}
          </div>

          {/* Completed */}
          {completed.length > 0 && (
            <details className="mt-8 group">
              <summary className={`flex items-center gap-2.5 text-sm cursor-pointer py-2 select-none list-none transition-colors ${t.subheading} ${t.back}`}>
                <div className="w-4 h-4 flex items-center justify-center transition-transform group-open:rotate-90">
                  <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                    <path d="M6 3L11 8L6 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <span className="font-medium">{completed.length} completed</span>
              </summary>
              <div className="space-y-2.5 mt-3 opacity-75" role="list">
                {completed.map((task) => (
                  <div key={task.id} role="listitem">
                    <TaskCard task={task} theme={theme} />
                  </div>
                ))}
              </div>
            </details>
          )}

        </div>
      )}
    </div>
  )
}