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
  const usedMinutes = schedule?.total_scheduled_minutes ?? 0
  const totalMinutes = schedule?.daily_capacity_minutes ?? 480

  return (
    <>
      {/* Day header */}
      <div className="day-header">
        <div className="day-title">
          {main}
          {sub && <span>{sub}</span>}
        </div>
      </div>

      {/* Capacity bar */}
      <div className="cap-card">
        <CapacityBar usedMinutes={usedMinutes} totalMinutes={totalMinutes} />
      </div>

      {/* Overdue banner */}
      <OverdueBanner />

      {/* Skeleton */}
      {isLoading && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          {[1, 2, 3].map((i) => (
            <div key={i} style={{
              height: '64px',
              background: 'var(--border)',
              borderRadius: '10px',
              opacity: 0.5,
            }} />
          ))}
        </div>
      )}

      {/* Error */}
      {isError && (
        <p role="alert" style={{ fontSize: '13px', color: 'var(--priority-high)', padding: '8px 0' }}>
          Failed to load tasks.{' '}
          <button
            onClick={() => window.location.reload()}
            style={{ background: 'none', border: 'none', color: 'var(--accent)', cursor: 'pointer', fontSize: 'inherit', textDecoration: 'underline' }}
          >
            Retry
          </button>
        </p>
      )}

      {/* Pending tasks */}
      {!isLoading && !isError && (
        <>
          {pending.length > 0 && (
            <div className="section-label">Pending</div>
          )}

          <div className="task-list" role="list">
            {pending.length === 0 ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 0', fontSize: '13px', color: 'var(--text-muted)' }}>
                <svg width="15" height="15" viewBox="0 0 15 15" fill="none" aria-hidden="true">
                  <circle cx="7.5" cy="7.5" r="6.5" stroke="currentColor" strokeWidth="1"/>
                </svg>
                Nothing scheduled
              </div>
            ) : (
              pending.map((task) => (
                <div key={task.id} role="listitem">
                  <TaskCard task={task} onEdit={onEditTask} />
                </div>
              ))
            )}
          </div>

          {/* Add task */}
          {onAddTask && (
            <button
              className="add-task-btn"
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
            <details style={{ marginTop: '12px' }}>
              <summary className="done-toggle">
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                  <path d="M2 6l3 3 5-5" stroke="var(--success)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                {completed.length} completed
              </summary>
              <div className="done-tasks" role="list">
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
