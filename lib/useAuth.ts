'use client';

import { useState, useEffect } from 'react';

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  companyName?: string;
  companyType?: string;
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem('bis-demo-user');
      if (stored) {
        setUser(JSON.parse(stored));
      }
    } catch (e) {
      console.error('Failed to restore local authentication:', e);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = () => {
    window.localStorage.removeItem('bis-demo-user');
    setUser(null);
    window.location.href = '/';
  };

  return {
    user,
    isAuthenticated: user !== null,
    loading: isLoading,
    isLoading,
    logout,
  };
}
