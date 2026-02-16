'use client';

import * as React from 'react';
import { useBriefingStore } from '@/lib/store';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { getUsers, getSettings } from '@/lib/storage';
import { User } from '@/lib/types';
import { useTranslation } from '@/hooks/use-translation';

const REGIONS = ['EMEA', 'AME', 'APAC'];

export function CampaignForm() {
    const { inputs, setInputs } = useBriefingStore();
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

    const toggleRegion = (region: string) => {
        const current = inputs.regions || [];
        const updated = current.includes(region)
            ? current.filter(r => r !== region)
            : [...current, region];
        setInputs({ regions: updated });
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

                        <div className="space-y-3">
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
                            <p className="text-[10px] text-muted-foreground font-medium ml-1">Select at least one region to populate market matrix.</p>
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
        </div >
    );
}
