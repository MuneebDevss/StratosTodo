'use client'

import { SIDEBAR_THEME, ThemeKey } from '@/Common/Constants/ThemeConstants'
import Link from 'next/link'
import { usePathname } from 'next/navigation'


const NAV_ITEMS = [
  {
    href: '/dashboard',
    label: 'Dashboard',
    icon: (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
        <rect x="2" y="2" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.25"/>
        <rect x="10" y="2" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.25"/>
        <rect x="2" y="10" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.25"/>
        <rect x="10" y="10" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.25"/>
      </svg>
    ),
  },
  {
    href: '/upcoming',
    label: 'Upcoming',
    icon: (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
        <rect x="2" y="3" width="14" height="13" rx="2" stroke="currentColor" strokeWidth="1.25"/>
        <path d="M6 2v2M12 2v2M2 7h14" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round"/>
        <path d="M5.5 11h3M5.5 13.5H10" stroke="currentColor" strokeWidth="1" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    href: '/plans',
    label: 'AI Plans',
    icon: (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
        <path d="M9 2l1.5 4.5H15l-3.75 2.75L12.75 14 9 11.25 5.25 14l1.5-4.75L3 6.5h4.5L9 2z" stroke="currentColor" strokeWidth="1.25" strokeLinejoin="round"/>
      </svg>
    ),
  },
  {
    href: '/review',
    label: 'Needs Review',
    icon: (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
        <path d="M9 5v4M9 13v.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        <path d="M3.5 15.5h11a1 1 0 00.87-1.5L9.87 3a1 1 0 00-1.74 0L2.63 14a1 1 0 00.87 1.5z" stroke="currentColor" strokeWidth="1.25" strokeLinejoin="round"/>
      </svg>
    ),
  },
]

const BOTTOM_ITEMS = [
  {
    href: '/settings',
    label: 'Settings',
    icon: (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
        <circle cx="9" cy="9" r="2.5" stroke="currentColor" strokeWidth="1.25"/>
        <path d="M9 2v1.5M9 14.5V16M2 9h1.5M14.5 9H16M3.93 3.93l1.06 1.06M13 13l1.07 1.07M14.07 3.93L13 5M5 13l-1.07 1.07" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round"/>
      </svg>
    ),
  },
]

interface SidebarProps {
  theme?: ThemeKey
}

export function Sidebar({ theme = 'light' }: SidebarProps) {
  const pathname = usePathname()
  const t = SIDEBAR_THEME[theme]

  return (
    <nav
      className={`w-14 border-r flex flex-col items-center py-4 gap-1.5 shrink-0 ${t.nav}`}
      aria-label="Main navigation"
    >
      {/* Logo */}
      <Link
        href="/dashboard"
        className="w-8 h-8 bg-[#1a6bff] rounded-lg flex items-center justify-center text-white mb-2.5"
        aria-label="StratosToDo home"
      >
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
          <rect x="2" y="3" width="14" height="12" rx="2" fill="white" fillOpacity="0.15"/>
          <path d="M5 7h8M5 10h5M5 13h3" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
          <circle cx="13" cy="13" r="3" fill="white" fillOpacity="0.9"/>
          <path d="M11.5 13l1 1 2-2" stroke="#1a6bff" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </Link>

      {/* Main nav */}
      {NAV_ITEMS.map(({ href, label, icon }) => {
        const active = pathname === href || pathname.startsWith(href + '/')
        return (
          <Link
            key={href}
            href={href}
            className={`w-9 h-9 rounded-lg flex items-center justify-center transition-[background,color] duration-150 ${
              active ? t.activeItem : t.inactiveItem
            }`}
            title={label}
            aria-label={label}
            aria-current={active ? 'page' : undefined}
          >
            {icon}
          </Link>
        )
      })}

      {/* Bottom nav */}
      <div className="mt-auto">
        {BOTTOM_ITEMS.map(({ href, label, icon }) => {
          const active = pathname === href
          return (
            <Link
              key={href}
              href={href}
              className={`w-9 h-9 rounded-lg flex items-center justify-center transition-[background,color] duration-150 ${
                active ? t.activeItem : t.inactiveItem
              }`}
              title={label}
              aria-label={label}
              aria-current={active ? 'page' : undefined}
            >
              {icon}
            </Link>
          )
        })}
      </div>
    </nav>
  )
}