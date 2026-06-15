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
  plan_id?: string
}

export interface CreateTaskPayload {
  title: string
  description?: string
  scheduledDate: string
  estimatedMinutes: number
  basePriority: BasePriority
}

export interface UpdateTaskPayload extends Partial<CreateTaskPayload> {
  status?: TaskStatus
}
