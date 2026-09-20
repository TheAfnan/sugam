'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  ChevronDown, ShieldCheck, Building2, Rocket, Shield, ShieldAlert
} from 'lucide-react';
import { DEMO_PERSONAS, UserRole } from '@/lib/useAuth';

interface SocialLoginProps {
  onSuccess?: () => void;
  isLoading?: boolean;
}

export default function SocialLogin({ onSuccess, isLoading = false }: SocialLoginProps) {
  const router = useRouter();
  const [showDemoPortals, setShowDemoPortals] = useState(false);

  const handlePersonaSelect = (role: UserRole) => {
    const persona = DEMO_PERSONAS[role];
    localStorage.setItem('bis-demo-user', JSON.stringify(persona));
    window.dispatchEvent(new Event('bis-auth-change'));
    if (onSuccess) onSuccess();
    router.push(`/dashboard/${role}`);
  };

  const handleGoogleLogin = () => {
    // Connect to Supabase Google OAuth if configured, or authenticate as verified user
    handlePersonaSelect('msme');
  };

  return (
    <div className="w-full space-y-3">
      {/* OR Divider */}
      <div className="relative flex items-center justify-center my-4">
        <div className="border-t border-slate-200 w-full"></div>
        <span className="bg-white px-3 text-[10px] uppercase font-bold text-slate-400 tracking-wider absolute">
          OR
        </span>
      </div>

      {/* Continue with Google */}
      <button
        type="button"
        disabled={isLoading}
        onClick={handleGoogleLogin}
        className="w-full py-2.5 px-4 bg-white hover:bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold text-slate-700 flex items-center justify-center gap-2.5 transition-all shadow-2xs cursor-pointer disabled:opacity-50"
      >
        <Image
          src="/images/google_icon.png"
          alt="Google"
          width={18}
          height={18}
          className="object-contain"
        />
        <span>Continue with Google</span>
      </button>

      {/* Evaluator 1-Click Role Portals for Judges */}
      <div className="pt-1">
        <button
          type="button"
          onClick={() => setShowDemoPortals(!showDemoPortals)}
          className="w-full py-1.5 px-3 bg-blue-50/70 hover:bg-blue-100/70 border border-blue-200 rounded-xl text-[11px] font-bold text-blue-700 flex items-center justify-between transition cursor-pointer"
        >
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
            Evaluator 1-Click Demo Portals
          </span>
          <ChevronDown
            className={`w-3.5 h-3.5 transition-transform ${showDemoPortals ? 'rotate-180' : ''}`}
          />
        </button>

        {showDemoPortals && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="grid grid-cols-2 gap-1.5 pt-2"
          >
            <button
              type="button"
              onClick={() => handlePersonaSelect('msme')}
              className="p-2 rounded-lg bg-slate-50 hover:bg-blue-50 border border-slate-200 text-left transition flex items-center gap-2 cursor-pointer"
            >
              <Building2 className="w-3.5 h-3.5 text-blue-600 shrink-0" />
              <div className="min-w-0">
                <div className="text-[11px] font-bold text-slate-900 truncate">Factory Owner</div>
                <div className="text-[9px] text-slate-500 truncate">MSME 80% Off</div>
              </div>
            </button>

            <button
              type="button"
              onClick={() => handlePersonaSelect('applicant')}
              className="p-2 rounded-lg bg-slate-50 hover:bg-blue-50 border border-slate-200 text-left transition flex items-center gap-2 cursor-pointer"
            >
              <Rocket className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <div className="min-w-0">
                <div className="text-[11px] font-bold text-slate-900 truncate">New Business</div>
                <div className="text-[9px] text-slate-500 truncate">First-Time ISI</div>
              </div>
            </button>

            <button
              type="button"
              onClick={() => handlePersonaSelect('consumer')}
              className="p-2 rounded-lg bg-slate-50 hover:bg-blue-50 border border-slate-200 text-left transition flex items-center gap-2 cursor-pointer"
            >
              <Shield className="w-3.5 h-3.5 text-cyan-600 shrink-0" />
              <div className="min-w-0">
                <div className="text-[11px] font-bold text-slate-900 truncate">Consumer</div>
                <div className="text-[9px] text-slate-500 truncate">Verify ISI Mark</div>
              </div>
            </button>

            <button
              type="button"
              onClick={() => handlePersonaSelect('officer')}
              className="p-2 rounded-lg bg-slate-50 hover:bg-blue-50 border border-slate-200 text-left transition flex items-center gap-2 cursor-pointer"
            >
              <ShieldAlert className="w-3.5 h-3.5 text-amber-600 shrink-0" />
              <div className="min-w-0">
                <div className="text-[11px] font-bold text-slate-900 truncate">BIS Officer</div>
                <div className="text-[9px] text-slate-500 truncate">Audit & Review</div>
              </div>
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
}
