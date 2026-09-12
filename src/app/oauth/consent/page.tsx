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
      })
      .then((res) => {
        window.location.assign(res.data.redirectUrl)
      })
      .catch(() => {
        setError('Could not complete authorization. Please try again.')
      })
  }, [searchParams, router])

  if (error) return <p>{error}</p>
  return <p>Connecting to Claude…</p>
}

export default function OAuthConsentPage() {
  return (
    <Suspense fallback={<p>Loading…</p>}>
      <ConsentHandler />
    </Suspense>
  )
}
