'use client'

import { useState, useCallback } from 'react'
import { useDaySchedule, useCreateTask } from '../api/use-tasks'
import { CapacityBar } from './CapacityBar'
import { TaskCard } from './TaskCard'
import { TaskEditShell } from './TaskEditShell'
import { formatDayTitle } from '../utils/format'
import type { DayColumnProps, EditFields } from '../types'
import { useTheme } from '@/features/settings/hooks/use-theme'
import { useUser } from '@/features/auth/api/use-user'
import { PAGE_THEME, TASK_THEMES } from '@/Common/Constants/ThemeConstants'
import { AnimatePresence } from 'framer-motion'
import { DiscardTasksDialog } from './DiscardTasksDialog'


// ─── Helpers ──────────────────────────────────────────────────────────────────
const EMPTY_FIELDS: EditFields = {
  title: '',
  description: '',
  priority: 'medium',
  minutes: '30',
}


export function DayColumn({ date }: DayColumnProps) {
  const { data: schedule, isLoading, isError, refetch } = useDaySchedule(date)
  const { main, sub } = formatDayTitle(date)
  const { data: user } = useUser()

  const { theme } = useTheme()
  const t = PAGE_THEME[theme]
  const tt = TASK_THEMES[theme]   // for TaskEditShell

  const tasks = schedule?.tasks ?? []
  const pending = tasks.filter((t) => t.status === 'pending')
  const completed = tasks.filter((t) => t.status === 'completed')
  const usedMinutes = schedule?.totalScheduledMinutes ?? 0
  const totalMinutes = schedule?.dailyCapacityMinutes ?? 480
  const completedMinutes = schedule?.completedMinutes ?? completed.reduce((sum, task) => sum + (task.estimatedMinutes || 0), 0)
  const minutesLeft = schedule?.minutesLeft ?? pending.reduce((sum, task) => sum + (task.estimatedMinutes || 0), 0)
  const fitsToday = new Set(schedule?.tasksCompletableToday ?? [])
  const hasOverflow = Boolean(schedule?.isCurrentDay && minutesLeft > (schedule?.todayAvailableMinutes ?? 0))
  const projectedCompletion = schedule?.projectedCompletionAt
    ? new Date(schedule.projectedCompletionAt).toLocaleString(undefined, { weekday: 'short', month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit', timeZone: user?.timezone || undefined })
    : null

  // ── Inline create ──
  const { mutate: createTask, isPending: isCreating } = useCreateTask()
  const [isAdding, setIsAdding] = useState(false)
  const [fields, setFields] = useState<EditFields>(EMPTY_FIELDS)
  const [selectedTaskIds, setSelectedTaskIds] = useState<string[]>([])
  const [showDiscardDialog, setShowDiscardDialog] = useState(false)

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
          {new Date(`${date}T00:00:00`).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
        </div>
      </div>

      {/* Capacity Bar */}
      {!isLoading && !isError && <div className={`${t.bg} ${t.border} border rounded-xl p-4 sm:p-5 lg:p-6 shadow-sm mb-6 transition-all`}>
        <CapacityBar usedMinutes={usedMinutes} totalMinutes={totalMinutes} theme={theme} />
      </div>}

      {/* Daily Progress */}
      {!isLoading && !isError && tasks.length > 0 && (
        <div className={`${t.bg} ${t.border} border rounded-lg p-4 sm:p-5 shadow-sm mb-6 transition-all space-y-3.5`}>
          <div className="flex justify-between items-start">
            <div>
              <p className={`text-xs uppercase tracking-wider ${t.subheading}`}>
                Daily progress
              </p>
              <h3 className={`mt-1 text-lg font-semibold ${t.heading}`}>
                {completed.length} of {tasks.length} tasks done
              </h3>
            </div>
            <div className={`px-2.5 py-0.5 text-xs font-semibold rounded-full border ${
              theme === 'light' 
                ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
                : 'bg-emerald-950/50 text-emerald-300 border-emerald-800'
            }`}>
              {tasks.length > 0 ? Math.round((completed.length / tasks.length) * 100) : 0}%
            </div>
          </div>

          <div className="space-y-2">
            <div className={`h-2 overflow-hidden rounded-full ${theme === 'light' ? 'bg-neutral-100' : 'bg-neutral-800'}`}>
              <div
                className={`h-full rounded-full transition-all duration-700 ease-out ${
                  theme === 'light' ? 'bg-emerald-500' : 'bg-emerald-600'
                }`}
                style={{ width: `${tasks.length > 0 ? (completed.length / tasks.length) * 100 : 0}%` }}
                role="progressbar"
                aria-valuenow={tasks.length > 0 ? Math.round((completed.length / tasks.length) * 100) : 0}
                aria-label="Daily task completion"
                aria-valuemin={0}
                aria-valuemax={100}
              />
            </div>
            <div className="flex justify-between text-xs">
              <span className={t.body}>
                {completedMinutes} of {completedMinutes + minutesLeft} minutes completed · {minutesLeft} minutes left
              </span>
              <span className={t.subheading}>
                {tasks.reduce((sum, task) => sum + (task.estimatedMinutes || 0), 0) > 0 
                  ? Math.round((completed.reduce((sum, task) => sum + (task.estimatedMinutes || 0), 0) / tasks.reduce((sum, task) => sum + (task.estimatedMinutes || 0), 0)) * 100)
                  : 0}%
              </span>
            </div>
          </div>
        </div>
      )}

      {!isLoading && !isError && schedule?.isCurrentDay && tasks.length > 0 && projectedCompletion && (
        <div className={`mb-6 rounded-lg border px-4 py-3 text-sm ${hasOverflow
          ? theme === 'dark' ? 'border-amber-800 bg-amber-950/30 text-amber-200' : 'border-amber-200 bg-amber-50 text-amber-900'
          : theme === 'dark' ? 'border-emerald-800 bg-emerald-950/30 text-emerald-200' : 'border-emerald-200 bg-emerald-50 text-emerald-900'}`}>
          <p className="font-semibold">{hasOverflow ? `All pending tasks finish around ${projectedCompletion}.` : `All pending tasks can finish by ${projectedCompletion}.`}</p>
          {hasOverflow && <p className="mt-1 text-xs opacity-85">{fitsToday.size} of {pending.length} pending tasks fit in today’s remaining window. Highlighted tasks are the maximum count that can be completed today.</p>}
        </div>
      )}

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
            onClick={() => refetch()}
            className="mt-3 inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 active:bg-red-800 rounded-xl transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
          >
            Retry
          </button>
        </div>
      )}

      {/* Main Content */}
      {!isLoading && !isError && (
        <div className="flex-1 flex flex-col">

          {selectedTaskIds.length > 0 && (
            <div className={`mb-4 flex items-center justify-between rounded-xl border px-4 py-3 ${t.border} ${t.bg}`}>
              <span className={`text-sm ${t.body}`}>{selectedTaskIds.length} task{selectedTaskIds.length === 1 ? '' : 's'} selected</span>
              <div className="flex gap-2"><button onClick={() => setSelectedTaskIds([])} className={`rounded-lg border px-3 py-2 text-xs ${t.border} ${t.body}`}>Clear</button><button onClick={() => setShowDiscardDialog(true)} className="rounded-lg bg-rose-600 px-3 py-2 text-xs font-semibold text-white">Discard selected</button></div>
            </div>
          )}

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
                  <p className={`font-medium ${t.emptyBody}`}>{tasks.length ? 'You’re all caught up' : 'A little space to plan your day'}</p>
                  <p className={`text-sm mt-1 ${t.body}`}>{tasks.length ? 'Everything scheduled here is done. Add another task when you’re ready.' : 'Add your first task below. Start with what matters most.'}</p>
                </div>
              )}

              {pending.map((task) => (
                <div key={task.id} role="listitem">
                  <AnimatePresence>
                    <TaskCard
                      task={task}
                      theme={theme}
                      canFinishToday={hasOverflow && fitsToday.has(task.id)}
                      spillsOverToday={hasOverflow && !fitsToday.has(task.id)}
                      selectable
                      selected={selectedTaskIds.includes(task.id)}
                      onSelect={(selected) => setSelectedTaskIds(ids => selected ? [...ids, task.id] : ids.filter(id => id !== task.id))}
                    />
                  </AnimatePresence>
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
                className={`my-5 w-full group flex items-center justify-center gap-2.5 py-3.5 px-5 border border-dashed rounded-2xl text-[13px] transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#1a6bff]/40 focus:ring-offset-2 ${tt.actionBtn}`}
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
                <AnimatePresence mode="popLayout">
                  {completed.map((task) => (
                    <div key={task.id} role="listitem">
                      <TaskCard task={task} theme={theme} />
                    </div>
                  ))}
                </AnimatePresence>
              </div>
            </details>
          )}

        </div>
      )}
      <DiscardTasksDialog taskIds={selectedTaskIds} taskCount={selectedTaskIds.length} open={showDiscardDialog} theme={theme} onClose={() => { setShowDiscardDialog(false); setSelectedTaskIds([]) }} />
    </div>
  )
}
