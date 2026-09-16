import { NextRequest, NextResponse } from 'next/server';

const CATEGORY_MAP: Record<string, { baseDays: number; baseCost: number; stdNumber: string; stdTitle: string }> = {
  Electronics: { baseDays: 60, baseCost: 25000, stdNumber: 'IS 13252:2010', stdTitle: 'Information Technology Equipment - Safety' },
  Food: { baseDays: 35, baseCost: 15000, stdNumber: 'IS 9000:2015', stdTitle: 'Food Safety Management Systems' },
  Textiles: { baseDays: 42, baseCost: 12000, stdNumber: 'IS 15700:2005', stdTitle: 'Textiles - Quality Specifications' },
  Steel: { baseDays: 75, baseCost: 35000, stdNumber: 'IS 2062:2011', stdTitle: 'Steel for General Structural Purposes' },
  Construction: { baseDays: 90, baseCost: 45000, stdNumber: 'IS 456:2000', stdTitle: 'Plain and Reinforced Concrete - Code of Practice' },
  Automotive: { baseDays: 65, baseCost: 30000, stdNumber: 'IS 14220:1994', stdTitle: 'Automotive Safety Components' },
  Medical: { baseDays: 120, baseCost: 60000, stdNumber: 'IS 13450:2018', stdTitle: 'Medical Electrical Equipment Safety' },
  Furniture: { baseDays: 45, baseCost: 10000, stdNumber: 'IS 1811:2021', stdTitle: 'Office Furniture Specifications and Test Methods' },
  Chemical: { baseDays: 55, baseCost: 20000, stdNumber: 'IS 101:2018', stdTitle: 'Methods of Sampling and Test for Paints & Chemicals' },
  Agriculture: { baseDays: 85, baseCost: 40000, stdNumber: 'IS 4931:1997', stdTitle: 'Agricultural Equipment Standards' },
};

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { category = 'Electronics', complexity = 'medium', urgency = 'normal', companyType = 'msme' } = body;

    const catData = CATEGORY_MAP[category] || CATEGORY_MAP.Electronics;

    let complexityMult = 1.0;
    if (complexity === 'simple') complexityMult = 0.8;
    if (complexity === 'complex') complexityMult = 1.4;

    let urgencyMult = 1.0;
    if (urgency === 'priority') urgencyMult = 0.75;
    if (urgency === 'fast-track') urgencyMult = 0.55;

    let costMult = complexityMult;
    if (urgency === 'priority') costMult *= 1.25;
    if (urgency === 'fast-track') costMult *= 1.6;
    if (companyType === 'msme') costMult *= 0.8; // 20% MSME concession

    const baseD = catData.baseDays * complexityMult * urgencyMult;
    const phase1Days = Math.max(7, Math.round(baseD * 0.18));
    const phase2Days = Math.max(15, Math.round(baseD * 0.48));
    const phase3Days = Math.max(7, Math.round(baseD * 0.22));
    const phase4Days = Math.max(5, Math.round(baseD * 0.12));
    const totalDays = phase1Days + phase2Days + phase3Days + phase4Days;

    const baseC = catData.baseCost * costMult;
    const appFee = 4000;
    const testCharges = Math.round(baseC * 0.65 / 100) * 100;
    const inspFee = Math.round(baseC * 0.25 / 100) * 100;
    const certFee = Math.round(baseC * 0.1 / 100) * 100;
    const totalCost = appFee + testCharges + inspFee + certFee;

    const results = {
      standard: {
        id: catData.stdNumber.replace(/\s+/g, '-').replace(':', '-'),
        number: catData.stdNumber,
        title: catData.stdTitle,
      },
      timeline: [
        {
          phase: 1,
          name: { en: 'Application & Documentation', hi: 'आवेदन एवं दस्तावेज़ीकरण' },
          days: phase1Days,
          description: { en: `${Math.round(phase1Days * 0.8)}-${phase1Days} days`, hi: `${Math.round(phase1Days * 0.8)}-${phase1Days} दिन` },
          status: 'pending',
        },
        {
          phase: 2,
          name: { en: 'Product Testing', hi: 'उत्पाद परीक्षण' },
          days: phase2Days,
          description: { en: `${Math.round(phase2Days * 0.8)}-${phase2Days} days`, hi: `${Math.round(phase2Days * 0.8)}-${phase2Days} दिन` },
          status: 'pending',
        },
        {
          phase: 3,
          name: { en: 'Factory Inspection', hi: 'कारखाना निरीक्षण' },
          days: phase3Days,
          description: { en: `${Math.round(phase3Days * 0.8)}-${phase3Days} days`, hi: `${Math.round(phase3Days * 0.8)}-${phase3Days} दिन` },
          status: 'pending',
        },
        {
          phase: 4,
          name: { en: 'Certification Decision', hi: 'प्रमाणन निर्णय' },
          days: phase4Days,
          description: { en: `${Math.round(phase4Days * 0.8)}-${phase4Days} days`, hi: `${Math.round(phase4Days * 0.8)}-${phase4Days} दिन` },
          status: 'pending',
        },
      ],
      totalDays,
      totalCost,
      costBreakdown: [
        {
          item: { en: 'Application Fee', hi: 'आवेदन शुल्क' },
          amount: appFee,
          required: true,
        },
        {
          item: { en: 'Testing Charges', hi: 'परीक्षण शुल्क' },
          amount: testCharges,
          required: true,
        },
        {
          item: { en: 'Inspection Fee', hi: 'निरीक्षण शुल्क' },
          amount: inspFee,
          required: true,
        },
        {
          item: { en: 'Certificate Fee', hi: 'प्रमाणपत्र शुल्क' },
          amount: certFee,
          required: true,
        },
      ],
    };

    return NextResponse.json({ success: true, results });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}
