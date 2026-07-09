import React from 'react';
import type { Metadata } from 'next';
import SiteHeader from '@/Common/components/SiteHeader';
import SiteFooter from '@/Common/components/SiteFooter';

// TODO(privacy-review): The source PRIVACY_POLICY.md does not include a
// section on "AI-assisted content" (e.g. whether any in-app features use AI
// to generate or process plan/task content, separate from a user's own use
// of the Claude connector). Per the connector page spec, this section should
// be verified against the current app and added before this page is
// considered final. Nothing has been invented here to fill that gap.

export const metadata: Metadata = {
    title: 'Privacy Policy | Stratos',
    description: 'Learn how Stratos collects, stores, and protects your data.',
};

const LAST_UPDATED = 'May 7, 2026';

export default function PrivacyPage() {
    return (
        <div className="min-h-screen bg-black text-zinc-100 selection:bg-indigo-500/30 selection:text-indigo-200 font-sans antialiased overflow-x-hidden">
            <SiteHeader />

            <section className="relative pt-20 pb-12 md:pt-24 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center border-b border-zinc-900">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(99,102,241,0.06),transparent_55%)] pointer-events-none" />
                <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-b from-white via-zinc-200 to-zinc-500 leading-tight">
                    Privacy Policy
                </h1>
                <p className="text-xs text-zinc-500 mt-4">Last updated: {LAST_UPDATED}</p>
            </section>

            <article className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-14 text-sm text-zinc-400 leading-relaxed">
                <p>
                    This policy explains what data Stratos (&quot;the App&quot;, &quot;the Service&quot;) collects, how it&apos;s used, and how
                    you can contact us about it. It applies both to the Stratos web app and to the Stratos connector
                    that exposes its tools to AI assistants such as Claude.
                </p>

                <section aria-labelledby="what-we-collect" className="space-y-4">
                    <h2 id="what-we-collect" className="text-xl font-semibold text-white scroll-mt-24">What we collect</h2>
                    <div className="overflow-x-auto rounded-xl border border-zinc-900">
                        <table className="w-full text-left text-xs sm:text-sm">
                            <thead className="bg-zinc-950 text-zinc-300">
                                <tr>
                                    <th scope="col" className="px-4 py-3 font-semibold border-b border-zinc-900">Category</th>
                                    <th scope="col" className="px-4 py-3 font-semibold border-b border-zinc-900">Details</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-zinc-900">
                                <tr>
                                    <td className="px-4 py-3 align-top text-zinc-200 font-medium">Account information</td>
                                    <td className="px-4 py-3">Email address and password (stored as a salted hash, never in plain text), used for authentication.</td>
                                </tr>
                                <tr>
                                    <td className="px-4 py-3 align-top text-zinc-200 font-medium">Timezone</td>
                                    <td className="px-4 py-3">Used to correctly schedule and display your tasks in local time.</td>
                                </tr>
                                <tr>
                                    <td className="px-4 py-3 align-top text-zinc-200 font-medium">Plans and tasks</td>
                                    <td className="px-4 py-3">Plan names and descriptions, task titles, descriptions, estimated durations, priorities, scheduled dates, and completion status.</td>
                                </tr>
                                <tr>
                                    <td className="px-4 py-3 align-top text-zinc-200 font-medium">Basic technical data</td>
                                    <td className="px-4 py-3">Standard request metadata (timestamps, error logs) used for debugging and reliability. We don&apos;t track location or device identifiers beyond what authentication requires.</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </section>

                <section aria-labelledby="how-we-use-it" className="space-y-4">
                    <h2 id="how-we-use-it" className="text-xl font-semibold text-white scroll-mt-24">How we use it</h2>
                    <ul className="list-disc list-outside pl-5 space-y-2">
                        <li>To provide core app functionality: authentication, storing and organizing your plans and tasks, and calculating your schedule capacity.</li>
                        <li>To diagnose bugs and maintain service reliability.</li>
                    </ul>
                    <p>We don&apos;t sell your data, and we don&apos;t use your plan or task content for advertising.</p>
                </section>

                <section aria-labelledby="third-party-sharing" className="space-y-4">
                    <h2 id="third-party-sharing" className="text-xl font-semibold text-white scroll-mt-24">Third-party sharing</h2>
                    <ul className="list-disc list-outside pl-5 space-y-2">
                        <li><span className="text-zinc-200 font-medium">Hosting infrastructure:</span> the app is hosted on Vercel; our backend and database run on our hosting providers, who process data on our behalf and don&apos;t use it for their own purposes.</li>
                        <li>We don&apos;t share your data with any other third party.</li>
                    </ul>
                </section>

                <section aria-labelledby="data-retention" className="space-y-4">
                    <h2 id="data-retention" className="text-xl font-semibold text-white scroll-mt-24">Data retention</h2>
                    <ul className="list-disc list-outside pl-5 space-y-2">
                        <li>Account, plan, and task data are retained for as long as your account is active.</li>
                        <li>You can request deletion of your account and associated data at any time by contacting us — we&apos;ll delete it within 30 days.</li>
                    </ul>
                </section>

                <section aria-labelledby="your-choices" className="space-y-4">
                    <h2 id="your-choices" className="text-xl font-semibold text-white scroll-mt-24">Your choices</h2>
                    <ul className="list-disc list-outside pl-5 space-y-2">
                        <li>You can request a copy of your data, or request deletion, at any time.</li>
                        <li>You can revoke the Claude connector&apos;s access at any time from Claude&apos;s Connector settings, independent of your Stratos account itself.</li>
                    </ul>
                </section>

                <section aria-labelledby="claude-connector" className="space-y-4">
                    <h2 id="claude-connector" className="text-xl font-semibold text-white scroll-mt-24">The Claude connector, specifically</h2>
                    <p>
                        If you access Stratos through the Claude connector, the connector authenticates with your
                        existing account using OAuth. Every action Claude takes — viewing, creating, updating, or
                        deleting plans and tasks — is scoped to your own account only. The connector doesn&apos;t collect
                        additional data beyond what&apos;s described above, and doesn&apos;t read data outside what a given
                        request explicitly asks for.
                    </p>
                </section>

                <section aria-labelledby="contact" className="space-y-4 pt-4 border-t border-zinc-900">
                    <h2 id="contact" className="text-xl font-semibold text-white scroll-mt-24">Contact</h2>
                    <p>
                        Questions about this policy or your data:{' '}
                        <a href="mailto:munib.urehmann@gmail.com" className="text-indigo-400 hover:text-indigo-300 underline underline-offset-4">
                            munib.urehmann@gmail.com
                        </a>
                    </p>
                </section>
            </article>

            <SiteFooter />
        </div>
    );
}