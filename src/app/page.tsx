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
  }, [isLoading, isAuthenticated, router]);

  //Intuitive Circular Loading Bar
  return (
    <div className="min-h-screen flex items-center justify-center bg-black">
      <motion.div
        animate={{
          rotate: [0, 360], // Rotate from 0 to 360 degrees
        }}
        transition={{
          duration: 2, // Full rotation takes 2 seconds
          repeat: Infinity, // Loop indefinitely
          ease: "linear" // Constant speed (smooth rotation)
        }}
        className="w-20 h-20 border-8 border-white border-t-transparent rounded-full"
      />
    </div>
  )

}