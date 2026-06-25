'use client'

import { useMemo } from 'react'
import { formatCapacity, capacityPercent, getCapacityStatus } from '../utils/format'
import { PAGE_THEME } from '@/Common/Constants/ThemeConstants'


interface CapacityBarProps {
  usedMinutes: number
  totalMinutes: number
  theme: 'light' | 'dark'
}

export function CapacityBar({
  usedMinutes,
  totalMinutes,
  theme,
}: CapacityBarProps) {
  const t = PAGE_THEME[theme]

  const pct = capacityPercent(usedMinutes, totalMinutes)
  const status = getCapacityStatus(usedMinutes, totalMinutes)

  const statusConfig = useMemo(() => {
    switch (status) {
      case 'ok':
        return {
          label: 'Healthy',
          bar: 'bg-emerald-500',
          badge:
            theme === 'light'
              ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
              : 'bg-emerald-950/50 text-emerald-300 border-emerald-800',
        }

      case 'warning':
        return {
          label: 'Busy',
          bar: 'bg-amber-500',
          badge:
            theme === 'light'
              ? 'bg-amber-50 text-amber-700 border-amber-200'
              : 'bg-amber-950/50 text-amber-300 border-amber-800',
        }

      default:
        return {
          label: 'Full',
          bar: 'bg-red-500',
          badge:
            theme === 'light'
              ? 'bg-red-50 text-red-700 border-red-200'
              : 'bg-red-950/50 text-red-300 border-red-800',
        }
    }
  }, [status, theme])

  return (
    <div className="space-y-4">
      {/* Header */}

      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className={`text-xs uppercase tracking-wider ${t.subheading}`}>
            Daily Capacity
          </p>

          <h3
            className={`mt-1 text-xl sm:text-2xl font-semibold ${t.heading}`}
          >
            {formatCapacity(usedMinutes, totalMinutes)}
          </h3>
        </div>

        <div
          className={`
            px-3 py-1.5
            rounded-full
            border
            text-xs
            font-medium
            w-fit
            ${statusConfig.badge}
          `}
        >
          {statusConfig.label}
        </div>
      </div>

      {/* Stats */}

      <div className="flex items-end justify-between">
        <div>
          <p className={`text-sm ${t.body}`}>
            {usedMinutes} of {totalMinutes} minutes used
          </p>
        </div>

        <div className="text-right">
          <span
            className={`
              text-3xl
              sm:text-4xl
              font-bold
              tracking-tight
              ${t.heading}
            `}
          >
            {pct}%
          </span>
        </div>
      </div>

      {/* Progress */}

      <div className="space-y-2">
        <div
          className={`
            h-3
            overflow-hidden
            rounded-full
            ${theme === 'light'
              ? 'bg-neutral-100'
              : 'bg-neutral-800'
            }
          `}
        >
          <div
            className={`
              h-full
              rounded-full
              transition-all
              duration-700
              ease-out
              ${statusConfig.bar}
            `}
            style={{ width: `${pct}%` }}
            role="progressbar"
            aria-valuenow={pct}
            aria-valuemin={0}
            aria-valuemax={100}
          />
        </div>

        <div className="flex justify-between text-xs">
          <span className={t.subheading}>{pct}%</span>
          <span className={t.subheading}>100%</span>
        </div>
      </div>
    </div>
  )
}