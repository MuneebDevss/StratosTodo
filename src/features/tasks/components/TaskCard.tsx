'use client'

import { useCompleteTask, useDeleteTask } from '../api/use-tasks'
import { formatDuration, PRIORITY_CONFIG } from '../utils/format'
import type { Task } from '../types'

interface TaskCardProps {
  task: Task
  onEdit?: (task: Task) => void
}

const PRIORITY_CHIP: Record<string, string> = {
  high: 'chip chip--high',
  medium: 'chip chip--med',
  low: 'chip chip--low',
}

export function TaskCard({ task, onEdit }: TaskCardProps) {
  const { mutate: complete, isPending: isCompleting } = useCompleteTask()
  const { mutate: deleteTask, isPending: isDeleting } = useDeleteTask()

  const isCompleted = task.status === 'completed'
  const isPending = isCompleting || isDeleting
  const priority = PRIORITY_CONFIG[task.base_priority]

  return (
    <div className={`task-card ${isCompleted ? 'task-card--done' : ''}`}>
      {/* Checkbox */}
      <button
        className={`task-card__check ${isCompleted ? 'task-card__check--done' : ''}`}
        onClick={() => !isCompleted && !isPending && complete({ id: task.id })}
        disabled={isPending || isCompleted}
        aria-label={isCompleted ? 'Completed' : 'Mark as complete'}
      >
        {isCompleted && (
          <svg width="9" height="9" viewBox="0 0 9 9" fill="none" aria-hidden="true">
            <path d="M1.5 4.5l2.5 2.5 4-4" stroke="#fff" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        )}
      </button>

      {/* Body */}
      <div className="task-card__body">
        <div className={`task-card__title ${isCompleted ? 'task-card__title--done' : ''}`}>
          {task.title}
        </div>
        <div className="task-card__chips">
          <span className={PRIORITY_CHIP[task.base_priority]}>
            <svg width="6" height="6" viewBox="0 0 6 6" fill="currentColor" aria-hidden="true">
              <circle cx="3" cy="3" r="3"/>
            </svg>
            {priority.label} priority
          </span>
          <span className="chip chip--dur">
            <svg width="11" height="11" viewBox="0 0 11 11" fill="none" aria-hidden="true">
              <circle cx="5.5" cy="5.5" r="4.5" stroke="currentColor" strokeWidth="1"/>
              <path d="M5.5 3v2.5l1.5 1" stroke="currentColor" strokeWidth="1" strokeLinecap="round"/>
            </svg>
            {formatDuration(task.estimated_minutes)}
          </span>
          {task.bump_count > 0 && (
            <span className="chip chip--bump" title={`Rescheduled ${task.bump_count} time${task.bump_count > 1 ? 's' : ''}`}>
              <svg width="11" height="11" viewBox="0 0 11 11" fill="none" aria-hidden="true">
                <path d="M9 5.5A3.5 3.5 0 112 5.5" stroke="currentColor" strokeWidth="1" strokeLinecap="round"/>
                <path d="M9 3v2.5H6.5" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Bumped {task.bump_count}×
            </span>
          )}
          {task.plan_id && (
            <span className="chip chip--plan">
              <svg width="11" height="11" viewBox="0 0 11 11" fill="none" aria-hidden="true">
                <path d="M5.5 1l1.2 3.6H10L7 6.8l1.1 3.7L5.5 8.4 2.9 10.5 4 6.8 1 4.6h3.3L5.5 1z" stroke="currentColor" strokeWidth="0.8" strokeLinejoin="round"/>
              </svg>
              Plan
            </span>
          )}
        </div>
      </div>

      {/* Score */}
      <span className="task-card__score" aria-label={`Score ${task.composite_score.toFixed(1)}`}>
        {task.composite_score.toFixed(1)}
      </span>

      {/* Actions */}
      <div className="task-card__actions">
        {onEdit && (
          <button
            className="task-card__action"
            onClick={() => onEdit(task)}
            disabled={isPending}
            aria-label="Edit task"
          >
            <svg width="13" height="13" viewBox="0 0 13 13" fill="none" aria-hidden="true">
              <path d="M9 2l2 2L4 11H2V9L9 2z" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        )}
        <button
          className="task-card__action task-card__action--delete"
          onClick={() => !isPending && deleteTask({ id: task.id, date: task.scheduled_date })}
          disabled={isPending}
          aria-label="Delete task"
        >
          <svg width="13" height="13" viewBox="0 0 13 13" fill="none" aria-hidden="true">
            <path d="M2 3.5h9M4.5 3.5V2.5a1 1 0 011-1h2a1 1 0 011 1v1M5.5 6v3M7.5 6v3M3 3.5l.5 7a1 1 0 001 1h4a1 1 0 001-1l.5-7" stroke="currentColor" strokeWidth="1" strokeLinecap="round"/>
          </svg>
        </button>
      </div>
    </div>
  )
}
