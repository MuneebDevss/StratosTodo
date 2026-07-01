import { useMutation, useQueryClient } from '@tanstack/react-query'
import { apiClient } from '@/lib/api-client'
import { taskKeys } from './use-tasks'
import { getLocalISODate, getLocalISOStartOfDate } from '@/Common/utils/formatter'

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
          date: getLocalISOStartOfDate(new Date(getLocalISODate()), true),
        }
      ).then((r) => r.data),
    onSuccess: () => {
      // Nuke all task caches — rescheduling touches many dates
      qc.invalidateQueries({ queryKey: taskKeys.all })
    },
  })
}
