'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useLogin } from '../api/user-login';

export function LoginForm() {
  const loginMutation = useLogin();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    loginMutation.mutate({ email, password });
  };

  const inputClass =
    'w-full px-3.5 py-2.5 bg-zinc-800 border border-zinc-700 rounded-lg text-sm text-zinc-100 placeholder-zinc-500 ' +
    'focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 ' +
    'disabled:opacity-40 transition-colors duration-150';

  return (
    <div className="w-full max-w-sm px-8 py-9 bg-zinc-900 rounded-2xl border border-zinc-800 shadow-xl">
      {/* Wordmark / logo area */}
      <div className="mb-7">
        <span className="inline-block w-8 h-8 rounded-lg bg-indigo-600 mb-4" />
        <h2 className="text-xl font-semibold text-zinc-100 tracking-tight">Welcome back</h2>
        <p className="mt-1 text-sm text-zinc-500">Sign in to continue</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-1">
          <label className="text-xs font-medium text-zinc-400 uppercase tracking-wide">
            Email
          </label>
          <input
            type="email"
            required
            disabled={loginMutation.isPending}
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
            disabled={loginMutation.isPending}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={inputClass}
            placeholder="••••••••"
          />
        </div>

        {loginMutation.isError && (
          <p className="text-xs text-red-400 bg-red-950/50 border border-red-900/50 rounded-lg px-3 py-2">
            {(loginMutation.error as { response?: { data?: { message?: string } } })
              ?.response?.data?.message ?? 'Invalid email or password.'}
          </p>
        )}

        <button
          type="submit"
          disabled={loginMutation.isPending}
          className="w-full mt-1 py-2.5 bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 text-white text-sm font-medium rounded-lg transition-colors duration-150 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {loginMutation.isPending ? (
            <span className="inline-flex items-center gap-2">
              <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
              </svg>
              Signing in…
            </span>
          ) : 'Sign in'}
        </button>
      </form>

      <p className="mt-5 text-center text-xs text-zinc-600">
        No account?{' '}
        <Link href="/register" className="text-indigo-400 hover:text-indigo-300 font-medium transition-colors">
          Create one
        </Link>
      </p>
    </div>
  );
}