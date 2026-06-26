'use client'
import React, { useState, useEffect, useRef, useMemo } from 'react'

import { useUpcoming } from '@/features/tasks/hooks/use-upcoming'
import { Task } from '@/features/tasks'
import { DaySection } from '@/features/tasks/components/DaySection'
import { useTheme } from '@/features/settings/hooks/use-theme'
import { PAGE_THEME } from '@/Common/Constants/ThemeConstants'

// Helper utilities for date management
function parseISO(dateStr: string): Date {
  return new Date(dateStr + 'T00:00:00')
}

function getDayDetails(dateStr: string) {
  const date = parseISO(dateStr)
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
  const todayStr = formatLocalDate(new Date()) // <-- CHANGED

  return {
    dayName: days[date.getDay()],
    dayNum: date.getDate(),
    isToday: todayStr === dateStr
  }
}

function formatLocalDate(date: Date): string {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

export default function UpcomingPage() {

  // Initialize with today's date (e.g., '2026-06-15')
  const [windowStart] = useState(() => {
    const today = new Date();
    const distanceToMonday = today.getDay() === 0 ? -6 : 1 - today.getDay();
    today.setDate(today.getDate() + distanceToMonday);
    return formatLocalDate(today); // <-- CHANGED
  })

  const [activeDate, setActiveDate] = useState(() => formatLocalDate(new Date())) // <-- CHANGED
  const [windowSize, setWindowSize] = useState(14) // Start with 2 weeks, expand dynamically

  const { theme } = useTheme()
  const t = PAGE_THEME[theme]


  const { dayGroups, isLoading, overdueTasks } = useUpcoming(windowStart, windowSize)

  // 1. Calculate the active month/year text dynamically
  const displayMonthYear = useMemo(() => {
    const d = new Date(activeDate + 'T00:00:00')
    return d.toLocaleString('default', { month: 'long', year: 'numeric' })
  }, [activeDate])



  // Maintain references to day elements for Intersection Observer & Auto-scrolling
  const sectionRefs = useRef<Map<string, HTMLDivElement>>(new Map())
  const bottomObserverRef = useRef<HTMLDivElement>(null)

  // 1. Intersection Observer to highlight active day in horizontal bar on scroll
  useEffect(() => {
    if (dayGroups.length === 0) return

    const observerOptions = {
      root: null, // Viewport
      rootMargin: '-80px 0px -70% 0px', // Focus window near top of screen
      threshold: 0,
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const date = entry.target.getAttribute('data-date')
          if (date) setActiveDate(date)
        }
      })
    }, observerOptions)

    // Observe each day heading/wrapper container
    sectionRefs.current.forEach((el) => {
      if (el) observer.observe(el)
    })

    return () => observer.disconnect()
  }, [dayGroups])

  // 2. Infinite Scroll Observer: Load more days when reaching the bottom
  useEffect(() => {
    const bottomEl = bottomObserverRef.current
    if (!bottomEl) return

    const infiniteObserver = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !isLoading) {
          // Dynamically load another week
          setWindowSize((prev) => prev + 7)
        }
      },
      { rootMargin: '400px' } // Pre-fetch before user hits absolute bottom
    )

    infiniteObserver.observe(bottomEl)
    return () => infiniteObserver.disconnect()
  }, [isLoading])

  // Scroll handler for clicking elements in the horizontal week bar
  const scrollToDay = (date: string) => {
    const targetEl = sectionRefs.current.get(date)
    if (targetEl) {
      const headerOffset = 140 // Accounts for fixed header heights
      const elementPosition = targetEl.getBoundingClientRect().top + window.scrollY
      const offsetPosition = elementPosition - headerOffset

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      })
      setActiveDate(date)
    }
  }


  // 2. Derive the 7-day row elements reactively from the scrolling focused date
  const topBarDays = useMemo(() => {
    const current = new Date(activeDate + 'T00:00:00')
    const dayOfWeek = current.getDay()

    const distanceToMonday = dayOfWeek === 0 ? -6 : 1 - dayOfWeek
    const monday = new Date(current)
    monday.setDate(current.getDate() + distanceToMonday)

    const daysArr: string[] = []
    for (let i = 0; i < 7; i++) {
      const nextDay = new Date(monday)
      nextDay.setDate(monday.getDate() + i)
      daysArr.push(formatLocalDate(nextDay))
    }
    return daysArr
  }, [activeDate])

  return (
    <div className={`flex flex-col min-h-screen ${t.bg} ${t.body} font-sans antialiased selection:bg-orange-500/30`}>

      {/* STICKY HEADER AND CALENDAR STRIP */}
      <header className={`sticky top-0 ${t.bg} border-b ${t.border} pt-4 sm:pt-6 pb-2 px-4 sm:px-8 z-10`}>
        <div className="max-w-4xl mx-auto">
          {/* Top Title Action Row */}
          <div className="flex flex-col items-center sm:flex-row sm:items-center justify-between gap-4 mb-4 sm:mb-6">
            <div className="flex items-center gap-3">
              <h1 className={`text-xl sm:text-2xl font-bold ${t.heading}`}>Upcoming</h1>
              <button className={`flex items-center gap-1 text-sm ${t.back} transition mt-0.5 font-medium`}>
                {displayMonthYear}
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
            </div>

            <div className={`flex items-center justify-between sm:justify-end gap-2 sm:gap-4 text-sm ${t.subheading}`}>
              <button className={`flex items-center gap-1.5 transition px-2 py-1 rounded ${t.sidebarHoverBg} ${t.sidebarHoverText}`}>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                <span className="inline sm:hidden md:inline">Connect calendar</span>
                <span className="hidden sm:inline md:hidden">Connect</span>
              </button>
              <div className={`w-px h-4 ${t.divider}`} />
              <button className={`flex items-center gap-1.5 transition px-2 py-1 rounded ${t.sidebarHoverBg} ${t.sidebarHoverText}`}>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h7" />
                </svg>
                Display
              </button>
            </div>
          </div>

          {/* 7-Day Horizontal Week Grid Selector */}
          <div className={`grid grid-cols-7 border-b ${t.border} pb-1 text-center gap-1`}>
            {topBarDays.map((dateStr) => {
              const { dayName, dayNum, isToday } = getDayDetails(dateStr)
              const isActive = activeDate === dateStr

              return (
                <button
                  key={dateStr}
                  onClick={() => scrollToDay(dateStr)}
                  className="flex flex-col items-center gap-1 group py-1.5 sm:py-2 rounded-lg transition relative w-full"
                >
                  <span className={`text-[9px] sm:text-[11px] font-semibold uppercase tracking-wider ${isToday ? 'text-[#ff544a]' : `${t.subheading} group-hover:text-current`
                    }`}>
                    {dayName}
                  </span>

                  <span className={`text-[10px] sm:text-[10.5px] font-bold w-5 h-5 sm:h-4 flex items-center justify-center rounded-sm transition ${isToday && !isActive ? 'bg-[#ff544a]/10 text-[#ff544a]' : ''
                    } ${isActive ? 'bg-[#ff544a] text-white font-black shadow-md shadow-red-900/20' : `${t.heading} ${t.sidebarHoverBg}`
                    }`}>
                    {dayNum}
                  </span>
                </button>
              )
            })}
          </div>
        </div>
      </header>

      {/* MAIN TASK SCROLL VIEW CONTAINER */}
      <main className={`max-w-4xl mx-auto w-full px-4 sm:px-8 py-6 flex-1 ${t.bg}`}>

        {/* OVERDUE COMPONENT SECTION */}
        {overdueTasks.length > 0 && (
          <div className={`mb-10 border-b ${t.divider} pb-6`}>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2 text-[#ff544a] font-bold tracking-wide">
                <svg className="w-4 h-4 transform rotate-90" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" />
                </svg>
                <h2 className="text-base sm:text-lg">Overdue</h2>
              </div>
              <button className="text-xs text-[#ff544a] hover:underline font-semibold tracking-wide">
                Reschedule
              </button>
            </div>

            <div className="space-y-1 pl-0 sm:pl-6">
              {overdueTasks.map((task: Task) => (
                <div
                  key={task.id}
                  className={`flex items-start gap-3 p-3 rounded-lg group transition border border-transparent ${t.sidebarHoverBg} hover:${t.border}`}
                >
                  <button className="mt-0.5 w-[18px] h-[18px] rounded-full border-2 border-blue-400 hover:bg-blue-400/20 flex items-center justify-center transition shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-baseline gap-2">
                      <span className={`text-sm font-medium ${t.heading} group-hover:text-blue-400 transition truncate`}>{task.title}</span>
                    </div>
                    {task.description && (
                      <p className={`text-xs ${t.subheading} mt-0.5 line-clamp-1`}>{task.description}</p>
                    )}
                    <div className={`flex flex-wrap items-center gap-x-3 gap-y-1 mt-1.5 text-[11px] ${t.subheading}`}>
                      <span className="text-[#ff544a] font-medium flex items-center gap-1">
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        {task.scheduledDate}
                      </span>
                      {task.estimatedMinutes > 0 && <span>{task.estimatedMinutes}m</span>}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* COMPILING TIMELINE DAYS */}
        <div className="space-y-8 sm:space-y-12">
          {dayGroups.map((group) => (
            <div
              key={group.date}
              data-date={group.date}
              ref={(el) => {
                if (el) sectionRefs.current.set(group.date, el)
                else sectionRefs.current.delete(group.date)
              }}
              className="scroll-mt-36 sm:scroll-mt-40 transition-opacity duration-300"
            >
              <DaySection group={group} theme={theme} />
            </div>
          ))}
        </div>

        {/* INFINITE SCROLL TARGET BUFFER INDICATOR */}
        <div ref={bottomObserverRef} className={`h-20 flex items-center justify-center mt-8 ${t.bg}`}>
          {isLoading && (
            <div className={`flex items-center gap-2 text-sm ${t.subheading}`}>
              <svg className="animate-spin h-4 w-4 text-orange-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Expanding workspace...
            </div>
          )}
        </div>
      </main>
    </div>
  )
}