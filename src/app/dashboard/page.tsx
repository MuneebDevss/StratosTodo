'use client'

import { useState } from 'react'
import { DayColumn } from '@/features/tasks'
import { OverdueBanner } from '@/features/tasks'
import { useTheme } from '@/features/settings/hooks/use-theme'
import { getLocalISODate, navigate } from '@/Common'
import { PAGE_THEME } from '@/Common/Constants/ThemeConstants'

export default function DashboardPage() {
  const [selectedDate, setSelectedDate] = useState(
    () => getLocalISODate(),
  )

  // Shared user preference — same source as Settings page.
  const { theme } = useTheme()
  const t = PAGE_THEME[theme]

  return (
    <div className={`flex flex-1 flex-col overflow-hidden h-screen no-scrollbar`}>
      {/* ── Topbar ── */}
      <header className={`flex items-center gap-3 pl-14 pr-6 sm:px-6 py-3.5 shrink-0  justify-end`}>

        {/* Date nav */}
        <div className="flex gap-1">
          <button
            className={`w-7 h-7 rounded-[7px] border flex items-center justify-center cursor-pointer transition-[background] duration-150 ${t.navBtn}`}
            aria-label="Previous day"
            onClick={() => setSelectedDate(d => navigate(d, -1))}
          >
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
              <path d="M7.5 2L3.5 6l4 4" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>

          <button
            className={`h-7 px-2 rounded-[7px] border text-[11px] font-medium cursor-pointer transition-[background] duration-150 ${t.navBtn}`}
            aria-label="Go to today"
            onClick={() => setSelectedDate(getLocalISODate())}
          >
            Today
          </button>

          <button
            className={`w-7 h-7 rounded-[7px] border flex items-center justify-center cursor-pointer transition-[background] duration-150 ${t.navBtn}`}
            aria-label="Next day"
            onClick={() => setSelectedDate(d => navigate(d, 1))}
          >
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
              <path d="M4.5 2l4 4-4 4" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>

        {/* Date label */}
        <div className={`flex items-center gap-1.5 text-[12px] border rounded-lg px-2.5 py-[5px] ${t.datePill}`}>
          <svg width="13" height="13" viewBox="0 0 13 13" fill="none" aria-hidden="true">
            <rect x="1" y="2" width="11" height="10" rx="1.5" stroke="currentColor" strokeWidth="1" />
            <path d="M4 1v2M9 1v2M1 5h11" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
          </svg>
          {selectedDate}
        </div>
      </header>

      {/* ── Scrollable content ── */}
      <div className="flex-1 overflow-y-auto px-6 py-5">
        <OverdueBanner theme={theme} />
        <DayColumn
          date={selectedDate}
          onAddTask={(date) => console.log('Add task for', date)}
        />
      </div>
    </div>
  )
}