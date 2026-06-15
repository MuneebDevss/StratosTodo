'use client'

import { useState } from 'react'
import { DayColumn } from '@/features/tasks'
import { OverdueBanner } from '@/features/tasks'
import type { Task } from '@/features/tasks'
import '@/features/tasks/styles/dashboard.css'

function todayISO(): string {
  return new Date().toISOString().slice(0, 10)
}

function formatTopbarDate(dateStr: string): string {
  return new Date(dateStr + 'T00:00:00').toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  })
}

function navigate(dateStr: string, direction: 1 | -1): string {
  const d = new Date(dateStr + 'T00:00:00')
  d.setDate(d.getDate() + direction)
  return d.toISOString().slice(0, 10)
}

export default function DashboardPage() {
  const [selectedDate, setSelectedDate] = useState(todayISO)

  const handleEditTask = (task: Task) => {
    console.log('Edit task', task.id)
  }

  const handleAddTask = (date: string) => {
    console.log('Add task for', date)
  }

  return (
    <div className="dashboard-shell">
      {/* Sidebar */}
      <nav className="sidebar" aria-label="Main navigation">
        <div className="sidebar__logo" aria-label="StratosToDo">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <path d="M2 4h12M2 8h8M2 12h5" stroke="#fff" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
        </div>
        <button className="sidebar__item active" title="Dashboard" aria-label="Dashboard" aria-current="page">
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
            <rect x="2" y="2" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.25"/>
            <rect x="10" y="2" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.25"/>
            <rect x="2" y="10" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.25"/>
            <rect x="10" y="10" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.25"/>
          </svg>
        </button>
        <button className="sidebar__item" title="Calendar" aria-label="Calendar">
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
            <rect x="2" y="3" width="14" height="13" rx="2" stroke="currentColor" strokeWidth="1.25"/>
            <path d="M6 2v2M12 2v2M2 7h14" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round"/>
          </svg>
        </button>
        <button className="sidebar__item" title="Plans" aria-label="AI Plans">
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
            <path d="M9 2l1.5 4.5H15l-3.75 2.75L12.75 14 9 11.25 5.25 14l1.5-4.75L3 6.5h4.5L9 2z" stroke="currentColor" strokeWidth="1.25" strokeLinejoin="round"/>
          </svg>
        </button>
        <button className="sidebar__item" title="Needs Review" aria-label="Needs Review">
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
            <path d="M9 3v6M9 13v.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            <circle cx="9" cy="9" r="7" stroke="currentColor" strokeWidth="1.25"/>
          </svg>
        </button>
        <div className="sidebar__bottom">
          <button className="sidebar__item" title="Settings" aria-label="Settings">
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
              <circle cx="9" cy="9" r="2.5" stroke="currentColor" strokeWidth="1.25"/>
              <path d="M9 2v1.5M9 14.5V16M2 9h1.5M14.5 9H16M3.93 3.93l1.06 1.06M13 13l1.07 1.07M14.07 3.93L13 5M5 13l-1.07 1.07" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round"/>
            </svg>
          </button>
        </div>
      </nav>

      {/* Main */}
      <div className="main">
        {/* Topbar */}
        <header className="topbar">
          <span className="topbar__title">Dashboard</span>
          <div style={{ display: 'flex', gap: '4px' }}>
            <button
              className="nav-btn"
              aria-label="Previous day"
              onClick={() => setSelectedDate(d => navigate(d, -1))}
            >
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                <path d="M7.5 2L3.5 6l4 4" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
            <button
              className="nav-btn"
              aria-label="Go to today"
              onClick={() => setSelectedDate(todayISO())}
              style={{ fontSize: '11px', fontWeight: 500, width: 'auto', padding: '0 8px' }}
            >
              Today
            </button>
            <button
              className="nav-btn"
              aria-label="Next day"
              onClick={() => setSelectedDate(d => navigate(d, 1))}
            >
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                <path d="M4.5 2l4 4-4 4" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>
          <div className="topbar__date">
            <svg width="13" height="13" viewBox="0 0 13 13" fill="none" aria-hidden="true">
              <rect x="1" y="2" width="11" height="10" rx="1.5" stroke="currentColor" strokeWidth="1"/>
              <path d="M4 1v2M9 1v2M1 5h11" stroke="currentColor" strokeWidth="1" strokeLinecap="round"/>
            </svg>
            {formatTopbarDate(selectedDate)}
          </div>
        </header>
        {/*Overdue Banner*/}
        <OverdueBanner />
        {/* Single-column content — matches the HTML reference exactly */}
        <div className="content">
          <DayColumn
            date={selectedDate}
            onEditTask={handleEditTask}
            onAddTask={handleAddTask}
          />
        </div>
      </div>
    </div>
  )
}
