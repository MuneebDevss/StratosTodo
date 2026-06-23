'use client'

import { PAGE_THEME } from '@/Common/Constants/ThemeConstants'
import { usePlans } from '@/features/Plans'
import { PlanCard } from '@/features/Plans'
import { Plan } from '@/features/Plans/types'

type ThemeKey = keyof typeof PAGE_THEME

// ─── Skeleton ─────────────────────────────────────────────────────────────────

function PlanCardSkeleton({ theme }: { theme: ThemeKey }) {
  const t = PAGE_THEME[theme]
  return (
    <div className={`h-[88px] rounded-[10px] animate-pulse ${t.skeleton}`} aria-hidden="true" />
  )
}

// ─── Empty state ──────────────────────────────────────────────────────────────

function EmptyState({ theme }: { theme: ThemeKey }) {
  const t = PAGE_THEME[theme]
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center px-6">
      <svg width="40" height="40" viewBox="0 0 40 40" fill="none" aria-hidden="true" className={`mb-4 ${t.emptyIcon}`}>
        <path d="M20 4l4.4 13.1H38L26.8 25l4.4 13L20 30.4 8.8 38l4.4-13L2 17.1h13.6L20 4z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round"/>
      </svg>
      <h2 className={`text-[15px] font-semibold mb-1.5 ${t.emptyTitle}`}>No plans yet</h2>
      <p className={`text-[13px] leading-[1.55] max-w-[320px] ${t.emptyBody}`}>
        Open Claude with the StratosToDo connector and describe a goal —
        like &ldquo;help me plan my exam prep&rdquo; — and it&apos;ll show up here.
      </p>
    </div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function PlansPage() {
  const theme: ThemeKey = 'dark' // matches the Upcoming page's established theme
  const t = PAGE_THEME[theme]
  const { data: plans, isLoading, isError } = usePlans()

  return (
    <div className={`min-h-screen ${t.bg}`}>
      <div className="max-w-3xl mx-auto px-8 py-10">
        <header className="mb-8">
          <h1 className={`text-2xl font-bold mb-1 ${t.heading}`}>Plans</h1>
          <p className={`text-sm ${t.subheading}`}>
            Multi-day plans generated through your Claude connector, or created manually.
          </p>
        </header>

        {isLoading && (
          <div className="flex flex-col gap-2.5" aria-busy="true" aria-label="Loading plans">
            {Array.from({ length: 4 }).map((_, i) => (
              <PlanCardSkeleton key={i} theme={theme} />
            ))}
          </div>
        )}

        {isError && (
          <div className={`text-[13px] ${t.subheading}`}>
            Couldn&apos;t load your plans right now. Try refreshing the page.
          </div>
        )}

        {!isLoading && !isError && plans && plans.length === 0 && (
          <EmptyState theme={theme} />
        )}

        {!isLoading && !isError && plans && plans.length > 0 && (
          <div className="flex flex-col gap-2.5" role="list">
            {plans.map((plan : Plan) => (
              <div key={plan.id} role="listitem">
                <PlanCard plan={plan} theme={theme} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}