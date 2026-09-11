'use client'

import React, { useState } from 'react'
import { useMcpStatus } from '../hooks/use-mcp-status'


// Fallback to your explicit server URL deployment endpoint
const MCP_SERVER_URL = process.env.NEXT_PUBLIC_MCP_SERVER_URL ?? 'https://api.stratostodo.com/mcp'

export default function ClaudeIntegrationSection() {
  const { data: mcpStatus, isLoading: isMcpLoading } = useMcpStatus()
  const [copied, setCopied] = useState(false)

  const handleCopy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy text: ', err)
    }
  }

  // The premium configuration template for Claude Desktop (SSE protocol configuration)
  const configSnippet = JSON.stringify({
    mcpServers: {
      "stratos-todo": {
        "url": MCP_SERVER_URL
      }
    }
  }, null, 2)

  return (
    <section aria-labelledby="integration-title" className="space-y-4">
      <div>
        <h2 id="integration-title" className="text-xs font-semibold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
          Integrations
        </h2>
      </div>

      <div className="border border-zinc-200/80 dark:border-zinc-800/60 bg-white dark:bg-[#121214] rounded-xl p-5 shadow-[0_1px_2px_rgba(0,0,0,0.02)] space-y-5">
        {/* Connection Status Header Banner */}
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-medium">Claude Context Protocol</h3>
              {isMcpLoading ? (
                <div className="w-1.5 h-1.5 rounded-full bg-zinc-300 dark:bg-zinc-700 animate-pulse" />
              ) : mcpStatus?.connected ? (
                <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/20 px-2 py-0.5 rounded border border-emerald-100 dark:border-emerald-900/30">
                  <span className="w-1 h-1 rounded-full bg-emerald-500" />
                  Active Connection
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 text-[11px] font-medium text-zinc-400 dark:text-zinc-500 bg-zinc-50 dark:bg-zinc-900 px-2 py-0.5 rounded border border-zinc-200/60 dark:border-zinc-800">
                  Not Connected
                </span>
              )}
            </div>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 max-w-[520px] leading-relaxed">
              {mcpStatus?.connected
                ? `Stratos is successfully broadcasting context pipelines to ${mcpStatus.clientName || 'your Claude Desktop App'}. Your AI model has deep visibility into your active task list.`
                : 'Allow Claude to securely interact with your schedule, build tasks natively, and sync contexts using the Model Context Protocol (MCP).'}
            </p>
          </div>

          {/* Quick Copy Action context toggle based on connection state */}
          <button
            type="button"
            onClick={() => handleCopy(mcpStatus?.connected ? MCP_SERVER_URL : configSnippet)}
            className="text-xs font-medium px-3 py-2 rounded-lg border border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-900 active:scale-[0.99] w-full sm:w-auto text-center transition-all duration-150 shadow-[0_1px_2px_rgba(0,0,0,0.01)]"
          >
            {copied ? '✓ Copied Config' : mcpStatus?.connected ? 'Copy Endpoint URL' : 'Copy Setup Config'}
          </button>
        </div>

        {/* Dynamic Instructional Segment */}
        {mcpStatus?.connected ? (
          /* SUCCESS STATE: Minimizes clutter completely */
          <div className="pt-4 border-t border-zinc-100 dark:border-zinc-800/50 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
            <span className="text-zinc-400 dark:text-zinc-500">Connected Endpoint:</span>
            <span className="font-mono text-[11px] text-zinc-500 dark:text-zinc-400 truncate max-w-full sm:max-w-[360px] bg-zinc-50 dark:bg-zinc-900/40 px-2 py-1 rounded border border-zinc-200/40 dark:border-zinc-800/40">
              {MCP_SERVER_URL}
            </span>
          </div>
        ) : (
          /* DISCONNECTED CONFIGURATION STATE: Simple, non-technical connection guide */
          <div className="pt-4 border-t border-dashed border-zinc-100 dark:border-zinc-800/60 space-y-3">
            <h4 className="text-xs font-medium text-zinc-800 dark:text-zinc-300">How to connect Stratos to Claude.ai:</h4>

            <div className="space-y-2 text-xs text-zinc-500 dark:text-zinc-400 pl-0.5">
              <div className="flex items-start gap-2.5">
                <span className="font-mono text-[10px] bg-zinc-100 dark:bg-zinc-900 px-1.5 py-0.5 rounded text-zinc-400 border border-zinc-200/40 dark:border-zinc-800/50 mt-0.5">1</span>
                <p>
                  Click the <span className="font-medium text-zinc-700 dark:text-zinc-300">&quot;+&quot;</span> button in the chat box, then select <span className="font-medium text-zinc-700 dark:text-zinc-300">Connectors → Add connector</span>.
                </p>
              </div>

              <div className="flex items-start gap-2.5">
                <span className="font-mono text-[10px] bg-zinc-100 dark:bg-zinc-900 px-1.5 py-0.5 rounded text-zinc-400 border border-zinc-200/40 dark:border-zinc-800/50 mt-0.5">2</span>
                <p>
                  Click <span className="font-medium text-zinc-700 dark:text-zinc-300">Add custom connector</span>, then name it and paste in the Stratos server URL:
                </p>
              </div>

              <div className="pl-[26px] w-full">
                {/* URL Block Component */}
                <div className="relative group/code rounded-lg overflow-hidden border border-zinc-200/60 dark:border-zinc-800 font-mono text-[11px] bg-zinc-50 dark:bg-[#161618] text-zinc-600 dark:text-zinc-400 p-3">
                  <pre className="overflow-x-auto whitespace-pre-wrap">{MCP_SERVER_URL}</pre>
                  <button
                    type="button"
                    onClick={() => handleCopy(MCP_SERVER_URL)}
                    className="absolute top-2 right-2 opacity-0 group-hover/code:opacity-100 transition-opacity duration-150 text-[10px] bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 px-2 py-1 rounded text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200 shadow-sm"
                  >
                    {copied ? 'Copied' : 'Copy URL'}
                  </button>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <span className="font-mono text-[10px] bg-zinc-100 dark:bg-zinc-900 px-1.5 py-0.5 rounded text-zinc-400 border border-zinc-200/40 dark:border-zinc-800/50 mt-0.5">3</span>
                <p>Click <span className="font-medium text-zinc-700 dark:text-zinc-300">Add</span>, sign in to authorize, and toggle Stratos on. It&apos;ll now appear in your Connectors list, ready to use.</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}