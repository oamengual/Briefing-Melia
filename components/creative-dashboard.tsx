'use client';

import * as React from 'react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from '@/components/ui/dialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
    LayoutDashboard,
    Megaphone,
    Type,
    Globe,
    Palette,
    MonitorPlay,
    FileText,
    Copy,
    Share2,
    X
} from 'lucide-react';
import { useBriefingStore } from '@/lib/store';
import { PLACEMENTS, MARKETS } from '@/lib/constants';
import { Placement } from '@/lib/types';

interface CreativeDashboardProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function CreativeDashboard({ open, onOpenChange }: CreativeDashboardProps) {
    const { inputs, creative, matrix, translations } = useBriefingStore();

    // --- Helper: Tech Specs ---
    const getTechSpecs = (format: string) => {
        const specs = {
            maxWeight: '40KB',
            fileType: 'JPG/PNG'
        };
        if (format.includes('html') || format.includes('5')) {
            specs.maxWeight = '150KB';
            specs.fileType = 'HTML5 Zip';
        } else if (format.includes('vid') || format.includes('mp4')) {
            specs.maxWeight = '4MB';
            specs.fileType = 'MP4';
        }
        return specs;
    };

    // --- Aggregation Logic ---
    const dashboardData = React.useMemo(() => {
        const channels: Record<string, {
            name: string;
            placements: Record<string, { // Key: Size
                size: string;
                format: string;
                markets: Set<string>;
                totalCount: number;
                specs: { maxWeight: string; fileType: string };
            }>;
            totalAssets: number;
        }> = {};

        Object.entries(matrix).forEach(([marketSelector, placementIds]) => {
            if (!placementIds || placementIds.length === 0) return;

            // Resolve Market
            let lookupSelector = marketSelector;
            if (marketSelector.startsWith('ZH')) lookupSelector = 'CN (China)';
            const market = MARKETS.find(m => m.selector === lookupSelector);
            const marketCode = market ? market.code : 'Unknown';

            placementIds.forEach(pid => {
                const p = PLACEMENTS.find(x => x.id === pid);
                if (!p) return;

                const chanName = p.channel || 'Other';

                if (!channels[chanName]) {
                    channels[chanName] = {
                        name: chanName,
                        placements: {},
                        totalAssets: 0
                    };
                }

                if (!channels[chanName].placements[p.size]) {
                    channels[chanName].placements[p.size] = {
                        size: p.size,
                        format: p.format,
                        markets: new Set(),
                        totalCount: 0,
                        specs: getTechSpecs(p.format)
                    };
                }

                channels[chanName].placements[p.size].markets.add(marketCode);
                channels[chanName].placements[p.size].totalCount++;
                channels[chanName].totalAssets++;
            });
        });

        return {
            channels: Object.values(channels).sort((a, b) => b.totalAssets - a.totalAssets),
            totalAssets: Object.values(channels).reduce((acc, c) => acc + c.totalAssets, 0),
            markets: Object.keys(matrix).filter(k => matrix[k]?.length > 0).length
        };
    }, [matrix]);

