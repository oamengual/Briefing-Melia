import { NextRequest, NextResponse } from 'next/server';
import { getBriefs, createBrief } from '@/lib/firebase-service';
import { Brief } from '@/lib/types';

export async function GET() {
    try {
        const briefs = await getBriefs();
        return NextResponse.json(briefs);
    } catch (error) {
        console.error('API Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        // Validate body if needed, currently accepting Partial<Brief> that matches creation needs
        // Ideally we should use Zod here, but for speed we trust the type for now or basic validation

        // Check minimal requirements
        if (!body.name) {
            return NextResponse.json({ error: 'Name is required' }, { status: 400 });
        }

        const newId = await createBrief(body);
        return NextResponse.json({ id: newId }, { status: 201 });
    } catch (error) {
        console.error('API Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
