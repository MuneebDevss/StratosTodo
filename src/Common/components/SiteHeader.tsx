'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';

// Shared marketing-site header. Extracted from the homepage so /docs, /support,
// and /privacy render an identical nav instead of duplicating markup.
// Anchor links point back to "/#section" so they work from any route.
export default function SiteHeader() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    return (
        <>
            <header className="sticky top-0 z-50 w-full border-b border-zinc-800/60 bg-black/70 backdrop-blur-md transition-all duration-300">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-8">
                        <Link href="/" className="flex items-center gap-2 font-semibold tracking-tight text-white group">
                            <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-xs shadow-lg shadow-indigo-500/20 group-hover:scale-105 transition-transform">S</div>
                            <span className="font-mono tracking-wider text-sm text-zinc-200">STRATOS</span>
                        </Link>
                        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-zinc-400">
                            <Link href="/#features" className="hover:text-zinc-100 transition-colors">Features</Link>
                            <Link href="/#how-it-works" className="hover:text-zinc-100 transition-colors">How it Works</Link>
                            <Link href="/docs" className="hover:text-zinc-100 transition-colors">Docs</Link>
                            <Link href="/support" className="hover:text-zinc-100 transition-colors">Support</Link>
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

            <AnimatePresence>
                {mobileMenuOpen && (
                    <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="fixed inset-x-0 top-16 bg-zinc-950 border-b border-zinc-800 p-6 z-40 md:hidden space-y-4">
                        <Link href="/#features" onClick={() => setMobileMenuOpen(false)} className="block text-zinc-300">Features</Link>
                        <Link href="/#how-it-works" onClick={() => setMobileMenuOpen(false)} className="block text-zinc-300">How it Works</Link>
                        <Link href="/docs" onClick={() => setMobileMenuOpen(false)} className="block text-zinc-300">Docs</Link>
                        <Link href="/support" onClick={() => setMobileMenuOpen(false)} className="block text-zinc-300">Support</Link>
                        <div className="h-px bg-zinc-800 my-2" />
                        <Link href="/login" onClick={() => setMobileMenuOpen(false)} className="block text-zinc-300">Sign In</Link>
                        <Link href="/register" onClick={() => setMobileMenuOpen(false)} className="block w-full py-2.5 text-center rounded-lg bg-indigo-600 text-white font-medium">Start Free</Link>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}