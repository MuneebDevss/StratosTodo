// app/oauth/consent/page.tsx
'use client'

import { useEffect, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { apiClient } from '@/lib/api-client'

export default function OAuthConsentPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const token = localStorage.getItem('accessToken') // match your setTokens key
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
