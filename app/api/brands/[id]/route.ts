import { NextRequest, NextResponse } from 'next/server';
import { firestore } from '@/lib/firebase-admin';

const COLLECTION_BRANDS = 'brands';

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    if (!firestore) return NextResponse.json({ error: 'Firestore not initialized' }, { status: 500 });
    try {
        const updates = await request.json();
        await firestore.collection(COLLECTION_BRANDS).doc(id).update(updates);
        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('API Brand Update Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    if (!firestore) return NextResponse.json({ error: 'Firestore not initialized' }, { status: 500 });
    try {
        await firestore.collection(COLLECTION_BRANDS).doc(id).delete();
        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('API Brand Delete Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
