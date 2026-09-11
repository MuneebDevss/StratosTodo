'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTheme } from '@/features/settings/hooks/use-theme'
import { PAGE_THEME, TASK_THEMES } from '@/Common/Constants/ThemeConstants'
import { useCreateTask } from '@/features/tasks'

type BasePriority = 'low' | 'medium' | 'high'

interface CreateTaskModalProps {
    isOpen: boolean
    onClose: () => void
    theme?: 'light' | 'dark'
}

interface FormFields {
    title: string
    description: string
    scheduleDate: string
    estimatedMinutes: string
    basePriority: BasePriority
}

const INITIAL_STATE: FormFields = {
    title: '',
    description: '',
    scheduleDate: '',
    estimatedMinutes: '',
    basePriority: 'medium',
}

const PRIORITY_OPTIONS: { value: BasePriority; label: string; light: string; dark: string; activeLight: string; activeDark: string }[] = [
    {
        value: 'low',
        label: 'Low',
        light: 'bg-[#eef6ff] text-[#1a5fa0] border-transparent',
        dark: 'bg-[#0e1e38] text-[#5a9eff] border-transparent',
        activeLight: 'ring-2 ring-[#1a5fa0] border-[#1a5fa0]',
        activeDark: 'ring-2 ring-[#5a9eff] border-[#5a9eff]'
    },
    {
        value: 'medium',
        label: 'Medium',
        light: 'bg-[#fffbeb] text-[#8a5c00] border-transparent',
        dark: 'bg-[#2a1e00] text-[#ffa820] border-transparent',
        activeLight: 'ring-2 ring-[#8a5c00] border-[#8a5c00]',
        activeDark: 'ring-2 ring-[#ffa820] border-[#ffa820]'
    },
    {
        value: 'high',
        label: 'High',
        light: 'bg-[#fff0ed] text-[#c94020] border-transparent',
        dark: 'bg-[#2d1410] text-[#ff7a5a] border-transparent',
        activeLight: 'ring-2 ring-[#c94020] border-[#c94020]',
        activeDark: 'ring-2 ring-[#ff7a5a] border-[#ff7a5a]'
    },
]

