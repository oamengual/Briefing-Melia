'use client';

import { EditorState } from './types';

// --- PSD FILE STORAGE (GCS) ---

export async function savePsd(id: string, file: File | Blob): Promise<void> {
    try {
        // 1. Get Signed URL
        const filename = `psds/${id}.psd`;
        const res = await fetch('/api/upload', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ filename, contentType: file.type || 'application/octet-stream' })
        });

        if (!res.ok) throw new Error('Failed to get upload URL');
        const { uploadUrl } = await res.json();

        // 2. Upload to GCS
        const uploadRes = await fetch(uploadUrl, {
            method: 'PUT',
            headers: { 'Content-Type': file.type || 'application/octet-stream' },
            body: file
        });

        if (!uploadRes.ok) throw new Error('Failed to upload PSD to GCS');

    } catch (e) {
        console.error("Failed to save PSD", e);
        throw e;
    }
}

export async function getPsd(id: string): Promise<File | Blob | undefined> {
    // Return formatted URL? Or fetch blob?
    // The previous implementation returned File|Blob from IDB.
    // So we should fetch the blob from GCS to maintain compatibility.

    try {
        // Assuming public access or we need a signed GET url.
        // For this demo, assuming public bucket access for 'psds' folder.
        // If not, we'd need an API to proxy the download or generate a signed read URL.
        const bucketName = 'YOUR_BUCKET_NAME'; // We don't have env access here easily in client without passing it
        // Better: Use an API proxy or assume a standard URL structure if public.

        // Let's use a proxy endpoint to fetching if we don't know the bucket name public URL
        // OR: store the URL?

        // Simpler: Fetch from our API which redirects to GCS or pipes it.
        const res = await fetch(`/api/psd/${id}`);
        if (!res.ok) return undefined;
        return await res.blob();
    } catch (e) {
        console.error("Failed to get PSD", e);
        return undefined;
    }
}

export async function deletePsd(id: string): Promise<void> {
    // Call API to delete GCS object
    try {
        await fetch(`/api/psd/${id}`, { method: 'DELETE' });
    } catch (e) {
        console.error("Failed to delete PSD", e);
    }
}


// --- EDITOR STATE (Firestore) ---

export async function saveTemplateState(id: string, state: EditorState): Promise<void> {
    try {
        await fetch(`/api/editor-states/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(state)
        });
    } catch (e) {
        console.error("Failed to save editor state", e);
    }
}

export async function getTemplateState(id: string): Promise<EditorState | undefined> {
    try {
        const res = await fetch(`/api/editor-states/${id}`);
        if (!res.ok) return undefined;
        return await res.json();
    } catch (e) {
        return undefined;
    }
}

export async function deleteTemplateState(id: string): Promise<void> {
    try {
        await fetch(`/api/editor-states/${id}`, { method: 'DELETE' });
    } catch (e) {
        console.error("Failed to delete editor state", e);
    }
}

// --- PREVIEWS (GCS via Assets API) ---

export async function saveTemplatePreview(id: string, previewBase64: string): Promise<void> {
    try {
        // Upload via Assets API to get a URL
        // We reuse the assets API but maybe we don't need to store a separate Asset document?
        // Just upload raw file?
        // Let's use the assets API for convenience as it handles Base64->GCS

        const asset = {
            id: `preview_${id}`,
            type: 'image/png',
            name: `preview_${id}.png`,
            data: previewBase64
        };

        await fetch('/api/assets', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(asset)
        });

        // We don't strictly need to "save" the URL here if getTemplatePreview knows how to form it
        // BUT, getTemplatePreview usually returns the Base64 or URL.
    } catch (e) {
        console.error("Failed to save preview", e);
    }
}

export async function getTemplatePreview(id: string): Promise<string | undefined> {
    try {
        // Fetch the Asset metadata which contains the URL
        const res = await fetch(`/api/assets/preview_${id}`);
        if (!res.ok) return undefined;
        const data = await res.json();
        return data.data; // This will be the GCS URL
    } catch (e) {
        return undefined;
    }
}

export async function deleteTemplatePreview(id: string): Promise<void> {
    try {
        await fetch(`/api/assets/preview_${id}`, { method: 'DELETE' });
    } catch (e) {
        console.error("Failed to delete preview", e);
    }
}
