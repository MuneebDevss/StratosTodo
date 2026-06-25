import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { apiClient } from '@/lib/api-client'
import type { Task, TasksListParams, CreateTaskPayload, UpdateTaskPayload, DaySchedule } from '../types'

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
      apiClient.get<Task[]>('/tasks/overdue').then((r) => r.data),
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
      apiClient.post<Task>('/tasks', payload).then((r) => r.data),
    onSuccess: (task) => {
      // Invalidate the schedule for the task's date + list queries
      qc.invalidateQueries({ queryKey: taskKeys.schedule(task.scheduledDate.toString().split('T')[0]) })
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
      apiClient.patch<Task>(`/tasks/${id}`, payload).then((r) => r.data),
    onSuccess: (task) => {
      qc.setQueryData(taskKeys.detail(id), task)

      qc.invalidateQueries({ queryKey: taskKeys.schedule(task.scheduledDate.toString().split('T')[0]) })

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
      qc.invalidateQueries({ queryKey: taskKeys.schedule(date.toString().split('T')[0]) })
      qc.invalidateQueries({ queryKey: taskKeys.lists() })
      qc.invalidateQueries({ queryKey: taskKeys.graveyard() })
    },
  })
}

// Complete task (shorthand update)
export function useCompleteTask() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id }: { id: string }) =>
      apiClient
        .patch<Task>(`/tasks/${id}`, { status: 'completed' })
        .then((r) => r.data),
    onSuccess: (task) => {
      qc.setQueryData(taskKeys.detail(task.id), task)
      qc.invalidateQueries({ queryKey: taskKeys.schedule(task.scheduledDate.toString().split('T')[0]) })
      qc.invalidateQueries({ queryKey: taskKeys.lists() })
      qc.invalidateQueries({ queryKey: taskKeys.overdue() })
      qc.invalidateQueries({ queryKey: taskKeys.graveyard() })
    },
  })
}
