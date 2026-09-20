'use client';

import React, { Suspense } from 'react';
import ExactBisLoginPage from '@/components/auth/ExactBisLoginPage';

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#f1f5f9] flex items-center justify-center text-slate-500 text-xs">Loading SUGAM-AI...</div>}>
      <ExactBisLoginPage initialTab="login" />
    </Suspense>
  );
}
