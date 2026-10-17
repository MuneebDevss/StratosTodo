'use client'

import { useEffect, useRef, useState } from 'react'
import { useTheme } from '@/features/settings/hooks/use-theme'
import { DIALOG_THEME, PAGE_THEME } from '@/Common/Constants/ThemeConstants'
import { useRunReschedule } from '../api/use-reschedule'
import type { RescheduleResult } from '../api/use-reschedule'
import type { RescheduleStrategy } from '../types'

interface RescheduleDialogProps {
  open: boolean
  onClose: () => void
  onSuccess?: (result: RescheduleResult) => void
  theme?: 'light' | 'dark'
}

const STRATEGIES: Array<{
  value: RescheduleStrategy
  name: string
  description: string
  explanation: string
  impact: string
  bestFor: string
}> = [
  {
    value: 'CDU',
    name: 'Complete Day Update',
    description: 'Reorganize my entire pending schedule',
    explanation: 'Moves the oldest overdue day to today and places each following task-day consecutively after it. Your existing upcoming tasks are then moved forward in the same order, removing empty-day gaps.',
    impact: 'This may change the dates of your already scheduled upcoming tasks.',
    bestFor: 'Catching up by rebuilding your schedule into a clean, continuous sequence.',
  },
  {
    value: 'HPF',
    name: 'High Priority First',
    description: 'Handle my most important overdue tasks first',
    explanation: 'Orders overdue tasks by priority and schedules the highest-priority tasks first. When tasks have the same priority, the oldest overdue task goes first.',
    impact: 'Your existing current and future scheduled task dates stay unchanged.',
    bestFor: 'Catching up on important work before less important overdue tasks.',
  },
  {
    value: 'FG',
    name: 'Fill Gaps',
    description: 'Fit overdue tasks around my existing schedule',
    explanation: 'Keeps your current and upcoming tasks where they are and places overdue tasks into available schedule capacity.',
    impact: 'Your existing current and future scheduled task dates stay unchanged.',
    bestFor: 'Catching up without disrupting your existing schedule.',
  },
]

