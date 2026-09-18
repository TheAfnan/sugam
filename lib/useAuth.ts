'use client';

import { useState, useEffect } from 'react';

export type UserRole = 'msme' | 'applicant' | 'consumer' | 'officer' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  designation?: string;
  companyName?: string;
  companyType?: string;
  cmNumber?: string;
  udyamNumber?: string;
}

export const DEMO_PERSONAS: Record<UserRole, User> = {
  msme: {
    id: 'user-msme-01',
    name: 'Rajesh Sharma',
    email: 'msme@sugam.ai',
    role: 'msme',
    designation: 'Managing Director',
    companyName: 'Bharat Precision Fasteners Pvt Ltd',
    companyType: 'Small Enterprise',
    cmNumber: 'CM/L-8400174109',
    udyamNumber: 'UDYAM-DL-01-0029481',
  },
  applicant: {
    id: 'user-app-02',
    name: 'Aanya Verma',
    email: 'applicant@sugam.ai',
    role: 'applicant',
    designation: 'Co-Founder & CEO',
    companyName: 'NexGen AgroTech Innovations',
    companyType: 'Startup / Micro Unit',
    udyamNumber: 'UDYAM-UP-02-0089123',
  },
  consumer: {
    id: 'user-cons-03',
    name: 'Pooja Iyer',
    email: 'consumer@sugam.ai',
    role: 'consumer',
    designation: 'Aware Citizen & Consumer',
  },
  officer: {
    id: 'user-off-04',
    name: 'Dr. Vikram Malhotra',
    email: 'officer@bis.gov.in',
    role: 'officer',
    designation: 'Scientist-E & Joint Director (Surveillance)',
    companyName: 'Bureau of Indian Standards',
  },
  admin: {
    id: 'user-adm-05',
    name: 'System Admin',
    email: 'admin@sugam.ai',
    role: 'admin',
    designation: 'National Portal Administrator',
  },
};

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const loadUser = () => {
    try {
      const stored = window.localStorage.getItem('bis-demo-user');
      if (stored) {
        setUser(JSON.parse(stored));
      } else {
        setUser(null);
      }
    } catch (e) {
      console.error('Failed to restore local authentication:', e);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadUser();

    const handleStorageChange = () => {
      loadUser();
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('bis-auth-change', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('bis-auth-change', handleStorageChange);
    };
  }, []);

  const loginAsPersona = (role: UserRole) => {
    const persona = DEMO_PERSONAS[role] || DEMO_PERSONAS.msme;
    window.localStorage.setItem('bis-demo-user', JSON.stringify(persona));
    setUser(persona);
    window.dispatchEvent(new Event('bis-auth-change'));
    return persona;
  };

  const switchRole = (role: UserRole) => {
    const updated = loginAsPersona(role);
    window.location.href = `/dashboard/${role}`;
    return updated;
  };

  const logout = () => {
    window.localStorage.removeItem('bis-demo-user');
    setUser(null);
    window.dispatchEvent(new Event('bis-auth-change'));
    window.location.href = '/login';
  };

  return {
    user,
    role: user?.role || null,
    isAuthenticated: user !== null,
    loading: isLoading,
    isLoading,
    loginAsPersona,
    switchRole,
    logout,
  };
}
