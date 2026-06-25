'use client'

import { useEffect, useRef } from 'react'

import { useTheme } from '@/features/settings/hooks/use-theme'
import { ConfirmDeleteDialogProps } from '@/features/tasks'
import { DIALOG_THEME, TASK_THEMES } from '@/Common/Constants/ThemeConstants'

// ─── Component ────────────────────────────────────────────────────────────────

export function ConfirmDeleteDialog({
  open,
  planTitle,
  taskCount,
  isDeleting = false,
  onConfirm,
  onCancel,
  theme: themeProp,
}: ConfirmDeleteDialogProps) {
  const { theme: contextTheme } = useTheme()
  const theme = themeProp ?? contextTheme
  const t = TASK_THEMES[theme]
  const d = DIALOG_THEME[theme]
  const confirmRef = useRef<HTMLButtonElement>(null)

  // Focus the destructive action isn't ideal a11y-wise for "are you sure"
  // dialogs — focus Cancel instead, so Enter/Space defaults to the safe path.
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

  const taskLabel =
    taskCount === undefined
      ? 'its tasks'
      : `${taskCount} task${taskCount === 1 ? '' : 's'}`

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 ${d.overlay}`}
      role="presentation"
      onClick={onCancel}
    >
      <div
        className={`w-full max-w-[400px] border rounded-[12px] p-5 shadow-xl ${d.panel}`}
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="delete-plan-title"
        aria-describedby="delete-plan-body"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 id="delete-plan-title" className={`text-[15px] font-semibold mb-2 ${d.title}`}>
          Delete &ldquo;{planTitle}&rdquo;?
        </h2>
        <p id="delete-plan-body" className={`text-[13px] leading-[1.55] mb-5 ${d.body}`}>
          This removes the plan, but keeps {taskLabel} on your schedule —
          they&apos;ll just no longer be grouped under this plan. This can&apos;t be undone.
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
            ref={confirmRef}
            type="button"
            className={`h-8 px-3.5 rounded-[7px] text-[13px] font-medium cursor-pointer transition-[background] duration-150 disabled:opacity-50 ${d.danger}`}
            onClick={onConfirm}
            disabled={isDeleting}
          >
            {isDeleting ? 'Deleting…' : 'Delete plan'}
          </button>
        </div>
      </div>
    </div>
  )
}