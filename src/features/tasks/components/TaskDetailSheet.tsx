'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { createPortal } from 'react-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useCompleteTask, useDeleteTask, useUpdateTask } from '../api/use-tasks'
import { formatDuration, PRIORITY_CONFIG } from '../utils/format'
import type { Task, EditFields } from '../types'
import { TASK_THEMES, PAGE_THEME } from '@/Common/Constants/ThemeConstants'
import { ConfirmDeleteTaskDialog } from './ConfirmDeleteTaskDialog'
import { formatDateLabel } from '@/features/tasks/utils/format'
// ─── Priority config ──────────────────────────────────────────────────────────

const PRIORITY_COLORS: Record<string, { light: string; dark: string; dot: string }> = {
  high: {
    light: 'bg-[#fff0ed] text-[#c94020] border border-[#f5c0b0]',
    dark: 'bg-[#2d1410] text-[#ff7a5a] border border-[#5a2018]',
    dot: '#ef4444',
  },
  medium: {
    light: 'bg-[#fffbeb] text-[#8a5c00] border border-[#f0d890]',
    dark: 'bg-[#2a1e00] text-[#ffa820] border border-[#5a3a00]',
    dot: '#f59e0b',
  },
  low: {
    light: 'bg-[#eef6ff] text-[#1a5fa0] border border-[#b8d8f8]',
    dark: 'bg-[#0e1e38] text-[#5a9eff] border border-[#1a3060]',
    dot: '#3b82f6',
  },
}

// ─── Props ────────────────────────────────────────────────────────────────────

interface TaskDetailSheetProps {
  task: Task
  theme: 'light' | 'dark'
  isOpen: boolean
  onClose: () => void
  elapsedSeconds: number
  isTimerRunning: boolean
  progressPercent: number
  onStart: () => void
  onPause: () => void
  onReset: () => void
}

// ─── Utility ──────────────────────────────────────────────────────────────────

function formatElapsed(seconds: number) {
  const m = Math.floor(seconds / 60).toString().padStart(2, '0')
  const s = (seconds % 60).toString().padStart(2, '0')
  return `${m}:${s}`
}



// ─── Section heading ──────────────────────────────────────────────────────────

function SectionLabel({ children, theme }: { children: React.ReactNode; theme: 'light' | 'dark' }) {
  return (
    <p className={`text-[10px] font-semibold uppercase tracking-widest mb-2 ${theme === 'dark' ? 'text-[#3e3e58]' : 'text-[#c0c0cc]'}`}>
      {children}
    </p>
  )
}

// ─── Component ────────────────────────────────────────────────────────────────

