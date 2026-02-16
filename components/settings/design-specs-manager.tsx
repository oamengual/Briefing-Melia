'use client';

import * as React from 'react';
import { PLACEMENTS as SEED_PLACEMENTS } from '@/lib/constants';
import { getSettings, saveSettings, getPlacements } from '@/lib/storage';
import { DesignSpec, Settings, Placement } from '@/lib/types';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
    Palette, Box, LayoutTemplate, Save, Check, Search,
    MonitorSmartphone, Copy, ArrowRight, Smartphone, Monitor, ChevronDown, ChevronRight
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

export function DesignSpecsManager() {
    const [settings, setSettings] = React.useState<Settings | null>(null);
    const [specs, setSpecs] = React.useState<Record<string, DesignSpec>>({});
    const [selectedPlacementId, setSelectedPlacementId] = React.useState<string | null>(null);
    const [searchQuery, setSearchQuery] = React.useState('');
    const [saving, setSaving] = React.useState(false);
    const [collapsedChannels, setCollapsedChannels] = React.useState<Set<string>>(new Set());
    const [placements, setPlacements] = React.useState<Placement[]>(SEED_PLACEMENTS);

    // Initial Load
    React.useEffect(() => {
        const s = getSettings();
        setSettings(s);
        const specMap: Record<string, DesignSpec> = {};
        if (s.designSpecs) {
            s.designSpecs.forEach(spec => {
                specMap[spec.placementId] = spec;
            });
        }
        setSpecs(specMap);

        // Load Dynamic Placements
        const loadedPlacements = getPlacements();
        setPlacements(loadedPlacements);

        // Select first placement by default if none selected
        if (!selectedPlacementId && loadedPlacements.length > 0) {
            setSelectedPlacementId(loadedPlacements[0].id);
        }
    }, [selectedPlacementId]);

    const selectedPlacement = React.useMemo(() =>
        placements.find(p => p.id === selectedPlacementId),
        [selectedPlacementId, placements]);

    // Default Spec Factory
    const getDefaultSpec = (id: string): DesignSpec => ({
        placementId: id,
        border: { enabled: false, width: 1, color: '#000000', position: 'inside' },
        logo: { enabled: false, width: 100, anchor: 'bottom-right', marginTop: 20, marginBottom: 20, marginLeft: 20, marginRight: 20 }
    });

    const activeSpec = React.useMemo(() => {
        if (!selectedPlacementId) return null;
        return specs[selectedPlacementId] || getDefaultSpec(selectedPlacementId);
    }, [selectedPlacementId, specs]);

    const updateSpec = (updates: Partial<DesignSpec> | any) => {
        if (!selectedPlacementId) return;
        const current = activeSpec!;
        const updated = { ...current, ...updates };
        setSpecs(prev => ({ ...prev, [selectedPlacementId]: updated }));
    };

    const handleSave = async () => {
        if (!settings) return;
        setSaving(true);
        const specsArray = Object.values(specs);
        const newSettings = { ...settings, designSpecs: specsArray };
        await saveSettings(newSettings);
        setSettings(newSettings);
        setSaving(false);
        toast.success("Design specs saved successfully");
    };

    const copyToChannel = () => {
        if (!selectedPlacement || !activeSpec) return;
        const channel = selectedPlacement.channel;
        const channelPlacements = placements.filter(p => p.channel === channel && p.id !== selectedPlacement.id);

        const newSpecs = { ...specs };
        channelPlacements.forEach(p => {
            newSpecs[p.id] = {
                ...activeSpec,
                placementId: p.id
            };
        });

        setSpecs(newSpecs);
        toast.success(`Copied configuration to ${channelPlacements.length} other ${channel} placements.`);
    };

    // Group Placements
    const groupedPlacements = React.useMemo(() => {
        const groups: Record<string, typeof placements> = {};
        const query = searchQuery.toLowerCase();

        placements.forEach(p => {
            if (query && !p.name.toLowerCase().includes(query) && !p.size.includes(query) && !p.channel.toLowerCase().includes(query)) return;
            const channel = p.channel || 'Other';
            if (!groups[channel]) groups[channel] = [];
            groups[channel].push(p);
        });
        return Object.entries(groups).sort((a, b) => a[0].localeCompare(b[0]));
    }, [searchQuery, placements]);

    const toggleChannel = (channel: string) => {
        const newSet = new Set(collapsedChannels);
        if (newSet.has(channel)) {
            newSet.delete(channel);
        } else {
            newSet.add(channel);
        }
        setCollapsedChannels(newSet);
    };

    // --- PREVIEW RENDERER ---
    const renderPreview = () => {
        if (!selectedPlacement || !activeSpec) return null;

        const [w, h] = selectedPlacement.size.split('x').map(Number);
        const aspect = w / h;
        const containerW = 800; // Fixed canvas area
        const containerH = 600;
        const padding = 80;

        // Calculate Scale
        const scaleW = (containerW - padding * 2) / w;
        const scaleH = (containerH - padding * 2) / h;
        const scale = Math.min(scaleW, scaleH, 1.2);

        const borderStyle: React.CSSProperties = activeSpec.border?.enabled ? {
            borderWidth: `${activeSpec.border.width}px`,
            borderColor: activeSpec.border.color,
            borderStyle: 'solid',
            boxSizing: 'border-box'
        } : {};

        // Simplified Logo positioning style
        const getLogoStyle = () => {
            if (!activeSpec.logo?.enabled) return { display: 'none' };
            const { anchor, marginTop, marginBottom, marginLeft, marginRight } = activeSpec.logo;
            const style: any = { position: 'absolute', width: `${activeSpec.logo.width}px` };

            if (anchor.includes('top')) style.top = `${marginTop || 0}px`;
            if (anchor.includes('bottom')) style.bottom = `${marginBottom || 0}px`;
            if (anchor.includes('left')) style.left = `${marginLeft || 0}px`;
            if (anchor.includes('right')) style.right = `${marginRight || 0}px`;

            if (anchor.includes('center-')) {
                style.top = '50%';
                style.transform = 'translateY(-50%)';
            }
            if (anchor === 'center') {
                style.top = '50%'; style.left = '50%'; style.transform = 'translate(-50%, -50%)';
            }
            if (anchor === 'top-center') {
                style.left = '50%'; style.transform = 'translateX(-50%)';
            }
            if (anchor === 'bottom-center') {
                style.left = '50%'; style.transform = 'translateX(-50%)';
            }

            return style;
        };

        return (
            <div className="flex-1 flex flex-col h-full bg-muted/10 relative overflow-hidden">
                {/* Canvas Background */}
                <div
                    className="absolute inset-0 pointer-events-none opacity-20"
                    style={{
                        backgroundImage: 'radial-gradient(circle, #000 1px, transparent 1px)',
                        backgroundSize: '20px 20px'
                    }}
                />

                {/* Viewport Info */}
                <div className="absolute top-4 left-4 z-10 flex gap-2">
                    <Badge variant="outline" className="bg-background/80 backdrop-blur font-mono text-xs">
                        {w} x {h} px
                    </Badge>
                    <Badge variant="outline" className="bg-background/80 backdrop-blur text-xs">
                        {(scale * 100).toFixed(0)}% Scale
                    </Badge>
                </div>

                <div className="flex-1 flex items-center justify-center p-8 overflow-auto">
                    <div
                        style={{
                            width: w, height: h,
                            transform: `scale(${scale})`,
                            boxShadow: '0 50px 100px -20px rgba(0,0,0,0.15), 0 30px 60px -30px rgba(0,0,0,0.2)'
                        }}
                        className="bg-white relative transition-all duration-300 origin-center"
                    >
                        {/* Content Placeholder */}
                        <div className={cn("absolute inset-0 flex items-center justify-center text-muted-foreground/10 font-black text-6xl uppercase tracking-tighter select-none pointer-events-none", aspect > 1 ? "flex-row" : "flex-col text-center")}>
                            <span>Ad Creative</span>
                        </div>

                        {/* BORDER RENDER */}
                        <div className="absolute inset-0 pointer-events-none z-20" style={borderStyle} />

                        {/* LOGO RENDER */}
                        {activeSpec.logo?.enabled && (
                            <div
                                style={getLogoStyle()}
                                className="z-30 bg-primary/5 border-2 border-primary border-dashed flex items-center justify-center relative group cursor-help"
                                title="Logo Placement Area"
                            >
                                <div style={{ paddingBottom: '30%' }} /> {/* Aspect Ratio Hack */}
                                <span className="absolute text-[10px] font-bold text-primary font-mono">LOGO</span>

                                {/* Padding indicators (visual only) */}
                                <div className="absolute -top-4 left-1/2 -translate-x-1/2 text-[8px] font-mono text-muted-foreground opacity-0 group-hover:opacity-100">{activeSpec.logo.marginTop}</div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="h-[calc(100vh-140px)] flex border rounded-xl bg-background shadow-sm overflow-hidden text-sm">

            {/* 1. PLACEMENT LIST (LEFT) */}
            <div className="w-[280px] flex flex-col border-r bg-muted/5 z-20">
                <div className="p-4 border-b space-y-4">
                    <div className="flex items-center justify-between">
                        <h2 className="font-bold text-base">Placements</h2>
                        <Badge variant="secondary" className="font-mono text-[10px]">{placements.length}</Badge>
                    </div>
                    <div className="relative">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search..."
                            className="pl-9 h-9 text-xs bg-background"
                            value={searchQuery}
                            onChange={e => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>
                <ScrollArea className="flex-1">
                    <div className="p-3 space-y-6">
                        {groupedPlacements.map(([channel, items]) => {
                            const isCollapsed = collapsedChannels.has(channel);
                            return (
                                <div key={channel}>
                                    <button
                                        onClick={() => toggleChannel(channel)}
                                        className="w-full flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-muted-foreground/60 px-2 mb-2 hover:text-foreground transition-colors group/header"
                                    >
                                        <div className="flex items-center gap-2">
                                            {channel === 'Instagram' || channel === 'Facebook' ? <Smartphone className="w-3 h-3" /> : <Monitor className="w-3 h-3" />}
                                            {channel}
                                        </div>
                                        {isCollapsed ? <ChevronRight className="w-3 h-3 opacity-50 group-hover/header:opacity-100" /> : <ChevronDown className="w-3 h-3 opacity-50 group-hover/header:opacity-100" />}
                                    </button>

                                    {!isCollapsed && (
                                        <div className="space-y-0.5 animate-in slide-in-from-top-1 duration-200">
                                            {items.map(p => {
                                                const hasSpec = !!specs[p.id];
                                                return (
                                                    <button
                                                        key={p.id}
                                                        onClick={() => setSelectedPlacementId(p.id)}
                                                        className={cn(
                                                            "w-full text-left px-3 py-2.5 rounded-md text-xs transition-all flex items-center gap-3 group relative border border-transparent",
                                                            selectedPlacementId === p.id
                                                                ? "bg-primary/5 text-primary border-primary/20 font-medium"
                                                                : "hover:bg-muted/50 text-muted-foreground hover:text-foreground"
                                                        )}
                                                    >
                                                        <div className={cn("w-1.5 h-1.5 rounded-full", hasSpec ? "bg-primary" : "bg-muted-foreground/20")} />
                                                        <div className="flex-1 min-w-0">
                                                            <div className="truncate">{p.name}</div>
                                                            <div className="opacity-70 font-mono text-[10px]">{p.size}</div>
                                                        </div>
                                                        {selectedPlacementId === p.id && <ArrowRight className="w-3 h-3 opacity-50 animate-in slide-in-from-left-1" />}
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </ScrollArea>
                <div className="p-4 border-t bg-background">
                    <Button className="w-full font-bold" onClick={handleSave} disabled={saving}>
                        {saving ? <span className="animate-spin mr-2">⏳</span> : <Save className="w-4 h-4 mr-2" />}
                        Save Changes
                    </Button>
                </div>
            </div>

            {/* 2. MAIN PREVIEW (CENTER) */}
            {selectedPlacement && activeSpec ? (
                <>
                    {renderPreview()}

                    {/* 3. SETTINGS PANEL (RIGHT) */}
                    <div className="w-[320px] border-l bg-background flex flex-col z-20 shadow-[-10px_0_30px_-15px_rgba(0,0,0,0.05)]">
                        <div className="h-14 border-b flex items-center px-6 justify-between shrink-0">
                            <span className="font-bold flex items-center gap-2">
                                <MonitorSmartphone className="w-4 h-4 text-primary" />
                                Configuration
                            </span>
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground" title="Copy to all in group" onClick={copyToChannel}>
                                <Copy className="w-4 h-4" />
                            </Button>
                        </div>

                        <ScrollArea className="flex-1">
                            <div className="p-6 space-y-8">

                                {/* BORDER SETTINGS */}
                                <section className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <div className="p-1.5 rounded bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400">
                                                <Box className="w-4 h-4" />
                                            </div>
                                            <div>
                                                <Label className="font-bold block">Frame</Label>
                                                <p className="text-[10px] text-muted-foreground">Outer border</p>
                                            </div>
                                        </div>
                                        <Switch
                                            checked={activeSpec.border?.enabled}
                                            onCheckedChange={(v) => updateSpec({ border: { ...activeSpec.border, enabled: v } })}
                                        />
                                    </div>

                                    {activeSpec.border?.enabled && (
                                        <div className="space-y-4 pt-2 pl-2 border-l-2 ml-4 animate-in slide-in-from-top-2">
                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="space-y-1.5">
                                                    <Label className="text-[10px] uppercase font-bold text-muted-foreground">Width (px)</Label>
                                                    <Input
                                                        type="number"
                                                        value={activeSpec.border.width}
                                                        onChange={(e) => updateSpec({ border: { ...activeSpec.border, width: parseInt(e.target.value) || 0 } })}
                                                        className="h-8 font-mono text-center"
                                                    />
                                                </div>
                                                <div className="space-y-1.5">
                                                    <Label className="text-[10px] uppercase font-bold text-muted-foreground">Color</Label>
                                                    <div className="flex gap-2">
                                                        <div className="h-8 w-8 rounded border overflow-hidden shrink-0">
                                                            <input
                                                                type="color"
                                                                className="h-[150%] w-[150%] -translate-x-1/4 -translate-y-1/4 cursor-pointer p-0"
                                                                value={activeSpec.border.color}
                                                                onChange={(e) => updateSpec({ border: { ...activeSpec.border, color: e.target.value } })}
                                                            />
                                                        </div>
                                                        <Input
                                                            value={activeSpec.border.color}
                                                            onChange={(e) => updateSpec({ border: { ...activeSpec.border, color: e.target.value } })}
                                                            className="h-8 font-mono text-xs uppercase"
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </section>

                                <Separator />

                                {/* LOGO SETTINGS */}
                                <section className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <div className="p-1.5 rounded bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
                                                <LayoutTemplate className="w-4 h-4" />
                                            </div>
                                            <div>
                                                <Label className="font-bold block">Logo</Label>
                                                <p className="text-[10px] text-muted-foreground">Position & size</p>
                                            </div>
                                        </div>
                                        <Switch
                                            checked={activeSpec.logo?.enabled}
                                            onCheckedChange={(v) => updateSpec({ logo: { ...activeSpec.logo, enabled: v } })}
                                        />
                                    </div>

                                    {activeSpec.logo?.enabled && (
                                        <div className="space-y-4 pt-2 pl-2 border-l-2 ml-4 animate-in slide-in-from-top-2">
                                            <div className="space-y-2">
                                                <Label className="text-[10px] uppercase font-bold text-muted-foreground">Width (px)</Label>
                                                <Input
                                                    type="number"
                                                    value={activeSpec.logo.width}
                                                    onChange={(e) => updateSpec({ logo: { ...activeSpec.logo, width: parseInt(e.target.value) || 0 } })}
                                                    className="font-mono"
                                                />
                                            </div>

                                            <div className="space-y-2">
                                                <Label className="text-[10px] uppercase font-bold text-muted-foreground">Anchor Position</Label>
                                                <div className="grid grid-cols-3 gap-1.5 bg-muted/40 p-2 rounded-lg border w-fit mx-auto">
                                                    {['top-left', 'top-center', 'top-right', 'center-left', 'center', 'center-right', 'bottom-left', 'bottom-center', 'bottom-right'].map(pos => {
                                                        const isActive = activeSpec.logo?.anchor === pos;
                                                        // if (pos.includes('center-') && pos !== 'center') return <div key={pos} className="w-8 h-8" />; // spacers if needed, or implement expanded logic

                                                        // Simplified 3x3 for commonly used anchors
                                                        // Mapping 'center-left' etc is not in our types yet, defaulting to standard 9 points visually but simplified types 
                                                        // Our type only supports specific anchors. Let's strict to Type definition: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'top-center' | 'bottom-center' | 'center'

                                                        // Filter out unsupported - NOW SUPPORTED
                                                        // if (['center-left', 'center-right'].includes(pos)) return <div key={pos} className="w-8 h-8" />;

                                                        return (
                                                            <button
                                                                key={pos}
                                                                onClick={() => updateSpec({ logo: { ...activeSpec.logo, anchor: pos } })}
                                                                className={cn(
                                                                    "w-8 h-8 rounded border flex items-center justify-center transition-all",
                                                                    isActive
                                                                        ? "bg-primary border-primary text-primary-foreground shadow-sm"
                                                                        : "bg-background border-border hover:border-primary/50 text-muted-foreground"
                                                                )}
                                                                title={pos}
                                                            >
                                                                <div className={cn("w-2 h-2 rounded-full bg-current")} />
                                                            </button>
                                                        )
                                                    })}
                                                </div>
                                            </div>

                                            <div className="space-y-2">
                                                <Label className="text-[10px] uppercase font-bold text-muted-foreground">Margins (px)</Label>
                                                <div className="grid grid-cols-2 gap-3">
                                                    <div className="space-y-1">
                                                        <span className="text-[10px] text-muted-foreground">Top</span>
                                                        <Input
                                                            type="number" value={activeSpec.logo.marginTop}
                                                            onChange={(e) => updateSpec({ logo: { ...activeSpec.logo, marginTop: parseInt(e.target.value) } })}
                                                        />
                                                    </div>
                                                    <div className="space-y-1">
                                                        <span className="text-[10px] text-muted-foreground">Right</span>
                                                        <Input
                                                            type="number" value={activeSpec.logo.marginRight}
                                                            onChange={(e) => updateSpec({ logo: { ...activeSpec.logo, marginRight: parseInt(e.target.value) } })}
                                                        />
                                                    </div>
                                                    <div className="space-y-1">
                                                        <span className="text-[10px] text-muted-foreground">Bottom</span>
                                                        <Input
                                                            type="number" value={activeSpec.logo.marginBottom}
                                                            onChange={(e) => updateSpec({ logo: { ...activeSpec.logo, marginBottom: parseInt(e.target.value) } })}
                                                        />
                                                    </div>
                                                    <div className="space-y-1">
                                                        <span className="text-[10px] text-muted-foreground">Left</span>
                                                        <Input
                                                            type="number" value={activeSpec.logo.marginLeft}
                                                            onChange={(e) => updateSpec({ logo: { ...activeSpec.logo, marginLeft: parseInt(e.target.value) } })}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </section>
                            </div>
                        </ScrollArea>
                    </div>
                </>
            ) : (
                <div className="flex-1 flex flex-col items-center justify-center text-muted-foreground bg-muted/5">
                    <LayoutTemplate className="w-16 h-16 mb-4 opacity-10" />
                    <h3 className="text-lg font-bold text-foreground">No Placement Selected</h3>
                    <p className="text-sm">Select a placement from the list to configure design rules.</p>
                </div>
            )}
        </div>
    );
}
