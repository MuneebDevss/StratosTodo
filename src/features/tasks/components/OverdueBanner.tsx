'use client'

import { useOverdueTasks } from '../api/use-tasks'
import { useRunReschedule } from '../api/use-reschedule'

export function OverdueBanner() {
  const { data: overdueTasks = [] } = useOverdueTasks()
  const { mutate: runReschedule, isPending, data: result } = useRunReschedule()

  if (overdueTasks.length === 0 && !result) return null

  return (
    <div className="overdue-bar" role="alert" aria-live="polite">
      <div className="overdue-bar__left">
        <svg width="15" height="15" viewBox="0 0 15 15" fill="none" aria-hidden="true">
          <circle cx="7.5" cy="7.5" r="6.5" stroke="currentColor" strokeWidth="1"/>
          <path d="M7.5 4.5v3.5M7.5 10.5v.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
        </svg>
        {result
          ? `${result.rescheduled_count} task${result.rescheduled_count !== 1 ? 's' : ''} rescheduled${result.graveyarded_count > 0 ? ` · ${result.graveyarded_count} need review` : ''}`
          : `${overdueTasks.length} overdue task${overdueTasks.length !== 1 ? 's' : ''} from previous days`
        }
      </div>
      {!result && (
        <button
          className="overdue-bar__cta"
          onClick={() => runReschedule()}
          disabled={isPending}
          aria-busy={isPending}
        >
          {isPending ? 'Rescheduling…' : 'Reschedule now'}
        </button>
      )}
    </div>
  )
}
