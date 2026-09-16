import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    totalChats: 18,
    standardsExplored: 16,
    savedStandards: 3,
    lastActivity: 'Today',
  });
}
