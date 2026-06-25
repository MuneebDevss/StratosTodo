import { TASK_THEMES } from "@/Common/Constants/ThemeConstants"

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

export interface EditFields {
  title: string
  description: string
  priority: string
  minutes: string
}

export interface TaskEditShellProps {
  fields: EditFields
  onChange: (fields: EditFields) => void
  onSave: () => void
  onCancel: () => void
  isSaving?: boolean
  saveLabel?: string
  /** Themed token set from THEMES['light'] or THEMES['dark'] */
  t: (typeof TASK_THEMES)[keyof typeof TASK_THEMES]
  theme: 'light' | 'dark'
}
export interface TaskCardProps {
  task: Task
  onEdit?: (task: Task) => void
  theme?: 'light' | 'dark'
  onThemeToggle?: () => void
  showThemeToggle?: boolean
}

export interface DayColumnProps {
  date: string
  onEditTask?: (task: Task) => void
  onAddTask?: (date: string) => void
}

export interface ConfirmDeleteDialogProps {
  open: boolean
  planTitle: string
  taskCount?: number
  isDeleting?: boolean
  onConfirm: () => void
  onCancel: () => void
  theme?: 'light' | 'dark'
}

export interface DaySectionProps {
  group: DayGroup
  theme?: 'light' | 'dark'
}

export interface DropZoneProps {
  date: string
  theme: 'light' | 'dark'
  children: React.ReactNode
}

export interface DayGroup {
  date: string           // 'YYYY-MM-DD'
  tasks: Task[]
  usedMinutes: number
  totalMinutes: number   // from user's daily_capacity_minutes
}