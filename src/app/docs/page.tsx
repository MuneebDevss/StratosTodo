import React from 'react';
import Link from 'next/link';
import type { Metadata } from 'next';
import { ArrowRight, ListChecks, CalendarClock, Gauge, ShieldCheck, KeyRound, Lock, UserCheck } from 'lucide-react';
import SiteHeader from '@/Common/components/SiteHeader';
import SiteFooter from '@/Common/components/SiteFooter';

// NOTE: Replace with the real connector URL before publishing.
// Assumed from the app's known domain (see PRIVACY_POLICY.md) — confirm the
// exact MCP endpoint with the team.
const MCP_SERVER_URL = 'https://stratos-todo.vercel.app/mcp';

export const metadata: Metadata = {
    title: 'Connect Stratos to Claude',
    description: 'Manage your plans and tasks in Claude using the Stratos connector.',
};

const featureCards = [
    {
        icon: ListChecks,
        color: 'indigo',
        title: 'Plans',
        prompts: [
            'Show me my active plans',
            'Create a new plan called Q3 Launch',
            'Delete my old plan',
            "Rename this plan's description",
        ],
    },
    {
        icon: CalendarClock,
        color: 'purple',
        title: 'Tasks',
        prompts: [
            'What are my tasks this week?',
            'Add a task to finish the deck by Friday',
            "Mark this task's priority as high",
            'Delete that task',
        ],
    },
    {
        icon: Gauge,
        color: 'emerald',
        title: 'Scheduling',
        prompts: [
            'How much capacity do I have this week?',
            "Shift all of next Monday's tasks to Wednesday",
        ],
    },
];

const steps = [
    { title: 'Open Claude', desc: 'Head to claude.ai or the Claude app on desktop or mobile.' },
    { title: 'Go to Settings → Connectors', desc: 'Find the Connectors section inside your Claude settings.' },
    { title: 'Select "Add Custom Connector"', desc: 'Choose the option to add a new connector by URL.' },
    { title: 'Enter the Stratos connector URL', desc: MCP_SERVER_URL },
    { title: 'Sign in with your Stratos account', desc: 'Use your existing email and password — nothing new to set up.' },
    { title: 'Start chatting', desc: 'Ask Claude about your plans and tasks, right in the conversation.' },
];

const authPoints = [
    { icon: UserCheck, text: 'You sign in with the same account you already use for Stratos — no new username or password to remember.' },
    { icon: Lock, text: 'Claude never sees or stores your password. Sign-in happens securely through your Stratos account, using an industry-standard method called OAuth 2.1.' },
    { icon: ShieldCheck, text: 'Claude can only see and change your own plans and tasks — never anyone else\u2019s.' },
    { icon: KeyRound, text: 'You stay in control. Disconnect access at any time from Claude\u2019s Connector settings, without affecting your Stratos account.' },
];

const colorMap: Record<string, string> = {
    indigo: 'bg-indigo-500/10 text-indigo-400',
    purple: 'bg-purple-500/10 text-purple-400',
    emerald: 'bg-emerald-500/10 text-emerald-400',
};

