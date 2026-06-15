'use client'

import { formatCapacity, capacityPercent, getCapacityStatus } from '../utils/format'

interface CapacityBarProps {
  usedMinutes: number
  totalMinutes: number
}

const STATUS_COLOR: Record<string, string> = {
  ok:      'var(--capacity-ok)',
  warning: 'var(--capacity-warn)',
  full:    'var(--capacity-full)',
}

export function CapacityBar({ usedMinutes, totalMinutes }: CapacityBarProps) {
  const pct = capacityPercent(usedMinutes, totalMinutes)
  const status = getCapacityStatus(usedMinutes, totalMinutes)
  const color = STATUS_COLOR[status]

  return (
    <>
      <div className="cap-card__row">
        <span className="cap-card__label">Daily capacity</span>
        <span className="cap-card__stat" style={{ color }}>
          {formatCapacity(usedMinutes, totalMinutes)}
          <span className="cap-card__pct"> · {pct}%</span>
        </span>
      </div>
      <div className="cap-card__track">
        <div
          className="cap-card__fill"
          style={{ width: `${pct}%`, background: color }}
          role="progressbar"
          aria-valuenow={pct}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={`${formatCapacity(usedMinutes, totalMinutes)} used`}
        />
      </div>
    </>
  )
}
