'use client'

import { useLogout, useUpdateUser, useUser } from '@/features/auth/api/use-user'
import ClaudeIntegrationSection from '@/features/settings/components/ConnectClaudeCard'
import { useTheme } from '@/features/settings/hooks/use-theme'
import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
export default function SettingsPage() {
  const { data: user, isLoading: isUserLoading } = useUser()
  const { mutate: updateUser, isPending: isUpdating } = useUpdateUser()
  const { mutate: logout, isPending: isLoggingOut } = useLogout()
  const router = useRouter()
  const { theme, setTheme } = useTheme()

  // Local state for immediate user feedback before mutation resolves
  const [localCapacity, setLocalCapacity] = useState<number>(480)

  useEffect(() => {
    if (user?.dailyCapacityMinutes) {
      setLocalCapacity(user.dailyCapacityMinutes)
    }
  }, [user?.dailyCapacityMinutes])

  if (isUserLoading) {
    return (
      <div className="min-h-screen bg-zinc-50 dark:bg-[#09090b] flex items-center justify-center">
        <div className="w-5 h-5 border-[1.5px] border-zinc-300 dark:border-zinc-800 border-t-zinc-600 dark:border-t-zinc-400 rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-[#09090b] text-zinc-900 dark:text-zinc-100 antialiased transition-colors duration-200">
      <div className="max-w-[680px] mx-auto px-4 py-16 sm:px-6">

        {/* Header */}
        <header className="mb-10">
          <h1 className="text-xl font-semibold tracking-tight">Settings</h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
            Manage your interface configurations, limits, and autonomous integrations.
          </p>
        </header>

        <div className="space-y-12">

          {/* Section: Account */}
          <section aria-labelledby="account-title">
            <h2 id="account-title" className="text-xs font-semibold uppercase tracking-wider text-zinc-400 dark:text-zinc-500 mb-4">
              Account
            </h2>
            <div className="border border-zinc-200/80 dark:border-zinc-800/60 bg-white dark:bg-[#121214] rounded-xl shadow-[0_1px_2px_rgba(0,0,0,0.02)] overflow-hidden divide-y divide-zinc-100 dark:divide-zinc-800/50">

              {/* Row: Email */}
              <div className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h3 className="text-sm font-medium">Email Identity</h3>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">The primary email address tied to your cloud synchronization.</p>
                </div>
                <div className="text-xs font-mono bg-zinc-50 dark:bg-zinc-900/60 px-3 py-1.5 rounded-md border border-zinc-200/50 dark:border-zinc-800/60 text-zinc-600 dark:text-zinc-300 self-start sm:self-auto select-all">
                  {user?.email}
                </div>
              </div>

              {/* Row: Account Status */}
              <div className="p-4 sm:p-5 flex items-center justify-between gap-3">
                <div>
                  <h3 className="text-sm font-medium">Account Status</h3>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">Your environment provisioning profile state.</p>
                </div>
                <span className="inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-900/30">
                  <span className="w-1 h-1 rounded-full bg-blue-500" />
                  Active Profile
                </span>
              </div>
            </div>
          </section>

          {/* Section: Preferences */}
          <section aria-labelledby="preferences-title">
            <h2 id="preferences-title" className="text-xs font-semibold uppercase tracking-wider text-zinc-400 dark:text-zinc-500 mb-4">
              Preferences
            </h2>
            <div className="border border-zinc-200/80 dark:border-zinc-800/60 bg-white dark:bg-[#121214] rounded-xl shadow-[0_1px_2px_rgba(0,0,0,0.02)] overflow-hidden divide-y divide-zinc-100 dark:divide-zinc-800/50">

              {/* Row: Theme Toggle */}
              <div className="p-4 sm:p-5 flex items-center justify-between gap-4">
                <div>
                  <h3 className="text-sm font-medium">Interface Theme</h3>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">Select your preferred system canvas presentation.</p>
                </div>
                <div className="flex p-0.5 bg-zinc-100 dark:bg-zinc-900 rounded-lg border border-zinc-200/40 dark:border-zinc-800/40 shrink-0">
                  <button
                    type="button"
                    onClick={() => setTheme('light')}
                    className={`px-3 py-1 text-xs font-medium rounded-md transition-all duration-150 ${theme === 'light' ? 'bg-white shadow-sm text-zinc-900' : 'text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-200'}`}
                  >
                    Light
                  </button>
                  <button
                    type="button"
                    onClick={() => setTheme('dark')}
                    className={`px-3 py-1 text-xs font-medium rounded-md transition-all duration-150 ${theme === 'dark' ? 'bg-white dark:bg-[#1c1c1f] shadow-sm text-zinc-900 dark:text-zinc-100' : 'text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-200'}`}
                  >
                    Dark
                  </button>
                </div>
              </div>

              {/* Row: Timezone */}
              <div className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h3 className="text-sm font-medium">Timezone</h3>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">Aligns schedules, reset periods, and timeline processing.</p>
                </div>
                <select
                  value={user?.timezone || 'UTC'}
                  onChange={(e) => updateUser({ timezone: e.target.value })}
                  disabled={isUpdating}
                  className="text-xs bg-zinc-50 dark:bg-zinc-900 hover:bg-zinc-100 dark:hover:bg-zinc-850/80 border border-zinc-200 dark:border-zinc-800 rounded-lg px-3 py-2 font-medium text-zinc-800 dark:text-zinc-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all cursor-pointer w-full sm:w-[200px]"
                >
                  <option value="America/New_York">Eastern Time (ET)</option>
                  <option value="America/Chicago">Central Time (CT)</option>
                  <option value="America/Denver">Mountain Time (MT)</option>
                  <option value="America/Los_Angeles">Pacific Time (PT)</option>
                  <option value="Europe/London">London (GMT/BST)</option>
                  <option value="Europe/Paris">Paris (CET)</option>
                  <option value="Asia/Tokyo">Tokyo (JST)</option>
                  <option value="UTC">Universal Time (UTC)</option>
                </select>
              </div>

              {/* Row: Daily Capacity */}
              <div className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h3 className="text-sm font-medium">Daily Target Capacity</h3>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">Maximum workload window boundaries calculated daily.</p>
                </div>
                <div className="flex items-center gap-2 w-full sm:w-auto self-start sm:self-auto">
                  <input
                    type="number"
                    min="1"
                    max="1440"
                    value={localCapacity}
                    onChange={(e) => setLocalCapacity(Number(e.target.value))}
                    onBlur={() => updateUser({ dailyCapacityMinutes: localCapacity })}
                    disabled={isUpdating}
                    className="w-24 text-xs text-center bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg px-2 py-2 font-mono font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                  />
                  <span className="text-xs text-zinc-400 dark:text-zinc-500 font-medium">minutes</span>
                </div>
              </div>
            </div>
          </section>

          {/* Section: Claude Integration */}
          <section aria-labelledby="integration-title">
            <ClaudeIntegrationSection />
          </section>

          {/* Minimal Subtle Spacer Separator */}
          <div className="pt-2 border-t border-zinc-200/60 dark:border-zinc-800/40" />

          {/* Section: Danger Zone (Session Security) */}
          <section aria-labelledby="danger-title">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between border border-red-200/30 dark:border-red-950/20 bg-red-50/10 dark:bg-red-950/5 rounded-xl p-4 sm:p-5 gap-4">
              <div>
                <h3 id="danger-title" className="text-sm font-medium text-zinc-900 dark:text-zinc-100">Session Security</h3>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">Completely terminate configuration state access token cache from this desktop container.</p>
              </div>
              <button
                type="button"
                onClick={() => 
                  logout(undefined, {
                    onSuccess: () => {
                      router.push('/login');
                    }
                  })}
                disabled={isLoggingOut}
                className="text-xs font-medium text-red-600 dark:text-red-400 border border-red-200 dark:border-red-950/30 hover:bg-red-50 dark:hover:bg-red-950/20 bg-white dark:bg-[#121214] px-3 py-2 rounded-lg shadow-[0_1px_2px_rgba(0,0,0,0.01)] transition-all duration-150 disabled:opacity-40 active:scale-[0.99] w-full sm:w-auto text-center"
              >
                {isLoggingOut ? 'Logging out...' : 'Log Out Client'}
              </button>
            </div>
          </section>

        </div>
      </div>
    </div>
  )
}