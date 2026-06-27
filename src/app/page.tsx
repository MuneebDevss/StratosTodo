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
import { useUser } from '@/features/auth/api/use-user';
import { useRouter } from 'next/navigation'

export default function Main() {

  const { isLoading, isAuthenticated } = useUser();
  const router = useRouter();
  //Check if the user is loggin in and redirect them to the dashboard if so
  useEffect(() => {
    if (isLoading) {
      return;
    }
    if (isAuthenticated) {
      router.replace('/dashboard');
    }
    else {
      router.replace('/landing');
    }
  }, [isLoading, isAuthenticated, router]);

  //Intuitive Circular Loading Bar
  // Loading Screen
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-black">
      {/* Background Glow */}
      <div className="absolute h-[28rem] w-[28rem] rounded-full bg-violet-600/10 blur-[140px]" />

      <div className="relative flex flex-col items-center">
        {/* Animated Ring */}
        <div className="relative flex h-24 w-24 items-center justify-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{
              repeat: Infinity,
              duration: 1.5,
              ease: "linear",
            }}
            className="absolute inset-0 rounded-full border-[5px] border-zinc-700 border-t-violet-500"
          />

          <motion.div
            animate={{
              scale: [0.9, 1.1, 0.9],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
            }}
          >
            <Brain className="h-10 w-10 text-violet-400" />
          </motion.div>
        </div>

        {/* Text */}
        <motion.h1
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-8 text-2xl font-bold text-white"
        >
          Preparing Stratos
        </motion.h1>

        <motion.p
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{
            repeat: Infinity,
            duration: 2,
          }}
          className="mt-2 text-sm text-zinc-400"
        >
          Checking your session...
        </motion.p>

        {/* Progress Dots */}
        <div className="mt-8 flex gap-2">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              animate={{
                y: [0, -6, 0],
                opacity: [0.4, 1, 0.4],
              }}
              transition={{
                duration: 0.8,
                repeat: Infinity,
                delay: i * 0.2,
              }}
              className="h-2.5 w-2.5 rounded-full bg-violet-400"
            />
          ))}
        </div>

        {/* Bottom Label */}
        <div className="mt-10 rounded-full border border-zinc-800 bg-zinc-900/70 px-4 py-2 text-xs text-zinc-400 backdrop-blur">
          Securely synchronizing your workspace
        </div>
      </div>
    </div>
  );

}