import { NextRequest, NextResponse } from 'next/server';
import { storage } from '@/lib/firebase-admin';

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    try {
        const bucketName = process.env.NEXT_PUBLIC_GCS_BUCKET_NAME || process.env.GCS_BUCKET_NAME;
        if (!bucketName || !storage) {
            console.warn('Storage not initialized or bucket name missing');
            return NextResponse.json({ error: 'Storage Unavailable' }, { status: 503 });
        }

        const filename = `psds/${id}.psd`;

        // Get signed URL for read
        const [url] = await storage.bucket(bucketName).file(filename).getSignedUrl({
            version: 'v4',
            action: 'read',
            expires: Date.now() + 15 * 60 * 1000,
        });

        // Redirect to the signed URL
        return NextResponse.redirect(url);
    } catch (error) {
        console.error('PSD Get Error', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    try {
        const bucketName = process.env.NEXT_PUBLIC_GCS_BUCKET_NAME || process.env.GCS_BUCKET_NAME;
        if (bucketName && storage) {
            const filename = `psds/${id}.psd`;
            await storage.bucket(bucketName).file(filename).delete();
        }
        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
