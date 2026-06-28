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

    // Typography
    heading: 'text-[#1a1a2e]',
    subheading: 'text-[#9898a8]',
    body: 'text-[#6b6b80]',
    back: 'text-[#9898a8] hover:text-[#1a1a2e]',

    // Dedicated Sidebar Light Configurations
    sidebarBg: 'bg-white',
    sidebarBorder: 'border-[#e4e4e7]',
    sidebarHeading: 'text-[#18181b]',
    sidebarSubheading: 'text-[#71717a]',
    sidebarBody: 'text-[#3f3f46]',
    sidebarHoverBg: 'hover:bg-[#f4f4f5]',
    sidebarHoverText: 'hover:text-[#18181b]',
    sidebarActiveBg: 'bg-[#fce8e6]',
    sidebarActiveText: 'text-[#e8453c]',


    //Skeleton
    skeleton: 'bg-[#e8e8ec]/50',
    emptyTitle: 'text-[#1a1a2e]',
    emptyBody: 'text-[#6b6b80]',

    // Shared action tokens
    deleteBtn: 'border-[#e8e8ec]/50 bg-white text-[#c94020] hover:bg-[#fff0ed] hover:border-[#f5c0b0]',
    navBtn: 'bg-[#f5f5f7] border-[#e8e8ec]/50 text-[#6b6b80] hover:bg-[#e8e8f0]',
    datePill: 'bg-[#f5f5f7] border-[#e8e8ec]/50 text-[#6b6b80]',

    page: 'bg-[#f7f6f3] text-[#2a2a3a]',
    header: 'bg-[#f7f6f3] border-[#e4e2de]',
    card: 'bg-white border-[#e8e6e0] hover:border-[#d4d0c8] hover:bg-[#fefefe]',
    cardTitle: 'text-[#6b6878] line-through decoration-[#c0bcc8] decoration-1',
    cardMeta: 'text-[#9090a8]',
    cardAge: 'text-[#a8a4b8] bg-[#f4f2f0] border border-[#e4e0da]',
    badge: {
      high: 'bg-[#fdf0ee] text-[#b04030] border border-[#f0c8c0]',
      medium: 'bg-[#fdf8ee] text-[#906020] border border-[#f0dca0]',
      low: 'bg-[#eef3fc] text-[#3060a0] border border-[#c0d4f0]',
    },
    divider: 'bg-[#ece9e4]',
    emptyIcon: 'text-[#dcd8d0]',
    emptyText: 'text-[#b0a8c0]',
    emptySubtext: 'text-[#c8c4d0]',
    btnRedate: 'bg-[#f0eeff] text-[#5a40c0] border border-[#d0c8f0] hover:bg-[#e8e4ff] hover:text-[#4830a8] hover:border-[#b8aee8]',
    btnComplete: 'bg-[#eef8f2] text-[#2a7848] border border-[#b8e4cc] hover:bg-[#e4f4ea] hover:text-[#1a6038] hover:border-[#90d0a8]',
    btnDelete: 'bg-[#fef0f0] text-[#a83028] border border-[#f0c0b8] hover:bg-[#fce8e6] hover:text-[#901e18] hover:border-[#e8a099]',
    datePicker: 'bg-white border-[#e0dcd8] text-[#2a2a3a]',
    dateInput: 'bg-[#f8f7f5] border-[#e0dcd8] text-[#2a2a3a] focus:border-[#7060d0]',
    dateConfirm: 'bg-[#5a40c0] text-white hover:bg-[#4830a8]',
    dateCancel: 'bg-[#f0ede8] text-[#8080a0] hover:bg-[#e8e4e0]',
    statsBar: 'bg-white border-[#e8e4de]',
    statsLabel: 'text-[#b0a8b8]',
    statsValue: 'text-[#7070a0]',
    tabActive: 'bg-[#f0eeff] text-[#5a40c0] border border-[#d0c8f0]',
    tabInactive: 'text-[#a0a0b8] hover:text-[#5a5a78] hover:bg-[#eeecf0]',
    countPill: 'bg-[#ede8f8] text-[#7060b0]',
  },
  dark: {
    // Page / layout
    bg: 'bg-[#1e1e1e]',
    panelBg: 'bg-[#161618]',
    border: 'border-[#2d2d2d]',

    // Typography
    heading: 'text-white',
    subheading: 'text-[#aaaaaa]',
    body: 'text-[#9898a8]',
    back: 'text-[#888888] hover:text-white',

    // Dedicated Sidebar Dark Configurations
    sidebarBg: 'bg-[#1e1e1e]',
    sidebarBorder: 'border-[#2a2a2a]',
    sidebarHeading: 'text-white',
    sidebarSubheading: 'text-[#aaaaaa]',
    sidebarBody: 'text-[#dcdcdc]',
    sidebarHoverBg: 'hover:bg-white/5',
    sidebarHoverText: 'hover:text-[#dcdcdc]',
    sidebarActiveBg: 'bg-[#3d1a1a]',
    sidebarActiveText: 'text-[#e8453c]',

    // Empty / skeleton states
    skeleton: 'bg-[#2e2e3e]',
    emptyTitle: 'text-[#e8e8f0]',
    emptyBody: 'text-[#7070a0]',

    // Shared action tokens
    deleteBtn: 'border-[#2e2e3e] bg-[#1c1c28] text-[#ff7a5a] hover:bg-[#2d1820] hover:border-[#7a2030]',
    navBtn: 'bg-[#242424] border-[#2d2d2d] text-[#888888] hover:bg-[#2e2e2e] hover:text-[#e0e0e0]',
    datePill: 'bg-[#242424] border-[#2d2d2d] text-[#888888]',

    page: 'bg-[#1a1a1a] text-[#d0d0d0]',
    header: 'bg-[#1a1a1a] border-[#252525]',
    card: 'bg-[#1e1e26] border-[#2a2a38] hover:border-[#363648] hover:bg-[#21212e]',
    cardTitle: 'text-[#c8c8d8] line-through decoration-[#4a4a60] decoration-1',
    cardMeta: 'text-[#5a5a78]',
    cardAge: 'text-[#4a4a5e] bg-[#1c1c28] border border-[#2a2a38]',
    badge: {
      high: 'bg-[#2d1410]/80 text-[#c06050] border border-[#5a2820]/60',
      medium: 'bg-[#251d08]/80 text-[#9a7030] border border-[#5a4010]/60',
      low: 'bg-[#0e1830]/80 text-[#4878a0] border border-[#1a3050]/60',
    },
    divider: 'bg-[#222230]',
    emptyIcon: 'text-[#2e2e42]',
    emptyText: 'text-[#3e3e58]',
    emptySubtext: 'text-[#2e2e42]',
    // action buttons
    btnRedate: 'bg-[#2a2040] text-[#9a82e8] border border-[#3a3058] hover:bg-[#322850] hover:text-[#b8a0ff] hover:border-[#4a4070]',
    btnComplete: 'bg-[#0e2218] text-[#3a9060] border border-[#1a3828] hover:bg-[#122c1e] hover:text-[#4aaa72] hover:border-[#226040]',
    btnDelete: 'bg-[#1e1218] text-[#7a3840] border border-[#2e1e28] hover:bg-[#281420] hover:text-[#c04858] hover:border-[#6a2038]',
    // date picker
    datePicker: 'bg-[#16161e] border-[#2e2e3e] text-[#d0d0e0]',
    dateInput: 'bg-[#1e1e28] border-[#2e2e3e] text-[#d0d0e0] focus:border-[#7a62d8]',
    dateConfirm: 'bg-[#3b2fa0] text-white hover:bg-[#4a3cbb]',
    dateCancel: 'bg-[#222230] text-[#7070a0] hover:bg-[#2a2a40]',
    // stats bar
    statsBar: 'bg-[#1c1c26] border-[#252535]',
    statsLabel: 'text-[#3e3e58]',
    statsValue: 'text-[#7070a0]',
    // filter tabs
    tabActive: 'bg-[#2a2040] text-[#9a82e8] border border-[#3a3058]',
    tabInactive: 'text-[#5a5a78] hover:text-[#9898b0] hover:bg-[#1e1e2a]',
    // header count pill
    countPill: 'bg-[#251d38] text-[#7a62b8]',
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

export const TASK_THEMES = {
  light: {
    card: 'bg-white border-[#e8e8ec]/50 hover:border-[#d0d0da] hover:bg-[#fafafa]',
    cardEditing: 'bg-white border-[#1a6bff]/40 ring-2 ring-[#1a6bff]/10',
    cardDragging: 'opacity-40 scale-[0.98] border-dashed',
    title: 'text-[#1a1a2e]',
    titleCompleted: 'line-through text-[#9898a8]',
    description: 'text-[#6b6b80]',
    score: 'text-[#c0c0cc]',
    chipDuration: 'bg-[#f5f5f7] text-[#6b6b80]',
    chipBump: 'bg-[#fff5e6] text-[#b05a00] border border-[#f5c880]/50',
    chipPlan: 'bg-[#f0eeff] text-[#4a35b0]',
    actionBtn: 'border-[#e8e8ec]/50 bg-[#f5f5f7] text-[#9898a8] hover:bg-[#e8e8f0] hover:text-[#1a1a2e]',
    deleteBtn: 'border-[#e8e8ec]/50 bg-[#f5f5f7] text-[#9898a8] hover:bg-[#fff0ed] hover:text-[#c94020] hover:border-[#f5c0b0]',
    saveBtn: 'bg-[#1a6bff] text-white hover:bg-[#0f5ce8]',
    cancelBtn: 'border-[#e8e8ec] bg-[#f5f5f7] text-[#6b6b80] hover:bg-[#e8e8f0]',
    input: 'bg-transparent border-b border-[#1a6bff]/40 text-[#1a1a2e] focus:outline-none focus:border-[#1a6bff] placeholder:text-[#c0c0cc]',
    textarea: 'bg-[#f5f5f7] border border-[#e8e8ec] text-[#1a1a2e] text-[12px] rounded-[7px] px-2.5 py-2 w-full resize-none focus:outline-none focus:border-[#1a6bff]/50',
    select: 'bg-[#f5f5f7] border border-[#e8e8ec] text-[#1a1a2e] rounded-[6px] px-2 py-0.5 text-[11px] focus:outline-none focus:border-[#1a6bff]/50',
    durationInput: 'bg-[#f5f5f7] border border-[#e8e8ec] text-[#1a1a2e] rounded-[6px] px-2 py-0.5 text-[11px] w-[56px] text-center focus:outline-none focus:border-[#1a6bff]/50',
    themeToggle: 'border-[#e8e8ec] bg-[#f5f5f7] text-[#6b6b80] hover:bg-[#e8e8f0]',
    dragHandle: 'text-[#c0c0cc] hover:text-[#9898a8]',
    //Progress Bar colors:
    progressFill: 'bg-[#1a6bff]/12',
    progressOverlay: 'bg-[#1a6bff]/18',
    progressGlow: 'shadow-[inset_0_0_24px_rgba(26,107,255,0.08)]',
  },
  dark: {
    card: 'bg-[#1c1c28] border-[#2e2e3e] hover:border-[#3a3a50] hover:bg-[#1f1f2e]',
    cardEditing: 'bg-[#1c1c28] border-[#3b5bdb]/50 ring-2 ring-[#3b5bdb]/15',
    cardDragging: 'opacity-40 scale-[0.98] border-dashed',
    title: 'text-[#e8e8f0]',
    titleCompleted: 'line-through text-[#4a4a60]',
    description: 'text-[#7070a0]',
    score: 'text-[#3e3e58]',
    chipDuration: 'bg-[#24243a] text-[#7070a0]',
    chipBump: 'bg-[#2d2010] text-[#e08030] border border-[#6a3800]/40',
    chipPlan: 'bg-[#1e1a3a] text-[#9a82ff]',
    actionBtn: 'border-[#2e2e3e] bg-[#24243a] text-[#5a5a80] hover:bg-[#2e2e48] hover:text-[#e8e8f0]',
    deleteBtn: 'border-[#2e2e3e] bg-[#24243a] text-[#5a5a80] hover:bg-[#2d1820] hover:text-[#ff6b6b] hover:border-[#7a2030]',
    saveBtn: 'bg-[#3b5bdb] text-white hover:bg-[#2f4abf]',
    cancelBtn: 'border-[#2e2e3e] bg-[#24243a] text-[#7070a0] hover:bg-[#2e2e48]',
    input: 'bg-transparent border-b border-[#3b5bdb]/40 text-[#e8e8f0] focus:outline-none focus:border-[#3b5bdb] placeholder:text-[#3e3e58]',
    textarea: 'bg-[#141420] border border-[#2e2e3e] text-[#b0b0c8] text-[12px] rounded-[7px] px-2.5 py-2 w-full resize-none focus:outline-none focus:border-[#3b5bdb]/50',
    select: 'bg-[#141420] border border-[#2e2e3e] text-[#b0b0c8] rounded-[6px] px-2 py-0.5 text-[11px] focus:outline-none focus:border-[#3b5bdb]/50',
    durationInput: 'bg-[#141420] border border-[#2e2e3e] text-[#b0b0c8] rounded-[6px] px-2 py-0.5 text-[11px] w-[56px] text-center focus:outline-none focus:border-[#3b5bdb]/50',
    themeToggle: 'border-[#2e2e3e] bg-[#24243a] text-[#7070a0] hover:bg-[#2e2e48]',
    dragHandle: 'text-[#3e3e58] hover:text-[#5a5a80]',
    //Progress Bar colors:
    progressFill: 'bg-[#4d8dff]/14',
    progressOverlay: 'bg-[#4d8dff]/20',
    progressGlow: 'shadow-[inset_0_0_28px_rgba(77,141,255,0.10)]',
  },
} as const

export const DIALOG_THEME = {
  light: {
    overlay: 'bg-black/30',
    panel: 'bg-white border-[#e8e8ec]',
    title: 'text-[#1a1a2e]',
    body: 'text-[#6b6b80]',
    danger: 'bg-[#c94020] text-white hover:bg-[#b53618]',
  },
  dark: {
    overlay: 'bg-black/50',
    panel: 'bg-[#1c1c28] border-[#2e2e3e]',
    title: 'text-[#e8e8f0]',
    body: 'text-[#7070a0]',
    danger: 'bg-[#c94020] text-white hover:bg-[#b53618]',
  },
} as const