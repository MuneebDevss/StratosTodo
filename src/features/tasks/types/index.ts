export type BasePriority = 'low' | 'medium' | 'high'
export type TaskStatus = 'pending' | 'completed' | 'graveyard'

export interface Task {
  id: string
  user_id: string
  plan_id: string | null
  title: string
  description: string | null
  scheduledDate: string // ISO date string 'YYYY-MM-DD'
  estimatedMinutes: number
  basePriority: BasePriority
  compositeScore: number // computed by backend
  bumpCount: number
  status: TaskStatus
  createdAt: string
  updatedAt: string
}

export interface DaySchedule {
  date: string // 'YYYY-MM-DD'
  tasks: Task[]
  totalScheduledMinutes: number
  dailyCapacityMinutes: number
}

export interface TasksListParams {
  startDate?: string
  endDate?: string
  status?: TaskStatus
  planId?: string
}

export interface CreateTaskPayload {
  title: string
  description?: string
  scheduleDate: string
  estimatedMinutes: number
  basePriority: BasePriority
}

export interface UpdateTaskPayload extends Partial<CreateTaskPayload> {
  title?: string
  status?: TaskStatus
  scheduleDate?: string // for rescheduling without changing the original scheduledDate
  description?: string  // allow clearing description by passing null
  estimatedMinutes?: number  // allow clearing estimated time by passing null
  basePriority?: BasePriority // allow clearing priority by passing null
}
