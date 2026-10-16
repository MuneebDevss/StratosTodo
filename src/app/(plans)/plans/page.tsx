'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Search, Sparkles, ArrowUpRight, RefreshCw } from 'lucide-react'
import { PAGE_THEME } from '@/Common/Constants/ThemeConstants'
import { useTheme } from '@/features/settings/hooks/use-theme'
import { usePlans, PlanCard } from '@/features/Plans'

export default function PlansPage() {
  const { theme } = useTheme()
  const t = PAGE_THEME[theme]
  const { data: plans = [], isLoading, isError, refetch, isFetching } = usePlans()
  const [search, setSearch] = useState('')
  const [source, setSource] = useState('all')
  const [sort, setSort] = useState('newest')
  const visible = plans.filter(plan => (source === 'all' || plan.source === source) && `${plan.title} ${plan.goalDescription ?? ''}`.toLowerCase().includes(search.toLowerCase().trim())).sort((a, b) => sort === 'title' ? a.title.localeCompare(b.title) : new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  return (
    <div className={`min-h-screen ${t.bg}`}><div className="mx-auto max-w-5xl px-4 pb-12 pt-16 sm:px-8 sm:pt-10">
      <header className="mb-8 flex flex-wrap items-start justify-between gap-5"><div><p className={`mb-2 text-xs font-semibold uppercase tracking-widest ${t.subheading}`}>From idea to action</p><h1 className={`text-3xl font-semibold tracking-tight ${t.heading}`}>AI plans</h1><p className={`mt-2 max-w-lg text-sm leading-6 ${t.body}`}>Give your goals a clear next step. Open a plan to review its tasks and track your progress.</p></div><a href="https://claude.ai" target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center gap-2 rounded-lg bg-indigo-600 px-4 text-sm font-medium text-white hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"><Sparkles size={16} />Plan with Claude<ArrowUpRight size={16} /><span className="sr-only"> (opens in a new tab)</span></a></header>
      <div className={`mb-8 flex flex-wrap items-center justify-between gap-3 rounded-xl border p-4 ${t.border}`}><p className={`text-sm ${t.body}`}>Start in Claude: “Create a plan to help me prepare for my next exam.”</p><Link href="/settings" className="text-sm font-medium text-indigo-500 hover:underline">Manage connection →</Link></div>
      <div className="mb-6 flex flex-wrap gap-3">
        <label className={`flex min-w-0 flex-[1_1_240px] items-center gap-2 rounded-lg border px-3 ${t.border}`}><Search size={18} className={t.subheading} /><input aria-label="Search plans" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search your plans…" className={`min-h-11 w-full min-w-0 bg-transparent text-sm outline-none ${t.heading}`} /></label>
        <select aria-label="Filter plans by source" value={source} onChange={e => setSource(e.target.value)} className={`min-h-11 rounded-lg border px-3 text-sm ${t.bg} ${t.heading} ${t.border}`}><option value="all">All plans</option><option value="mcp">Created with Claude</option><option value="manual">Manual plans</option></select>
        <select aria-label="Sort plans" value={sort} onChange={e => setSort(e.target.value)} className={`min-h-11 rounded-lg border px-3 text-sm ${t.bg} ${t.heading} ${t.border}`}><option value="newest">Newest first</option><option value="title">Title A–Z</option></select>
      </div>
      {isLoading ? <div role="status" aria-label="Loading plans" className="grid gap-4 sm:grid-cols-2">{[1,2,3,4].map(i => <div key={i} className={`h-48 animate-pulse rounded-2xl ${t.skeleton}`} />)}</div> : isError ? <div role="alert" className={`rounded-xl border p-8 text-center ${t.border} ${t.body}`}><p>We couldn’t load your plans. Please try again.</p><button disabled={isFetching} onClick={() => refetch()} className="mt-4 inline-flex min-h-11 items-center gap-2 rounded-lg border px-4 text-sm disabled:opacity-50"><RefreshCw size={16} />Try again</button></div> : <>
        <p role="status" className={`mb-4 text-sm ${t.subheading}`}>{visible.length} {visible.length === 1 ? 'plan' : 'plans'}{search || source !== 'all' ? ` matching your filters` : ' in your workspace'}</p>
        {visible.length ? <div role="list" className="grid gap-4 sm:grid-cols-2">{visible.map(plan => <div role="listitem" key={plan.id}><PlanCard plan={plan} theme={theme} /></div>)}</div> : <div className={`rounded-2xl border border-dashed px-6 py-14 text-center ${t.border}`}><Sparkles className="mx-auto mb-4 text-indigo-500" size={32} /><h2 className={`text-lg font-semibold ${t.heading}`}>{plans.length ? 'No matching plans' : 'Your next goal starts here'}</h2><p className={`mx-auto mt-2 max-w-md text-sm leading-6 ${t.body}`}>{plans.length ? 'Try a different title or show all your plans.' : 'Connect Stratos to Claude, describe your goal, and ask it to create a plan. Your plan and its tasks will appear here.'}</p>{plans.length ? <button onClick={() => { setSearch(''); setSource('all') }} className="mt-5 min-h-11 rounded-lg border px-4 text-sm">Clear filters</button> : <Link href="/docs" className="mt-5 inline-flex min-h-11 items-center rounded-lg bg-indigo-600 px-4 text-sm text-white">How to create your first plan</Link>}</div>}
      </>}
    </div></div>
  )
}
