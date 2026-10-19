'use client'

import { useState } from 'react'
import { useDiscardTasks } from '../api/use-tasks'

interface Props {
  taskIds: string[]
  taskCount: number
  open: boolean
  theme: 'light' | 'dark'
  onClose: () => void
}

export function DiscardTasksDialog({ taskIds, taskCount, open, theme, onClose }: Props) {
  const [reason, setReason] = useState('')
  const { mutate: discard, isPending, isError } = useDiscardTasks()
  if (!open) return null

  const submit = () => discard({ taskIds, reason: reason.trim() || undefined }, { onSuccess: () => { setReason(''); onClose() } })
  return (
    <div className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/40 p-4" role="dialog" aria-modal="true" aria-labelledby="discard-title">
      <div className={`w-full max-w-md rounded-2xl border p-5 shadow-2xl ${theme === 'dark' ? 'border-[#2a2a40] bg-[#13131c] text-[#f0f0f8]' : 'border-[#e4e4ec] bg-white text-[#1a1a2e]'}`}>
        <h2 id="discard-title" className="text-lg font-semibold">Discard {taskCount === 1 ? 'task' : `${taskCount} tasks`}?</h2>
        <p className={`mt-2 text-sm ${theme === 'dark' ? 'text-[#9090b0]' : 'text-[#6b6b80]'}`}>The task will stay available in your task history. A reason is optional.</p>
        <textarea value={reason} onChange={e => setReason(e.target.value)} maxLength={1000} rows={3} placeholder="Why are you discarding this? (optional)" className={`mt-4 w-full rounded-lg border p-3 text-sm outline-none ${theme === 'dark' ? 'border-[#2e2e48] bg-[#1a1a28] placeholder:text-[#5a5a78]' : 'border-[#e0e0ea] bg-[#f8f8fc] placeholder:text-[#a0a0b8]'}`} />
        {isError && <p className="mt-2 text-sm text-red-500" role="alert">Could not discard the selected tasks. Please try again.</p>}
        <div className="mt-5 flex justify-end gap-2"><button onClick={onClose} disabled={isPending} className="rounded-lg border px-4 py-2 text-sm">Cancel</button><button onClick={submit} disabled={isPending} className="rounded-lg bg-rose-600 px-4 py-2 text-sm font-semibold text-white disabled:opacity-50">{isPending ? 'Discarding…' : 'Discard'}</button></div>
      </div>
    </div>
  )
}
