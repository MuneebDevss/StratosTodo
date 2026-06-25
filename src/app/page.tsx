'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles,
  ArrowRight,
  Clock,
  CheckCircle2,
  AlertCircle,
  Brain,
  Sliders,
  ChevronDown,
  Menu,
  X,
  Battery,
  Layers,
  Compass,
  ShieldCheck,
  History
} from 'lucide-react';

// --- Relatable Testimonials & Product FAQs ---
const testimonials = [
  { quote: "Stratos did what normal calendars couldn't. When my morning went off the rails, it rebalanced my whole week without me spending an hour dragging boxes around.", author: "Sarah Jenkins", role: "Creative Director", metric: "Saved 6 hours/week" },
  { quote: "Connecting my own Claude account was a game-changer. It generated an entire 6-week study schedule that automatically adapts when I get behind.", author: "Marcus Chen", role: "Graduate Student", metric: "100% Plan Completion" },
  { quote: "I finally stopped looking at an endless list of overdue red tasks. The system quietly moves things I miss to a 'Needs Review' folder so tomorrow stays clean.", author: "Elena Rostova", role: "Marketing Consultant", metric: "Reduced Burnout by 40%" }
];

const faqs = [
  { q: "How does the assistant build these long-term plans?", a: "By linking Stratos to your personal Claude account, you can outline a large goal in plain English. The assistant checks your existing commitments and builds a tailored, day-by-day roadmap that loads right into your schedule." },
  { q: "What happens behind the scenes when I miss a task?", a: "No complex math or guessing games. The system automatically shifts your missed item to your next open slot. If your day gets too crowded, it runs a gentle evaluation: high-priority items stay put, and less urgent ones slide forward to protect your time." },
  { q: "What is the 'Needs Review' list and how does it prevent overwhelm?", a: "If a low-priority task gets bumped three times in a row, the app steps in. Instead of letting it clutter your calendar forever, it puts the task into a quiet 'Needs Review' safety net so you can decide to drop it, finish it, or plan it for later." },
  { q: "Are there any hidden monthly limits or AI usage fees?", a: "None at all. Because Stratos hooks directly into your existing assistant tools, we don't have to charge you extra for generating massive projects, multi-week breakdowns, or complex agendas." }
];

