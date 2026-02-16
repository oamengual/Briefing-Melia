import { NextRequest, NextResponse } from 'next/server';
import { firestore } from '@/lib/firebase-admin';
import { Brand } from '@/lib/types';

const COLLECTION_BRANDS = 'brands';

export async function GET() {
    try {
        const snapshot = await firestore.collection(COLLECTION_BRANDS).get();
        const brands = snapshot.docs.map((doc: any) => ({ id: doc.id, ...doc.data() } as Brand));
        return NextResponse.json(brands);
    } catch (error) {
        console.error('API Brands Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    try {
        const brand = await request.json();
        const docRef = firestore.collection(COLLECTION_BRANDS).doc(brand.id || undefined);
        await docRef.set({ ...brand, id: docRef.id });
        return NextResponse.json({ id: docRef.id }, { status: 201 });
    } catch (error) {
        console.error('API Brands Create Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
