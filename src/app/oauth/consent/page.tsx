// app/oauth/consent/page.tsx
'use client'

import { Suspense, useEffect, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
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
    return <p>Invalid authorization request. Please restart the connection from Claude.</p>
  }
  if (error) return <p role="alert">{error}</p>
  return <p>Connecting to Claude…</p>
}

export default function OAuthConsentPage() {
  return (
    <Suspense fallback={<p>Loading…</p>}>
      <ConsentHandler />
    </Suspense>
  )
}
