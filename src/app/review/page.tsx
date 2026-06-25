'use client'

import { useState } from 'react'
import { useGraveyardTasks } from '@/features/tasks/api/use-tasks'
import type { Task } from '@/features/tasks/types'
import { GraveyardCard } from '@/features/tasks/components/GraveyardCard'

// ─── Theme tokens ─────────────────────────────────────────────────────────────

const THEMES = {
  dark: {
    page:        'bg-[#1a1a1a] text-[#d0d0d0]',
    header:      'bg-[#1a1a1a] border-[#252525]',
    card:        'bg-[#1e1e26] border-[#2a2a38] hover:border-[#363648] hover:bg-[#21212e]',
    cardTitle:   'text-[#c8c8d8] line-through decoration-[#4a4a60] decoration-1',
    cardMeta:    'text-[#5a5a78]',
    cardAge:     'text-[#4a4a5e] bg-[#1c1c28] border border-[#2a2a38]',
    badge: {
      high:   'bg-[#2d1410]/80 text-[#c06050] border border-[#5a2820]/60',
      medium: 'bg-[#251d08]/80 text-[#9a7030] border border-[#5a4010]/60',
      low:    'bg-[#0e1830]/80 text-[#4878a0] border border-[#1a3050]/60',
    },
    divider:     'bg-[#222230]',
    emptyIcon:   'text-[#2e2e42]',
    emptyText:   'text-[#3e3e58]',
    emptySubtext:'text-[#2e2e42]',
    // action buttons
    btnRedate:   'bg-[#2a2040] text-[#9a82e8] border border-[#3a3058] hover:bg-[#322850] hover:text-[#b8a0ff] hover:border-[#4a4070]',
    btnComplete: 'bg-[#0e2218] text-[#3a9060] border border-[#1a3828] hover:bg-[#122c1e] hover:text-[#4aaa72] hover:border-[#226040]',
    btnDelete:   'bg-[#1e1218] text-[#7a3840] border border-[#2e1e28] hover:bg-[#281420] hover:text-[#c04858] hover:border-[#6a2038]',
    // date picker
    datePicker:  'bg-[#16161e] border-[#2e2e3e] text-[#d0d0e0]',
    dateInput:   'bg-[#1e1e28] border-[#2e2e3e] text-[#d0d0e0] focus:border-[#7a62d8]',
    dateConfirm: 'bg-[#3b2fa0] text-white hover:bg-[#4a3cbb]',
    dateCancel:  'bg-[#222230] text-[#7070a0] hover:bg-[#2a2a40]',
    // stats bar
    statsBar:    'bg-[#1c1c26] border-[#252535]',
    statsLabel:  'text-[#3e3e58]',
    statsValue:  'text-[#7070a0]',
    // filter tabs
    tabActive:   'bg-[#2a2040] text-[#9a82e8] border border-[#3a3058]',
    tabInactive: 'text-[#5a5a78] hover:text-[#9898b0] hover:bg-[#1e1e2a]',
    // header count pill
    countPill:   'bg-[#251d38] text-[#7a62b8]',
  },
  light: {
    page:        'bg-[#f7f6f3] text-[#2a2a3a]',
    header:      'bg-[#f7f6f3] border-[#e4e2de]',
    card:        'bg-white border-[#e8e6e0] hover:border-[#d4d0c8] hover:bg-[#fefefe]',
    cardTitle:   'text-[#6b6878] line-through decoration-[#c0bcc8] decoration-1',
    cardMeta:    'text-[#9090a8]',
    cardAge:     'text-[#a8a4b8] bg-[#f4f2f0] border border-[#e4e0da]',
    badge: {
      high:   'bg-[#fdf0ee] text-[#b04030] border border-[#f0c8c0]',
      medium: 'bg-[#fdf8ee] text-[#906020] border border-[#f0dca0]',
      low:    'bg-[#eef3fc] text-[#3060a0] border border-[#c0d4f0]',
    },
    divider:     'bg-[#ece9e4]',
    emptyIcon:   'text-[#dcd8d0]',
    emptyText:   'text-[#b0a8c0]',
    emptySubtext:'text-[#c8c4d0]',
    btnRedate:   'bg-[#f0eeff] text-[#5a40c0] border border-[#d0c8f0] hover:bg-[#e8e4ff] hover:text-[#4830a8] hover:border-[#b8aee8]',
    btnComplete: 'bg-[#eef8f2] text-[#2a7848] border border-[#b8e4cc] hover:bg-[#e4f4ea] hover:text-[#1a6038] hover:border-[#90d0a8]',
    btnDelete:   'bg-[#fef0f0] text-[#a83028] border border-[#f0c0b8] hover:bg-[#fce8e6] hover:text-[#901e18] hover:border-[#e8a099]',
    datePicker:  'bg-white border-[#e0dcd8] text-[#2a2a3a]',
    dateInput:   'bg-[#f8f7f5] border-[#e0dcd8] text-[#2a2a3a] focus:border-[#7060d0]',
    dateConfirm: 'bg-[#5a40c0] text-white hover:bg-[#4830a8]',
    dateCancel:  'bg-[#f0ede8] text-[#8080a0] hover:bg-[#e8e4e0]',
    statsBar:    'bg-white border-[#e8e4de]',
    statsLabel:  'text-[#b0a8b8]',
    statsValue:  'text-[#7070a0]',
    tabActive:   'bg-[#f0eeff] text-[#5a40c0] border border-[#d0c8f0]',
    tabInactive: 'text-[#a0a0b8] hover:text-[#5a5a78] hover:bg-[#eeecf0]',
    countPill:   'bg-[#ede8f8] text-[#7060b0]',
  },
} as const

