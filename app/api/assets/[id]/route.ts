import { NextRequest, NextResponse } from 'next/server';
import { firestore, storage } from '@/lib/firebase-admin';

const COLLECTION_ASSETS = 'assets';

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    if (!firestore) return NextResponse.json({ error: 'Firestore not initialized' }, { status: 500 });
    try {
        const doc = await firestore.collection(COLLECTION_ASSETS).doc(id).get();
        if (!doc.exists) {
            return NextResponse.json({ error: 'Not Found' }, { status: 404 });
        }
        return NextResponse.json(doc.data());
    } catch (error) {
        console.error('API Asset Get Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    if (!firestore) return NextResponse.json({ error: 'Firestore not initialized' }, { status: 500 });
    try {
        // 1. Get asset to find GCS path
        const doc = await firestore.collection(COLLECTION_ASSETS).doc(id).get();
        if (doc.exists) {
            const data = doc.data();
            if (data && data.data && data.data.includes('storage.googleapis.com')) {
                // cleanup GCS if possible, though easier to just delete metadata for now
            }
        }

        await firestore.collection(COLLECTION_ASSETS).doc(id).delete();
        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('API Asset Delete Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
