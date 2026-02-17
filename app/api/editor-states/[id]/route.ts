import { NextRequest, NextResponse } from 'next/server';
import { firestore } from '@/lib/firebase-admin';

const COLLECTION_STATES = 'editor_states';

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    if (!firestore) return NextResponse.json({ error: 'Firestore not initialized' }, { status: 500 });
    try {
        const doc = await firestore.collection(COLLECTION_STATES).doc(id).get();
        if (!doc.exists) return NextResponse.json({ error: 'Not Found' }, { status: 404 });
        return NextResponse.json(doc.data());
    } catch (error) {
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    if (!firestore) return NextResponse.json({ error: 'Firestore not initialized' }, { status: 500 });
    try {
        const state = await request.json();
        await firestore.collection(COLLECTION_STATES).doc(id).set(state);
        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    if (!firestore) return NextResponse.json({ error: 'Firestore not initialized' }, { status: 500 });
    try {
        await firestore.collection(COLLECTION_STATES).doc(id).delete();
        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
