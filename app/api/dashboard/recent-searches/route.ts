import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json([
    {
      id: '1',
      query: 'IS 15700 electronic safety',
      resultsCount: 12,
      timestamp: '2 hours ago',
    },
    {
      id: '2',
      query: 'food safety standards',
      resultsCount: 28,
      timestamp: '1 day ago',
    },
    {
      id: '3',
      query: 'textile quality requirements',
      resultsCount: 15,
      timestamp: '2 days ago',
    },
    {
      id: '4',
      query: 'steel structural standards',
      resultsCount: 22,
      timestamp: '3 days ago',
    },
  ]);
}
