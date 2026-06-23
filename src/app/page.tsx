'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles,
  Calendar,
  ArrowRight,
  Clock,
  CheckCircle2,
  AlertCircle,
  Brain,
  Sliders,
  ChevronDown,
  Menu,
  X,
  Zap,
  Smile
} from 'lucide-react';

// --- Accessible Testimonials & FAQ Data ---
const testimonials = [
  { quote: "Stratos did what normal calendars couldn't. When my morning went off the rails, it recalculated my whole week without me spending an hour dragging boxes around.", author: "Sarah Jenkins", role: "Creative Director", metric: "Saved 6 hours/week" },
  { quote: "The AI assistant actually understands my limits. It doesn't just pile on tasks; it builds an actual strategy based on how much energy I have.", author: "Marcus Chen", role: "Small Business Founder", metric: "100% Goal Completion" },
  { quote: "I finally stopped looking at an endless list of overdue red tasks. The smart rebalancing keeps my days realistic and stress-free.", author: "Elena Rostova", role: "Marketing Consultant", metric: "Reduced Burnout by 40%" }
];

const faqs = [
  { q: "How does the AI generate my plans?", a: "Instead of just giving you a generic checklist, Stratos looks at the big picture: your ultimate goals, your personal working style, your routine, and your existing commitments. It then designs a realistic, step-by-step roadmap tailored specifically to your life." },
  { q: "How secure is my personal information?", a: "Your privacy is our absolute priority. We only use secure connectors to process your goals, and your private notes, calendar items, and personal details are strictly encrypted and kept confidential. We never sell your data." },
  { q: "What exactly happens when I miss a task?", a: "Nothing breaks. The system notices the delay, checks how important the task is, looks at your upcoming deadlines, and automatically slides it into your next best open slot. It balances your workload so tomorrow doesn't become overwhelming." },
  { q: "Can I manually change or lock my schedule?", a: "Of course. You are always in control. You can pin any event, meeting, or specific task to a exact time. The rescheduling engine treats your pinned items as unmovable and organizes everything else gracefully around them." }
];

