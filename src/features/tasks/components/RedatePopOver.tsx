import { useEffect, useRef, useState } from "react"
import { useUpdateTask } from "../api/use-tasks"

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
function todayStr(): string {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`
}

function tomorrowStr(): string {
  const d = new Date()
  d.setDate(d.getDate() + 1)
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`
}
function formatDate(dateStr: string): string {
  if (!dateStr) return ''
  const d = new Date(dateStr + 'T00:00:00')
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

function nextMondayStr(): string {
  const d = new Date()
  const day = d.getDay()
  const daysUntilMonday = day === 0 ? 1 : 8 - day
  d.setDate(d.getDate() + daysUntilMonday)
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`
}

// ─── Re-date popover ──────────────────────────────────────────────────────────

interface RedatePopoverProps {
  taskId: string
  onClose: () => void
  theme: ThemeKey
}

export function RedatePopover({ taskId, onClose, theme }: RedatePopoverProps) {
  const t = THEMES[theme]
  const { mutate: updateTask, isPending } = useUpdateTask(taskId)
  const [customDate, setCustomDate] = useState('')
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose()
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [onClose])

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [onClose])

  const reschedule = (date: string) => {
    if (!date) return
    updateTask({ scheduleDate: date, status: 'pending' }, { onSuccess: onClose })
  }

  const shortcuts = [
    { label: 'Today',       date: todayStr() },
    { label: 'Tomorrow',    date: tomorrowStr() },
    { label: 'Next Monday', date: nextMondayStr() },
  ]

  return (
    <div
      ref={ref}
      className={`absolute z-50 left-0 mt-1.5 w-[220px] rounded-[12px] border shadow-xl shadow-black/30 p-3 ${t.datePicker}`}
      role="dialog"
      aria-label="Reschedule task"
    >
      <p className={`text-[11px] font-semibold uppercase tracking-widest mb-2.5 ${t.statsLabel}`}>
        Reschedule to
      </p>

      {/* Quick shortcuts */}
      <div className="flex flex-col gap-1 mb-3">
        {shortcuts.map(({ label, date }) => (
          <button
            key={date}
            onClick={() => reschedule(date)}
            disabled={isPending}
            className={`text-left text-[12px] px-2.5 py-1.5 rounded-[7px] transition-colors duration-100 ${t.btnRedate} disabled:opacity-50`}
          >
            {label}
            <span className={`float-right text-[10px] opacity-60`}>{formatDate(date)}</span>
          </button>
        ))}
      </div>

      <div className={`h-px mb-3 ${t.divider}`} />

      {/* Custom date */}
      <div className="flex gap-1.5">
        <input
          type="date"
          value={customDate}
          onChange={(e) => setCustomDate(e.target.value)}
          min={todayStr()}
          className={`flex-1 text-[11px] rounded-[7px] border px-2 py-1.5 focus:outline-none transition-colors ${t.dateInput}`}
          aria-label="Custom date"
        />
        <button
          onClick={() => reschedule(customDate)}
          disabled={!customDate || isPending}
          className={`px-2.5 py-1.5 rounded-[7px] text-[11px] font-semibold transition-colors disabled:opacity-40 ${t.dateConfirm}`}
        >
          {isPending ? '…' : 'Set'}
        </button>
      </div>
    </div>
  )
}