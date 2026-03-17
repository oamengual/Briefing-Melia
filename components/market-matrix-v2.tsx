'use client';

import * as React from 'react';
import { useBriefingStore } from '@/lib/store';
import * as AccordionPrimitive from "@radix-ui/react-accordion";
import { MARKETS, PLACEMENTS as SEED_PLACEMENTS } from '@/lib/constants';
import { getPlacements } from '@/lib/storage';
import { Market, Placement } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
    Check,
    ChevronRight,
    Search,
    Globe,
    LayoutGrid,
    Layers,
    X,
    Filter,
    Copy,
    RefreshCw,

    Zap,
    Plus,
    Minus
} from 'lucide-react';
import { cn } from '@/lib/utils';

export function MarketMatrixV2() {
    const { matrix, inputs, togglePlacement, toggleMarketAll } = useBriefingStore();
    const [searchQuery, setSearchQuery] = React.useState('');
    const [activeRegion, setActiveRegion] = React.useState<string>(inputs.regions?.[0] || 'AME');

    // Dynamic Placements State
    const [placements, setPlacements] = React.useState<Placement[]>(SEED_PLACEMENTS);

    React.useEffect(() => {
        setPlacements(getPlacements());
    }, []);

    // Filter markets by region, search query and selected markets
    const filteredMarkets = MARKETS.filter(m => {
        const matchesRegion = m.region === activeRegion && inputs.regions?.includes(m.region as any);
        const matchesSelected = !inputs.selectedMarkets || inputs.selectedMarkets.length === 0 ||
            inputs.selectedMarkets.includes(m.selector);
        const matchesSearch = m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            m.code.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesRegion && matchesSelected && matchesSearch;
    });

    // Group placements by channel
    const placementsByChannel = React.useMemo(() => {
        const grouped: Record<string, Placement[]> = {};
        placements.forEach(p => {
            if (!grouped[p.channel]) grouped[p.channel] = [];
            grouped[p.channel].push(p);
        });
        return grouped;
    }, [placements]);

    const channels = Object.keys(placementsByChannel);

    const getSelectedCount = (marketSelector: string) => {
        return matrix[marketSelector]?.length || 0;
    };

    const getActiveChannels = (marketSelector: string) => {
        const selectedIds = matrix[marketSelector] || [];
        const activeChannels = new Set<string>();
        placements.forEach(p => {
            if (selectedIds.includes(p.id)) {
                activeChannels.add(p.channel);
            }
        });
        return Array.from(activeChannels);
    };

    const handleSyncToRegion = (sourceMarketSelector: string) => {
        const sourcePlacements = matrix[sourceMarketSelector] || [];
        filteredMarkets.forEach(m => {
            toggleMarketAll(m.selector, sourcePlacements, true);
        });
    };

    const handleBulkChannelToggle = (channel: string, force: boolean) => {
        const channelPlacements = placementsByChannel[channel].map(p => p.id);
        filteredMarkets.forEach(m => {
            const currentSelected = matrix[m.selector] || [];
            let newList;
            if (force) {
                // Add all from this channel
                newList = Array.from(new Set([...currentSelected, ...channelPlacements]));
            } else {
                // Remove all from this channel
                newList = currentSelected.filter(id => !channelPlacements.includes(id));
            }
            toggleMarketAll(m.selector, newList, true);
        });
    };

    return (
        <div className="space-y-12 animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row gap-8 items-start md:items-center justify-between">
                <div className="space-y-2">
                    <h2 className="text-3xl font-bold text-foreground">Market Mix</h2>
                    <p className="text-base text-muted-foreground font-normal">Define market-specific placements and regional configurations.</p>
                </div>

                <div className="flex w-full md:w-auto items-center gap-4">
                    <div className="relative flex-1 md:w-96">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                            placeholder="Search markets..."
                            className="h-9 pl-9 bg-background border-input radius-input focus-visible:ring-primary focus-visible:ring-1"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>
            </div>

            {/* Regional Toolbar */}
            {/* Regional Toolbar - Redesigned */}
            <div className="flex flex-col gap-4 p-5 border border-border radius-card bg-card/50 backdrop-blur-sm shadow-sm transition-all hover:bg-card hover:shadow-md">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-3 self-start sm:self-auto">
                        <div className="p-2 bg-primary/10 rounded-full">
                            <Zap className="w-4 h-4 text-primary fill-primary/20" />
                        </div>
                        <div className="space-y-0.5">
                            <h3 className="text-sm font-bold text-foreground">Global Controls</h3>
                            <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-wide">Apply across <span className="text-foreground">{activeRegion}</span> markets</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2 w-full sm:w-auto bg-muted/30 p-1 rounded-lg border border-border/50">
                        <Button
                            variant="ghost"
                            size="sm"
                            className="flex-1 sm:flex-none h-7 px-3 text-xs font-bold text-muted-foreground hover:text-foreground hover:bg-background hover:shadow-sm radius-md transition-all"
                            onClick={() => filteredMarkets.forEach(m => toggleMarketAll(m.selector, placements.map(p => p.id), true))}
                        >
                            Select All
                        </Button>
                        <div className="w-[1px] h-4 bg-border/50" />
                        <Button
                            variant="ghost"
                            size="sm"
                            className="flex-1 sm:flex-none h-7 px-3 text-xs font-bold text-muted-foreground hover:text-destructive hover:bg-destructive/10 radius-md transition-all"
                            onClick={() => filteredMarkets.forEach(m => toggleMarketAll(m.selector, [], false))}
                        >
                            Clear All
                        </Button>
                    </div>
                </div>

                <div className="h-[1px] bg-gradient-to-r from-transparent via-border to-transparent" />

                <div className="flex flex-wrap gap-2">
                    {channels.map(channel => (
                        <div key={channel} className="group flex items-center bg-background border border-border hover:border-primary/30 rounded-full pl-3 pr-1 py-1 shadow-sm hover:shadow-md transition-all duration-300">
                            <span className="text-[11px] font-bold text-muted-foreground group-hover:text-foreground transition-colors mr-2 uppercase tracking-tight">{channel}</span>
                            <div className="flex items-center gap-1">
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-6 w-6 rounded-full hover:bg-primary hover:text-primary-foreground focus-visible:ring-1 focus-visible:ring-primary transition-all"
                                    onClick={() => handleBulkChannelToggle(channel, true)}
                                    title={`Add all ${channel}`}
                                >
                                    <Plus className="w-3.5 h-3.5" />
                                </Button>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-6 w-6 rounded-full hover:bg-destructive hover:text-destructive-foreground focus-visible:ring-1 focus-visible:ring-destructive transition-all"
                                    onClick={() => handleBulkChannelToggle(channel, false)}
                                    title={`Remove all ${channel}`}
                                >
                                    <Minus className="w-3.5 h-3.5" />
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <Tabs value={activeRegion} onValueChange={setActiveRegion} className="w-full">
                <div className="flex items-center border-b border-border mb-10 overflow-x-auto no-scrollbar">
                    <TabsList className="bg-transparent h-auto p-0 gap-10">
                        {['AME', 'EMEA', 'APAC'].filter(r => inputs.regions?.includes(r as any)).map(region => (
                            <TabsTrigger
                                key={region}
                                value={region}
                                className="px-0 pb-5 pt-0 rounded-none text-base font-bold text-muted-foreground hover:text-foreground border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:text-foreground data-[state=active]:bg-transparent data-[state=active]:shadow-none transition-all"
                            >
                                {region}
                            </TabsTrigger>
                        ))}
                    </TabsList>
                </div>

                <div className="space-y-8">
                    {filteredMarkets.map(market => {
                        const count = getSelectedCount(market.selector);
                        const isSelected = count > 0;
                        const marketActiveChannels = getActiveChannels(market.selector);
                        const isAllSelected = count === placements.length;

                        return (
                            <Accordion type="single" collapsible key={market.selector} className="w-full">
                                <AccordionItem value="item-1" className="border-none">
                                    <Card className={cn(
                                        "transition-all duration-300 border-none rounded-xl overflow-hidden shadow-sm",
                                        isSelected ? "bg-primary/5 ring-1 ring-primary/20" : "hover:bg-muted/50"
                                    )}>
                                        <AccordionPrimitive.Header className="flex flex-col md:flex-row md:items-center justify-between p-6">
                                            <AccordionPrimitive.Trigger className="flex-1 text-left hover:no-underline [&[data-state=open]>div>div>div>svg]:rotate-180">
                                                <div className="flex flex-col md:flex-row md:items-center gap-6">
                                                    <div className="flex items-center gap-6">
                                                        <div className={cn(
                                                            "w-16 h-16 rounded-lg flex items-center justify-center font-bold text-xl shadow-sm transition-colors",
                                                            isSelected ? "bg-primary text-primary-foreground" : "bg-background text-foreground border border-border"
                                                        )}>
                                                            {market.code}
                                                        </div>
                                                        <div className="space-y-1">
                                                            <div className="flex items-center gap-3">
                                                                <h3 className="text-xl font-bold text-foreground">{market.name}</h3>
                                                                {isSelected && (
                                                                    <Badge className="bg-primary text-primary-foreground border-none text-[10px] font-semibold h-5 px-2 radius-btn">
                                                                        {count} PLACEMENTS
                                                                    </Badge>
                                                                )}
                                                                <ChevronRight className="w-5 h-5 text-muted-foreground transition-transform duration-200" />
                                                            </div>
                                                            <div className="flex flex-wrap gap-2">
                                                                {marketActiveChannels.length > 0 ? (
                                                                    marketActiveChannels.map(c => (
                                                                        <span key={c} className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                                                                            {c}
                                                                        </span>
                                                                    ))
                                                                ) : (
                                                                    <span className="text-sm text-muted-foreground font-normal italic">No formats selected</span>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </AccordionPrimitive.Trigger>

                                            <div className="flex items-center gap-4 mt-4 md:mt-0 pl-22 md:pl-0">
                                                <div className="flex items-center gap-2 bg-background p-1 radius-btn border border-border shadow-sm">
                                                    <Button
                                                        variant={isAllSelected ? "secondary" : "ghost"}
                                                        size="sm"
                                                        className={cn(
                                                            "h-8 px-4 text-xs font-semibold radius-btn transition-all",
                                                            isAllSelected ? "bg-foreground text-background hover:bg-foreground/90" : "text-foreground hover:bg-muted"
                                                        )}
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            toggleMarketAll(market.selector, placements.map(p => p.id), true);
                                                        }}
                                                    >
                                                        All
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        className="h-8 px-4 text-xs font-semibold text-destructive hover:bg-destructive/10 radius-btn transition-all"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            toggleMarketAll(market.selector, [], false);
                                                        }}
                                                    >
                                                        Clear
                                                    </Button>
                                                </div>
                                                <Button
                                                    variant="secondary"
                                                    size="sm"
                                                    className="h-10 px-6 text-xs font-semibold gap-2 radius-btn shadow-sm border border-border bg-background hover:bg-muted"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleSyncToRegion(market.selector);
                                                    }}
                                                >
                                                    <RefreshCw className="w-3.5 h-3.5" />
                                                    Sync
                                                </Button>
                                            </div>
                                        </AccordionPrimitive.Header>
                                        <AccordionContent className="p-0 border-t border-border/50 bg-background">
                                            <div className="p-6">
                                                <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                                                    {Object.entries(placementsByChannel).map(([channel, channelPlacements]) => (
                                                        <div key={channel} className="space-y-6">
                                                            <div className="flex items-center gap-4">
                                                                <h3 className="text-base font-bold text-foreground flex items-center gap-2">
                                                                    <Layers className="w-4 h-4 text-primary" />
                                                                    {channel}
                                                                </h3>
                                                                <div className="flex-1 h-[1px] bg-border" />
                                                                <div className="flex items-center gap-2">
                                                                    <Button
                                                                        variant="ghost"
                                                                        size="sm"
                                                                        className="h-7 px-3 text-xs font-bold text-muted-foreground hover:text-foreground hover:bg-muted rounded-pill"
                                                                        onClick={() => toggleMarketAll(market.selector, Array.from(new Set([...(matrix[market.selector] || []), ...channelPlacements.map(p => p.id)])), true)}
                                                                    >
                                                                        All
                                                                    </Button>
                                                                    <Button
                                                                        variant="ghost"
                                                                        size="sm"

                                                                        className="h-6 px-2 text-[10px] font-semibold text-destructive hover:bg-destructive/10 radius-btn"
                                                                        onClick={() => toggleMarketAll(market.selector, (matrix[market.selector] || []).filter(id => !channelPlacements.map(p => p.id).includes(id)), true)}
                                                                    >
                                                                        Clear
                                                                    </Button>
                                                                </div>
                                                            </div>

                                                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                                                                {channelPlacements.map(placement => {
                                                                    const isPlacementSelected = matrix[market.selector]?.includes(placement.id);

                                                                    return (
                                                                        <button
                                                                            key={placement.id}
                                                                            onClick={() => togglePlacement(market.selector, placement.id)}
                                                                            className={cn(
                                                                                "flex flex-col items-start p-3 radius-card border transition-all duration-200 text-left hover:shadow-sm active:scale-[0.98] h-full",
                                                                                isPlacementSelected
                                                                                    ? "bg-primary/5 border-primary shadow-sm ring-1 ring-primary/20"
                                                                                    : "bg-background border-border hover:border-foreground/50"
                                                                            )}
                                                                        >
                                                                            <div className="flex justify-between items-start w-full mb-2">
                                                                                <span className={cn(
                                                                                    "text-xs font-semibold line-clamp-2 flex-1",
                                                                                    isPlacementSelected ? "text-primary" : "text-foreground"
                                                                                )}>
                                                                                    {placement.name}
                                                                                </span>
                                                                                <div className={cn(
                                                                                    "w-3.5 h-3.5 rounded-full border flex items-center justify-center transition-all ml-2 shrink-0",
                                                                                    isPlacementSelected ? "bg-foreground border-foreground" : "border-border bg-muted/30"
                                                                                )}>
                                                                                    {isPlacementSelected && <Check className="w-2.5 h-2.5 text-background stroke-[3]" />}
                                                                                </div>
                                                                            </div>
                                                                            <div className="flex flex-wrap items-center gap-1.5 mt-auto w-full">
                                                                                <span className="text-[10px] font-medium text-muted-foreground bg-muted px-1.5 py-0.5 rounded-sm">
                                                                                    {placement.width}x{placement.height}
                                                                                </span>
                                                                                {placement.maxFileSize && (
                                                                                    <span className="text-[10px] font-medium text-muted-foreground bg-muted px-1.5 py-0.5 rounded-sm">
                                                                                        {placement.maxFileSize >= 1024 
                                                                                            ? `${(placement.maxFileSize / 1024).toFixed(0)}mb` 
                                                                                            : `${placement.maxFileSize}kb`}
                                                                                    </span>
                                                                                )}
                                                                                <span className={cn(
                                                                                    "text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-sm ml-auto",
                                                                                    placement.format === 'vid' ? "text-amber-700 bg-amber-50" : "text-blue-700 bg-blue-50"
                                                                                )}>
                                                                                    {placement.format}
                                                                                </span>
                                                                            </div>
                                                                        </button>
                                                                    );
                                                                })}
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>

                                            <div className="bg-muted/30 p-6 border-t border-border flex items-center justify-between">
                                                <div className="text-sm text-muted-foreground font-medium">
                                                    <span className="font-bold text-foreground">{count}</span> placements selected for {market.name}
                                                </div>
                                                <Button
                                                    size="sm"
                                                    className="h-9 px-6 text-sm font-bold shadow-sm"
                                                    onClick={(e) => {
                                                        const target = e.currentTarget.closest('[data-state="open"]')?.querySelector('[data-radix-collection-item]');
                                                        if (target instanceof HTMLElement) target.click();
                                                    }}
                                                >
                                                    Finish Selection
                                                </Button>
                                            </div>
                                        </AccordionContent>
                                    </Card>
                                </AccordionItem>
                            </Accordion>
                        );
                    })}
                </div>
            </Tabs>
        </div>
    );
}
