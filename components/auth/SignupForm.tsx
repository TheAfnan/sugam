'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { User, Mail, Lock, MessageSquare, ArrowRight, RefreshCw } from 'lucide-react';
import AuthInput from './AuthInput';
import { UserRole } from '@/lib/useAuth';

interface SignupFormProps {
  onSwitchToLogin: () => void;
  onShowWhatsAppToast?: (code: string) => void;
}

export default function SignupForm({ onSwitchToLogin, onShowWhatsAppToast }: SignupFormProps) {
  const router = useRouter();

  const [signupMethod, setSignupMethod] = useState<'whatsapp' | 'email'>('whatsapp');
  const [fullName, setFullName] = useState('');
  const [identifier, setIdentifier] = useState('');
  const [role, setRole] = useState<UserRole>('msme');
  const [company, setCompany] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Status
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  // Verification step
  const [isVerifying, setIsVerifying] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [activeSimulatedOtp, setActiveSimulatedOtp] = useState('');

  const validate = () => {
    const errors: Record<string, string> = {};
    if (!fullName.trim()) errors.fullName = 'Full Name is required';
    if (!identifier.trim()) errors.identifier = 'Email address or mobile number is required';
    if (signupMethod === 'whatsapp' && identifier.replace(/\D/g, '').length < 10) {
      errors.identifier = 'Please enter a valid 10-digit mobile number';
    }
    if (!password) {
      errors.password = 'Password is required';
    } else if (password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
    }
    if (password !== confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    if (!validate()) return;

    setIsLoading(true);

    // Fast WhatsApp simulation
    if (signupMethod === 'whatsapp') {
      const mockOtp = Math.floor(100000 + Math.random() * 900000).toString();
      setActiveSimulatedOtp(mockOtp);
      setIsVerifying(true);
      if (onShowWhatsAppToast) onShowWhatsAppToast(mockOtp);
      setIsLoading(false);
      return;
    }

    // Supabase Email Registration
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: fullName.trim(),
          email: identifier.trim(),
          password,
          companyName: company.trim(),
          role,
        }),
      });
      const data = await res.json();

      if (!res.ok || !data.success) {
        setErrorMsg(data.error || 'Registration failed. Please check details.');
        return;
      }

      if (data.requiresEmailConfirmation) {
        setIsVerifying(true);
        if (data.simulatedOtp) {
          setActiveSimulatedOtp(data.simulatedOtp);
          if (onShowWhatsAppToast) onShowWhatsAppToast(data.simulatedOtp);
        }
        return;
      }

      if (data.user) {
        localStorage.setItem('bis-demo-user', JSON.stringify(data.user));
        window.dispatchEvent(new Event('bis-auth-change'));
        router.push(`/dashboard/${data.user.role || 'msme'}`);
      }
    } catch {
      setErrorMsg('Unable to register. Please check your internet connection.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otpCode.trim().length < 6) {
      setErrorMsg('Please enter a valid 6-digit code');
      return;
    }

    setIsLoading(true);
    setErrorMsg('');

    try {
      const targetEmail = identifier.includes('@')
        ? identifier
        : `${identifier || 'user'}@sugam.ai`;

      const res = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: targetEmail,
          token: otpCode.trim(),
        }),
      });
      const data = await res.json();

      if (!res.ok || !data.success) {
        setErrorMsg(data.error || 'Invalid OTP code.');
        return;
      }

      if (data.user) {
        data.user.role = role;
        localStorage.setItem('bis-demo-user', JSON.stringify(data.user));
        window.dispatchEvent(new Event('bis-auth-change'));
        router.push(`/dashboard/${role}`);
      }
    } catch {
      setErrorMsg('Verification failed. Try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full">
      <div className="text-center mb-4">
        <h3 className="text-2xl font-black text-slate-900 tracking-tight">
          Create an Account
        </h3>
        <p className="text-xs text-slate-500 mt-1">
          Join SUGAM-AI for simplified BIS compliance
        </p>
      </div>

      {errorMsg && (
        <div
          className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-medium"
          role="alert"
        >
          {errorMsg}
        </div>
      )}

      {isVerifying ? (
        /* OTP Verification View */
        <div className="space-y-4">
          <div className="p-3.5 bg-blue-50 border border-blue-200 rounded-2xl text-center">
            <span className="text-[10px] font-bold uppercase tracking-wider text-blue-700 block mb-1">
              Security Verification
            </span>
            <div className="text-xs text-slate-700 font-medium">
              Enter 6-digit code sent to:
            </div>
            <div className="text-xs font-bold text-slate-900 mt-0.5">
              {identifier}
            </div>
          </div>

          <form onSubmit={handleVerifyOtp} className="space-y-4" noValidate>
            <div>
              <div className="flex items-center justify-between text-xs text-slate-600 mb-1 font-medium">
                <span>Enter 6-digit Code:</span>
                {activeSimulatedOtp && (
                  <button
                    type="button"
                    onClick={() => setOtpCode(activeSimulatedOtp)}
                    className="text-blue-600 font-bold hover:underline cursor-pointer"
                  >
                    Auto-fill: {activeSimulatedOtp}
                  </button>
                )}
              </div>
              <input
                type="text"
                maxLength={6}
                value={otpCode}
                onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ''))}
                placeholder="••••••"
                className="w-full px-4 py-3 bg-white border border-slate-300 rounded-xl text-center text-2xl font-bold tracking-widest text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600"
                autoFocus
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#1a56db] hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-xl shadow-md transition flex items-center justify-center gap-2 text-xs cursor-pointer disabled:opacity-50"
            >
              {isLoading ? 'Verifying...' : 'Verify & Enter Dashboard →'}
            </button>
          </form>

          <div className="flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-100">
            <button
              type="button"
              onClick={() => {
                const newOtp = Math.floor(100000 + Math.random() * 900000).toString();
                setActiveSimulatedOtp(newOtp);
                if (onShowWhatsAppToast) onShowWhatsAppToast(newOtp);
              }}
              className="hover:text-blue-600 flex items-center gap-1 cursor-pointer font-medium"
            >
              <RefreshCw className="w-3 h-3" /> Resend Code
            </button>
            <button
              type="button"
              onClick={() => setIsVerifying(false)}
              className="hover:text-slate-800 cursor-pointer font-medium"
            >
              Back to Form
            </button>
          </div>
        </div>
      ) : (
        /* Sign Up Form */
        <form onSubmit={handleSubmit} className="space-y-3" noValidate>
          {/* Method Switcher */}
          <div className="grid grid-cols-2 gap-1 p-1 bg-slate-100 rounded-xl text-xs font-bold mb-1">
            <button
              type="button"
              onClick={() => setSignupMethod('whatsapp')}
              className={`py-1.5 px-2 rounded-lg flex items-center justify-center gap-1.5 cursor-pointer transition ${
                signupMethod === 'whatsapp'
                  ? 'bg-emerald-600 text-white shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <MessageSquare className="w-3.5 h-3.5" /> WhatsApp OTP
            </button>
            <button
              type="button"
              onClick={() => setSignupMethod('email')}
              className={`py-1.5 px-2 rounded-lg flex items-center justify-center gap-1.5 cursor-pointer transition ${
                signupMethod === 'email'
                  ? 'bg-blue-600 text-white shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Mail className="w-3.5 h-3.5" /> Email Link / OTP
            </button>
          </div>

          {/* Full Name */}
          <AuthInput
            name="fullName"
            type="text"
            required
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="Full Name"
            icon={<User className="w-4 h-4" />}
            error={fieldErrors.fullName}
          />

          {/* Role Selector */}
          <div>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value as UserRole)}
              className="w-full px-3.5 py-3 border border-slate-300 rounded-xl text-xs font-semibold text-slate-800 focus:ring-2 focus:ring-blue-600 focus:outline-none bg-white shadow-2xs"
            >
              <option value="msme">Factory Owner (MSME 80% Fee Discount)</option>
              <option value="applicant">New Business / Startup (First-Time License)</option>
              <option value="consumer">Citizen / Consumer (Verify ISI Mark)</option>
              <option value="officer">BIS Quality Officer (Surveillance & Reviews)</option>
            </select>
          </div>

          {/* Email or WhatsApp Mobile */}
          {signupMethod === 'whatsapp' ? (
            <div className="flex gap-1.5">
              <span className="px-3 py-3 bg-slate-100 border border-slate-300 text-slate-600 font-bold text-xs rounded-xl flex items-center">
                +91
              </span>
              <div className="flex-1">
                <AuthInput
                  name="identifier"
                  type="tel"
                  required
                  maxLength={10}
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value.replace(/\D/g, ''))}
                  placeholder="WhatsApp Mobile Number"
                  error={fieldErrors.identifier}
                />
              </div>
            </div>
          ) : (
            <AuthInput
              name="identifier"
              type="email"
              required
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              placeholder="Email Address"
              icon={<Mail className="w-4 h-4" />}
              error={fieldErrors.identifier}
            />
          )}

          {/* Password */}
          <AuthInput
            name="password"
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password (min 6 characters)"
            icon={<Lock className="w-4 h-4" />}
            error={fieldErrors.password}
          />

          {/* Confirm Password */}
          <AuthInput
            name="confirmPassword"
            type="password"
            required
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirm Password"
            icon={<Lock className="w-4 h-4" />}
            error={fieldErrors.confirmPassword}
          />

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className={`w-full py-3 px-4 ${
              signupMethod === 'whatsapp'
                ? 'bg-emerald-600 hover:bg-emerald-700'
                : 'bg-[#1a56db] hover:bg-blue-700'
            } text-white font-bold rounded-xl shadow-md transition flex items-center justify-center gap-2 text-xs cursor-pointer disabled:opacity-50 mt-1`}
          >
            {isLoading ? (
              'Processing...'
            ) : signupMethod === 'whatsapp' ? (
              <>
                Send WhatsApp OTP <ArrowRight className="w-4 h-4" />
              </>
            ) : (
              <>
                Create Account <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>

          {/* Switch to Login */}
          <div className="text-center mt-3 text-xs text-slate-600">
            Already have an account?{' '}
            <button
              type="button"
              onClick={onSwitchToLogin}
              className="font-bold text-blue-600 hover:underline cursor-pointer"
            >
              Login
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
