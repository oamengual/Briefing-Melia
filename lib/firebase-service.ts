import { firestore, storage } from './firebase-admin';
import { Brief, CampaignInputs, CreativeInputs, MatrixState } from './types';
import { v4 as uuidv4 } from 'uuid';

const COLLECTION_BRIEFS = 'briefs';
const COLLECTION_TEMPLATES = 'templates';

// --- Briefs Service ---

export async function getBriefs(): Promise<Brief[]> {
    if (!firestore) {
        console.warn('Firestore not initialized. Returning empty briefs.');
        return [];
    }
    try {
        const snapshot = await firestore.collection(COLLECTION_BRIEFS).get();
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Brief));
    } catch (error) {
        console.error('Error fetching briefs:', error);
        return [];
    }
}

export async function getBrief(id: string): Promise<Brief | null> {
    if (!firestore) return null;
    try {
        const doc = await firestore.collection(COLLECTION_BRIEFS).doc(id).get();
        if (!doc.exists) return null;
        return { id: doc.id, ...doc.data() } as Brief;
    } catch (error) {
        console.error(`Error fetching brief ${id}:`, error);
        return null;
    }
}

export async function createBrief(brief: Omit<Brief, 'id'>): Promise<string> {
    if (!firestore) throw new Error('Firestore not initialized');
    try {
        // Generate an ID or let Firestore do it. The current app uses UUIDs.
        // We can use the existing ID generation logic if we want, or let Firestore auto-gen.
        // For consistency with current frontend, let's allow passing an ID or generating one.

        // However, the Brief type has an ID properly.
        // Let's create a new document reference.
        const docRef = firestore.collection(COLLECTION_BRIEFS).doc();
        const newBrief = { ...brief, id: docRef.id, updatedAt: Date.now() };
        await docRef.set(newBrief);
        return docRef.id;
    } catch (error) {
        console.error('Error creating brief:', error);
        throw error;
    }
}

export async function updateBrief(id: string, updates: Partial<Brief>): Promise<void> {
    if (!firestore) throw new Error('Firestore not initialized');
    try {
        await firestore.collection(COLLECTION_BRIEFS).doc(id).update({
            ...updates,
            updatedAt: Date.now(),
        });
    } catch (error) {
        console.error(`Error updating brief ${id}:`, error);
        throw error;
    }
}

export async function deleteBrief(id: string): Promise<void> {
    if (!firestore) throw new Error('Firestore not initialized');
    try {
        await firestore.collection(COLLECTION_BRIEFS).doc(id).delete();
    } catch (error) {
        console.error(`Error deleting brief ${id}:`, error);
        throw error;
    }
}

// --- Storage Service (GCS) ---

export async function generateUploadUrl(filename: string, contentType: string): Promise<{ uploadUrl: string, publicUrl: string }> {
    const bucketName = process.env.NEXT_PUBLIC_GCS_BUCKET_NAME || process.env.GCS_BUCKET_NAME; // Fallback

    if (!bucketName || !storage) {
        // Fallback for local dev without GCS
        console.warn('GCS or storage not configured. Returning mock URL.');
        return {
            uploadUrl: '',
            publicUrl: `https://via.placeholder.com/150?text=${filename}`
        };
    }

    const file = storage.bucket(bucketName).file(filename);

    // URL valid for 15 minutes
    const [uploadUrl] = await file.getSignedUrl({
        version: 'v4',
        action: 'write',
        expires: Date.now() + 15 * 60 * 1000,
        contentType,
    });

    // Depending on bucket setting, this might need to be authenticated or public
    // For this app, let's assume we want it public readable or we generate a signed READ url later.
    // For now, let's return the public URL format.
    const publicUrl = `https://storage.googleapis.com/${bucketName}/${filename}`;

    return { uploadUrl, publicUrl };
}
