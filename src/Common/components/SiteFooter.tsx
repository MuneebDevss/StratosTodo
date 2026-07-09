import React from 'react';
import Link from 'next/link';

// Shared marketing-site footer. Adds Docs / Support / Privacy alongside the
// existing copyright line so the links are available site-wide.
export default function SiteFooter() {
    return (
        <footer className="border-t border-zinc-900 bg-black py-8 text-center text-[10px] text-zinc-600 tracking-wider">
            <div className="flex flex-col items-center gap-3">
                <nav className="flex items-center gap-4 text-zinc-500">
                    <Link href="/docs" className="hover:text-zinc-300 transition-colors">Docs</Link>
                    <span className="text-zinc-800">•</span>
                    <Link href="/support" className="hover:text-zinc-300 transition-colors">Support</Link>
                    <span className="text-zinc-800">•</span>
                    <Link href="/privacy" className="hover:text-zinc-300 transition-colors">Privacy</Link>
                </nav>
                <div>© {new Date().getFullYear()} STRATOS INC. CAPACITY DRIVEN TASK PROTECTION. ALL PRIVACY RESERVED.</div>
            </div>
        </footer>
    );
}