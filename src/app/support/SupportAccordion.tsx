'use client';

import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

type Issue = {
    q: string;
    a: React.ReactNode;
};

export default function SupportAccordion({ issues }: { issues: Issue[] }) {
    const [active, setActive] = useState<number | null>(0);

    return (
        <div className="space-y-4">
            {issues.map((issue, i) => {
                const isOpen = active === i;
                const panelId = `support-panel-${i}`;
                const buttonId = `support-trigger-${i}`;
                return (
                    <div key={issue.q} className="border border-zinc-900 rounded-xl bg-zinc-950 overflow-hidden">
                        <h3>
                            <button
                                id={buttonId}
                                aria-expanded={isOpen}
                                aria-controls={panelId}
                                onClick={() => setActive(isOpen ? null : i)}
                                className="w-full p-5 text-left flex items-center justify-between text-zinc-200 hover:text-white transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-indigo-500 focus-visible:outline-offset-2"
                            >
                                <span className="text-xs sm:text-sm font-medium">{issue.q}</span>
                                <ChevronDown size={14} aria-hidden="true" className={`shrink-0 ml-4 transform transition-transform text-zinc-500 ${isOpen ? 'rotate-180 text-white' : ''}`} />
                            </button>
                        </h3>
                        <AnimatePresence>
                            {isOpen && (
                                <motion.div
                                    id={panelId}
                                    role="region"
                                    aria-labelledby={buttonId}
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: 'auto', opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    transition={{ duration: 0.2 }}
                                    className="border-t border-zinc-900/60 bg-black/20"
                                >
                                    <div className="p-5 text-xs text-zinc-400 leading-relaxed space-y-2">{issue.a}</div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                );
            })}
        </div>
    );
}