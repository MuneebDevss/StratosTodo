'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { motion, AnimatePresence, type Variants } from "framer-motion";
import { useCompleteTask, useDeleteTask, useUpdateTask } from '../api/use-tasks'
import { formatDuration, PRIORITY_CONFIG } from '../utils/format'
import { TaskEditShell } from './TaskEditShell'
import type { EditFields, Task, TaskCardProps } from '../types'
import { useTheme } from '@/features/settings/hooks/use-theme'
import { PAGE_THEME, TASK_THEMES } from '@/Common/Constants/ThemeConstants'

const PRIORITY_CHIP: Record<string, { light: string; dark: string }> = {
  high: { light: 'bg-[#fff0ed] text-[#c94020]', dark: 'bg-[#2d1410] text-[#ff7a5a]' },
  medium: { light: 'bg-[#fffbeb] text-[#8a5c00]', dark: 'bg-[#2a1e00] text-[#ffa820]' },
  low: { light: 'bg-[#eef6ff] text-[#1a5fa0]', dark: 'bg-[#0e1e38] text-[#5a9eff]' },
}

const CARD_VARIANTS: Variants = {
  initial: { opacity: 0, y: 18, scale: 0.98 },
  animate: { opacity: 1, y: 0, scale: 1, transition: { type: "spring", stiffness: 420, damping: 32 } },
  exit: { opacity: 0, scale: 0.9, x: 30, height: 0, marginBottom: 0, transition: { duration: 0.28 } },
};

// ─── Drag handle icon ─────────────────────────────────────────────────────────

