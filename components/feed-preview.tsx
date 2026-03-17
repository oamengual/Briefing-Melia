'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import { useBriefingStore } from '@/lib/store';

import { MARKETS, PLACEMENTS as SEED_PLACEMENTS } from '@/lib/constants';
import { getPlacements } from '@/lib/storage';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, FileText, Image as ImageIcon, Database } from 'lucide-react';
import { Market, Placement } from '@/lib/types';
import { Badge } from '@/components/ui/badge';

export function FeedPreview() {
    const { matrix, inputs, creative, translations, namingConvention, content } = useBriefingStore();
    const [activeTab, setActiveTab] = React.useState<'media' | 'creative' | 'salesforce'>('creative');

    // Dynamic Placements
    const [placements, setPlacements] = React.useState<Placement[]>(SEED_PLACEMENTS);
    React.useEffect(() => {
        setPlacements(getPlacements());
    }, []);

    const resolveContentText = React.useCallback((market: Market, fieldKey: 'mainMessage' | 'considerations' | 'legalTexts') => {
        const lang = market.defaultLang;
        const localTrans = translations[lang] || {};

        // 1. Translated exception
        const fieldData = content[fieldKey];
        if (!fieldData) return '';

        let exceptionId: string | undefined;
        for (const exc of (fieldData.exceptions || [])) {
            if ((exc.markets || []).includes(market.code)) {
                exceptionId = exc.id;
                break;
            }
        }

        if (exceptionId && localTrans.content?.[fieldKey]?.exceptions?.[exceptionId]) {
            return localTrans.content[fieldKey].exceptions![exceptionId];
        }

        // 2. Original exception
        if (exceptionId) {
            const orgExc = fieldData.exceptions.find(e => e.id === exceptionId);
            if (orgExc?.text) return orgExc.text;
        }

        // 3. Translated default
        if (localTrans.content?.[fieldKey]?.defaultText) {
            return localTrans.content[fieldKey].defaultText;
        }

        // 4. Original default
        return fieldData.defaultText || '';
    }, [translations, content]);

    const resolveContent = React.useCallback((market: Market) => {
        const lang = market.defaultLang;
        const localTrans = translations[lang] || {};

        return {
            claim: localTrans.claim || creative.claim,
            discount: localTrans.discount || creative.discount,
            cta: localTrans.cta || creative.cta,
            usp1: localTrans.usp1 || creative.usp1,
            usp2: localTrans.usp2 || creative.usp2,
            usp3: localTrans.usp3 || creative.usp3,
            mainMessage: resolveContentText(market, 'mainMessage'),
            considerations: resolveContentText(market, 'considerations'),
            legalTexts: resolveContentText(market, 'legalTexts'),
        };
    }, [translations, creative, resolveContentText]);

    // Helper to resolve token values
    const resolveToken = (token: string, data: {
        placement: Placement,
        market: Market,
        inputs: import('@/lib/types').CampaignInputs
    }): string => { // Explicitly typed inputs
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

    // Media Rows: One per asset (detailed)
    const mediaRows = React.useMemo(() => {
        const result: { market: Market; placement: Placement; filename: string }[] = [];

        // Use default if no custom convention
        const effectiveStructure = namingConvention?.structure || [
            'size', 'format', 'strategy', 'year', 'month', 'brand', 'channel',
            'campaign_name', 'market_code', 'language', 'agency', 'content_type',
            'duration', 'version'
        ];
        const separator = namingConvention ? namingConvention.separator : '-';

        Object.entries(matrix).forEach(([marketSelector, placementIds]) => {
            // Handle legacy key migration: ZH (China) -> CN (China)
            let lookupSelector = marketSelector;
            if (marketSelector.startsWith('ZH')) lookupSelector = 'CN (China)';

            const market = MARKETS.find((m) => m.selector === lookupSelector);
            if (!market) return;

            if (inputs.regions && !inputs.regions.includes(market.region)) return;

            placementIds.forEach((pid) => {
                const placement = placements.find((p) => p.id === pid);
                if (!placement) return;

                const parts = effectiveStructure.map(token => {
                    const raw = resolveToken(token, { placement, market, inputs });
                    if (!raw) return 'na';
                    // Replace spaces with underscores
                    return raw.trim().replace(/\s+/g, '_');
                });

                const filename = parts.join(separator).toLowerCase();
                // Ensure filename doesn't contain mixed market codes if they aren't part of THIS market
                // (though logic above should be per-market loop, so `market` variable IS correct).
                // The issue user described: "cr-ca-en". If inputs.market_code is used, it uses THE loop's market.
                // If inputs contains OTHER markets, we must ensure we use the LOCAL `market` variable.

                result.push({ market, placement, filename });
            });
        });
        return result;
    }, [matrix, inputs, namingConvention, placements]);

    // Creative Rows: One per Market-Language (aggregated)
    const creativeRows = React.useMemo(() => {
        const result: { market: Market; filename: string }[] = [];
        const seenMarkets = new Set<string>();

        Object.entries(matrix).forEach(([marketSelector, placementIds]) => {
            // Only include if there are actual placements selected
            if (!placementIds || placementIds.length === 0) return;

            // Handle legacy key migration: ZH (China) -> CN (China)
            let lookupSelector = marketSelector;
            if (marketSelector.startsWith('ZH')) lookupSelector = 'CN (China)';

            const market = MARKETS.find((m) => m.selector === lookupSelector);
            if (!market) return;

            if (inputs.regions && !inputs.regions.includes(market.region)) return;

            // Avoid duplicates if multiple selectors map to same code/lang (though usually 1:1)
            // The user asked for "one row per market-language".
            // Deduplicate by Market Code + Language to handle multi-lang markets (e.g. BE-fr, BE-nl)
            // The user wants strictly "Market-Language" pairs.
            const uniqueKey = `${market.code}-${market.defaultLang}`;
            if (seenMarkets.has(uniqueKey)) return;
            seenMarkets.add(uniqueKey);

            // Construct a generic filename or ID for this row
            // Since we ignore size, we just use the campaign/market basics
            const parts = [
                'GENERIC', // Placeholder for size
                inputs.strategy,
                inputs.brand,
                inputs.campaignName || 'CAMPAIGN',
                market.code,
                market.defaultLang
            ];
            const filename = parts.map(p => p || 'na').join('-').toLowerCase();

            result.push({ market, filename });
        });
        return result;
    }, [matrix, inputs]);

    // Salesforce Rows
    const salesforceRows = React.useMemo(() => {
        const result: any[] = [];
        Object.entries(matrix).forEach(([marketSelector, placementIds]) => {
            if (!placementIds || placementIds.length === 0) return;

            let lookupSelector = marketSelector;
            if (marketSelector.startsWith('ZH')) lookupSelector = 'CN (China)';

            const market = MARKETS.find((m) => m.selector === lookupSelector);
            if (!market) return;

            if (inputs.regions && !inputs.regions.includes(market.region)) return;

            const lang = market.defaultLang || 'en';
            const translation = translations[lang] || {};
            const content = resolveContent(market);

            result.push({
                campaign: inputs.campaignName || '',
                market: market.code,
                code: market.code,
                lang: lang,
                claim: content.claim,
                discount: content.discount,
                cta: content.cta,
                usp1: content.usp1,
                usp2: content.usp2,
                usp3: content.usp3,
                subject: translation.newsletter?.subject || creative.newsletter?.subject || '',
                landingTitle: translation.landing?.title || creative.landing?.title || ''
            });
        });
        return result;
    }, [matrix, inputs, translations, creative, resolveContent]);


    // Determine which fields are active (non-empty across the dataset)
    const activeCreativeFields = React.useMemo(() => {
        const fields = { usp1: false, usp2: false, usp3: false };
        creativeRows.forEach(row => {
            const content = resolveContent(row.market);
            if (content.usp1) fields.usp1 = true;
            if (content.usp2) fields.usp2 = true;
            if (content.usp3) fields.usp3 = true;
        });
        return fields;
    }, [creativeRows, resolveContent]);

    const downloadMediaCSV = () => {
        if (mediaRows.length === 0) return;
        const headers = ['Filename', 'Market', 'Placement', 'Size', 'Format'];
        const csvContent = [
            headers.join(','),
            ...mediaRows.map(row => [
                row.filename,
                row.market.code,
                row.placement.name,
                row.placement.size,
                row.placement.format
            ].join(','))
        ].join('\n');
        download(csvContent, `file_management_${inputs.campaignName || 'draft'}.csv`);
    };

    const downloadCreativeCSV = () => {
        if (creativeRows.length === 0) return;

        const headers = ['dataset_name', 'market_language', 'Claim', 'Discount', 'CTA', 'StartDate', 'EndDate'];
        if (activeCreativeFields.usp1) headers.push('USP1');
        if (activeCreativeFields.usp2) headers.push('USP2');
        if (activeCreativeFields.usp3) headers.push('USP3');
        headers.push('Main Message', 'Considerations', 'Legal Texts', 'KeyVisual');

        const csvContent = [
            headers.join(','),
            ...creativeRows.map(row => {
                const content = resolveContent(row.market);
                const values = [
                    row.filename,
                    `${row.market.code.toLowerCase()}-${row.market.defaultLang.toLowerCase()}`,
                    `"${content.claim || ''}"`,
                    `"${content.discount || ''}"`,
                    `"${content.cta || ''}"`,
                    inputs.startDate || '',
                    inputs.endDate || ''
                ];

                if (activeCreativeFields.usp1) values.push(`"${content.usp1 || ''}"`);
                if (activeCreativeFields.usp2) values.push(`"${content.usp2 || ''}"`);
                if (activeCreativeFields.usp3) values.push(`"${content.usp3 || ''}"`);

                values.push(`"${content.mainMessage || ''}"`);
                values.push(`"${content.considerations || ''}"`);
                values.push(`"${content.legalTexts || ''}"`);

                values.push(`"${creative.keyVisualUrl || ''}"`);

                return values.join(',');
            })
        ].join('\n');
        download(csvContent, `photoshop_content_${inputs.campaignName || 'draft'}.csv`);
    };

    const downloadSalesforceCSV = () => {
        if (salesforceRows.length === 0) return;
        const headers = [
            'Campaign_Name', 'Market', 'Language', 
            'Claim', 'Discount', 'CTA', 'USP1', 'USP2', 'USP3', 
            'Newsletter_Subject', 'Landing_Title'
        ];
        const csvContent = [
            headers.join(','),
            ...salesforceRows.map(row => [
                `"${row.campaign}"`,
                `"${row.market}"`,
                `"${row.lang}"`,
                `"${row.claim || ''}"`,
                `"${row.discount || ''}"`,
                `"${row.cta || ''}"`,
                `"${row.usp1 || ''}"`,
                `"${row.usp2 || ''}"`,
                `"${row.usp3 || ''}"`,
                `"${row.subject || ''}"`,
                `"${row.landingTitle || ''}"`
            ].join(','))
        ].join('\n');
        download(csvContent, `salesforce_feed_${inputs.campaignName || 'draft'}.csv`);
    };

    const download = (content: string, filename: string) => {
        const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', filename);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    const currentRows = activeTab === 'media' ? mediaRows : (activeTab === 'creative' ? creativeRows : salesforceRows);

    if (mediaRows.length === 0 && creativeRows.length === 0) {
        // Only show empty state if NOTHING selected at all.
        return (
            <Card className="w-full border-dashed shadow-none bg-muted/30 radius-card border border-border">
                <CardContent className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                    <Database className="h-8 w-8 mb-4 opacity-30 text-muted-foreground" />
                    <p className="font-medium text-muted-foreground">Select markets and placements to populate the feeds.</p>
                </CardContent>
            </Card>
        );
    }

    return (
        <div className="space-y-10 animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row gap-6 items-start md:items-center justify-between">
                <div className="space-y-1">
                    <h1 className="text-2xl font-bold text-foreground">Output Feeds</h1>
                    <p className="text-sm text-muted-foreground">
                        Generated <span className="text-primary font-semibold">{currentRows.length} rows</span> for {
                            activeTab === 'media' ? 'Media File Naming' : 
                            activeTab === 'creative' ? 'Photoshop Data' : 
                            'Salesforce Feed'
                        }.
                    </p>
                </div>

                <div className="flex items-center gap-1 bg-muted p-1 radius-input border border-border">
                    <button
                        onClick={() => setActiveTab('creative')}
                        className={cn(
                            "h-8 px-3 text-xs radius-btn transition-all flex items-center gap-2 font-medium",
                            activeTab === 'creative' ? "bg-white text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground hover:bg-white/50"
                        )}
                    >
                        <ImageIcon className="w-3.5 h-3.5" />
                        Photoshop
                    </button>
                    <button
                        onClick={() => setActiveTab('salesforce')}
                        className={cn(
                            "h-8 px-3 text-xs radius-btn transition-all flex items-center gap-2 font-medium",
                            activeTab === 'salesforce' ? "bg-white text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground hover:bg-white/50"
                        )}
                    >
                        <Database className="w-3.5 h-3.5" />
                        Salesforce
                    </button>
                    <button
                        onClick={() => setActiveTab('media')}
                        className={cn(
                            "h-8 px-3 text-xs radius-btn transition-all flex items-center gap-2 font-medium",
                            activeTab === 'media' ? "bg-white text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground hover:bg-white/50"
                        )}
                    >
                        <FileText className="w-3.5 h-3.5" />
                        Naming
                    </button>
                </div>
            </div>

            <Card className="shadow-card border border-border overflow-hidden bg-card radius-card">
                <div className="overflow-x-auto">
                    <div className="max-h-[600px] overflow-y-auto no-scrollbar">
                        <table className="w-full text-left border-collapse">
                            <thead className="sticky top-0 z-20">
                                <tr className="bg-muted/50 border-b border-border">
                                    <th className="px-4 py-3 text-xs font-medium text-muted-foreground sticky top-0 bg-muted/50">ID / Filename</th>
                                    {activeTab === 'media' ? (
                                        <>
                                            <th className="px-6 py-3 text-xs font-medium text-muted-foreground sticky top-0 bg-muted/50">Extension</th>
                                            <th className="px-6 py-3 text-xs font-medium text-muted-foreground sticky top-0 bg-muted/50">Market</th>
                                            <th className="px-6 py-3 text-xs font-medium text-muted-foreground sticky top-0 bg-muted/50">Size</th>
                                        </>
                                    ) : activeTab === 'creative' ? (
                                        <>
                                            <th className="px-6 py-3 text-xs font-medium text-muted-foreground sticky top-0 bg-muted/50">Market-Lang</th>
                                            <th className="px-6 py-3 text-xs font-medium text-muted-foreground sticky top-0 bg-muted/50">Claim</th>
                                            <th className="px-6 py-3 text-xs font-medium text-muted-foreground sticky top-0 bg-muted/50">Discount</th>
                                            <th className="px-6 py-3 text-xs font-medium text-muted-foreground sticky top-0 bg-muted/50">CTA</th>
                                            {activeCreativeFields.usp1 && <th className="px-6 py-3 text-xs font-medium text-muted-foreground sticky top-0 bg-muted/50">USP1</th>}
                                            {activeCreativeFields.usp2 && <th className="px-6 py-3 text-xs font-medium text-muted-foreground sticky top-0 bg-muted/50">USP2</th>}
                                            {activeCreativeFields.usp3 && <th className="px-6 py-3 text-xs font-medium text-muted-foreground sticky top-0 bg-muted/50">USP3</th>}
                                            <th className="px-6 py-3 text-xs font-medium text-muted-foreground sticky top-0 bg-muted/50">Main Msg</th>
                                            <th className="px-6 py-3 text-xs font-medium text-muted-foreground sticky top-0 bg-muted/50">Con.</th>
                                            <th className="px-6 py-3 text-xs font-medium text-muted-foreground sticky top-0 bg-muted/50">Legal</th>
                                        </>
                                    ) : (
                                        <>
                                            <th className="px-6 py-3 text-xs font-medium text-muted-foreground sticky top-0 bg-muted/50">Market</th>
                                            <th className="px-6 py-3 text-xs font-medium text-muted-foreground sticky top-0 bg-muted/50">Language</th>
                                            <th className="px-6 py-3 text-xs font-medium text-muted-foreground sticky top-0 bg-muted/50">Claim</th>
                                            <th className="px-6 py-3 text-xs font-medium text-muted-foreground sticky top-0 bg-muted/50">Newsletter Sub.</th>
                                            <th className="px-6 py-3 text-xs font-medium text-muted-foreground sticky top-0 bg-muted/50">Landing Title</th>
                                        </>
                                    )}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border">
                                {activeTab === 'media' ? (
                                    mediaRows.map((row, i) => (
                                        <tr key={i} className="hover:bg-muted/50 transition-colors group">
                                            <td className="px-6 py-3 font-mono text-xs text-foreground select-all font-medium">{row.filename}</td>
                                            <td className="px-4 py-2">
                                                <Badge variant="outline" className="text-[10px] font-mono radius-btn bg-background text-muted-foreground">
                                                    .{row.placement.format === 'img' ? 'jpg' : 'mp4'}
                                                </Badge>
                                            </td>
                                            <td className="px-6 py-3 text-xs font-semibold text-foreground">{row.market.code}</td>
                                            <td className="px-6 py-3">
                                                <Badge variant="secondary" className="text-[10px] font-mono radius-btn">
                                                    {row.placement.size}
                                                </Badge>
                                            </td>
                                        </tr>
                                    ))
                                ) : activeTab === 'creative' ? (
                                    creativeRows.map((row, i) => {
                                        const content = resolveContent(row.market);
                                        return (
                                            <tr key={i} className="hover:bg-muted/50 transition-colors group">
                                                <td className="px-6 py-3 font-mono text-[11px] text-foreground select-all font-medium">{row.filename}</td>
                                                <td className="px-6 py-3">
                                                    <Badge className="text-[9px] font-bold h-5 radius-btn px-2 uppercase tracking-wider bg-primary/10 text-primary border-none shadow-none hover:bg-primary/20">
                                                        {row.market.code.toLowerCase()}-{row.market.defaultLang.toLowerCase()}
                                                    </Badge>
                                                </td>
                                                <td className="px-6 py-3 text-xs font-medium text-foreground truncate max-w-[200px]" title={content.claim}>{content.claim}</td>
                                                <td className="px-6 py-3 text-xs text-muted-foreground">{content.discount}</td>
                                                <td className="px-6 py-3 text-xs text-muted-foreground">{content.cta}</td>
                                                {activeCreativeFields.usp1 && <td className="px-6 py-3 text-xs text-muted-foreground">{content.usp1}</td>}
                                                {activeCreativeFields.usp2 && <td className="px-6 py-3 text-xs text-muted-foreground">{content.usp2}</td>}
                                                {activeCreativeFields.usp3 && <td className="px-6 py-3 text-xs text-muted-foreground">{content.usp3}</td>}
                                                <td className="px-6 py-3 text-xs text-muted-foreground truncate max-w-[150px]" title={content.mainMessage}>{content.mainMessage}</td>
                                                <td className="px-6 py-3 text-xs text-muted-foreground truncate max-w-[150px]" title={content.considerations}>{content.considerations}</td>
                                                <td className="px-6 py-3 text-xs text-muted-foreground truncate max-w-[150px]" title={content.legalTexts}>{content.legalTexts}</td>
                                            </tr>
                                        )
                                    })
                                ) : (
                                    salesforceRows.map((row, i) => (
                                        <tr key={i} className="hover:bg-muted/50 transition-colors group">
                                            <td className="px-6 py-3 font-mono text-[11px] text-foreground select-all font-medium whitespace-nowrap">{row.campaign}</td>
                                            <td className="px-6 py-3 text-xs font-semibold text-foreground">{row.market}</td>
                                            <td className="px-6 py-3">
                                                <Badge variant="outline" className="text-[10px] uppercase font-mono">{row.lang}</Badge>
                                            </td>
                                            <td className="px-6 py-3 text-xs text-muted-foreground truncate max-w-[200px]">{row.claim}</td>
                                            <td className="px-6 py-3 text-xs text-muted-foreground truncate max-w-[200px]">{row.subject}</td>
                                            <td className="px-6 py-3 text-xs text-muted-foreground truncate max-w-[200px]">{row.landingTitle}</td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className="p-4 border-t border-border bg-muted/20 flex justify-end">
                    <Button
                        size="sm"
                        onClick={
                            activeTab === 'media' ? downloadMediaCSV : 
                            activeTab === 'creative' ? downloadCreativeCSV : 
                            downloadSalesforceCSV
                        }
                        className="radius-btn font-medium"
                    >
                        <Download className="w-4 h-4 mr-2" />
                        Download {
                            activeTab === 'media' ? 'Naming' : 
                            activeTab === 'creative' ? 'Photoshop' : 
                            'Salesforce'
                        } CSV
                    </Button>
                </div>
            </Card>
        </div >
    );
}
