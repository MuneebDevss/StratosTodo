import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { apiClient } from '@/lib/api-client'
import type { Task, TasksListParams, CreateTaskPayload, UpdateTaskPayload, DaySchedule } from '../types'
import { getLocalISODate, getLocalISOStartOfDate } from '@/Common'

// Query keys - centralized for cache invalidation
export const taskKeys = {
  all: ['tasks'] as const,
  lists: () => [...taskKeys.all, 'list'] as const,
  list: (params: TasksListParams) => [...taskKeys.lists(), params] as const,
  overdue: () => [...taskKeys.all, 'overdue'] as const,
  graveyard: () => [...taskKeys.all, 'graveyard'] as const,
  detail: (id: string) => [...taskKeys.all, 'detail', id] as const,
  schedule: (date: string) => [...taskKeys.all, 'schedule', date] as const,
}

// Fetch tasks with optional filters
export function useTasks(params: TasksListParams = {}) {
  return useQuery({
    queryKey: taskKeys.list(params),
    queryFn: () =>
      apiClient.get<Task[]>('/tasks', { params }).then((r) => r.data),
    staleTime: 30_000, // 30s — tasks don't change that fast
  })

}

// Fetch the day schedule — backend returns tasks + capacity metadata
export function useDaySchedule(date: string) {
  return useQuery({
    queryKey: taskKeys.schedule(date),
    queryFn: () =>
      apiClient.get<DaySchedule>('/tasks/by-date', {
        params: { startDate: date, endDate: date, includeCapacity: true },
      }).then((r) => r.data),
    staleTime: 30_000, // 30s — tasks don't change that fast
  })
}

// Overdue tasks list
export function useOverdueTasks() {
  return useQuery({
    queryKey: taskKeys.overdue(),
    queryFn: () =>
      apiClient.get<Task[]>('/tasks/overdue',{
        params: { date: getLocalISOStartOfDate(new Date(getLocalISODate()),true) },
      }).then((r) => r.data),
    refetchInterval: 60_000
  })
}

// Graveyard tasks
export function useGraveyardTasks() {
  return useQuery({
    queryKey: taskKeys.graveyard(),
    queryFn: () =>
      apiClient.get<Task[]>('/tasks/graveyard').then((r) => r.data),
    staleTime: 30_000, // 30s — tasks don't change that fast
  })
}

// Single task detail
export function useTask(id: string) {
  return useQuery({
    queryKey: taskKeys.detail(id),
    queryFn: () => apiClient.get<Task>(`/tasks/${id}`).then((r) => r.data),
    enabled: Boolean(id),
  })
}

// Create task
export function useCreateTask() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (payload: CreateTaskPayload) =>
      apiClient.post<Task>('/tasks', { ...payload, scheduleDate: getLocalISOStartOfDate(new Date(payload.scheduleDate), true) }).then((r) => r.data),
    onSuccess: (task) => {
      // Invalidate the schedule for the task's date + list queries
      qc.invalidateQueries({ queryKey: taskKeys.schedule(task.scheduledDate) })
      qc.invalidateQueries({ queryKey: taskKeys.lists() })
    },
  })
}

// Update task
// Updated useUpdateTask
export function useUpdateTask(id: string, previousDate?: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (payload: UpdateTaskPayload) =>
      apiClient.patch<Task>(`/tasks/${id}`, { ...payload, scheduleDate: payload.scheduleDate ? getLocalISOStartOfDate(new Date(payload.scheduleDate), true) : undefined }).then((r) => r.data),
    onSuccess: (task) => {
      qc.setQueryData(taskKeys.detail(id), task)

      qc.invalidateQueries({ queryKey: taskKeys.schedule(task.scheduledDate) })

      // 3. Invalidate lists and overdue
      qc.invalidateQueries({ queryKey: taskKeys.lists() })
      qc.invalidateQueries({ queryKey: taskKeys.overdue() })

      // 4. Invalidate graveyard if it's there
      qc.invalidateQueries({ queryKey: taskKeys.graveyard() })
    },
  })
}

// Delete task
export function useDeleteTask() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, date }: { id: string; date: string }) =>
      apiClient.delete(`/tasks/${id}`).then(() => ({ id, date })),
    onSuccess: ({ date }) => {
      qc.invalidateQueries({ queryKey: taskKeys.schedule(date) })
      qc.invalidateQueries({ queryKey: taskKeys.lists() })
      qc.invalidateQueries({ queryKey: taskKeys.graveyard() })
    },
  })
}

// Complete task (shorthand update)
export function useCompleteTask() {
  const qc = useQueryClient()

  return useMutation({
    // 1. mutationFn ONLY handles the network request
    mutationFn: async ({ id }: { id: string }) => {
      const response = await apiClient.patch<Task>(`/tasks/${id}`, { status: 'completed' })
      return response.data
    },

    // 2. onMutate runs BEFORE the network request fires
    onMutate: async ({ id }) => {
      // Cancel outbound refetches so they don't overwrite our optimistic update
      await qc.cancelQueries({ queryKey: ['tasks'] })

      // Snapshot the previous value
      const previousTasks = qc.getQueryData<Task[]>(['tasks'])

      // Optimistically update the cache immediately
      qc.setQueryData(['tasks'], (old: Task[] | undefined) =>
        old ? old.map((t: Task) => (t.id === id ? { ...t, status: 'completed' } : t)) : []
      )

      // Return a context object with the snapshotted value
      return { previousTasks }
    },

    // 3. If the mutation fails, use the context we returned from onMutate to rollback
    onError: (_err, _variables, context) => {
      if (context?.previousTasks) {
        qc.setQueryData(['tasks'], context.previousTasks)
      }
    },

    // 4. Always refetch or invalidate after success or error to sync with server
    onSettled: () => {
      qc.invalidateQueries({ queryKey: ['tasks'] })
    },
  })
}
