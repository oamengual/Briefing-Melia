'use client';

import { EditorState } from './types';
import { get, set, del } from 'idb-keyval';

const PSDS_PREFIX = 'mockup_psd_';
const STATES_PREFIX = 'mockup_editor_state_';
const PREVIEWS_PREFIX = 'mockup_preview_';

export async function savePsd(id: string, file: File | Blob): Promise<void> {
    try {
        await set(PSDS_PREFIX + id, file);
    } catch (e) {
        console.error("Failed to save PSD", e);
        throw e;
    }
}

export async function getPsd(id: string): Promise<File | Blob | undefined> {
    try {
        return await get<File | Blob>(PSDS_PREFIX + id);
    } catch (e) {
        console.error("Failed to get PSD", e);
        return undefined;
    }
}

export async function deletePsd(id: string): Promise<void> {
    try {
        await del(PSDS_PREFIX + id);
    } catch (e) {
        console.error("Failed to delete PSD", e);
    }
}

export async function saveTemplateState(id: string, state: EditorState): Promise<void> {
    try {
        await set(STATES_PREFIX + id, state);
    } catch (e) {
        console.error("Failed to save editor state", e);
    }
}

export async function getTemplateState(id: string): Promise<EditorState | undefined> {
    try {
        return await get<EditorState>(STATES_PREFIX + id);
    } catch (e) {
        return undefined;
    }
}

export async function deleteTemplateState(id: string): Promise<void> {
    try {
        await del(STATES_PREFIX + id);
    } catch (e) {
        console.error("Failed to delete editor state", e);
    }
}

export async function saveTemplatePreview(id: string, previewBase64: string): Promise<void> {
    try {
        await set(PREVIEWS_PREFIX + id, previewBase64);
    } catch (e) {
        console.error("Failed to save preview", e);
    }
}

export async function getTemplatePreview(id: string): Promise<string | undefined> {
    try {
        return await get<string>(PREVIEWS_PREFIX + id);
    } catch (e) {
        return undefined;
    }
}

export async function deleteTemplatePreview(id: string): Promise<void> {
    try {
        await del(PREVIEWS_PREFIX + id);
    } catch (e) {
        console.error("Failed to delete preview", e);
    }
}
