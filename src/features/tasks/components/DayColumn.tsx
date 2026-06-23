'use client'

import { useDaySchedule } from '../api/use-tasks'
import { CapacityBar } from './CapacityBar'
import { TaskCard } from './TaskCard'
import { OverdueBanner } from './OverdueBanner'
import { formatDateLabel, isToday } from '../utils/format'
import type { Task } from '../types'

interface DayColumnProps {
  date: string
  onEditTask?: (task: Task) => void
  onAddTask?: (date: string) => void
}

function formatDayTitle(dateStr: string): { main: string; sub: string } {
  const d = new Date(dateStr + 'T00:00:00')
  const today = isToday(dateStr)
  const sub = d.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })
  return { 
    main: today ? 'Today' : formatDateLabel(dateStr), 
    sub: today ? sub : '' 
  }
}

export function DayColumn({ date, onAddTask }: DayColumnProps) {
  const { data: schedule, isLoading, isError } = useDaySchedule(date)
  const { main, sub } = formatDayTitle(date)

  const tasks = schedule?.tasks ?? []
  const pending = tasks.filter((t) => t.status === 'pending')
  const completed = tasks.filter((t) => t.status === 'completed')
  const usedMinutes = schedule?.totalScheduledMinutes ?? 0
  const totalMinutes = schedule?.dailyCapacityMinutes ?? 480

  return (
    <div className="flex flex-col h-full">
      {/* Day Header */}
      <div className="flex items-end justify-between mb-6">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight text-neutral-900 dark:text-white">
            {main}
          </h2>
          {sub && (
            <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-0.5">
              {sub}
            </p>
          )}
        </div>
        
        {/* Optional day indicator pill */}
        <div className="px-3 py-1 text-xs font-medium rounded-full bg-neutral-100 dark:bg-neutral-800 text-neutral-500 dark:text-neutral-400 border border-neutral-200 dark:border-neutral-700">
          {new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
        </div>
      </div>

      {/* Capacity Bar */}
      <div className="mb-6 bg-white dark:bg-neutral-900 rounded-2xl p-5 border border-neutral-200 dark:border-neutral-800 shadow-sm">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-neutral-600 dark:text-neutral-400">Daily Capacity</span>
          <span className="text-sm font-mono text-neutral-500 dark:text-neutral-400 tabular-nums">
            {Math.round((usedMinutes / totalMinutes) * 100)}%
          </span>
        </div>
        <CapacityBar usedMinutes={usedMinutes} totalMinutes={totalMinutes} />
      </div>

      {/* Overdue Banner */}
      <div className="mb-6">
        <OverdueBanner />
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-20 bg-neutral-200 dark:bg-neutral-800 rounded-2xl animate-pulse"
            />
          ))}
        </div>
      )}

      {/* Error State */}
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
          {/* Pending Tasks Section */}
          <div className="flex-1">
            {pending.length > 0 && (
              <div className="uppercase tracking-[0.075em] text-[10px] font-semibold text-neutral-500 dark:text-neutral-400 mb-3 pl-1">
                Pending Tasks
              </div>
            )}

            <div className="space-y-2.5" role="list">
              {pending.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 px-4 text-center border border-dashed border-neutral-300 dark:border-neutral-700 rounded-3xl bg-neutral-50 dark:bg-neutral-900/50">
                  <div className="w-11 h-11 rounded-full border border-neutral-200 dark:border-neutral-700 flex items-center justify-center mb-4">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                      <path d="M12 6v12M6 12h12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                    </svg>
                  </div>
                  <p className="text-neutral-400 dark:text-neutral-500 font-medium">No pending tasks</p>
                  <p className="text-neutral-500 dark:text-neutral-400 text-sm mt-1">Add one below to get started</p>
                </div>
              ) : (
                pending.map((task) => (
                  <div key={task.id} role="listitem">
                    <TaskCard task={task} />
                  </div>
                ))
              )}
            </div>

            {/* Add Task Button */}
            {onAddTask && (
              <button
                onClick={() => onAddTask(date)}
                className="mt-5 w-full group flex items-center justify-center gap-2.5 py-3.5 px-5 border border-dashed border-neutral-300 dark:border-neutral-700 hover:border-blue-500 dark:hover:border-blue-400 rounded-2xl text-neutral-500 hover:text-blue-600 dark:text-neutral-400 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/50 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                aria-label={`Add new task for ${main}`}
              >
                <div className="w-5 h-5 rounded-full bg-neutral-100 dark:bg-neutral-800 group-hover:bg-blue-100 dark:group-hover:bg-blue-900 flex items-center justify-center transition-colors">
                  <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                    <path d="M8 3V13M3 8H13" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                </div>
                <span className="font-medium text-sm">Add task</span>
              </button>
            )}
          </div>

          {/* Completed Tasks */}
          {completed.length > 0 && (
            <details className="mt-8 group">
              <summary className="flex items-center gap-2.5 text-sm text-neutral-500 dark:text-neutral-400 cursor-pointer py-2 select-none list-none hover:text-neutral-700 dark:hover:text-neutral-300 transition-colors">
                <div className="w-4 h-4 flex items-center justify-center transition-transform group-open:rotate-90">
                  <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                    <path d="M6 3L11 8L6 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <span className="font-medium">
                  {completed.length} completed
                </span>
              </summary>
              
              <div className="space-y-2.5 mt-3 opacity-75" role="list">
                {completed.map((task) => (
                  <div key={task.id} role="listitem">
                    <TaskCard task={task} />
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