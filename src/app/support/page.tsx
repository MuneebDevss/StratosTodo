import React from 'react';
import Link from 'next/link';
import type { Metadata } from 'next';
import { Mail, Clock, ArrowRight, BookOpen } from 'lucide-react';
import SiteHeader from '@/Common/components/SiteHeader';
import SiteFooter from '@/Common/components/SiteFooter';
import SupportAccordion from './SupportAccordion'

const SUPPORT_EMAIL = 'munib.urehmann@gmail.com';
// TODO: confirm the actual target response time with the team — placeholder below.
const RESPONSE_TIME = '1–2 business days';

const issues = [
    {
        q: "Connector won't connect",
        a: (
            <ul className="list-disc list-inside space-y-1">
                <li>Verify you&apos;re signed in to your Stratos account.</li>
                <li>Reconnect from Claude → Settings → Connectors.</li>
            </ul>
        ),
    },
    {
        q: 'Claude says something went wrong',
        a: (
            <ul className="list-disc list-inside space-y-1">
                <li>Retry the request.</li>
                <li>
                    If it continues, email support with approximately what you asked Claude to do and when it happened.
                </li>
            </ul>
        ),
    },
    {
        q: 'I want my data deleted',
        a: (
            <p>
                Email support from your account&apos;s registered email address, and we&apos;ll take it from there. See our{' '}
                <Link href="/privacy" className="text-indigo-400 hover:text-indigo-300 underline underline-offset-4">
                    Privacy Policy
                </Link>{' '}
                for details on the deletion process.
            </p>
        ),
    },
];

export const metadata: Metadata = {
    title: 'Support | Stratos',
    description: 'Get help connecting and using the Stratos Claude connector.',
};

export default function SupportPage() {
    return (
        <div className="min-h-screen bg-black text-zinc-100 selection:bg-indigo-500/30 selection:text-indigo-200 font-sans antialiased overflow-x-hidden">
            <SiteHeader />

            {/* Hero */}
            <section className="relative pt-20 pb-16 md:pt-24 md:pb-16 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 border-b border-zinc-900 text-center">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(99,102,241,0.06),transparent_55%)] pointer-events-none" />
                <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-b from-white via-zinc-200 to-zinc-500 leading-tight">
                    Support
                </h1>
                <p className="text-base sm:text-lg text-zinc-400 max-w-xl mx-auto leading-relaxed mt-4">
                    Get help connecting and using Stratos with Claude.
                </p>
            </section>

            {/* Contact */}
            <section className="py-16 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 border-b border-zinc-900">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div className="p-6 rounded-2xl bg-zinc-950 border border-zinc-900 space-y-3">
                        <div className="w-9 h-9 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-400">
                            <Mail size={18} />
                        </div>
                        <h3 className="text-sm font-semibold text-white">Contact us</h3>
                        <a href={`mailto:${SUPPORT_EMAIL}`} className="text-xs sm:text-sm text-indigo-400 hover:text-indigo-300 underline underline-offset-4 break-all">
                            {SUPPORT_EMAIL}
                        </a>
                    </div>
                    <div className="p-6 rounded-2xl bg-zinc-950 border border-zinc-900 space-y-3">
                        <div className="w-9 h-9 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-400">
                            <Clock size={18} />
                        </div>
                        <h3 className="text-sm font-semibold text-white">Response time</h3>
                        <p className="text-xs sm:text-sm text-zinc-400">Typically within {RESPONSE_TIME}.</p>
                    </div>
                </div>
            </section>

            {/* Common Issues */}
            <section className="py-20 max-w-3xl mx-auto px-4 sm:px-6 border-b border-zinc-900">
                <h2 className="text-2xl font-bold text-center text-white mb-10">Common issues</h2>
                <SupportAccordion issues={issues} />
            </section>

            {/* Link back to docs */}
            <section className="py-16 max-w-3xl mx-auto px-4 sm:px-6 text-center">
                <div className="p-8 rounded-2xl bg-zinc-950 border border-zinc-900 space-y-4">
                    <div className="w-9 h-9 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400 mx-auto">
                        <BookOpen size={18} />
                    </div>
                    <p className="text-xs sm:text-sm text-zinc-400">New to the Claude connector, or want a refresher on setup?</p>
                    <Link href="/docs" className="inline-flex items-center gap-2 text-sm font-medium text-indigo-400 hover:text-indigo-300 group">
                        Read the docs <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                    </Link>
                </div>
            </section>

            <SiteFooter />
        </div>
    );
}