export function CreateTaskModal({ isOpen, onClose, theme: externalTheme }: CreateTaskModalProps) {
    const { mutate: createTask, isPending } = useCreateTask()
    const { theme: contextTheme } = useTheme()
    const theme = externalTheme ?? contextTheme ?? 'light'
    

    // Component State
    const [fields, setFields] = useState<FormFields>(INITIAL_STATE)
    const [errors, setErrors] = useState<Partial<Record<keyof FormFields, string>>>({})

    // Ref assignments for DOM and interaction containment
    const modalRef = useRef<HTMLDivElement>(null)
    const firstInputRef = useRef<HTMLInputElement>(null)

    // Reset helper
    const handleReset = useCallback(() => {
        setFields(INITIAL_STATE)
        setErrors({})
    }, [])

    // Close modal with wrapper protection
    const handleClose = useCallback(() => {
        if (isPending) return
        handleReset()
        onClose()
    }, [isPending, onClose, handleReset])

    // Form Field Validation Logic
    const validateForm = (): boolean => {
        const newErrors: Partial<Record<keyof FormFields, string>> = {}

        if (!fields.title.trim()) {
            newErrors.title = 'Title cannot be empty.'
        }
        if (!fields.scheduleDate) {
            newErrors.scheduleDate = 'Scheduled date is required.'
        }

        const minutes = parseInt(fields.estimatedMinutes, 10)
        if (!fields.estimatedMinutes || isNaN(minutes) || minutes <= 0) {
            newErrors.estimatedMinutes = 'Duration must be greater than 0 minutes.'
        }

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    // Handle Form Submission
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (isPending || !validateForm()) return

        createTask({
            title: fields.title.trim(),
            description: fields.description.trim() || undefined,
            scheduleDate: fields.scheduleDate,
            estimatedMinutes: parseInt(fields.estimatedMinutes, 10),
            basePriority: fields.basePriority,
        }, {
            onSuccess: () => {
                handleClose()
            }
        })
    }

    // Effect: Focus First Field on Open & Lock Document Background Scrolling
    useEffect(() => {
        if (isOpen) {
            setTimeout(() => firstInputRef.current?.focus(), 50)
            document.body.style.overflow = 'hidden'
        }
        return () => {
            document.body.style.overflow = ''
        }
    }, [isOpen])

    // Effect: Handle Global Escape Window Key Press Listener
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && isOpen) {
                handleClose()
            }
        }
        window.addEventListener('keydown', handleKeyDown)
        return () => window.removeEventListener('keydown', handleKeyDown)
    }, [isOpen, handleClose])

    // Custom Accessible Trap Loop Management Strategy
    const handleFocusTrap = (e: React.KeyboardEvent) => {
        if (!modalRef.current || e.key !== 'Tab') return

        const focusableElements = modalRef.current.querySelectorAll<HTMLElement>(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        )
        const firstElement = focusableElements[0]
        const lastElement = focusableElements[focusableElements.length - 1]

        if (e.shiftKey) {
            if (document.activeElement === firstElement) {
                lastElement.focus()
                e.preventDefault()
            }
        } else {
            if (document.activeElement === lastElement) {
                firstElement.focus()
                e.preventDefault()
            }
        }
    }

    return (
        <AnimatePresence>
            {isOpen && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-10 overflow-y-auto"
                    onKeyDown={handleFocusTrap}
                >
                    {/* Backdrop Mask Overlay Overlay */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/40 backdrop-blur-[2px] transition-opacity"
                        onClick={handleClose}
                    />

                    {/* Modal Container Workspace Layout Shell */}
                    <motion.div
                        ref={modalRef}
                        initial={{ opacity: 0, y: 30, scale: 0.98 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 15, scale: 0.98 }}
                        transition={{ type: "spring", stiffness: 450, damping: 32 }}
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="modal-title-id"
                        className={`relative w-full max-w-[540px] rounded-xl shadow-2xl overflow-hidden z-10 border transition-colors duration-200 flex flex-col my-auto max-h-[90vh]
              ${theme === 'dark'
                                ? 'bg-[#181824] border-[#2c2c3f] text-slate-100 shadow-black/60'
                                : 'bg-white border-slate-200 text-slate-800'
                            }`}
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Real-time Top Loading Animation/Bar Segment */}
                        {isPending && (
                            <div className="absolute top-0 left-0 right-0 h-[3px] bg-transparent overflow-hidden z-50">
                                <motion.div
                                    className={`h-full w-full ${theme === 'dark' ? 'bg-[#5a9eff]' : 'bg-[#1a6bff]'}`}
                                    animate={{ x: ['-100%', '100%'] }}
                                    transition={{ repeat: Infinity, duration: 1.2, ease: "linear" }}
                                />
                            </div>
                        )}

                        {/* Header Structure Panel */}
                        <div className={`flex items-center justify-between px-5 py-4 border-b ${theme === 'dark' ? 'border-[#2c2c3f]' : 'border-slate-100'}`}>
                            <h2 id="modal-title-id" className="text-[16px] font-bold tracking-tight">
                                Create New Task
                            </h2>
                            <button
                                type="button"
                                onClick={handleClose}
                                disabled={isPending}
                                aria-label="Close modal window"
                                className={`p-1.5 rounded-lg transition-colors duration-150 ${theme === 'dark' ? 'hover:bg-[#2c2c3f] text-slate-400 hover:text-slate-200' : 'hover:bg-slate-100 text-slate-500 hover:text-slate-700'}`}
                            >
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                    <line x1="18" y1="6" x2="6" y2="18" />
                                    <line x1="6" y1="6" x2="18" y2="18" />
                                </svg>
                            </button>
                        </div>

                        {/* Form Workspace Scroll Area Viewport */}
                        <form onSubmit={handleSubmit} className="overflow-y-auto p-5 flex-1 space-y-4">

                            {/* Task Title Form Block Input */}
                            <div className="flex flex-col gap-1.5">
                                <label htmlFor="task-title" className={`text-[12px] font-semibold ${theme === 'dark' ? 'text-slate-300' : 'text-slate-600'}`}>
                                    Task Title <span className="text-rose-500">*</span>
                                </label>
                                <input
                                    ref={firstInputRef}
                                    type="text"
                                    id="task-title"
                                    disabled={isPending}
                                    placeholder="e.g., Review system logs"
                                    value={fields.title}
                                    onChange={(e) => setFields(prev => ({ ...prev, title: e.target.value }))}
                                    className={`w-full text-[14px] px-3 py-2 rounded-lg border transition-all duration-150 outline-none
                    ${errors.title ? 'border-rose-500 ring-1 ring-rose-500' : theme === 'dark' ? 'bg-[#202030] border-[#3a3a55] focus:border-[#3b5bdb] focus:ring-1 focus:ring-[#3b5bdb]' : 'bg-slate-50 border-slate-200 focus:border-[#1a6bff] focus:ring-1 focus:ring-[#1a6bff]'}
                    disabled:opacity-50 disabled:cursor-not-allowed`}
                                />
                                {errors.title && (
                                    <span className="text-rose-500 text-[11px] font-medium mt-0.5">{errors.title}</span>
                                )}
                            </div>

                            {/* Description Form Block Input Container */}
                            <div className="flex flex-col gap-1.5">
                                <label htmlFor="task-desc" className={`text-[12px] font-semibold ${theme === 'dark' ? 'text-slate-300' : 'text-slate-600'}`}>
                                    Description
                                </label>
                                <textarea
                                    id="task-desc"
                                    rows={3}
                                    disabled={isPending}
                                    placeholder="Add explicit project context notes..."
                                    value={fields.description}
                                    onChange={(e) => setFields(prev => ({ ...prev, description: e.target.value }))}
                                    className={`w-full text-[14px] px-3 py-2 rounded-lg border transition-all duration-150 outline-none resize-none
                    ${theme === 'dark' ? 'bg-[#202030] border-[#3a3a55] focus:border-[#3b5bdb] focus:ring-1 focus:ring-[#3b5bdb]' : 'bg-slate-50 border-slate-200 focus:border-[#1a6bff] focus:ring-1 focus:ring-[#1a6bff]'}
                    disabled:opacity-50 disabled:cursor-not-allowed`}
                                />
                            </div>

                            {/* Flex Grid Inline Row Splits for Schedule Date and Estimated Processing Minutes */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {/* Date Input Box */}
                                <div className="flex flex-col gap-1.5">
                                    <label htmlFor="task-date" className={`text-[12px] font-semibold ${theme === 'dark' ? 'text-slate-300' : 'text-slate-600'}`}>
                                        Scheduled Date <span className="text-rose-500">*</span>
                                    </label>
                                    <input
                                        type="date"
                                        id="task-date"
                                        disabled={isPending}
                                        value={fields.scheduleDate}
                                        onChange={(e) => setFields(prev => ({ ...prev, scheduleDate: e.target.value }))}
                                        className={`w-full text-[14px] px-3 py-2 rounded-lg border transition-all duration-150 outline-none block
                      ${errors.scheduleDate ? 'border-rose-500 ring-1 ring-rose-500' : theme === 'dark' ? 'bg-[#202030] border-[#3a3a55] focus:border-[#3b5bdb] focus:ring-1 focus:ring-[#3b5bdb]' : 'bg-slate-50 border-slate-200 focus:border-[#1a6bff] focus:ring-1 focus:ring-[#1a6bff]'}
                      disabled:opacity-50 disabled:cursor-not-allowed`}
                                    />
                                    {errors.scheduleDate && (
                                        <span className="text-rose-500 text-[11px] font-medium mt-0.5">{errors.scheduleDate}</span>
                                    )}
                                </div>

                                {/* Duration Tracker Numeric Counter */}
                                <div className="flex flex-col gap-1.5">
                                    <label htmlFor="task-duration" className={`text-[12px] font-semibold ${theme === 'dark' ? 'text-slate-300' : 'text-slate-600'}`}>
                                        Estimated Duration (min) <span className="text-rose-500">*</span>
                                    </label>
                                    <input
                                        type="number"
                                        id="task-duration"
                                        min="1"
                                        disabled={isPending}
                                        placeholder="30"
                                        value={fields.estimatedMinutes}
                                        onChange={(e) => setFields(prev => ({ ...prev, estimatedMinutes: e.target.value }))}
                                        className={`w-full text-[14px] px-3 py-2 rounded-lg border transition-all duration-150 outline-none
                      ${errors.estimatedMinutes ? 'border-rose-500 ring-1 ring-rose-500' : theme === 'dark' ? 'bg-[#202030] border-[#3a3a55] focus:border-[#3b5bdb] focus:ring-1 focus:ring-[#3b5bdb]' : 'bg-slate-50 border-slate-200 focus:border-[#1a6bff] focus:ring-1 focus:ring-[#1a6bff]'}
                      disabled:opacity-50 disabled:cursor-not-allowed`}
                                    />
                                    {errors.estimatedMinutes && (
                                        <span className="text-rose-500 text-[11px] font-medium mt-0.5">{errors.estimatedMinutes}</span>
                                    )}
                                </div>
                            </div>

                            {/* Dynamic Segmented Chip Field Options Configuration Mapping Control for Base Task Priority */}
                            <div className="flex flex-col gap-2 pt-1">
                                <span className={`text-[12px] font-semibold ${theme === 'dark' ? 'text-slate-300' : 'text-slate-600'}`}>
                                    Priority Level <span className="text-rose-500">*</span>
                                </span>
                                <div className="grid grid-cols-3 gap-2.5">
                                    {PRIORITY_OPTIONS.map((opt) => {
                                        const isSelected = fields.basePriority === opt.value
                                        return (
                                            <button
                                                key={opt.value}
                                                type="button"
                                                disabled={isPending}
                                                onClick={() => setFields(prev => ({ ...prev, basePriority: opt.value }))}
                                                className={`py-2 px-3 text-[13px] font-semibold rounded-lg border text-center transition-all duration-150 capitalize flex items-center justify-center gap-1.5
                          ${theme === 'dark' ? opt.dark : opt.light}
                          ${isSelected ? (theme === 'dark' ? opt.activeDark : opt.activeLight) : 'opacity-60 hover:opacity-100'}
                          disabled:opacity-40 disabled:cursor-not-allowed`}
                                            >
                                                <svg width="6" height="6" viewBox="0 0 6 6" fill="currentColor" aria-hidden="true">
                                                    <circle cx="3" cy="3" r="3" />
                                                </svg>
                                                {opt.label}
                                            </button>
                                        )
                                    })}
                                </div>
                            </div>
                        </form>

                        {/* Modal Actions Footer Segment Workspace Panel */}
                        <div className={`px-5 py-4 border-t flex items-center justify-end gap-3 ${theme === 'dark' ? 'border-[#2c2c3f]' : 'border-slate-100'}`}>
                            <button
                                type="button"
                                disabled={isPending}
                                onClick={handleClose}
                                className={`px-4 py-2 rounded-lg text-[13px] font-semibold transition-colors duration-150
                  ${theme === 'dark' ? 'bg-transparent text-slate-400 hover:bg-[#2c2c3f] hover:text-slate-200' : 'bg-transparent text-slate-600 hover:bg-slate-100 hover:text-slate-800'}
                  disabled:opacity-50 disabled:cursor-not-allowed`}
                            >
                                Cancel
                            </button>

                            <button
                                type="submit"
                                onClick={handleSubmit}
                                disabled={isPending}
                                className={`px-4 py-2 rounded-lg text-[13px] font-semibold shadow-sm transition-all duration-150 inline-flex items-center justify-center gap-2 min-w-[130px]
                  ${theme === 'dark' ? 'bg-[#3b5bdb] text-white hover:bg-[#4c6ef5]' : 'bg-[#1a6bff] text-white hover:bg-[#0f5ce8]'}
                  disabled:opacity-50 disabled:cursor-not-allowed`}
                            >
                                {isPending ? (
                                    <>
                                        <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                        </svg>
                                        <span>Creating Task...</span>
                                    </>
                                ) : (
                                    <span>Create Task</span>
                                )}
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    )
}