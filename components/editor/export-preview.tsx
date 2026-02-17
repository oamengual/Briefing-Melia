'use client';

import * as React from 'react';
import { useEditorStore } from '@/lib/editor-store';
import { getPlacements, getSettings } from '@/lib/storage'; // Added getSettings
import { PLACEMENTS as SEED_PLACEMENTS } from '@/lib/constants';
import { Placement, Settings, ChannelConfig } from '@/lib/types'; // Added Settings, ChannelConfig
import { toPng } from 'html-to-image';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';

// New Sub-components
import { PreviewCanvas } from './export/preview-canvas';
import { ExportSidebar } from './export/sidebar';
import { VariantGrid } from './export/variant-grid';
import { PreviewModal } from './export/preview-modal';
import { ExportPreviewProps, VariantGroup, VariantItem, FeedRow, Template } from './export/types';
import { CreativeDashboard } from '@/components/creative-dashboard';
import { Palette } from 'lucide-react';

// --- Main Component ---

export function ExportPreview({ templates, brief, onLoadState }: ExportPreviewProps) {
    const { feedData } = useEditorStore();
    const [isExporting, setIsExporting] = React.useState(false);
    const [exportProgress, setExportProgress] = React.useState(0);
    const [isDashboardOpen, setIsDashboardOpen] = React.useState(false);

    // Dynamic Placements & Settings
    const [placements, setPlacements] = React.useState<Placement[]>(SEED_PLACEMENTS);
    const [channelConfigs, setChannelConfigs] = React.useState<ChannelConfig[]>([]);

    React.useEffect(() => {
        setPlacements(getPlacements());
        const s = getSettings();
        if (s.channelConfigs) {
            setChannelConfigs(s.channelConfigs);
        }
    }, []);

    // Selection State
    const [selectedTemplateIds, setSelectedTemplateIds] = React.useState<Set<string>>(new Set());

    // Modal / Navigation State
    const [previewVariantId, setPreviewVariantId] = React.useState<string | null>(null);

    // Ensure selected templates are loaded
    React.useEffect(() => {
        templates.forEach(t => {
            if (selectedTemplateIds.has(t.id) && !t.editorState && onLoadState) {
                onLoadState(t.id);
            }
        });
    }, [selectedTemplateIds, templates, onLoadState]);

    const toggleTemplate = (id: string) => {
        const newSet = new Set(selectedTemplateIds);
        if (newSet.has(id)) newSet.delete(id);
        else newSet.add(id);
        setSelectedTemplateIds(newSet);
    };

    const toggleAll = () => {
        setSelectedTemplateIds(
            selectedTemplateIds.size === templates.length
                ? new Set()
                : new Set(templates.map(t => t.id))
        );
    };

    // Index Placements for faster lookup
    const placementsIndex = React.useMemo(() => {
        const bySize = new Map<string, typeof placements>();
        placements.forEach(p => {
            if (!bySize.has(p.size)) bySize.set(p.size, []);
            bySize.get(p.size)!.push(p);
        });
        return bySize;
    }, [placements]);

    // Group Variants Logic - Optimized
    const groupedVariants = React.useMemo<VariantGroup[]>(() => {
        if (!feedData || feedData.rows.length === 0) return [];
        const groups: VariantGroup[] = [];

        templates.forEach(tpl => {
            if (!selectedTemplateIds.has(tpl.id)) return;

            const seenMarkets = new Set<string>();
            const variants: VariantItem[] = [];

            const requestedSizes = placementsIndex.get(tpl.size) || [];
            if (requestedSizes.length === 0) return;

            (feedData.rows as FeedRow[]).forEach((r: FeedRow, idx: number) => {
                const marketCode = r.market;
                if (seenMarkets.has(marketCode)) return;

                const marketKey = r.marketSelector || r.market;
                const selectedIds = new Set(brief?.state?.matrix?.[marketKey] || []);
                if (selectedIds.size === 0) return;

                const matchingPlacements = requestedSizes.filter(p => {
                    if (!selectedIds.has(p.id)) return false;
                    if (tpl.channel) {
                        const pChan = p.channel.toLowerCase().replace(/[^a-z0-9]/g, '');
                        const tChan = tpl.channel.toLowerCase().replace(/[^a-z0-9]/g, '');
                        return pChan.includes(tChan) || tChan.includes(pChan);
                    }
                    return true;
                });

                if (matchingPlacements.length > 0) {
                    seenMarkets.add(marketCode);
                    variants.push({
                        id: `${tpl.id}-${idx}`,
                        row: r,
                        rowIdx: idx,
                        activePlacements: matchingPlacements.map(p => p.name)
                    });
                }
            });

            if (variants.length > 0) {
                groups.push({ tpl, variants });
            }
        });
        return groups;
    }, [templates, selectedTemplateIds, feedData, brief?.state?.matrix, placementsIndex]);

    const totalAssets = React.useMemo(() => {
        return groupedVariants.reduce((acc, g) => acc + g.variants.reduce((vAcc, v) => vAcc + v.activePlacements.length, 0), 0);
    }, [groupedVariants]);

    // Flattened list for navigation
    const allVariants = React.useMemo(() => {
        return groupedVariants.flatMap(g => g.variants.map(v => ({ tpl: g.tpl, variant: v })));
    }, [groupedVariants]);

    // Check for missing templates based on matrix requests
    const missingSizes = React.useMemo(() => {
        if (!brief?.state?.matrix) return [];
        const requestedSizes = new Set<string>();

        (Object.values(brief.state.matrix) as string[][]).forEach((ids: string[]) => {
            ids.forEach(id => {
                const p = placements.find(x => x.id === id);
                if (p) requestedSizes.add(p.size);
            });
        });

        const availableSizes = new Set(templates.map(t => t.size));
        // Remove available from requested
        availableSizes.forEach(s => requestedSizes.delete(s));

        return Array.from(requestedSizes).sort();
    }, [brief?.state?.matrix, templates, placements]);

    const activePreview = React.useMemo(() => {
        return allVariants.find(x => x.variant.id === previewVariantId);
    }, [allVariants, previewVariantId]);

    const navigatePreview = React.useCallback((direction: 'next' | 'prev') => {
        if (!previewVariantId) return;
        const idx = allVariants.findIndex(x => x.variant.id === previewVariantId);
        if (idx === -1) return;

        let newIdx = direction === 'next' ? idx + 1 : idx - 1;
        if (newIdx < 0) newIdx = allVariants.length - 1;
        if (newIdx >= allVariants.length) newIdx = 0;

        setPreviewVariantId(allVariants[newIdx].variant.id);
    }, [allVariants, previewVariantId]);


    // JIT Rendering State
    const [exportVariant, setExportVariant] = React.useState<{ tpl: Template, variant: VariantItem } | null>(null);

    // Export Logic
    const handleBatchExport = async () => {
        if (!feedData || groupedVariants.length === 0) return;
        setIsExporting(true);
        setExportProgress(0);

        try {
            const zip = new JSZip();
            let totalOps = 0;
            groupedVariants.forEach(g => totalOps += g.variants.length);

            let completedOps = 0;

            for (const group of groupedVariants) {
                for (const variant of group.variants) {
                    // Set current variant for rendering
                    setExportVariant({ tpl: group.tpl, variant });

                    // Wait for render (State update + Canvas drawing)
                    await new Promise(r => setTimeout(r, 150));

                    const node = document.getElementById('export-capture-node');
                    if (node) {
                        try {
                            const dataUrl = await toPng(node, { quality: 0.95, pixelRatio: 2 });
                            const base64Data = dataUrl.replace(/^data:image\/png;base64,/, "");

                            const row = variant.row;

                            // Fan-Out Logic
                            let targets: import('@/lib/types').Placement[] = [];
                            const marketKey = row.marketSelector || row.market;

                            const selectedIds = new Set(brief?.state?.matrix?.[marketKey] || []);
                            if (selectedIds.size > 0) {
                                targets = placements.filter(p => {
                                    if (!selectedIds.has(p.id) || p.size !== group.tpl.size) return false;

                                    // Filter by Channel if template has one
                                    if (group.tpl.channel) {
                                        const pChan = p.channel.toLowerCase().replace(/[^a-z0-9]/g, '');
                                        const tChan = group.tpl.channel.toLowerCase().replace(/[^a-z0-9]/g, '');
                                        return pChan.includes(tChan) || tChan.includes(pChan);
                                    }
                                    return true;
                                });
                            }

                            if (targets.length === 0) {
                                targets.push({ id: 'generic', name: 'Generic', size: group.tpl.size, channel: 'Web', format: 'img', seconds: 'na', width: parseInt(group.tpl.size.split('x')[0]), height: parseInt(group.tpl.size.split('x')[1]) });
                            }

                            // Optimization Helper
                            const optimizeImage = async (base64Png: string, format: 'jpg' | 'jpeg' | 'png', maxKb?: number): Promise<string> => {
                                if (format === 'png' && !maxKb) return base64Png;

                                return new Promise((resolve) => {
                                    const img = new Image();
                                    img.onload = () => {
                                        const cvs = document.createElement('canvas');
                                        cvs.width = img.width;
                                        cvs.height = img.height;
                                        const ctx = cvs.getContext('2d');
                                        if (!ctx) return resolve(base64Png);

                                        // Draw white background for JPG (transparency becomes black otherwise)
                                        if (format === 'jpg' || format === 'jpeg') {
                                            ctx.fillStyle = '#FFFFFF';
                                            ctx.fillRect(0, 0, cvs.width, cvs.height);
                                        }

                                        ctx.drawImage(img, 0, 0);

                                        const attempt = (q: number): string => {
                                            const type = format === 'png' ? 'image/png' : 'image/jpeg';
                                            const data = cvs.toDataURL(type, q);
                                            return data.split(',')[1];
                                        };

                                        // Binary search or simple step down if maxKb set
                                        // For now, simplify: if JPG default 0.9. If maxKb, try to fit.
                                        let q = 0.95;
                                        let result = attempt(q);

                                        if (maxKb && (format === 'jpg' || format === 'jpeg')) {
                                            // Simple optimization loop
                                            while (result.length * 0.75 / 1024 > maxKb && q > 0.1) {
                                                q -= 0.1;
                                                result = attempt(q);
                                            }
                                        }
                                        resolve(result);
                                    };
                                    img.src = `data:image/png;base64,${base64Png}`;
                                });
                            };

                            // Process Sequentially to avoid memory spikes
                            for (const target of targets) {
                                const safeFolder = target.channel.replace(/[^a-z0-9]/gi, '_');
                                const folder = zip.folder(safeFolder);

                                // Resolve Settings
                                const chConfig = channelConfigs.find(c => c.channel === target.channel);

                                // Format priority: Placement > Channel > Default (PNG)
                                let format: 'png' | 'jpg' | 'jpeg' = 'png';
                                const allowed = target.outputFormats || chConfig?.defaultOutputFormats || [];
                                if (allowed.includes('jpg') || allowed.includes('jpeg')) format = 'jpg';
                                if (allowed.includes('png')) format = 'png'; // Prefer PNG if both? User said "if pieces MUST be jpg". 
                                // If ONLY jpg is present, force jpg. 
                                if ((allowed.includes('jpg') || allowed.includes('jpeg')) && !allowed.includes('png')) format = 'jpg';

                                // Max Size priority: Placement > Channel
                                const maxKb = target.maxFileSize || chConfig?.defaultMaxFileSize;

                                // Optimize
                                const optimizedData = await optimizeImage(base64Data, format, maxKb);

                                let filename = row.filenamePattern || row.filename || 'banner';

                                filename = filename.replace(/\{\{size\}\}/g, group.tpl.size);
                                const channelSlug = target.channel.toLowerCase().replace(/\s+/g, '_').replace(/\//g, '_');
                                filename = filename.replace(/\{\{channel\}\}/g, channelSlug);
                                filename = filename.replace(/\{\{format\}\}/g, target.format);
                                filename = filename.replace(/\{\{duration\}\}/g, target.seconds || 'na');

                                const ext = format === 'jpg' ? 'jpg' : 'png';
                                if (folder) folder.file(`${filename}.${ext}`, optimizedData, { base64: true });
                            }

                        } catch (err) {
                            console.error(`Error capturing variant ${variant.id}`, err);
                        }
                    }
                    completedOps++;
                    setExportProgress(Math.round((completedOps / totalOps) * 100));
                }
            }

            // Cleanup render node
            setExportVariant(null);

            const blob = await zip.generateAsync({ type: "blob" });
            saveAs(blob, `${brief?.name.replace(/\s+/g, '_')}_assets.zip`);

        } catch (e) {
            console.error("Export Failed", e);
            alert("Export failed. See console for details.");
            setExportVariant(null);
        } finally {
            setIsExporting(false);
            setExportProgress(0);
        }
    };

    return (
        <div className="flex h-full w-full bg-background text-foreground overflow-hidden font-sans">

            {/* JIT EXPORT RENDERER */}
            {exportVariant && (
                <div className="fixed -left-[20000px] top-0 opacity-0 pointer-events-none">
                    <PreviewCanvas
                        id="export-capture-node"
                        state={exportVariant.tpl.editorState!}
                        feedData={feedData!}
                        currentRow={exportVariant.variant.rowIdx}
                        overriddenScale={1}
                    />
                </div>
            )}

            {/* SIDEBAR */}
            <ExportSidebar
                templates={templates}
                selectedTemplateIds={selectedTemplateIds}
                onToggleTemplate={toggleTemplate}
                onToggleAll={toggleAll}
                isExporting={isExporting}
                exportProgress={exportProgress}
                onExport={handleBatchExport}
                canExport={groupedVariants.length > 0 && !!feedData}
                totalAssets={totalAssets}
                onLaunchDashboard={() => setIsDashboardOpen(true)}
            />

            {/* MAIN GRID */}
            <VariantGrid
                groupedVariants={groupedVariants}
                feedData={feedData}
                onPreview={setPreviewVariantId}
                missingSizes={missingSizes}
            />

            {/* MODAL */}
            <PreviewModal
                isOpen={!!previewVariantId}
                activeVariant={activePreview}
                onClose={() => setPreviewVariantId(null)}
                onNext={() => navigatePreview('next')}
                onPrev={() => navigatePreview('prev')}
                feedData={feedData}
            />

            <CreativeDashboard
                open={isDashboardOpen}
                onOpenChange={setIsDashboardOpen}
            />
        </div>
    );
}

// Re-export shared types if needed by consumer (though not common for a component file)
export type { Template } from './export/types';
