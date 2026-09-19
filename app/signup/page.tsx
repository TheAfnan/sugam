'use client';

import React, { Suspense } from 'react';
import GithubBisAuth from '@/components/auth/GithubBisAuth';

export default function SignupPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#0a0d12] flex items-center justify-center text-slate-500 font-mono text-xs">INITIALIZING BIS AUTH...</div>}>
      <GithubBisAuth initialMode="signup" />
    </Suspense>
  );
}
