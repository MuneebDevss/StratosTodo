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
  return { main: today ? 'Today' : formatDateLabel(dateStr), sub: today ? sub : '' }
}

export function DayColumn({ date, onEditTask, onAddTask }: DayColumnProps) {
  const { data: schedule, isLoading, isError } = useDaySchedule(date)
  const { main, sub } = formatDayTitle(date)

  const tasks = schedule?.tasks ?? []
  const pending = tasks.filter((t) => t.status === 'pending')
  const completed = tasks.filter((t) => t.status === 'completed')
  const usedMinutes = schedule?.totalScheduledMinutes ?? 0
  const totalMinutes = schedule?.dailyCapacityMinutes ?? 480

  return (
    <>
      {/* Day header */}
      <div className="flex items-center justify-between mb-3.5">
        <div className="text-[17px] font-medium text-[#1a1a2e]">
          {main}
          {sub && <span className="text-[13px] font-normal text-[#9898a8] ml-1.5">{sub}</span>}
        </div>
      </div>

      {/* Capacity bar */}
      <div className="bg-white border border-[#e8e8ec]/50 rounded-xl px-4 py-[13px] mb-3.5">
        <CapacityBar usedMinutes={usedMinutes} totalMinutes={totalMinutes} />
      </div>

      {/* Overdue banner */}
      <OverdueBanner />

      {/* Skeleton */}
      {isLoading && (
        <div className="flex flex-col gap-1.5">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-16 bg-[#e8e8ec] rounded-[10px] opacity-50"
            />
          ))}
        </div>
      )}

      {/* Error */}
      {isError && (
        <p role="alert" className="text-[13px] text-[#c94020] py-2">
          Failed to load tasks.{' '}
          <button
            onClick={() => window.location.reload()}
            className="bg-transparent border-none text-[#1a6bff] cursor-pointer text-[13px] underline"
          >
            Retry
          </button>
        </p>
      )}

      {/* Pending tasks */}
      {!isLoading && !isError && (
        <>
          {pending.length > 0 && (
            <div className="text-[11px] font-medium text-[#9898a8] uppercase tracking-[0.06em] mt-1 mb-2">
              Pending
            </div>
          )}

          <div className="flex flex-col gap-1.5 mb-4" role="list">
            {pending.length === 0 ? (
              <div className="flex items-center gap-2 py-2 text-[13px] text-[#9898a8]">
                <svg width="15" height="15" viewBox="0 0 15 15" fill="none" aria-hidden="true">
                  <circle cx="7.5" cy="7.5" r="6.5" stroke="currentColor" strokeWidth="1"/>
                </svg>
                Nothing scheduled
              </div>
            ) : (
              pending.map((task) => (
                <div key={task.id} role="listitem">
                  <TaskCard task={task} />
                </div>
              ))
            )}
          </div>

          {/* Add task */}
          {onAddTask && (
            <button
              className="flex items-center gap-2 px-3.5 py-2.5 border-[1.5px] border-dashed border-[#e8e8ec] rounded-[10px] text-[#9898a8] text-[13px] cursor-pointer bg-transparent w-full transition-[border-color,color] duration-150 hover:border-[#1a6bff] hover:text-[#1a6bff]"
              onClick={() => onAddTask(date)}
              aria-label={`Add task for ${main}`}
            >
              <svg width="13" height="13" viewBox="0 0 13 13" fill="none" aria-hidden="true">
                <path d="M6.5 1v11M1 6.5h11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
              Add task
            </button>
          )}

          {/* Completed */}
          {completed.length > 0 && (
            <details className="mt-3">
              <summary className="flex items-center gap-1.5 text-[11px] text-[#9898a8] cursor-pointer py-1.5 select-none list-none [&::-webkit-details-marker]:hidden">
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                  <path d="M2 6l3 3 5-5" stroke="#22b573" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                {completed.length} completed
              </summary>
              <div className="flex flex-col gap-[5px] mt-2 opacity-60" role="list">
                {completed.map((task) => (
                  <div key={task.id} role="listitem">
                    <TaskCard task={task} />
                  </div>
                ))}
              </div>
            </details>
          )}
        </>
      )}
    </>
  )
}