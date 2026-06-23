'use client'

import { THEMES } from '@/features/tasks/components/TaskCard'

interface ThemeToggleProps {
  theme: 'light' | 'dark'
  onChange: (theme: 'light' | 'dark') => void
}

function SunIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 13 13" fill="none" aria-hidden="true">
      <path d="M6.5 1.5v1.5M6.5 10v1.5M1.5 6.5H3M10 6.5h1.5M3.05 3.05l1.06 1.06M8.89 8.89l1.06 1.06M3.05 9.95l1.06-1.06M8.89 4.11l1.06-1.06" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round"/>
      <circle cx="6.5" cy="6.5" r="2.3" stroke="currentColor" strokeWidth="1.1"/>
    </svg>
  )
}

function MoonIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 13 13" fill="none" aria-hidden="true">
      <path d="M10.5 7.7A4.3 4.3 0 015.3 2.5a4.8 4.8 0 100 8 4.3 4.3 0 015.2-2.8z" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
}

export function ThemeToggle({ theme, onChange }: ThemeToggleProps) {
  const t = THEMES[theme]
  const trackBg = theme === 'dark' ? 'bg-[#141420] border-[#2e2e3e]' : 'bg-[#f5f5f7] border-[#e8e8ec]'

  return (
    <div
      role="radiogroup"
      aria-label="Theme"
      className={`inline-flex p-0.5 rounded-[8px] border ${trackBg}`}
    >
      {(['light', 'dark'] as const).map((option) => {
        const active = theme === option
        return (
          <button
            key={option}
            type="button"
            role="radio"
            aria-checked={active}
            onClick={() => onChange(option)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-[6px] text-[12px] font-medium cursor-pointer transition-[background,color] duration-150 ${
              active
                ? theme === 'dark'
                  ? 'bg-[#2e2e48] text-[#e8e8f0]'
                  : 'bg-white text-[#1a1a2e] shadow-sm'
                : `${t.description} hover:${theme === 'dark' ? 'text-[#e8e8f0]' : 'text-[#1a1a2e]'}`
            }`}
          >
            {option === 'light' ? <SunIcon /> : <MoonIcon />}
            {option === 'light' ? 'Light' : 'Dark'}
          </button>
        )
      })}
    </div>
  )
}