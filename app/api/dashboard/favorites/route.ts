import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json([
    {
      id: 'IS-15700-2005',
      number: 'IS 15700:2005',
      title: 'Safety of Electronic Equipment - General Requirements',
      costRange: { min: 75600, max: 108000 },
      timelineDays: 90,
    },
    {
      id: 'IS-9000-2015',
      number: 'IS 9000:2015',
      title: 'Food Safety Management Systems - Requirements',
      costRange: { min: 38850, max: 55500 },
      timelineDays: 75,
    },
    {
      id: 'IS-2062-2011',
      number: 'IS 2062:2011',
      title: 'Steel for General Structural Purposes - Specification',
      costRange: { min: 18060, max: 25800 },
      timelineDays: 30,
    },
  ]);
}
