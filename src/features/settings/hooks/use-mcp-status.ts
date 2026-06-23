'use client'

import { useQuery } from '@tanstack/react-query'
import { apiClient } from '@/lib/api-client'


export interface McpStatus {
  connected: boolean
  connectedAt: string | null
  expiresAt: string | null
  clientName: string | null
}

export const MCP_STATUS_QUERY_KEY = ['users', 'me', 'mcp-status'] as const

export function useMcpStatus() {
  return useQuery<McpStatus>({
    queryKey: MCP_STATUS_QUERY_KEY,
    queryFn: async () => {
      const { data } = await apiClient.get('/users/me/mcp-status')
      return data
    },
    retry: false,
    staleTime: 1000 * 30, // 30s — short, since this is a "live-ish" indicator
    refetchOnWindowFocus: true, // catch a connection made in another tab
  })
}