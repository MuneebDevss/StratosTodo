'use client'

import { useState } from 'react'
import { Sidebar } from '@/features/tasks/components/Sidebar'
import { DayColumn } from '@/features/tasks'
import { OverdueBanner } from '@/features/tasks'
import type { Task } from '@/features/tasks'

function todayISO(): string {
  return new Date().toISOString().slice(0, 10)
}

function formatTopbarDate(dateStr: string): string {
  return new Date(dateStr + 'T00:00:00').toLocaleDateString('en-US', {
    month: 'long', day: 'numeric', year: 'numeric',
  })
}

function navigate(dateStr: string, direction: 1 | -1): string {
  const d = new Date(dateStr + 'T00:00:00')
  d.setDate(d.getDate() + direction)
  return d.toISOString().slice(0, 10)
}

export default function DashboardPage() {
  const [selectedDate, setSelectedDate] = useState(todayISO)

  return (
    <div className="flex h-screen bg-[#f5f5f7]">
      <Sidebar />

      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Topbar */}
        <header className="flex items-center gap-3 px-6 py-3.5 bg-white border-b border-[#e8e8ec]/50 shrink-0">
          <span className="text-[15px] font-medium text-[#1a1a2e] flex-1">Dashboard</span>

          {/* Date nav */}
          <div className="flex gap-1">
            <button
              className="w-7 h-7 rounded-[7px] bg-[#f5f5f7] border border-[#e8e8ec]/50 text-[#6b6b80] flex items-center justify-center cursor-pointer transition-background duration-150 hover:bg-[#e8e8f0]"
              aria-label="Previous day"
              onClick={() => setSelectedDate(d => navigate(d, -1))}
            >
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                <path d="M7.5 2L3.5 6l4 4" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>

            <button
              className="h-7 px-2 rounded-[7px] bg-[#f5f5f7] border border-[#e8e8ec]/50 text-[#6b6b80] text-[11px] font-medium cursor-pointer transition-background duration-150 hover:bg-[#e8e8f0]"
              aria-label="Go to today"
              onClick={() => setSelectedDate(todayISO())}
            >
              Today
            </button>

            <button
              className="w-7 h-7 rounded-[7px] bg-[#f5f5f7] border border-[#e8e8ec]/50 text-[#6b6b80] flex items-center justify-center cursor-pointer transition-background duration-150 hover:bg-[#e8e8f0]"
              aria-label="Next day"
              onClick={() => setSelectedDate(d => navigate(d, 1))}
            >
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                <path d="M4.5 2l4 4-4 4" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>

          {/* Date label */}
          <div className="flex items-center gap-1.5 text-[12px] text-[#6b6b80] bg-[#f5f5f7] border border-[#e8e8ec]/50 rounded-lg px-2.5 py-[5px]">
            <svg width="13" height="13" viewBox="0 0 13 13" fill="none" aria-hidden="true">
              <rect x="1" y="2" width="11" height="10" rx="1.5" stroke="currentColor" strokeWidth="1"/>
              <path d="M4 1v2M9 1v2M1 5h11" stroke="currentColor" strokeWidth="1" strokeLinecap="round"/>
            </svg>
            {formatTopbarDate(selectedDate)}
          </div>
        </header>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto px-6 py-5">
          <OverdueBanner />
          <DayColumn
            date={selectedDate}
            onEditTask={(task: Task) => console.log('Edit', task.id)}
            onAddTask={(date) => console.log('Add task for', date)}
          />
        </div>
      </div>
    </div>
  )
}