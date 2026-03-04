'use client';

import * as React from 'react';


import { getBrief, saveBrief } from '@/lib/storage';
import { Brief } from '@/lib/types';
import { saveTemplateState, getTemplateState, getPsd, saveTemplatePreview, getTemplatePreview } from '@/lib/psd-storage';
import { parsePsd } from '@/lib/psd-utils';
import { EditorState, Brand, BrandAsset, PsdTemplate } from '@/lib/types';
import { useEditorStore } from '@/lib/editor-store';
import { getBrands, getAsset } from '@/lib/brand-storage';

import { cn } from '@/lib/utils';
import { PsdUploader } from '@/components/editor/psd-uploader';
import { EditorCanvas } from '@/components/editor/canvas';
import { LayerPanel } from '@/components/editor/layer-panel';
import { PropertiesPanel } from '@/components/editor/properties-panel';
import { FeedPanel } from '@/components/editor/feed-panel';
import { TemplatePanel } from '@/components/editor/template-panel';

import {
    Layers, Database, Settings,
    AlignHorizontalJustifyStart, AlignHorizontalJustifyCenter, AlignHorizontalJustifyEnd,
    AlignVerticalJustifyStart, AlignVerticalJustifyCenter, AlignVerticalJustifyEnd,
    AlignHorizontalDistributeCenter, AlignVerticalDistributeCenter,
    Maximize2, Minimize2
} from 'lucide-react';

import { MARKETS } from '@/lib/constants';




