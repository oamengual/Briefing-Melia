import { NextRequest, NextResponse } from 'next/server';
import { firestore } from '@/lib/firebase-admin';
import { Template } from '@/lib/types';

const COLLECTION_TEMPLATES = 'templates';

export async function GET() {
    try {
        const snapshot = await firestore.collection(COLLECTION_TEMPLATES).get();
        const templates = snapshot.docs.map((doc: any) => ({ id: doc.id, ...doc.data() } as Template));
        return NextResponse.json(templates);
    } catch (error) {
        console.error('API Templates Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    try {
        const template = await request.json();
        const docRef = firestore.collection(COLLECTION_TEMPLATES).doc(template.id || undefined);
        await docRef.set({ ...template, id: docRef.id });
        return NextResponse.json({ id: docRef.id }, { status: 201 });
    } catch (error) {
        console.error('API Templates Create Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
