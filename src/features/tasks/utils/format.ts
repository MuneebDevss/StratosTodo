import type { BasePriority } from '../types'

// Format minutes → '2h 30m' or '45m'
export function formatDuration(minutes: number): string {
  if (minutes <= 0) return '0m'
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  if (h === 0) return `${m}m`
  if (m === 0) return `${h}h`
  return `${h}h ${m}m`
}

// Format capacity: '5h 30m / 8h used'
export function formatCapacity(used: number, total: number): string {
  return `${formatDuration(used)} / ${formatDuration(total)}`
}

// Capacity percentage capped at 100 for display
export function capacityPercent(used: number, total: number): number {
  if (total <= 0) return 0
  return Math.min(100, Math.round((used / total) * 100))
}

// Priority display config
export const PRIORITY_CONFIG: Record<
  BasePriority,
  { label: string; color: string; dotColor: string }
> = {
  high: {
    label: 'High',
    color: 'var(--priority-high-text)',
    dotColor: 'var(--priority-high)',
  },
  medium: {
    label: 'Med',
    color: 'var(--priority-med-text)',
    dotColor: 'var(--priority-med)',
  },
  low: {
    label: 'Low',
    color: 'var(--priority-low-text)',
    dotColor: 'var(--priority-low)',
  },
}

// Capacity status for coloring the bar
export type CapacityStatus = 'ok' | 'warning' | 'full'
export function getCapacityStatus(used: number, total: number): CapacityStatus {
  const pct = capacityPercent(used, total)
  if (pct >= 100) return 'full'
  if (pct >= 80) return 'warning'
  return 'ok'
}

// Format a date string 'YYYY-MM-DD' → 'Mon, Jun 14'
export function formatDateLabel(dateStr: string): string {
  const d = new Date(dateStr + 'T00:00:00')
  return d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })
}

export function isToday(dateStr: string): boolean {
  return dateStr === new Date().toISOString().slice(0, 10)
}
