// app/oauth/consent/page.tsx
'use client'

import { Suspense, useEffect, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { AlertCircle, ArrowRight, LoaderCircle, Sparkles } from 'lucide-react'
import { apiClient } from '@/lib/api-client'

function ConsentHandler() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const token = localStorage.getItem('accessToken')
    const qs = searchParams.toString()

    if (!searchParams.get('client_id') || !searchParams.get('redirect_uri') ||
        !searchParams.get('code_challenge') || searchParams.get('response_type') !== 'code' ||
        searchParams.get('code_challenge_method') !== 'S256') {
      return
    }

    if (!token) {
      router.replace(`/login?returnTo=${encodeURIComponent(`/oauth/consent?${qs}`)}`)
      return
    }

    apiClient
      .post<{ redirectUrl: string }>('/oauth/authorize/complete', {
        client_id: searchParams.get('client_id'),
        redirect_uri: searchParams.get('redirect_uri'),
        code_challenge: searchParams.get('code_challenge'),
        scope: searchParams.get('scope') ?? undefined,
        state: searchParams.get('state') ?? undefined,
      }, { baseURL: '' })
      .then((res) => {
        window.location.assign(res.data.redirectUrl)
      })
      .catch(() => {
        // The API client clears tokens when refresh fails. Resume this
        // authorization request after signing in again instead of losing it.
        if (!localStorage.getItem('accessToken')) {
          router.replace(`/login?returnTo=${encodeURIComponent(`/oauth/consent?${qs}`)}`)
          return
        }
        setError('Could not complete authorization. Please try again.')
      })
  }, [searchParams, router])

  if (!searchParams.get('client_id') || !searchParams.get('redirect_uri') ||
      !searchParams.get('code_challenge') || searchParams.get('response_type') !== 'code' ||
      searchParams.get('code_challenge_method') !== 'S256') {
    return <ConnectionScreen error="This connection link is incomplete or invalid. Start a new connection from Claude’s connector settings." />
  }
  if (error) return <ConnectionScreen error={error} />
  return <ConnectionScreen />
}

function ConnectionScreen({ error }: { error?: string }) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-zinc-50 px-4 py-12 text-zinc-900 dark:bg-zinc-950 dark:text-zinc-100">
      <div className="w-full max-w-md">
        <Link href="/" className="mb-8 block text-center text-sm font-semibold tracking-widest">STRATOS</Link>
        <section aria-labelledby="connection-title" className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm sm:p-8 dark:border-zinc-800 dark:bg-zinc-900">
          <div className="mb-6 flex items-center justify-center gap-4" aria-hidden="true"><span className="flex size-12 items-center justify-center rounded-xl bg-indigo-600 text-lg font-semibold text-white">S</span><ArrowRight size={20} className="text-zinc-400" /><span className="flex size-12 items-center justify-center rounded-xl bg-orange-50 text-orange-700 dark:bg-orange-500/10 dark:text-orange-300"><Sparkles size={24} /></span></div>
          <h1 id="connection-title" className="text-center text-2xl font-semibold tracking-tight">{error ? 'Let’s try that again' : 'Connecting to Claude'}</h1>
          <p className="mt-3 text-center text-sm leading-6 text-zinc-500 dark:text-zinc-400">{error ? 'Your connection hasn’t finished yet.' : 'We’re completing your sign-in. You’ll return to Claude automatically when your account is ready.'}</p>
          {error ? <div className="mt-6 space-y-4"><p role="alert" className="flex gap-2 rounded-xl bg-amber-50 p-4 text-sm leading-6 text-amber-800 dark:bg-amber-500/10 dark:text-amber-200"><AlertCircle size={18} className="mt-1 shrink-0" />{error}</p><a href="https://claude.ai/settings/connectors" className="flex min-h-11 items-center justify-center rounded-lg bg-indigo-600 px-4 text-sm font-medium text-white hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500">Return to Claude</a></div> : <div role="status" className="mt-6 flex items-center justify-center gap-3 rounded-xl bg-zinc-50 p-4 text-sm dark:bg-zinc-800"><LoaderCircle size={18} className="animate-spin text-indigo-500" />Completing connection…</div>}
          <p className="mt-6 text-center text-xs leading-5 text-zinc-500 dark:text-zinc-400">You can manage your connection in Claude settings.</p>
        </section>
        <p className="mt-6 text-center text-sm text-zinc-500">Need a hand? <Link href="/support" className="text-indigo-600 underline-offset-4 hover:underline dark:text-indigo-400">Get help</Link></p>
      </div>
    </main>
  )
}

export default function OAuthConsentPage() {
  return (
    <Suspense fallback={<ConnectionScreen />}>
      <ConsentHandler />
    </Suspense>
  )
}
