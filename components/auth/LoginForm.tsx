'use client';

import React, { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Mail, Lock, ArrowRight } from 'lucide-react';
import AuthInput from './AuthInput';
import SocialLogin from './SocialLogin';

interface LoginFormProps {
  onSwitchToSignup: () => void;
  onForgotPassword: () => void;
}

export default function LoginForm({ onSwitchToSignup, onForgotPassword }: LoginFormProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [identifier, setIdentifier] = useState('msme@sugam.ai');
  const [password, setPassword] = useState('demo123');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!identifier.trim() || !password) {
      setErrorMsg('Please enter your email or mobile and password.');
      return;
    }

    setIsLoading(true);
    setErrorMsg('');

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: identifier.trim(),
          password,
        }),
      });
      const data = await res.json();

      if (!res.ok || !data.success) {
        setErrorMsg(data.error || 'Invalid credentials. Please verify your details.');
        return;
      }

      // Store authenticated user and broadcast auth change
      localStorage.setItem('bis-demo-user', JSON.stringify(data.user));
      window.dispatchEvent(new Event('bis-auth-change'));

      const role = data.user?.role || 'msme';
      const next = searchParams.get('next') || `/dashboard/${role}`;
      router.push(next);
    } catch {
      setErrorMsg('Connection error. Please check your internet connection.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full">
      <div className="text-center mb-5">
        <h3 className="text-2xl font-black text-slate-900 tracking-tight">
          Welcome Back
        </h3>
        <p className="text-xs text-slate-500 mt-1">
          Login to continue with SUGAM-AI
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

      <form onSubmit={handleSubmit} className="space-y-3.5" noValidate>
        {/* Email or Mobile */}
        <AuthInput
          name="identifier"
          type="text"
          required
          value={identifier}
          onChange={(e) => setIdentifier(e.target.value)}
          placeholder="Email address / Mobile number"
          icon={<Mail className="w-4 h-4" />}
          autoComplete="username"
        />

        {/* Password */}
        <AuthInput
          name="password"
          type="password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          icon={<Lock className="w-4 h-4" />}
          autoComplete="current-password"
        />

        {/* Forgot password */}
        <div className="flex justify-end">
          <button
            type="button"
            onClick={onForgotPassword}
            className="text-xs font-semibold text-blue-600 hover:underline cursor-pointer"
          >
            Forgot password?
          </button>
        </div>

        {/* Primary Login Button */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-[#1a56db] hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-xl shadow-md transition-all flex items-center justify-center gap-2 text-sm cursor-pointer disabled:opacity-50"
        >
          {isLoading ? (
            'Logging in...'
          ) : (
            <>
              Login <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </form>

      {/* Social Login (Google only, No DigiLocker) */}
      <SocialLogin isLoading={isLoading} />

      {/* Switch to Sign Up */}
      <div className="text-center mt-4 text-xs text-slate-600">
        New to SUGAM-AI?{' '}
        <button
          type="button"
          onClick={onSwitchToSignup}
          className="font-bold text-blue-600 hover:underline cursor-pointer"
        >
          Create an account
        </button>
      </div>
    </div>
  );
}