function GripIcon({ className }: { className?: string }) {
  return (
    <svg width="10" height="14" viewBox="0 0 10 14" fill="currentColor" className={className} aria-hidden="true">
      <circle cx="2.5" cy="2.5" r="1.5" />
      <circle cx="7.5" cy="2.5" r="1.5" />
      <circle cx="2.5" cy="7" r="1.5" />
      <circle cx="7.5" cy="7" r="1.5" />
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
  theme: externalTheme,
}: TaskCardProps) {
  const { mutate: complete, isPending: isCompleting } = useCompleteTask()
  const { mutate: deleteTask, isPending: isDeleting } = useDeleteTask()
  const { mutate: updateTask, isPending: isUpdating } = useUpdateTask(task.id)

  const { theme: contextTheme } = useTheme()
  const theme = externalTheme ?? contextTheme

  const t = TASK_THEMES[theme]
  const pageTheme = PAGE_THEME[theme]

  const [isEditing, setIsEditing] = useState(false)
  const [editFields, setEditFields] = useState<EditFields>({
    title: task.title,
    description: task.description ?? '',
    priority: task.basePriority,
    minutes: String(task.estimatedMinutes),
  })
  const [descExpanded, setDescExpanded] = useState(false)
  const [isDragging, setIsDragging] = useState(false)

  // ── Timer state ──
  const [elapsedSeconds, setElapsedSeconds] = useState(0)
  const [isTimerRunning, setIsTimerRunning] = useState(false)

  // Real timestamps refs to combat browser background throttling
  const startTimeRef = useRef<number | null>(null)
  const accumulatedSecondsRef = useRef<number>(0)


  const cardRef = useRef<HTMLDivElement>(null!)

  const cancelEdit = useCallback(() => {
    setIsEditing(false)
    setEditFields({
      title: task.title,
      description: task.description ?? '',
      priority: task.basePriority,
      minutes: String(task.estimatedMinutes),
    })
  }, [task])

  useClickOutside(cardRef, () => { if (isEditing) cancelEdit() })

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

  const isCompleted = task.status === 'completed'
  const isPending = isCompleting || isDeleting || isUpdating
  const priority = PRIORITY_CONFIG[task.basePriority]
  const hasDesc = !!task.description?.trim()
  // 1. Define the optimistic check state above your JSX
  const visuallyCompleted = isCompleted || isCompleting;

  // ── Timer Handlers ──
  useEffect(() => {
    if (!isTimerRunning || isCompleted) return

    const updateTime = () => {
      if (startTimeRef.current !== null) {
        const currentSessionSeconds = Math.floor((Date.now() - startTimeRef.current) / 1000)
        setElapsedSeconds(accumulatedSecondsRef.current + currentSessionSeconds)
      }
    }

    // Sync state immediately upon mounting or switching tabs
    updateTime()

    const intervalId = setInterval(updateTime, 1000)

    // Force an immediate catch-up sync when the window becomes active again
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        updateTime()
      }
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)

    return () => {
      clearInterval(intervalId)
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
  }, [isTimerRunning, isCompleted])

  const handleStart = (e: React.MouseEvent) => {
    e.stopPropagation()
    startTimeRef.current = Date.now()
    setIsTimerRunning(true)
  }

  const handlePause = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (startTimeRef.current !== null) {
      accumulatedSecondsRef.current += Math.floor((Date.now() - startTimeRef.current) / 1000)
    }
    startTimeRef.current = null
    setIsTimerRunning(false)
  }

  const handleReset = (e: React.MouseEvent) => {
    e.stopPropagation()
    startTimeRef.current = null
    accumulatedSecondsRef.current = 0
    setIsTimerRunning(false)
    setElapsedSeconds(0)
  }

  const totalSeconds = (task.estimatedMinutes || 30) * 60
  const progressPercent = Math.min((elapsedSeconds / totalSeconds) * 100, 100)

  // Water Wave Colors
  const waveColorBack = theme === 'dark' ? 'rgba(77,141,255,0.14)' : 'rgba(26,107,255,0.12)';
  const waveColorFront = theme === 'dark' ? 'rgba(77,141,255,0.20)' : 'rgba(26,107,255,0.18)';

  // ── Drag handlers ──
  const handleDragStart = (e: React.DragEvent) => {
    e.dataTransfer.effectAllowed = 'move'
    e.dataTransfer.setData('application/task-id', task.id)
    e.dataTransfer.setData('application/task-date', task.scheduledDate)
    requestAnimationFrame(() => setIsDragging(true))
  }

  const handleDragEnd = () => setIsDragging(false)

  return (
    <motion.div
      layout
      layoutId={task.id}
      variants={CARD_VARIANTS}
      initial="initial"
      animate="animate"
      exit="exit"
      whileHover={{ y: -3, transition: { duration: .18 } }}
      className="relative group/task"
    >
      {/* ── Drag handle ── */}
      {!isEditing && !isCompleted && (
        <div
          className={`absolute left-0 top-1/2 -translate-y-1/2 -translate-x-full pl-1 pr-2 py-2 opacity-0 group-hover/task:opacity-100 group-hover/task:-translate-x-[110%] transition-all duration-200 ${t.dragHandle}`}
          aria-label="Drag to reschedule"
          title="Drag to reschedule"
        >
          <GripIcon />
        </div>
      )}

      {/* ── The actual card ── */}
      <motion.div
        layout
        ref={cardRef}
        draggable={!isEditing && !isCompleted}
        onDragStartCapture={handleDragStart}
        onDragEndCapture={handleDragEnd}
        className={`relative overflow-hidden z-0 flex flex-col gap-3 py-3 transition-all duration-300 cursor-grab active:cursor-grabbing select-none touch-none ${isDragging ? `${t.cardDragging} rotate-[2deg] scale-[1.02] shadow-2xl` : pageTheme.bg} ${isCompleted && !isEditing ? 'opacity-70' : ''}`}
        onDoubleClick={() => { if (!isCompleted && !isPending) setIsEditing(true) }}
        role="article"
        aria-label={`Task: ${task.title}`}
      >
        {/* ── Liquid Ocean Fill Layer ── */}
        {!isEditing && (
          <motion.div
            className={`absolute left-0 top-0 bottom-0 pointer-events-none z-0 ${t.progressGlow}`}
            initial={{ width: 0 }}
            animate={{ width: `${progressPercent}%` }}
            transition={isTimerRunning ? { duration: 0.1, ease: "linear" } : { type: "spring", stiffness: 300, damping: 32 }}
          >
            {/* Deep water base */}
            <div className={`absolute inset-0 ${t.progressFill}`} />

            {/* Ocean Waves at the right vertical edge */}
            {progressPercent > 0 && progressPercent < 100 && (
              <div className="absolute top-0 bottom-0 right-[-14px] w-[30px] z-10 overflow-hidden pointer-events-none">
                {/* Back Wave (slower, offset phase) */}
                <motion.div
                  className="absolute top-0 left-0 w-full h-[200%]"
                  style={{ color: waveColorBack }}
                  animate={isTimerRunning ? { y: ["0%", "-50%"] } : { y: "0%" }}
                  transition={{ repeat: Infinity, duration: 2.8, ease: "linear" }}
                >
                  <svg viewBox="-10 0 40 100" preserveAspectRatio="none" className="w-full h-full fill-current">
                    <path d="M 15,0 C 0,16 30,34 15,50 C 0,66 30,84 15,100 L -10,100 L -10,0 Z" />
                  </svg>
                </motion.div>

                {/* Front Wave (faster, standard phase) */}
                <motion.div
                  className="absolute top-0 left-0 w-full h-[200%]"
                  style={{ color: waveColorFront }}
                  animate={isTimerRunning ? { y: ["0%", "-50%"] } : { y: "0%" }}
                  transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                >
                  <svg viewBox="-10 0 40 100" preserveAspectRatio="none" className="w-full h-full fill-current">
                    <path d="M 15,0 C 30,16 0,34 15,50 C 30,66 0,84 15,100 L -10,100 L -10,0 Z" />
                  </svg>
                </motion.div>
              </div>
            )}

            {/* Liquid Bubbles floating up inside the filled volume */}
            <AnimatePresence>
              {isTimerRunning && progressPercent > 5 && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 overflow-hidden">
                  <motion.div className={`absolute bottom-[-10px] left-[20%] w-[5px] h-[5px] rounded-full ${theme === 'dark' ? 'bg-[#4d8dff]/40' : 'bg-[#1a6bff]/30'}`} animate={{ y: [0, -80], x: [0, 8, -8, 0], opacity: [0, 1, 0] }} transition={{ y: { repeat: Infinity, duration: 2.5, ease: "linear" }, x: { repeat: Infinity, duration: 1.5, ease: "easeInOut" }, opacity: { repeat: Infinity, duration: 2.5, ease: "easeOut" } }} />
                  <motion.div className={`absolute bottom-[-10px] left-[60%] w-[3px] h-[3px] rounded-full ${theme === 'dark' ? 'bg-[#4d8dff]/40' : 'bg-[#1a6bff]/30'}`} animate={{ y: [0, -60], x: [0, -6, 6, 0], opacity: [0, 0.8, 0] }} transition={{ y: { repeat: Infinity, duration: 3, ease: "linear", delay: 0.5 }, x: { repeat: Infinity, duration: 2, ease: "easeInOut" }, opacity: { repeat: Infinity, duration: 3, ease: "easeOut", delay: 0.5 } }} />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}

        {/* ── View mode ── */}
        {!isEditing && (
          <div className="relative z-10 flex flex-col gap-3 w-full h-full">
            <div className="flex items-start gap-3">
              {/* Checkbox */}
              <motion.button
                whileTap={visuallyCompleted ? {} : { scale: 0.85 }}
                whileHover={visuallyCompleted ? {} : { scale: 1.08 }}
                className={`mt-[1px] w-[17px] h-[17px] rounded-[5px] border-[1.5px] shrink-0 flex items-center justify-center cursor-pointer transition-[border-color,background] duration-150 p-0 ${visuallyCompleted
                  ? 'bg-[#22b573] border-[#22b573]'
                  : theme === 'dark'
                    ? 'border-[#3a3a55] bg-transparent hover:border-[#3b5bdb]'
                    : 'border-[#d0d0da] bg-transparent hover:border-[#1a6bff]'
                  }`}
                onClick={() => !visuallyCompleted && !isPending && complete({ id: task.id })}
                disabled={isPending || visuallyCompleted}
                aria-label={visuallyCompleted ? 'Completed' : 'Mark as complete'}
              >
                <AnimatePresence>
                  {visuallyCompleted && (
                    <motion.svg
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                      transition={{ type: 'spring', stiffness: 500, damping: 18 }}
                    />
                  )}
                </AnimatePresence>
              </motion.button>

              {/* Body */}
              <div className="flex-1 min-w-0">
                <motion.div layout animate={isCompleted ? { opacity: .6, scale: .98 } : { opacity: 1, scale: 1 }} className={`text-[14px] font-semibold leading-5 whitespace-nowrap overflow-hidden text-ellipsis mb-1.5 ${isCompleted ? t.titleCompleted : t.title}`}>
                  {task.title}
                </motion.div>

                <div className="flex items-center gap-1.5 flex-wrap">
                  {/* Priority */}
                  <span className={`inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-[5px] ${PRIORITY_CHIP[task.basePriority][theme]}`}>
                    <svg width="6" height="6" viewBox="0 0 6 6" fill="currentColor" aria-hidden="true"><circle cx="3" cy="3" r="3" /></svg>
                    {priority.label} priority
                  </span>

                  {/* Duration */}
                  <span className={`inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-[5px] ${t.chipDuration}`}>
                    <svg width="11" height="11" viewBox="0 0 11 11" fill="none" aria-hidden="true">
                      <circle cx="5.5" cy="5.5" r="4.5" stroke="currentColor" strokeWidth="1" />
                      <path d="M5.5 3v2.5l1.5 1" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
                    </svg>
                    {formatDuration(task.estimatedMinutes)}
                  </span>

                  {/* Timer Controls */}
                  {!isCompleted && (
                    <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                      {!isTimerRunning ? (
                        <button
                          onClick={handleStart}
                          className={`inline-flex items-center justify-center p-1 rounded-[5px] transition-colors duration-150 ${theme === 'dark' ? 'hover:bg-[#2c2c3f] text-[#5a9eff]' : 'hover:bg-[#f0f4f8] text-[#1a5fa0]'}`}
                          aria-label="Start timer"
                          title="Start timer"
                        >
                          <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z" /></svg>
                        </button>
                      ) : (
                        <button
                          onClick={handlePause}
                          className={`inline-flex items-center justify-center p-1 rounded-[5px] transition-colors duration-150 ${theme === 'dark' ? `${t.progressOverlay} text-[#4d8dff]` : `${t.progressOverlay} text-[#1a6bff]`}`}
                          aria-label="Pause timer"
                          title="Pause timer"
                        >
                          <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" /></svg>
                        </button>
                      )}

                      {elapsedSeconds > 0 && (
                        <button
                          onClick={handleReset}
                          className={`inline-flex items-center justify-center p-1 rounded-[5px] transition-colors duration-150 ${theme === 'dark' ? 'hover:bg-[#3d1a1a] text-[#ff7a5a]' : 'hover:bg-[#fff0ed] text-[#c94020]'}`}
                          aria-label="Reset timer"
                          title="Reset timer"
                        >
                          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" /><path d="M3 3v5h5" /></svg>
                        </button>
                      )}
                    </div>
                  )}
                  {/* Action buttons */}
                  <motion.div
                    initial={{ opacity: 0, x: 8 }}
                    whileHover={{}}
                    animate={{ opacity: 1 }}
                    className="flex gap-1 opacity-0 group-hover/task:opacity-100 group-hover/task:translate-x-0 translate-x-2 transition-all duration-200 shrink-0"
                  >
                    <button
                      className={`w-6 h-6 rounded-[6px] border flex items-center justify-center cursor-pointer transition-[background,color] duration-150 p-0 ${t.deleteBtn}`}
                      onClick={() => !isPending && !isDeleting && deleteTask({ id: task.id, date: task.scheduledDate })}
                      disabled={isPending || isDeleting}
                      aria-label={isDeleting ? "Deleting task" : "Delete task"}
                    >
                      <AnimatePresence mode="wait">
                        {isDeleting ? (
                          <motion.div
                            key="loader"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.15 }}
                            className="flex items-center justify-center"
                          >
                            {/* Lightweight, premium 60fps rotating progress ring */}
                            <motion.svg
                              animate={{ rotate: 360 }}
                              transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                              width="13"
                              height="13"
                              viewBox="0 0 16 16"
                              fill="none"
                            >
                              <circle
                                cx="8"
                                cy="8"
                                r="6"
                                stroke="currentColor"
                                strokeWidth="1.5"
                                strokeOpacity="0.2"
                              />
                              <path
                                d="M14 8a6 6 0 00-6-6"
                                stroke="currentColor"
                                strokeWidth="1.5"
                                strokeLinecap="round"
                              />
                            </motion.svg>
                          </motion.div>
                        ) : (
                          <motion.div
                            key="trash"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.15 }}
                            className="flex items-center justify-center"
                          >
                            <svg width="13" height="13" viewBox="0 0 13 13" fill="none" aria-hidden="true">
                              <path d="M2 3.5h9M4.5 3.5V2.5a1 1 0 011-1h2a1 1 0 011-1v1M5.5 6v3M7.5 6v3M3 3.5l.5 7a1 1 0 001 1h4a1 1 0 001-1l.5-7" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
                            </svg>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </button>
                  </motion.div>
                  {/* Bump & Plan */}
                  {task.bumpCount > 0 && (
                    <span className={`inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-[5px] ${t.chipBump}`} title={`Rescheduled ${task.bumpCount} time${task.bumpCount > 1 ? 's' : ''}`}>
                      <svg width="11" height="11" viewBox="0 0 11 11" fill="none" aria-hidden="true">
                        <path d="M9 5.5A3.5 3.5 0 112 5.5" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
                        <path d="M9 3v2.5H6.5" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      Bumped {task.bumpCount}×
                    </span>
                  )}

                  {task.plan_id && (
                    <span className={`inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-[5px] ${t.chipPlan}`}>
                      <svg width="11" height="11" viewBox="0 0 11 11" fill="none" aria-hidden="true">
                        <path d="M5.5 1l1.2 3.6H10L7 6.8l1.1 3.7L5.5 8.4 2.9 10.5 4 6.8 1 4.6h3.3L5.5 1z" stroke="currentColor" strokeWidth="0.8" strokeLinejoin="round" />
                      </svg>
                      Plan
                    </span>
                  )}
                </div>
              </div>

              {/* Score */}
              <span className={`text-[10px] ml-auto shrink-0 relative z-10 ${t.score}`} aria-label={`Score ${task.compositeScore.toFixed(1)}`}>{task.compositeScore.toFixed(1)}</span>


            </div>

            {/* Description */}
            {hasDesc && (
              <motion.div layout className="pl-[29px]">
                <p className={`text-[12px] leading-[1.55] ${t.description} ${descExpanded ? '' : 'line-clamp-2'} cursor-text`} title={task.description ?? ''}>{task.description}</p>
                {task.description!.length > 120 && (
                  <button className={`mt-0.5 text-[11px] font-medium ${theme === 'dark' ? 'text-[#3b5bdb] hover:text-[#5a7aff]' : 'text-[#1a6bff] hover:text-[#0f5ce8]'} transition-colors duration-100`} onClick={() => setDescExpanded(v => !v)}>
                    {descExpanded ? 'Show less' : 'Show more'}
                  </button>
                )}
              </motion.div>
            )}
          </div>
        )}

        {/* ── Edit mode ── */}
        {isEditing && (
          <div className="relative z-10 w-full">
            <TaskEditShell fields={editFields} onChange={setEditFields} onSave={saveEdit} onCancel={cancelEdit} isSaving={isUpdating} saveLabel="Save" t={t} theme={theme} />
          </div>
        )}
      </motion.div>
    </motion.div>
  )
}