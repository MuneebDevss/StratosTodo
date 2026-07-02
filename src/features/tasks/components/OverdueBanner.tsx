'use client'

import { SIDEBAR_THEME, type ThemeKey } from '@/Common/Constants/ThemeConstants'
import { useOverdueTasks } from '../api/use-tasks'
import { useRunReschedule } from '../api/use-reschedule'
import { useTheme } from '@/features/settings/hooks/use-theme'

interface OverdueBannerProps {
  theme?: ThemeKey
}

export function OverdueBanner({ theme: themeProp }: OverdueBannerProps) {
  const { theme: contextTheme } = useTheme()
  const theme = themeProp ?? contextTheme

  const { data: overdueTasks = [] } = useOverdueTasks()
  const { mutate: runReschedule, isPending, data: result } = useRunReschedule()
  const t = SIDEBAR_THEME[theme]

  if (overdueTasks.length === 0 && !result) return null

  const message = result
    ? `${result.seatedCount} task${result.seatedCount !== 1 ? 's' : ''} rescheduled${
        result.graveyardCount > 0 ? ` · ${result.graveyardCount} need review` : ''
      }`
    : `${overdueTasks.length} overdue task${overdueTasks.length !== 1 ? 's' : ''} from previous days`

  return (
    <div
      className={`flex items-center justify-between gap-3 px-3.5 py-2.5 mb-4 rounded-[10px] border text-[13px] font-medium ${t.overdueBar}`}
      role="alert"
      aria-live="polite"
    >
      <div className="flex items-center gap-2">
        <svg width="15" height="15" viewBox="0 0 15 15" fill="none" aria-hidden="true" className="shrink-0">
          <circle cx="7.5" cy="7.5" r="6.5" stroke="currentColor" strokeWidth="1"/>
          <path d="M7.5 4.5v3.5M7.5 10.5v.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
        </svg>
        {message}
      </div>

      {!result && (
        <button
          className={`shrink-0 px-2.5 py-1 rounded-[6px] text-[12px] font-medium cursor-pointer transition-colors duration-150 disabled:opacity-50 ${t.overdueCta}`}
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