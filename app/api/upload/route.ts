import { NextRequest, NextResponse } from 'next/server';
import { generateUploadUrl } from '@/lib/firebase-service';

export async function POST(request: NextRequest) {
    try {
        const { filename, contentType } = await request.json();

        if (!filename || !contentType) {
            return NextResponse.json({ error: 'Filename and contentType are required' }, { status: 400 });
        }

        const { uploadUrl, publicUrl } = await generateUploadUrl(filename, contentType);

        return NextResponse.json({ uploadUrl, publicUrl });
    } catch (error) {
        console.error('API Upload Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
