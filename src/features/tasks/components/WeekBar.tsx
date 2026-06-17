'use client'

import { useRef, useEffect } from 'react'
import { isToday } from '../utils/format'

interface WeekBarProps {
  dates: string[]
  activeDate: string
  onDateClick: (date: string) => void
}


interface WeekBarProps {
  dates: string[]
  activeDate: string
  onDateClick: (date: string) => void
}

function formatCell(dateStr: string): { day: string; num: string } {
  const d = new Date(dateStr + 'T00:00:00')
  return {
    day: d.toLocaleDateString('en-US', { weekday: 'short' }),
    num: String(d.getDate()),
  }
}

function getMonthLabel(dates: string[]): string {
  if (!dates.length) return ''
  const d = new Date(dates[0] + 'T00:00:00')
  return d.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
}

export function WeekBar({ dates, activeDate, onDateClick }: WeekBarProps) {
  const activeRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    activeRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' })
  }, [activeDate])

  return (
    <div>
      <div className="text-[11px] font-medium text-[#9898a8] uppercase tracking-[0.06em] px-4 pt-3 pb-1">
        {getMonthLabel(dates)}
      </div>
      <div
        className="flex overflow-x-auto gap-1 px-4 pb-3 scrollbar-none"
        role="tablist"
        aria-label="Week navigation"
      >
        {dates.map((date) => {
          const { day, num } = formatCell(date)
          const isActive = date === activeDate
          const todayDate = isToday(date)

          return (
            <button
              key={date}
              ref={isActive ? activeRef : undefined}
              role="tab"
              aria-selected={isActive}
              aria-label={`${day} ${num}${todayDate ? ', Today' : ''}`}
              className={`flex flex-col items-center gap-0.5 px-3 py-2 rounded-lg min-w-[44px] cursor-pointer border transition-[background,color,border-color] duration-150 ${
                isActive
                  ? 'bg-[#1a6bff] text-white border-[#1a6bff]'
                  : todayDate
                  ? 'bg-[#eff3ff] text-[#1a6bff] border-[#eff3ff]'
                  : 'bg-transparent text-[#6b6b80] border-[#e8e8ec]/50 hover:bg-[#f0f0f6] hover:text-[#1a1a2e]'
              }`}
              onClick={() => onDateClick(date)}
            >
              <span className="text-[10px] font-medium uppercase tracking-wide">{day}</span>
              <span className={`text-[14px] font-semibold leading-none ${isActive ? 'text-white' : ''}`}>{num}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}