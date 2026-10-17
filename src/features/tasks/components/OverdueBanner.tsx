'use client'

import { useState } from 'react'

import { SIDEBAR_THEME, type ThemeKey } from '@/Common/Constants/ThemeConstants'
import { useOverdueTasks } from '../api/use-tasks'
import { useTheme } from '@/features/settings/hooks/use-theme'
import { RescheduleDialog } from './RescheduleDialog'
import type { RescheduleResult } from '../api/use-reschedule'

interface OverdueBannerProps {
  theme?: ThemeKey
}

export function OverdueBanner({ theme: themeProp }: OverdueBannerProps) {
  const { theme: contextTheme } = useTheme()
  const theme = themeProp ?? contextTheme

  const { data: overdueTasks = [] } = useOverdueTasks()
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [result, setResult] = useState<RescheduleResult | null>(null)
  const t = SIDEBAR_THEME[theme]

  if (overdueTasks.length === 0 && !result) return null

  const message = result
    ? `${result.seatedCount} overdue task${result.seatedCount !== 1 ? 's were' : ' was'} rescheduled${
        result.strategy ? ` using ${result.strategy === 'CDU' ? 'Complete Day Update' : result.strategy === 'HPF' ? 'High Priority First' : 'Fill Gaps'}` : ''
      }${result.graveyardCount > 0 ? ` · ${result.graveyardCount} moved to the graveyard` : ''}`
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
          onClick={() => setIsDialogOpen(true)}
        >
          Reschedule Tasks
        </button>
      )}
      <RescheduleDialog
        open={isDialogOpen}
        theme={theme}
        onClose={() => setIsDialogOpen(false)}
        onSuccess={(nextResult) => setResult(nextResult)}
      />
    </div>
  )
}
