'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRegister } from '../api/user-register';

export function RegisterForm() {
  const registerMutation = useRegister();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [timezone] = useState(Intl.DateTimeFormat().resolvedOptions().timeZone);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    registerMutation.mutate({ email, password, timezone });
  };

  const inputClass =
    'w-full px-3.5 py-2.5 bg-zinc-800 border border-zinc-700 rounded-lg text-sm text-zinc-100 placeholder-zinc-500 ' +
    'focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 ' +
    'disabled:opacity-40 transition-colors duration-150';

  return (
    <div className="w-full max-w-sm px-8 py-9 bg-zinc-900 rounded-2xl border border-zinc-800 shadow-xl">
      <div className="mb-7">
        <span className="inline-block w-8 h-8 rounded-lg bg-indigo-600 mb-4" />
        <h2 className="text-xl font-semibold text-zinc-100 tracking-tight">Create an account</h2>
        <p className="mt-1 text-sm text-zinc-500">Free to get started</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-1">
          <label className="text-xs font-medium text-zinc-400 uppercase tracking-wide">
            Email
          </label>
          <input
            type="email"
            required
            disabled={registerMutation.isPending}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={inputClass}
            placeholder="you@example.com"
          />
        </div>

        <div className="space-y-1">
          <label className="text-xs font-medium text-zinc-400 uppercase tracking-wide">
            Password
          </label>
          <input
            type="password"
            required
            minLength={8}
            disabled={registerMutation.isPending}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={inputClass}
            placeholder="8+ characters"
          />
        </div>

        <div className="space-y-1">
          <label className="text-xs font-medium text-zinc-400 uppercase tracking-wide">
            Timezone
          </label>
          <input
            type="text"
            disabled
            value={timezone}
            className="w-full px-3.5 py-2.5 bg-zinc-800/50 border border-zinc-800 rounded-lg text-sm text-zinc-600 cursor-not-allowed"
          />
          <p className="text-xs text-zinc-600">Auto-detected from your browser</p>
        </div>

        {registerMutation.isError && (
          <p className="text-xs text-red-400 bg-red-950/50 border border-red-900/50 rounded-lg px-3 py-2">
            {(registerMutation.error as { response?: { data?: { message?: string } } })
              ?.response?.data?.message ?? 'Registration failed. Please try again.'}
          </p>
        )}

        <button
          type="submit"
          disabled={registerMutation.isPending}
          className="w-full mt-1 py-2.5 bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 text-white text-sm font-medium rounded-lg transition-colors duration-150 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {registerMutation.isPending ? (
            <span className="inline-flex items-center justify-center gap-2">
              <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
              </svg>
              Creating account…
            </span>
          ) : 'Get started'}
        </button>
      </form>

      <p className="mt-5 text-center text-xs text-zinc-600">
        Already have an account?{' '}
        <Link href="/login" className="text-indigo-400 hover:text-indigo-300 font-medium transition-colors">
          Sign in
        </Link>
      </p>
    </div>
  );
}