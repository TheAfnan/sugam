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

    const normalizedEmail = email.toLowerCase();
    const isDemo = 
      normalizedEmail === 'demo@bis-assistant.com' || 
      normalizedEmail === 'demo@sugam.ai' ||
      normalizedEmail === 'msme@sugam.ai' ||
      normalizedEmail === 'applicant@sugam.ai' ||
      normalizedEmail === 'consumer@sugam.ai' ||
      normalizedEmail === 'officer@bis.gov.in';

    const isPasswordValid = password === 'demo123' || password.length >= 6;

    if (isDemo || isPasswordValid) {
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
      } else if (!isDemo) {
        const rawName = email.split('@')[0].replace('.', ' ');
        name = rawName.charAt(0).toUpperCase() + rawName.slice(1);
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
