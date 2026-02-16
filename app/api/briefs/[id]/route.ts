import { NextRequest, NextResponse } from 'next/server';
import { getBrief, updateBrief, deleteBrief } from '@/lib/firebase-service';

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
    try {
        const brief = await getBrief(params.id);
        if (!brief) {
            return NextResponse.json({ error: 'Brief not found' }, { status: 404 });
        }
        return NextResponse.json(brief);
    } catch (error) {
        console.error('API Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
    try {
        const body = await request.json();
        await updateBrief(params.id, body);
        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('API Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
    try {
        await deleteBrief(params.id);
        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('API Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