export function IntegratedEditor({ briefId, brief, brandFonts = [], activeBrand = null }: { briefId: string, brief?: Brief, brandFonts?: BrandAsset[], activeBrand?: Brand | null }) {
    const {
        layers, width, height, setCanvas,
        feedData, currentFeedRow, setCurrentRow, setFeedData, getState, alignSelectedLayers, distributeSelectedLayers, selectedLayerIds
    } = useEditorStore();

    const [loading, setLoading] = React.useState(true);
    const [briefName, setBriefName] = React.useState('');
    const [currentBrief, setCurrentBrief] = React.useState<Brief | null>(null);
    const [psdTemplates, setPsdTemplates] = React.useState<PsdTemplate[]>([]);
    const [isFullScreen, setIsFullScreen] = React.useState(false);

    // Remove local Brand Assets State (now props)

    const saveTimeoutRef = React.useRef<NodeJS.Timeout>(null);

    React.useEffect(() => {
        let isMounted = true;

        const loadData = async () => {
            // Source of truth: Prop (live) -> Storage (disk)
            let sourceBrief = brief;
            if (!sourceBrief && briefId) {
                sourceBrief = await getBrief(briefId) || undefined;
            }

            if (!sourceBrief) {
                setLoading(false);
                return;
            }

            // Hydrate psdTemplates with data from IndexedDB
            let hydratedTemplates: PsdTemplate[] = sourceBrief.state.psdTemplates || [];

            // If we have templates, we try to load their editorState and preview from IDB
            if (hydratedTemplates.length > 0) {
                const promises = hydratedTemplates.map(async (tpl) => {
                    const updatedTpl = { ...tpl };

                    // 1. Hydrate State
                    if (!updatedTpl.editorState) {
                        const savedState = await getTemplateState(tpl.id);
                        if (savedState) {
                            updatedTpl.editorState = savedState;
                        }
                    }

                    // 2. Hydrate Preview
                    if (!updatedTpl.preview) {
                        const savedPreview = await getTemplatePreview(tpl.id);
                        if (savedPreview) {
                            updatedTpl.preview = savedPreview;
                        }
                    }

                    return updatedTpl;
                });
                hydratedTemplates = await Promise.all(promises);
            }

            if (isMounted) {
                // Update local state WITH the hydrated templates (including editorStates)
                setPsdTemplates(hydratedTemplates);

                // Update brief state reference just for this run (don't save back to LS yet)
                sourceBrief = {
                    ...sourceBrief,
                    state: {
                        ...sourceBrief.state,
                        psdTemplates: hydratedTemplates
                    }
                };

                setCurrentBrief(sourceBrief);
                setBriefName(sourceBrief.name);

                // Brand loading moved to BriefingBuilder
            }

            // 1. Load Active PSD Template
            if (sourceBrief.state.psdTemplateId) {
                // ... (rest of the effect)

                try {
                    // Check if we have saved state first (from our hydrated list)
                    const savedTpl = hydratedTemplates.find(t => t.id === sourceBrief.state.psdTemplateId);

                    if (savedTpl?.editorState) {
                        setCanvas(savedTpl.editorState);
                    } else {
                        // Fallback to parsing file
                        const file = await getPsd(sourceBrief.state.psdTemplateId);
                        if (file && isMounted) {
                            const { state: psdState } = await parsePsd(file as File);
                            setCanvas(psdState);
                        }
                    }
                } catch (err) {
                    console.error("Failed to load PSD Template", err);
                }
            }

            // 2. Generate Feed Data from Brief
            try {
                const { matrix, creative, translations, inputs } = sourceBrief.state;
                const seenMarkets = new Set<string>();
                const rows: Record<string, string>[] = [];

                Object.entries(matrix).forEach(([marketSelector, placementIds]) => {
                    if (!placementIds || (placementIds as string[]).length === 0) return;

                    let lookupSelector = marketSelector;
                    // Handle legacy key migration: ZH (China) -> CN (China)
                    if (marketSelector.startsWith('ZH')) lookupSelector = 'CN (China)';

                    // Find Market Data (We need Code and Default Lang)
                    const market = MARKETS.find((m) => m.selector === lookupSelector);
                    if (!market) return;

                    // Unify by Market Code to prevent duplicates
                    if (seenMarkets.has(market.code)) return;
                    seenMarkets.add(market.code);

                    const lang = market.defaultLang;
                    const localTrans = translations[lang] || translations[market.code] || {};

                    const resolvedCreative = {
                        claim: localTrans.claim || creative.claim,
                        discount: localTrans.discount || creative.discount,
                        cta: localTrans.cta || creative.cta,
                        usp1: localTrans.usp1 || creative.usp1,
                        usp2: localTrans.usp2 || creative.usp2,
                        usp3: localTrans.usp3 || creative.usp3,
                    };

                    let datasetName = '';

                    const nc = sourceBrief.state.namingConvention;
                    if (nc && nc.structure && nc.structure.length > 0) {
                        const parts = nc.structure.map((token: string) => {
                            switch (token) {
                                case 'size': return '{{size}}'; // Placeholder for export
                                // case 'format': return '{{format}}'; // Usually 'png' or 'jpg', implicit in ext
                                case 'strategy': return inputs.strategy;
                                case 'brand': return inputs.brand;
                                case 'campaign_name': return inputs.campaignName;
                                case 'market_code': return market.code;
                                case 'language': return market.defaultLang;
                                case 'agency': return inputs.agency;
                                case 'year': return inputs.year;
                                case 'month': return inputs.month;
                                case 'separator': return nc.separator;
                                default: return '';
                            }
                        });
                        // Filter out empty parts if they are just separators? No, separators are tokens.
                        // Actually, if 'separator' is a token type, we just return the separator char.
                        // If the structure implies implicit separators, we use nc.separator to join.
                        // Looking at types.ts: 'separator' IS a token type.
                        // But usually structure is [Brand, generic_sep, Strategy].
                        // OR structure is [Brand, Strategy] and we join with nc.separator.
                        // Let's assume explicit separator tokens if they exist, OR we join with `nc.separator` if tokens don't include explicit separators?
                        // Re-reading types.ts: NamingToken includes 'separator'.
                        // If the user built [Brand, -, Strategy], then map returns value.
                        // If distinct tokens, we probably shouldn't double join.
                        // Let's just join with "" if strict, or join with separator if structure is just fields.

                        // Most builders perform: [Field] [Sep] [Field].
                        // If I map them all, I get strings. Join with empty string.
                        datasetName = parts.map((p: string | number | null | undefined) => p ? p.toString() : '').join('').toLowerCase();

                    } else {
                        // Fallback - STRICT NEW STRUCTURE
                        // Structure: 160x600-img-flash-2025-dec-riu-amazon_dsp-black_friday-ca-en-internal-content-na-v1
                        // Tokens: {{size}}-{{format}}-strategy-year-month-brand-{{channel}}-campaign-market-lang-agency-content-{{duration}}-v1
                        const parts = [
                            '{{size}}',
                            '{{format}}',
                            inputs.strategy,
                            inputs.year,
                            inputs.month,
                            inputs.brand,
                            '{{channel}}',
                            inputs.campaignName,
                            market.code,
                            market.defaultLang,
                            inputs.agency || 'internal',
                            'content', // Static content type?
                            '{{duration}}',
                            'v1' // Static version?
                        ];
                        // user wants lower case, separated by hyphens (judging by example)
                        datasetName = parts.map(p => (p || 'na').toString().toLowerCase()).join('-');
                    }

                    const row: Record<string, string> = {
                        filename: datasetName,
                        filenamePattern: datasetName, // Preserve pattern for export resolution
                        dataset_name: datasetName, // Explicit fallback
                        market: market.code,
                        marketSelector: marketSelector,
                        language: market.defaultLang,
                        market_language: `${market.code.toLowerCase()}-${market.defaultLang.toLowerCase()}`,
                    };

                    Object.entries(inputs).forEach(([key, val]) => {
                        if (typeof val === 'string') row[key] = val;
                    });

                    Object.entries(resolvedCreative).forEach(([key, val]) => {
                        if (key && typeof val === 'string') row[key] = val;
                    });

                    rows.push(row);
                });

                if (rows.length > 0 && isMounted) {
                    const headers = Object.keys(rows[0]);
                    setFeedData({ headers, rows });
                    setCurrentRow(0);
                } else if (isMounted) {
                    setFeedData({ headers: [], rows: [] });
                }
            } catch (err) {
                console.error("Failed to generate feed data", err);
            }
            if (isMounted) setLoading(false);
        };
        loadData();
        return () => { isMounted = false; };
    }, [briefId, setCanvas, setFeedData, setCurrentRow, brief, getState]);


    // Auto-Save Logic
    React.useEffect(() => {
        if (!currentBrief || loading) return;

        const saveState = async () => {
            const currentState = getState();

            // Find active template
            const activeTplIndex = psdTemplates.findIndex(t => t.id === currentBrief.state.psdTemplateId);
            if (activeTplIndex === -1) return;

            const activeTpl = psdTemplates[activeTplIndex];

            // 1. Save heavy state to IndexedDB
            await saveTemplateState(activeTpl.id, currentState);

            // 1b. Save preview to IndexedDB
            if (activeTpl.preview) {
                await saveTemplatePreview(activeTpl.id, activeTpl.preview);
            }

            // 2. Update Local State (InMemory) so UI/Export sees it
            const updatedTpl = { ...activeTpl, editorState: currentState };
            const newTpls = [...psdTemplates];
            newTpls[activeTplIndex] = updatedTpl;
            setPsdTemplates(newTpls);

            // 3. Persist Metadata to LocalStorage (Brief)
            // Note: saveBrief will strip editorState AND preview automatically
            await saveBrief({
                ...currentBrief.state.inputs,
                creative: currentBrief.state.creative,
                translations: currentBrief.state.translations,
                matrix: currentBrief.state.matrix,
                lockedFields: currentBrief.state.lockedFields,
                namingConvention: currentBrief.state.namingConvention,
                psdTemplates: newTpls, // Passed with full data, stripped by saveBrief
                psdTemplateId: currentBrief.state.psdTemplateId,
                trafficking: currentBrief.state.trafficking
            }, briefId);
        };

        if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
        saveTimeoutRef.current = setTimeout(saveState, 1000);

        return () => {
            if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
        };
    }, [layers, width, height, currentBrief, psdTemplates, briefId, getState, loading]);


    const handleBatchAddTemplates = async (newTpls: PsdTemplate[]) => {
        setPsdTemplates(prev => {
            const updatedTpls = [...prev, ...newTpls];

            // Save states and previews in background parallelized
            Promise.all(newTpls.map(async (tpl) => {
                if (tpl.editorState) await saveTemplateState(tpl.id, tpl.editorState);
                if (tpl.preview) await saveTemplatePreview(tpl.id, tpl.preview);
            })).then(async () => {
                if (currentBrief) {
                    let activeId = currentBrief.state.psdTemplateId;
                    if (!activeId && newTpls.length > 0) {
                        activeId = newTpls[0].id;
                    }

                    const saveParams = {
                        ...currentBrief.state.inputs,
                        creative: currentBrief.state.creative,
                        translations: currentBrief.state.translations,
                        matrix: currentBrief.state.matrix,
                        lockedFields: currentBrief.state.lockedFields,
                        namingConvention: currentBrief.state.namingConvention,
                        psdTemplates: updatedTpls,
                        psdTemplateId: activeId,
                        trafficking: currentBrief.state.trafficking
                    };

                    await saveBrief(saveParams as any, briefId);
                    setCurrentBrief((prevBrief: Brief | null) => prevBrief ? {
                        ...prevBrief,
                        state: {
                            ...prevBrief.state,
                            psdTemplates: updatedTpls,
                            psdTemplateId: activeId
                        }
                    } : null);

                    if (activeId && activeId !== currentBrief.state.psdTemplateId) {
                        const tpl = newTpls.find(t => t.id === activeId);
                        if (tpl?.editorState) {
                            setCanvas({ ...tpl.editorState, feedData: getState().feedData });
                        }
                    }
                }
            });

            return updatedTpls;
        });
    };

    const handleAddTemplate = async (tpl: PsdTemplate) => {
        handleBatchAddTemplates([tpl]);
    };

    const handleRemoveTemplate = async (id: string) => {
        const newTpls = psdTemplates.filter(t => t.id !== id);
        setPsdTemplates(newTpls);

        // Clean up IDB
        // deleteTemplateState(id); // Import this if needed, or leave it

        if (currentBrief) {
            let newActiveId = currentBrief.state.psdTemplateId;
            if (currentBrief.state.psdTemplateId === id) {
                newActiveId = undefined;
            }

            const updatedState = { ...currentBrief.state, psdTemplates: newTpls, psdTemplateId: newActiveId };

            await saveBrief({
                ...currentBrief.state.inputs,
                creative: currentBrief.state.creative,
                translations: currentBrief.state.translations,
                matrix: currentBrief.state.matrix,
                lockedFields: currentBrief.state.lockedFields,
                namingConvention: currentBrief.state.namingConvention,
                psdTemplates: newTpls,
                psdTemplateId: newActiveId,
                trafficking: currentBrief.state.trafficking
            }, briefId);

            setCurrentBrief((prev: Brief | null) => prev ? { ...prev, state: updatedState } : null);
        }
    };

    const handleSelectTemplate = async (id: string) => {
        // Capture current feed data to preserve it across template switches
        const currentFeedData = getState().feedData;

        // 1. Try In-Memory State
        const tpl = psdTemplates.find(t => t.id === id);

        if (tpl?.editorState) {
            // Merge preserved feed data
            setCanvas({ ...tpl.editorState, feedData: currentFeedData });
        } else {
            // 2. Try IndexedDB
            const savedState = await getTemplateState(id);
            if (savedState) {
                setCanvas({ ...savedState, feedData: currentFeedData });

                // Hydrate preview if missing
                let preview = tpl?.preview;
                if (!preview) {
                    preview = await getTemplatePreview(id);
                }

                // Update memory
                const updatedTpls = psdTemplates.map(t => t.id === id ? { ...t, editorState: savedState, preview } : t);
                setPsdTemplates(updatedTpls);
            } else {
                // 3. Fallback to File
                const file = await getPsd(id);
                if (file) {
                    const { state } = await parsePsd(file as File);
                    setCanvas({ ...state, feedData: currentFeedData });
                    // Init IDB
                    await saveTemplateState(id, state);
                }
            }
        }

        if (currentBrief) {
            const updatedState = { ...currentBrief.state, psdTemplateId: id };
            await saveBrief({
                ...currentBrief.state.inputs,
                creative: currentBrief.state.creative,
                translations: currentBrief.state.translations,
                matrix: currentBrief.state.matrix,
                lockedFields: currentBrief.state.lockedFields,
                namingConvention: currentBrief.state.namingConvention,
                psdTemplates: psdTemplates, // Keep persisted ones
                psdTemplateId: id,
                trafficking: currentBrief.state.trafficking
            }, briefId);
            setCurrentBrief((prev: Brief | null) => prev ? { ...prev, state: updatedState } : null);
        }
    };

    // Calculate derived state
    const hasContent = layers.length > 0;

    return (
        <div className={cn(
            "flex bg-muted/30 w-full radius-card overflow-hidden font-sans text-xs select-none shadow-card border border-border relative transition-all duration-300",
            isFullScreen ? "fixed inset-0 z-[100] h-screen w-screen rounded-none border-none m-0" : "h-[850px]"
        )}>

            {/* Left Panel */}
            <aside className="w-[280px] bg-card flex flex-col shrink-0 z-10 shadow-sm border-r border-border">
                <div className="flex-1 flex flex-col min-h-[200px] overflow-hidden border-b border-border">
                    <div className="h-12 px-6 flex items-center gap-2 text-[11px] font-bold text-foreground shrink-0 uppercase tracking-widest bg-card">
                        <Layers className="w-4 h-4 text-primary" /> Layers
                    </div>
                    <div className="flex-1 overflow-hidden px-2 pb-2">
                        <LayerPanel />
                    </div>
                </div>
                <div className="h-1/3 flex flex-col bg-card">
                    <div className="h-12 px-6 flex items-center gap-2 text-[11px] font-bold text-foreground shrink-0 uppercase tracking-widest bg-card border-t border-border">
                        <Database className="w-4 h-4 text-primary" /> Data Feed
                    </div>
                    <div className="flex-1 overflow-y-auto p-4 bg-card">
                        <FeedPanel />
                    </div>
                </div>
            </aside>

            {/* Canvas */}
            {/* Canvas */}
            <main className="flex-1 relative overflow-hidden flex flex-col bg-muted/30">
                {/* Single Header for Editor */}
                <div className="h-14 bg-transparent flex items-center px-6 justify-between shrink-0 z-10 pointer-events-none">
                    <div className="flex items-center gap-2 pointer-events-auto">
                        <div className="flex items-center gap-1 bg-card p-1.5 radius-lg shadow-sm border border-border">
                            <button onClick={() => alignSelectedLayers('left')} className="p-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-md transition-colors" title="Align Left">
                                <AlignHorizontalJustifyStart className="w-4 h-4" />
                            </button>
                            <button onClick={() => alignSelectedLayers('center')} className="p-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-md transition-colors" title="Align Center">
                                <AlignHorizontalJustifyCenter className="w-4 h-4" />
                            </button>
                            <button onClick={() => alignSelectedLayers('right')} className="p-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-md transition-colors" title="Align Right">
                                <AlignHorizontalJustifyEnd className="w-4 h-4" />
                            </button>
                            <div className="w-[1px] h-4 bg-border mx-1" />
                            <button onClick={() => alignSelectedLayers('top')} className="p-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-md transition-colors" title="Align Top">
                                <AlignVerticalJustifyStart className="w-4 h-4" />
                            </button>
                            <button onClick={() => alignSelectedLayers('middle')} className="p-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-md transition-colors" title="Align Middle">
                                <AlignVerticalJustifyCenter className="w-4 h-4" />
                            </button>
                            <button onClick={() => alignSelectedLayers('bottom')} className="p-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-md transition-colors" title="Align Bottom">
                                <AlignVerticalJustifyEnd className="w-4 h-4" />
                            </button>

                            {selectedLayerIds && selectedLayerIds.length > 1 && (
                                <>
                                    <div className="w-[1px] h-4 bg-border mx-1" />
                                    <button onClick={() => distributeSelectedLayers('horizontal')} className="p-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-md transition-colors" title="Distribute Horizontal Centers">
                                        <AlignHorizontalDistributeCenter className="w-4 h-4" />
                                    </button>
                                    <button onClick={() => distributeSelectedLayers('vertical')} className="p-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-md transition-colors" title="Distribute Vertical Centers">
                                        <AlignVerticalDistributeCenter className="w-4 h-4" />
                                    </button>
                                </>
                            )}
                        </div>

                    </div>

                    <div className="flex items-center gap-2 pointer-events-auto">
                        <div className="flex items-center gap-2 text-xs font-bold text-foreground bg-card px-4 py-2 radius-lg shadow-sm border border-border">
                            <Database className="w-3.5 h-3.5 text-primary" />
                            <span>{feedData?.rows?.length || 0} Variants</span>
                        </div>

                        <button
                            onClick={() => setIsFullScreen(!isFullScreen)}
                            className="flex items-center justify-center w-9 h-9 bg-card hover:bg-muted text-foreground radius-lg shadow-sm border border-border transition-colors"
                            title={isFullScreen ? "Exit Full Screen" : "Enter Full Screen"}
                        >
                            {isFullScreen ? (
                                <Minimize2 className="w-4 h-4" />
                            ) : (
                                <Maximize2 className="w-4 h-4" />
                            )}
                        </button>
                    </div>
                </div>

                <div className="flex-1 relative overflow-hidden flex items-center justify-center">
                    {hasContent ? (
                        <EditorCanvas />
                    ) : (
                        loading ? (
                            <div className="text-muted-foreground animate-pulse flex flex-col items-center">
                                <span className="font-bold text-sm">Loading assets...</span>
                            </div>
                        ) : (
                            <div className="absolute inset-0 flex items-center justify-center">
                                <div className="max-w-md w-full bg-card p-8 radius-card shadow-card border border-border text-center">
                                    <PsdUploader onLoad={(data) => setCanvas(data.state)} />
                                    <p className="mt-6 text-sm font-medium text-muted-foreground">
                                        No template loaded. Upload a PSD here or in the &apos;Design&apos; tab.
                                    </p>
                                </div>
                            </div>
                        )
                    )}
                </div>
            </main>

            {/* Right Panel */}
            <aside className="w-[280px] bg-card flex flex-col shrink-0 z-10 shadow-sm border-l border-border">
                <div className="h-1/3 flex flex-col border-b border-border">
                    <div className="p-4 overflow-y-auto h-full bg-card">
                        <TemplatePanel
                            templates={psdTemplates}
                            activeId={currentBrief?.state?.psdTemplateId}
                            onAdd={handleAddTemplate}
                            onAddMany={handleBatchAddTemplates}
                            onRemove={handleRemoveTemplate}
                            onSelect={handleSelectTemplate}
                        />
                    </div>
                </div>
                <div className="flex-1 flex flex-col overflow-hidden">
                    <div className="h-12 px-6 flex items-center gap-2 text-[11px] font-bold text-foreground shrink-0 uppercase tracking-widest bg-card">
                        <Settings className="w-4 h-4 text-primary" /> Properties
                    </div>
                    <div className="flex-1 overflow-y-auto p-4 bg-card">
                        <div className="flex-1 overflow-y-auto p-4 bg-card">
                            <PropertiesPanel brand={activeBrand} brandFonts={brandFonts} />
                        </div>
                    </div>
                </div>
            </aside>
        </div>
    );
}

