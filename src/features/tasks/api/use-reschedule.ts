import { useMutation, useQueryClient } from '@tanstack/react-query'
import { apiClient } from '@/lib/api-client'
import { taskKeys } from './use-tasks'

interface RescheduleResult {
  rescheduled_count: number
  graveyarded_count: number
  message: string
}

// POST /reschedule/run — manually trigger the deterministic engine
export function useRunReschedule() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: () =>
      apiClient.post<RescheduleResult>('/reschedule/run',
         {
          date: new Date().toISOString().split('T')[0], // 'YYYY-MM-DD'
        }
      ).then((r) => r.data),
    onSuccess: () => {
      // Nuke all task caches — rescheduling touches many dates
      qc.invalidateQueries({ queryKey: taskKeys.all })
    },
  })
}