export default function Home() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  const [simStep, setSimStep] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setSimStep((prev) => (prev + 1) % 3);
    }, 4500);
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
              Get Started Free
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
            <Link href="/register" className="block w-full py-2.5 text-center rounded-lg bg-indigo-600 text-white font-medium">Get Started Free</Link>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 2. HERO SECTION */}
      <section className="relative pt-24 pb-20 md:pt-32 md:pb-28 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-b border-zinc-900">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(99,102,241,0.08),transparent_55%)] pointer-events-none" />

        <div className="text-center max-w-3xl mx-auto space-y-6">
          <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900 border border-zinc-800/80 text-xs text-zinc-400">
            <Sparkles size={12} className="text-indigo-400" /> Stop rebuilding your schedule every time life changes.
          </motion.div>

          <motion.h1 initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }} className="text-4xl sm:text-6xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-b from-white via-zinc-200 to-zinc-500">
            AI plans your work. <br className="hidden sm:block" />Smart scheduling keeps it on track.
          </motion.h1>

          <motion.p initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }} className="text-base sm:text-lg text-zinc-400 max-w-2xl mx-auto leading-relaxed">
            Turn your biggest goals into realistic, step-by-step daily plans using smart AI. When plans inevitably break, an intelligent scheduling engine automatically fixes your schedule so you don't have to.
          </motion.p>

          <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.3 }} className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Link href="/register" className="h-12 px-6 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-medium flex items-center justify-center gap-2 group transition-all shadow-lg shadow-indigo-600/20">
              Start Planning Free <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <button className="h-12 px-6 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-200 font-medium transition-colors">
              Watch Demo
            </button>
          </motion.div>
        </div>

        {/* INTERACTIVE DASHBOARD MOCKUP */}
        <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.7, delay: 0.4 }} className="mt-16 relative rounded-2xl border border-zinc-800/80 bg-zinc-950/60 p-4 sm:p-6 shadow-2xl backdrop-blur-xl">
          <div className="absolute top-0 left-1/4 right-1/4 h-px bg-gradient-to-r from-transparent via-indigo-500/40 to-transparent" />

          {/* Mock Window Controls */}
          <div className="flex items-center justify-between border-b border-zinc-900 pb-4 mb-6">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-zinc-800" />
              <span className="w-3 h-3 rounded-full bg-zinc-800" />
              <span className="w-3 h-3 rounded-full bg-zinc-800" />
            </div>
            <div className="text-xs text-zinc-500 bg-zinc-900/60 px-3 py-1 rounded-md">
              Your Adaptive Planner
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left Box: Input Goal Context */}
            <div className="lg:col-span-4 space-y-4 border-r border-transparent lg:border-zinc-900 lg:pr-6">
              <h3 className="text-xs font-semibold tracking-wider uppercase text-indigo-400 flex items-center gap-1.5">
                <Brain size={14} /> The Goal
              </h3>
              <div className="bg-zinc-900/40 border border-zinc-800 p-4 rounded-xl space-y-3">
                <div className="text-xs text-zinc-400">What are you working toward?</div>
                <div className="text-sm font-medium text-white bg-black/40 p-2.5 rounded-md border border-zinc-900">
                  "Launch my new website & freelance business"
                </div>
                <div className="space-y-1.5">
                  <span className="text-[11px] text-zinc-500 uppercase tracking-wider">Your Constraints</span>
                  <div className="flex flex-wrap gap-1.5 text-[11px]">
                    <span className="bg-zinc-800 text-zinc-300 px-2 py-0.5 rounded">Avail: 3 hours/day</span>
                    <span className="bg-zinc-800 text-zinc-300 px-2 py-0.5 rounded">Weekends off</span>
                    <span className="bg-zinc-800 text-zinc-300 px-2 py-0.5 rounded">Evenings preferred</span>
                  </div>
                </div>
              </div>

              {/* Engine Status State Indicator */}
              <div className="bg-zinc-900/20 border border-dashed border-zinc-800 p-3 rounded-xl flex items-center gap-3">
                <div className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </div>
                <div className="text-xs">
                  {simStep === 0 && <span className="text-zinc-400">Status: <b className="text-zinc-200">Analyzing your day...</b></span>}
                  {simStep === 1 && <span className="text-amber-400">Conflict Found: Meeting ran late</span>}
                  {simStep === 2 && <span className="text-indigo-400">Fixed: Schedule rebalanced smoothly</span>}
                </div>
              </div>
            </div>

            {/* Right Box: Live Visual Schedule Transformation */}
            <div className="lg:col-span-8 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-zinc-400 font-medium">Your Dynamic Daily Agenda</span>
                  <span className="text-[11px] text-zinc-600">Live View</span>
                </div>

                <div className="space-y-2.5">
                  {/* Task Item 1 */}
                  <div className="p-3 rounded-xl border border-zinc-800 bg-zinc-900/30 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <CheckCircle2 size={16} className="text-zinc-600" />
                      <div>
                        <p className="text-xs text-zinc-400 line-through">Draft descriptions for services and pricing</p>
                        <p className="text-[10px] text-zinc-600">Done this morning</p>
                      </div>
                    </div>
                    <span className="text-[10px] bg-zinc-900 px-2 py-0.5 rounded text-zinc-500">High Focus</span>
                  </div>

                  {/* Task Item 2 - The Variable State Item */}
                  <AnimatePresence mode="wait">
                    {simStep === 0 && (
                      <motion.div key="step0" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="p-3 rounded-xl border border-zinc-800 bg-zinc-900/60 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Clock size={16} className="text-zinc-400 animate-pulse" />
                          <div>
                            <p className="text-xs text-zinc-200 font-medium">Select portfolio images & write case studies</p>
                            <p className="text-[10px] text-zinc-400">Scheduled: Today, 2:00 PM</p>
                          </div>
                        </div>
                        <span className="text-[10px] bg-indigo-950 border border-indigo-900 text-indigo-300 px-2 py-0.5 rounded-full px-2">Important</span>
                      </motion.div>
                    )}

                    {simStep === 1 && (
                      <motion.div key="step1" initial={{ opacity: 0, x: -5 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }} className="p-3 rounded-xl border border-amber-900/50 bg-amber-950/20 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <AlertCircle size={16} className="text-amber-500" />
                          <div>
                            <p className="text-xs text-amber-200 font-medium">Select portfolio images & write case studies</p>
                            <p className="text-[10px] text-amber-500 font-medium">Missed: Urgent phone call took over your afternoon</p>
                          </div>
                        </div>
                        <span className="text-[10px] bg-amber-900 text-amber-200 px-2 py-0.5 rounded">Unfinished</span>
                      </motion.div>
                    )}

                    {simStep === 2 && (
                      <motion.div key="step2" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="p-3 rounded-xl border border-emerald-900/50 bg-emerald-950/20 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <CheckCircle2 size={16} className="text-emerald-400" />
                          <div>
                            <p className="text-xs text-emerald-200 font-medium">Select portfolio images & write case studies</p>
                            <p className="text-[10px] text-emerald-400 font-medium">✨ Automatically moved to Tomorrow at 9:00 AM (Free space found)</p>
                          </div>
                        </div>
                        <span className="text-[10px] bg-emerald-900 text-emerald-300 px-2 py-0.5 rounded">Rescheduled</span>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Task Item 3 */}
                  <div className="p-3 rounded-xl border border-zinc-900 bg-zinc-950/40 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-4 h-4 rounded-full border border-zinc-800" />
                      <div>
                        <p className="text-xs text-zinc-500">Send contract template to new client for sign-off</p>
                        <p className="text-[10px] text-zinc-600">Waiting for open slot</p>
                      </div>
                    </div>
                    <span className="text-[10px] bg-zinc-900 px-2 py-0.5 rounded text-zinc-600">Quick Task</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* 3. PROBLEM SECTION */}
      <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-b border-zinc-900">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-5 space-y-4">
            <div className="text-xs font-semibold uppercase tracking-widest text-zinc-500">The Productivity Trap</div>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white">
              Planning isn't the hard part. Staying on track is.
            </h2>
            <p className="text-zinc-400 leading-relaxed text-sm sm:text-base">
              Traditional to-do lists expect you to be a robot. The second you get an urgent call, hit traffic, or just run out of steam, your calendar fills up with a pile of past-due notifications. Eventually, you feel overwhelmed and give up entirely.
            </p>
          </div>

          <div className="lg:col-span-7 bg-gradient-to-br from-zinc-950 to-zinc-900 p-6 rounded-2xl border border-zinc-800/60 relative overflow-hidden">
            <div className="space-y-4">
              <div className="flex items-center justify-between text-xs text-zinc-500 border-b border-zinc-800 pb-2">
                <span>Standard To-Do Lists vs. Reality</span>
                <span className="text-red-400 font-bold">● Overloaded</span>
              </div>
              <div className="space-y-3 opacity-60 filter blur-[0.5px]">
                <div className="p-2.5 bg-red-950/20 border border-red-900/30 rounded-lg text-xs text-red-300 flex items-center justify-between">
                  <span><s>[Monday] Finish client proposal draft</s></span>
                  <span className="text-[10px] text-red-400 bg-red-950 px-1.5 py-0.5 rounded">OVERDUE</span>
                </div>
                <div className="p-2.5 bg-red-950/20 border border-red-900/30 rounded-lg text-xs text-red-300 flex items-center justify-between">
                  <span><s>[Tuesday] Outline presentation talking points</s></span>
                  <span className="text-[10px] text-red-400 bg-red-950 px-1.5 py-0.5 rounded">OVERDUE</span>
                </div>
                <div className="p-2.5 bg-zinc-900 border border-zinc-800 rounded-lg text-xs text-zinc-500">
                  [Wednesday] Research new software options
                </div>
              </div>
              <p className="text-xs text-zinc-400 italic bg-zinc-900/50 p-3 rounded-lg text-center border border-zinc-800">
                ⚠️ You have 5 missed tasks dragging from earlier this week. Your schedule is no longer realistic.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. SOLUTION OVERVIEW */}
      <section id="features" className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-b border-zinc-900">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white">Built for execution, not just organization.</h2>
          <p className="text-zinc-400 max-w-xl mx-auto text-sm sm:text-base">We divided the workload of your day into two intelligent systems.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="p-8 rounded-2xl bg-gradient-to-b from-zinc-900/80 to-zinc-950 border border-zinc-800 hover:border-zinc-700 transition-all flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-400">
                <Brain size={20} />
              </div>
              <h3 className="text-xl font-semibold text-white">The Smart Planning Engine</h3>
              <p className="text-zinc-400 text-sm leading-relaxed">
                Tell the platform what you want to achieve in plain English. Powered by Claude, it deeply understands your personal context, preferred pacing, and deadlines to turn a massive goal into simple, bite-sized daily steps.
              </p>
            </div>
            <div className="pt-4 border-t border-zinc-900 text-xs text-zinc-500">
              Handles: Big Goals • Step-by-Step Roadmaps • Daily Milestones
            </div>
          </div>

          <div className="p-8 rounded-2xl bg-gradient-to-b from-zinc-900/80 to-zinc-950 border border-zinc-800 hover:border-zinc-700 transition-all flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-400">
                <Sliders size={20} />
              </div>
              <h3 className="text-xl font-semibold text-white">The Auto-Rescheduling Engine</h3>
              <p className="text-zinc-400 text-sm leading-relaxed">
                Your safety net for when life gets busy. It constantly looks out for you—smoothly moving uncompleted work into optimal future slots, saving your important deadlines, and keeping your daily stress levels down.
              </p>
            </div>
            <div className="pt-4 border-t border-zinc-900 text-xs text-zinc-500">
              Protects: Overdue Tasks • Energy Balances • Hard Deadlines
            </div>
          </div>
        </div>
      </section>

      {/* 5. FEATURE GRID */}
      <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-b border-zinc-900">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

          <div className="md:col-span-2 p-6 rounded-xl bg-zinc-950 border border-zinc-800 flex flex-col justify-between space-y-4">
            <div>
              <h4 className="text-base font-semibold text-white">Goal-to-Plan Generator</h4>
              <p className="text-xs text-zinc-400 mt-1">Type in a major goal—like writing a book or building a business. The AI handles the overwhelming thinking process and creates a manageable execution timeline for you.</p>
            </div>
            <div className="bg-zinc-900/40 p-3 rounded-lg border border-zinc-900 text-[11px] text-indigo-300">
              ✨ Turning "Write a 5,000 word proposal" into 6 small, daily tasks...
            </div>
          </div>

          <div className="p-6 rounded-xl bg-zinc-950 border border-zinc-800 flex flex-col justify-between space-y-4">
            <div>
              <h4 className="text-base font-semibold text-white">Context-Aware Realities</h4>
              <p className="text-xs text-zinc-400 mt-1">The system respects your actual life. It remembers your child-care blocks, vacations, routine breaks, and energy limits.</p>
            </div>
            <span className="text-[11px] text-zinc-600">Personal settings synced</span>
          </div>

          <div className="p-6 rounded-xl bg-zinc-950 border border-zinc-800 flex flex-col justify-between space-y-4">
            <div>
              <h4 className="text-base font-semibold text-white">Smart Auto-Rescheduling</h4>
              <p className="text-xs text-zinc-400 mt-1">Unfinished items slide gracefully to upcoming open windows. You never have to manually shift calendar boxes again.</p>
            </div>
            <div className="h-2 w-full bg-zinc-900 rounded-full overflow-hidden">
              <motion.div animate={{ width: ['20%', '85%', '20%'] }} transition={{ duration: 6, repeat: Infinity }} className="h-full bg-indigo-500" />
            </div>
          </div>

          <div className="md:col-span-2 p-6 rounded-xl bg-zinc-950 border border-zinc-800 flex flex-col justify-between space-y-4">
            <div>
              <h4 className="text-base font-semibold text-white">Priority-Based Workload Recovery</h4>
              <p className="text-xs text-zinc-400 mt-1">Your absolute highest-priority projects always get preferred spots in your calendar. If a shift happens, lower-priority tasks give way automatically to protect your main goals.</p>
            </div>
            <div className="flex gap-2">
              <span className="px-2 py-0.5 rounded text-[10px] bg-red-950 text-red-300 border border-red-900/40">Critical Priority</span>
              <span className="px-2 py-0.5 rounded text-[10px] bg-zinc-900 text-zinc-400">Flexible Task</span>
            </div>
          </div>

        </div>
      </section>

      {/* 6. DEEP DIVE: SMART PLANNING ENGINE */}
      <section id="how-it-works" className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-b border-zinc-900 relative">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-5 space-y-5">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-indigo-950/50 border border-indigo-900 text-xs text-indigo-300">
              Phase 01 // From Goal to Action
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white">More context. Better plans.</h2>
            <p className="text-zinc-400 text-sm sm:text-base leading-relaxed">
              Standard AI tools give you a generic list because they don't know who you are. Stratos takes your goals and blends them with your actual life constraints—your available hours, energy patterns, and existing plans—to build a roadmap that actually works.
            </p>

            {/* Structured Workflow Micro-Stepper */}
            <div className="space-y-3 text-xs text-zinc-400 pt-2">
              <div className="flex items-center gap-3"><span className="w-5 h-5 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center text-[10px] text-zinc-300">1</span> You type in a goal or milestone</div>
              <div className="flex items-center gap-3"><span className="w-5 h-5 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center text-[10px] text-zinc-300">2</span> The system checks your available hours</div>
              <div className="flex items-center gap-3"><span className="w-5 h-5 rounded-full bg-indigo-950 border border-indigo-800 flex items-center justify-center text-[10px] text-indigo-300">3</span> Claude creates custom, step-by-step tasks</div>
            </div>
          </div>

          {/* Graphical Pipeline Representation */}
          <div className="lg:col-span-7 bg-zinc-950 border border-zinc-800 p-6 rounded-2xl relative">
            <div className="space-y-4 text-xs">
              <div className="p-3 rounded-lg bg-zinc-900/50 border border-zinc-800 text-zinc-400 flex justify-between">
                <span>📥 Your Input</span>
                <span className="text-zinc-200">"Build a 4-week fitness routine & prep meals"</span>
              </div>
              <div className="flex justify-center my-2"><div className="w-px h-6 bg-gradient-to-b from-indigo-500 to-transparent" /></div>
              <div className="p-3 rounded-lg bg-indigo-950/20 border border-indigo-900/50 text-indigo-200 flex items-center gap-3">
                <Brain size={14} className="text-indigo-400 shrink-0" />
                <span>Stratos is analyzing your calendar, free evenings, and gym equipment preference...</span>
              </div>
              <div className="flex justify-center my-2"><div className="w-px h-6 bg-gradient-to-b from-purple-500 to-transparent" /></div>
              <div className="p-3 rounded-lg bg-zinc-900/50 border border-zinc-800 space-y-2">
                <span className="text-emerald-400 text-[11px]">✓ Your Customized Plan Ready:</span>
                <div className="pl-3 border-l border-zinc-800 space-y-1.5 text-zinc-400 text-[11px]">
                  <div>• Monday: 30-minute upper body circuit [Set for 6:00 PM free window]</div>
                  <div>• Tuesday: Grocery shop for high-protein ingredients [Set for lunch break]</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. DEEP DIVE: SMART RESCHEDULING ENGINE */}
      <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-b border-zinc-900">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">

          <div className="lg:col-span-7 order-last lg:order-first bg-zinc-950 border border-zinc-800 p-6 rounded-2xl">
            <div className="space-y-4">
              <div className="flex items-center justify-between text-xs text-zinc-500">
                <span>Behind the Scenes: Rebalancing Logic</span>
                <span className="text-purple-400">Smart Balancing</span>
              </div>

              <div className="space-y-2 text-xs">
                <div className="p-3 bg-zinc-900/60 rounded-lg flex justify-between items-center">
                  <span className="text-zinc-300">How important is this task?</span>
                  <span className="text-indigo-400">High priority (Must do this week)</span>
                </div>
                <div className="p-3 bg-zinc-900/60 rounded-lg flex justify-between items-center">
                  <span className="text-zinc-300">How many days overdue?</span>
                  <span className="text-amber-400">Missed yesterday</span>
                </div>
                <div className="p-3 bg-zinc-900/60 rounded-lg flex justify-between items-center">
                  <span className="text-zinc-300">Your available capacity</span>
                  <span className="text-emerald-400">You have 2 hours open tomorrow morning</span>
                </div>
              </div>

              <div className="p-3 bg-purple-950/20 border border-purple-900/40 rounded-lg text-xs text-center text-purple-300">
                ✨ Action Taken: Task safely moved to tomorrow morning. Lower priority items shifted back to keep you stress-free.
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 space-y-5">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-purple-950/50 border border-purple-900 text-xs text-purple-300">
              Phase 02 // Automatic Adaptation
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white">When life happens, the system adapts.</h2>
            <p className="text-zinc-400 text-sm sm:text-base leading-relaxed">
              If an emergency cuts your afternoon short or a meeting runs late, you don't have to panic. Stratos instantly calculates the best path forward—rearranging your upcoming week based on what matters most, preserving your hard deadlines, and keeping you moving forward.
            </p>
          </div>

        </div>
      </section>

      {/* 8. HOW IT WORKS (THE WORKFLOW LOOP) */}
      <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-b border-zinc-900">
        <div className="text-center max-w-xl mx-auto space-y-4 mb-16">
          <h2 className="text-3xl font-bold tracking-tight text-white">A simpler way to run your day</h2>
          <p className="text-zinc-400 text-sm">How Stratos keeps your life completely in sync.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            { step: "01", title: "Set Your Goals", desc: "Type out what you want to achieve, whether it's personal, creative, or professional." },
            { step: "02", title: "AI Creates the Plan", desc: "Our Claude-driven assistant breaks your goal down into clear, small daily steps." },
            { step: "03", title: "Review Your Roadmap", desc: "Make adjustments, lock in specific meetings, or leave things flexible." },
            { step: "04", title: "Follow Your Daily Flow", desc: "Log in each morning to see a clean, realistic schedule designed for your day." },
            { step: "05", title: "Automatic Balancing", desc: "If you miss something, don't worry. The engine automatically reschedules it." },
            { step: "06", title: "Refine Your Pacing", desc: "The platform learns how you work best, making future plans even more accurate." }
          ].map((item, index) => (
            <div key={index} className="p-5 rounded-xl bg-zinc-950 border border-zinc-900 hover:border-zinc-800 transition-colors space-y-3">
              <span className="text-xs text-indigo-500 font-bold">{item.step}</span>
              <h4 className="text-base font-semibold text-white">{item.title}</h4>
              <p className="text-xs text-zinc-400 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 9. SOCIAL PROOF SECTION */}
      <section id="reviews" className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-b border-zinc-900">
        <div className="text-center space-y-2 mb-16">
          <h2 className="text-2xl sm:text-3xl font-bold text-white">Loved by busy, high-achieving people</h2>
          <p className="text-zinc-500 text-sm">See how much time our community is reclaiming every week.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t, idx) => (
            <div key={idx} className="p-6 rounded-xl bg-zinc-950 border border-zinc-800/80 flex flex-col justify-between space-y-6">
              <p className="text-zinc-300 text-xs sm:text-sm leading-relaxed italic">"{t.quote}"</p>
              <div className="flex items-center justify-between pt-4 border-t border-zinc-900">
                <div>
                  <h5 className="text-xs font-bold text-white">{t.author}</h5>
                  <p className="text-[10px] text-zinc-500">{t.role}</p>
                </div>
                <span className="text-[11px] font-medium text-emerald-400 bg-emerald-950/30 px-2 py-0.5 rounded border border-emerald-900/30">
                  {t.metric}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 10. FAQ SECTION */}
      <section id="faq" className="py-24 max-w-3xl mx-auto px-4 sm:px-6 border-b border-zinc-900">
        <h2 className="text-2xl sm:text-3xl font-bold text-center text-white mb-12">Frequently Asked Questions</h2>

        <div className="space-y-4">
          {faqs.map((faq, i) => (
            <div key={i} className="border border-zinc-800 rounded-xl bg-zinc-950 overflow-hidden">
              <button onClick={() => setActiveFaq(activeFaq === i ? null : i)} className="w-full p-5 text-left flex items-center justify-between text-zinc-200 hover:text-white transition-colors">
                <span className="text-sm font-medium">{faq.q}</span>
                <ChevronDown size={16} className={`transform transition-transform text-zinc-500 ${activeFaq === i ? 'rotate-180 text-white' : ''}`} />
              </button>

              <AnimatePresence>
                {activeFaq === i && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2 }} className="border-t border-zinc-900 bg-black/40">
                    <p className="p-5 text-xs sm:text-sm text-zinc-400 leading-relaxed">{faq.a}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </section>

      {/* 11. FINAL CALL TO ACTION */}
      <section className="py-24 max-w-5xl mx-auto px-4 sm:px-6 text-center relative">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(147,51,234,0.06),transparent_50%)] pointer-events-none" />

        <div className="bg-gradient-to-b from-zinc-900 to-black border border-zinc-800 p-8 sm:p-12 rounded-3xl space-y-6 relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-purple-500/30 to-transparent" />

          <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-white">
            Build a plan once. <br />Let the system keep it realistic.
          </h2>
          <p className="text-zinc-400 text-sm sm:text-base max-w-xl mx-auto">
            Stop losing hours fixing broken calendars and feeling guilty about missed tasks. Let smart planning outline your roadmap, and let dynamic rebalancing keep your days clear and organized.
          </p>

          <div className="pt-4 flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link href="/register" className="h-12 px-8 rounded-xl bg-white hover:bg-zinc-200 text-black font-semibold text-sm tracking-tight transition-all shadow-xl flex items-center justify-center">
              Start Planning Free
            </Link>
            <span className="text-xs text-zinc-500">No credit card required.</span>
          </div>
        </div>
      </section>

      {/* MINI FOOTER */}
      <footer className="border-t border-zinc-900 bg-black py-8 text-center text-xs text-zinc-600">
        <div>© {new Date().getFullYear()} STRATOS INC. ALL RIGHTS RESERVED. PRIVACY PROTECTED.</div>
      </footer>

    </div>
  );
}