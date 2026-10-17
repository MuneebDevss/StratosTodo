import { useMutation, useQueryClient } from '@tanstack/react-query'
import { apiClient } from '@/lib/api-client'
import { taskKeys } from './use-tasks'
import { PLAN_KEYS } from '@/features/Plans/api/use-plan'
import type { RescheduleStrategy } from '../types'

export interface RescheduleResult {
  success: boolean
  strategy?: RescheduleStrategy
  seatedCount: number
  graveyardCount: number
  message?: string
}

// POST /reschedule/run — manually trigger the deterministic engine
export function useRunReschedule() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (strategy: RescheduleStrategy) =>
      apiClient.post<RescheduleResult>('/reschedule/run', { strategy }).then((r) => r.data),
    onSuccess: () => {
      // Nuke all task caches — rescheduling touches many dates
      qc.invalidateQueries({ queryKey: taskKeys.all })
      qc.invalidateQueries({ queryKey: PLAN_KEYS.all })
    },
  })
}
