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
    Placement,
    ContentConfig
} from './types';
import { PLACEMENTS } from './constants';
import { DEMO_BRIEFS } from './demo-data';
import { get, set } from 'idb-keyval';

// Keep local storage keys for non-cloud data
const USERS_KEY = 'briefing_station_users';
const SETTINGS_KEY = 'briefing_station_settings';

// IDB Keys
const BRIEFS_KEY = 'mockup_briefs';
const TEMPLATES_KEY = 'mockup_templates';

// --- API CLIENT (now Mockup LocalStorage) ---

export async function getBriefs(): Promise<Brief[]> {
    if (typeof window === 'undefined') return [];
    try {
        const briefs = await get<Brief[]>(BRIEFS_KEY);
        return briefs || [];
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
    trafficking?: Record<string, TraffickingData>,
    content?: ContentConfig
}, id?: string): Promise<string> {

    const partialBrief: Partial<Brief> = {
        name: state.campaignName || 'Untitled Campaign',
        status: 'draft',
        state: {
            inputs: state,
            creative: state.creative,
            translations: state.translations,
            matrix: state.matrix,
            lockedFields: state.lockedFields,
            namingConvention: state.namingConvention,
            psdTemplateId: state.psdTemplateId,
            psdTemplates: (state.psdTemplates || []).map(t => {
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                const { editorState, preview, ...rest } = t;
                return rest;
            }),
            trafficking: state.trafficking,
            content: state.content
        }
    };

    try {
        const briefs = await getBriefs();
        if (id) {
            const index = briefs.findIndex(b => b.id === id);
            if (index >= 0) {
                briefs[index] = { ...briefs[index], ...partialBrief } as Brief;
            } else {
                partialBrief.id = id;
                partialBrief.createdAt = new Date().toISOString();
                partialBrief.updatedAt = new Date().toISOString();
                briefs.push(partialBrief as Brief);
            }
            await set(BRIEFS_KEY, briefs);
            return id;
        } else {
            const newId = crypto.randomUUID();
            partialBrief.id = newId;
            partialBrief.createdAt = new Date().toISOString();
            partialBrief.updatedAt = new Date().toISOString();
            briefs.push(partialBrief as Brief);
            await set(BRIEFS_KEY, briefs);
            return newId;
        }
    } catch (error) {
        console.error('Error saving brief:', error);
        throw error;
    }
}

export async function getBrief(id: string): Promise<Brief | undefined> {
    try {
        const briefs = await getBriefs();
        return briefs.find(b => b.id === id);
    } catch (e) {
        console.error("Failed to load brief", e);
        return undefined;
    }
}

export async function deleteBrief(id: string) {
    try {
        const briefs = await getBriefs();
        await set(BRIEFS_KEY, briefs.filter(b => b.id !== id));
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
            id: crypto.randomUUID(),
            name: `${original.name} (Copy)`,
            status: 'draft' as const,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };

        const briefs = await getBriefs();
        briefs.push(newBrief);
        await set(BRIEFS_KEY, briefs);
        return newBrief.id;
    } catch (error) {
        console.error('Failed to duplicate brief', error);
        return null;
    }
}

export async function updateBriefStatus(id: string, status: Brief['status']) {
    try {
        const briefs = await getBriefs();
        const index = briefs.findIndex(b => b.id === id);
        if (index >= 0) {
            briefs[index].status = status;
            briefs[index].updatedAt = new Date().toISOString();
            await set(BRIEFS_KEY, briefs);
        }
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
    // Let's clear indexeddb too as part of "clearAllData"
    if (window.indexedDB) {
        import('idb-keyval').then(({ clear }) => clear().catch(e => console.error(e)));
    }
    setTimeout(() => window.location.reload(), 100);
}

export async function loadDemoData() {
    const briefs = await getBriefs();
    const toAdd = DEMO_BRIEFS.map(b => ({
        ...b, id: crypto.randomUUID()
    }));
    await set(BRIEFS_KEY, [...briefs, ...toAdd]);
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
        const templates = await get<Template[]>(TEMPLATES_KEY);
        if (templates && templates.length > 0) return templates;
        return DEFAULT_TEMPLATES;
    } catch (e) {
        console.error("Failed to load templates", e);
        return DEFAULT_TEMPLATES;
    }
}

export async function saveTemplate(template: Template) {
    try {
        const templates = await getTemplates();
        const index = templates.findIndex(t => t.id === template.id);
        if (index >= 0) {
            templates[index] = template;
        } else {
            templates.push(template);
        }
        await set(TEMPLATES_KEY, templates);
    } catch (e) {
        console.error("Failed to save template", e);
    }
}

export async function deleteTemplate(id: string) {
    try {
        let templates = await getTemplates();
        templates = templates.filter(t => t.id !== id);
        await set(TEMPLATES_KEY, templates);
    } catch (e) {
        console.error("Failed to delete template", e);
    }
}
