'use client';

import { BriefingState } from './store';
import {
    CampaignInputs,
    CreativeInputs,
    MatrixState,
    User,
    Settings,
    Template,
    Brief,
    BriefVersion,
    ActivityLog,
    NamingConvention,
    TraffickingData,
    Placement
} from './types';
import { PLACEMENTS } from './constants';
import { DEMO_BRIEFS } from './demo-data';

// Keep local storage keys for non-cloud data
const USERS_KEY = 'briefing_station_users';
const SETTINGS_KEY = 'briefing_station_settings';
const TEMPLATES_KEY = 'briefing_station_templates';

// --- API CLIENT ---

export async function getBriefs(): Promise<Brief[]> {
    if (typeof window === 'undefined') return [];
    try {
        const res = await fetch('/api/briefs');
        if (!res.ok) throw new Error('Failed to fetch briefs');
        return await res.json();
    } catch (e) {
        console.error("Failed to load briefs", e);
        return [];
    }
}

export async function saveBrief(state: BriefingState['inputs'] & {
    creative: CreativeInputs,
    translations: Record<string, Partial<CreativeInputs>>,
    matrix: MatrixState,
    lockedFields?: string[],
    namingConvention?: NamingConvention,
    psdTemplateId?: string,
    psdTemplates?: any[],
    trafficking?: Record<string, TraffickingData>
}, id?: string): Promise<string> {

    // Construct the Brief object (partial)
    const partialBrief: Partial<Brief> = {
        name: state.campaignName || 'Untitled Campaign',
        status: 'draft', // Default, server or UI should handle status persistence logic if needed
        state: {
            inputs: state,
            creative: state.creative,
            translations: state.translations,
            matrix: state.matrix,
            lockedFields: state.lockedFields,
            namingConvention: state.namingConvention,
            psdTemplateId: state.psdTemplateId,
            psdTemplates: state.psdTemplates,
            trafficking: state.trafficking
        }
    };

    try {
        if (id) {
            // Update existing
            const res = await fetch(`/api/briefs/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(partialBrief)
            });
            if (!res.ok) throw new Error('Failed to update brief');
            return id;
        } else {
            // Create new
            const res = await fetch('/api/briefs', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(partialBrief)
            });
            if (!res.ok) throw new Error('Failed to create brief');
            const data = await res.json();
            return data.id;
        }
    } catch (error) {
        console.error('Error saving brief:', error);
        throw error;
    }
}

export async function getBrief(id: string): Promise<Brief | undefined> {
    try {
        const res = await fetch(`/api/briefs/${id}`);
        if (res.status === 404) return undefined;
        if (!res.ok) throw new Error('Failed to fetch brief');
        return await res.json();
    } catch (e) {
        console.error("Failed to load brief", e);
        return undefined;
    }
}

export async function deleteBrief(id: string) {
    try {
        await fetch(`/api/briefs/${id}`, { method: 'DELETE' });
    } catch (e) {
        console.error("Failed to delete brief", e);
    }
}

export async function duplicateBrief(id: string): Promise<string | null> {
    try {
        const original = await getBrief(id);
        if (!original) return null;

        const newBrief = {
            ...original,
            name: `${original.name} (Copy)`,
            status: 'draft' as const
        };

        // Remove ID to force creation
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { id: _, ...rest } = newBrief;

        const res = await fetch('/api/briefs', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(rest)
        });

        if (!res.ok) return null;
        const data = await res.json();
        return data.id;
    } catch (error) {
        console.error('Failed to duplicate brief', error);
        return null;
    }
}

export async function updateBriefStatus(id: string, status: Brief['status']) {
    try {
        await fetch(`/api/briefs/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status })
        });
    } catch (error) {
        console.error('Failed to update status', error);
    }
}

// --- VERSIONING (Stubbed for Cloud Migration Phase 1) ---

export async function getBriefVersions(briefId: string): Promise<BriefVersion[]> {
    console.warn('getBriefVersions: Not implemented in Cloud backend yet');
    return [];
}

export async function saveBriefVersion(briefId: string, state: Brief['state'], changes?: { field: string; oldValue: any; newValue: any }[]) {
    // No-op for now
}

// --- ACTIVITY LOGS (Stubbed for Cloud Migration Phase 1) ---

export async function getLogs(briefId?: string): Promise<ActivityLog[]> {
    console.warn('getLogs: Not implemented in Cloud backend yet');
    return [];
}

export async function logActivity(briefId: string, action: string, details?: string) {
    // No-op
}

// --- USER MANAGEMENT (Local Storage) ---

export function getUsers(): User[] {
    if (typeof window === 'undefined') return [];
    try {
        const raw = localStorage.getItem(USERS_KEY);
        if (!raw) {
            const defaults: User[] = [
                { id: '1', name: 'Admin User', email: 'admin@studio.com', role: 'admin' },
                { id: '2', name: 'Creative Lead', email: 'lead@studio.com', role: 'editor' }
            ];
            localStorage.setItem(USERS_KEY, JSON.stringify(defaults));
            return defaults;
        }
        return JSON.parse(raw);
    } catch (e) {
        return [];
    }
}

