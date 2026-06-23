import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { apiClient } from '@/lib/api-client'
import type { Plan } from '../types'
const PLAN_KEYS = {
  all: ['plans'] as const,
  lists: () => [...PLAN_KEYS.all, 'list'] as const,// used to fetch all plans
  detail: (id: string) => [...PLAN_KEYS.all, 'detail', id] as const,
  tasks: (planId: string) => [...PLAN_KEYS.all, 'tasks', planId] as const,
}

// Fetch all plans
export function usePlans() {
  return useQuery({
    queryKey: PLAN_KEYS.lists(),
    queryFn: async () => {
      const response = await apiClient.get<Plan[]>('/plans')
      return response.data
    },
  })
}

// Fetch a single plan by ID
export function usePlan(planId: string) {
  return useQuery({
    queryKey: PLAN_KEYS.detail(planId),
    queryFn: async () => {
      const response = await apiClient.get<Plan>(`/plans/${planId}`)
        return response.data
    },
  })
}   

// Fetch tasks for a specific plan
export function usePlanTasks(planId: string) {
    return useQuery({
        queryKey: PLAN_KEYS.tasks(planId),
        queryFn: async () => {
            const response = await apiClient.get(`/plans/${planId}/tasks`);
            return response.data;
        },
    });
}

// Delete a plan by ID
export function useDeletePlan() {
    const qc = useQueryClient()
  return useMutation({
    
    mutationFn: async (planId: string) => {
      await apiClient.delete(`/plans/${planId}`)
    },
    onSuccess: (_, planId) => {
      // Invalidate the plan list and the specific plan's detail cache
      qc.invalidateQueries({ queryKey: PLAN_KEYS.lists() })
      qc.invalidateQueries({ queryKey: PLAN_KEYS.detail(planId) })
    }
  })
}

