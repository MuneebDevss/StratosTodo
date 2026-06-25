'use client'

import { useState } from 'react'
import { useMcpStatus } from '../hooks/use-mcp-status'
import { useTheme } from '@/features/settings/hooks/use-theme'
import { TASK_THEMES } from '@/Common/Constants/ThemeConstants'

/**
 * ConnectClaudeCard
 * ─────────────────
 * IMPORTANT — what's actually possible here, and why this isn't a single
 * magic "Connect" button:
 *
 * There is no public API for a third-party app to register itself as a
 * connector inside someone's Claude account. Adding a custom connector is
 * exclusively a manual action performed inside Claude's own Settings UI —
 * the user pastes a URL there themselves. Anthropic's docs are explicit
 * that the connection is brokered through the user's Claude account and
 * originates from Anthropic's own infrastructure, not from this app.
 *
 * So the most "one-click" this can honestly be:
 *   1. Copy the MCP server URL (one click, real utility — no typos)
 *   2. Deep-link straight to claude.ai's Connectors settings page, so the
 *      user lands exactly where they need to paste it, instead of hunting
 *      through menus
 *   3. The actual "Add custom connector" + OAuth approval still happens
 *      in Claude, not here — that's unavoidable, not a shortcut we missed
 *
 * Per-client breakdown (Claude.ai / Claude Desktop / Cowork):
 *   All three use the SAME remote-MCP mechanism and the same URL — Claude
 *   Desktop and Cowork route the connection through the user's Claude
 *   account too, not through the local machine. So in practice there's
 *   one set of steps, with a note that Desktop/Cowork use the identical
 *   account-level connector list as claude.ai.
 */

const MCP_SERVER_URL =
  process.env.NEXT_PUBLIC_MCP_SERVER_URL ?? 'https://api.stratostodo.com/mcp'
const CLAUDE_CONNECTORS_URL = 'https://claude.ai/settings/connectors'

type ClientTab = 'claude_ai' | 'desktop' | 'cowork'

const TABS: { key: ClientTab; label: string }[] = [
  { key: 'claude_ai', label: 'Claude.ai' },
  { key: 'desktop', label: 'Claude Desktop' },
  { key: 'cowork', label: 'Cowork' },
]

const STEPS: Record<ClientTab, string[]> = {
  claude_ai: [
    'Go to Settings → Connectors (or use the link below).',
    'Click the + button, then "Add custom connector."',
    'Paste the server URL and click Add.',
    'Claude opens a login screen for StratosToDo — sign in and approve the connection.',
    'In any chat, click + → Connectors, and toggle StratosToDo on.',
  ],
  desktop: [
    'Connectors in Claude Desktop are tied to your Claude account, so they\u2019re managed in the same place: Settings → Connectors on claude.ai.',
    'Add the connector there using the steps in the Claude.ai tab.',
    'It will automatically be available in Claude Desktop once connected — no separate setup needed.',
  ],
  cowork: [
    'Like Desktop, Cowork uses your account-level connectors — there\u2019s no separate Cowork-only setup.',
    'Add the connector via Settings → Connectors on claude.ai (see the Claude.ai tab).',
    'It\u2019ll be available in Cowork automatically once connected.',
  ],
}

// ─── Status pill ──────────────────────────────────────────────────────────────

function StatusPill({
  connected,
  isLoading,
  clientName,
  theme,
}: {
  connected: boolean
  isLoading: boolean
  clientName: string | null
  theme: 'light' | 'dark'
}) {
  if (isLoading) {
    return (
      <span className={`inline-flex items-center gap-1.5 text-[11px] font-medium px-2 py-0.5 rounded-[5px] ${theme === 'dark' ? 'bg-[#24243a] text-[#7070a0]' : 'bg-[#f5f5f7] text-[#9898a8]'
        }`}>
        Checking…
      </span>
    )
  }

  if (connected) {
    return (
      <span className={`inline-flex items-center gap-1.5 text-[11px] font-medium px-2 py-0.5 rounded-[5px] ${theme === 'dark' ? 'bg-[#0d2a1c] text-[#3ddc8a]' : 'bg-[#e8f9f0] text-[#0e8a4f]'
        }`}>
        <svg width="6" height="6" viewBox="0 0 6 6" fill="currentColor" aria-hidden="true"><circle cx="3" cy="3" r="3" /></svg>
        Connected{clientName ? ` via ${clientName}` : ''}
      </span>
    )
  }

  return (
    <span className={`inline-flex items-center gap-1.5 text-[11px] font-medium px-2 py-0.5 rounded-[5px] ${theme === 'dark' ? 'bg-[#24243a] text-[#7070a0]' : 'bg-[#f5f5f7] text-[#9898a8]'
      }`}>
      <svg width="6" height="6" viewBox="0 0 6 6" fill="currentColor" aria-hidden="true"><circle cx="3" cy="3" r="3" /></svg>
      Not connected
    </span>
  )
}

