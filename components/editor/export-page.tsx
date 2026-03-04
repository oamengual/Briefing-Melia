'use client';

import * as React from 'react';
import { useBriefingStore } from '@/lib/store';
import { useEditorStore } from '@/lib/editor-store';
import { ExportPreview } from '@/components/editor/export-preview';
import { FeedRow } from '@/components/editor/export/types';
import { getTemplateState, getPsd, saveTemplateState } from '@/lib/psd-storage';
import { parsePsd } from '@/lib/psd-utils';
import { MARKETS, PLACEMENTS as SEED_PLACEMENTS } from '@/lib/constants';
import { getPlacements } from '@/lib/storage';
import { Brief, Market, Placement, EditorState, PsdTemplate } from '@/lib/types';

export function ExportPage({ brief, brandFonts = [] }: { brief: Brief, brandFonts?: any[] }) {
    const { psdTemplates } = useBriefingStore();
    const { setFeedData } = useEditorStore();
    const [hydratedTemplates, setHydratedTemplates] = React.useState<PsdTemplate[]>([]);
    const [loading, setLoading] = React.useState(true);

    // Dynamic Placements State
    const [placements, setPlacements] = React.useState<Placement[]>(SEED_PLACEMENTS);
    React.useEffect(() => {
        setPlacements(getPlacements());
    }, []);

    // 1. Initialize Templates List (Lazy Load State later)
    React.useEffect(() => {
        if (psdTemplates) {
            setHydratedTemplates(psdTemplates.map(t => ({ ...t, editorState: undefined })));
            setLoading(false);
        }
    }, [psdTemplates]);

    // ...

    const handleLoadState = React.useCallback(async (id: string) => {
        try {
            // 1. Try fast path (pre-parsed state)
            let state = await getTemplateState(id);

            // 2. Fallback: Parse from stored PSD file
            if (!state) {
                console.log(`State missing for ${id}, attempting fallback parse...`);
                const file = await getPsd(id);
                if (file) {
                    const parsed = await parsePsd(file as File);
                    state = parsed.state as EditorState;
                    // Self-heal: save it for next time
                    await saveTemplateState(id, state);
                }
            }

            if (state) {
                setHydratedTemplates(prev => prev.map(t =>
                    t.id === id ? { ...t, editorState: state } : t
                ));
            } else {
                console.warn("Could not recover state for template", id);
            }
        } catch (error) {
            console.error("Failed to load state for", id, error);
        }
    }, []);

    // 2. Hydrate Feed Data (Media Rows) from Brief
    // This ensures ExportPreview has the list of variants to generate
    React.useEffect(() => {
        if (!brief || !brief.state) return;

        const { matrix, inputs, creative, namingConvention, translations } = brief.state;

        // Logic from FeedPreview to generate rows
        const effectiveStructure = namingConvention?.structure || [
            'size', 'format', 'strategy', 'year', 'month', 'brand', 'channel',
            'campaign_name', 'market_code', 'language', 'agency', 'content_type',
            'duration', 'version'
        ];
        const separator = namingConvention ? namingConvention.separator : '-';

        const rows: FeedRow[] = [];
        const processedKeys = new Set<string>();

        const resolveToken = (token: string, data: {
            placement: Placement,
            market: Market,
            inputs: any,
            isPattern?: boolean
        }): string => {
            if (data.isPattern) {
                if (token === 'channel') return '{{channel}}';
                if (token === 'size') return '{{size}}';
                if (token === 'format') return '{{format}}';
                if (token === 'duration') return '{{duration}}';
            }
            switch (token) {
                case 'size': return data.placement.size;
                case 'format': return data.placement.format;
                case 'strategy': return data.inputs.strategy || 'strategy';
                case 'year': return data.inputs.year;
                case 'month': return data.inputs.month;
                case 'brand': return data.inputs.brand;
                case 'channel': return data.placement.channel;
                case 'campaign_name': return data.inputs.campaignName || 'CAMPAIGN';
                case 'market_code': return data.market.code;
                case 'language': return data.market.defaultLang;
                case 'agency': return data.inputs.agency || 'AGENCY';
                case 'content_type': return 'content';
                case 'duration': return data.placement.seconds;
                case 'version': return 'v1';
                default: return '';
            }
        };

        Object.entries(matrix).forEach(([marketSelector, placementIds]) => {
            let lookupSelector = marketSelector;
            if (marketSelector.startsWith('ZH')) lookupSelector = 'CN (China)';

            const market = MARKETS.find((m) => m.selector === lookupSelector);
            if (!market) return;

            // Filter by active regions
            if (inputs.regions && !inputs.regions.includes(market.region)) return;

            // Resolve Translations
            // 1. Identify Language (Translations are keyed by lang code 'es', not market 'ES')
            const langCode = market.defaultLang || 'en';

            // 2. Get Overrides
            const langOverrides = translations?.[langCode] || {};

            // 3. Merge: CampaignInputs + CreativeInputs + TranslatonOverrides
            // This ensures row has "claim", "cta" etc populated and localized
            const finalInputs = {
                ...inputs,
                ...creative,
                ...langOverrides
            };

            placementIds.forEach((pid: string) => {
                const placement = placements.find((p) => p.id === pid);
                if (!placement) return;

                // De-duplication Key: Market + Size
                const uniqueKey = `${market.code}-${placement.size}`;

                if (processedKeys.has(uniqueKey)) return;
                processedKeys.add(uniqueKey);

                // 1. Generate Display Filename
                const displayParts = effectiveStructure.map(token => {
                    if (token === 'channel') return 'Universal';
                    const raw = resolveToken(token, { placement, market, inputs: finalInputs });
                    return raw ? raw.trim().replace(/\s+/g, '_') : 'na';
                });
                const displayFilename = displayParts.join(separator).toLowerCase();

                // 2. Generate Pattern Filename
                const patternParts = effectiveStructure.map(token => {
                    const raw = resolveToken(token, { placement, market, inputs: finalInputs, isPattern: true });
                    return raw ? raw.trim().replace(/\s+/g, '_') : 'na';
                });
                const filenamePattern = patternParts.join(separator).toLowerCase();

                rows.push({
                    id: crypto.randomUUID(),
                    filename: displayFilename,
                    filenamePattern: filenamePattern,
                    market: market.code,
                    marketSelector: market.selector, // Pass full selector for matrix lookup
                    placement: placement.id,
                    width: parseInt(placement.size.split('x')[0]),
                    height: parseInt(placement.size.split('x')[1]),
                    ...finalInputs // Use the market-specific merged inputs
                });
            });
        });

        // Update Store
        setFeedData({
            headers: ['filename', 'market', 'placement'],
            rows
        });

    }, [brief, setFeedData, placements]);

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center p-12 text-muted-foreground animate-pulse">
                <div className="w-12 h-12 rounded-full border-4 border-primary/20 border-t-primary animate-spin mb-4" />
                <p className="text-sm font-bold uppercase tracking-tight">Loading campaign templates...</p>
            </div>
        );
    }

    return (
        <ExportPreview
            templates={hydratedTemplates}
            brief={brief}
            onLoadState={handleLoadState}
        />
    );
}
