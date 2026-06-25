'use client'

import { PAGE_THEME, ThemeKey } from '@/Common/Constants/ThemeConstants'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState, useEffect } from 'react'
import { useUser } from '@/features/auth/api/use-user'
import { useTheme } from '@/features/settings/hooks/use-theme'
import { useDaySchedule } from '../api/use-tasks'

// ─── Nav data ─────────────────────────────────────────────────────────────────

const NAV_ITEMS = [
  {
    href: '/dashboard',
    label: 'Today',
    badge: 11,
    icon: (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
        <rect x="2" y="3" width="14" height="13" rx="2" stroke="#e8453c" strokeWidth="1.4" fill="none" />
        <rect x="2" y="3" width="14" height="5.5" rx="2" fill="#e8453c" />
        <rect x="4" y="6.5" width="10" height="8" rx="1" fill="#1e1e1e" fillOpacity="0.4" />
        <text x="9" y="12.5" textAnchor="middle" fill="white" fontSize="5.5" fontWeight="700" fontFamily="system-ui">25</text>
      </svg>
    ),
  },
  {
    href: '/upcoming',
    label: 'Upcoming',
    badge: null,
    icon: (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
        <rect x="2" y="3" width="14" height="13" rx="2" stroke="currentColor" strokeWidth="1.3" />
        <path d="M6 2v2M12 2v2M2 7h14" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
        <rect x="4" y="9" width="3" height="1.5" rx="0.5" fill="currentColor" opacity="0.6" />
        <rect x="7.5" y="9" width="3" height="1.5" rx="0.5" fill="currentColor" opacity="0.6" />
        <rect x="11" y="9" width="3" height="1.5" rx="0.5" fill="currentColor" opacity="0.6" />
        <rect x="4" y="11.5" width="3" height="1.5" rx="0.5" fill="currentColor" opacity="0.4" />
        <rect x="7.5" y="11.5" width="3" height="1.5" rx="0.5" fill="currentColor" opacity="0.4" />
      </svg>
    ),
  },
  {
    href: '/plans',
    label: 'AI Plans',
    badge: null,
    icon: (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
        <path d="M9 2l1.5 4.5H15l-3.75 2.75L12.75 14 9 11.25 5.25 14l1.5-4.75L3 6.5h4.5L9 2z"
          stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    href: '/review',
    label: 'Needs Review',
    badge: null,
    icon: (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
        <path d="M9 5v4M9 13v.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M3.5 15.5h11a1 1 0 00.87-1.5L9.87 3a1 1 0 00-1.74 0L2.63 14a1 1 0 00.87 1.5z"
          stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" />
      </svg>
    ),
  },
]

// ─── Hamburger Button (export this and place it in your topbar on mobile) ─────

export function HamburgerButton({ onClick }: { onClick: () => void }) {
  const { theme } = useTheme()
  const t = PAGE_THEME[theme]

  return (
    <button
      onClick={onClick}
      className={`sm:hidden w-9 h-9 flex items-center justify-center rounded-md ${t.sidebarSubheading} ${t.sidebarHoverText} ${t.sidebarHoverBg} transition-colors`}
      aria-label="Open navigation"
    >
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
        <path d="M2 4.5h14M2 9h14M2 13.5h14" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
      </svg>
    </button>
  )
}

// ─── Main Sidebar ─────────────────────────────────────────────────────────────

export function Sidebar() {
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)
  const { data: user } = useUser()
  const { theme } = useTheme()
  const { data: tasks, isPending } = useDaySchedule(new Date().toString());
  const t = PAGE_THEME[theme]

  const email = user?.email ?? ''
  const derivedName = email ? email.split('@')[0] : 'Munib'
  const userName = derivedName.charAt(0).toUpperCase() + derivedName.slice(1)
  const userAvatar = undefined

  // Close drawer on route change
  useEffect(() => {
    setMobileOpen(false)
  }, [pathname])

  // Prevent body scroll when drawer is open
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [mobileOpen])

  const sidebarContent = (
    <nav
      className={`flex flex-col h-full w-64 ${t.sidebarBg} ${t.sidebarBody} border-r ${t.sidebarBorder} select-none`}
      aria-label="Main navigation"
    >
      {/* ── Header ── */}
      <div className="flex items-center justify-between px-3 pt-3 pb-1 shrink-0">
        <button
          className={`flex items-center gap-2 px-1.5 py-1 rounded-md ${t.sidebarHoverBg} transition-colors min-w-0`}
          aria-label="Account menu"
        >
          {/* Avatar */}
          <div className="w-7 h-7 rounded-full overflow-hidden shrink-0 bg-[#1a3a2a] flex items-center justify-center">
            {userAvatar ? (
              <img src={userAvatar} alt={userName} className="w-full h-full object-cover" />
            ) : (
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
                <rect x="1" y="1" width="16" height="16" rx="2" fill="#1a6bff" fillOpacity="0.8" />
                <path d="M4 13h10M5 8h8M6 5h6" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
                <circle cx="13" cy="13" r="2.5" fill="white" fillOpacity="0.9" />
                <path d="M11.8 13l.9.9 1.8-1.8" stroke="#1a6bff" strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            )}
          </div>
          <span className={`text-sm font-medium ${t.sidebarHeading} truncate`}>{userName}</span>
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className={`${t.sidebarSubheading} shrink-0`}>
            <path d="M3 4.5l3 3 3-3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>

        <div className="flex items-center gap-0.5">
          {/* Bell */}
          <button
            className={`w-7 h-7 flex items-center justify-center rounded-md ${t.sidebarHoverBg} ${t.sidebarSubheading} ${t.sidebarHoverText} transition-colors`}
            aria-label="Notifications"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M8 2a4.5 4.5 0 00-4.5 4.5v2.25L2 10.5h12l-1.5-1.75V6.5A4.5 4.5 0 008 2z"
                stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" />
              <path d="M6.5 11.5a1.5 1.5 0 003 0" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
            </svg>
          </button>
          {/* Layout toggle — on mobile this closes the drawer */}
          <button
            onClick={() => setMobileOpen(false)}
            className={`w-7 h-7 flex items-center justify-center rounded-md ${t.sidebarHoverBg} ${t.sidebarSubheading} ${t.sidebarHoverText} transition-colors`}
            aria-label="Toggle layout"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <rect x="1.5" y="1.5" width="5.5" height="13" rx="1.5" stroke="currentColor" strokeWidth="1.2" />
              <rect x="9" y="1.5" width="5.5" height="13" rx="1.5" stroke="currentColor" strokeWidth="1.2" />
            </svg>
          </button>
        </div>
      </div>

      {/* ── Scrollable body ── */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden px-2 py-1 flex flex-col gap-0.5 no-scrollbar">

        {/* Add task */}
        <button className={`flex items-center justify-between w-full px-2.5 py-2 rounded-md ${t.sidebarHoverBg} transition-colors mt-1 mb-0.5`}>
          <div className="flex items-center gap-3">
            <div className="w-5 h-5 rounded-full bg-[#e8453c] flex items-center justify-center shrink-0">
              <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                <path d="M5 2v6M2 5h6" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </div>
            <span className="text-sm font-medium text-[#e8453c]">Add task</span>
          </div>
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none" className="text-[#e8453c] opacity-70">
            <path d="M2 9h2l2-5 2 10 2-6 2 3 2-2h2" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>

        {/* Search */}
        <NavRow href="/search" label="Search" pathname={pathname}
          icon={<svg width="18" height="18" viewBox="0 0 18 18" fill="none"><circle cx="8" cy="8" r="5" stroke="currentColor" strokeWidth="1.3" /><path d="M12 12l3 3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" /></svg>}
        />

        {/* Main nav */}
        {NAV_ITEMS.map(({ href, label, badge, icon }) => (
          <NavRow key={href} href={href} label={label} badge={label == 'Today' ? tasks?.tasks.length : badge ?? undefined} pathname={pathname} icon={icon} />
        ))}

        {/* Favorites */}
        <SectionHeader label="Favorites" />
        <NavRow href="/projects/stratos-v1" label="StratosToDo V1 Build" badge={39} pathname={pathname} isProject />

        {/* My Projects */}
        <SectionHeader label="My Projects" />
        <div className="h-2" />

      </div>

      {/* ── Bottom ── */}
      <div className={`border-t ${t.sidebarBorder} px-2 py-2 flex flex-col gap-0.5 shrink-0 mb-4`}>
        <NavRow href="/settings" label="Profile" pathname={pathname}
          icon={<svg width="18" height="18" viewBox="0 0 18 18" fill="none"><circle cx="9" cy="7" r="3" stroke="currentColor" strokeWidth="1.3" /><path d="M3 15c0-3 2.7-5 6-5s6 2 6 5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" /></svg>}
        />
      </div>
    </nav>
  )

  return (
    <>
      {/* ── DESKTOP: static sidebar, hidden on sm and below ── */}
      <div className="hidden sm:flex h-screen sticky top-0 shrink-0 overflow-hidden">
        {sidebarContent}
      </div>

      {/* ── MOBILE: hamburger trigger + slide-in drawer ── */}
      <div className="sm:hidden">
        {/* Hamburger — render this in your layout's mobile topbar */}
        {!mobileOpen && (
          <button
            onClick={() => setMobileOpen(true)}
            className={`fixed top-3 left-3 z-40 w-9 h-9 flex items-center justify-center rounded-md ${t.sidebarBg} border ${t.sidebarBorder} ${t.sidebarSubheading} ${t.sidebarHoverText} transition-colors`}
            aria-label="Open navigation"
          >
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path d="M2 4.5h14M2 9h14M2 13.5h14" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
            </svg>
          </button>
        )}

        {/* Backdrop */}
        {mobileOpen && (
          <div
            className="fixed inset-0 bg-black/60 z-40 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
            aria-hidden="true"
          />
        )}

        {/* Drawer */}
        <div
          className={`
            fixed top-0 left-0 h-full z-50
            transition-transform duration-300 ease-in-out
            ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}
          `}
        >
          {sidebarContent}
        </div>
      </div>
    </>
  )
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function SectionHeader({ label }: { label: string }) {
  const { theme } = useTheme()
  const t = PAGE_THEME[theme]

  return (
    <div className="px-2.5 pt-4 pb-1">
      <span className={`text-xs font-semibold ${t.sidebarSubheading} tracking-wide uppercase`}>{label}</span>
    </div>
  )
}

interface NavRowProps {
  href: string
  label: string
  badge?: number
  pathname: string
  icon?: React.ReactNode
  isProject?: boolean
}

function NavRow({ href, label, badge, pathname, icon, isProject = false }: NavRowProps) {
  const active = pathname === href || pathname.startsWith(href + '/')
  const { theme } = useTheme()
  const t = PAGE_THEME[theme]

  return (
    <Link
      href={href}
      className={`
        flex items-center justify-between w-full px-2.5 py-[7px] rounded-md
        transition-colors duration-100
        ${active ? `${t.sidebarActiveBg} ${t.sidebarActiveText}` : `${t.sidebarBody} ${t.sidebarHoverBg} ${t.sidebarHoverText}`}
      `}
      aria-current={active ? 'page' : undefined}
    >
      <div className="flex items-center gap-3 min-w-0">
        {isProject ? (
          <span className={`text-base leading-none shrink-0 font-medium ${active ? t.sidebarActiveText : t.sidebarSubheading}`}>#</span>
        ) : (
          <span className={`shrink-0 ${active ? t.sidebarActiveText : t.sidebarSubheading}`}>{icon}</span>
        )}
        <span className={`text-sm truncate ${active ? 'font-medium' : 'font-normal'}`}>{label}</span>
      </div>
      {badge != null && (
        <span className={`text-xs tabular-nums shrink-0 ml-2 ${active ? 'opacity-70' : t.sidebarSubheading}`}>
          {badge}
        </span>
      )}
    </Link>
  )
}


