'use client';

import * as React from 'react';
import { useBriefingStore } from '@/lib/store';
import { MARKETS, PLACEMENTS as SEED_PLACEMENTS } from '@/lib/constants';
import { getPlacements } from '@/lib/storage';
import { Market, Placement } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { Check, ChevronDown, ChevronRight, Maximize2, Minimize2 } from 'lucide-react';

export function MarketMatrix() {
    const { matrix, inputs, togglePlacement, toggleMarketAll, togglePlacementRow } = useBriefingStore();
    const [collapsedRegions, setCollapsedRegions] = React.useState<string[]>([]);
    const [collapsedChannels, setCollapsedChannels] = React.useState<string[]>([]);
    const [isFullScreen, setIsFullScreen] = React.useState(false);

    // Dynamic Placements
    const [placements, setPlacements] = React.useState<Placement[]>(SEED_PLACEMENTS);
    React.useEffect(() => {
        setPlacements(getPlacements());
    }, []);

    const regions = (['AME', 'EMEA', 'APAC'] as const).filter(r => inputs.regions?.includes(r));

    const toggleRegionCollapse = (region: string, e: React.MouseEvent) => {
        e.stopPropagation();
        setCollapsedRegions(prev => prev.includes(region) ? prev.filter(r => r !== region) : [...prev, region]);
    };

    const toggleChannelCollapse = (channel: string, e: React.MouseEvent) => {
        e.stopPropagation();
        setCollapsedChannels(prev => prev.includes(channel) ? prev.filter(c => c !== channel) : [...prev, channel]);
    };

    const handleMarketHeaderClick = (marketSelector: string) => {
        const current = matrix[marketSelector] || [];
        const allIds = placements.map(p => p.id);
        const isAllSelected = current.length === allIds.length;
        toggleMarketAll(marketSelector, allIds, !isAllSelected);
    };

    const handlePlacementRowClick = (placementId: string) => {
        const allMarketSelectors = MARKETS.map(m => m.selector);
        const allSelected = allMarketSelectors.every(sel => matrix[sel]?.includes(placementId));
        togglePlacementRow(allMarketSelectors, placementId, !allSelected);
    }

    const handleRegionHeaderClick = (region: string) => {
        const regionMarkets = MARKETS.filter(m => {
            const matchesRegion = m.region === region;
            const matchesSelected = !inputs.selectedMarkets || inputs.selectedMarkets.length === 0 || 
                                   inputs.selectedMarkets.includes(m.selector);
            return matchesRegion && matchesSelected;
        });
        if (regionMarkets.length === 0) return;

        // Check overall state: if ALL markets in region are fully selected -> Deselect All. Otherwise -> Select All.
        const allPlacementIds = placements.map(p => p.id);
        const isRegionFullySelected = regionMarkets.every(m => {
            const selectedCount = matrix[m.selector]?.length || 0;
            return selectedCount === allPlacementIds.length;
        });

        const shouldSelect = !isRegionFullySelected;
        regionMarkets.forEach(m => {
            toggleMarketAll(m.selector, allPlacementIds, shouldSelect);
        });
    };

    const handleChannelHeaderClick = (channel: string) => {
        const channelPlacements = placements.filter(p => p.channel === channel);
        const channelPlacementIds = channelPlacements.map(p => p.id);

        if (channelPlacementIds.length === 0) return;

        // Identify all currently visible markets (columns)
        const visibleMarkets: Market[] = [];
        regions.forEach(region => {
            const regionMarkets = MARKETS.filter(m => {
                const matchesRegion = m.region === region;
                const matchesSelected = !inputs.selectedMarkets || inputs.selectedMarkets.length === 0 || 
                                       inputs.selectedMarkets.includes(m.selector);
                return matchesRegion && matchesSelected;
            });
            visibleMarkets.push(...regionMarkets);
        });

        if (visibleMarkets.length === 0) return;

        // Check overall state: if ALL placements in this channel are selected in ALL visible markets -> Deselect All. Otherwise -> Select All.
        const isChannelFullySelected = visibleMarkets.every(market => {
            const selectedInMarket = matrix[market.selector] || [];
            return channelPlacementIds.every(pid => selectedInMarket.includes(pid));
        });

        const shouldSelect = !isChannelFullySelected;
        const allMarketSelectors = visibleMarkets.map(m => m.selector);

        // Update each placement row for all visible markets
        channelPlacementIds.forEach(pid => {
            togglePlacementRow(allMarketSelectors, pid, shouldSelect);
        });
    };

    return (
        <Card className={cn(
            "w-full transition-all duration-300 border-none shadow-airbnb rounded-3xl overflow-hidden",
            isFullScreen && "fixed inset-0 z-50 rounded-none h-screen w-screen bg-background"
        )}>
            <CardHeader className="p-8 pb-6 border-b border-border/40 flex flex-row items-center justify-between bg-white/80 backdrop-blur-md sticky top-0 z-50">
                <div className="space-y-1">
                    <CardTitle className="text-2xl font-bold text-[#222222]">Briefing Matrix</CardTitle>
                    <p className="text-sm text-muted-foreground font-medium">
                        Select placements for each market. Click headers to bulk select.
                    </p>
                </div>
                <button
                    onClick={() => setIsFullScreen(!isFullScreen)}
                    className="p-3 hover:bg-muted rounded-full transition-all text-muted-foreground hover:text-foreground active:scale-95 border border-transparent hover:border-border"
                    title={isFullScreen ? "Exit Full Screen" : "Full Screen"}
                >
                    {isFullScreen ? <Minimize2 className="w-5 h-5" /> : <Maximize2 className="w-5 h-5" />}
                </button>
            </CardHeader>
            <CardContent className={cn("p-0 overflow-hidden bg-[#F7F7F7]", isFullScreen ? "h-[calc(100vh-88px)]" : "")}>
                <div className={cn("overflow-auto relative no-scrollbar transition-all", isFullScreen ? "h-full max-h-none" : "max-h-[75vh]")}>
                    <table className="w-full border-collapse text-sm select-none">

                        {/* Table Header */}
                        <thead className="sticky top-0 z-40 bg-[#F7F7F7]">
                            {/* Row 1: Regions */}
                            <tr>
                                <th className="sticky left-0 top-0 z-50 bg-[#F7F7F7] p-6 w-[320px] min-w-[320px] max-w-[320px] text-left border-b border-border/40 font-bold text-[#222222] shadow-[4px_0_24px_-2px_rgba(0,0,0,0.02)]">
                                    <span className="text-lg">Placements</span>
                                </th>
                                {regions.map(region => {
                                    const regionMarkets = MARKETS.filter(m => {
                                        const matchesRegion = m.region === region;
                                        const matchesSelected = !inputs.selectedMarkets || inputs.selectedMarkets.length === 0 || 
                                                               inputs.selectedMarkets.includes(m.selector);
                                        return matchesRegion && matchesSelected;
                                    });
                                    const isCollapsed = collapsedRegions.includes(region);
                                    return (
                                        <th
                                            key={region}
                                            colSpan={isCollapsed ? 1 : regionMarkets.length}
                                            rowSpan={isCollapsed ? 2 : 1}
                                            onClick={() => handleRegionHeaderClick(region)}
                                            className={cn(
                                                "p-4 text-center text-xs font-bold uppercase tracking-widest border-b border-r border-border/40 cursor-pointer hover:bg-white/50 transition-all select-none relative group/region",
                                                region === 'AME' && "text-blue-600 bg-blue-50/30",
                                                region === 'EMEA' && "text-emerald-600 bg-emerald-50/30",
                                                region === 'APAC' && "text-purple-600 bg-purple-50/30"
                                            )}
                                        >
                                            <div className="flex items-center justify-center gap-2">
                                                <button
                                                    onClick={(e) => toggleRegionCollapse(region, e)}
                                                    className="p-1.5 hover:bg-white rounded-full transition-all shadow-sm active:scale-90 border border-transparent hover:border-border/50"
                                                >
                                                    {isCollapsed ? <ChevronRight className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                                                </button>
                                                {region}
                                            </div>
                                        </th>
                                    )
                                })}
                            </tr>

                            {/* Row 2: Markets */}
                            <tr>
                                <th className="sticky left-0 top-[76px] z-50 bg-[#F7F7F7]/95 backdrop-blur-sm p-3 text-left border-b border-border/40 text-[10px] font-bold text-muted-foreground uppercase tracking-widest shadow-[4px_0_12px_-2px_rgba(0,0,0,0.02)] pl-6">
                                    Bulk Actions
                                </th>
                                {regions.map(region => {
                                    const isCollapsed = collapsedRegions.includes(region);
                                    if (isCollapsed) return null;

                                    const regionMarkets = MARKETS.filter(m => m.region === region);
                                    return regionMarkets.map(m => {
                                        const isFullySelected = (matrix[m.selector]?.length || 0) === placements.length;
                                        return (
                                            <th key={m.selector}
                                                className="border-b border-r border-border/40 p-2 min-w-[50px] align-bottom h-40 hover:bg-white transition-colors cursor-pointer group bg-[#F7F7F7]"
                                                onClick={() => handleMarketHeaderClick(m.selector)}
                                            >
                                                <div className="flex flex-col items-center justify-end h-full pb-4">
                                                    <span className={cn(
                                                        "whitespace-nowrap -rotate-90 origin-center translate-y-4 select-none font-bold text-xs tracking-tight transition-all py-2 px-3 rounded-full",
                                                        isFullySelected ? "bg-[#222222] text-white shadow-lg" : "text-muted-foreground group-hover:text-[#222222]"
                                                    )}>
                                                        {m.code}
                                                    </span>
                                                </div>
                                            </th>
                                        )
                                    })
                                })}
                            </tr>
                        </thead>

                        {/* Table Body */}
                        <tbody className="divide-y divide-border/40 bg-white">
                            {Object.entries(placements.reduce((acc, placement) => {
                                const channel = placement.channel;
                                if (!acc[channel]) acc[channel] = [];
                                acc[channel].push(placement);
                                return acc;
                            }, {} as Record<string, typeof placements>)).map(([channel, channelPlacements]) => {
                                const isChannelCollapsed = collapsedChannels.includes(channel);
                                return (
                                    <React.Fragment key={channel}>
                                        {/* Channel Header */}
                                        <tr className="bg-[#F7F7F7]">
                                            <td
                                                onClick={() => handleChannelHeaderClick(channel)}
                                                className="p-4 pl-6 font-bold text-[#222222] text-xs uppercase tracking-widest sticky left-0 z-30 bg-[#F7F7F7] cursor-pointer hover:bg-white transition-colors select-none shadow-[4px_0_12px_-2px_rgba(0,0,0,0.02)] w-[320px] min-w-[320px] max-w-[320px]"
                                            >
                                                <div className="flex items-center gap-3">
                                                    <button
                                                        onClick={(e) => toggleChannelCollapse(channel, e)}
                                                        className="p-1.5 hover:bg-white rounded-full transition-all shadow-sm active:scale-90 border border-transparent hover:border-border/50"
                                                    >
                                                        {isChannelCollapsed ? <ChevronRight className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                                                    </button>
                                                    {channel}
                                                </div>
                                            </td>
                                            <td
                                                colSpan={regions.reduce((acc, r) => {
                                                    const isCollapsed = collapsedRegions.includes(r);
                                                    return acc + (isCollapsed ? 1 : MARKETS.filter(m => {
                                                        const matchesRegion = m.region === r;
                                                        const matchesSelected = !inputs.selectedMarkets || inputs.selectedMarkets.length === 0 || 
                                                                               inputs.selectedMarkets.includes(m.selector);
                                                        return matchesRegion && matchesSelected;
                                                    }).length);
                                                }, 0)}
                                                className="bg-[#F7F7F7] border-b border-border/40 pointer-events-none"
                                            />
                                        </tr>
                                        {/* Channel Placements */}
                                        {!isChannelCollapsed && channelPlacements.map(placement => (
                                            <tr key={placement.id} className="hover:bg-[#F7F7F7]/50 group transition-colors">
                                                {/* Sticky Left Column */}
                                                <th className="sticky left-0 z-20 bg-white group-hover:bg-[#F7F7F7]/50 transition-colors p-4 pl-6 text-left border-r border-border/40 shadow-[4px_0_12px_-2px_rgba(0,0,0,0.02)] w-[320px] min-w-[320px] max-w-[320px]">
                                                    <button
                                                        onClick={() => handlePlacementRowClick(placement.id)}
                                                        className="flex flex-col items-start text-left w-full group/btn transition-colors"
                                                    >
                                                        <span className="font-bold text-[#222222] text-sm group-hover/btn:text-[#FF385C] transition-colors mb-1">{placement.name}</span>
                                                        <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-wide bg-[#F7F7F7] px-2 py-0.5 rounded-full border border-border/50 flex items-center gap-1.5 flex-wrap">
                                                            <span>{placement.width}x{placement.height}</span>
                                                            <span>•</span>
                                                            <span>{placement.format}</span>
                                                            {placement.maxFileSize && (
                                                                <>
                                                                    <span>•</span>
                                                                    <span>{placement.maxFileSize >= 1024 ? `${(placement.maxFileSize / 1024).toFixed(0)}mb` : `${placement.maxFileSize}kb`}</span>
                                                                </>
                                                            )}
                                                        </span>
                                                    </button>
                                                </th>

                                                {/* Cells */}
                                                {regions.map(region => {
                                                    const isRegionCollapsed = collapsedRegions.includes(region);

                                                    if (isRegionCollapsed) {
                                                        return (
                                                            <td key={`collapsed-${region}-${placement.id}`} className="p-2 border-r border-border/40 text-center bg-[#F7F7F7]/50">
                                                            </td>
                                                        );
                                                    }

                                                    const regionMarkets = MARKETS.filter(m => {
                                                        const matchesRegion = m.region === region;
                                                        const matchesSelected = !inputs.selectedMarkets || inputs.selectedMarkets.length === 0 || 
                                                                               inputs.selectedMarkets.includes(m.selector);
                                                        return matchesRegion && matchesSelected;
                                                    });
                                                    return regionMarkets.map(market => {
                                                        const isSelected = matrix[market.selector]?.includes(placement.id);
                                                        return (
                                                            <td key={`${market.selector}-${placement.id}`} className="p-2 border-r border-border/40 last:border-r-0 text-center relative">
                                                                <button
                                                                    onClick={() => togglePlacement(market.selector, placement.id)}
                                                                    className={cn(
                                                                        "w-8 h-8 rounded-full flex items-center justify-center mx-auto transition-all duration-300",
                                                                        isSelected
                                                                            ? "bg-[#222222] text-white shadow-md scale-100 hover:bg-black"
                                                                            : "bg-transparent text-transparent hover:bg-[#F7F7F7] hover:border hover:border-border/50 active:scale-90"
                                                                    )}
                                                                    title={`${market.name} - ${placement.name}`}
                                                                >
                                                                    <Check className="w-4 h-4" strokeWidth={3} />
                                                                </button>
                                                            </td>
                                                        )
                                                    })
                                                })}
                                            </tr>
                                        ))}
                                    </React.Fragment>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </CardContent>
        </Card>
    );
}
