'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { useCompleteTask, useDeleteTask, useUpdateTask } from '../api/use-tasks'
import { formatDuration, PRIORITY_CONFIG } from '../utils/format'
import { TaskEditShell, type EditFields } from './TaskEditShell'
import type { Task } from '../types'

// ─── Theme tokens ─────────────────────────────────────────────────────────────

export const THEMES = {
  light: {
    card: 'bg-white border-[#e8e8ec]/50 hover:border-[#d0d0da] hover:bg-[#fafafa]',
    cardEditing: 'bg-white border-[#1a6bff]/40 ring-2 ring-[#1a6bff]/10',
    cardDragging: 'opacity-40 scale-[0.98] border-dashed',
    title: 'text-[#1a1a2e]',
    titleCompleted: 'line-through text-[#9898a8]',
    description: 'text-[#6b6b80]',
    score: 'text-[#c0c0cc]',
    chipDuration: 'bg-[#f5f5f7] text-[#6b6b80]',
    chipBump: 'bg-[#fff5e6] text-[#b05a00] border border-[#f5c880]/50',
    chipPlan: 'bg-[#f0eeff] text-[#4a35b0]',
    actionBtn: 'border-[#e8e8ec]/50 bg-[#f5f5f7] text-[#9898a8] hover:bg-[#e8e8f0] hover:text-[#1a1a2e]',
    deleteBtn: 'border-[#e8e8ec]/50 bg-[#f5f5f7] text-[#9898a8] hover:bg-[#fff0ed] hover:text-[#c94020] hover:border-[#f5c0b0]',
    saveBtn: 'bg-[#1a6bff] text-white hover:bg-[#0f5ce8]',
    cancelBtn: 'border-[#e8e8ec] bg-[#f5f5f7] text-[#6b6b80] hover:bg-[#e8e8f0]',
    input: 'bg-transparent border-b border-[#1a6bff]/40 text-[#1a1a2e] focus:outline-none focus:border-[#1a6bff] placeholder:text-[#c0c0cc]',
    textarea: 'bg-[#f5f5f7] border border-[#e8e8ec] text-[#1a1a2e] text-[12px] rounded-[7px] px-2.5 py-2 w-full resize-none focus:outline-none focus:border-[#1a6bff]/50',
    select: 'bg-[#f5f5f7] border border-[#e8e8ec] text-[#1a1a2e] rounded-[6px] px-2 py-0.5 text-[11px] focus:outline-none focus:border-[#1a6bff]/50',
    durationInput: 'bg-[#f5f5f7] border border-[#e8e8ec] text-[#1a1a2e] rounded-[6px] px-2 py-0.5 text-[11px] w-[56px] text-center focus:outline-none focus:border-[#1a6bff]/50',
    themeToggle: 'border-[#e8e8ec] bg-[#f5f5f7] text-[#6b6b80] hover:bg-[#e8e8f0]',
    dragHandle: 'text-[#c0c0cc] hover:text-[#9898a8]',
  },
  dark: {
    card: 'bg-[#1c1c28] border-[#2e2e3e] hover:border-[#3a3a50] hover:bg-[#1f1f2e]',
    cardEditing: 'bg-[#1c1c28] border-[#3b5bdb]/50 ring-2 ring-[#3b5bdb]/15',
    cardDragging: 'opacity-40 scale-[0.98] border-dashed',
    title: 'text-[#e8e8f0]',
    titleCompleted: 'line-through text-[#4a4a60]',
    description: 'text-[#7070a0]',
    score: 'text-[#3e3e58]',
    chipDuration: 'bg-[#24243a] text-[#7070a0]',
    chipBump: 'bg-[#2d2010] text-[#e08030] border border-[#6a3800]/40',
    chipPlan: 'bg-[#1e1a3a] text-[#9a82ff]',
    actionBtn: 'border-[#2e2e3e] bg-[#24243a] text-[#5a5a80] hover:bg-[#2e2e48] hover:text-[#e8e8f0]',
    deleteBtn: 'border-[#2e2e3e] bg-[#24243a] text-[#5a5a80] hover:bg-[#2d1820] hover:text-[#ff6b6b] hover:border-[#7a2030]',
    saveBtn: 'bg-[#3b5bdb] text-white hover:bg-[#2f4abf]',
    cancelBtn: 'border-[#2e2e3e] bg-[#24243a] text-[#7070a0] hover:bg-[#2e2e48]',
    input: 'bg-transparent border-b border-[#3b5bdb]/40 text-[#e8e8f0] focus:outline-none focus:border-[#3b5bdb] placeholder:text-[#3e3e58]',
    textarea: 'bg-[#141420] border border-[#2e2e3e] text-[#b0b0c8] text-[12px] rounded-[7px] px-2.5 py-2 w-full resize-none focus:outline-none focus:border-[#3b5bdb]/50',
    select: 'bg-[#141420] border border-[#2e2e3e] text-[#b0b0c8] rounded-[6px] px-2 py-0.5 text-[11px] focus:outline-none focus:border-[#3b5bdb]/50',
    durationInput: 'bg-[#141420] border border-[#2e2e3e] text-[#b0b0c8] rounded-[6px] px-2 py-0.5 text-[11px] w-[56px] text-center focus:outline-none focus:border-[#3b5bdb]/50',
    themeToggle: 'border-[#2e2e3e] bg-[#24243a] text-[#7070a0] hover:bg-[#2e2e48]',
    dragHandle: 'text-[#3e3e58] hover:text-[#5a5a80]',
  },
} as const

