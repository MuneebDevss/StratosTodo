export interface Plan {
  id: string
  title: string
  goalDescription?: string | null
  source: 'mcp' | 'manual'
  createdAt: string
  updatedAt: string
}