export function TaskDetailSheet({
  task,
  theme,
  isOpen,
  onClose,
  elapsedSeconds,
  isTimerRunning,
  progressPercent,
  onStart,
  onPause,
  onReset,
}: TaskDetailSheetProps) {
  const { mutate: complete, isPending: isCompleting } = useCompleteTask()
  const { mutate: deleteTask, isPending: isDeleting } = useDeleteTask()
  const { mutate: updateTask, isPending: isUpdating } = useUpdateTask(task.id)

  const t = TASK_THEMES[theme]
  const priority = PRIORITY_CONFIG[task.basePriority]
  const pColors = PRIORITY_COLORS[task.basePriority]

  const isCompleted = task.status === 'completed'
  const visuallyCompleted = isCompleted || isCompleting
  const isPending = isCompleting || isDeleting || isUpdating

  // ── Inline edit state ──
  const [isEditing, setIsEditing] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [editFields, setEditFields] = useState<EditFields>({
    title: task.title,
    description: task.description ?? '',
    priority: task.basePriority,
    minutes: String(task.estimatedMinutes),
  })

  // Sync edit fields when task prop changes
  useEffect(() => {
    setEditFields({
      title: task.title,
      description: task.description ?? '',
      priority: task.basePriority,
      minutes: String(task.estimatedMinutes),
    })
  }, [task])

  const cancelEdit = useCallback(() => {
    setIsEditing(false)
    setEditFields({
      title: task.title,
      description: task.description ?? '',
      priority: task.basePriority,
      minutes: String(task.estimatedMinutes),
    })
  }, [task])

  const saveEdit = () => {
    const minutes = parseInt(editFields.minutes, 10)
    updateTask({
      title: editFields.title.trim() || task.title,
      description: editFields.description,
      basePriority: editFields.priority as Task['basePriority'],
      estimatedMinutes: isNaN(minutes) ? task.estimatedMinutes : minutes,
    })
    setIsEditing(false)
  }

  // ── Keyboard close ──
  useEffect(() => {
    if (!isOpen) return
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (isEditing) { cancelEdit(); return }
        onClose()
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [isOpen, isEditing, cancelEdit, onClose])

  // ── Trap body scroll ──
  useEffect(() => {
    if (isOpen) document.body.style.overflow = 'hidden'
    else document.body.style.overflow = ''
    return () => { document.body.style.overflow = '' }
  }, [isOpen])

  // Reset edit state when sheet closes
  useEffect(() => {
    if (!isOpen) setIsEditing(false)
  }, [isOpen])

  // ── Panel colors ──
  const panelBg = theme === 'dark' ? 'bg-[#13131c]' : 'bg-white'
  const borderColor = theme === 'dark' ? 'border-[#22223a]' : 'border-[#e8e8f0]'
  const headingColor = theme === 'dark' ? 'text-[#f0f0f8]' : 'text-[#1a1a2e]'
  const bodyColor = theme === 'dark' ? 'text-[#8080a8]' : 'text-[#6b6b80]'
  const dividerColor = theme === 'dark' ? 'bg-[#1e1e30]' : 'bg-[#f0f0f6]'
  const inputBg = theme === 'dark'
    ? 'bg-[#1a1a28] border-[#2e2e48] text-[#e0e0f0] placeholder:text-[#3e3e5a] focus:border-[#3b5bdb]'
    : 'bg-[#f8f8fc] border-[#e0e0ea] text-[#1a1a2e] placeholder:text-[#b0b0c8] focus:border-[#1a6bff]'
  const timerTrackBg = theme === 'dark' ? 'bg-[#1e1e30]' : 'bg-[#f0f0f8]'
  const timerFillBg = theme === 'dark' ? 'bg-[#4d8dff]' : 'bg-[#1a6bff]'
  const completeBtnStyle = isCompleted
    ? (theme === 'dark' ? 'bg-[#22b573]/15 text-[#22b573] border-[#22b573]/30' : 'bg-[#d4f5e6] text-[#16a05a] border-[#a0e8c4]')
    : (theme === 'dark' ? 'bg-[#1a2e40] text-[#4d8dff] border-[#1a3060] hover:bg-[#1e3550]' : 'bg-[#eef6ff] text-[#1a6bff] border-[#b8d8f8] hover:bg-[#ddeeff]')

  if (typeof window === 'undefined') return null

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <>
          {/* ── Backdrop ── */}
          <motion.div
            key="sheet-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.22 }}
            className="fixed inset-0 z-[9998]"
            style={{ background: theme === 'dark' ? 'rgba(0,0,0,0.6)' : 'rgba(10,10,30,0.3)', backdropFilter: 'blur(2px)' }}
            onClick={onClose}
            aria-label="Close task details"
          />

          {/* ── Side Sheet ── */}
          <motion.aside
            key="sheet-panel"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 340, damping: 36 }}
            className={`fixed right-0 top-0 bottom-0 z-[9999] flex flex-col ${panelBg} border-l ${borderColor} shadow-2xl`}
            style={{ width: 'min(440px, 95vw)' }}
            aria-label={`Task details: ${task.title}`}
            role="complementary"
          >
            {/* ── Header ── */}
            <div className={`flex items-center justify-between px-6 py-4 border-b ${borderColor} shrink-0`}>
              <div className="flex items-center gap-2.5">
                {/* Completion badge */}
                <motion.button
                  whileTap={visuallyCompleted ? {} : { scale: 0.88 }}
                  whileHover={visuallyCompleted ? {} : { scale: 1.08 }}
                  onClick={() => !visuallyCompleted && !isPending && complete({ id: task.id })}
                  disabled={isPending || visuallyCompleted}
                  className={`flex items-center justify-center w-[22px] h-[22px] rounded-[6px] border-2 transition-all duration-200 shrink-0
                    ${visuallyCompleted
                      ? 'bg-[#22b573] border-[#22b573] shadow-[0_0_10px_rgba(34,181,115,0.45)]'
                      : theme === 'dark'
                        ? 'border-[#3a3a55] hover:border-[#3b5bdb] hover:shadow-[0_0_8px_rgba(59,91,219,0.35)]'
                        : 'border-[#c8c8d8] hover:border-[#1a6bff] hover:shadow-[0_0_8px_rgba(26,107,255,0.3)]'
                    }`}
                  aria-label={visuallyCompleted ? 'Completed' : 'Mark as complete'}
                >
                  <AnimatePresence>
                    {visuallyCompleted && (
                      <motion.svg
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0, opacity: 0 }}
                        transition={{ type: 'spring', stiffness: 500, damping: 18 }}
                        width="12" height="12" viewBox="0 0 12 12" fill="none"
                      >
                        <path d="M2 6l3 3 5-5" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                      </motion.svg>
                    )}
                  </AnimatePresence>
                </motion.button>
                <span className={`text-[13px] font-semibold ${theme === 'dark' ? 'text-[#5a5a80]' : 'text-[#9898b0]'}`}>
                  {isCompleted ? 'Completed' : 'Task Details'}
                </span>
              </div>
              {/* Close button */}
              <button
                onClick={onClose}
                className={`w-8 h-8 flex items-center justify-center rounded-[8px] transition-colors duration-150 ${theme === 'dark' ? 'text-[#4a4a68] hover:bg-[#1e1e2e] hover:text-[#8080a8]' : 'text-[#b0b0c8] hover:bg-[#f4f4f8] hover:text-[#6b6b80]'}`}
                aria-label="Close"
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M3 3l10 10M13 3L3 13" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                </svg>
              </button>
            </div>

            {/* ── Scrollable Body ── */}
            <div className="flex-1 overflow-y-auto overscroll-contain">
              <div className="px-6 py-5 flex flex-col gap-5">

                {/* ── Title ── */}
                {isEditing ? (
                  <div className="flex flex-col gap-3">
                    <input
                      autoFocus
                      value={editFields.title}
                      onChange={e => setEditFields(f => ({ ...f, title: e.target.value }))}
                      onKeyDown={e => { if (e.key === 'Escape') cancelEdit(); if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) saveEdit() }}
                      className={`w-full text-[20px] font-bold rounded-[8px] px-3 py-2 border outline-none transition-colors ${inputBg}`}
                      placeholder="Task title"
                    />
                    <textarea
                      value={editFields.description}
                      onChange={e => setEditFields(f => ({ ...f, description: e.target.value }))}
                      rows={4}
                      className={`w-full text-[14px] leading-relaxed rounded-[8px] px-3 py-2.5 border outline-none resize-none transition-colors ${inputBg}`}
                      placeholder="Add a description… (optional)"
                    />
                    <div className="flex items-center gap-2 flex-wrap">
                      <select
                        value={editFields.priority}
                        onChange={e => setEditFields(f => ({ ...f, priority: e.target.value }))}
                        className={`text-[12px] rounded-[6px] px-2.5 py-1.5 border outline-none transition-colors ${inputBg}`}
                      >
                        <option value="high">🔴 High Priority</option>
                        <option value="medium">🟡 Medium Priority</option>
                        <option value="low">🔵 Low Priority</option>
                      </select>
                      <div className="flex items-center gap-1.5">
                        <svg width="13" height="13" viewBox="0 0 11 11" fill="none" className={bodyColor}>
                          <circle cx="5.5" cy="5.5" r="4.5" stroke="currentColor" strokeWidth="1" />
                          <path d="M5.5 3v2.5l1.5 1" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
                        </svg>
                        <input
                          type="number"
                          value={editFields.minutes}
                          onChange={e => setEditFields(f => ({ ...f, minutes: e.target.value }))}
                          min={1}
                          className={`w-[60px] text-[12px] rounded-[6px] px-2 py-1.5 border outline-none text-center transition-colors ${inputBg}`}
                        />
                        <span className={`text-[12px] ${bodyColor}`}>min</span>
                      </div>
                    </div>
                    <div className="flex gap-2 justify-end">
                      <button
                        onClick={cancelEdit}
                        className={`h-8 px-4 rounded-[8px] text-[12px] font-medium border transition-colors ${t.cancelBtn}`}
                      >Cancel</button>
                      <button
                        onClick={saveEdit}
                        disabled={isUpdating || !editFields.title.trim()}
                        className={`h-8 px-4 rounded-[8px] text-[12px] font-medium transition-colors disabled:opacity-50 ${t.saveBtn}`}
                      >{isUpdating ? 'Saving…' : 'Save changes'}</button>
                    </div>
                  </div>
                ) : (
                  <div>
                    <motion.h2
                      layout
                      className={`text-[22px] font-bold leading-tight mb-1 ${isCompleted ? t.titleCompleted : headingColor}`}
                    >
                      {task.title}
                    </motion.h2>
                    {task.description && (
                      <p className={`text-[14px] leading-relaxed mt-2 ${bodyColor}`}>{task.description}</p>
                    )}
                    {!isCompleted && (
                      <button
                        onClick={() => setIsEditing(true)}
                        className={`mt-3 inline-flex items-center gap-1.5 text-[12px] font-medium transition-colors ${theme === 'dark' ? 'text-[#3b5bdb] hover:text-[#5a7aff]' : 'text-[#1a6bff] hover:text-[#0f5ce8]'}`}
                      >
                        <svg width="13" height="13" viewBox="0 0 14 14" fill="none">
                          <path d="M10 2a1.414 1.414 0 012 2L5 11H2V8L10 2z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
                        </svg>
                        Edit task
                      </button>
                    )}
                  </div>
                )}

                {/* ── Divider ── */}
                <div className={`h-px w-full ${dividerColor}`} />

                {/* ── Metadata chips ── */}
                <div>
                  <SectionLabel theme={theme}>Details</SectionLabel>
                  <div className="flex flex-wrap gap-2">
                    {/* Priority */}
                    <span className={`inline-flex items-center gap-1.5 text-[12px] font-semibold px-3 py-1.5 rounded-[8px] ${pColors[theme]}`}>
                      <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: pColors.dot }} />
                      {priority.label} Priority
                    </span>
                    {/* Duration */}
                    <span className={`inline-flex items-center gap-1.5 text-[12px] font-medium px-3 py-1.5 rounded-[8px] ${theme === 'dark' ? 'bg-[#1e1e30] text-[#7070a0] border border-[#2a2a40]' : 'bg-[#f4f4f8] text-[#6b6b80] border border-[#e4e4ec]'}`}>
                      <svg width="13" height="13" viewBox="0 0 11 11" fill="none">
                        <circle cx="5.5" cy="5.5" r="4.5" stroke="currentColor" strokeWidth="1" />
                        <path d="M5.5 3v2.5l1.5 1" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
                      </svg>
                      {formatDuration(task.estimatedMinutes)}
                    </span>
                    {/* Scheduled date */}
                    <span className={`inline-flex items-center gap-1.5 text-[12px] font-medium px-3 py-1.5 rounded-[8px] ${theme === 'dark' ? 'bg-[#1e1e30] text-[#7070a0] border border-[#2a2a40]' : 'bg-[#f4f4f8] text-[#6b6b80] border border-[#e4e4ec]'}`}>
                      <svg width="13" height="13" viewBox="0 0 14 14" fill="none">
                        <rect x="1" y="2.5" width="12" height="10.5" rx="2" stroke="currentColor" strokeWidth="1.2" />
                        <path d="M1 6h12" stroke="currentColor" strokeWidth="1.2" />
                        <path d="M4 1v3M10 1v3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
                      </svg>
                      {formatDateLabel(task.scheduledDate.split('T')[0])}
                    </span>

                    {/* Bump count */}
                    {task.bumpCount > 0 && (
                      <span className={`inline-flex items-center gap-1.5 text-[12px] font-medium px-3 py-1.5 rounded-[8px] ${t.chipBump}`}>
                        <svg width="13" height="13" viewBox="0 0 11 11" fill="none">
                          <path d="M9 5.5A3.5 3.5 0 112 5.5" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
                          <path d="M9 3v2.5H6.5" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        Bumped {task.bumpCount}×
                      </span>
                    )}
                    {/* Plan */}
                    {task.plan_id && (
                      <span className={`inline-flex items-center gap-1.5 text-[12px] font-medium px-3 py-1.5 rounded-[8px] ${t.chipPlan}`}>
                        <svg width="13" height="13" viewBox="0 0 11 11" fill="none">
                          <path d="M5.5 1l1.2 3.6H10L7 6.8l1.1 3.7L5.5 8.4 2.9 10.5 4 6.8 1 4.6h3.3L5.5 1z" stroke="currentColor" strokeWidth="0.8" strokeLinejoin="round" />
                        </svg>
                        From a Plan
                      </span>
                    )}
                  </div>
                </div>

                {/* ── Divider ── */}
                <div className={`h-px w-full ${dividerColor}`} />

                {/* ── Timer Section ── */}
                {!isCompleted && (
                  <div>
                    <SectionLabel theme={theme}>Focus Timer</SectionLabel>

                    {/* Progress bar */}
                    <div className="mb-3">
                      <div className="flex justify-between items-center mb-1.5">
                        <span className={`text-[11px] font-medium tabular-nums ${theme === 'dark' ? 'text-[#5a5a80]' : 'text-[#a0a0b8]'}`}>
                          {elapsedSeconds > 0 ? formatElapsed(elapsedSeconds) : '00:00'}
                        </span>
                        <span className={`text-[11px] font-medium tabular-nums ${theme === 'dark' ? 'text-[#3e3e58]' : 'text-[#c0c0cc]'}`}>
                          {Math.round(progressPercent)}% of {formatDuration(task.estimatedMinutes)}
                        </span>
                      </div>
                      <div className={`h-2 rounded-full overflow-hidden ${timerTrackBg}`}>
                        <motion.div
                          className={`h-full rounded-full ${timerFillBg}`}
                          initial={{ width: 0 }}
                          animate={{ width: `${progressPercent}%` }}
                          transition={{ type: 'spring', stiffness: 200, damping: 28 }}
                        />
                      </div>
                    </div>

                    {/* Timer controls */}
                    <div className="flex items-center gap-2">
                      {!isTimerRunning ? (
                        <button
                          onClick={onStart}
                          className={`flex-1 h-10 rounded-[10px] flex items-center justify-center gap-2 text-[13px] font-semibold transition-colors ${theme === 'dark' ? 'bg-[#1a3060] text-[#4d8dff] hover:bg-[#1e3870] border border-[#1e3870]' : 'bg-[#eef6ff] text-[#1a6bff] hover:bg-[#ddeeff] border border-[#b8d8f8]'}`}
                        >
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z" /></svg>
                          Start Timer
                        </button>
                      ) : (
                        <button
                          onClick={onPause}
                          className={`flex-1 h-10 rounded-[10px] flex items-center justify-center gap-2 text-[13px] font-semibold transition-colors ${theme === 'dark' ? 'bg-[#4d8dff]/20 text-[#4d8dff] hover:bg-[#4d8dff]/28 border border-[#4d8dff]/30' : 'bg-[#1a6bff]/10 text-[#1a6bff] hover:bg-[#1a6bff]/18 border border-[#1a6bff]/25'}`}
                        >
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" /></svg>
                          Pause
                        </button>
                      )}
                      {elapsedSeconds > 0 && (
                        <button
                          onClick={onReset}
                          className={`w-10 h-10 rounded-[10px] flex items-center justify-center transition-colors ${theme === 'dark' ? 'bg-[#2d1410] text-[#ff7a5a] hover:bg-[#3d1a10] border border-[#5a2018]' : 'bg-[#fff0ed] text-[#c94020] hover:bg-[#ffe0d8] border border-[#f5c0b0]'}`}
                          aria-label="Reset timer"
                          title="Reset timer"
                        >
                          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
                            <path d="M3 3v5h5" />
                          </svg>
                        </button>
                      )}
                    </div>

                    {isTimerRunning && (
                      <motion.p
                        initial={{ opacity: 0, y: 4 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`mt-2 text-[11px] text-center ${theme === 'dark' ? 'text-[#3b5bdb]' : 'text-[#1a6bff]'}`}
                      >
                        ⏱ Timer running — {formatElapsed(elapsedSeconds)}
                      </motion.p>
                    )}
                  </div>
                )}

                {/* ── Completed state ── */}
                {isCompleted && (
                  <div className={`rounded-[12px] px-5 py-4 flex items-center gap-3 ${theme === 'dark' ? 'bg-[#0e2218] border border-[#1a3828]' : 'bg-[#eef8f2] border border-[#b8e4cc]'}`}>
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${theme === 'dark' ? 'bg-[#22b573]/20' : 'bg-[#22b573]/15'}`}>
                      <svg width="18" height="18" viewBox="0 0 12 12" fill="none">
                        <path d="M2 6l3 3 5-5" stroke="#22b573" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </div>
                    <div>
                      <p className={`text-[13px] font-semibold ${theme === 'dark' ? 'text-[#22b573]' : 'text-[#16a05a]'}`}>Task Completed!</p>
                      <p className={`text-[11px] mt-0.5 ${bodyColor}`}>Great work on finishing this task.</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* ── Footer Actions ── */}
            {!isEditing && (
              <div className={`px-6 py-4 border-t ${borderColor} shrink-0 flex gap-2`}>
                {!isCompleted && (
                  <button
                    onClick={() => !isPending && complete({ id: task.id })}
                    disabled={isPending}
                    className={`flex-1 h-10 rounded-[10px] flex items-center justify-center gap-2 text-[13px] font-semibold border transition-colors disabled:opacity-50 ${completeBtnStyle}`}
                  >
                    <svg width="14" height="14" viewBox="0 0 12 12" fill="none">
                      <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    Mark Complete
                  </button>
                )}
                <button
                  onClick={() => setShowDeleteConfirm(true)}
                  disabled={isPending || isDeleting}
                  className={`${isCompleted ? 'flex-1' : 'w-10'} h-10 rounded-[10px] flex items-center justify-center gap-2 text-[13px] font-semibold border transition-colors disabled:opacity-50 ${theme === 'dark' ? 'bg-[#2d1410] text-[#ff7a5a] border-[#5a2018] hover:bg-[#3d1a10]' : 'bg-[#fff0ed] text-[#c94020] border-[#f5c0b0] hover:bg-[#ffe0d8]'}`}
                  aria-label="Delete task"
                >
                  <AnimatePresence mode="wait">
                    {isDeleting ? (
                      <motion.svg
                        key="spinner"
                        animate={{ rotate: 360 }}
                        transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
                        width="15" height="15" viewBox="0 0 16 16" fill="none"
                      >
                        <circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="1.5" strokeOpacity="0.25" />
                        <path d="M14 8a6 6 0 00-6-6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                      </motion.svg>
                    ) : (
                      <motion.svg key="trash" width="15" height="15" viewBox="0 0 13 13" fill="none" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                        <path d="M2 3.5h9M4.5 3.5V2.5a1 1 0 011-1h2a1 1 0 011-1v1M5.5 6v3M7.5 6v3M3 3.5l.5 7a1 1 0 001 1h4a1 1 0 001-1l.5-7" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
                      </motion.svg>
                    )}
                  </AnimatePresence>
                  {isCompleted && <span>{isDeleting ? 'Deleting…' : 'Delete Task'}</span>}
                </button>
              </div>
            )}
          </motion.aside>

          {/* ── Task Delete Confirmation Dialog ── */}
          <ConfirmDeleteTaskDialog
            open={showDeleteConfirm}
            taskTitle={task.title}
            isDeleting={isDeleting}
            onConfirm={() => {
              deleteTask({ id: task.id, date: task.scheduledDate }, {
                onSuccess: () => {
                  setShowDeleteConfirm(false)
                  onClose() // close detail sheet after delete
                }
              })
            }}
            onCancel={() => setShowDeleteConfirm(false)}
            theme={theme}
          />
        </>
      )}
    </AnimatePresence>,
    document.body
  )
}