const PRIORITY_CHIP: Record<string, { light: string; dark: string }> = {
  high:   { light: 'bg-[#fff0ed] text-[#c94020]',  dark: 'bg-[#2d1410] text-[#ff7a5a]' },
  medium: { light: 'bg-[#fffbeb] text-[#8a5c00]',  dark: 'bg-[#2a1e00] text-[#ffa820]' },
  low:    { light: 'bg-[#eef6ff] text-[#1a5fa0]',  dark: 'bg-[#0e1e38] text-[#5a9eff]' },
}

// ─── Types ────────────────────────────────────────────────────────────────────

type ThemeKey = 'light' | 'dark'

interface TaskCardProps {
  task: Task
  onEdit?: (task: Task) => void
  theme?: ThemeKey
  onThemeToggle?: () => void
  showThemeToggle?: boolean
}

// ─── Drag handle icon ─────────────────────────────────────────────────────────

function GripIcon({ className }: { className?: string }) {
  return (
    <svg
      width="10"
      height="14"
      viewBox="0 0 10 14"
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      {/* 6-dot gripper — 2 columns × 3 rows */}
      <circle cx="2.5" cy="2.5" r="1.5" />
      <circle cx="7.5" cy="2.5" r="1.5" />
      <circle cx="2.5" cy="7"   r="1.5" />
      <circle cx="7.5" cy="7"   r="1.5" />
      <circle cx="2.5" cy="11.5" r="1.5" />
      <circle cx="7.5" cy="11.5" r="1.5" />
    </svg>
  )
}

// ─── useClickOutside ──────────────────────────────────────────────────────────

function useClickOutside(ref: React.RefObject<HTMLElement>, handler: () => void) {
  useEffect(() => {
    const listener = (e: MouseEvent) => {
      if (!ref.current || ref.current.contains(e.target as Node)) return
      handler()
    }
    document.addEventListener('mousedown', listener)
    return () => document.removeEventListener('mousedown', listener)
  }, [ref, handler])
}

// ─── Component ────────────────────────────────────────────────────────────────

