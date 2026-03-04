'use client';

import * as React from 'react';
import { useBriefingStore } from '@/lib/store';
import { MARKETS } from '@/lib/constants';
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { RichTextEditor } from "@/components/ui/rich-text-editor";
import { Input } from "@/components/ui/input";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Settings, FileText, ToggleLeft, Globe, LinkIcon, MapPin, ExternalLink, Plus, Trash2, CheckCircle2, X } from 'lucide-react';
import { ContentConfig } from '@/lib/types';

export function ContentManager() {
    const { inputs, matrix, content, setContentField, setContentExceptions, setMarketSetting, setLandingConfig } = useBriefingStore();

    // Derive active market codes directly
    const activeMarketCodes = React.useMemo(() => {
        const codes = new Set<string>();
        Object.keys(matrix).forEach(sel => {
            if (!matrix[sel] || matrix[sel].length === 0) return;
            let lookupSelector = sel;
            if (sel.startsWith('ZH')) lookupSelector = 'CN (China)';
            const m = MARKETS.find(m => m.selector === lookupSelector);
            if (m && (!inputs.regions || inputs.regions.includes(m.region))) {
                codes.add(m.code);
            }
        });
        return Array.from(codes).sort();
    }, [matrix, inputs.regions]);


    const renderGlobalTextField = (
        fieldKey: 'mainMessage' | 'considerations' | 'legalTexts',
        title: string,
        description: string
    ) => {
        const fieldData = content[fieldKey];
        const hasExceptions = fieldData.exceptions.length > 0;

        return (
            <div className="space-y-4 p-5 radius-card border border-border bg-card shadow-sm mb-6 animate-in fade-in slide-in-from-bottom-2">
                <div className="flex items-start justify-between">
                    <div>
                        <h3 className="text-sm font-bold flex items-center gap-2">
                            <FileText className="w-4 h-4 text-primary" /> {title}
                        </h3>
                        <p className="text-xs text-muted-foreground mt-1 max-w-xl">{description}</p>
                    </div>
                </div>

                <div className="space-y-3">
                    <div className="relative">
                        <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground absolute -top-2 left-3 bg-card px-1">
                            Default (All Active Markets)
                        </label>
                        <RichTextEditor
                            value={fieldData.defaultText || ''}
                            onChange={(html) => setContentField(fieldKey, html)}
                            placeholder={`Enter general ${title.toLowerCase()}...`}
                        />
                    </div>

                    {fieldData.exceptions.map((exc, index) => (
                        <div key={exc.id || index} className="relative mt-4 p-4 border rounded-md bg-muted/5 border-border shadow-sm">
                            <div className="flex items-start justify-between mb-3">
                                <div>
                                    <label className="text-[10px] font-bold uppercase tracking-wider text-primary">
                                        Exception {index + 1}
                                    </label>
                                    <p className="text-[10px] text-muted-foreground mt-0.5">Select the markets this exception applies to:</p>
                                    <div className="flex flex-wrap gap-1.5 mt-2">
                                        {activeMarketCodes.map(market => {
                                            const isSelected = exc.markets.includes(market);
                                            return (
                                                <Badge
                                                    key={market}
                                                    variant={isSelected ? "default" : "outline"}
                                                    className={cn("cursor-pointer text-[10px] py-0 h-5 px-2", isSelected ? "bg-primary text-primary-foreground hover:bg-primary/90" : "hover:bg-muted font-normal")}
                                                    onClick={() => {
                                                        const newMarkets = isSelected
                                                            ? exc.markets.filter(m => m !== market)
                                                            : [...exc.markets, market];

                                                        const newExceptions = [...fieldData.exceptions];
                                                        newExceptions[index] = { ...exc, markets: newMarkets };
                                                        setContentExceptions(fieldKey, newExceptions);
                                                    }}
                                                >
                                                    {market}
                                                </Badge>
                                            );
                                        })}
                                    </div>
                                </div>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-6 w-6 text-muted-foreground hover:text-destructive"
                                    onClick={() => {
                                        const newExceptions = fieldData.exceptions.filter((_, i) => i !== index);
                                        setContentExceptions(fieldKey, newExceptions);
                                    }}
                                >
                                    <Trash2 className="w-3 h-3" />
                                </Button>
                            </div>
                            <RichTextEditor
                                value={exc.text || ''}
                                onChange={(html) => {
                                    const newExceptions = [...fieldData.exceptions];
                                    newExceptions[index] = { ...exc, text: html };
                                    setContentExceptions(fieldKey, newExceptions);
                                }}
                                placeholder="Exception text..."
                            />
                        </div>
                    ))}

                    <div className="pt-2">
                        <Button
                            variant="outline"
                            size="sm"
                            className="h-8 text-xs border-dashed"
                            onClick={() => {
                                setContentExceptions(fieldKey, [
                                    ...fieldData.exceptions,
                                    { id: Math.random().toString(36).substring(7), text: '', markets: [] }
                                ]);
                            }}
                        >
                            <Plus className="w-3 h-3 mr-1" /> Add New Exception
                        </Button>
                    </div>
                </div>
            </div>
        );
    };

    const exclusionRules = [
        { key: 'addTransferLink', label: 'Add Transfer Link (Landing)', icon: <LinkIcon className="w-3 h-3" /> },
        { key: 'addRiuClassLink', label: 'Add RIU Class Link', icon: <LinkIcon className="w-3 h-3" /> },
        { key: 'excludeGaroe', label: 'Exclude Riu Garoe', icon: <MapPin className="w-3 h-3" /> },
        { key: 'excludeFlightHotel', label: 'Exclude Flight+Hotel', icon: <Globe className="w-3 h-3" /> },
        { key: 'excludePlazaHotels', label: 'Exclude Plaza Hotels', icon: <MapPin className="w-3 h-3" /> },
    ];

    const contentLocations = [
        { key: 'landing', label: 'Landing Page' },
        { key: 'newsletterB2C', label: 'Newsletter B2C' },
        { key: 'newsletterRC', label: 'Newsletter RC' },
        { key: 'lastMinuteNewsletterB2C', label: 'Last Minute News. B2C' },
        { key: 'lastMinuteNewsletterRC', label: 'Last Minute News. RC' },
        { key: 'pushB2C', label: 'Push B2C' },
        { key: 'pushRC', label: 'Push RC' },
        { key: 'lastMinutePushB2C', label: 'Last Minute Push B2C' },
        { key: 'lastMinutePushRC', label: 'Last Minute Push RC' },
    ];


    if (activeMarketCodes.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center p-12 border-2 border-dashed border-border radius-card bg-muted/10 text-center h-[500px]">
                <Settings className="w-12 h-12 text-muted-foreground/30 mb-4" />
                <h3 className="text-sm font-bold text-foreground">No Markets Active</h3>
                <p className="text-sm text-muted-foreground mt-1 max-w-xs">
                    Please allocate placements in the Media Plan matrix first to configure market-specific content.
                </p>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-[750px] border border-border radius-card bg-card overflow-hidden shadow-sm">
            <div className="h-16 shrink-0 border-b border-border flex items-center px-6 bg-card">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary mr-3">
                    <Settings className="w-4 h-4" />
                </div>
                <div>
                    <h2 className="text-sm font-bold text-foreground">Content & Platform Configuration</h2>
                    <p className="text-[10px] text-muted-foreground font-medium">
                        Configure global texts, specific market rules, and landing setups.
                    </p>
                </div>
            </div>

            <Tabs defaultValue="texts" className="flex-1 flex flex-col min-h-0">
                <div className="border-b border-border px-6 pt-4 bg-muted/20">
                    <TabsList className="bg-transparent h-10 p-0 border-b-2 border-transparent w-full justify-start gap-6 rounded-none">
                        <TabsTrigger value="texts" className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-primary border-b-2 border-transparent rounded-none px-1 pb-2">
                            Global Texts & Exceptions
                        </TabsTrigger>
                        <TabsTrigger value="rules" className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-primary border-b-2 border-transparent rounded-none px-1 pb-2">
                            Market Rules Matrix
                        </TabsTrigger>
                        <TabsTrigger value="locations" className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-primary border-b-2 border-transparent rounded-none px-1 pb-2">
                            Content Locations Matrix
                        </TabsTrigger>
                        <TabsTrigger value="landing" className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-primary border-b-2 border-transparent rounded-none px-1 pb-2">
                            Landing Settings
                        </TabsTrigger>
                    </TabsList>
                </div>

                <div className="flex-1 overflow-hidden relative bg-muted/5">

                    {/* 1. TEXTS & EXCEPTIONS */}
                    <TabsContent value="texts" className="h-full m-0 p-0 focus-visible:outline-none flex flex-col data-[state=inactive]:hidden">
                        <ScrollArea className="h-full">
                            <div className="p-8 max-w-4xl mx-auto pb-20">
                                {renderGlobalTextField('mainMessage', 'Main Communication Message', 'The primary message or hook for this campaign.')}
                                {renderGlobalTextField('considerations', 'Considerations & Notes', 'Internal notes or special considerations for the content team.')}
                                {renderGlobalTextField('legalTexts', 'Legal Text & B2C Conditions', 'Terms, conditions, and legal disclaimers for the campaign.')}
                            </div>
                        </ScrollArea>
                    </TabsContent>


                    {/* 2. RULES MATRIX */}
                    <TabsContent value="rules" className="h-full m-0 p-0 focus-visible:outline-none flex flex-col data-[state=inactive]:hidden">
                        <div className="p-6 border-b border-border bg-card">
                            <h3 className="text-sm font-bold">Market Exclusions & Links</h3>
                            <p className="text-xs text-muted-foreground">Toggle specific behavior rules per active market.</p>
                        </div>
                        <ScrollArea className="flex-1">
                            <div className="p-6 inline-block min-w-full">
                                <div className="radius-card border border-border overflow-hidden bg-card shadow-sm">
                                    <table className="w-full text-sm text-left">
                                        <thead className="bg-muted/30 text-xs text-muted-foreground uppercase tracking-wider border-b border-border">
                                            <tr>
                                                <th className="px-6 py-4 font-bold border-r border-border bg-card sticky left-0 z-20 w-[200px] shadow-[2px_0_5px_-2px_rgba(0,0,0,0.05)]">Market</th>
                                                {exclusionRules.map(rule => (
                                                    <th key={rule.key} className="px-4 py-3 font-semibold text-center whitespace-nowrap min-w-[150px] group">
                                                        <div className="flex flex-col items-center justify-center gap-2">
                                                            <div className="flex items-center gap-1.5 text-foreground/80 group-hover:text-foreground transition-colors">
                                                                {rule.icon}
                                                                {rule.label}
                                                            </div>
                                                            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                                <Button
                                                                    variant="ghost"
                                                                    size="icon"
                                                                    className="h-5 w-5 rounded-full hover:bg-primary hover:text-primary-foreground text-muted-foreground"
                                                                    title={`Select all for ${rule.label}`}
                                                                    onClick={() => {
                                                                        activeMarketCodes.forEach(market => {
                                                                            setMarketSetting(market, { [rule.key]: true });
                                                                        });
                                                                    }}
                                                                >
                                                                    <CheckCircle2 className="w-3 h-3" />
                                                                </Button>
                                                                <Button
                                                                    variant="ghost"
                                                                    size="icon"
                                                                    className="h-5 w-5 rounded-full hover:bg-destructive hover:text-destructive-foreground text-muted-foreground"
                                                                    title={`Clear all for ${rule.label}`}
                                                                    onClick={() => {
                                                                        activeMarketCodes.forEach(market => {
                                                                            setMarketSetting(market, { [rule.key]: false });
                                                                        });
                                                                    }}
                                                                >
                                                                    <X className="w-3 h-3" />
                                                                </Button>
                                                            </div>
                                                        </div>
                                                    </th>
                                                ))}
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-border">
                                            {activeMarketCodes.map(market => {
                                                const settings = content?.marketSettings?.[market] || {};
                                                return (
                                                    <tr key={market} className="hover:bg-muted/50 transition-colors">
                                                        <td className="px-6 py-3 font-semibold text-foreground border-r border-border bg-card sticky left-0 z-10 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.05)] group-hover:bg-muted/50">
                                                            {market}
                                                        </td>
                                                        {exclusionRules.map(rule => (
                                                            <td key={rule.key} className="px-4 py-3 text-center">
                                                                <div className="flex justify-center">
                                                                    <Switch
                                                                        checked={!!settings[rule.key as keyof typeof settings]}
                                                                        onCheckedChange={(val) => setMarketSetting(market, { [rule.key]: val })}
                                                                        className="data-[state=checked]:bg-primary"
                                                                    />
                                                                </div>
                                                            </td>
                                                        ))}
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                            <ScrollBar orientation="horizontal" />
                        </ScrollArea>
                    </TabsContent>


                    {/* 3. LOCATIONS MATRIX */}
                    <TabsContent value="locations" className="h-full m-0 p-0 focus-visible:outline-none flex flex-col data-[state=inactive]:hidden">
                        <div className="p-6 border-b border-border bg-card">
                            <h3 className="text-sm font-bold">Content Locations</h3>
                            <p className="text-xs text-muted-foreground">Specify where translated texts are required for each market.</p>
                        </div>
                        <ScrollArea className="flex-1 h-full">
                            <div className="p-6 inline-block min-w-full">
                                <div className="radius-card border border-border overflow-hidden bg-card shadow-sm">
                                    <table className="w-full text-sm text-left">
                                        <thead className="bg-muted/30 text-xs text-muted-foreground uppercase tracking-wider border-b border-border">
                                            <tr>
                                                <th className="px-6 py-4 font-bold border-r border-border bg-card sticky left-0 z-20 w-[200px] shadow-[2px_0_5px_-2px_rgba(0,0,0,0.05)]">Location</th>
                                                {activeMarketCodes.map(market => (
                                                    <th key={market} className="px-4 py-3 font-semibold text-center whitespace-nowrap min-w-[120px] group">
                                                        <div className="flex flex-col items-center justify-center gap-2">
                                                            <div className="flex items-center gap-1.5 text-foreground/80 group-hover:text-foreground transition-colors">
                                                                {market}
                                                            </div>
                                                            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                                <Button
                                                                    variant="ghost"
                                                                    size="icon"
                                                                    className="h-5 w-5 rounded-full hover:bg-primary hover:text-primary-foreground text-muted-foreground"
                                                                    title={`Select all for ${market}`}
                                                                    onClick={() => {
                                                                        const updates: Record<string, boolean> = {};
                                                                        contentLocations.forEach(loc => updates[loc.key] = true);
                                                                        setMarketSetting(market, { locations: updates as any });
                                                                    }}
                                                                >
                                                                    <CheckCircle2 className="w-3 h-3" />
                                                                </Button>
                                                                <Button
                                                                    variant="ghost"
                                                                    size="icon"
                                                                    className="h-5 w-5 rounded-full hover:bg-destructive hover:text-destructive-foreground text-muted-foreground"
                                                                    title={`Clear all for ${market}`}
                                                                    onClick={() => {
                                                                        const updates: Record<string, boolean> = {};
                                                                        contentLocations.forEach(loc => updates[loc.key] = false);
                                                                        setMarketSetting(market, { locations: updates as any });
                                                                    }}
                                                                >
                                                                    <X className="w-3 h-3" />
                                                                </Button>
                                                            </div>
                                                        </div>
                                                    </th>
                                                ))}
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-border">
                                            {contentLocations.map(loc => (
                                                <tr key={loc.key} className="hover:bg-muted/50 transition-colors">
                                                    <td className="px-6 py-3 font-semibold text-muted-foreground border-r border-border bg-card sticky left-0 z-10 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.05)] text-xs group-hover:bg-muted/50">
                                                        {loc.label}
                                                    </td>
                                                    {activeMarketCodes.map(market => {
                                                        const locations = content?.marketSettings?.[market]?.locations || {};
                                                        return (
                                                            <td key={market} className="px-4 py-3 text-center">
                                                                <div className="flex justify-center">
                                                                    <Switch
                                                                        checked={!!(locations as any)[loc.key]}
                                                                        onCheckedChange={(checked) => {
                                                                            const currentLocs = content?.marketSettings?.[market]?.locations || {};
                                                                            setMarketSetting(market, { locations: { ...currentLocs, [loc.key]: checked } as any });
                                                                        }}
                                                                        className="data-[state=checked]:bg-primary"
                                                                    />
                                                                </div>
                                                            </td>
                                                        )
                                                    })}
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                            <ScrollBar orientation="horizontal" />
                        </ScrollArea>
                    </TabsContent>


                    {/* 4. LANDING SETTINGS */}
                    <TabsContent value="landing" className="h-full m-0 p-0 focus-visible:outline-none flex flex-col data-[state=inactive]:hidden">
                        <ScrollArea className="flex-1 h-full">
                            <div className="p-6 grid grid-cols-1 xl:grid-cols-2 gap-6 pb-20 max-w-[1600px] mx-auto">
                                {activeMarketCodes.map(market => {
                                    const config = content?.landingConfig?.[market] || {
                                        url: '', updateDate: '', hasFastbooking: false, hotelsToShow: '',
                                        showPromoCode: false, promoCodeText: '', hasCountdown: false, countdownDate: ''
                                    };

                                    const updateConf = (updates: any) => setLandingConfig(market, updates);

                                    return (
                                        <div key={market} className="radius-card border border-border bg-card shadow-sm flex flex-col overflow-hidden">
                                            <div className="bg-muted/10 px-5 py-3 border-b border-border flex items-center justify-between">
                                                <h4 className="font-bold flex items-center gap-2.5">
                                                    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-sm text-primary font-black border border-primary/20 shadow-sm">
                                                        {market}
                                                    </div>
                                                    <div className="flex flex-col">
                                                        <span className="text-sm">Landing Setup</span>
                                                        <span className="text-[10px] font-medium text-muted-foreground">Configure market-specific landing properties</span>
                                                    </div>
                                                </h4>
                                            </div>

                                            <div className="p-6 grid gap-5">
                                                <div className="grid grid-cols-[1fr_120px] gap-3">
                                                    <div className="space-y-1.5">
                                                        <label className="text-[10px] font-bold uppercase text-muted-foreground">Landing URL</label>
                                                        <Input
                                                            value={config.url}
                                                            onChange={e => updateConf({ url: e.target.value })}
                                                            className="h-9 text-xs bg-muted/30 hover:bg-muted/50 focus:bg-background transition-colors border-border/50"
                                                            placeholder="https://..."
                                                        />
                                                    </div>
                                                    <div className="space-y-1.5">
                                                        <label className="text-[10px] font-bold uppercase text-muted-foreground">Update Date</label>
                                                        <Input type="date" value={config.updateDate} onChange={e => updateConf({ updateDate: e.target.value })} className="h-9 text-xs bg-muted/30 hover:bg-muted/50 focus:bg-background transition-colors border-border/50" />
                                                    </div>
                                                </div>

                                                <div className="space-y-1.5 pt-2">
                                                    <label className="text-[10px] font-bold uppercase text-muted-foreground">Hotels to Show</label>
                                                    <Textarea
                                                        value={config.hotelsToShow}
                                                        onChange={e => updateConf({ hotelsToShow: e.target.value })}
                                                        className="h-[60px] min-h-[60px] text-xs bg-muted/30 hover:bg-muted/50 focus:bg-background transition-colors resize-none border-border/50"
                                                        placeholder="List of hotel IDs or names..."
                                                    />
                                                </div>

                                                <div className="grid grid-cols-3 gap-6 pt-2 border-t border-border">
                                                    <div className="flex flex-col gap-3">
                                                        <div className="flex items-center justify-between p-2 rounded-md bg-muted/30 border border-border/50">
                                                            <label className="text-xs font-semibold">Fastbooking Bar</label>
                                                            <Switch
                                                                checked={config.hasFastbooking}
                                                                onCheckedChange={v => updateConf({ hasFastbooking: v })}
                                                                className="data-[state=checked]:bg-primary"
                                                            />
                                                        </div>
                                                    </div>

                                                    <div className="flex flex-col gap-3">
                                                        <div className="flex items-center justify-between p-2 rounded-md bg-muted/30 border border-border/50">
                                                            <label className="text-xs font-semibold">Promo Code</label>
                                                            <Switch
                                                                checked={config.showPromoCode}
                                                                onCheckedChange={v => updateConf({ showPromoCode: v })}
                                                                className="data-[state=checked]:bg-primary"
                                                            />
                                                        </div>
                                                        {config.showPromoCode && (
                                                            <Input
                                                                value={config.promoCodeText}
                                                                onChange={e => updateConf({ promoCodeText: e.target.value })}
                                                                className="h-8 text-xs mt-1 bg-muted/30 border-border/50"
                                                                placeholder="e.g. SUMMER26"
                                                            />
                                                        )}
                                                    </div>

                                                    <div className="flex flex-col gap-3">
                                                        <div className="flex items-center justify-between p-2 rounded-md bg-muted/30 border border-border/50">
                                                            <label className="text-xs font-semibold">Countdown</label>
                                                            <Switch
                                                                checked={config.hasCountdown}
                                                                onCheckedChange={v => updateConf({ hasCountdown: v })}
                                                                className="data-[state=checked]:bg-primary"
                                                            />
                                                        </div>
                                                        {config.hasCountdown && (
                                                            <Input
                                                                type="datetime-local"
                                                                value={config.countdownDate}
                                                                onChange={e => updateConf({ countdownDate: e.target.value })}
                                                                className="h-7 text-xs"
                                                            />
                                                        )}
                                                    </div>
                                                </div>

                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        </ScrollArea>
                    </TabsContent>

                </div>
            </Tabs>
        </div>
    );
}
