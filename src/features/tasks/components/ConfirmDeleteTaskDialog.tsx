'use client'

import { useEffect, useRef } from 'react'
import { useTheme } from '@/features/settings/hooks/use-theme'
import { DIALOG_THEME, TASK_THEMES } from '@/Common/Constants/ThemeConstants'

interface ConfirmDeleteTaskDialogProps {
  open: boolean
  taskTitle: string
  isDeleting?: boolean
  onConfirm: () => void
  onCancel: () => void
  theme?: 'light' | 'dark'
}

export function ConfirmDeleteTaskDialog({
  open,
  taskTitle,
  isDeleting = false,
  onConfirm,
  onCancel,
  theme: themeProp,
}: ConfirmDeleteTaskDialogProps) {
  const { theme: contextTheme } = useTheme()
  const theme = themeProp ?? contextTheme
  const t = TASK_THEMES[theme]
  const d = DIALOG_THEME[theme]
  const cancelRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (open) cancelRef.current?.focus()
  }, [open])

  useEffect(() => {
    if (!open) return
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onCancel()
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [open, onCancel])

  if (!open) return null

  return (
    <div
      className={`fixed inset-0 z-[10000] flex items-center justify-center p-4 ${d.overlay}`}
      role="presentation"
      onClick={onCancel}
    >
      <div
        className={`w-full max-w-[400px] border rounded-[12px] p-5 shadow-xl ${d.panel}`}
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="delete-task-title"
        aria-describedby="delete-task-body"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 id="delete-task-title" className={`text-[15px] font-semibold mb-2 ${d.title}`}>
          Delete Task?
        </h2>
        <p id="delete-task-body" className={`text-[13px] leading-[1.55] mb-5 ${d.body}`}>
          Are you sure you want to delete &ldquo;{taskTitle}&rdquo;? This action cannot be undone.
        </p>
        <div className="flex justify-end gap-2">
          <button
            ref={cancelRef}
            type="button"
            className={`h-8 px-3.5 rounded-[7px] border text-[13px] font-medium cursor-pointer transition-[background,color] duration-150 ${t.cancelBtn}`}
            onClick={onCancel}
            disabled={isDeleting}
          >
            Cancel
          </button>
          <button
            type="button"
            className={`h-8 px-3.5 rounded-[7px] text-[13px] font-medium cursor-pointer transition-[background] duration-150 disabled:opacity-50 ${d.danger}`}
            onClick={onConfirm}
            disabled={isDeleting}
          >
            {isDeleting ? 'Deleting…' : 'Delete task'}
          </button>
        </div>
      </div>
    </div>
  )
}
