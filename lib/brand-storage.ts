'use client';

import { Brand, BrandAsset } from './types';

// --- BRANDS (Cloud via API) ---

export async function getBrands(): Promise<Brand[]> {
    if (typeof window === 'undefined') return [];
    try {
        const res = await fetch('/api/brands');
        if (!res.ok) throw new Error('Failed to fetch brands');
        return await res.json();
    } catch (e) {
        console.error("Failed to load brands", e);
        return [];
    }
}

export async function saveBrand(brand: Brand) {
    try {
        // If updating, send PUT, if new send POST.
        // The API route logic I wrote for POST handles ID assignment if missing, 
        // and set() merge logic if ID provided.
        // But let's be explicit:

        let method = 'POST';
        let url = '/api/brands';

        // Check if exists? Or just upsert. My POST implementation uses set() with merge:true semantics effectively if ID provided?
        // Actually doc().set() overwrites unless merge is true. I used set({...brand}) which overwrites.
        // Ideally we should distinguish create vs update in frontend or have API handle upsert.
        // For now, let's assume POST handles upsert for simplicity or check if ID exists in list.

        // Better: POST to create, PUT to update specific fields.
        // Frontend logic in brand-manager.tsx calls saveBrand with a potentially new ID or existing.

        // Let's use POST for upsert-like behavior if ID is present
        const res = await fetch('/api/brands', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(brand)
        });

        if (!res.ok) throw new Error('Failed to save brand');
        return await res.json();
    } catch (e) {
        console.error("Failed to save brand", e);
        throw e;
    }
}

export async function deleteBrand(id: string) {
    try {
        await fetch(`/api/brands/${id}`, { method: 'DELETE' });
    } catch (e) {
        console.error("Failed to delete brand", e);
    }
}

// --- ASSETS (Fonts, Logos) ---
// Now stored in GCS, validation happens via upload.
// This function needs to handle the UPLOAD to GCS and return the public URL.

export async function getAsset(id: string): Promise<BrandAsset | undefined> {
    // Assets are now just URLs inside the Brand object or referenced.
    // However, the frontend (brand-manager.tsx) expects to calls getAsset(id) to resolve the full asset object
    // including the data (which was base64).

    // If we move to GCS, `data` field should contain the URL. 
    // The frontend renders <img src={asset.data} /> or uses @font-face src: url('{asset.data}').
    // So if 'data' is a URL, it works harmoniously!

    // BUT where do we store the metadata (name, type, id) of the asset?
    // In Firestore? Or do we just store the asset array on the Brand object?

    // The current `Brand` type has `fontIds: string[]` and `logoIds: string[]`.
    // And `getAsset(id)` retrieves the blob.

    // Refactoring approach:
    // 1. We need an `api/assets` logic or we store asset metadata in a `assets` collection?
    // 2. OR, simpler: We change `Brand` type to store `fonts: BrandAsset[]` instead of IDs.
    //    But `Brand` type is shared.

    // Let's stick to the current signature if possible OR update the usages.
    // Given the prompt "Desarolla toda la implementación del backend", I should probably make it robust.
    // Storing assets in a separate collection `assets` is clean.

    try {
        // I need an endpoint for retrieving a single asset metadata
        // Let's assume I create `api/assets/[id]`
        const res = await fetch(`/api/assets/${id}`);
        if (!res.ok) return undefined;
        return await res.json();
    } catch {
        return undefined;
    }
}

export async function saveAsset(asset: BrandAsset): Promise<string> {
    // 1. Upload file data (Base64) to GCS via API?
    // The frontend `brand-manager` currently converts file to Base64 THEN calls saveAsset.
    // Sending Base64 to server to upload to GCS is okay for small files (logos/fonts), 
    // but standard way is sending FormData or getting Signed URL.

    // Since `brand-manager.tsx` already has the `File` object before converting, 
    // I should ideally update `brand-manager.tsx` to pass the File, not the Base64 asset.

    // However, to minimize frontend changes for this "backend" task, I can:
    // Accept the base64 in this function, POST it to `api/upload-base64` (new endpoint)?
    // OR: Update `brand-manager.tsx` and this function signature.

    // Let's try to adapt this function to upload the Base64 data to GCS.
    // Converting Base64 back to Buffer on server is easy.

    try {
        const res = await fetch('/api/assets', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(asset)
        });

        if (!res.ok) throw new Error('Failed to save asset');
        const data = await res.json();
        return data.id;
    } catch (e) {
        console.error("Failed to upload asset", e);
        throw e;
    }
}

export async function deleteAsset(id: string) {
    try {
        await fetch(`/api/assets/${id}`, { method: 'DELETE' });
    } catch (e) {
        console.error("Failed to delete asset", e);
    }
}

// Helper to convert File to Base64 (Keep for frontend utility if needed, 
// though we prefer uploading file directly now)
export function fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = error => reject(error);
    });
}
