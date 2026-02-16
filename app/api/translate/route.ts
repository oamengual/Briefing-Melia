import { NextRequest, NextResponse } from 'next/server';

import translate from 'google-translate-api-x';

export async function POST(req: NextRequest) {
    try {
        const { text, targetLang } = await req.json();
        console.log(`Translation Request: '${text}' to '${targetLang}'`);

        if (!text || !targetLang) {
            return NextResponse.json({ error: 'Missing parameters' }, { status: 400 });
        }

        // Map standardized 'zh' to Google Translate compatible 'zh-CN'
        const apiTargetLang = targetLang === 'zh' ? 'zh-CN' : targetLang;

        const res = await translate(text, { to: apiTargetLang });
        console.log('Raw Translation Response:', JSON.stringify(res, null, 2));

        // Ensure we are accessing the text correctly, handle array or object response
        const translation = Array.isArray(res) ? res[0].text : res.text;

        if (!translation) {
            throw new Error('No translation text found in response');
        }

        return NextResponse.json({ translatedText: translation });

    } catch (error: any) {
        console.error('Translation Library Error:', error);
        return NextResponse.json({
            error: 'Translation failed',
            details: error instanceof Error ? error.message : String(error)
        }, { status: 500 });
    }
}
