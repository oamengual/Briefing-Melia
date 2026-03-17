'use client';

import * as React from 'react';
import { useBriefingStore } from '@/lib/store';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { getUsers, getSettings } from '@/lib/storage';
import { User, Placement } from '@/lib/types';
import { useTranslation } from '@/hooks/use-translation';
import { MARKETS, PLACEMENTS } from '@/lib/constants';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { FileText, Calendar, Target, Layers, Globe, CheckCircle2, AlertCircle, Monitor, Video, ImageIcon, BarChart3, PieChart, Users, Upload, X } from 'lucide-react';

const REGIONS = Array.from(new Set(MARKETS.map(m => m.region))).sort();

export function CampaignForm() {
    const { inputs, setInputs, matrix } = useBriefingStore();
    const [users, setUsers] = React.useState<User[]>([]);
    const [brands, setBrands] = React.useState<string[]>([]);
    const { t } = useTranslation();

    React.useEffect(() => {
        setUsers(getUsers());
        const settings = getSettings();
        setBrands(settings.defaultBrands || []);
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInputs({ [e.target.name]: e.target.value });
    };

    const handleSelectChange = (name: string, value: string) => {
        setInputs({ [name]: value });
    };

    const handleSwitchChange = (name: string, value: boolean) => {
        setInputs({ [name]: value });
    };

    const toggleRegion = (region: string) => {
        const current = inputs.regions || [];
        const isRemoving = current.includes(region);
        const updated = isRemoving
            ? current.filter(r => r !== region)
            : [...current, region];

        // If removing a region, also remove its associated markets
        let updatedMarkets = inputs.selectedMarkets || [];
        if (isRemoving) {
            const marketsInRegion = MARKETS.filter(m => m.region === region).map(m => m.selector);
            updatedMarkets = updatedMarkets.filter(m => !marketsInRegion.includes(m));
        }

        setInputs({ regions: updated, selectedMarkets: updatedMarkets });
    };

    const toggleMarket = (marketSelector: string) => {
        const current = inputs.selectedMarkets || [];
        const updated = current.includes(marketSelector)
            ? current.filter(m => m !== marketSelector)
            : [...current, marketSelector];
        setInputs({ selectedMarkets: updated });
    };

    const handleFileDrop = (e: React.DragEvent) => {
        e.preventDefault();
        const files = Array.from(e.dataTransfer.files);
        const imageFiles = files.filter(f => f.type.startsWith('image/'));
        
        imageFiles.forEach(file => {
            const reader = new FileReader();
            reader.onload = (event) => {
                const base64 = event.target?.result as string;
                const currentImages = inputs.visualReferenceImages || [];
                if (!currentImages.includes(base64)) {
                    setInputs({ visualReferenceImages: [...currentImages, base64] });
                }
            };
            reader.readAsDataURL(file);
        });
    };

    const removeImage = (index: number) => {
        const current = inputs.visualReferenceImages || [];
        const updated = current.filter((_, i) => i !== index);
        setInputs({ visualReferenceImages: updated });
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 text-foreground">
            {/* Column 1: Core Info */}
            <div className="space-y-6">
                <Card className="shadow-card border border-border radius-card overflow-hidden bg-card">
                    <CardHeader className="p-6 pb-0">
                        <CardTitle className="text-lg font-bold text-foreground">
                            {t.campaign.general}
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-6 space-y-6">
                        <div className="space-y-2">
                            <Label className="text-xs font-semibold text-foreground ml-1">{t.campaign.name} <span className="text-destructive">*</span></Label>
                            <Input
                                name="campaignName"
                                value={inputs.campaignName || ''}
                                onChange={handleChange}
                                className="h-9 text-sm radius-input border-input focus:ring-primary font-medium"
                                placeholder="e.g. Winter Sale 2025"
                            />
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <Label className="text-xs font-semibold text-foreground ml-1">{t.campaign.brand}</Label>
                                <Input
                                    name="brand"
                                    value={inputs.brand || ''}
                                    onChange={handleChange}
                                    placeholder="Brand Name"
                                    list="brand-list"
                                    className="h-9 radius-input border-input focus:ring-primary font-medium"
                                />
                                <datalist id="brand-list">
                                    {brands.map((b) => (
                                        <option key={b} value={b} />
                                    ))}
                                </datalist>
                            </div>
                            <div className="space-y-2">
                                <Label className="text-xs font-semibold text-foreground ml-1">{t.campaign.agency}</Label>
                                <Input
                                    name="agency"
                                    value={inputs.agency || ''}
                                    onChange={handleChange}
                                    placeholder="Agency Name"
                                    className="h-9 radius-input border-input focus:ring-primary font-medium"
                                />
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <Label className="text-xs font-semibold text-foreground ml-1">Start Date</Label>
                                <Input
                                    type="date"
                                    name="startDate"
                                    value={inputs.startDate || ''}
                                    onChange={handleChange}
                                    className="h-9 radius-input border-input focus:ring-primary font-medium"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-xs font-semibold text-foreground ml-1">End Date</Label>
                                <Input
                                    type="date"
                                    name="endDate"
                                    value={inputs.endDate || ''}
                                    onChange={handleChange}
                                    className="h-9 radius-input border-input focus:ring-primary font-medium"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <Label className="text-xs font-semibold text-foreground ml-1">Delivery Date <span className="text-destructive">*</span></Label>
                                <Input
                                    type="date"
                                    name="deliveryDate"
                                    value={inputs.deliveryDate || ''}
                                    onChange={handleChange}
                                    className="h-9 radius-input border-input focus:ring-primary font-medium"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-xs font-semibold text-foreground ml-1">Classification</Label>
                                <Select value={inputs.classification} onValueChange={(v) => handleSelectChange('classification', v)}>
                                    <SelectTrigger className="h-9 radius-input border-input font-medium bg-background focus:ring-primary">
                                        <SelectValue placeholder="Select Type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="vac">Vacacional (VAC)</SelectItem>
                                        <SelectItem value="plaza">Plaza/Urbano</SelectItem>
                                        <SelectItem value="mixta">Mixta</SelectItem>
                                        <SelectItem value="paquetes">Paquetes</SelectItem>
                                        <SelectItem value="otros">Otros</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label className="text-xs font-semibold text-foreground ml-1">Regions</Label>
                                <div className="flex gap-3">
                                    {REGIONS.map(r => (
                                        <button
                                            key={r}
                                            onClick={() => toggleRegion(r)}
                                            className={cn(
                                                "flex-1 h-9 text-xs font-semibold border transition-all radius-btn shadow-sm hover:shadow-md active:scale-95",
                                                (inputs.regions || []).includes(r)
                                                    ? "bg-foreground text-background border-transparent"
                                                    : "bg-background text-foreground border-border hover:border-foreground"
                                            )}
                                        >
                                            {r}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {inputs.regions && inputs.regions.length > 0 && (
                                <div className="space-y-3 pt-2 border-t border-border/50">
                                    <Label className="text-xs font-semibold text-foreground ml-1">Included Countries (by Region)</Label>
                                    <div className="grid grid-cols-1 gap-4 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                                        {inputs.regions.map(region => (
                                            <div key={region} className="space-y-2">
                                                <div className="flex items-center justify-between">
                                                    <span className="text-[10px] uppercase tracking-wider font-bold text-muted-foreground">{region}</span>
                                                    <button 
                                                        onClick={() => {
                                                            const marketsInRegion = MARKETS.filter(m => m.region === region).map(m => m.selector);
                                                            const current = inputs.selectedMarkets || [];
                                                            const allSelected = marketsInRegion.every(m => current.includes(m));
                                                            let updated;
                                                            if (allSelected) {
                                                                updated = current.filter(m => !marketsInRegion.includes(m));
                                                            } else {
                                                                updated = Array.from(new Set([...current, ...marketsInRegion]));
                                                            }
                                                            setInputs({ selectedMarkets: updated });
                                                        }}
                                                        className="text-[10px] text-primary hover:underline"
                                                    >
                                                        Toggle All
                                                    </button>
                                                </div>
                                                <div className="flex flex-wrap gap-2">
                                                    {MARKETS.filter(m => m.region === region).map(m => (
                                                        <button
                                                            key={m.selector}
                                                            onClick={() => toggleMarket(m.selector)}
                                                            className={cn(
                                                                "px-2 py-1 text-[11px] font-medium border radius-btn transition-colors",
                                                                (inputs.selectedMarkets || []).includes(m.selector)
                                                                    ? "bg-primary/10 border-primary text-primary"
                                                                    : "bg-background border-border text-foreground hover:border-muted-foreground"
                                                            )}
                                                        >
                                                            {m.code} - {m.name}
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                            <p className="text-[10px] text-muted-foreground font-medium ml-1">Select regions and specific countries to filter the market matrix.</p>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Column 2: Strategy & Digital */}
            <div className="space-y-6">
                <Card className="shadow-card border border-border radius-card overflow-hidden bg-card">
                    <CardHeader className="p-6 pb-0">
                        <CardTitle className="text-lg font-bold text-foreground">
                            Strategy
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-6 space-y-6">
                        <div className="space-y-2">
                            <Label className="text-xs font-semibold text-foreground ml-1">Marketing Objective</Label>
                            <Select value={inputs.marketingObjective} onValueChange={(v) => handleSelectChange('marketingObjective', v)}>
                                <SelectTrigger className="h-9 radius-input border-input font-medium bg-background focus:ring-primary">
                                    <SelectValue placeholder="Select Goal" />
                                </SelectTrigger>
                                <SelectContent className="radius-card border-border shadow-card">
                                    <SelectItem value="awareness" className="rounded-sm focus:bg-muted focus:font-medium">Brand Awareness</SelectItem>
                                    <SelectItem value="consideration" className="rounded-sm focus:bg-muted focus:font-medium">Consideration / Traffic</SelectItem>
                                    <SelectItem value="conversion" className="rounded-sm focus:bg-muted focus:font-medium">Conversion / Sales</SelectItem>
                                    <SelectItem value="retention" className="rounded-sm focus:bg-muted focus:font-medium">Retention</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label className="text-xs font-semibold text-foreground ml-1">Key Performance Indicator (KPI)</Label>
                            <Input
                                name="kpi"
                                value={inputs.kpi || ''}
                                onChange={handleChange}
                                placeholder="e.g. ROAS > 4.0, CPR < $2"
                                className="h-9 radius-input border-input focus:ring-primary font-medium"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label className="text-xs font-semibold text-foreground ml-1">Project Strategy</Label>
                            <Input
                                name="strategy"
                                value={inputs.strategy || ''}
                                onChange={handleChange}
                                placeholder="Global Strategy Name"
                                className="h-9 radius-input border-input focus:ring-primary font-medium"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label className="text-xs font-semibold text-foreground ml-1">Target Audience</Label>
                            <Input
                                name="target"
                                value={inputs.target || ''}
                                onChange={handleChange}
                                placeholder="Who is this campaign for?"
                                className="h-9 radius-input border-input focus:ring-primary font-medium"
                            />
                        </div>
                        <div className="flex items-center justify-between p-3 radius-card border border-border/50 bg-muted/20">
                            <div className="space-y-0.5">
                                <Label className="text-xs font-semibold">Local Adaptations</Label>
                                <p className="text-[10px] text-muted-foreground">Are specific local versions required?</p>
                            </div>
                            <Switch 
                                checked={!!inputs.hasLocalAdaptations}
                                onCheckedChange={(v) => handleSwitchChange('hasLocalAdaptations', v)}
                            />
                        </div>
                        <div className="flex items-center justify-between p-3 radius-card border border-amber-200 bg-amber-50/50">
                            <div className="space-y-0.5">
                                <Label className="text-xs font-semibold text-amber-900">Newsletter Últimas Horas</Label>
                                <p className="text-[10px] text-amber-800/70">¿Se requiere programación específica de last minute?</p>
                            </div>
                            <Switch 
                                checked={!!inputs.hasNewsletterLastMinute}
                                onCheckedChange={(v) => handleSwitchChange('hasNewsletterLastMinute', v)}
                            />
                        </div>
                    </CardContent>
                </Card>

                <Card className="shadow-card border border-border radius-card overflow-hidden bg-card">
                    <CardHeader className="p-6 pb-0">
                        <CardTitle className="text-lg font-bold text-foreground flex items-center gap-2">
                            <FileText className="w-5 h-5 text-primary" /> Visual References
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-6 space-y-4">
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label className="text-xs font-semibold text-foreground ml-1">Links or Descriptions</Label>
                                <Textarea 
                                    name="visualReferences"
                                    value={inputs.visualReferences || ''}
                                    onChange={(e) => setInputs({ visualReferences: e.target.value })}
                                    placeholder="Add URLs to moodboards, previous campaigns, or visual guidelines..."
                                    className="min-h-[80px] text-sm radius-input border-input focus:ring-primary shadow-sm"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label className="text-xs font-semibold text-foreground ml-1">Reference Images</Label>
                                <div 
                                    onDragOver={(e) => e.preventDefault()}
                                    onDrop={handleFileDrop}
                                    className="border-2 border-dashed border-border/60 radius-card p-6 flex flex-col items-center justify-center gap-2 bg-muted/5 hover:bg-muted/10 hover:border-primary/40 transition-all cursor-pointer group"
                                    onClick={() => {
                                        const input = document.createElement('input');
                                        input.type = 'file';
                                        input.multiple = true;
                                        input.accept = 'image/*';
                                        input.onchange = (e: any) => {
                                            const files = Array.from(e.target.files as FileList);
                                            files.forEach(file => {
                                                const reader = new FileReader();
                                                reader.onload = (event) => {
                                                    const base64 = event.target?.result as string;
                                                    const currentImages = inputs.visualReferenceImages || [];
                                                    if (!currentImages.includes(base64)) {
                                                        setInputs({ visualReferenceImages: [...currentImages, base64] });
                                                    }
                                                };
                                                reader.readAsDataURL(file);
                                            });
                                        };
                                        input.click();
                                    }}
                                >
                                    <div className="p-3 radius-full bg-primary/10 text-primary group-hover:scale-110 transition-transform">
                                        <Upload className="w-5 h-5" />
                                    </div>
                                    <div className="text-center">
                                        <p className="text-xs font-bold text-foreground">Click or drag images to upload</p>
                                        <p className="text-[10px] text-muted-foreground">PNG, JPG or WebP up to 5MB</p>
                                    </div>
                                </div>

                                {inputs.visualReferenceImages && inputs.visualReferenceImages.length > 0 && (
                                    <div className="grid grid-cols-3 gap-2 pt-2">
                                        {inputs.visualReferenceImages.map((img, idx) => (
                                            <div key={idx} className="relative aspect-square radius-sm overflow-hidden border border-border group shadow-sm">
                                                <img src={img} alt={`Reference ${idx}`} className="w-full h-full object-cover" />
                                                <button 
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        removeImage(idx);
                                                    }}
                                                    className="absolute top-1 right-1 p-1 radius-full bg-destructive text-destructive-foreground opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                                                >
                                                    <X className="w-3 h-3" />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="shadow-card border border-border radius-card overflow-hidden bg-card">
                    <CardHeader className="p-6 pb-0">
                        <CardTitle className="text-lg font-bold text-foreground">
                            Digital Assets
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-6 space-y-6">
                        <div className="space-y-2">
                            <Label className="text-xs font-semibold text-foreground ml-1">Landing Page URL</Label>
                            <Input
                                name="landingPageUrl"
                                value={inputs.landingPageUrl || ''}
                                onChange={handleChange}
                                className="h-9 radius-input border-input font-mono text-primary bg-muted/50 focus:bg-background focus:ring-primary transition-colors text-sm"
                                placeholder="https://..."
                            />
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Summary Section - Full Width */}
            <div className="lg:col-span-2 pt-6">
                <Card className="shadow-card border border-primary/20 radius-card overflow-hidden bg-white">
                    <CardHeader className="p-6 border-b border-border/50 bg-muted/10">
                        <div className="flex items-center justify-between">
                            <div className="space-y-1">
                                <CardTitle className="text-xl font-bold text-foreground flex items-center gap-2">
                                    <CheckCircle2 className="w-6 h-6 text-green-600" /> Requested Pieces Summary
                                </CardTitle>
                                <CardDescription>A complete overview of the selected placements by market.</CardDescription>
                            </div>
                            <div className="flex items-center gap-2">
                                <Badge variant="outline" className="font-bold bg-primary/5 text-primary border-primary/20">
                                    {Object.entries(matrix)
                                        .filter(([selector]) => !inputs.selectedMarkets || inputs.selectedMarkets.length === 0 || inputs.selectedMarkets.includes(selector))
                                        .flatMap(([_, ids]) => ids).length} Total Assets
                                </Badge>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="p-6 space-y-8">
                        {(() => {
                            // Filter matrix by selected markets
                            const filteredEntries = Object.entries(matrix).filter(([selector, ids]) => {
                                const isSelected = !inputs.selectedMarkets || inputs.selectedMarkets.length === 0 || inputs.selectedMarkets.includes(selector);
                                return isSelected && ids.length > 0;
                            });

                            if (filteredEntries.length === 0) {
                                return (
                                    <div className="p-12 text-center space-y-3">
                                        <AlertCircle className="w-12 h-12 text-muted-foreground/30 mx-auto" />
                                        <p className="text-muted-foreground font-medium">No assets selected yet. Use the Market Matrix to add pieces.</p>
                                    </div>
                                );
                            }

                            const allSelectedIds = filteredEntries.flatMap(([_, ids]) => ids);
                            const totalAssets = allSelectedIds.length;
                            const uniquePlacements = new Set(allSelectedIds).size;
                            const activeMarketsCount = filteredEntries.length;
                            
                            const channelDistribution = allSelectedIds.reduce((acc, id) => {
                                const p = PLACEMENTS.find(pl => pl.id === id);
                                if (p) acc[p.channel] = (acc[p.channel] || 0) + 1;
                                return acc;
                            }, {} as Record<string, number>);

                            const formatDistribution = allSelectedIds.reduce((acc, id) => {
                                const p = PLACEMENTS.find(pl => pl.id === id);
                                if (p) acc[p.format] = (acc[p.format] || 0) + 1;
                                return acc;
                            }, {} as Record<string, number>);

                            return (
                                <>
                                    {/* Stats Grid */}
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                        <div className="p-4 radius-card bg-primary/5 border border-primary/10 space-y-1">
                                            <p className="text-[10px] font-bold uppercase tracking-wider text-primary/70">Total Assets</p>
                                            <p className="text-2xl font-black text-primary">{totalAssets}</p>
                                        </div>
                                        <div className="p-4 radius-card bg-green-50 border border-green-100 space-y-1">
                                            <p className="text-[10px] font-bold uppercase tracking-wider text-green-700/70">Active Markets</p>
                                            <p className="text-2xl font-black text-green-700">{activeMarketsCount}</p>
                                        </div>
                                        <div className="p-4 radius-card bg-amber-50 border border-amber-100 space-y-1">
                                            <p className="text-[10px] font-bold uppercase tracking-wider text-amber-700/70">Unique Placements</p>
                                            <p className="text-2xl font-black text-amber-700">{uniquePlacements}</p>
                                        </div>
                                        <div className="p-4 radius-card bg-blue-50 border border-blue-100 space-y-1">
                                            <p className="text-[10px] font-bold uppercase tracking-wider text-blue-700/70">Videos (Total)</p>
                                            <p className="text-2xl font-black text-blue-700">{formatDistribution['vid'] || 0}</p>
                                        </div>
                                    </div>

                                    {/* Visual Distribution */}
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between">
                                            <h4 className="text-xs font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                                                <BarChart3 className="w-4 h-4" /> Channel Distribution
                                            </h4>
                                        </div>
                                        <div className="h-3 w-full flex radius-full overflow-hidden bg-muted/30 border border-border/50">
                                            {Object.entries(channelDistribution).map(([channel, count], idx) => {
                                                const colors = [
                                                    'bg-blue-500', 'bg-purple-500', 'bg-pink-500', 
                                                    'bg-amber-500', 'bg-emerald-500', 'bg-indigo-500',
                                                    'bg-rose-500', 'bg-orange-500'
                                                ];
                                                const percentage = (count / totalAssets) * 100;
                                                return (
                                                    <div 
                                                        key={channel} 
                                                        style={{ width: `${percentage}%` }}
                                                        className={cn(colors[idx % colors.length], "h-full transition-all hover:brightness-110 cursor-help")}
                                                        title={`${channel}: ${count} assets (${percentage.toFixed(1)}%)`}
                                                    />
                                                );
                                            })}
                                        </div>
                                        <div className="flex flex-wrap gap-x-4 gap-y-2">
                                            {Object.entries(channelDistribution).map(([channel, count], idx) => {
                                                const colors = [
                                                    'text-blue-500', 'text-purple-500', 'text-pink-500', 
                                                    'text-amber-500', 'text-emerald-500', 'text-indigo-500',
                                                    'text-rose-500', 'text-orange-500'
                                                ];
                                                return (
                                                    <div key={channel} className="flex items-center gap-1.5">
                                                        <div className={cn("w-2 h-2 rounded-full", colors[idx % colors.length].replace('text-', 'bg-'))} />
                                                        <span className="text-[10px] font-bold text-muted-foreground whitespace-nowrap">
                                                            {channel} <span className="text-foreground">({count})</span>
                                                        </span>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>

                                    <Separator className="bg-border/50" />

                                    {/* Markets Groups */}
                                    <div className="space-y-4">
                                        <h4 className="text-xs font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                                            <Globe className="w-4 h-4" /> Market Breakdown
                                        </h4>
                                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                                            {filteredEntries
                                                .sort((a, b) => b[1].length - a[1].length)
                                                .map(([marketSelector, ids]) => {
                                                    const market = MARKETS.find(m => m.selector === marketSelector);
                                                    return (
                                                        <div key={marketSelector} className="radius-card border border-border/60 bg-white shadow-sm overflow-hidden flex flex-col">
                                                            <div className="px-4 py-3 bg-muted/20 border-b border-border/40 flex items-center justify-between">
                                                                <div className="flex items-center gap-2">
                                                                    <div className="w-6 h-6 radius-full bg-foreground text-background flex items-center justify-center text-[10px] font-black">
                                                                        {market?.code || marketSelector.split(' ')[0]}
                                                                    </div>
                                                                    <span className="text-sm font-bold text-foreground truncate max-w-[150px]">
                                                                        {market?.name || marketSelector}
                                                                    </span>
                                                                </div>
                                                                <Badge variant="secondary" className="text-[10px] font-black">{ids.length}</Badge>
                                                            </div>
                                                            <div className="p-3 space-y-2 flex-1 max-h-[250px] overflow-y-auto custom-scrollbar">
                                                                {ids.map(pid => {
                                                                    const p = PLACEMENTS.find(item => item.id === pid);
                                                                    if (!p) return null;
                                                                    return (
                                                                        <div key={pid} className="flex items-start justify-between gap-2 p-2 radius-sm bg-muted/10 border border-transparent hover:border-border transition-colors">
                                                                            <div className="space-y-0.5 min-w-0">
                                                                                <p className="text-[11px] font-bold text-foreground truncate leading-tight">{p.name}</p>
                                                                                <div className="flex items-center gap-1.5">
                                                                                    <Badge variant="outline" className="text-[8px] font-bold px-1 h-3.5 bg-white">{p.channel}</Badge>
                                                                                    <span className="text-[9px] text-muted-foreground font-medium">{p.width}x{p.height}</span>
                                                                                </div>
                                                                            </div>
                                                                            <div className="flex items-center self-center">
                                                                                {p.format === 'vid' ? (
                                                                                    <Video className="w-3.5 h-3.5 text-amber-500" />
                                                                                ) : (
                                                                                    <ImageIcon className="w-3.5 h-3.5 text-blue-500" />
                                                                                )}
                                                                            </div>
                                                                        </div>
                                                                    );
                                                                })}
                                                            </div>
                                                        </div>
                                                    );
                                                })}
                                        </div>
                                    </div>
                                </>
                            );
                        })()}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
