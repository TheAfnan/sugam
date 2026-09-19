'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Lock, ArrowLeft, RefreshCw, UserCheck, Shield } from 'lucide-react';
import { useAuth, UserRole, DEMO_PERSONAS } from '@/lib/useAuth';

interface RoleGuardProps {
  allowedRoles: UserRole[];
  children: React.ReactNode;
}

const ROLE_LABELS: Record<UserRole, { label: string; badgeColor: string }> = {
  msme: { label: 'MSME Factory Owner', badgeColor: 'bg-amber-50 text-amber-800 border-amber-200' },
  applicant: { label: 'New Business / Startup', badgeColor: 'bg-blue-50 text-blue-800 border-blue-200' },
  consumer: { label: 'Consumer & Citizen', badgeColor: 'bg-emerald-50 text-emerald-800 border-emerald-200' },
  officer: { label: 'BIS Quality Officer', badgeColor: 'bg-indigo-50 text-indigo-800 border-indigo-200' },
  admin: { label: 'Portal Admin', badgeColor: 'bg-slate-100 text-slate-800 border-slate-300' },
};

export default function RoleGuard({ allowedRoles, children }: RoleGuardProps) {
  const router = useRouter();
  const { user, isAuthenticated, isLoading, switchRole } = useAuth();

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-slate-500 space-y-3">
        <div className="w-10 h-10 border-4 border-teal-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-xs font-semibold text-slate-400">Loading your portal...</p>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return (
      <div className="max-w-md mx-auto my-14 p-8 bg-white rounded-3xl shadow-sm border border-slate-200 text-center space-y-4">
        <div className="w-12 h-12 bg-teal-50 text-teal-700 rounded-2xl flex items-center justify-center mx-auto">
          <Lock className="w-6 h-6" />
        </div>
        <h2 className="text-lg font-bold text-slate-900">Please Sign In First</h2>
        <p className="text-xs text-slate-500 leading-relaxed">
          Sign in to view your personalized dashboard and saved standards.
        </p>
        <Link
          href="/login"
          className="inline-block w-full py-2.5 px-4 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-bold shadow-xs transition"
        >
          Go to Sign In
        </Link>
      </div>
    );
  }

  const currentRole = user.role;
  const isAllowed = allowedRoles.includes(currentRole);

  if (!isAllowed) {
    const currentMeta = ROLE_LABELS[currentRole] || { label: currentRole, badgeColor: 'bg-slate-100 text-slate-800 border-slate-200' };

    return (
      <div className="max-w-2xl mx-auto my-10 p-8 bg-white rounded-3xl shadow-sm border border-slate-200 relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-teal-500 via-blue-500 to-indigo-500"></div>

        <div className="text-center space-y-4">
          <div className="w-14 h-14 bg-slate-100 text-slate-700 rounded-2xl flex items-center justify-center mx-auto">
            <Shield className="w-7 h-7 text-teal-700" />
          </div>

          <div>
            <span className="inline-block px-3 py-1 bg-slate-100 text-slate-700 border border-slate-200 rounded-full text-[11px] font-bold uppercase tracking-wider mb-2">
              Private Page
            </span>
            <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
              This Page is for a Different Profile
            </h2>
            <p className="text-xs text-slate-500 max-w-md mx-auto mt-1 leading-relaxed">
              Each user type has its own customized page. You are currently signed in as a <strong>{currentMeta.label}</strong>.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-200/80 text-left text-xs">
            <div className="p-3 bg-white rounded-xl border border-slate-200">
              <div className="text-[10px] uppercase font-bold text-slate-400 mb-1">Your Current Profile</div>
              <div className="flex items-center gap-2">
                <span className={`px-2.5 py-1 rounded-lg border text-xs font-bold ${currentMeta.badgeColor}`}>
                  {currentMeta.label}
                </span>
              </div>
              <div className="mt-1 text-[11px] text-slate-600 font-medium truncate">
                {user.name}
              </div>
            </div>

            <div className="p-3 bg-white rounded-xl border border-slate-200">
              <div className="text-[10px] uppercase font-bold text-slate-400 mb-1">Who Can Open This Page</div>
              <div className="flex items-center gap-1.5 flex-wrap">
                {allowedRoles.map((r) => (
                  <span key={r} className={`px-2.5 py-1 rounded-lg border text-xs font-bold ${ROLE_LABELS[r]?.badgeColor || 'bg-slate-100 text-slate-800'}`}>
                    {ROLE_LABELS[r]?.label || r}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="pt-2">
            <button
              onClick={() => router.push(`/dashboard/${currentRole}`)}
              className="px-6 py-2.5 bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold rounded-xl shadow-xs transition inline-flex items-center gap-2 cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to My Dashboard</span>
            </button>
          </div>

          <div className="pt-6 border-t border-slate-100 text-left">
            <div className="flex items-center justify-between mb-2.5">
              <div className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                <RefreshCw className="w-3.5 h-3.5 text-teal-600" />
                <span>Quick Test: Switch to an Authorized Profile</span>
              </div>
              <span className="text-[10px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                1-Click Switch
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {allowedRoles.map((roleKey) => {
                const persona = DEMO_PERSONAS[roleKey];
                if (!persona) return null;
                return (
                  <button
                    key={roleKey}
                    onClick={() => switchRole(roleKey)}
                    className="p-2.5 text-left bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl transition group flex items-start gap-2 cursor-pointer"
                  >
                    <UserCheck className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                    <div className="min-w-0">
                      <div className="text-xs font-bold text-slate-900 truncate">
                        {persona.name}
                      </div>
                      <div className="text-[10px] text-slate-500 truncate">
                        {ROLE_LABELS[roleKey]?.label}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
