import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { useLogin } from "../api/user-login";
import Link from 'next/link';
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
  Lock
} from 'lucide-react';
import { AnimatePresence, motion } from "framer-motion";

export function LoginFormContent() {
  const loginMutation = useLogin();
  const returnTo = useSearchParams().get("returnTo");
  const connectingClaude = returnTo?.startsWith("/oauth/consent?");
  const [email, setEmail] = useState(process.env.NODE_ENV === 'development' ? 'munib.urehmann@gmail.com' : '');
  const [password, setPassword] = useState(process.env.NODE_ENV === 'development' ? 'MuneebCode@69' : '');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    loginMutation.mutate({ email, password });
  };

  return (
    <main className="min-h-screen md:h-screen w-full flex flex-col md:flex-row bg-zinc-950 text-zinc-100 font-sans antialiased selection:bg-indigo-500/30 selection:text-indigo-200 md:overflow-hidden relative">

      {/* BACKGROUND TEXTURE MESH */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#141417_1px,transparent_1px),linear-gradient(to_bottom,#141417_1px,transparent_1px)] bg-[size:3rem_3rem] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-50 pointer-events-none" />

      {/* LEFT SIDE: ULTRA-MINIMAL BRAND & VALUE HEADER */}
      <section className="hidden md:flex md:w-[42%] lg:w-[45%] xl:w-[48%] p-6 lg:p-12 flex-col justify-between relative border-b md:border-b-0 md:border-r border-zinc-900/60 bg-zinc-950">
        <div className="absolute -top-20 -left-20 w-72 h-72 bg-indigo-500/5 rounded-full filter blur-[80px] pointer-events-none" />

        {/* Brand Header */}
        <div className="flex items-center gap-2.5 relative z-10">
          <div className="w-6 h-6 rounded-md bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-sm font-bold text-white shadow-sm">
            S
          </div>
          <span className="font-mono tracking-wider text-xs font-bold text-zinc-300">STRATOS</span>
        </div>

        {/* Compressed Main Value Statements */}
        <div className="max-w-md my-auto py-8 md:py-0 space-y-4 lg:space-y-6 relative z-10">
          <div className="space-y-2 lg:space-y-3">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-zinc-900 border border-zinc-800 text-[10px] text-zinc-400 w-fit">
              <Sparkles size={10} className="text-indigo-400" /> AI-Powered Time Budgets
            </div>
            <h1 className="text-xl md:text-2xl lg:text-3xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-b from-white via-zinc-200 to-zinc-400 leading-tight">
              Claude creates the plan. Smart scheduling keeps it alive.
            </h1>
            <p className="text-zinc-400 text-sm lg:text-xs leading-relaxed">
              Build a plan with Claude, organize your tasks, and adjust your schedule when life gets busy.
            </p>
          </div>

          {/* High-Signal Feature Metrics */}
          <div className="space-y-2 pt-2 border-t border-zinc-900">
            {[
              { icon: <Brain size={13} />, text: "Create plans with Claude", color: "text-indigo-400" },
              { icon: <Sliders size={13} />, text: "Plan around your available time", color: "text-purple-400" },
              { icon: <Compass size={13} />, text: "Keep important tasks in view", color: "text-emerald-400" }
            ].map((item, idx) => (
              <div key={idx} className="flex items-center gap-2.5 text-sm lg:text-xs text-zinc-400">
                <div className={`shrink-0 ${item.color}`}>{item.icon}</div>
                <span>{item.text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Footprint Trust Indicator */}
        <div className="text-[10px] text-zinc-600 font-mono tracking-tight relative z-10 flex items-center gap-1">
          <ShieldCheck size={11} className="text-zinc-500" />
          YOUR PLANS, ALL IN ONE PLACE
        </div>
      </section>

      {/* RIGHT SIDE: CONDENSED PREMIUM AUTHENTICATION CARD */}
      <section className="w-full md:w-[58%] lg:w-[55%] xl:w-[52%] flex flex-col justify-center items-center p-6 sm:p-8 relative grow">
        <div className="absolute -bottom-20 -right-20 w-72 h-72 bg-purple-500/5 rounded-full filter blur-[80px] pointer-events-none" />

        {/* Responsive Mobile Header */}
        <div className="md:hidden flex items-center gap-2 mb-6 self-center">
          <div className="w-5 h-5 rounded-md bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-[9px] text-white font-bold">S</div>
          <span className="font-mono text-xs tracking-wider font-bold text-zinc-300">STRATOS</span>
        </div>

        {/* Minimal Form Card Wrapper */}
        <motion.div
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="w-full max-w-[420px] p-5 sm:p-6 rounded-xl bg-zinc-900/20 border border-zinc-900 shadow-xl backdrop-blur-sm space-y-4 relative"
        >
          {/* Subtle Top Accent Ribbon */}
          <div className="absolute top-0 left-4 right-4 h-px bg-gradient-to-r from-transparent via-indigo-500/20 to-transparent" />

          {/* Form Header */}
          <div className="space-y-0.5">
            <h2 className="text-xl font-bold tracking-tight text-white">{connectingClaude ? 'Sign in to connect Claude' : 'Welcome back'}</h2>
            <p className="text-sm text-zinc-500">{connectingClaude ? 'Use your Stratos account. After signing in, we’ll return you to Claude.' : 'Sign in to see your tasks and plan your day.'}</p>
          </div>

          {/* Compact Input Form Stack */}
          <form onSubmit={handleSubmit} className="space-y-3">
            <div className="space-y-1">
              <label htmlFor="email" className="text-sm font-medium text-zinc-400">Email address</label>
              <input
                id="email"
                autoComplete="email"
                type="email"
                required
                disabled={loginMutation.isPending}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full h-11 px-3 bg-zinc-950 border border-zinc-800 rounded-lg text-xs text-zinc-100 placeholder-zinc-700 focus:outline-none focus:border-indigo-500 disabled:opacity-40 transition-colors duration-150"
                placeholder="you@example.com"
              />
            </div>

            <div className="space-y-1">
              <label htmlFor="password" className="text-sm font-medium text-zinc-400">Password</label>
              <div className="relative">
                <input
                  id="password"
                  autoComplete="current-password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  disabled={loginMutation.isPending}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full h-11 pl-3 pr-8 bg-zinc-950 border border-zinc-800 rounded-lg text-xs text-zinc-100 placeholder-zinc-700 focus:outline-none focus:border-indigo-500 disabled:opacity-40 transition-colors duration-150"
                />
                <button
                  type="button"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  aria-pressed={showPassword}
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-600 hover:text-zinc-400 transition-colors"
                >
                  {showPassword ? <EyeOff size={12} /> : <Eye size={12} />}
                </button>
              </div>
            </div>

            {/* Error Message Layout Protection */}
            <AnimatePresence>
              {loginMutation.isError && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  role="alert"
                  className="text-sm text-red-400 bg-red-950/10 border border-red-900/30 rounded-lg p-2 flex items-center gap-1.5"
                >
                  <AlertCircle size={12} className="shrink-0" />
                  <span>Could not sign in. Check your details and connection, then try again.</span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Premium CTA Button */}
            <button
              type="submit"
              disabled={loginMutation.isPending}
              className="w-full h-11 mt-1 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium rounded-lg transition-all shadow-sm flex items-center justify-center gap-1.5 group focus:outline-none focus:ring-1 focus:ring-indigo-400"
            >
              {loginMutation.isPending ? (
                <span>Signing in…</span>
              ) : (
                <>
                  <span>{connectingClaude ? 'Sign in and continue' : 'Sign in'}</span>
                  <ArrowRight size={12} className="text-indigo-200 group-hover:translate-x-0.5 transition-transform" />
                </>
              )}
            </button>
          </form>

          {/* Alternate Footer Route Link */}
          <p className="text-center text-sm text-zinc-500 pt-1.5 border-t border-zinc-900/60">
            Don&apos;t have an account?{' '}
            <Link href="/register" className="text-indigo-400 hover:text-indigo-300 transition-colors font-medium">
              Create one
            </Link>
          </p>
        </motion.div>

        {/* Static Safety Blueprint Label */}
        <div className="absolute bottom-4 text-[9px] text-zinc-700 flex items-center gap-1 pointer-events-none font-mono">
          <Lock size={9} className="text-zinc-600" />
          SIGN IN TO YOUR STRATOS ACCOUNT
        </div>
      </section>

    </main>
  );
}