export default function Home() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  const [simStep, setSimStep] = useState(0);

  // Auto-rotating mockup simulation to showcase the capacity engine mechanics
  useEffect(() => {
    const timer = setInterval(() => {
      setSimStep((prev) => (prev + 1) % 3);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen bg-black text-zinc-100 selection:bg-indigo-500/30 selection:text-indigo-200 font-sans antialiased overflow-x-hidden">

      {/* 1. STICKY NAVIGATION */}
      <header className="sticky top-0 z-50 w-full border-b border-zinc-800/60 bg-black/70 backdrop-blur-md transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center gap-2 font-semibold tracking-tight text-white group">
              <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-xs shadow-lg shadow-indigo-500/20 group-hover:scale-105 transition-transform">S</div>
              <span className="font-mono tracking-wider text-sm text-zinc-200">STRATOS</span>
            </Link>
            <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-zinc-400">
              <a href="#features" className="hover:text-zinc-100 transition-colors">Features</a>
              <a href="#how-it-works" className="hover:text-zinc-100 transition-colors">How it Works</a>
              <a href="#reviews" className="hover:text-zinc-100 transition-colors">Reviews</a>
              <a href="#faq" className="hover:text-zinc-100 transition-colors">FAQ</a>
            </nav>
          </div>

          <div className="hidden md:flex items-center gap-4">
            <Link href="/login" className="text-sm font-medium text-zinc-400 hover:text-zinc-100 transition-colors">Sign In</Link>
            <Link href="/register" className="h-9 px-4 rounded-lg bg-white hover:bg-zinc-200 text-black text-sm font-medium tracking-tight transition-all shadow-sm flex items-center">
              Start Free
            </Link>
          </div>

          <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="md:hidden p-2 text-zinc-400 hover:text-zinc-100">
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </header>

      {/* Mobile Nav Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="fixed inset-x-0 top-16 bg-zinc-950 border-b border-zinc-800 p-6 z-40 md:hidden space-y-4">
            <a href="#features" onClick={() => setMobileMenuOpen(false)} className="block text-zinc-300">Features</a>
            <a href="#how-it-works" onClick={() => setMobileMenuOpen(false)} className="block text-zinc-300">How it Works</a>
            <a href="#reviews" onClick={() => setMobileMenuOpen(false)} className="block text-zinc-300">Reviews</a>
            <a href="#faq" onClick={() => setMobileMenuOpen(false)} className="block text-zinc-300">FAQ</a>
            <div className="h-px bg-zinc-800 my-2" />
            <Link href="/login" className="block text-zinc-300">Sign In</Link>
            <Link href="/register" className="block w-full py-2.5 text-center rounded-lg bg-indigo-600 text-white font-medium">Start Free</Link>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 2. HERO SECTION */}
      <section className="relative pt-20 pb-16 md:pt-28 md:pb-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-b border-zinc-900">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(99,102,241,0.06),transparent_55%)] pointer-events-none" />

        <div className="text-center max-w-3xl mx-auto space-y-6">
          <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900 border border-zinc-800/80 text-xs text-zinc-400">
            <Sparkles size={12} className="text-indigo-400" /> A capacity-aware schedule that respects your true limits.
          </motion.div>

          <motion.h1 initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }} className="text-4xl sm:text-6xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-b from-white via-zinc-200 to-zinc-500 leading-tight">
            The to-do list that <br className="hidden sm:block" />balances itself.
          </motion.h1>

          <motion.p initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }} className="text-base sm:text-lg text-zinc-400 max-w-2xl mx-auto leading-relaxed">
            Break big milestones down with an assistant you already trust. When plans shift, our custom time-budget engine automatically re-arranges your tasks—protecting you from calendar overload and past-due guilt.
          </motion.p>

          <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.3 }} className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Link href="/register" className="h-12 px-6 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-medium flex items-center justify-center gap-2 group transition-all shadow-lg shadow-indigo-600/20">
              Start Free Blueprinting <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>
        </div>

        {/* 3. ENGINE DEMO MOCKUP */}
        <motion.div initial={{ opacity: 0, scale: 0.99 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.7, delay: 0.4 }} className="mt-16 relative rounded-2xl border border-zinc-800/80 bg-zinc-950/60 p-4 sm:p-6 shadow-2xl backdrop-blur-xl">
          <div className="absolute top-0 left-1/4 right-1/4 h-px bg-gradient-to-r from-transparent via-indigo-500/30 to-transparent" />

          {/* Top Control Bar */}
          <div className="flex items-center justify-between border-b border-zinc-900 pb-4 mb-6">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-zinc-800" />
              <span className="w-2.5 h-2.5 rounded-full bg-zinc-800" />
              <span className="w-2.5 h-2.5 rounded-full bg-zinc-800" />
            </div>
            <div className="text-xs text-zinc-400 font-medium flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-indigo-500 inline-block animate-pulse"></span>
              Stratos Balancing Engine Simulation
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left Box: Constraints & Priority Logic */}
            <div className="lg:col-span-4 space-y-4 lg:border-r lg:border-zinc-900 lg:pr-6">
              <h3 className="text-xs font-semibold tracking-wider uppercase text-zinc-400 flex items-center gap-1.5">
                <Battery size={14} className="text-indigo-400" /> Your Time Budget
              </h3>

              <div className="bg-zinc-900/40 border border-zinc-800/80 p-4 rounded-xl space-y-3">
                <div className="flex justify-between text-xs">
                  <span className="text-zinc-400">Daily Free Time Window:</span>
                  <span className="text-white font-mono font-medium">4 Hours</span>
                </div>

                {/* Dynamic Capacity Bar Graphic */}
                <div className="h-2 w-full bg-zinc-900 rounded-full overflow-hidden">
                  <motion.div
                    animate={{
                      width: simStep === 0 ? '75%' : simStep === 1 ? '115%' : '90%',
                      backgroundColor: simStep === 1 ? '#ef4444' : '#6366f1'
                    }}
                    className="h-full transition-all duration-500"
                  />
                </div>

                <div className="flex justify-between text-[11px] text-zinc-500 pt-1">
                  <span>0h</span>
                  <span>{simStep === 1 ? 'Overloaded! (4.5h)' : 'Comfortable'}</span>
                  <span>4h Max</span>
                </div>
              </div>

              {/* Status Note Area */}
              <div className="p-3 rounded-xl border border-zinc-900 bg-black/40 space-y-1">
                <span className="text-[10px] text-indigo-400 font-mono uppercase tracking-wider block">Engine Feedback</span>
                <p className="text-xs text-zinc-400">
                  {simStep === 0 && "Everything fits cleanly into your afternoon schedule."}
                  {simStep === 1 && "An unexpected afternoon delay has over-crowded today."}
                  {simStep === 2 && "Low urgency tasks gracefully slid to tomorrow. Peace restored."}
                </p>
              </div>
            </div>

            {/* Right Box: The Changing Task List */}
            <div className="lg:col-span-8 space-y-3">
              <div className="flex items-center justify-between text-xs text-zinc-500">
                <span>Today's Intelligent Agenda</span>
                <span className="font-mono text-[10px]">Step {simStep + 1} of 3</span>
              </div>

              <div className="space-y-2.5">
                {/* Protected/High-Priority Task */}
                <div className="p-3.5 rounded-xl border border-zinc-800 bg-zinc-900/20 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-red-500" />
                    <div>
                      <p className="text-xs text-zinc-200 font-medium">Review contract proposal draft</p>
                      <p className="text-[10px] text-zinc-500">Takes 2 hours • Critical Importance</p>
                    </div>
                  </div>
                  <span className="text-[10px] bg-red-950/40 text-red-300 px-2 py-0.5 rounded border border-red-900/30">Locked</span>
                </div>

                {/* Shifting Task Instance */}
                <AnimatePresence mode="wait">
                  {simStep === 0 && (
                    <motion.div key="state0" initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }} className="p-3.5 rounded-xl border border-zinc-800 bg-zinc-900/40 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Clock size={14} className="text-zinc-500" />
                        <div>
                          <p className="text-xs text-zinc-300">Clean garage & box old equipment</p>
                          <p className="text-[10px] text-zinc-500">Takes 1 hour • Flexible Importance</p>
                        </div>
                      </div>
                      <span className="text-[10px] bg-zinc-800 text-zinc-400 px-2 py-0.5 rounded">Scheduled</span>
                    </motion.div>
                  )}

                  {simStep === 1 && (
                    <motion.div key="state1" initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="p-3.5 rounded-xl border border-red-900/40 bg-red-950/10 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <AlertCircle size={14} className="text-red-400 animate-bounce" />
                        <div>
                          <p className="text-xs text-red-200 font-medium">Clean garage & box old equipment</p>
                          <p className="text-[10px] text-red-400">Conflict: Day has run out of time</p>
                        </div>
                      </div>
                      <span className="text-[10px] bg-red-900 text-white px-2 py-0.5 rounded">Overflow</span>
                    </motion.div>
                  )}

                  {simStep === 2 && (
                    <motion.div key="state2" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="p-3.5 rounded-xl border border-emerald-900/30 bg-emerald-950/10 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <CheckCircle2 size={14} className="text-emerald-400" />
                        <div>
                          <p className="text-xs text-emerald-300">Clean garage & box old equipment</p>
                          <p className="text-[10px] text-emerald-400">✨ Safely moved to tomorrow morning when you have space</p>
                        </div>
                      </div>
                      <span className="text-[10px] bg-emerald-900/40 text-emerald-300 px-2 py-0.5 rounded">Balanced</span>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Aging Task Catch-up Highlight */}
                <div className="p-3.5 rounded-xl border border-zinc-900 bg-zinc-950 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <History size={14} className="text-indigo-400" />
                    <div>
                      <p className="text-xs text-zinc-400">Call back home insurance provider</p>
                      <p className="text-[10px] text-zinc-500">Bumped twice before • Urgency naturally increased so you don't forget it</p>
                    </div>
                  </div>
                  <span className="text-[10px] bg-indigo-950/60 text-indigo-300 px-2 py-0.5 rounded border border-indigo-900/40">Priority Boosted</span>
                </div>

              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* 4. THE CORE EXPERIENCE PROBLEM */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-b border-zinc-900">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-5 space-y-4">
            <div className="text-xs font-semibold uppercase tracking-widest text-zinc-500">The Core Friction</div>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white leading-tight">
              To-do lists treat you like a machine.
            </h2>
            <p className="text-zinc-400 text-sm sm:text-base leading-relaxed">
              Traditional productivity software expects perfectly static days. But when real life drops an emergency call or an erratic work block into your afternoon, those lists immediately break. You are met with stressful past-due red marks and a pile of boxes you must manually fix.
            </p>
          </div>

          <div className="lg:col-span-7 bg-zinc-950 border border-zinc-900 p-6 rounded-2xl relative">
            <div className="space-y-3 opacity-50 select-none pointer-events-none filter blur-[0.4px]">
              <div className="p-3 bg-red-950/20 border border-red-900/30 rounded-xl text-xs text-red-300 flex justify-between">
                <span>[Monday] Draft program itinerary</span>
                <span className="text-[10px] bg-red-900 px-1.5 py-0.5 rounded text-white font-bold">OVERDUE</span>
              </div>
              <div className="p-3 bg-red-950/20 border border-red-900/30 rounded-xl text-xs text-red-300 flex justify-between">
                <span>[Tuesday] Research vehicle options</span>
                <span className="text-[10px] bg-red-900 px-1.5 py-0.5 rounded text-white font-bold">OVERDUE</span>
              </div>
            </div>
            <div className="absolute inset-0 flex items-center justify-center p-4">
              <div className="bg-zinc-900 text-zinc-200 border border-zinc-800 rounded-xl p-4 text-xs max-w-sm text-center shadow-xl space-y-1">
                <span className="font-semibold text-white block">Stratos approaches this differently:</span>
                <span>Missed tasks quietly distribute into tomorrow's open capacity slots automatically. No guilt. No mess.</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. FOUR SPEC-DRIVEN FEATURES */}
      <section id="features" className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-b border-zinc-900">
        <div className="text-center space-y-3 mb-16">
          <h2 className="text-3xl font-bold text-white">Smarter coordination without the technical complex.</h2>
          <p className="text-zinc-400 max-w-xl mx-auto text-xs sm:text-sm">We engineered the calendar framework to handle the heavy balancing for you.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Capacity Aware Engine */}
          <div className="p-6 sm:p-8 rounded-2xl bg-zinc-950 border border-zinc-900 hover:border-zinc-800 transition-colors space-y-4">
            <div className="w-9 h-9 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-400">
              <Sliders size={18} />
            </div>
            <h3 className="text-lg font-semibold text-white">Dynamic Time Budgets</h3>
            <p className="text-zinc-400 text-xs sm:text-sm leading-relaxed">
              Set how many hours you realistically have available each day. As you create tasks or add items, the schedule builds boundaries. If a shift pushes things beyond your budget, lower-priority tasks gracefully cascade forward to tomorrow.
            </p>
          </div>

          {/* Claude Custom Hookup (MCP) */}
          <div className="p-6 sm:p-8 rounded-2xl bg-zinc-950 border border-zinc-900 hover:border-zinc-800 transition-colors space-y-4">
            <div className="w-9 h-9 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-400">
              <Brain size={18} />
            </div>
            <h3 className="text-lg font-semibold text-white">Personal Assistant Connection</h3>
            <p className="text-zinc-400 text-xs sm:text-sm leading-relaxed">
              Link the system straight to your own personal Claude account. Ask it to blueprint an entire timeline—like a 4-week workout routine or an exam preparation sequence. It reads your available space and maps out every step instantly.
            </p>
          </div>

          {/* Aging Task Urgency */}
          <div className="p-6 sm:p-8 rounded-2xl bg-zinc-950 border border-zinc-900 hover:border-zinc-800 transition-colors space-y-4">
            <div className="w-9 h-9 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-400">
              <Layers size={18} />
            </div>
            <h3 className="text-lg font-semibold text-white">The Catch-Up Equalizer</h3>
            <p className="text-zinc-400 text-xs sm:text-sm leading-relaxed">
              To prevent small tasks from being permanently pushed to the back burner, the system tracks how often a task gets moved. Every time an item is shifted forward, it naturally gains priority weight so it eventually secures a locked spot.
            </p>
          </div>

          {/* The Graveyard (Needs Review Safety Net) */}
          <div className="p-6 sm:p-8 rounded-2xl bg-zinc-950 border border-zinc-900 hover:border-zinc-800 transition-colors space-y-4">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400">
              <Compass size={18} />
            </div>
            <h3 className="text-lg font-semibold text-white">The "Needs Review" Safety Net</h3>
            <p className="text-zinc-400 text-xs sm:text-sm leading-relaxed">
              If a task gets delayed three times, it stops moving. Instead of endlessly dragging forward and creating a daily wall of clutter, Stratos quietly places it into a specific review tray so you can reset, change details, or drop it altogether.
            </p>
          </div>
        </div>
      </section>

      {/* 6. HOW IT WORKS FLOW STEPPER */}
      <section id="how-it-works" className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-b border-zinc-900">
        <div className="text-center max-w-xl mx-auto space-y-3 mb-16">
          <h2 className="text-2xl sm:text-3xl font-bold text-white">A seamless, continuous cycle</h2>
          <p className="text-zinc-400 text-xs sm:text-sm">How Stratos coordinates your daily roadmap safely.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { step: "01", title: "Set Free Hours", desc: "Define your daily capacity thresholds—like 2 hours for side projects or 6 hours for focused work." },
            { step: "02", title: "Blueprint Goals", desc: "Describe major objectives inside your own assistant window to generate structured task lists instantly." },
            { step: "03", title: "Execute Stress-Free", desc: "Work from a clean view showing only what comfortably fits inside today's open timeframe." },
            { step: "04", title: "Auto Rebalance", desc: "If anything drops off, the balancing engine shifts items forward at midnight to keep tomorrow clear." }
          ].map((item, idx) => (
            <div key={idx} className="p-5 rounded-xl bg-zinc-950 border border-zinc-900 space-y-3 relative">
              <span className="font-mono text-xs text-indigo-400 font-bold block">{item.step}</span>
              <h4 className="text-sm font-semibold text-white">{item.title}</h4>
              <p className="text-xs text-zinc-400 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 7. SOCIAL PROOF ARCHIVE */}
      <section id="reviews" className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-b border-zinc-900">
        <div className="text-center space-y-2 mb-16">
          <h2 className="text-2xl font-bold text-white">Designed for realistic paces</h2>
          <p className="text-zinc-500 text-xs sm:text-sm">Reclaim hours spent manually restructuring calendars.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t, idx) => (
            <div key={idx} className="p-6 rounded-xl bg-zinc-950 border border-zinc-900 flex flex-col justify-between space-y-6">
              <p className="text-zinc-300 text-xs sm:text-sm leading-relaxed italic">"{t.quote}"</p>
              <div className="flex items-center justify-between pt-4 border-t border-zinc-900">
                <div>
                  <h5 className="text-xs font-bold text-white">{t.author}</h5>
                  <p className="text-[10px] text-zinc-500">{t.role}</p>
                </div>
                <span className="text-[10px] font-medium text-emerald-400 bg-emerald-950/20 px-2 py-0.5 rounded border border-emerald-900/30">
                  {t.metric}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 8. PLAIN ENGLISH FAQ ACCORDION */}
      <section id="faq" className="py-20 max-w-3xl mx-auto px-4 sm:px-6 border-b border-zinc-900">
        <h2 className="text-2xl font-bold text-center text-white mb-10">Frequently Answered</h2>

        <div className="space-y-4">
          {faqs.map((faq, i) => (
            <div key={i} className="border border-zinc-900 rounded-xl bg-zinc-950 overflow-hidden">
              <button onClick={() => setActiveFaq(activeFaq === i ? null : i)} className="w-full p-5 text-left flex items-center justify-between text-zinc-200 hover:text-white transition-colors">
                <span className="text-xs sm:text-sm font-medium">{faq.q}</span>
                <ChevronDown size={14} className={`transform transition-transform text-zinc-500 ${activeFaq === i ? 'rotate-180 text-white' : ''}`} />
              </button>

              <AnimatePresence>
                {activeFaq === i && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2 }} className="border-t border-zinc-900/60 bg-black/20">
                    <p className="p-5 text-xs text-zinc-400 leading-relaxed">{faq.a}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </section>

      {/* 9. PREMIUM CALL TO ACTION BLOCK */}
      <section className="py-20 max-w-5xl mx-auto px-4 sm:px-6 text-center relative">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(147,51,234,0.04),transparent_50%)] pointer-events-none" />

        <div className="bg-gradient-to-b from-zinc-950 to-black border border-zinc-900 p-8 sm:p-12 rounded-2xl space-y-6 relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-purple-500/20 to-transparent" />

          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white leading-tight">
            Stop forcing your life into static lists.
          </h2>
          <p className="text-zinc-400 text-xs sm:text-sm max-w-lg mx-auto leading-relaxed">
            Let your favorite assistant draft your plans, and let our capacity-aware balancing engine keep your daily agenda achievable and calm.
          </p>

          <div className="pt-4 flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link href="/register" className="h-11 px-8 rounded-xl bg-white hover:bg-zinc-200 text-black font-semibold text-xs tracking-tight transition-all shadow-xl flex items-center justify-center">
              Create Your Account Free
            </Link>
            <div className="flex items-center gap-1 text-[11px] text-zinc-500">
              <ShieldCheck size={12} className="text-zinc-400" />
              Connected via your personal assistant
            </div>
          </div>
        </div>
      </section>

      {/* MINIMAL FOOTER */}
      <footer className="border-t border-zinc-900 bg-black py-8 text-center text-[10px] text-zinc-600 tracking-wider">
        <div>© {new Date().getFullYear()} STRATOS INC. CAPACITY DRIVEN TASK PROTECTION. ALL PRIVACY RESERVED.</div>
      </footer>

    </div>
  );
}