export function TaskCard({
  task,
  onEdit,
  theme: externalTheme,
  onThemeToggle,
  showThemeToggle = false,
}: TaskCardProps) {
  const { mutate: complete,    isPending: isCompleting } = useCompleteTask()
  const { mutate: deleteTask,  isPending: isDeleting   } = useDeleteTask()
  const { mutate: updateTask,  isPending: isUpdating   } = useUpdateTask(task.id)

  // ── Theme ──
  const [localTheme, setLocalTheme] = useState<ThemeKey>('dark')
  const theme = externalTheme ?? localTheme
  const t = THEMES[theme]

  const handleThemeToggle = () => {
    if (onThemeToggle) onThemeToggle()
    else setLocalTheme(prev => (prev === 'light' ? 'dark' : 'light'))
  }

  // ── Inline edit ──
  const [isEditing, setIsEditing] = useState(false)
  const [editFields, setEditFields] = useState<EditFields>({
    title:       task.title,
    description: task.description ?? '',
    priority:    task.basePriority,
    minutes:     String(task.estimatedMinutes),
  })
  const [descExpanded, setDescExpanded] = useState(false)

  // ── Drag state ──
  const [isDragging, setIsDragging] = useState(false)

  const cardRef = useRef<HTMLDivElement>(null!)

  const cancelEdit = useCallback(() => {
    setIsEditing(false)
    setEditFields({
      title:       task.title,
      description: task.description ?? '',
      priority:    task.basePriority,
      minutes:     String(task.estimatedMinutes),
    })
  }, [task])

  useClickOutside(cardRef, () => { if (isEditing) cancelEdit() })

  const saveEdit = () => {
    const minutes = parseInt(editFields.minutes, 10)
    updateTask({
      title:            editFields.title.trim() || task.title,
      description:      editFields.description,
      basePriority:     editFields.priority as Task['basePriority'],
      estimatedMinutes: isNaN(minutes) ? task.estimatedMinutes : minutes,
    })
    setIsEditing(false)
  }

  const isCompleted = task.status === 'completed'
  const isPending   = isCompleting || isDeleting || isUpdating
  const priority    = PRIORITY_CONFIG[task.basePriority]
  const hasDesc     = !!task.description?.trim()

  // ── Drag handlers ──
  const handleDragStart = (e: React.DragEvent) => {
    e.dataTransfer.effectAllowed = 'move'
    e.dataTransfer.setData('application/task-id', task.id)
    e.dataTransfer.setData('application/task-date', task.scheduledDate)
    // Small delay so the ghost image captures the card before opacity drops
    requestAnimationFrame(() => setIsDragging(true))
  }

  const handleDragEnd = () => {
    setIsDragging(false)
  }

  return (
    // Wrapper — position:relative so the handle can sit outside without affecting layout
    <div className="relative group/task">
      {/* ── Drag handle — floats to the left, outside the card box ── */}
      {!isEditing && !isCompleted && (
        <div
          draggable
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
          className={`
            absolute left-0 top-1/2 -translate-y-1/2 -translate-x-full
            pl-1 pr-1.5 py-2
            opacity-0 group-hover/task:opacity-100
            transition-opacity duration-150
            cursor-grab active:cursor-grabbing
            ${t.dragHandle}
          `}
          aria-label="Drag to reschedule"
          title="Drag to reschedule"
        >
          <GripIcon />
        </div>
      )}

      {/* ── The actual card ── */}
      <div
        ref={cardRef}
        className={`flex flex-col gap-2.5 border rounded-[10px] px-3.5 py-[11px] cursor-default transition-[border-color,background,box-shadow,opacity,transform] duration-150 ${
          isDragging ? t.cardDragging : isEditing ? t.cardEditing : t.card
        } ${isCompleted && !isEditing ? 'opacity-60' : ''}`}
        onDoubleClick={() => { if (!isCompleted && !isPending) setIsEditing(true) }}
        role="article"
        aria-label={`Task: ${task.title}`}
      >
        {/* ── View mode ── */}
        {!isEditing && (
          <>
            <div className="flex items-start gap-3">
              {/* Checkbox */}
              <button
                className={`mt-[1px] w-[17px] h-[17px] rounded-[5px] border-[1.5px] shrink-0 flex items-center justify-center cursor-pointer transition-[border-color,background] duration-150 p-0 ${
                  isCompleted
                    ? 'bg-[#22b573] border-[#22b573]'
                    : theme === 'dark'
                    ? 'border-[#3a3a55] bg-transparent hover:border-[#3b5bdb]'
                    : 'border-[#d0d0da] bg-transparent hover:border-[#1a6bff]'
                }`}
                onClick={() => !isCompleted && !isPending && complete({ id: task.id })}
                disabled={isPending || isCompleted}
                aria-label={isCompleted ? 'Completed' : 'Mark as complete'}
              >
                {isCompleted && (
                  <svg width="9" height="9" viewBox="0 0 9 9" fill="none" aria-hidden="true">
                    <path d="M1.5 4.5l2.5 2.5 4-4" stroke="#fff" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                )}
              </button>

              {/* Body */}
              <div className="flex-1 min-w-0">
                <div className={`text-[13px] font-medium whitespace-nowrap overflow-hidden text-ellipsis mb-1 ${
                  isCompleted ? t.titleCompleted : t.title
                }`}>
                  {task.title}
                </div>

                <div className="flex items-center gap-1.5 flex-wrap">
                  {/* Priority */}
                  <span className={`inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-[5px] ${PRIORITY_CHIP[task.basePriority][theme]}`}>
                    <svg width="6" height="6" viewBox="0 0 6 6" fill="currentColor" aria-hidden="true"><circle cx="3" cy="3" r="3"/></svg>
                    {priority.label} priority
                  </span>

                  {/* Duration */}
                  <span className={`inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-[5px] ${t.chipDuration}`}>
                    <svg width="11" height="11" viewBox="0 0 11 11" fill="none" aria-hidden="true">
                      <circle cx="5.5" cy="5.5" r="4.5" stroke="currentColor" strokeWidth="1"/>
                      <path d="M5.5 3v2.5l1.5 1" stroke="currentColor" strokeWidth="1" strokeLinecap="round"/>
                    </svg>
                    {formatDuration(task.estimatedMinutes)}
                  </span>

                  {/* Bump */}
                  {task.bumpCount > 0 && (
                    <span className={`inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-[5px] ${t.chipBump}`}
                      title={`Rescheduled ${task.bumpCount} time${task.bumpCount > 1 ? 's' : ''}`}>
                      <svg width="11" height="11" viewBox="0 0 11 11" fill="none" aria-hidden="true">
                        <path d="M9 5.5A3.5 3.5 0 112 5.5" stroke="currentColor" strokeWidth="1" strokeLinecap="round"/>
                        <path d="M9 3v2.5H6.5" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      Bumped {task.bumpCount}×
                    </span>
                  )}

                  {/* Plan */}
                  {task.plan_id && (
                    <span className={`inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-[5px] ${t.chipPlan}`}>
                      <svg width="11" height="11" viewBox="0 0 11 11" fill="none" aria-hidden="true">
                        <path d="M5.5 1l1.2 3.6H10L7 6.8l1.1 3.7L5.5 8.4 2.9 10.5 4 6.8 1 4.6h3.3L5.5 1z" stroke="currentColor" strokeWidth="0.8" strokeLinejoin="round"/>
                      </svg>
                      Plan
                    </span>
                  )}
                </div>
              </div>

              {/* Score */}
              <span className={`text-[10px] ml-auto shrink-0 ${t.score}`} aria-label={`Score ${task.compositeScore.toFixed(1)}`}>
                {task.compositeScore.toFixed(1)}
              </span>

              {/* Action buttons */}
              <div className="flex gap-1 opacity-0 group-hover/task:opacity-100 transition-opacity duration-150 shrink-0">
                {showThemeToggle && (
                  <button
                    className={`w-6 h-6 rounded-[6px] border flex items-center justify-center cursor-pointer transition-[background,color] duration-150 p-0 ${t.themeToggle}`}
                    onClick={handleThemeToggle}
                    aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
                  >
                    {theme === 'light' ? (
                      <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                        <path d="M6 1v1M6 10v1M1 6h1M10 6h1M2.5 2.5l.7.7M8.8 8.8l.7.7M2.5 9.5l.7-.7M8.8 3.2l.7-.7" stroke="currentColor" strokeWidth="1" strokeLinecap="round"/>
                        <circle cx="6" cy="6" r="2.2" stroke="currentColor" strokeWidth="1"/>
                      </svg>
                    ) : (
                      <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                        <path d="M9.5 7A4 4 0 015 2.5a4.5 4.5 0 100 7 4 4 0 014.5-2.5z" stroke="currentColor" strokeWidth="1" strokeLinecap="round"/>
                      </svg>
                    )}
                  </button>
                )}
                {onEdit && (
                  <button
                    className={`w-6 h-6 rounded-[6px] border flex items-center justify-center cursor-pointer transition-[background,color] duration-150 p-0 ${t.actionBtn}`}
                    onClick={() => onEdit(task)}
                    disabled={isPending}
                    aria-label="Edit task"
                  >
                    <svg width="13" height="13" viewBox="0 0 13 13" fill="none" aria-hidden="true">
                      <path d="M9 2l2 2L4 11H2V9L9 2z" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </button>
                )}
                <button
                  className={`w-6 h-6 rounded-[6px] border flex items-center justify-center cursor-pointer transition-[background,color] duration-150 p-0 ${t.deleteBtn}`}
                  onClick={() => !isPending && deleteTask({ id: task.id, date: task.scheduledDate })}
                  disabled={isPending}
                  aria-label="Delete task"
                >
                  <svg width="13" height="13" viewBox="0 0 13 13" fill="none" aria-hidden="true">
                    <path d="M2 3.5h9M4.5 3.5V2.5a1 1 0 011-1h2a1 1 0 011 1v1M5.5 6v3M7.5 6v3M3 3.5l.5 7a1 1 0 001 1h4a1 1 0 001-1l.5-7" stroke="currentColor" strokeWidth="1" strokeLinecap="round"/>
                  </svg>
                </button>
              </div>
            </div>

            {/* Description — collapsible */}
            {hasDesc && (
              <div className="pl-[29px]">
                <p className={`text-[12px] leading-[1.55] ${t.description} ${descExpanded ? '' : 'line-clamp-2'} cursor-text`}
                  title={task.description??''}>
                  {task.description}
                </p>
                {task.description!.length > 120 && (
                  <button
                    className={`mt-0.5 text-[11px] font-medium ${theme === 'dark' ? 'text-[#3b5bdb] hover:text-[#5a7aff]' : 'text-[#1a6bff] hover:text-[#0f5ce8]'} transition-colors duration-100`}
                    onClick={() => setDescExpanded(v => !v)}
                  >
                    {descExpanded ? 'Show less' : 'Show more'}
                  </button>
                )}
              </div>
            )}
          </>
        )}

        {/* ── Edit mode — delegates entirely to TaskEditShell ── */}
        {isEditing && (
          <TaskEditShell
            fields={editFields}
            onChange={setEditFields}
            onSave={saveEdit}
            onCancel={cancelEdit}
            isSaving={isUpdating}
            saveLabel="Save"
            t={t}
            theme={theme}
          />
        )}
      </div>
    </div>
  )
}