export interface Plan {
  id: string
  title: string
  goalDescription?: string | null
  source: 'mcp' | 'manual'
  createdAt: string
  updatedAt: string
}

export interface PlanCardProps {
  plan: Plan
  theme?: 'light' | 'dark'
}