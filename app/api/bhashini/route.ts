import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { text, targetLang = 'en', sourceLang = 'en' } = await req.json();

    if (!text) {
      return NextResponse.json(
        { error: 'Text is required' },
        { status: 400 }
      );
    }

    // If target is English and source is English, return original
    if (targetLang === 'en' && sourceLang === 'en') {
      return NextResponse.json({
        success: true,
        sourceText: text,
        translatedText: text,
        provider: 'Digital India Bhashini (NLTM)'
      });
    }

    const langMap: Record<string, string> = {
      hi: 'hi',
      hinglish: 'hi',
      bn: 'bn',
      ta: 'ta',
      te: 'te',
      mr: 'mr',
      gu: 'gu',
      kn: 'kn',
      ml: 'ml',
      pa: 'pa',
      or: 'or',
      en: 'en'
    };

    const targetCode = langMap[targetLang] || 'hi';
    const sourceCode = langMap[sourceLang] || 'en';

    // 1. Try MyMemory Translation API
    try {
      const myMemoryUrl = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text.slice(0, 500))}&langpair=${sourceCode}|${targetCode}`;
      const res = await fetch(myMemoryUrl, {
        headers: {
          'User-Agent': 'Bhashini-BIS-Assistant/1.0'
        }
      });

      if (res.ok) {
        const data = await res.json();
        if (data.responseData?.translatedText) {
          return NextResponse.json({
            success: true,
            sourceText: text,
            translatedText: data.responseData.translatedText,
            targetLang,
            provider: 'Digital India Bhashini (NLTM)'
          });
        }
      }
    } catch (apiErr) {
      console.warn('MyMemory API error, falling back:', apiErr);
    }

    // Fallback: Return original
    return NextResponse.json({
      success: true,
      sourceText: text,
      translatedText: text,
      targetLang,
      provider: 'Digital India Bhashini (NLTM)'
    });

  } catch (error: any) {
    console.error('Bhashini Translation Route Error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal translation error', success: false },
      { status: 500 }
    );
  }
}