// ─── Component ────────────────────────────────────────────────────────────────

interface ConnectClaudeCardProps {
  theme?: 'light' | 'dark'
}

export function ConnectClaudeCard({ theme: themeProp }: ConnectClaudeCardProps) {
  const { theme: contextTheme } = useTheme()
  const theme = themeProp ?? contextTheme
  const t = TASK_THEMES[theme]
  const { data: status, isLoading } = useMcpStatus()
  const [activeTab, setActiveTab] = useState<ClientTab>('claude_ai')
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(MCP_SERVER_URL)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // Clipboard API can fail in non-HTTPS/insecure contexts — fail silently,
      // the URL is still selectable/visible in the input below.
    }
  }

  return (
    <div className={`border rounded-[12px] p-5 ${t.card}`}>
      <div className="flex items-start justify-between gap-4 mb-1">
        <h2 className={`text-[15px] font-semibold ${t.title}`}>Connect Claude</h2>
        <StatusPill
          connected={!!status?.connected}
          isLoading={isLoading}
          clientName={status?.clientName ?? null}
          theme={theme}
        />
      </div>
      <p className={`text-[13px] leading-[1.55] mb-4 ${t.description}`}>
        Add StratosToDo as a custom connector in Claude to generate multi-day plans,
        create tasks in bulk, and check your schedule — all from a normal conversation.
      </p>

      {/* ── Server URL row ── */}
      <div className="flex items-center gap-2 mb-4">
        <input
          readOnly
          value={MCP_SERVER_URL}
          onFocus={(e) => e.target.select()}
          className={`flex-1 text-[12px] font-mono px-3 py-2 rounded-[7px] border ${theme === 'dark'
              ? 'bg-[#141420] border-[#2e2e3e] text-[#b0b0c8]'
              : 'bg-[#f5f5f7] border-[#e8e8ec] text-[#1a1a2e]'
            }`}
          aria-label="MCP server URL"
        />
        <button
          type="button"
          onClick={handleCopy}
          className={`shrink-0 h-[34px] px-3 rounded-[7px] border text-[12px] font-medium cursor-pointer transition-[background,color] duration-150 ${t.actionBtn}`}
        >
          {copied ? 'Copied!' : 'Copy'}
        </button>
        <a
          href={CLAUDE_CONNECTORS_URL}
          target="_blank"
          rel="noopener noreferrer"
          className={`shrink-0 h-[34px] px-3 inline-flex items-center rounded-[7px] text-[12px] font-medium cursor-pointer transition-[background] duration-150 ${t.saveBtn}`}
        >
          Open Claude settings →
        </a>
      </div>

      {/* ── Tabs ── */}
      <div className={`flex gap-1 mb-3 border-b ${theme === 'dark' ? 'border-[#2e2e3e]' : 'border-[#e8e8ec]'}`}>
        {TABS.map((tab) => (
          <button
            key={tab.key}
            type="button"
            onClick={() => setActiveTab(tab.key)}
            className={`px-3 py-2 text-[12px] font-medium cursor-pointer transition-colors duration-150 border-b-2 -mb-px ${activeTab === tab.key
                ? theme === 'dark'
                  ? 'border-[#3b5bdb] text-[#e8e8f0]'
                  : 'border-[#1a6bff] text-[#1a1a2e]'
                : `border-transparent ${t.description}`
              }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* ── Steps ── */}
      <ol className="flex flex-col gap-2">
        {STEPS[activeTab].map((step, i) => (
          <li key={i} className={`flex gap-2.5 text-[13px] leading-[1.5] ${t.description}`}>
            <span className={`shrink-0 w-[18px] h-[18px] rounded-full flex items-center justify-center text-[10px] font-semibold mt-px ${theme === 'dark' ? 'bg-[#24243a] text-[#9a82ff]' : 'bg-[#f0eeff] text-[#4a35b0]'
              }`}>
              {i + 1}
            </span>
            <span>{step}</span>
          </li>
        ))}
      </ol>
    </div>
  )
}