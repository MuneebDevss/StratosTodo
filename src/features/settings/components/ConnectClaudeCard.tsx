'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowUpRight, Check, Copy, RefreshCw, Sparkles } from 'lucide-react'
import { useMcpStatus } from '../hooks/use-mcp-status'

const MCP_SERVER_URL = process.env.NEXT_PUBLIC_MCP_SERVER_URL ?? 'https://stratos-todo.vercel.app/mcp'

export default function ClaudeIntegrationSection() {
  const { data: status, isLoading, isError, isFetching, refetch } = useMcpStatus()
  const [copyState, setCopyState] = useState<'idle' | 'copied' | 'error'>('idle')
  async function copyUrl() {
    try {
      await navigator.clipboard.writeText(MCP_SERVER_URL)
      setCopyState('copied')
    } catch {
      setCopyState('error')
    }
  }
  return (
    <section aria-labelledby="integration-title" className="space-y-4">
      <h2 id="integration-title" className="text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">Integrations</h2>
      <div className="overflow-hidden rounded-2xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-[#121214]">
        <div className="space-y-5 p-5 sm:p-6">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-indigo-50 p-3 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400"><Sparkles size={22} aria-hidden="true" /></div>
              <div><h3 className="text-base font-semibold">Claude + Stratos</h3><p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">Turn a conversation into a plan.</p></div>
            </div>
            <span role="status" className={`rounded-full px-3 py-1 text-xs font-medium ${status?.connected && !isError ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400' : 'bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300'}`}>
              {isLoading ? 'Checking connection…' : isError ? 'Status unavailable' : status?.connected ? 'Connected' : 'Not connected'}
            </span>
          </div>
          <p className="text-sm leading-6 text-zinc-600 dark:text-zinc-400">{status?.connected ? 'Your connection is ready. Ask Claude to review your schedule or help organize your tasks.' : 'Connect your account so Claude can read your schedule and help create and update tasks.'}</p>
          {!status?.connected && <ol className="space-y-4 border-t border-zinc-100 pt-5 dark:border-zinc-800">
            {[
              ['Open Claude settings', 'Go to Connectors and choose to add a custom connector.'],
              ['Add Stratos', 'Name your connector Stratos and paste the URL below.'],
              ['Sign in to connect', 'Use your Stratos account, then return to Claude to finish setup.'],
            ].map(([title, detail], index) => <li key={title} className="flex gap-3"><span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-zinc-100 text-xs font-semibold dark:bg-zinc-800">{index + 1}</span><div><p className="text-sm font-medium">{title}</p><p className="mt-1 text-sm leading-5 text-zinc-500 dark:text-zinc-400">{detail}</p></div></li>)}
          </ol>}
          <div>
            <label htmlFor="connector-url" className="mb-2 block text-xs font-medium text-zinc-500 dark:text-zinc-400">Connector URL</label>
            <div className="flex flex-col gap-2 sm:flex-row">
              <input id="connector-url" readOnly value={MCP_SERVER_URL} onFocus={e => e.target.select()} className="min-w-0 flex-1 rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-3 font-mono text-xs focus-visible:outline-2 focus-visible:outline-indigo-500 dark:border-zinc-700 dark:bg-zinc-900" />
              <button onClick={copyUrl} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg border border-zinc-200 px-4 text-sm font-medium hover:bg-zinc-50 focus-visible:outline-2 focus-visible:outline-indigo-500 dark:border-zinc-700 dark:hover:bg-zinc-800">{copyState === 'copied' ? <Check size={16} /> : <Copy size={16} />}{copyState === 'copied' ? 'Copied' : 'Copy URL'}</button>
            </div>
            <p role="status" className="mt-2 text-xs text-zinc-500 dark:text-zinc-400">{copyState === 'error' ? 'Could not copy. Select the URL above and copy it manually.' : copyState === 'copied' ? 'Ready to paste into Claude.' : 'Use this URL in the custom connector setup.'}</p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <a href="https://claude.ai/settings/connectors" target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 text-sm font-medium text-white hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500">{status?.connected ? 'Open Claude' : 'Continue in Claude'}<ArrowUpRight size={16} /><span className="sr-only"> (opens in a new tab)</span></a>
            <button disabled={isFetching} onClick={() => refetch()} className="inline-flex min-h-11 items-center gap-2 rounded-lg px-3 text-sm text-zinc-600 hover:bg-zinc-100 focus-visible:outline-2 focus-visible:outline-indigo-500 disabled:opacity-50 dark:text-zinc-300 dark:hover:bg-zinc-800"><RefreshCw size={15} className={isFetching ? 'animate-spin' : ''} />Check connection</button>
          </div>
        </div>
        <div className="flex flex-wrap justify-between gap-2 border-t border-zinc-100 bg-zinc-50 px-5 py-4 text-xs leading-5 text-zinc-500 dark:border-zinc-800 dark:bg-zinc-900/40 dark:text-zinc-400"><span>Manage or disconnect access in Claude settings.</span><Link href="/docs" className="font-medium text-indigo-600 underline-offset-4 hover:underline dark:text-indigo-400">Setup guide</Link></div>
      </div>
    </section>
  )
}
