'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles,
  Eye,
  EyeOff,
  Brain,
  Sliders,
  Compass,
  ShieldCheck,
  ArrowRight,
  AlertCircle,
  Lock,
  Globe
} from 'lucide-react';
import { useRegister } from '@/features/auth/api/user-register';


export default function RegisterPage() {
  const registerMutation = useRegister();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [timezone] = useState(Intl.DateTimeFormat().resolvedOptions().timeZone);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    registerMutation.mutate({ email, password, timezone });
  };

  return (
    <main className="h-screen w-full flex bg-zinc-950 text-zinc-100 font-sans antialiased selection:bg-indigo-500/30 selection:text-indigo-200 overflow-hidden relative">

      {/* BACKGROUND TEXTURE MESH */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#141417_1px,transparent_1px),linear-gradient(to_bottom,#141417_1px,transparent_1px)] bg-[size:3rem_3rem] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-50 pointer-events-none" />

      {/* =========================================================
          LEFT SIDE: ULTRA-MINIMAL BRAND & VALUE HEADER (DESKTOP)
          ========================================================= */}
      <section className="hidden lg:flex lg:w-[48%] p-12 flex-col justify-between relative border-r border-zinc-900/60 bg-zinc-950">
        <div className="absolute -top-20 -left-20 w-72 h-72 bg-gradient-to-br from-indigo-500/5 to-purple-500/0 rounded-full filter blur-[80px] pointer-events-none" />

        {/* Brand Header */}
        <div className="flex items-center gap-2.5 relative z-10">
          <div className="w-6 h-6 rounded-md bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-[11px] font-bold text-white shadow-sm">
            S
          </div>
          <span className="font-mono tracking-wider text-xs font-bold text-zinc-300">STRATOS</span>
        </div>

        {/* Compressed Main Value Statements */}
        <div className="max-w-md my-auto space-y-6 relative z-10">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-zinc-900 border border-zinc-800 text-[10px] text-zinc-400">
              <Sparkles size={10} className="text-indigo-400" /> Start Free Engine Access
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-b from-white via-zinc-200 to-zinc-400 leading-tight">
              Claude creates the plan. Smart scheduling keeps it alive.
            </h1>
            <p className="text-zinc-400 text-xs leading-relaxed">
              Initialize your space to build realistic execution roadmaps directly from raw context. Let our engine balance your time safely when deadlines shuffle.
            </p>
          </div>

          {/* High-Signal Feature Metrics */}
          <div className="space-y-2 pt-1 border-t border-zinc-900">
            {[
              { icon: <Brain size={13} />, text: "Context-driven multi-day generation", color: "text-indigo-400" },
              { icon: <Sliders size={13} />, text: "Deterministic capacity-aware balancing", color: "text-purple-400" },
              { icon: <Compass size={13} />, text: "Automatic urgency escalation weights", color: "text-emerald-400" }
            ].map((item, idx) => (
              <div key={idx} className="flex items-center gap-2.5 text-xs text-zinc-400">
                <div className={`shrink-0 ${item.color}`}>{item.icon}</div>
                <span>{item.text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Footprint Trust Indicator */}
        <div className="text-[10px] text-zinc-600 font-mono tracking-tight relative z-10 flex items-center gap-1">
          <ShieldCheck size={11} className="text-zinc-500" />
          SECURE INFRASTRUCTURE HORIZON
        </div>
      </section>

      {/* =========================================================
          RIGHT SIDE: CONDENSED PREMIUM REGISTRATION CARD
          ========================================================= */}
      <section className="w-full lg:w-[52%] flex flex-col justify-center items-center p-4 sm:p-8 relative">
        <div className="absolute -bottom-20 -right-20 w-72 h-72 bg-purple-500/5 rounded-full filter blur-[80px] pointer-events-none" />

        {/* Responsive Mobile Header */}
        <div className="lg:hidden flex items-center gap-2 mb-6 self-center">
          <div className="w-5 h-5 rounded-md bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-[9px] text-white font-bold">S</div>
          <span className="font-mono text-xs tracking-wider font-bold text-zinc-300">STRATOS</span>
        </div>

        {/* Minimal Form Card Wrapper */}
        <motion.div
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="w-full max-w-[360px] p-5 sm:p-6 rounded-xl bg-zinc-900/20 border border-zinc-900 shadow-xl backdrop-blur-sm space-y-4 relative"
        >
          {/* Subtle Top Accent Ribbon */}
          <div className="absolute top-0 left-4 right-4 h-px bg-gradient-to-r from-transparent via-indigo-500/20 to-transparent" />

          {/* Form Header */}
          <div className="space-y-0.5">
            <h2 className="text-base font-bold tracking-tight text-white">Create an account</h2>
            <p className="text-[11px] text-zinc-500">Free to get started with intelligent tracking.</p>
          </div>

          {/* Clean Quick Connect Row */}
          {/* <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              disabled={registerMutation.isPending}
              className="h-8 rounded-lg bg-zinc-900 hover:bg-zinc-800/80 border border-zinc-800 text-[11px] font-medium text-zinc-300 flex items-center justify-center gap-1.5 transition-all focus:outline-none focus:ring-1 focus:ring-zinc-700 disabled:opacity-40"
            >
              <svg className="w-3 h-3" viewBox="0 0 24 24" fill="currentColor">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
              </svg>
              <span>Google</span>
            </button>
            <button
              type="button"
              disabled={registerMutation.isPending}
              className="h-8 rounded-lg bg-zinc-900 hover:bg-zinc-800/80 border border-zinc-800 text-[11px] font-medium text-zinc-300 flex items-center justify-center gap-1.5 transition-all focus:outline-none focus:ring-1 focus:ring-zinc-700 disabled:opacity-40"
            >
              <svg className="w-3 h-3 fill-zinc-400" viewBox="0 0 24 24">
                <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.061.069-.061 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
              </svg>
              <span>GitHub</span>
            </button>
          </div> */}

          {/* <div className="flex items-center gap-2">
            <div className="h-px bg-zinc-800 grow" />
            <span className="text-[9px] text-zinc-600 font-semibold tracking-wider uppercase">or register below</span>
            <div className="h-px bg-zinc-800 grow" />
          </div> */}

          {/* Compact Form Stack */}
          <form onSubmit={handleSubmit} className="space-y-3">
            <div className="space-y-1">
              <label htmlFor="email" className="text-[10px] font-medium text-zinc-400">Email address</label>
              <input
                id="email"
                type="email"
                required
                disabled={registerMutation.isPending}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full h-9 px-3 bg-zinc-950 border border-zinc-800 rounded-lg text-xs text-zinc-100 placeholder-zinc-700 focus:outline-none focus:border-indigo-500 disabled:opacity-40 transition-colors duration-150"
                placeholder="you@example.com"
              />
            </div>

            <div className="space-y-1">
              <label htmlFor="password" className="text-[10px] font-medium text-zinc-400">Password</label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  minLength={8}
                  disabled={registerMutation.isPending}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full h-9 pl-3 pr-8 bg-zinc-950 border border-zinc-800 rounded-lg text-xs text-zinc-100 placeholder-zinc-700 focus:outline-none focus:border-indigo-500 disabled:opacity-40 transition-colors duration-150"
                  placeholder="8+ characters"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-600 hover:text-zinc-400 transition-colors"
                >
                  {showPassword ? <EyeOff size={12} /> : <Eye size={12} />}
                </button>
              </div>
            </div>

            {/* Micro Timezone Auto-Detection Overlay indicator */}
            <div className="space-y-1 pt-0.5">
              <div className="flex justify-between items-center text-[10px]">
                <span className="font-medium text-zinc-400 flex items-center gap-1.5">
                  <Globe size={11} className="text-zinc-500" />
                  Target Zone Context
                </span>
                <span className="text-zinc-600 font-mono tracking-tight text-[9px] uppercase selection:bg-transparent">Auto-detected</span>
              </div>
              <input
                type="text"
                disabled
                value={timezone}
                className="w-full h-8 px-3 bg-zinc-950/40 border border-zinc-900 rounded-lg text-[11px] text-zinc-500 cursor-not-allowed font-mono tracking-tight select-none"
              />
            </div>

            {/* Layout Error Protection Container */}
            <AnimatePresence>
              {registerMutation.isError && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="text-[11px] text-red-400 bg-red-950/10 border border-red-900/30 rounded-lg p-2 flex items-center gap-1.5"
                >
                  <AlertCircle size={12} className="shrink-0" />
                  <span>Registration handshake failed. Try another link.</span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Primary Action Button */}
            <button
              type="submit"
              disabled={registerMutation.isPending}
              className="w-full h-9 mt-1 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium rounded-lg transition-all shadow-sm flex items-center justify-center gap-1.5 group focus:outline-none focus:ring-1 focus:ring-indigo-400"
            >
              {registerMutation.isPending ? (
                <span>Building Secure Space…</span>
              ) : (
                <>
                  <span>Get Started</span>
                  <ArrowRight size={12} className="text-indigo-200 group-hover:translate-x-0.5 transition-transform" />
                </>
              )}
            </button>
          </form>

          {/* Alternate Navigation Path Link */}
          <p className="text-center text-[11px] text-zinc-500 pt-1.5 border-t border-zinc-900/60">
            Already have an account?{' '}
            <Link href="/login" className="text-indigo-400 hover:text-indigo-300 transition-colors font-medium">
              Sign in
            </Link>
          </p>
        </motion.div>

        {/* Static Safety Blueprint Label */}
        <div className="absolute bottom-4 text-[9px] text-zinc-700 flex items-center gap-1 pointer-events-none font-mono">
          <Lock size={9} className="text-zinc-600" />
          ACTIVE ISO-27001 ENCRYPTION MESH
        </div>
      </section>

    </main>
  );
}