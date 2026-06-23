
// ─── Graveyard task row ───────────────────────────────────────────────────────

import { useEffect, useState } from "react"
import { taskKeys, useCompleteTask, useDeleteTask, useUpdateTask } from "../api/use-tasks"
import { Task } from "../types"
import { RedatePopover } from "./RedatePopOver"

function formatDate(dateStr: string): string {
  if (!dateStr) return ''
  const d = new Date(dateStr)
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

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
const PRIORITY_LABEL: Record<string, string> = {
  high: 'High', medium: 'Medium', low: 'Low',
}
type ThemeKey = 'light' | 'dark'
interface GraveyardCardProps {
  task: Task
  theme: ThemeKey
}

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

// ─── Confirmation dialog ──────────────────────────────────────────────────────
// Drop this component anywhere above GraveyardCard in GraveyardPage.tsx

interface ConfirmDialogProps {
  title: string
  description: string
  confirmLabel: string
  onConfirm: () => void
  onCancel: () => void
  isDestructive?: boolean
  theme: ThemeKey
}

function ConfirmDialog({ title, description, confirmLabel, onConfirm, onCancel, isDestructive = false, theme }: ConfirmDialogProps) {
  const t = THEMES[theme]

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onCancel() }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [onCancel])

  return (
    // Backdrop
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-[2px]"
      onMouseDown={(e) => { if (e.target === e.currentTarget) onCancel() }}
    >
      <div className={`w-[320px] rounded-[14px] border shadow-2xl p-5 ${t.datePicker}`}>
        <p className={`text-[14px] font-semibold mb-1 ${theme === 'dark' ? 'text-[#e0e0f0]' : 'text-[#2a2a3a]'}`}>
          {title}
        </p>
        <p className={`text-[12.5px] leading-[1.5] mb-4 ${t.cardMeta}`}>
          {description}
        </p>
        <div className="flex gap-2 justify-end">
          <button
            onClick={onCancel}
            className={`px-3.5 py-1.5 rounded-[8px] text-[12px] font-medium transition-colors ${t.dateCancel}`}
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className={`px-3.5 py-1.5 rounded-[8px] text-[12px] font-medium transition-colors ${
              isDestructive
                ? theme === 'dark'
                  ? 'bg-[#7a1e28] text-[#ffb0b8] hover:bg-[#9a2030] border border-[#5a1018]'
                  : 'bg-[#c83028] text-white hover:bg-[#b02020]'
                : t.dateConfirm
            }`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── Updated GraveyardCard ────────────────────────────────────────────────────
// Replace the existing GraveyardCard component entirely with this.

export function GraveyardCard({ task, theme }: GraveyardCardProps) {
  const t = THEMES[theme]
  const { mutate: updateTask, isPending: isRescheduling } = useUpdateTask(task.id)
  const { mutate: deleteTask, isPending: isDeleting      } = useDeleteTask()
  const { mutate: complete,   isPending: isCompleting    } = useCompleteTask()

  const [showRedate,   setShowRedate]   = useState(false)
  const [showConfirm,  setShowConfirm]  = useState(false)

  const isPending = isRescheduling || isDeleting || isCompleting

  

  

  const priorityBadge = t.badge[task.basePriority as keyof typeof t.badge] ?? t.badge.medium

  return (
    <>
      {showConfirm && (
        <ConfirmDialog
          theme={theme}
          title="Delete this task?"
          description={`"${task.title}" will be permanently removed. This can't be undone.`}
          confirmLabel="Delete permanently"
          isDestructive
          onConfirm={() => deleteTask({ id: task.id, date: task.scheduledDate })}
          onCancel={() => setShowConfirm(false)}
        />
      )}

      <div className={`group relative flex items-start gap-3 border rounded-[12px] px-4 py-3.5 transition-[border-color,background] duration-150 ${t.card} ${isPending ? 'opacity-60 pointer-events-none' : ''}`}>
        {/* Priority left-stripe */}
        <div className={`absolute left-0 top-3 bottom-3 w-[3px] rounded-full opacity-40 ${
          task.basePriority === 'high'   ? 'bg-[#c06050]' :
          task.basePriority === 'medium' ? 'bg-[#9a7030]' :
                                           'bg-[#4878a0]'
        }`} />

        {/* Content */}
        <div className="flex-1 min-w-0 pl-2">
          <p className={`text-[13.5px] font-medium leading-snug mb-1.5 truncate ${t.cardTitle}`}>
            {task.title}
          </p>

          <div className="flex items-center gap-2 flex-wrap">
            <span className={`text-[10.5px] font-medium px-1.5 py-0.5 rounded-[5px] border ${priorityBadge}`}>
              {PRIORITY_LABEL[task.basePriority]}
            </span>
            <span className={`flex items-center gap-1 text-[10.5px] ${t.cardMeta}`}>
              <svg width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden="true">
                <rect x="1" y="1.5" width="8" height="7.5" rx="1.5" stroke="currentColor" strokeWidth="1"/>
                <path d="M1 3.5h8M3.5 1v1.5M6.5 1v1.5" stroke="currentColor" strokeWidth="1" strokeLinecap="round"/>
              </svg>
              {formatDate(task.scheduledDate)}
            </span>
            <span className={`text-[10px] px-1.5 py-0.5 rounded-[4px] font-medium ${t.cardAge}`}>
              {timeAgo(task.scheduledDate)}
            </span>
            {task.estimatedMinutes > 0 && (
              <span className={`flex items-center gap-1 text-[10.5px] ${t.cardMeta}`}>
                <svg width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden="true">
                  <circle cx="5" cy="5" r="4" stroke="currentColor" strokeWidth="1"/>
                  <path d="M5 2.5V5l1.5 1" stroke="currentColor" strokeWidth="1" strokeLinecap="round"/>
                </svg>
                {task.estimatedMinutes}m
              </span>
            )}
          </div>

          {task.description && (
            <p className={`mt-1.5 text-[11.5px] leading-[1.5] line-clamp-1 ${t.cardMeta}`}>
              {task.description}
            </p>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-150 shrink-0 self-center">
          <div className="relative">
            <button
              onClick={() => setShowRedate(v => !v)}
              className={`flex items-center gap-1 text-[11px] font-medium px-2.5 py-1.5 rounded-[7px] border transition-colors duration-100 ${t.btnRedate}`}
              aria-label="Reschedule task"
            >
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                <path d="M9.5 6A3.5 3.5 0 112.5 6" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
                <path d="M9.5 3.5V6H7" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Reschedule
            </button>
            {showRedate && (
              <RedatePopover taskId={task.id} onClose={() => setShowRedate(false)} theme={theme} />
            )}
          </div>

          <button
            onClick={() => complete({ id: task.id })}
            className={`flex items-center gap-1 text-[11px] font-medium px-2.5 py-1.5 rounded-[7px] border transition-colors duration-100 ${t.btnComplete}`}
            aria-label="Mark as complete"
          >
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
              <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Done
          </button>

          <button
            onClick={() => setShowConfirm(true)}
            className={`flex items-center justify-center w-7 h-7 rounded-[7px] border transition-colors duration-100 ${t.btnDelete}`}
            aria-label="Delete permanently"
            title="Delete permanently"
          >
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
              <path d="M2 3h8M4 3V2a1 1 0 011-1h2a1 1 0 011 1v1M5 5.5v3M7 5.5v3M2.5 3l.5 6.5a1 1 0 001 .9h4a1 1 0 001-.9L9.5 3" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round"/>
            </svg>
          </button>
        </div>
      </div>
    </>
  )
}
