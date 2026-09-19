'use client';

import React, { Suspense } from 'react';
import GithubBisAuth from '@/components/auth/GithubBisAuth';

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-50 flex items-center justify-center text-slate-500 text-xs">Loading portal...</div>}>
      <GithubBisAuth initialMode="signin" />
    </Suspense>
  );
}