export function RescheduleDialog({ open, onClose, onSuccess, theme: themeProp }: RescheduleDialogProps) {
  const { theme: contextTheme } = useTheme()
  const theme = themeProp ?? contextTheme
  const page = PAGE_THEME[theme]
  const dialog = DIALOG_THEME[theme]
  const [selected, setSelected] = useState<RescheduleStrategy>('FG')
  const [error, setError] = useState<string | null>(null)
  const [empty, setEmpty] = useState(false)
  const cancelRef = useRef<HTMLButtonElement>(null)
  const { mutate: runReschedule, isPending } = useRunReschedule()

  useEffect(() => {
    if (!open) return
    setSelected('FG')
    setError(null)
    setEmpty(false)
    cancelRef.current?.focus()
  }, [open])

  useEffect(() => {
    if (!open) return
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && !isPending) onClose()
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [open, isPending, onClose])

  if (!open) return null

  const chosen = STRATEGIES.find((strategy) => strategy.value === selected) ?? STRATEGIES[2]
  const submit = () => {
    if (isPending) return
    setError(null)
    runReschedule(selected, {
      onSuccess: (result) => {
        if (result.success === false || result.message === 'No overdue pending tasks to process.') {
          setEmpty(true)
          return
        }
        onSuccess?.(result)
        onClose()
      },
      onError: () => setError('Rescheduling could not be completed. Please try again.'),
    })
  }

  return (
    <div className={`fixed inset-0 z-[10000] flex items-center justify-center p-4 ${dialog.overlay}`} role="presentation" onClick={() => !isPending && onClose()}>
      <div
        className={`w-full max-w-2xl max-h-[92vh] overflow-y-auto rounded-2xl border p-5 shadow-2xl sm:p-6 ${dialog.panel}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="reschedule-dialog-title"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="mb-5 flex items-start justify-between gap-4">
          <div>
            <h2 id="reschedule-dialog-title" className={`text-xl font-semibold ${dialog.title}`}>Reschedule overdue tasks</h2>
            <p className={`mt-1 text-sm ${dialog.body}`}>Choose how you want overdue tasks to be added back into your schedule.</p>
          </div>
          <button type="button" onClick={onClose} disabled={isPending} className={`rounded-lg px-2 py-1 text-xl leading-none ${page.body}`} aria-label="Close dialog">×</button>
        </div>

        {empty ? (
          <div className={`rounded-xl border p-5 text-center ${page.border} ${page.panelBg}`}>
            <p className={`font-medium ${page.heading}`}>You&apos;re all caught up.</p>
            <p className={`mt-1 text-sm ${page.body}`}>There are no overdue tasks to reschedule.</p>
            <button type="button" onClick={onClose} className={`mt-5 min-h-11 rounded-lg px-4 text-sm font-medium ${page.navBtn}`}>Done</button>
          </div>
        ) : (
          <>
            <div className="space-y-3" role="radiogroup" aria-label="Rescheduling strategy">
              {STRATEGIES.map((strategy) => {
                const isSelected = strategy.value === selected
                return (
                  <button
                    key={strategy.value}
                    type="button"
                    role="radio"
                    aria-checked={isSelected}
                    onClick={() => setSelected(strategy.value)}
                    className={`w-full rounded-xl border p-4 text-left transition ${isSelected ? 'border-indigo-500 bg-indigo-500/10 ring-2 ring-indigo-500/20' : `${page.border} ${page.panelBg} hover:border-indigo-400/60`}`}
                  >
                    <div className="flex items-start gap-3">
                      <span className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border ${isSelected ? 'border-indigo-500' : page.border}`} aria-hidden="true">
                        {isSelected && <span className="h-2.5 w-2.5 rounded-full bg-indigo-500" />}
                      </span>
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-baseline gap-2">
                          <span className={`font-semibold ${page.heading}`}>{strategy.name}</span>
                          <span className={`text-[11px] font-semibold tracking-wider ${page.subheading}`}>{strategy.value}</span>
                        </div>
                        <p className={`mt-1 text-sm font-medium ${page.body}`}>{strategy.description}</p>
                        <p className={`mt-2 text-sm leading-6 ${page.body}`}>{strategy.explanation}</p>
                        <p className={`mt-2 text-sm font-medium ${strategy.value === 'CDU' ? 'text-amber-600 dark:text-amber-300' : page.heading}`}>{strategy.impact}</p>
                        <p className={`mt-2 text-xs ${page.subheading}`}><span className="font-semibold">Best for:</span> {strategy.bestFor}</p>
                      </div>
                    </div>
                  </button>
                )
              })}
            </div>

            {selected === 'HPF' && <p className={`mt-3 rounded-lg px-3 py-2 text-xs ${page.panelBg} ${page.body}`}>Priority first <span aria-hidden="true">→</span> oldest date when priority is equal. Tasks then use available daily capacity.</p>}
            {selected === 'FG' && <p className={`mt-3 rounded-lg px-3 py-2 text-xs ${page.panelBg} ${page.body}`}>Existing tasks stay in place; overdue tasks fill available space where possible.</p>}
            {selected === 'CDU' && <p className="mt-3 rounded-lg bg-amber-500/10 px-3 py-2 text-sm font-medium text-amber-700 dark:text-amber-300">Complete Day Update will also reorganize your existing upcoming pending tasks.</p>}
            {error && <p role="alert" className="mt-3 text-sm text-red-600 dark:text-red-300">{error}</p>}

            <div className="mt-6 flex justify-end gap-2">
              <button ref={cancelRef} type="button" onClick={onClose} disabled={isPending} className={`min-h-11 rounded-lg border px-4 text-sm font-medium ${page.navBtn}`}>Cancel</button>
              <button type="button" onClick={submit} disabled={isPending} className="min-h-11 rounded-lg bg-indigo-600 px-4 text-sm font-medium text-white transition hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-60" aria-busy={isPending}>
                {isPending ? 'Rescheduling…' : 'Reschedule Tasks'}
              </button>
            </div>
            <p className={`mt-3 text-right text-xs ${page.subheading}`}>Selected: {chosen.name}</p>
          </>
        )}
      </div>
    </div>
  )
}
