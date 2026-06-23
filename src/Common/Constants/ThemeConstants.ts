/**
 * Shared theme tokens
 * ───────────────────
 * PAGE_THEME: page-level tokens (backgrounds, headings, dividers).
 *   Used by all pages: Dashboard, Upcoming, Plans, Settings.
 *
 * SIDEBAR_THEME: sidebar-specific tokens that don't exist in PAGE_THEME.
 *
 * COMPONENT_THEMES (TaskCard's THEMES) stay in TaskCard.tsx — they are
 * component-level tokens (card surfaces, inputs, chips) not page-level.
 * Import from there for component use; import from here for page shells.
 *
 * Usage:
 *   import { PAGE_THEME, type ThemeKey } from '@/lib/theme'
 *   const t = PAGE_THEME[theme]
 */

export type ThemeKey = 'light' | 'dark'

export const PAGE_THEME = {
  light: {
    // Page / layout
    bg: 'bg-[#f5f5f7]',
    panelBg: 'bg-white',
    border: 'border-[#e8e8ec]/50',
    divider: 'border-[#e8e8ec]',

    // Typography
    heading: 'text-[#1a1a2e]',
    subheading: 'text-[#9898a8]',
    body: 'text-[#6b6b80]',
    back: 'text-[#9898a8] hover:text-[#1a1a2e]',

    // Empty / skeleton states
    skeleton: 'bg-[#e8e8ec]',
    emptyIcon: 'text-[#d0d0da]',
    emptyTitle: 'text-[#1a1a2e]',
    emptyBody: 'text-[#9898a8]',

    // Shared action tokens
    deleteBtn: 'border-[#e8e8ec]/50 bg-white text-[#c94020] hover:bg-[#fff0ed] hover:border-[#f5c0b0]',
    navBtn: 'bg-[#f5f5f7] border-[#e8e8ec]/50 text-[#6b6b80] hover:bg-[#e8e8f0]',
    datePill: 'bg-[#f5f5f7] border-[#e8e8ec]/50 text-[#6b6b80]',
  },
  dark: {
    // Page / layout
    bg: 'bg-[#1e1e1e]',
    panelBg: 'bg-[#161618]',
    border: 'border-[#2d2d2d]',
    divider: 'border-[#2d2d2d]',

    // Typography
    heading: 'text-white',
    subheading: 'text-[#aaaaaa]',
    body: 'text-[#9898a8]',
    back: 'text-[#888888] hover:text-white',

    // Empty / skeleton states
    skeleton: 'bg-[#2e2e3e]',
    emptyIcon: 'text-[#3a3a55]',
    emptyTitle: 'text-[#e8e8f0]',
    emptyBody: 'text-[#7070a0]',

    // Shared action tokens
    deleteBtn: 'border-[#2e2e3e] bg-[#1c1c28] text-[#ff7a5a] hover:bg-[#2d1820] hover:border-[#7a2030]',
    navBtn: 'bg-[#242424] border-[#2d2d2d] text-[#888888] hover:bg-[#2e2e2e] hover:text-[#e0e0e0]',
    datePill: 'bg-[#242424] border-[#2d2d2d] text-[#888888]',
  },
} as const

export const SIDEBAR_THEME = {
  light: {
    nav: 'bg-white border-[#e8e8ec]/50',
    activeItem: 'bg-[#eff3ff] text-[#1a6bff]',
    inactiveItem: 'text-[#9898a8] hover:bg-[#f0f0f6] hover:text-[#1a1a2e]',
    overdueText: 'text-[#6b6b80]',
    overdueBar: 'bg-[#fff8f0] border-[#f5c880]/50 text-[#b05a00]',
    overdueCta: 'bg-[#fff0ed] text-[#c94020] border border-[#f5c0b0]/50 hover:bg-[#ffe0d8]',
  },
  dark: {
    nav: 'bg-[#161618] border-[#2d2d2d]',
    activeItem: 'bg-[#1a2040] text-[#6b8eff]',
    inactiveItem: 'text-[#555570] hover:bg-[#242430] hover:text-[#b0b0c8]',
    overdueText: 'text-[#7070a0]',
    overdueBar: 'bg-[#2d1e10] border-[#6a3800]/40 text-[#e08030]',
    overdueCta: 'bg-[#3d1a10] text-[#ff7a5a] border border-[#7a2030]/50 hover:bg-[#4d2018]',
  },
} as const