export function saveUser(user: User) {
    const users = getUsers();
    const existingIndex = users.findIndex(u => u.id === user.id);
    if (existingIndex >= 0) {
        users[existingIndex] = user;
    } else {
        users.push(user);
    }
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

export function deleteUser(id: string) {
    const users = getUsers();
    const filtered = users.filter(u => u.id !== id);
    localStorage.setItem(USERS_KEY, JSON.stringify(filtered));
}

// --- SETTINGS (Local Storage) ---

export function getSettings(): Settings {
    if (typeof window === 'undefined') return { appLanguage: 'en', workspaceName: 'Global Marketing', defaultBrands: [] };
    try {
        const raw = localStorage.getItem(SETTINGS_KEY);
        if (!raw) return { appLanguage: 'en', workspaceName: 'Global Marketing', defaultBrands: [] };
        return JSON.parse(raw);
    } catch (e) {
        return { appLanguage: 'en', workspaceName: 'Global Marketing', defaultBrands: [] };
    }
}

export function getPlacements(): Placement[] {
    const settings = getSettings();
    if (settings.placements && settings.placements.length > 0) {
        return settings.placements;
    }
    return PLACEMENTS;
}

export function saveSettings(settings: Settings) {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
}

export function clearAllData() {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(USERS_KEY);
    localStorage.removeItem(SETTINGS_KEY);
    // API Clear? No, that would be dangerous. Just reload.
    window.location.reload();
}

export async function loadDemoData() {
    // Porting demo data to Cloud
    // Iterate and POST
    for (const brief of DEMO_BRIEFS) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { id, ...rest } = brief;
        await fetch('/api/briefs', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(rest)
        });
    }
    window.location.reload();
}

// --- TEMPLATES (Cloud via API) ---

const DEFAULT_TEMPLATES: Template[] = [
    {
        id: 'tpl_emea_top5',
        name: 'Big 5 EMEA',
        description: 'Standard campaign covering the top 5 European markets (UK, DE, FR, IT, ES).',
        category: 'Region',
        tags: ['EMEA', 'Standard', 'Big 5'],
        state: {
            matrix: {
                'GB (Reino Unido)': ['leaderboard_criteo_rtg', 'instagram_feed_meta', 'tiktok_feed_tiktok'],
                'DE (Alemania)': ['leaderboard_criteo_rtg', 'instagram_feed_meta', 'tiktok_feed_tiktok'],
                'FR (Francia)': ['leaderboard_criteo_rtg', 'instagram_feed_meta', 'tiktok_feed_tiktok'],
                'IT (Italia)': ['leaderboard_criteo_rtg', 'instagram_feed_meta', 'tiktok_feed_tiktok'],
                'ES (España)': ['leaderboard_criteo_rtg', 'instagram_feed_meta', 'tiktok_feed_tiktok']
            },
            inputs: {
                strategy: 'Brand Awareness',
                kpi: 'Reach > 1M'
            }
        }
    },
    {
        id: 'tpl_us_full',
        name: 'US Full Funnel',
        description: 'Comprehensive placement mix for the US market including Social, Display, and Video.',
        category: 'Market',
        tags: ['US', 'Full Funnel', 'High Impact'],
        state: {
            matrix: {
                'US (Estados Unidos)': [
                    'billboard_amazon_dsp', 'leaderboard_amazon_dsp',
                    'instagram_feed_meta', 'instagram_stories_meta',
                    'tiktok_feed_tiktok',
                    'youtube_bumper_yt'
                ]
            },
            inputs: {
                marketingObjective: 'conversion',
                targetAudience: 'US Travelers'
            }
        }
    },
    {
        id: 'tpl_social_focus',
        name: 'Pure Social (Global)',
        description: 'Instagram and TikTok focus across all major regions.',
        category: 'Channel',
        tags: ['Social', 'Vertical', 'Video'],
        state: {
            matrix: {
                'US (Estados Unidos)': ['instagram_feed_meta', 'tiktok_feed_tiktok'],
                'GB (Reino Unido)': ['instagram_feed_meta', 'tiktok_feed_tiktok'],
                'ES (España)': ['instagram_feed_meta', 'tiktok_feed_tiktok'],
                'MX (México)': ['instagram_feed_meta', 'tiktok_feed_tiktok'],
                'AE (Emiratos Árabes)': ['instagram_feed_meta', 'tiktok_feed_tiktok']
            },
            inputs: {
                strategy: 'Social Engagement'
            }
        }
    },
    {
        id: 'tpl_awareness_obj',
        name: 'Awareness Setup',
        description: 'High visibility formats optimized for brand reach.',
        category: 'Objective',
        tags: ['Awareness', 'Reach', 'Display'],
        state: {
            matrix: {
                'US (Estados Unidos)': ['billboard_amazon_dsp', 'masthead_yt'],
                'DE (Alemania)': ['billboard_amazon_dsp', 'masthead_yt'],
                'GB (Reino Unido)': ['billboard_amazon_dsp', 'masthead_yt']
            },
            inputs: {
                marketingObjective: 'awareness',
                kpi: 'CPM < $5'
            }
        }
    }
];

export async function getTemplates(): Promise<Template[]> {
    if (typeof window === 'undefined') return [];
    try {
        const res = await fetch('/api/templates');
        if (!res.ok) {
            // Fallback to defaults if API fails or empty?
            // For now, let's treat defaults as seeds if API returns empty
            return DEFAULT_TEMPLATES;
        }
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
            return data;
        }
        return DEFAULT_TEMPLATES;
    } catch (e) {
        console.error("Failed to load templates", e);
        return DEFAULT_TEMPLATES;
    }
}

export async function saveTemplate(template: Template) {
    try {
        // Upsert logic
        await fetch('/api/templates', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(template)
        });
    } catch (e) {
        console.error("Failed to save template", e);
    }
}

export async function deleteTemplate(id: string) {
    try {
        await fetch(`/api/templates/${id}`, { method: 'DELETE' });
    } catch (e) {
        console.error("Failed to delete template", e);
    }
}

