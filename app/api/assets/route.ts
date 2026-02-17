import { NextRequest, NextResponse } from 'next/server';
import { firestore, storage } from '@/lib/firebase-admin';
import { BrandAsset } from '@/lib/types';
import { randomUUID } from 'crypto';

const COLLECTION_ASSETS = 'assets';

export async function POST(request: NextRequest) {
    try {
        const asset: BrandAsset = await request.json();

        // 1. Upload Base64 data to GCS
        // Data format: "data:image/svg+xml;base64,....."
        const matches = asset.data.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);

        let publicUrl = asset.data; // Fallback

        if (matches && matches.length === 3) {
            const contentType = matches[1];
            const buffer = Buffer.from(matches[2], 'base64');
            const filename = `assets/${asset.id}/${asset.name}`;
            const bucketName = process.env.NEXT_PUBLIC_GCS_BUCKET_NAME || process.env.GCS_BUCKET_NAME;

            if (bucketName && storage) {
                const bucket = storage.bucket(bucketName);
                const file = bucket.file(filename);
                await file.save(buffer, {
                    metadata: { contentType }
                });
                // Make public? Or use signed URL? Assuming public read for assets for now.
                // await file.makePublic(); 
                publicUrl = `https://storage.googleapis.com/${bucketName}/${filename}`;
            }
        }

        // 2. Save Metadata to Firestore
        // Store the URL instead of the Base64 blob in the 'data' field
        const assetRecord = {
            ...asset,
            data: publicUrl // This is now a clean URL
        };

        if (!firestore) {
            return NextResponse.json({ error: 'Firestore not initialized' }, { status: 500 });
        }

        await firestore.collection(COLLECTION_ASSETS).doc(asset.id).set(assetRecord);

        return NextResponse.json({ id: asset.id, url: publicUrl }, { status: 201 });
    } catch (error) {
        console.error('API Asset Upload Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
