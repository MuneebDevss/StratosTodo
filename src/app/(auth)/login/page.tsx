'use client';

import React, { Suspense, useState } from 'react';
import { LoginFormContent } from '@/features/auth/components/login-form';

// 1. THIS IS THE ROOT PAGE COMPONENT NEXT.JS SEES
export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-black text-zinc-400 flex items-center justify-center font-sans">
        Syncing with Stratos...
      </div>
    }>
      <LoginFormContent />
    </Suspense>
  );
}