    // --- Copy Aggregation ---
    const allCopy = React.useMemo(() => {
        const items = [
            { label: 'Main Claim', value: creative.claim },
            { label: 'Discount', value: creative.discount },
            { label: 'Call to Action', value: creative.cta },
            { label: 'USP 1', value: creative.usp1 },
            { label: 'USP 2', value: creative.usp2 },
            { label: 'USP 3', value: creative.usp3 },
        ];

        if (creative.landing) {
            items.push({ label: 'Landing Title', value: creative.landing.title });
            items.push({ label: 'Landing Sub', value: creative.landing.subtitle });
        }

        return items.filter(i => i.value);
    }, [creative]);

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-6xl h-[92vh] p-0 gap-0 overflow-hidden bg-[#F0F2F5] dark:bg-black/95">

                {/* Header with Visual Context */}
                <div className="flex bg-background border-b border-border shadow-sm z-10">
                    {creative.keyVisualUrl && (
                        <div className="w-48 h-full min-h-[140px] border-r border-border relative overflow-hidden hidden md:block group">
                            <img src={creative.keyVisualUrl} alt="Key Visual" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                            <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors" />
                            <Badge className="absolute bottom-2 left-2 bg-black/60 backdrop-blur text-white border-0">Key Visual</Badge>
                        </div>
                    )}
                    <div className="flex-1 flex flex-col p-6">
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-3">
                                <DialogTitle className="text-2xl font-bold tracking-tight text-foreground">
                                    {inputs.campaignName || 'Untitled Campaign'}
                                </DialogTitle>
                                <Badge variant="secondary" className="font-mono text-xs uppercase tracking-widest gap-1.5 py-1 px-3">
                                    <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                                    Live Brief
                                </Badge>
                            </div>
                            <Button variant="ghost" size="icon" onClick={() => onOpenChange(false)} className="rounded-full hover:bg-muted">
                                <X className="w-5 h-5" />
                            </Button>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                            <div>
                                <span className="text-[10px] bg-muted/50 px-2 py-0.5 rounded text-muted-foreground uppercase font-bold tracking-wider mb-1 inline-block">Deadline</span>
                                <div className="font-semibold text-lg flex items-center gap-2">
                                    {inputs.deliveryDate || 'ASAP'}
                                </div>
                            </div>
                            <div>
                                <span className="text-[10px] bg-muted/50 px-2 py-0.5 rounded text-muted-foreground uppercase font-bold tracking-wider mb-1 inline-block">Volume</span>
                                <div className="font-semibold text-lg">{dashboardData.totalAssets} <span className="text-sm text-muted-foreground font-normal">assets</span></div>
                            </div>
                            <div>
                                <span className="text-[10px] bg-muted/50 px-2 py-0.5 rounded text-muted-foreground uppercase font-bold tracking-wider mb-1 inline-block">Regions</span>
                                <div className="font-semibold text-lg">{dashboardData.markets} <span className="text-sm text-muted-foreground font-normal">markets</span></div>
                            </div>
                            {inputs.landingPageUrl && (
                                <div>
                                    <span className="text-[10px] bg-muted/50 px-2 py-0.5 rounded text-muted-foreground uppercase font-bold tracking-wider mb-1 inline-block">Landing Page</span>
                                    <a href={inputs.landingPageUrl} target="_blank" rel="noreferrer" className="flex items-center gap-1 text-sm font-medium text-primary hover:underline truncate max-w-[150px]">
                                        View URL <Globe className="w-3 h-3" />
                                    </a>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div className="flex-1 overflow-hidden flex flex-col bg-muted/10">
                    <Tabs defaultValue="production" className="flex-1 flex flex-col h-full">
                        <div className="px-6 bg-background border-b border-border shadow-sm">
                            <TabsList className="h-14 w-full justify-start bg-transparent gap-6 p-0">
                                <TabsTrigger value="production" className="h-full rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:text-foreground data-[state=active]:shadow-none px-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-all">
                                    <MonitorPlay className="w-4 h-4 mr-2" />
                                    Production Grid
                                </TabsTrigger>
                                <TabsTrigger value="copy" className="h-full rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:text-foreground data-[state=active]:shadow-none px-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-all">
                                    <FileText className="w-4 h-4 mr-2" />
                                    Copy Master
                                </TabsTrigger>
                                <TabsTrigger value="assets" className="h-full rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:text-foreground data-[state=active]:shadow-none px-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-all">
                                    <Palette className="w-4 h-4 mr-2" />
                                    Assets & Refs
                                </TabsTrigger>
                            </TabsList>
                        </div>

                        <ScrollArea className="flex-1 p-8">
                            <TabsContent value="production" className="mt-0 space-y-12 pb-20 animate-in fade-in duration-300">
                                {dashboardData.channels.map(chan => (
                                    <div key={chan.name} className="space-y-4">
                                        <div className="flex items-center gap-3">
                                            <div className="h-8 w-1 bg-primary rounded-full" />
                                            <h3 className="text-xl font-bold tracking-tight text-foreground">{chan.name}</h3>
                                            <Badge variant="outline" className="ml-auto font-mono">{chan.totalAssets} items</Badge>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                                            {Object.values(chan.placements).map((p) => (
                                                <Card key={p.size} className="overflow-hidden border-border/60 hover:border-primary/50 transition-all hover:shadow-md group bg-background">
                                                    <div className="p-4 flex flex-col gap-3">
                                                        <div className="flex justify-between items-start">
                                                            <Badge variant="secondary" className="font-mono font-bold text-sm px-2 py-0.5 rounded-md bg-muted text-foreground">
                                                                {p.size}
                                                            </Badge>
                                                            <div className="text-right">
                                                                <span className="text-2xl font-bold tracking-tighter leading-none block">{p.totalCount}</span>
                                                                <span className="text-[9px] text-muted-foreground uppercase font-bold tracking-wider">Versions</span>
                                                            </div>
                                                        </div>

                                                        <div className="space-y-2 mt-2 pt-3 border-t border-border/40 border-dashed">
                                                            <div className="flex justify-between text-xs">
                                                                <span className="text-muted-foreground">Format</span>
                                                                <span className="font-medium text-foreground">{p.specs.fileType}</span>
                                                            </div>
                                                            <div className="flex justify-between text-xs">
                                                                <span className="text-muted-foreground">Max Weight</span>
                                                                <span className="font-medium text-foreground">{p.specs.maxWeight}</span>
                                                            </div>
                                                        </div>

                                                        {p.markets.size > 0 && (
                                                            <div className="mt-2 text-xs text-muted-foreground truncate">
                                                                <Globe className="w-3 h-3 inline mr-1" />
                                                                {Array.from(p.markets).join(', ')}
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div className="h-1 bg-primary/10 w-full overflow-hidden">
                                                        <div className="h-full bg-primary/60 w-0 group-hover:w-full transition-all duration-700 ease-out" />
                                                    </div>
                                                </Card>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </TabsContent>

                            <TabsContent value="copy" className="mt-0 pb-20 animate-in fade-in duration-300">
                                <div className="max-w-4xl mx-auto space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {allCopy.map((item) => (
                                            <Card key={item.label} className="group overflow-hidden border-l-4 border-l-primary hover:shadow-md transition-all">
                                                <CardHeader className="bg-muted/30 py-3 px-4 flex-row items-center justify-between space-y-0">
                                                    <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">{item.label}</span>
                                                    <Badge variant="outline" className="font-mono text-[10px] h-5 opacity-50 group-hover:opacity-100 transition-opacity">
                                                        {item.value.length} chars
                                                    </Badge>
                                                </CardHeader>
                                                <CardContent className="p-5 relative min-h-[100px] flex items-center">
                                                    <p className="text-lg font-medium leading-relaxed w-full pr-8">
                                                        {item.value}
                                                    </p>
                                                    <Button
                                                        size="icon"
                                                        variant="ghost"
                                                        className="absolute right-2 top-2 h-8 w-8 text-muted-foreground hover:text-primary opacity-0 group-hover:opacity-100 transition-all"
                                                        onClick={() => navigator.clipboard.writeText(item.value)}
                                                    >
                                                        <Copy className="w-4 h-4" />
                                                    </Button>
                                                </CardContent>
                                            </Card>
                                        ))}
                                    </div>

                                    {/* Translations Table */}
                                    {Object.keys(translations).length > 0 && (
                                        <div className="mt-12 pt-8 border-t border-border">
                                            <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                                                <Globe className="w-5 h-5" /> Localizations
                                            </h3>
                                            <div className="grid grid-cols-1 gap-4">
                                                {Object.entries(translations).map(([lang, fields]) => {
                                                    // Flatten nested objects (like landing/newsletter) for display
                                                    const flatItems: { key: string, value: string }[] = [];
                                                    Object.entries(fields).forEach(([k, v]) => {
                                                        if (!v) return;
                                                        if (typeof v === 'string') {
                                                            flatItems.push({ key: k, value: v });
                                                        } else if (typeof v === 'object') {
                                                            Object.entries(v).forEach(([subK, subV]) => {
                                                                if (typeof subV === 'string' && subV) {
                                                                    flatItems.push({ key: `${k} > ${subK}`, value: subV });
                                                                }
                                                            });
                                                        }
                                                    });

                                                    return (
                                                        <Card key={lang} className="overflow-hidden">
                                                            <div className="bg-muted/50 px-4 py-2 border-b border-border flex justify-between items-center">
                                                                <span className="font-bold uppercase text-sm">{lang}</span>
                                                                <span className="text-xs text-muted-foreground">{flatItems.length} keys</span>
                                                            </div>
                                                            <div className="divide-y divide-border">
                                                                {flatItems.map((item) => (
                                                                    <div key={item.key} className="p-3 grid grid-cols-[150px_1fr] gap-4 text-sm hover:bg-muted/20">
                                                                        <span className="text-muted-foreground font-mono text-xs py-1 truncate" title={item.key}>{item.key}</span>
                                                                        <span className="font-medium text-foreground">{item.value}</span>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        </Card>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </TabsContent>

                            <TabsContent value="assets" className="mt-0 pb-20 animate-in fade-in duration-300">
                                <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
                                    {creative.keyVisualUrl ? (
                                        <Card className="overflow-hidden col-span-2">
                                            <CardHeader className="bg-muted/30 border-b border-border">
                                                <CardTitle className="text-base flex items-center gap-2">
                                                    <Palette className="w-4 h-4" /> Primary Key Visual
                                                </CardTitle>
                                            </CardHeader>
                                            <div className="aspect-video relative bg-black/5">
                                                <img src={creative.keyVisualUrl} alt="KV" className="w-full h-full object-contain" />
                                                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-4 flex justify-between items-end">
                                                    <span className="text-white text-sm font-medium truncate max-w-[80%]">{creative.keyVisualName || 'Key Visual.jpg'}</span>
                                                    <Button size="sm" variant="secondary" className="h-8 gap-2" onClick={() => window.open(creative.keyVisualUrl, '_blank')}>
                                                        Open <Share2 className="w-3 h-3" />
                                                    </Button>
                                                </div>
                                            </div>
                                        </Card>
                                    ) : (
                                        <Card className="col-span-2 border-dashed p-12 flex flex-col items-center justify-center text-center text-muted-foreground gap-4">
                                            <Palette className="w-12 h-12 opacity-20" />
                                            <div>
                                                <h3 className="font-bold text-foreground">No Key Visual Linked</h3>
                                                <p className="text-sm">Link a KV URL in the Briefing Inputs to see it here.</p>
                                            </div>
                                        </Card>
                                    )}

                                    <Card>
                                        <CardHeader>
                                            <CardTitle className="text-sm">Brand Assets</CardTitle>
                                        </CardHeader>
                                        <CardContent className="grid gap-2">
                                            <Button variant="outline" className="w-full justify-start gap-3 h-12">
                                                <div className="w-8 h-8 rounded-full bg-black flex items-center justify-center text-white font-bold text-xs">B</div>
                                                <div className="flex flex-col items-start leading-none gap-1">
                                                    <span>Brand Guidelines</span>
                                                    <span className="text-[10px] text-muted-foreground">PDF • 4.5MB</span>
                                                </div>
                                            </Button>
                                            <Button variant="outline" className="w-full justify-start gap-3 h-12">
                                                <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold text-xs">L</div>
                                                <div className="flex flex-col items-start leading-none gap-1">
                                                    <span>Logo Pack</span>
                                                    <span className="text-[10px] text-muted-foreground">ZIP • 12MB</span>
                                                </div>
                                            </Button>
                                        </CardContent>
                                    </Card>
                                </div>
                            </TabsContent>
                        </ScrollArea>
                    </Tabs>
                </div>
            </DialogContent>
        </Dialog>
    );
}
