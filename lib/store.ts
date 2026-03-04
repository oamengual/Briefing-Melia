import { create } from 'zustand';
import { CampaignInputs, MatrixState, CreativeInputs, NamingConvention, TraffickingData, PsdTemplate, ContentConfig, MarketContentSettings, LandingMarketConfig, BriefTranslation } from './types';
import { getSettings } from './storage';

export interface BriefingState {
    inputs: CampaignInputs;
    creative: CreativeInputs;
    translations: Record<string, BriefTranslation>; // Key: 'es', 'fr', etc.
    matrix: MatrixState; // Key: Market Selector (e.g. "US (Estados Unidos)"), Value: Array of Placement IDs
    lockedFields: string[]; // Fields that should not be auto-translated
    namingConvention?: NamingConvention; // The convention used for this brief
    psdTemplateId?: string;
    psdTemplates?: PsdTemplate[];
    trafficking: Record<string, TraffickingData>; // Key: "marketSelector_placementId"
    content: ContentConfig;

    // Actions
    setInputs: (inputs: Partial<CampaignInputs>) => void;
    setCreative: (inputs: Partial<CreativeInputs>) => void;
    setTranslation: (lang: string, inputs: BriefTranslation) => void;
    togglePlacement: (marketSelector: string, placementId: string) => void;
    toggleMarketAll: (marketSelector: string, placementIds: string[], force?: boolean) => void; // Convenience to select all
    togglePlacementRow: (marketSelectors: string[], placementId: string, force?: boolean) => void;
    toggleFieldLock: (field: string) => void;
    setNamingConvention: (convention: NamingConvention) => void;
    setPsdTemplateId: (id?: string) => void;
    addPsdTemplate: (tpl: PsdTemplate) => void;
    removePsdTemplate: (id: string) => void;
    setTrafficking: (id: string, data: Partial<TraffickingData>) => void;

    // Content Actions
    setContentField: (field: 'mainMessage' | 'considerations' | 'legalTexts', defaultText: string) => void;
    setContentExceptions: (field: 'mainMessage' | 'considerations' | 'legalTexts', exceptions: any[]) => void;
    setMarketSetting: (market: string, updates: Partial<MarketContentSettings>) => void;
    setLandingConfig: (market: string, updates: Partial<LandingMarketConfig>) => void;

    // Persistence
    loadBrief: (state: {
        inputs: CampaignInputs,
        creative: CreativeInputs,
        translations: Record<string, BriefTranslation>,
        matrix: MatrixState,
        lockedFields?: string[],
        namingConvention?: NamingConvention,
        psdTemplateId?: string,
        psdTemplates?: PsdTemplate[],
        trafficking?: Record<string, TraffickingData>,
        content?: ContentConfig
    }) => void;
    reset: () => void;
}

const DEFAULT_INPUTS: CampaignInputs = {
    campaignName: '',
    brand: 'Riu', // Keep existing default for brand
    strategy: 'Flash', // Keep existing default for strategy
    year: new Date().getFullYear().toString(),
    month: (new Date().getMonth() + 1).toString().padStart(2, '0'), // Keep existing default for month
    agency: 'Internal', // Keep existing default for agency
    regions: ['AME', 'EMEA', 'APAC'], // Keep existing default for regions
    defaultLanguage: 'en',
    marketingObjective: '',
    kpi: '',
    targetAudience: '',
    landingPageUrl: '',
    assignedTo: ''
};

const DEFAULT_CREATIVE: CreativeInputs = {
    claim: '',
    discount: '',
    cta: '',
    usp1: '',
    usp2: '',
    usp3: '',
    keyVisualUrl: '',
};

const DEFAULT_CONTENT: ContentConfig = {
    mainMessage: { defaultText: '', exceptions: [] },
    considerations: { defaultText: '', exceptions: [] },
    legalTexts: { defaultText: '', exceptions: [] },
    marketSettings: {},
    landingConfig: {}
};

