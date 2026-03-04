'use client';

import * as React from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useEditorStore } from '@/lib/editor-store';
import { getBrief } from '@/lib/storage';
import { getPsd, savePsd } from '@/lib/psd-storage';
import { parsePsd } from '@/lib/psd-utils';
import { EditorState, Brand, BrandAsset } from '@/lib/types';
import { getBrands, getAsset } from '@/lib/brand-storage';

import { PsdUploader } from '@/components/editor/psd-uploader';
import { EditorCanvas } from '@/components/editor/canvas';
import { LayerPanel } from '@/components/editor/layer-panel';
import { PropertiesPanel } from '@/components/editor/properties-panel';
import { FeedPanel } from '@/components/editor/feed-panel';
import { Toolbar } from '@/components/editor/toolbar';
import { Button } from '@/components/ui/button';
import { Download, Layers, Database, Settings, ChevronLeft } from 'lucide-react';
import { toPng } from 'html-to-image';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { TemplatePanel } from '@/components/editor/template-panel';
import { saveBrief } from '@/lib/storage';
import { MARKETS } from '@/lib/constants';

export default function EditorPage() {
    const params = useParams();
    const router = useRouter();
    const {
        layers, setCanvas, undo, redo,
        feedData, currentFeedRow, setCurrentRow, setFeedData
    } = useEditorStore();

    const [isExporting, setIsExporting] = React.useState(false);
    const [exportProgress, setExportProgress] = React.useState(0);
    const [loading, setLoading] = React.useState(true);
    const [briefName, setBriefName] = React.useState('');
    const [briefPsdTemplates, setBriefPsdTemplates] = React.useState<{ id: string; name: string; size: string; preview?: string }[]>([]);
    const [activeTemplateId, setActiveTemplateId] = React.useState<string | undefined>();
    const [activeBrand, setActiveBrand] = React.useState<Brand | null>(null);
    const [brandFonts, setBrandFonts] = React.useState<BrandAsset[]>([]);

    const briefId = params.id as string;

    // Initial Load
    React.useEffect(() => {
        const loadData = async () => {
            if (!briefId) return;

            const brief = await getBrief(briefId);
            if (!brief) {
                alert('Brief not found');
                router.push('/');
                return;
            }
            setBriefName(brief.name);

            // 1. Load PSD Info
            if (brief.state.psdTemplates) {
                setBriefPsdTemplates(brief.state.psdTemplates);
            }
            if (brief.state.psdTemplateId) {
                setActiveTemplateId(brief.state.psdTemplateId);
                try {
                    const file = await getPsd(brief.state.psdTemplateId);
                    if (file) {
                        const { state } = await parsePsd(file as File);
                        setCanvas(state);
                    }
                } catch (err) {
                    console.error("Failed to load PSD Template", err);
                }
            }

            // 2. Generate Feed Data from Brief
            try {
                const { matrix, creative, translations, inputs, namingConvention } = brief.state;
                const seenMarkets = new Set<string>();
                const rows: Record<string, string>[] = [];

                Object.entries(matrix).forEach(([marketSelector, placementIds]) => {
                    if (!placementIds || (placementIds as string[]).length === 0) return;

                    let lookupSelector = marketSelector;
                    if (marketSelector.startsWith('ZH')) lookupSelector = 'CN (China)';

                    const market = MARKETS.find((m: any) => m.selector === lookupSelector);
                    if (!market) return;

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

                    const parts = [
                        'GENERIC',
                        inputs.strategy,
                        inputs.brand,
                        inputs.campaignName || 'CAMPAIGN',
                        market.code,
                        market.defaultLang
                    ];
                    const datasetName = parts.map(p => p || 'na').join('-').toLowerCase();

                    const row: Record<string, string> = {
                        filename: datasetName,
                        dataset_name: datasetName,
                        market: market.code,
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

                if (rows.length > 0) {
                    const headers = Object.keys(rows[0]);
                    setFeedData({ headers, rows });
                }
            } catch (err) {
                console.error("Failed to generate feed data", err);
            }

            setLoading(false);

            // 3. Load Brand Assets
            const brandName = brief.state.inputs.brand;
            if (brandName) {
                getBrands().then(async (brands) => {
                    const match = brands.find(b => b.name.toLowerCase() === brandName.toLowerCase());
                    if (match) {
                        setActiveBrand(match);
                        const fontIds = [match.fontIds.heading, match.fontIds.body].filter((id): id is string => !!id);
                        if (fontIds.length > 0) {
                            try {
                                const fonts = await Promise.all(fontIds.map(id => getAsset(id)));
                                setBrandFonts(fonts.filter((f): f is BrandAsset => !!f && f.type === 'font'));
                            } catch (e) {
                                console.error("Error loading brand fonts", e);
                            }
                        }
                    }
                });
            }
        };

        loadData();
    }, [briefId, setCanvas, setFeedData, router]);

    // Keyboard Shortcuts (Undo/Redo)
    React.useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.metaKey || e.ctrlKey) && e.key === 'z') {
                e.preventDefault();
                if (e.shiftKey) redo();
                else undo();
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [undo, redo]);

    const handleExport = async () => {
        const node = document.getElementById('canvas-export-target');
        if (!node) return;

        if (isExporting) return;
        setIsExporting(true);
        setExportProgress(0);

        try {
            const filter = (child: HTMLElement) => !child.classList?.contains('transform-control') && !child.classList?.contains('guides');

            // 1. Single Export
            if (!feedData || feedData.rows.length === 0) {
                const dataUrl = await toPng(node, { filter, quality: 0.95, pixelRatio: 2 });
                saveAs(dataUrl, 'banner.png');
            }
            // 2. Batch Export
            else {
                const zip = new JSZip();
                const rows = feedData.rows;
                const total = rows.length;
                const originalRow = currentFeedRow;

                for (let i = 0; i < total; i++) {
                    setCurrentRow(i);
                    // Wait for render
                    await new Promise(resolve => setTimeout(resolve, 300));

                    const dataUrl = await toPng(node, { filter, quality: 0.95, pixelRatio: 2 });
                    const base64Data = dataUrl.replace(/^data:image\/png;base64,/, "");

                    let fileName = `banner_row_${i + 1}.png`;
                    if (rows[i]['filename']) fileName = `${rows[i]['filename']}.png`;
                    else if (rows[i]['name']) fileName = `${rows[i]['name']}.png`;

                    zip.file(fileName, base64Data, { base64: true });
                    setExportProgress(Math.round(((i + 1) / total) * 100));
                }

                const content = await zip.generateAsync({ type: "blob" });
                saveAs(content, `${briefName.replace(/\s+/g, '_')}_banners.zip`);

                setCurrentRow(originalRow);
            }

        } catch (error) {
            console.error('Export failed', error);
            alert('Export failed. Check console.');
        } finally {
            setIsExporting(false);
            setExportProgress(0);
        }
    };

    const handleAddTemplate = async (template: { id: string; name: string; size: string; preview?: string }) => {
        const brief = await getBrief(briefId);
        if (!brief) return;

        const newTemplates = [...(brief.state.psdTemplates || []), template];
        const isFirst = newTemplates.length === 1;
        const newActiveId = isFirst ? template.id : brief.state.psdTemplateId;

        // Update Brief
        await saveBrief({
            ...brief.state.inputs,
            creative: brief.state.creative,
            translations: brief.state.translations,
            matrix: brief.state.matrix,
            lockedFields: brief.state.lockedFields,
            namingConvention: brief.state.namingConvention,
            psdTemplates: newTemplates,
            psdTemplateId: newActiveId
        }, briefId);

        setBriefPsdTemplates(newTemplates);
        if (isFirst) {
            handleSelectTemplate(template.id);
        }
    };

    const handleSelectTemplate = async (id: string, force = false) => {
        if (!force && id === activeTemplateId) return;

        const brief = await getBrief(briefId);
        if (!brief) return;

        // Save active ID if changed
        if (id !== brief.state.psdTemplateId) {
            await saveBrief({
                ...brief.state.inputs,
                creative: brief.state.creative,
                translations: brief.state.translations,
                matrix: brief.state.matrix,
                lockedFields: brief.state.lockedFields,
                namingConvention: brief.state.namingConvention,
                psdTemplates: brief.state.psdTemplates,
                psdTemplateId: id
            }, briefId);
        }

        setActiveTemplateId(id);

        try {
            // Check if we have unsaved work? (Optional: prompt user)
            // For now, simple load.
            setLoading(true);
            const file = await getPsd(id);
            if (file) {
                const { state } = await parsePsd(file as File);
                // Reset/Set Canvas
                setCanvas(state);
            }
        } catch (err) {
            console.error("Failed to load template", err);
        } finally {
            setLoading(false);
        }
    };

    const handleRemoveTemplate = async (id: string) => {
        const brief = await getBrief(briefId);
        if (!brief) return;

        const newTemplates = (brief.state.psdTemplates || []).filter(t => t.id !== id);
        let newActiveId = brief.state.psdTemplateId;

        if (id === newActiveId) {
            newActiveId = newTemplates.length > 0 ? newTemplates[0].id : undefined;
        }

        await saveBrief({
            ...brief.state.inputs,
            creative: brief.state.creative,
            translations: brief.state.translations,
            matrix: brief.state.matrix,
            lockedFields: brief.state.lockedFields,
            namingConvention: brief.state.namingConvention,
            psdTemplates: newTemplates,
            psdTemplateId: newActiveId
        }, briefId);

        setBriefPsdTemplates(newTemplates);
        if (newActiveId && newActiveId !== activeTemplateId) {
            handleSelectTemplate(newActiveId, true);
        } else if (!newActiveId) {
            setActiveTemplateId(undefined);
            // Optionally clear canvas?
        }
    };

    const hasContent = layers.length > 0;

    return (
        <div className="flex flex-col h-screen w-screen bg-background text-foreground overflow-hidden font-sans text-xs select-none">
            {/* Inject Brand Fonts Globally */}
            {brandFonts && brandFonts.length > 0 && (
                <style>{brandFonts.map(font => `
                    @font-face {
                        font-family: '${font.name.split('.')[0]}';
                        src: url('${font.data}');
                    }
                `).join('\n')}</style>
            )}

            {/* 1. TOP MENU BAR */}
            <header className="h-10 bg-sidebar border-b border-sidebar-border flex items-center px-2 gap-2 shadow-sm shrink-0">
                <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground" onClick={() => router.push(`/briefing/${briefId}`)}>
                    <ChevronLeft className="w-4 h-4" />
                </Button>
                <div className="font-bold text-sidebar-foreground opacity-90">{briefName} <span className="opacity-50 font-normal">Editor</span></div>
                <div className="h-4 w-[1px] bg-sidebar-border mx-2" />

                {/* Toolbar in Helper Header */}
                <div className="flex-1 flex items-center justify-center">
                    <Toolbar />
                </div>

                <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 gap-2 bg-primary hover:bg-primary/90 text-primary-foreground px-4 rounded-sm"
                    onClick={handleExport}
                    disabled={isExporting}
                >
                    {isExporting ? (
                        <>
                            <span className="animate-spin mr-1">⏳</span>
                            {feedData && feedData.rows.length > 0 ? `${exportProgress}%` : '...'}
                        </>
                    ) : (
                        <>
                            <Download className="w-3 h-3" />
                            Export
                        </>
                    )}
                </Button>
            </header>

            {/* 2. MAIN LAYOUT */}
            <div className="flex flex-1 overflow-hidden">

                {/* LEFT SIDEBAR (Layers + Feed) */}
                <aside className="w-[280px] bg-sidebar border-r border-sidebar-border flex flex-col shrink-0 z-20 text-sidebar-foreground">
                    <div className="flex-1 flex flex-col min-h-[200px] overflow-hidden border-b border-sidebar-border">
                        <div className="h-7 bg-sidebar-accent border-b border-sidebar-border px-3 flex items-center justify-between text-[11px] font-bold tracking-wide text-sidebar-foreground shrink-0">
                            <div className="flex items-center gap-2"><Layers className="w-3 h-3" /> LAYERS</div>
                        </div>
                        <div className="flex-1 overflow-hidden">
                            <LayerPanel />
                        </div>
                    </div>

                    {/* DATA FEED (Bottom 1/3) */}
                    <div className="h-1/3 flex flex-col bg-sidebar">
                        <div className="h-7 bg-sidebar-accent border-b border-sidebar-border px-3 flex items-center gap-2 text-[11px] font-bold tracking-wide text-sidebar-foreground">
                            <Database className="w-3 h-3" /> DATA FEED
                        </div>
                        <div className="flex-1 overflow-y-auto p-2 bg-sidebar-accent/10">
                            <FeedPanel />
                        </div>
                    </div>
                </aside>

                {/* CENTER CANVAS AREA */}
                <main className="flex-1 bg-muted/20 relative overflow-hidden flex flex-col shadow-inner">
                    {/* Viewport */}
                    <div className="flex-1 relative overflow-hidden flex items-center justify-center bg-muted/20">
                        {hasContent ? (
                            <EditorCanvas />
                        ) : (
                            loading ? (
                                <div className="text-muted-foreground animate-pulse">Loading...</div>
                            ) : (
                                <div className="absolute inset-0 flex items-center justify-center bg-muted/50">
                                    <div className="max-w-md w-full bg-card p-6 rounded-lg shadow-2xl border border-border">
                                        <PsdUploader onLoad={async (data) => {
                                            try {
                                                // 1. Save PSD
                                                const id = crypto.randomUUID();
                                                await savePsd(id, data.file);

                                                // 2. Add to Templates
                                                await handleAddTemplate({
                                                    id,
                                                    name: data.file.name.replace('.psd', ''),
                                                    size: `${data.state.width}x${data.state.height}`,
                                                    preview: data.preview
                                                });

                                                // 3. Set Canvas
                                                setCanvas(data.state);
                                            } catch (e) {
                                                console.error("Failed to link uploaded PSD", e);
                                                alert("Failed to save PSD to project.");
                                            }
                                        }} />
                                        <p className="mt-4 text-center text-xs text-muted-foreground">
                                            Or go back to <a href={`/briefing/${briefId}`} className="text-primary hover:underline">Campaign Setup</a> to link a template.
                                        </p>
                                    </div>
                                </div>
                            )
                        )}
                    </div>
                </main>

                {/* RIGHT SIDEBAR */}
                <aside className="w-[280px] bg-sidebar border-l border-sidebar-border flex flex-col shrink-0 z-20 text-sidebar-foreground">
                    <div className="flex-[0_0_auto] flex flex-col border-b border-sidebar-border max-h-[40%]">
                        <div className="p-3 overflow-y-auto">
                            <TemplatePanel
                                templates={briefPsdTemplates}
                                activeId={activeTemplateId}
                                onSelect={(id) => handleSelectTemplate(id)}
                                onAdd={handleAddTemplate}
                                onRemove={handleRemoveTemplate}
                            />
                        </div>
                    </div>

                    {/* PROPERTIES */}
                    <div className="flex-1 flex flex-col overflow-hidden">
                        <div className="h-7 bg-sidebar-accent border-b border-sidebar-border px-3 flex items-center gap-2 text-[11px] font-bold tracking-wide text-sidebar-foreground">
                            <Settings className="w-3 h-3" /> PROPERTIES
                        </div>
                        <div className="flex-1 overflow-y-auto p-1 [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:bg-muted [&::-webkit-scrollbar-track]:bg-transparent">
                            <PropertiesPanel brand={activeBrand} brandFonts={brandFonts} />
                        </div>
                    </div>
                </aside>

            </div>
        </div>
    );
}
