import { NextRequest, NextResponse } from 'next/server';

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

    // Accept demo credentials or any test account
    const isDemo = email.toLowerCase() === 'demo@bis-assistant.com' || email.toLowerCase() === 'demo@sugam.ai';
    const isPasswordValid = password === 'demo123' || password.length >= 6;

    if (isDemo || isPasswordValid) {
      const name = isDemo ? 'Demo User' : email.split('@')[0].replace('.', ' ');
      const user = {
        id: '1',
        email,
        name: name.charAt(0).toUpperCase() + name.slice(1),
        role: 'user',
        companyName: 'Bharat Standards Manufacturing Corp.',
        companyType: 'msme',
        industry: 'Electronics',
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