export const useBriefingStore = create<BriefingState>((set) => ({
    inputs: DEFAULT_INPUTS,
    creative: DEFAULT_CREATIVE,
    translations: {},
    matrix: {},
    lockedFields: [],
    psdTemplateId: undefined,
    psdTemplates: [],
    trafficking: {},
    content: DEFAULT_CONTENT,

    setPsdTemplateId: (id) => set({ psdTemplateId: id }),
    addPsdTemplate: (tpl) => set((state) => ({ psdTemplates: [...(state.psdTemplates || []), tpl] })),
    removePsdTemplate: (id) => set((state) => ({ psdTemplates: (state.psdTemplates || []).filter(t => t.id !== id) })),
    setTrafficking: (id, data) => set((state) => ({
        trafficking: {
            ...state.trafficking,
            [id]: { ...state.trafficking[id], ...data }
        }
    })),

    setContentField: (field, defaultText) => set((state) => ({
        content: {
            ...state.content,
            [field]: { ...state.content[field], defaultText }
        }
    })),

    setContentExceptions: (field, exceptions) => set((state) => ({
        content: {
            ...state.content,
            [field]: { ...state.content[field], exceptions }
        }
    })),

    setMarketSetting: (market, updates) => set((state) => {
        const currentSettings = state.content.marketSettings[market] || {
            addTransferLink: false,
            addRiuClassLink: false,
            excludeGaroe: false,
            excludeFlightHotel: false,
            excludePlazaHotels: false,
            locations: {
                landing: false, newsletterB2C: false, newsletterRC: false,
                lastMinuteNewsletterB2C: false, lastMinuteNewsletterRC: false,
                pushB2C: false, pushRC: false, lastMinutePushB2C: false, lastMinutePushRC: false
            }
        };
        return {
            content: {
                ...state.content,
                marketSettings: {
                    ...state.content.marketSettings,
                    [market]: { ...currentSettings, ...updates }
                }
            }
        };
    }),

    setLandingConfig: (market, updates) => set((state) => {
        const currentConfig = state.content.landingConfig[market] || {
            url: '', updateDate: '', hasFastbooking: false, hotelsToShow: '',
            showPromoCode: false, promoCodeText: '', hasCountdown: false, countdownDate: ''
        };
        return {
            content: {
                ...state.content,
                landingConfig: {
                    ...state.content.landingConfig,
                    [market]: { ...currentConfig, ...updates }
                }
            }
        };
    }),

    setInputs: (newInputs) =>
        set((state) => ({ inputs: { ...state.inputs, ...newInputs } })),

    setCreative: (newCreative) =>
        set((state) => ({ creative: { ...state.creative, ...newCreative } })),

    setTranslation: (lang, newValues) =>
        set((state) => ({
            translations: {
                ...state.translations,
                [lang]: { ...state.translations[lang], ...newValues }
            }
        })),

    loadBrief: (loadedState) => set({
        inputs: loadedState.inputs,
        creative: loadedState.creative,
        translations: loadedState.translations,
        matrix: loadedState.matrix,
        lockedFields: loadedState.lockedFields || [],
        namingConvention: loadedState.namingConvention,
        psdTemplateId: loadedState.psdTemplateId,
        psdTemplates: loadedState.psdTemplates || [],
        trafficking: loadedState.trafficking || {},
        content: loadedState.content || DEFAULT_CONTENT
    }),

    reset: () => {
        const settings = getSettings();
        set({
            inputs: {
                ...DEFAULT_INPUTS,
                agency: settings.defaultAgency || DEFAULT_INPUTS.agency,
                defaultLanguage: settings.defaultCampaignLanguage || DEFAULT_INPUTS.defaultLanguage
            },
            creative: DEFAULT_CREATIVE,
            translations: {},
            matrix: {},
            lockedFields: [],
            namingConvention: settings.activeNamingConvention, // Initialize with global default
            psdTemplateId: undefined,
            psdTemplates: [],
            trafficking: {},
            content: DEFAULT_CONTENT
        });
    },

    setNamingConvention: (convention) => set({ namingConvention: convention }),

    toggleFieldLock: (field) =>
        set((state) => {
            const exists = state.lockedFields.includes(field);
            return {
                lockedFields: exists
                    ? state.lockedFields.filter(f => f !== field)
                    : [...state.lockedFields, field]
            };
        }),

    togglePlacement: (marketSelector, placementId) =>
        set((state) => {
            const currentList = state.matrix[marketSelector] || [];
            const exists = currentList.includes(placementId);

            let newList;
            if (exists) {
                newList = currentList.filter((id) => id !== placementId);
            } else {
                newList = [...currentList, placementId];
            }

            return {
                matrix: {
                    ...state.matrix,
                    [marketSelector]: newList,
                },
            };
        }),

    toggleMarketAll: (marketSelector, placementIds, force) =>
        set((state) => {
            return {
                matrix: {
                    ...state.matrix,
                    [marketSelector]: force ? placementIds : []
                }
            };
        }),

    togglePlacementRow: (marketSelectors, placementId, force) =>
        set((state) => {
            const newMatrix = { ...state.matrix };
            marketSelectors.forEach(selector => {
                const current = newMatrix[selector] || [];
                if (force) {
                    // Add if not present
                    if (!current.includes(placementId)) {
                        newMatrix[selector] = [...current, placementId];
                    }
                } else {
                    // Remove
                    newMatrix[selector] = current.filter(id => id !== placementId);
                }
            });
            return { matrix: newMatrix };
        }),


}));
