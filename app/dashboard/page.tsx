'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/useAuth';

export default function DashboardDispatcherPage() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated || !user) {
        router.push('/login?next=/dashboard');
      } else {
        const role = user.role || 'msme';
        router.replace('/dashboard/' + role);
      }
    }
  }, [isLoading, isAuthenticated, user, router]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] text-gray-500 space-y-3">
      <div className="w-10 h-10 border-4 border-teal-600 border-t-transparent rounded-full animate-spin"></div>
      <p className="text-xs font-semibold tracking-wide uppercase text-gray-400">
        Routing to your authorized portal...
      </p>
    </div>
  );
}
