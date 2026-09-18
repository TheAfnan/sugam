'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ShieldAlert, Lock, ArrowLeft, RefreshCw, UserCheck } from 'lucide-react';
import { useAuth, UserRole, DEMO_PERSONAS } from '@/lib/useAuth';

interface RoleGuardProps {
  allowedRoles: UserRole[];
  children: React.ReactNode;
}

const ROLE_LABELS: Record<UserRole, { label: string; badgeColor: string }> = {
  msme: { label: 'MSME Manufacturer', badgeColor: 'bg-amber-100 text-amber-800 border-amber-300' },
  applicant: { label: 'First-Time Applicant', badgeColor: 'bg-blue-100 text-blue-800 border-blue-300' },
  consumer: { label: 'Consumer / Citizen', badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-300' },
  officer: { label: 'BIS Technical Officer', badgeColor: 'bg-purple-100 text-purple-800 border-purple-300' },
  admin: { label: 'Portal Administrator', badgeColor: 'bg-red-100 text-red-800 border-red-300' },
};

export default function RoleGuard({ allowedRoles, children }: RoleGuardProps) {
  const router = useRouter();
  const { user, isAuthenticated, isLoading, switchRole } = useAuth();

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-gray-500 space-y-3">
        <div className="w-10 h-10 border-4 border-teal-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-xs font-semibold tracking-wide uppercase text-gray-400">Verifying Role Clearance...</p>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return (
      <div className="max-w-md mx-auto my-12 p-8 bg-white rounded-2xl shadow-xl border border-gray-100 text-center space-y-4">
        <div className="w-14 h-14 bg-red-50 text-red-600 rounded-2xl flex items-center justify-center mx-auto shadow-sm">
          <Lock className="w-7 h-7" />
        </div>
        <h2 className="text-xl font-bold text-gray-900">Authentication Required</h2>
        <p className="text-xs text-gray-500 leading-relaxed">
          Please sign in with your authorized credentials to access this protected BIS portal.
        </p>
        <Link
          href="/login"
          className="inline-block w-full py-2.5 px-4 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-semibold shadow-sm transition-all"
        >
          Sign In Now
        </Link>
      </div>
    );
  }

  const currentRole = user.role;
  const isAllowed = allowedRoles.includes(currentRole);

  if (!isAllowed) {
    const currentMeta = ROLE_LABELS[currentRole] || { label: currentRole, badgeColor: 'bg-gray-100 text-gray-800 border-gray-300' };

    return (
      <div className="max-w-2xl mx-auto my-10 p-8 bg-white rounded-3xl shadow-xl border-2 border-red-100 relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-red-500 via-amber-500 to-red-600"></div>

        <div className="text-center space-y-4">
          <div className="w-16 h-16 bg-red-100 text-red-600 rounded-3xl flex items-center justify-center mx-auto shadow-md shadow-red-500/10">
            <ShieldAlert className="w-8 h-8 stroke-[2.2]" />
          </div>

          <div>
            <span className="inline-block px-3 py-1 bg-red-50 border border-red-200 text-red-700 rounded-full text-[11px] font-extrabold uppercase tracking-wider mb-2">
              Strict Role Isolation Active
            </span>
            <h2 className="text-2xl font-black text-gray-900 tracking-tight">
              Access Denied: Restricted Portal
            </h2>
            <p className="text-xs text-gray-500 max-w-lg mx-auto mt-2 leading-relaxed">
              Under Bureau of Indian Standards (BIS) governance protocol, cross-persona access between regulated manufacturers, applicants, enforcement officers, and citizens is strictly isolated.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-200 text-left text-xs">
            <div className="p-3 bg-white rounded-xl border border-slate-200/80 shadow-2xs">
              <div className="text-[10px] uppercase font-bold text-slate-400 mb-1">Your Active Role</div>
              <div className="flex items-center gap-2">
                <span className={`px-2.5 py-1 rounded-lg border text-xs font-bold ${currentMeta.badgeColor}`}>
                  {currentMeta.label}
                </span>
              </div>
              <div className="mt-1 text-[11px] text-gray-600 font-medium truncate">
                {user.name} ({user.email})
              </div>
            </div>

            <div className="p-3 bg-white rounded-xl border border-slate-200/80 shadow-2xs">
              <div className="text-[10px] uppercase font-bold text-slate-400 mb-1">Clearance Required</div>
              <div className="flex items-center gap-1.5 flex-wrap">
                {allowedRoles.map((r) => (
                  <span key={r} className={`px-2.5 py-1 rounded-lg border text-xs font-bold ${ROLE_LABELS[r]?.badgeColor || 'bg-blue-50 text-blue-800 border-blue-200'}`}>
                    {ROLE_LABELS[r]?.label || r}
                  </span>
                ))}
              </div>
              <div className="mt-1 text-[11px] text-red-600 font-semibold">
                ❌ Unauthorized for your active persona
              </div>
            </div>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={() => router.push(`/dashboard/${currentRole}`)}
              className="w-full sm:w-auto px-5 py-2.5 bg-slate-900 hover:bg-black text-white text-xs font-bold rounded-xl shadow-sm transition flex items-center justify-center gap-2 cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Return to My Allowed Portal</span>
            </button>
          </div>

          <div className="pt-6 border-t border-slate-100 text-left">
            <div className="flex items-center justify-between mb-3">
              <div className="text-xs font-bold text-gray-800 flex items-center gap-1.5">
                <RefreshCw className="w-3.5 h-3.5 text-teal-600" />
                <span>SIH Demo Mode: Test This Portal Instantly</span>
              </div>
              <span className="text-[10px] font-semibold text-teal-700 bg-teal-50 px-2 py-0.5 rounded-md border border-teal-200">
                1-Click Switcher
              </span>
            </div>
            <p className="text-[11px] text-gray-500 mb-3">
              Switch to one of the authorized roles below to experience this portal with live mock data:
            </p>
            <div className="grid grid-cols-2 gap-2">
              {allowedRoles.map((roleKey) => {
                const persona = DEMO_PERSONAS[roleKey];
                if (!persona) return null;
                return (
                  <button
                    key={roleKey}
                    onClick={() => switchRole(roleKey)}
                    className="p-2.5 text-left bg-teal-50/60 hover:bg-teal-100/70 border border-teal-200 rounded-xl transition group flex items-start gap-2 cursor-pointer"
                  >
                    <UserCheck className="w-4 h-4 text-teal-700 shrink-0 mt-0.5" />
                    <div className="min-w-0">
                      <div className="text-xs font-bold text-teal-900 group-hover:text-teal-950 truncate">
                        {persona.name}
                      </div>
                      <div className="text-[10px] text-teal-700 truncate">
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
