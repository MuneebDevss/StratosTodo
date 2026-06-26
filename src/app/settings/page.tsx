'use client'

import { useUser, useUpdateUser, useLogout } from '@/features/auth/api/use-user'
import { EditableField } from '@/features/settings/components/EditableField'
import { ThemeToggle } from '@/features/settings/components/ThemeToggle'
import { ConnectClaudeCard } from '@/features/settings/components/ConnectClaudeCard'
import { useTheme } from '@/features/settings/hooks/use-theme'
import { PAGE_THEME, TASK_THEMES } from '@/Common/Constants/ThemeConstants'
import { TIMEZONE_OPTIONS } from '@/Common/Constants/TimeZones'
import { formatMinutes } from '@/Common'
import { useRouter } from 'next/navigation'; // <--- Use 'next/navigation' instead

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function SettingsPage() {
  const { theme, setTheme } = useTheme()
  const pt = PAGE_THEME[theme]
  const t = TASK_THEMES[theme]

  const { data: user, isLoading } = useUser()
  const { mutate: updateUser, isPending } = useUpdateUser()
  const { mutate: logout, isPending: isPendingLogout } = useLogout()
  const router = useRouter()
  if (isLoading) {
    return (
      <div className={`min-h-screen ${pt.bg}`}>
        <div className="max-w-2xl mx-auto px-8 py-10">
          <div className={`h-7 w-40 rounded-md animate-pulse ${theme === 'dark' ? 'bg-[#2e2e3e]' : 'bg-[#e8e8ec]'}`} />
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className={`min-h-screen ${pt.bg}`}>
        <div className="max-w-2xl mx-auto px-8 py-10">
          <p className={`text-[14px] ${pt.subheading}`}>
            Your session has expired. Please log in again.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className={`min-h-screen ${pt.bg}`}>
      <div className="max-w-2xl mx-auto px-8 py-10">
        <header className="mb-8">
          <h1 className={`text-2xl font-bold mb-1 ${pt.heading}`}>Settings</h1>
          <p className={`text-sm ${pt.subheading}`}>
            Manage your profile, scheduling preferences, and Claude connection.
          </p>
        </header>

        <div className="flex flex-col gap-6">
          {/* ── Profile ── */}
          <section className={`border rounded-[12px] px-5 ${t.card}`}>
            <h2 className={`text-[15px] font-semibold pt-5 pb-1 ${t.title}`}>Profile</h2>
            <div className={`divide-y ${theme === 'dark' ? 'divide-[#2e2e3e]' : 'divide-[#e8e8ec]'}`}>
              <EditableField
                label="Email"
                value={user.email}
                kind="text"
                disabled // email changes typically need re-verification — edit elsewhere
                onSave={() => { }}
                theme={theme}
              />
              <EditableField
                label="Timezone"
                value={user.timezone}
                kind="select"
                options={TIMEZONE_OPTIONS}
                onSave={(value) => updateUser({ timezone: value })}
                isSaving={isPending}
                theme={theme}
              />
              <EditableField
                label="Daily capacity"
                value={String(user.dailyCapacityMinutes)}
                displayValue={formatMinutes(user.dailyCapacityMinutes)}
                kind="number"
                suffix="minutes"
                min={15}
                onSave={(value) => {
                  const minutes = parseInt(value, 10)
                  if (!isNaN(minutes) && minutes > 0) {
                    updateUser({ dailyCapacityMinutes: minutes })
                  }
                }}
                isSaving={isPending}
                theme={theme}
              />
            </div>
          </section>

          {/* ── Appearance ── */}
          <section className={`border rounded-[12px] p-5 ${t.card}`}>
            <div className="flex items-center justify-between">
              <div>
                <h2 className={`text-[15px] font-semibold mb-1 ${t.title}`}>Appearance</h2>
                <p className={`text-[13px] ${t.description}`}>
                  Switch between light and dark mode. Synced across your devices.
                </p>
              </div>
              <ThemeToggle theme={theme} onChange={setTheme} />
            </div>
          </section>

          {/* ── Connect Claude ── */}
          <ConnectClaudeCard theme={theme} />
          {/**Logout */}
          <button
            onClick={() =>
              logout(undefined, {
                onSuccess: () => {
                  router.replace('/login')
                }
              })
            }
            disabled={isPendingLogout}
            className={`bg-blue-500 text-white px-4 py-2 rounded-md transition ${isPendingLogout ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-600'
              }`}
          >
            {isPendingLogout ? 'Logging out...' : 'Logout'}
          </button>
        </div>
      </div>
    </div >
  )
}