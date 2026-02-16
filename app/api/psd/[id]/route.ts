import { NextRequest, NextResponse } from 'next/server';
import { storage } from '@/lib/firebase-admin';

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
    try {
        const bucketName = process.env.NEXT_PUBLIC_GCS_BUCKET_NAME || process.env.GCS_BUCKET_NAME;
        if (!bucketName) throw new Error('Bucket name not found');

        const filename = `psds/${params.id}.psd`;
        const [file] = await storage.bucket(bucketName).file(filename).get();

        // Pipe the file? Or get a signed URL?
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

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
    try {
        const bucketName = process.env.NEXT_PUBLIC_GCS_BUCKET_NAME || process.env.GCS_BUCKET_NAME;
        if (bucketName) {
            const filename = `psds/${params.id}.psd`;
            await storage.bucket(bucketName).file(filename).delete();
        }
        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
