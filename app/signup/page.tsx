'use client';

import React, { Suspense } from 'react';
import AuthLayout from '@/components/auth/AuthLayout';

export default function SignupPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#f3f5f8] flex items-center justify-center text-slate-500 text-xs font-medium">Loading SUGAM-AI Portal...</div>}>
      <AuthLayout initialTab="signup" />
    </Suspense>
  );
}

