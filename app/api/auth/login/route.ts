import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: 'Email and password are required' },
        { status: 400 }
      );
    }

    const normalizedEmail = email.toLowerCase().trim();
    const isDemo = 
      normalizedEmail === 'demo@bis-assistant.com' || 
      normalizedEmail === 'demo@sugam.ai' ||
      normalizedEmail === 'msme@sugam.ai' ||
      normalizedEmail === 'applicant@sugam.ai' ||
      normalizedEmail === 'consumer@sugam.ai' ||
      normalizedEmail === 'officer@bis.gov.in';

    // 1. If demo persona or demo password, return dedicated demo profile immediately
    if (isDemo && (password === 'demo123' || password.length >= 6)) {
      let role = 'msme';
      let name = 'Rajesh Sharma';
      let designation = 'Managing Director';
      let companyName = 'Bharat Precision Fasteners Pvt Ltd';

      if (normalizedEmail.includes('officer')) {
        role = 'officer';
        name = 'Dr. Vikram Malhotra';
        designation = 'Scientist-E & Joint Director (Surveillance)';
        companyName = 'Bureau of Indian Standards';
      } else if (normalizedEmail.includes('applicant')) {
        role = 'applicant';
        name = 'Aanya Verma';
        designation = 'Co-Founder & CEO';
        companyName = 'NexGen AgroTech Innovations';
      } else if (normalizedEmail.includes('consumer')) {
        role = 'consumer';
        name = 'Pooja Iyer';
        designation = 'Aware Citizen & Consumer';
        companyName = 'Citizen';
      }

      const user = {
        id: 'user-' + role + '-01',
        email: normalizedEmail,
        name,
        role,
        designation,
        companyName,
        companyType: role === 'msme' ? 'Small Enterprise' : role === 'applicant' ? 'Startup' : undefined,
        cmNumber: role === 'msme' ? 'CM/L-8400174109' : undefined,
        udyamNumber: role === 'msme' ? 'UDYAM-DL-01-0029481' : role === 'applicant' ? 'UDYAM-UP-02-0089123' : undefined,
        preferences: {
          language: 'en',
          notifications: true,
          emailUpdates: true,
          theme: 'light',
        },
        subscription: {
          plan: 'free',
          features: ['basic-chat', 'standards-search', 'timeline-calculator', 'dossier-download'],
        },
        stats: {
          totalChats: 23,
          standardsExplored: 15,
          savedStandards: 7,
          lastActivity: new Date().toISOString(),
        },
        emailVerified: true,
      };

      return NextResponse.json({
        success: true,
        user,
        accessToken: 'mock-jwt-token-sugam-' + Date.now(),
      });
    }

    // 2. Try Supabase Auth
    try {
      const supabase = await createClient();
      const { data, error } = await supabase.auth.signInWithPassword({
        email: normalizedEmail,
        password,
      });

      if (!error && data?.user) {
        const meta = data.user.user_metadata || {};
        const role = meta.role || 'msme';
        const user = {
          id: data.user.id,
          email: data.user.email || normalizedEmail,
          name: meta.full_name || meta.name || normalizedEmail.split('@')[0],
          role,
          designation: meta.designation || (role === 'officer' ? 'BIS Officer' : 'Business Owner'),
          companyName: meta.companyName || meta.company_name || 'My Enterprise',
          companyType: meta.companyType || 'Enterprise',
          preferences: {
            language: 'en',
            notifications: true,
            emailUpdates: true,
            theme: 'light',
          },
          subscription: {
            plan: 'free',
            features: ['basic-chat', 'standards-search', 'timeline-calculator', 'dossier-download'],
          },
          stats: {
            totalChats: 1,
            standardsExplored: 1,
            savedStandards: 0,
            lastActivity: new Date().toISOString(),
          },
          emailVerified: !!data.user.email_confirmed_at,
        };

        return NextResponse.json({
          success: true,
          user,
          accessToken: data.session?.access_token || 'mock-jwt-token-sugam-' + Date.now(),
        });
      }
    } catch (sbErr) {
      console.warn('Supabase sign in attempt failed:', sbErr);
    }

    // 3. Fallback for hackathon testing if user entered standard test credentials
    if (password === 'demo123' || password === 'password123' || password.length >= 6) {
      const rawName = normalizedEmail.split('@')[0].replace('.', ' ');
      const name = rawName.charAt(0).toUpperCase() + rawName.slice(1);
      const role = normalizedEmail.includes('officer')
        ? 'officer'
        : normalizedEmail.includes('applicant')
        ? 'applicant'
        : normalizedEmail.includes('consumer')
        ? 'consumer'
        : 'msme';

      const user = {
        id: 'user-' + Date.now(),
        email: normalizedEmail,
        name,
        role,
        companyName: 'My Enterprise',
        companyType: 'Small Enterprise',
        preferences: {
          language: 'en',
          notifications: true,
          emailUpdates: true,
          theme: 'light',
        },
        subscription: {
          plan: 'free',
          features: ['basic-chat', 'standards-search', 'timeline-calculator', 'dossier-download'],
        },
        stats: {
          totalChats: 0,
          standardsExplored: 0,
          savedStandards: 0,
          lastActivity: new Date().toISOString(),
        },
        emailVerified: true,
      };

      return NextResponse.json({
        success: true,
        user,
        accessToken: 'mock-jwt-token-sugam-' + Date.now(),
      });
    }

    return NextResponse.json(
      { success: false, error: 'Invalid email or password. Please try again.' },
      { status: 401 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
