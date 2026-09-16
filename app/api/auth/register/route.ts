import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, password, companyName, companyType } = body;

    if (!name || !email || !password) {
      return NextResponse.json(
        { success: false, error: 'Name, email, and password are required' },
        { status: 400 }
      );
    }

    const user = {
      id: Date.now().toString(),
      email,
      name,
      role: 'user',
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
        features: ['basic-chat', 'standards-search', 'timeline-calculator'],
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
