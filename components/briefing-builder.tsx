'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { CampaignForm } from '@/components/campaign-form';
import { ContentForm } from '@/components/content-form';
import { MarketMatrix } from '@/components/market-matrix';
import { MarketMatrixV2 } from '@/components/market-matrix-v2';
import { FeedPreview } from '@/components/feed-preview';
import { TranslationsManager } from '@/components/translations-manager';
import { HistoryView } from '@/components/history-view';
import { ArrowLeft, Save } from 'lucide-react';
import { useBriefingStore } from '@/lib/store';
import { useUserStore } from '@/lib/user-store';
import { saveBrief } from '@/lib/storage';
import { useTranslation } from '@/hooks/use-translation';
import { saveAllCreativeTexts } from '@/lib/text-library';
import { PsdManager } from '@/components/psd-manager';
import { IntegratedEditor } from '@/components/editor/integrated-editor';
import { ExportPage } from '@/components/editor/export-page';
import { TraffickingManager } from '@/components/trafficking-manager';
import { VersionHistory } from '@/components/briefing/version-history';
import { BriefVersion } from '@/lib/types';
import { cn } from '@/lib/utils';

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { getSettings, getBrief } from '@/lib/storage';
import { NamingConvention } from '@/lib/types';
import { Badge } from "@/components/ui/badge";

