import { useMemo } from 'react'
import { useTasks } from '../api/use-tasks'
import { useUser } from '@/features/auth/api/use-user'
import type { DayGroup, Task } from '../types'


function getWindowDates(startDate: string, count: number): string[] {
  const dates: string[] = []
  const start = new Date(startDate + 'T00:00:00')
  for (let i = 0; i < count; i++) {
    const d = new Date(start)
    d.setDate(start.getDate() + i)
    dates.push(d.toISOString().slice(0, 10))
  }
  return dates
}

export function useUpcoming(windowStart: string, windowSize = 7) {
  const dates = getWindowDates(windowStart, windowSize)
  const windowEnd = dates[dates.length - 1]

  const { data: tasks = [], isLoading: tasksLoading } = useTasks({
    startDate: windowStart,
    endDate: windowEnd,
    status: 'pending',
  })


  const { data: user, isLoading: userLoading } = useUser()
  const dailyCapacity = user?.dailyCapacityMinutes ?? 480

  const dayGroups = useMemo<DayGroup[]>(() => {
    // Group tasks by scheduledDate into a map
    const map = new Map<string, Task[]>()
    for (const date of dates) map.set(date, [])
    for (const task of tasks) {
      const group = map.get(task.scheduledDate.slice(0, 10))
      if (group) group.push(task)
      // tasks outside the window (shouldn't happen) are silently dropped
    }
    return dates.map((date) => {
      const dayTasks = map.get(date) ?? []
      return {
        date,
        tasks: dayTasks,
        usedMinutes: dayTasks.reduce((sum, t) => sum + (t.estimatedMinutes ?? 0), 0),
        totalMinutes: dailyCapacity,
      }
    })
  }, [dates, tasks, dailyCapacity])
  const overdueTasks = tasks.filter((t) => t.scheduledDate < windowStart)
  return {
    dayGroups,
    dates,
    overdueTasks,
    isLoading: tasksLoading || userLoading,
  }
}
