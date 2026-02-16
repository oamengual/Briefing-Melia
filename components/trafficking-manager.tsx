'use client';

import * as React from 'react';
import { useBriefingStore } from '@/lib/store';
import { MARKETS, PLACEMENTS as SEED_PLACEMENTS } from '@/lib/constants';
import { getPlacements } from '@/lib/storage';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Download, Link as LinkIcon } from 'lucide-react';
import { Market, Placement, TraffickingData } from '@/lib/types';

export function TraffickingManager() {
    const { matrix, inputs, trafficking, setTrafficking } = useBriefingStore();

    // Dynamic Placements State
    const [placements, setPlacements] = React.useState<Placement[]>(SEED_PLACEMENTS);

    React.useEffect(() => {
        setPlacements(getPlacements());
    }, []);

    // Generate Rows based on Matrix
    const rows = React.useMemo(() => {
        const result: { id: string; market: Market; placement: Placement }[] = [];

        Object.entries(matrix).forEach(([marketSelector, placementIds]) => {
            // Region Filter
            let lookupSelector = marketSelector;
            if (marketSelector.startsWith('ZH')) lookupSelector = 'CN (China)';
            const market = MARKETS.find(m => m.selector === lookupSelector);
            if (!market) return;

            if (inputs.regions && !inputs.regions.includes(market.region)) return;

            placementIds.forEach(pid => {
                const placement = placements.find(p => p.id === pid);
                if (placement) {
                    result.push({
                        id: `${marketSelector}_${pid}`,
                        market,
                        placement
                    });
                }
            });
        });
        return result;
    }, [matrix, inputs.regions, placements]);

    // Bulk Apply functions
    const applyToAll = (field: keyof TraffickingData, value: string) => {
        if (!confirm('This will overwrite this field for ALL rows. Continue?')) return;
        rows.forEach(row => {
            setTrafficking(row.id, { [field]: value });
        });
    };

    const downloadCSV = () => {
        if (rows.length === 0) return;

        const headers = ['Market', 'Placement', 'Size', 'Channel', 'Landing Page', 'UTM Source', 'UTM Medium', 'UTM Campaign', 'Click Tracker', 'Impression Tracker', 'Final URL'];
        const csvContent = [
            headers.join(','),
            ...rows.map(({ id, market, placement }) => {
                const data = trafficking[id] || {};

                // Construct Final URL
                let finalUrl = data.landingPage || '';
                if (finalUrl) {
                    const params = new URLSearchParams();
                    if (data.utmSource) params.append('utm_source', data.utmSource);
                    if (data.utmMedium) params.append('utm_medium', data.utmMedium);
                    if (data.utmCampaign) params.append('utm_campaign', data.utmCampaign);
                    const qs = params.toString();
                    if (qs) finalUrl += (finalUrl.includes('?') ? '&' : '?') + qs;
                }

                return [
                    market.code,
                    placement.name,
                    placement.size,
                    placement.channel,
                    `"${data.landingPage || ''}"`,
                    `"${data.utmSource || ''}"`,
                    `"${data.utmMedium || ''}"`,
                    `"${data.utmCampaign || ''}"`,
                    `"${data.clickTracker || ''}"`,
                    `"${data.impressionTracker || ''}"`,
                    `"${finalUrl}"`
                ].join(',');
            })
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `trafficking_${inputs.campaignName || 'draft'}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    if (rows.length === 0) {
        return (
            <Card className="w-full bg-muted/30 border-dashed border-2 border-border shadow-none radius-card">
                <CardContent className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                    <LinkIcon className="h-10 w-10 mb-4 opacity-30" />
                    <p className="text-sm font-medium">Select markets and placements to configure trafficking.</p>
                </CardContent>
            </Card>
        );
    }

    // Default Values for placeholders
    const defaultUtmSource = inputs.agency || 'agency';
    const defaultUtmMedium = 'display'; // Generic default
    const defaultUtmCampaign = inputs.campaignName || 'campaign';

    return (
        <Card className="w-full bg-card border border-border shadow-card radius-card overflow-hidden animate-in fade-in duration-500">
            <CardHeader className="flex flex-row items-center justify-between p-6 pb-4 border-b border-border bg-card text-foreground">
                <div>
                    <CardTitle className="text-xl font-bold tracking-tight">Trafficking Sheet</CardTitle>
                    <CardDescription className="text-sm font-medium text-muted-foreground mt-1">Configure destination URLs and tracking parameters for all placements.</CardDescription>
                </div>
                <Button onClick={downloadCSV} size="sm" className="h-9 px-4 radius-btn font-semibold bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm hover:shadow-md transition-all active:scale-95">
                    <Download className="w-4 h-4 mr-2" />
                    Download CSV
                </Button>
            </CardHeader>
            <CardContent className="p-0">
                <div className="overflow-auto max-h-[600px] w-full no-scrollbar">
                    <table className="w-full text-sm text-left border-collapse">
                        <thead className="bg-muted/50 sticky top-0 z-10 text-[10px] uppercase font-bold text-muted-foreground shadow-sm">
                            <tr>
                                <th className="px-6 py-3 border-b border-r border-border min-w-[160px] sticky left-0 bg-muted/50 z-20 shadow-[4px_0_12px_-2px_rgba(0,0,0,0.02)] tracking-wider">Placement</th>
                                <th className="px-4 py-3 border-b border-border min-w-[200px] tracking-wider">
                                    <div className="flex items-center justify-between">
                                        Landing Page
                                        <button onClick={() => {
                                            const val = prompt('Enter Landing Page URL for ALL rows:');
                                            if (val) applyToAll('landingPage', val);
                                        }} className="text-[10px] px-2 py-0.5 rounded-sm bg-background border border-border text-foreground hover:bg-muted transition-colors">Apply All</button>
                                    </div>
                                </th>
                                <th className="px-3 py-3 border-b border-border w-[140px] tracking-wider">
                                    <div className="flex items-center justify-between">
                                        Source
                                        <button onClick={() => applyToAll('utmSource', defaultUtmSource)} className="text-[10px] px-2 py-0.5 rounded-sm bg-background border border-border text-foreground hover:bg-muted transition-colors">Auto</button>
                                    </div>
                                </th>
                                <th className="px-3 py-3 border-b border-border w-[140px] tracking-wider">
                                    <div className="flex items-center justify-between">
                                        Medium
                                        <button onClick={() => applyToAll('utmMedium', defaultUtmMedium)} className="text-[10px] px-2 py-0.5 rounded-sm bg-background border border-border text-foreground hover:bg-muted transition-colors">Auto</button>
                                    </div>
                                </th>
                                <th className="px-3 py-3 border-b border-border w-[180px] tracking-wider">
                                    <div className="flex items-center justify-between">
                                        Campaign
                                        <button onClick={() => applyToAll('utmCampaign', defaultUtmCampaign)} className="text-[10px] px-2 py-0.5 rounded-sm bg-background border border-border text-foreground hover:bg-muted transition-colors">Auto</button>
                                    </div>
                                </th>
                                <th className="px-3 py-3 border-b border-border min-w-[180px] tracking-wider">
                                    <div className="flex items-center justify-between">
                                        Click Tracker
                                        <button onClick={() => {
                                            const val = prompt('Enter Click Tracker for ALL rows:');
                                            if (val) applyToAll('clickTracker', val);
                                        }} className="text-[10px] px-2 py-0.5 rounded-sm bg-background border border-border text-foreground hover:bg-muted transition-colors">Apply All</button>
                                    </div>
                                </th>
                                <th className="px-3 py-3 border-b border-border min-w-[180px] tracking-wider">
                                    <div className="flex items-center justify-between">
                                        Impression Tracker
                                        <button onClick={() => {
                                            const val = prompt('Enter Impression Tracker for ALL rows:');
                                            if (val) applyToAll('impressionTracker', val);
                                        }} className="text-[10px] px-2 py-0.5 rounded-sm bg-background border border-border text-foreground hover:bg-muted transition-colors">Apply All</button>
                                    </div>
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                            {rows.map((row) => {
                                const data = trafficking[row.id] || {};
                                return (
                                    <tr key={row.id} className="hover:bg-muted/50 transition-colors group">
                                        <td className="px-6 py-2 border-r border-border bg-background sticky left-0 z-10 group-hover:bg-muted/50 shadow-[4px_0_12px_-2px_rgba(0,0,0,0.02)] transition-colors">
                                            <div className="font-bold text-foreground tracking-tight">{row.market.code}</div>
                                            <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-wide truncate max-w-[120px]" title={row.placement.name}>{row.placement.name}</div>
                                            <div className="mt-1 inline-flex items-center px-1.5 py-0.5 rounded-sm bg-muted border border-border text-[9px] font-mono font-medium text-foreground">
                                                {row.placement.size}
                                            </div>
                                        </td>
                                        <td className="p-2">
                                            <Input
                                                className="h-8 text-[11px] font-mono bg-muted/30 border border-transparent focus:bg-background focus:border-input focus:ring-0 radius-input transition-all"
                                                placeholder="https://..."
                                                value={data.landingPage || ''}
                                                onChange={(e) => setTrafficking(row.id, { landingPage: e.target.value })}
                                            />
                                        </td>
                                        <td className="p-2">
                                            <Input
                                                className="h-8 text-[11px] bg-muted/30 border border-transparent focus:bg-background focus:border-input focus:ring-0 radius-input transition-all"
                                                placeholder="utm_source"
                                                value={data.utmSource || ''}
                                                onChange={(e) => setTrafficking(row.id, { utmSource: e.target.value })}
                                            />
                                        </td>
                                        <td className="p-2">
                                            <Input
                                                className="h-8 text-[11px] bg-muted/30 border border-transparent focus:bg-background focus:border-input focus:ring-0 radius-input transition-all"
                                                placeholder="utm_medium"
                                                value={data.utmMedium || ''}
                                                onChange={(e) => setTrafficking(row.id, { utmMedium: e.target.value })}
                                            />
                                        </td>
                                        <td className="p-2">
                                            <Input
                                                className="h-8 text-[11px] bg-muted/30 border border-transparent focus:bg-background focus:border-input focus:ring-0 radius-input transition-all"
                                                placeholder="utm_campaign"
                                                value={data.utmCampaign || ''}
                                                onChange={(e) => setTrafficking(row.id, { utmCampaign: e.target.value })}
                                            />
                                        </td>
                                        <td className="p-2">
                                            <Input
                                                className="h-8 text-[11px] font-mono bg-muted/30 border border-transparent focus:bg-background focus:border-input focus:ring-0 radius-input transition-all"
                                                placeholder="https://track..."
                                                value={data.clickTracker || ''}
                                                onChange={(e) => setTrafficking(row.id, { clickTracker: e.target.value })}
                                            />
                                        </td>
                                        <td className="p-2">
                                            <Input
                                                className="h-8 text-[11px] font-mono bg-muted/30 border border-transparent focus:bg-background focus:border-input focus:ring-0 radius-input transition-all"
                                                placeholder="https://imp..."
                                                value={data.impressionTracker || ''}
                                                onChange={(e) => setTrafficking(row.id, { impressionTracker: e.target.value })}
                                            />
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </CardContent>
        </Card>
    );
}
