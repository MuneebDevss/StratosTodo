'use client';

import Link from 'next/link';
import { useUser } from '@/features/auth/api/use-user';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function Home() {
  const { data: user, isLoading } = useUser();
  const router = useRouter();

  // If they are already authenticated, slide them directly onto their workspace
  useEffect(() => {
    if (!isLoading && user) {
      router.push('/dashboard');
    }
  }, [user, isLoading, router]);

  if (isLoading) {
    return (
      <div className="flex flex-1 items-center justify-center min-h-screen bg-zinc-50">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-zinc-900"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans px-4">
      <main className="w-full max-w-xl text-center space-y-8 p-8 bg-white rounded-2xl shadow-sm border border-zinc-100">
        <div className="space-y-3">
          <h1 className="text-4xl font-extrabold tracking-tight text-zinc-900">
            StratosToDo
          </h1>
          <p className="text-lg text-zinc-600 max-w-md mx-auto">
            The intelligent, cascade-capacity rescheduling planner that handles backlog bottlenecks automatically.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
          <Link
            href="/login"
            className="flex h-12 items-center justify-center rounded-xl bg-zinc-900 hover:bg-zinc-800 text-white font-medium px-8 transition-colors shadow-sm sm:w-40"
          >
            Sign In
          </Link>
          <Link
            href="/register"
            className="flex h-12 items-center justify-center rounded-xl border border-zinc-200 bg-white hover:bg-zinc-50 text-zinc-900 font-medium px-8 transition-colors shadow-sm sm:w-40"
          >
            Get Started
          </Link>
        </div>
      </main>
    </div>
  );
}
