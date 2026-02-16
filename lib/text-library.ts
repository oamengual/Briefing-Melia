import { get, set } from 'idb-keyval';

const LIBRARY_KEY = 'briefing_station_text_library';

export interface LibraryText {
    id: string;
    content: string;
    category: string; // 'claim', 'cta', 'subject', 'body', etc.
    tags: string[];
    usageCount: number;
    lastUsed: number;
}

export async function getTextLibrary(): Promise<LibraryText[]> {
    if (typeof window === 'undefined') return [];
    try {
        const library = await get<LibraryText[]>(LIBRARY_KEY);
        return library || [];
    } catch (e) {
        console.error("Failed to load text library", e);
        return [];
    }
}

export async function saveTextToLibrary(content: string, category: string, tags: string[] = []) {
    const library = await getTextLibrary();
    const now = Date.now();
    const existingIndex = library.findIndex(t => t.content.toLowerCase() === content.trim().toLowerCase() && t.category === category);

    if (existingIndex >= 0) {
        // Update existing
        library[existingIndex].usageCount += 1;
        library[existingIndex].lastUsed = now;
        // Merge tags
        const newTags = new Set([...library[existingIndex].tags, ...tags]);
        library[existingIndex].tags = Array.from(newTags);
    } else {
        // Create new
        const newText: LibraryText = {
            id: crypto.randomUUID(),
            content: content.trim(),
            category,
            tags,
            usageCount: 1,
            lastUsed: now
        };
        library.push(newText);
    }

    await set(LIBRARY_KEY, library);
}

export async function searchTexts(query: string, category?: string): Promise<LibraryText[]> {
    const library = await getTextLibrary();
    const q = query.toLowerCase();

    return library.filter(text => {
        if (category && text.category !== category) return false;
        if (!q) return true;
        return text.content.toLowerCase().includes(q) || text.tags.some(t => t.toLowerCase().includes(q));
    }).sort((a, b) => b.lastUsed - a.lastUsed); // Most recently used first
}


import { CreativeInputs, LandingTexts, NewsletterTexts } from '@/lib/types';

export async function deleteTextFromLibrary(id: string) {
    const library = await getTextLibrary();
    const filtered = library.filter(t => t.id !== id);
    await set(LIBRARY_KEY, filtered);
}

/**
 * Scans the entire CreativeInputs object and saves all non-empty text fields 
 * to the library with appropriate categories.
 */
export async function saveAllCreativeTexts(creative: CreativeInputs) {
    const textsToSave: { content: string; category: string }[] = [];

    // Helper to add if valid
    const add = (content: string | undefined, category: string) => {
        if (content && content.trim().length > 2) {
            textsToSave.push({ content, category });
        }
    };

    // Banners
    add(creative.claim, 'claim');
    add(creative.cta, 'cta');
    add(creative.discount, 'discount');
    add(creative.usp1, 'usp');
    add(creative.usp2, 'usp');
    add(creative.usp3, 'usp');

    // Landing
    if (creative.landing) {
        add(creative.landing.title, 'landing_title');
        add(creative.landing.subtitle, 'landing_subtitle');
        add(creative.landing.body, 'landing_body');
        add(creative.landing.cta, 'landing_cta');
    }

    // Newsletter
    if (creative.newsletter) {
        add(creative.newsletter.subject, 'newsletter_subject');
        add(creative.newsletter.preview, 'newsletter_preview');
        add(creative.newsletter.header, 'newsletter_header');
        add(creative.newsletter.body, 'newsletter_body');
        add(creative.newsletter.cta, 'newsletter_cta');
    }

    // Save all in parallel (or sequential to be safe with race conditions on get/set, 
    // but saveTextToLibrary does a get inside, so race conditions are possible if parallel.
    // Ideally we should bulk save, but for now we'll just run them locally.)
    // Since saveTextToLibrary is async and reads-then-writes, doing them in parallel might cause overwrites.
    // Better to run sequentially.
    for (const item of textsToSave) {
        await saveTextToLibrary(item.content, item.category);
    }

    if (textsToSave.length > 0) {
        console.log(`[TextLibrary] Bulk saved ${textsToSave.length} items from creative inputs.`);
    }
}