export default function DocsPage() {
    return (
        <div className="min-h-screen bg-black text-zinc-100 selection:bg-indigo-500/30 selection:text-indigo-200 font-sans antialiased overflow-x-hidden">
            <SiteHeader />

            {/* Hero */}
            <section className="relative pt-20 pb-16 md:pt-28 md:pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-b border-zinc-900">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(99,102,241,0.06),transparent_55%)] pointer-events-none" />
                <div className="text-center max-w-2xl mx-auto space-y-6">
                    <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-b from-white via-zinc-200 to-zinc-500 leading-tight">
                        Connect Stratos to Claude
                    </h1>
                    <p className="text-base sm:text-lg text-zinc-400 leading-relaxed">
                        Manage your plans and tasks simply by chatting with Claude instead of opening the app.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center pt-2">
                        <a href="#getting-started" className="h-12 px-6 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-medium flex items-center justify-center gap-2 group transition-all shadow-lg shadow-indigo-600/20">
                            Connect in Claude <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                        </a>
                        <a href="#what-you-can-do" className="h-12 px-6 rounded-xl border border-zinc-800 hover:border-zinc-700 text-zinc-200 font-medium flex items-center justify-center transition-all">
                            Learn More
                        </a>
                    </div>
                </div>
            </section>

            {/* What you can do */}
            <section id="what-you-can-do" className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-b border-zinc-900">
                <div className="text-center space-y-3 mb-16">
                    <h2 className="text-3xl font-bold text-white">What you can do</h2>
                    <p className="text-zinc-400 max-w-xl mx-auto text-xs sm:text-sm">Just tell Claude what you want in plain English.</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {featureCards.map((card) => (
                        <div key={card.title} className="p-6 sm:p-8 rounded-2xl bg-zinc-950 border border-zinc-900 hover:border-zinc-800 transition-colors space-y-4">
                            <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${colorMap[card.color]}`}>
                                <card.icon size={18} />
                            </div>
                            <h3 className="text-lg font-semibold text-white">{card.title}</h3>
                            <ul className="space-y-2">
                                {card.prompts.map((p) => (
                                    <li key={p} className="text-xs sm:text-sm text-zinc-400 leading-relaxed bg-black/40 border border-zinc-900 rounded-lg px-3 py-2 font-mono">
                                        &quot;{p}&quot;
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            </section>

            {/* Getting started */}
            <section id="getting-started" className="py-20 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 border-b border-zinc-900">
                <div className="text-center max-w-xl mx-auto space-y-3 mb-16">
                    <h2 className="text-2xl sm:text-3xl font-bold text-white">Getting started</h2>
                    <p className="text-zinc-400 text-xs sm:text-sm">Connect once — it only takes a minute.</p>
                </div>
                <ol className="space-y-4">
                    {steps.map((step, idx) => (
                        <li key={step.title} className="flex gap-4 p-5 rounded-xl bg-zinc-950 border border-zinc-900">
                            <span className="font-mono text-xs text-indigo-400 font-bold shrink-0 w-6 h-6 rounded-full border border-indigo-900/50 bg-indigo-950/30 flex items-center justify-center">
                                {idx + 1}
                            </span>
                            <div>
                                <h4 className="text-sm font-semibold text-white">{step.title}</h4>
                                <p className="text-xs text-zinc-400 leading-relaxed mt-1 break-words">
                                    {idx === 3 ? <code className="text-indigo-300 bg-black/50 px-1.5 py-0.5 rounded border border-zinc-800">{step.desc}</code> : step.desc}
                                </p>
                            </div>
                        </li>
                    ))}
                </ol>
            </section>

            {/* Authentication */}
            <section className="py-20 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 border-b border-zinc-900">
                <div className="text-center max-w-xl mx-auto space-y-3 mb-16">
                    <h2 className="text-2xl sm:text-3xl font-bold text-white">Your data stays yours</h2>
                    <p className="text-zinc-400 text-xs sm:text-sm">A quick note on how sign-in and access work.</p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    {authPoints.map((point) => (
                        <div key={point.text} className="p-5 rounded-xl bg-zinc-950 border border-zinc-900 flex gap-4">
                            <point.icon size={18} className="text-indigo-400 shrink-0 mt-0.5" />
                            <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">{point.text}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* CTA */}
            <section className="py-20 max-w-3xl mx-auto px-4 sm:px-6 text-center">
                <div className="bg-gradient-to-b from-zinc-950 to-black border border-zinc-900 p-8 sm:p-12 rounded-2xl space-y-6">
                    <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">Ready to connect?</h2>
                    <p className="text-zinc-400 text-xs sm:text-sm max-w-md mx-auto leading-relaxed">
                        Have questions along the way? Visit <Link href="/support" className="text-indigo-400 hover:text-indigo-300 underline underline-offset-4">Support</Link>, or read our <Link href="/privacy" className="text-indigo-400 hover:text-indigo-300 underline underline-offset-4">Privacy Policy</Link>.
                    </p>
                    <Link href="/register" className="inline-flex h-11 px-8 rounded-xl bg-white hover:bg-zinc-200 text-black font-semibold text-xs tracking-tight transition-all shadow-xl items-center justify-center">
                        Create Your Account Free
                    </Link>
                </div>
            </section>

            <SiteFooter />
        </div>
    );
}