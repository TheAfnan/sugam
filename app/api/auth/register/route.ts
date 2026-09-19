import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, password, companyName, companyType, role = 'msme' } = body;

    if (!name || !email || !password) {
      return NextResponse.json(
        { success: false, error: 'Name, email, and password are required' },
        { status: 400 }
      );
    }

    const normalizedEmail = email.toLowerCase().trim();

    // 1. Try Supabase signUp
    let supabaseUserId: string | null = null;
    try {
      const supabase = await createClient();
      const { data, error } = await supabase.auth.signUp({
        email: normalizedEmail,
        password,
        options: {
          data: {
            full_name: name,
            name,
            companyName: companyName || 'My Enterprise',
            companyType: companyType || 'Enterprise',
            role,
          },
        },
      });

      if (error) {
        console.warn('Supabase signUp error (falling back gracefully):', error.message);
      } else if (data?.user) {
        supabaseUserId = data.user.id;
      }
    } catch (sbErr) {
      console.warn('Supabase signUp exception:', sbErr);
    }

    const user = {
      id: supabaseUserId || 'user-' + Date.now(),
      email: normalizedEmail,
      name,
      role: role || 'msme',
      companyName: companyName || 'My Enterprise',
      companyType: companyType || 'individual',
      industry: 'General',
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
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
