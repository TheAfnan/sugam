'use client';

import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

interface AuthInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  icon?: React.ReactNode;
  error?: string;
}

export default function AuthInput({
  label,
  icon,
  error,
  type = 'text',
  className = '',
  id,
  ...props
}: AuthInputProps) {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === 'password';
  const inputId = id || props.name || Math.random().toString(36).substring(7);

  return (
    <div className="w-full space-y-1">
      {label && (
        <label
          htmlFor={inputId}
          className="block text-xs font-semibold text-slate-700"
        >
          {label}
        </label>
      )}

      <div className="relative rounded-xl shadow-2xs">
        {icon && (
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            {icon}
          </div>
        )}

        <input
          id={inputId}
          type={isPassword ? (showPassword ? 'text' : 'password') : type}
          className={`w-full py-3 text-xs sm:text-sm text-slate-900 border rounded-xl placeholder-slate-400 bg-white transition-all
            ${icon ? 'pl-10' : 'pl-3.5'}
            ${isPassword ? 'pr-10' : 'pr-3.5'}
            ${error ? 'border-red-400 focus:ring-2 focus:ring-red-400 focus:border-red-400' : 'border-slate-300 focus:ring-2 focus:ring-blue-600 focus:border-blue-600'}
            focus:outline-none disabled:bg-slate-50 disabled:text-slate-500
            ${className}`}
          {...props}
        />

        {isPassword && (
          <button
            type="button"
            aria-label={showPassword ? 'Hide password' : 'Show password'}
            onClick={() => setShowPassword(!showPassword)}
            className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 focus:outline-none cursor-pointer"
          >
            {showPassword ? (
              <EyeOff className="w-4 h-4" aria-hidden="true" />
            ) : (
              <Eye className="w-4 h-4" aria-hidden="true" />
            )}
          </button>
        )}
      </div>

      {error && (
        <p className="text-[11px] text-red-600 font-medium mt-1" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
