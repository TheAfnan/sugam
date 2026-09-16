import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

function getStandardsData() {
  const filePath = path.join(process.cwd(), 'public', 'data', 'standards.json');
  const fileContent = fs.readFileSync(filePath, 'utf8');
  return JSON.parse(fileContent).standards || [];
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action');
    const category = searchParams.get('category');
    const industry = searchParams.get('industry');
    const query = searchParams.get('q');

    const standards = getStandardsData();

    if (action === 'stats') {
      const categories = [...new Set(standards.map((s: any) => s.category))];
      return NextResponse.json({
        total_standards: standards.length,
        total_categories: categories.length,
        categories,
      });
    }

    if (action === 'categories') {
      const categories = [...new Set(standards.map((s: any) => s.category))];
      return NextResponse.json({
        categories,
        total_categories: categories.length,
      });
    }

    if (action === 'search' || query) {
      const q = (query || '').toLowerCase().trim();
      const results = standards.filter((s: any) => {
        const num = (s.number || s.id || '').toLowerCase();
        const enTitle = (s.title?.en || '').toLowerCase();
        const keywords = (s.keywords || []).map((k: string) => k.toLowerCase());
        const cat = (s.category || '').toLowerCase();
        return num.includes(q) || enTitle.includes(q) || cat.includes(q) || keywords.some((k: string) => k.includes(q));
      });
      return NextResponse.json({
        query: q,
        results,
        total_results: results.length,
      });
    }

    if (category) {
      const filtered = standards.filter(
        (s: any) => (s.category || '').toLowerCase() === category.toLowerCase()
      );
      return NextResponse.json({
        category,
        standards: filtered,
        total: filtered.length,
      });
    }

    if (industry) {
      const filtered = standards.filter((s: any) =>
        (s.industries || []).some((ind: string) => ind.toLowerCase() === industry.toLowerCase())
      );
      return NextResponse.json({
        industry,
        standards: filtered,
        total: filtered.length,
      });
    }

    return NextResponse.json({
      message: 'BIS Standards API',
      total_standards: standards.length,
      categories: 14,
      endpoints: {
        stats: '/api/standards?action=stats',
        categories: '/api/standards?action=categories',
        search: '/api/standards?action=search&q=your_query',
        by_category: '/api/standards?category=category_name',
        by_industry: '/api/standards?industry=industry_name',
      },
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