type ThemeKey = 'light' | 'dark'

// ─── Helpers ──────────────────────────────────────────────────────────────────



function timeAgo(dateStr: string): string {
  if (!dateStr) return ''
  const then = new Date(dateStr)
  const now  = new Date()
  const days = Math.floor((now.getTime() - then.getTime()) / 86_400_000)
  if (days === 0) return 'today'
  if (days === 1) return '1 day ago'
  if (days < 7)  return `${days} days ago`
  if (days < 30) return `${Math.floor(days / 7)}w ago`
  if (days < 365) return `${Math.floor(days / 30)}mo ago`
  return `${Math.floor(days / 365)}y ago`
}


// ─── Filter tabs ──────────────────────────────────────────────────────────────

type FilterKey = 'all' | 'high' | 'medium' | 'low'

const FILTERS: { key: FilterKey; label: string }[] = [
  { key: 'all',    label: 'All'    },
  { key: 'high',   label: 'High'   },
  { key: 'medium', label: 'Medium' },
  { key: 'low',    label: 'Low'    },
]

// ─── Empty state ──────────────────────────────────────────────────────────────

function EmptyState({ theme }: { theme: ThemeKey }) {
  const t = THEMES[theme]
  return (
    <div className="flex flex-col items-center justify-center py-24 select-none">
      {/* Gravestone SVG */}
      <svg width="48" height="56" viewBox="0 0 48 56" fill="none" className={`mb-5 ${t.emptyIcon}`}>
        <rect x="8" y="18" width="32" height="30" rx="3" stroke="currentColor" strokeWidth="1.5"/>
        <path d="M24 4a10 10 0 0110 10H14A10 10 0 0124 4z" stroke="currentColor" strokeWidth="1.5"/>
        <path d="M14 48h20" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        <path d="M24 26v8M20 30h8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
      <p className={`text-[15px] font-medium mb-1 ${t.emptyText}`}>Nothing buried here</p>
      <p className={`text-[13px] ${t.emptySubtext}`}>Tasks that expire without action end up here</p>
    </div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function GraveyardPage() {
  const [theme, setTheme] = useState<ThemeKey>('dark')
  const [filter, setFilter] = useState<FilterKey>('all')

  const t = THEMES[theme]
  const { data: tasks = [], isLoading } = useGraveyardTasks()

  const filtered = filter === 'all'
    ? tasks
    : tasks.filter((task: Task) => task.basePriority === filter)

  // Stats
  const totalCount  = tasks.length
  const highCount   = tasks.filter((t: Task) => t.basePriority === 'high').length
  const oldestTask  = tasks.reduce((oldest: Task | null, t: Task) => {
    if (!oldest) return t
    return t.scheduledDate < oldest.scheduledDate ? t : oldest
  }, null)

  return (
    <div className={`min-h-screen font-sans antialiased ${t.page}`}>
        {/* ── Header ── */}
        <header className={`sticky top-0 z-40 border-b pt-6 pb-0 px-8 ${t.header}`}>
          <div className="max-w-3xl mx-auto">
            {/* Title row */}
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  {/* Gravestone icon */}
                  <svg width="18" height="20" viewBox="0 0 18 20" fill="none" className={t.statsLabel} aria-hidden="true">
                    <rect x="2" y="7" width="14" height="11" rx="2" stroke="currentColor" strokeWidth="1.3"/>
                    <path d="M9 2a4 4 0 014 4H5a4 4 0 014-4z" stroke="currentColor" strokeWidth="1.3"/>
                    <path d="M5 18h8" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
                    <path d="M9 10v4M7 12h4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
                  </svg>
                  <h1 className={`text-[22px] font-bold tracking-tight ${theme === 'dark' ? 'text-[#c8c8d8]' : 'text-[#2a2a3a]'}`}>
                    Graveyard
                  </h1>
                </div>

                {totalCount > 0 && (
                  <span className={`text-[12px] font-semibold px-2 py-0.5 rounded-[6px] ${t.countPill}`}>
                    {totalCount}
                  </span>
                )}
              </div>

              {/* Theme toggle */}
              <button
                onClick={() => setTheme(th => th === 'dark' ? 'light' : 'dark')}
                className={`flex items-center gap-1.5 text-[12px] px-3 py-1.5 rounded-[8px] border transition-colors ${t.tabInactive} border-transparent`}
                aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
              >
                {theme === 'dark' ? (
                  <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><path d="M6.5 1v1M6.5 11v1M1 6.5h1M11 6.5h1M2.9 2.9l.7.7M9.4 9.4l.7.7M2.9 10.1l.7-.7M9.4 3.6l.7-.7" stroke="currentColor" strokeWidth="1" strokeLinecap="round"/><circle cx="6.5" cy="6.5" r="2.3" stroke="currentColor" strokeWidth="1"/></svg>
                ) : (
                  <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><path d="M10 7.5A4.5 4.5 0 015.5 3a5 5 0 100 7 4.5 4.5 0 014.5-2.5z" stroke="currentColor" strokeWidth="1" strokeLinecap="round"/></svg>
                )}
                {theme === 'dark' ? 'Light' : 'Dark'}
              </button>
            </div>

            {/* Stats bar */}
            {!isLoading && totalCount > 0 && (
              <div className={`flex items-center gap-6 px-4 py-2.5 rounded-t-[10px] border-b-0 border text-[12px] mb-0 ${t.statsBar}`}>
                <div>
                  <span className={`block text-[10px] uppercase tracking-wider font-semibold mb-0.5 ${t.statsLabel}`}>Total</span>
                  <span className={`font-semibold ${t.statsValue}`}>{totalCount} tasks</span>
                </div>
                <div className={`w-px h-6 ${t.divider}`} />
                <div>
                  <span className={`block text-[10px] uppercase tracking-wider font-semibold mb-0.5 ${t.statsLabel}`}>High priority</span>
                  <span className={`font-semibold ${t.statsValue}`}>{highCount} tasks</span>
                </div>
                {oldestTask && (
                  <>
                    <div className={`w-px h-6 ${t.divider}`} />
                    <div>
                      <span className={`block text-[10px] uppercase tracking-wider font-semibold mb-0.5 ${t.statsLabel}`}>Oldest</span>
                      <span className={`font-semibold ${t.statsValue}`}>{timeAgo(oldestTask.scheduledDate)}</span>
                    </div>
                  </>
                )}
              </div>
            )}

            {/* Filter tabs */}
            {!isLoading && totalCount > 0 && (
              <div className="flex gap-1 pt-3 pb-2">
                {FILTERS.map(({ key, label }) => {
                  const count = key === 'all'
                    ? totalCount
                    : tasks.filter((t: Task) => t.basePriority === key).length
                  return (
                    <button
                      key={key}
                      onClick={() => setFilter(key)}
                      className={`flex items-center gap-1.5 text-[12px] font-medium px-3 py-1 rounded-[7px] border transition-colors duration-100 ${
                        filter === key ? t.tabActive : `${t.tabInactive} border-transparent`
                      }`}
                    >
                      {label}
                      {count > 0 && (
                        <span className={`text-[10px] font-semibold opacity-70`}>{count}</span>
                      )}
                    </button>
                  )
                })}
              </div>
            )}
          </div>
        </header>

        {/* ── Main content ── */}
        <main className="max-w-3xl mx-auto px-8 py-6">
          {isLoading ? (
            <div className="flex items-center justify-center py-24">
              <div className="flex items-center gap-2.5 text-[13px]">
                <svg className={`animate-spin h-4 w-4 ${t.statsValue}`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                </svg>
                <span className={t.statsValue}>Loading graveyard…</span>
              </div>
            </div>
          ) : filtered.length === 0 ? (
            <EmptyState theme={theme} />
          ) : (
            <div className="flex flex-col gap-2">
              {filtered.map((task: Task) => (
                <GraveyardCard key={task.id} task={task} theme={theme} />
              ))}
            </div>
          )}
        </main>
    </div>
  )
}