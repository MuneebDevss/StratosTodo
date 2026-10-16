'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ChevronLeft, ChevronRight, Sparkles } from 'lucide-react'
import { DayColumn, OverdueBanner } from '@/features/tasks'
import { useTheme } from '@/features/settings/hooks/use-theme'
import { getLocalISODate, navigate } from '@/Common'
import { PAGE_THEME } from '@/Common/Constants/ThemeConstants'

export default function DashboardPage() {
  const [selectedDate, setSelectedDate] = useState(() => getLocalISODate())
  const { theme } = useTheme()
  const t = PAGE_THEME[theme]
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement
      if (event.defaultPrevented || event.altKey || event.ctrlKey || event.metaKey || event.shiftKey || target.closest('input, textarea, select, button, [contenteditable], [role="dialog"]')) return
      if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
        event.preventDefault()
        setSelectedDate(d => navigate(d, event.key === 'ArrowLeft' ? -1 : 1))
      } else if (event.key.toLowerCase() === 't') setSelectedDate(getLocalISODate())
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [])
  const button = `inline-flex min-h-11 min-w-11 items-center justify-center rounded-lg border px-3 text-sm focus-visible:outline-2 focus-visible:outline-indigo-500 ${t.navBtn}`
  return (
    <div className={`min-h-screen ${t.bg}`}>
      <div className="mx-auto max-w-5xl px-4 pb-12 pt-16 sm:px-8 sm:pt-10">
        <header className="mb-8 flex flex-wrap items-start justify-between gap-5">
          <div><p className={`mb-2 text-xs font-semibold uppercase tracking-widest ${t.subheading}`}>Your workspace</p><h1 className={`text-3xl font-semibold tracking-tight ${t.heading}`}>Make room for what matters.</h1><p className={`mt-2 text-sm ${t.body}`}>Review your day, choose your next task, and keep moving.</p></div>
          <Link href="/plans" className={button}><Sparkles size={16} className="mr-2" />Explore AI plans</Link>
        </header>
        <div className={`mb-6 flex flex-wrap items-center justify-between gap-3 rounded-xl border p-3 ${t.border}`}>
          <div className="flex items-center gap-2"><button aria-label="Previous day" className={button} onClick={() => setSelectedDate(d => navigate(d, -1))}><ChevronLeft size={18} /></button><button className={button} onClick={() => setSelectedDate(getLocalISODate())}>Today</button><button aria-label="Next day" className={button} onClick={() => setSelectedDate(d => navigate(d, 1))}><ChevronRight size={18} /></button></div>
          <label className={`flex items-center gap-3 text-sm ${t.body}`}>Jump to date<input aria-label="Choose a day" type="date" value={selectedDate} onChange={e => { if (e.target.value) setSelectedDate(e.target.value) }} className={`min-h-11 rounded-lg border px-3 ${t.bg} ${t.border} ${t.heading}`} /></label>
        </div>
        <OverdueBanner theme={theme} />
        <DayColumn key={selectedDate} date={selectedDate} />
      </div>
    </div>
  )
}