export function BriefingBuilder({ briefId }: { briefId?: string }) {
    const router = useRouter();
    const { inputs, creative, translations, matrix, lockedFields, namingConvention, psdTemplates, psdTemplateId, loadBrief, setNamingConvention, reset } = useBriefingStore();
    const [isSaving, setIsSaving] = React.useState(false);
    const [conflictDialog, setConflictDialog] = React.useState<{ isOpen: boolean, briefConvention?: NamingConvention, activeConvention?: NamingConvention } | null>(null);
    const { t } = useTranslation();
    const { currentUser } = useUserStore();

    // Define Tabs with Role Permissions
    const allTabs = React.useMemo(() => [
        { value: "details", label: t.tabs.details, roles: ['admin', 'editor', 'content', 'design', 'market_manager', 'traffic', 'reviewer'] },
        { value: "matrix_v2", label: "Market Mix", roles: ['admin', 'editor', 'market_manager'] },
        { value: "content", label: t.tabs.content, roles: ['admin', 'editor', 'content'] },
        { value: "translations", label: t.tabs.translations, roles: ['admin', 'editor', 'content', 'market_manager'] },
        { value: "feed", label: "Feeds", roles: ['admin', 'editor', 'content', 'design', 'market_manager', 'reviewer'] },
        { value: "design", label: "PSD Assets", roles: ['admin', 'editor', 'design'] },
        { value: "editor", label: "Editor", roles: ['admin', 'editor', 'design'] },
        { value: "trafficking", label: "Trafficking", roles: ['admin', 'editor', 'traffic', 'market_manager'] },
        { value: "export", label: "Export", roles: ['admin', 'editor', 'traffic', 'design', 'reviewer'] },
        { value: "history", label: "History", roles: ['admin', 'editor', 'reviewer'] },
    ], [t]);

    const visibleTabs = React.useMemo(() =>
        allTabs.filter(tab => tab.roles.includes(currentUser.role)),
        [allTabs, currentUser.role]);

    const [activeTab, setActiveTab] = React.useState('details');

    // Effect to redirect if active tab becomes forbidden (e.g. on role switch)
    React.useEffect(() => {
        const isAllowed = visibleTabs.some(t => t.value === activeTab);
        if (!isAllowed && visibleTabs.length > 0) {
            setActiveTab(visibleTabs[0].value);
        }
    }, [currentUser.role, visibleTabs, activeTab]);

    // Initial Load Logic
    React.useEffect(() => {
        const fetchBrief = async () => {
            if (briefId && briefId !== 'new') {
                const found = await getBrief(briefId);

                if (found) {
                    // Legacy support: check for direct properties vs state object
                    const briefState = found.state || (found as any);

                    const stateToLoad = {
                        inputs: briefState.inputs || {},
                        creative: briefState.creative || {},
                        translations: briefState.translations || {},
                        matrix: briefState.matrix || {},
                        lockedFields: briefState.lockedFields || [],
                        namingConvention: briefState.namingConvention,
                        psdTemplates: briefState.psdTemplates,
                        psdTemplateId: briefState.psdTemplateId,
                        trafficking: briefState.trafficking
                    };

                    // Conflict Detection
                    const settings = getSettings();
                    const activeConvention = settings.activeNamingConvention;
                    const briefConvention = stateToLoad.namingConvention;

                    // Check for conflict:
                    // 1. Brief has convention AND Active has convention
                    // 2. IDs differ OR Structure/Separator differs (deep compare)
                    let hasConflict = false;

                    if (briefConvention && activeConvention) {
                        if (briefConvention.id !== activeConvention.id) {
                            hasConflict = true;
                        } else {
                            // IDs match (e.g. both 'active'), check content
                            const structMatch = JSON.stringify(briefConvention.structure) === JSON.stringify(activeConvention.structure);
                            const sepMatch = briefConvention.separator === activeConvention.separator;
                            if (!structMatch || !sepMatch) {
                                hasConflict = true;
                            }
                        }
                    }

                    if (hasConflict) {
                        loadBrief({
                            inputs: stateToLoad.inputs || {},
                            creative: stateToLoad.creative || {},
                            translations: stateToLoad.translations || {},
                            matrix: stateToLoad.matrix || {},
                            lockedFields: stateToLoad.lockedFields || [],
                            namingConvention: stateToLoad.namingConvention,
                            psdTemplates: stateToLoad.psdTemplates,
                            psdTemplateId: stateToLoad.psdTemplateId,
                            trafficking: stateToLoad.trafficking
                        });

                        setConflictDialog({
                            isOpen: true,
                            briefConvention,
                            activeConvention
                        });
                    } else {
                        // Normal Load
                        loadBrief({
                            inputs: stateToLoad.inputs || {},
                            creative: stateToLoad.creative || {},
                            translations: stateToLoad.translations || {},
                            matrix: stateToLoad.matrix || {},
                            lockedFields: stateToLoad.lockedFields || [],
                            namingConvention: stateToLoad.namingConvention,
                            psdTemplates: stateToLoad.psdTemplates,
                            psdTemplateId: stateToLoad.psdTemplateId,
                            trafficking: stateToLoad.trafficking
                        });
                    }
                }
            } else if (briefId === 'new') {
                reset();
            }
        };

        fetchBrief();
    }, [briefId, loadBrief, reset]);

    const handleSave = async () => {
        setIsSaving(true);
        // Save text library content automatically
        await saveAllCreativeTexts(creative);

        await new Promise(r => setTimeout(r, 800));

        const stateToSave = {
            ...inputs,
            creative,
            translations,
            matrix,
            lockedFields,
            namingConvention,
            psdTemplates,
            psdTemplateId,
            trafficking: useBriefingStore.getState().trafficking
        };

        const savedId = await saveBrief(stateToSave, briefId === 'new' ? undefined : briefId);
        setIsSaving(false);

        if (briefId === 'new') {
            router.replace(`/briefing/${savedId}`);
        } else {
            alert("Brief saved successfully!");
        }
    };

    const handleRevert = (version: BriefVersion) => {
        const state = version.state as any;
        loadBrief({
            inputs: state.inputs || {},
            creative: state.creative || {},
            translations: state.translations || {},
            matrix: state.matrix || {},
            lockedFields: state.lockedFields || [],
            namingConvention: state.namingConvention,
            psdTemplates: state.psdTemplates,
            psdTemplateId: state.psdTemplateId,
            trafficking: state.trafficking
        });
    };

    const resolveConflict = (useActive: boolean) => {
        if (useActive && conflictDialog?.activeConvention) {
            setNamingConvention(conflictDialog.activeConvention);
        }
        setConflictDialog(null);
    };

    const currentBrief = React.useMemo(() => ({
        id: briefId || '',
        name: inputs.campaignName || '',
        updatedAt: Date.now(),
        state: {
            inputs,
            creative,
            translations,
            matrix,
            lockedFields,
            namingConvention,
            psdTemplateId: useBriefingStore.getState().psdTemplateId,
            psdTemplates: psdTemplates,
            trafficking: useBriefingStore.getState().trafficking
        }
    }), [briefId, inputs, creative, translations, matrix, lockedFields, namingConvention, psdTemplates]);

    return (
        <div className="min-h-screen w-full bg-background text-foreground transition-colors duration-300">
            {/* Version Conflict Dialog */}
            <AlertDialog open={!!conflictDialog?.isOpen} onOpenChange={(open: boolean) => !open && setConflictDialog(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Naming Convention Mismatch</AlertDialogTitle>
                        <AlertDialogDescription>
                            This campaign was saved with a different naming convention (&quot;{conflictDialog?.briefConvention?.name}&quot;) than your current active settings (&quot;{conflictDialog?.activeConvention?.name}&quot;).
                            <br /><br />
                            Do you want to update it to use the new convention?
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel onClick={() => resolveConflict(false)}>Keep Old (&quot;{conflictDialog?.briefConvention?.name}&quot;)</AlertDialogCancel>
                        <AlertDialogAction onClick={() => resolveConflict(true)}>Update to New (&quot;{conflictDialog?.activeConvention?.name}&quot;)</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
            {/* Top Bar - Airbnb-style Toolbar */}
            {/* Top Bar - Clerk-style Toolbar */}
            <div className="sticky top-0 z-50 w-full bg-background/80 backdrop-blur-md border-b border-border h-14 flex items-center justify-between px-6 transition-all">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" className="h-9 w-9 text-muted-foreground hover:text-foreground radius-btn hover:bg-muted" onClick={() => router.push('/briefings')}>
                        <ArrowLeft size={18} />
                    </Button>
                    <div className="flex flex-col gap-0.5">
                        <div className="flex items-center gap-2">
                            <h1 className="text-sm font-bold text-foreground tracking-tight">{inputs.campaignName || 'Untitled Campaign'}</h1>
                            <Badge variant="outline" className="h-5 text-[10px] font-semibold px-2 border-border text-muted-foreground radius-btn">
                                DRAFT
                            </Badge>
                        </div>
                        <span className="text-[10px] text-muted-foreground font-medium">Last autosaved just now</span>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    {briefId && briefId !== 'new' && (
                        <VersionHistory briefId={briefId} onRevert={handleRevert} />
                    )}
                    <Button
                        onClick={handleSave}
                        disabled={isSaving}
                        size="default"
                        variant="cta"
                        className="min-w-[120px] shadow-sm font-bold"
                    >
                        <Save className={cn("w-4 h-4 mr-2", isSaving && "animate-spin")} />
                        {isSaving ? t.common.saving : t.common.save}
                    </Button>
                </div>
            </div>

            {/* Sub-Navigation Tabs - Compact */}
            <Tabs value={activeTab} onValueChange={(val) => {
                // Auto-save creative texts when switching tabs (subsections)
                saveAllCreativeTexts(creative);
                setActiveTab(val);
            }} className="w-full">
                <div className="sticky top-16 z-40 w-full bg-background/95 backdrop-blur border-b border-border/40 overflow-x-auto no-scrollbar shadow-sm">
                    <div className="container flex justify-center max-w-5xl px-0">
                        <TabsList className="bg-transparent h-12 p-0 flex justify-center gap-6">
                            {visibleTabs.map(tab => (
                                <TabsTrigger
                                    key={tab.value}
                                    value={tab.value}
                                    className="px-0 h-full text-xs font-semibold text-muted-foreground hover:text-foreground rounded-none transition-all border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:text-foreground data-[state=active]:bg-transparent data-[state=active]:shadow-none"
                                >
                                    {tab.label}
                                </TabsTrigger>
                            ))}
                        </TabsList>
                    </div>
                </div>

                {/* Content Area */}
                <div className="container py-10 max-w-5xl mx-auto">
                    <div className="pt-2">
                        <TabsContent value="details" className="focus-visible:outline-none">
                            <CampaignForm />
                        </TabsContent>

                        <TabsContent value="matrix_v2" className="focus-visible:outline-none">
                            <MarketMatrixV2 />
                        </TabsContent>

                        <TabsContent value="matrix" className="focus-visible:outline-none">
                            <MarketMatrix />
                        </TabsContent>

                        <TabsContent value="content" className="focus-visible:outline-none">
                            <ContentForm />
                        </TabsContent>

                        <TabsContent value="translations" className="focus-visible:outline-none">
                            <TranslationsManager />
                        </TabsContent>

                        <TabsContent value="feed" className="focus-visible:outline-none">
                            <FeedPreview />
                        </TabsContent>

                        <TabsContent value="history" className="focus-visible:outline-none">
                            <HistoryView briefId={briefId === 'new' ? '' : briefId || ''} />
                        </TabsContent>

                        <TabsContent value="design" className="focus-visible:outline-none">
                            <PsdManager briefId={briefId} />
                        </TabsContent>

                        <TabsContent value="editor" className="focus-visible:outline-none">
                            {/* Only render editor if we have a valid brief ID, otherwise show placeholder */}
                            {briefId && briefId !== 'new' ? (
                                <IntegratedEditor briefId={briefId} brief={currentBrief} />
                            ) : (
                                <div className="h-[500px] flex flex-col items-center justify-center border-2 border-dashed border-border radius-card bg-muted/30 text-muted-foreground p-12 text-center space-y-4">
                                    <div className="w-16 h-16 radius-btn bg-background flex items-center justify-center shadow-sm">
                                        <Save className="w-8 h-8 opacity-20" />
                                    </div>
                                    <h3 className="text-xl font-bold text-foreground">Save Required</h3>
                                    <p className="max-w-xs text-base font-normal">
                                        Please save the campaign first to access the interactive editor.
                                    </p>
                                </div>
                            )}
                        </TabsContent>

                        <TabsContent value="trafficking" className="focus-visible:outline-none">
                            <TraffickingManager />
                        </TabsContent>

                        <TabsContent value="export" className="focus-visible:outline-none">
                            {briefId && briefId !== 'new' ? (
                                <ExportPage brief={currentBrief} />
                            ) : (
                                <div className="h-[500px] flex flex-col items-center justify-center border-2 border-dashed border-border radius-card bg-muted/30 text-muted-foreground p-12 text-center space-y-4">
                                    <div className="w-16 h-16 radius-btn bg-background flex items-center justify-center shadow-sm">
                                        <Save className="w-8 h-8 opacity-20" />
                                    </div>
                                    <h3 className="text-xl font-bold text-foreground">Save Required</h3>
                                    <p className="max-w-xs text-base font-normal">
                                        Please save the campaign first to access the export features.
                                    </p>
                                </div>
                            )}
                        </TabsContent>
                    </div>
                </div>
            </Tabs>
        </div >
    );
}
