'use client';

import * as React from 'react';
import { Settings, Placement, ChannelConfig, Format, Channel } from '@/lib/types';
import { getSettings, saveSettings, getPlacements } from '@/lib/storage';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';
import {
    Plus, Trash2, Save, MonitorSmartphone, Smartphone, Monitor,
    Image as ImageIcon, Film, FileCode, Check, ChevronRight, Settings2
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { PLACEMENTS as SEED_PLACEMENTS } from '@/lib/constants';

export function PlacementManager() {
    const [settings, setSettings] = React.useState<Settings | null>(null);
    const [placements, setPlacements] = React.useState<Placement[]>([]);
    const [channels, setChannels] = React.useState<string[]>([]);
    const [selectedChannel, setSelectedChannel] = React.useState<string | null>(null);
    const [channelConfigs, setChannelConfigs] = React.useState<ChannelConfig[]>([]);

    // Edit State
    const [activePlacement, setActivePlacement] = React.useState<Placement | null>(null);
    const [saving, setSaving] = React.useState(false);

    React.useEffect(() => {
        const s = getSettings();
        setSettings(s);

        // Initialize dynamic placements if they don't exist in settings yet
        const currentPlacements = getPlacements();
        setPlacements(currentPlacements);

        // Extract unique channels
        const uniqueChannels = Array.from(new Set(currentPlacements.map(p => p.channel as string))).sort();
        setChannels(uniqueChannels);

        if (uniqueChannels.length > 0 && !selectedChannel) {
            setSelectedChannel(uniqueChannels[0]);
        }

        if (s.channelConfigs) {
            setChannelConfigs(s.channelConfigs);
        }
    }, []);

    const handleSave = async () => {
        if (!settings) return;
        setSaving(true);
        const newSettings = {
            ...settings,
            placements: placements,
            channelConfigs: channelConfigs
        };
        saveSettings(newSettings);
        setSettings(newSettings);
        setSaving(false);
        toast.success("Placement settings saved successfully");
    };

    const handleAddChannel = () => {
        const name = prompt("Enter new channel name:");
        if (name && !channels.includes(name)) {
            setChannels([...channels, name].sort());
            setSelectedChannel(name);
            toast.success(`Channel ${name} added`);
        }
    };

    const handleDeleteChannel = (channel: string) => {
        if (confirm(`Are you sure you want to delete ${channel} and ALL its placements?`)) {
            const newPlacements = placements.filter(p => p.channel !== channel);
            setPlacements(newPlacements);
            const newChannels = channels.filter(c => c !== channel);
            setChannels(newChannels);
            if (selectedChannel === channel) setSelectedChannel(newChannels[0] || null);
            toast.success(`Channel ${channel} deleted`);
        }
    };

    const handleAddPlacement = () => {
        if (!selectedChannel) return;
        const newPlacement: Placement = {
            id: `custom_${Date.now()}`,
            name: 'New Placement',
            size: '300x250',
            width: 300,
            height: 250,
            format: 'img',
            channel: selectedChannel,
            seconds: 'na'
        };
        setPlacements([...placements, newPlacement]);
        setActivePlacement(newPlacement);
    };

    const handleDeletePlacement = (id: string) => {
        if (confirm("Delete this placement?")) {
            setPlacements(placements.filter(p => p.id !== id));
            if (activePlacement?.id === id) setActivePlacement(null);
        }
    };

    const updateActivePlacement = (updates: Partial<Placement>) => {
        if (!activePlacement) return;

        let updated = { ...activePlacement, ...updates };

        // Auto update size string if width/height changes
        if (updates.width || updates.height) {
            updated.size = `${updated.width}x${updated.height}`;
        }

        setActivePlacement(updated);
        setPlacements(placements.map(p => p.id === activePlacement.id ? updated : p));
    };

    const getChannelConfig = (channel: string) => {
        return channelConfigs.find(c => c.channel === channel) || {
            channel,
            defaultFormat: 'img',
            defaultMaxFileSize: undefined,
            defaultOutputFormats: []
        };
    };

    const updateChannelConfig = (channel: string, updates: Partial<ChannelConfig>) => {
        const existingIndex = channelConfigs.findIndex(c => c.channel === channel);
        const newConfig = { ...getChannelConfig(channel), ...updates };

        if (existingIndex >= 0) {
            const newConfigs = [...channelConfigs];
            newConfigs[existingIndex] = newConfig;
            setChannelConfigs(newConfigs);
        } else {
            setChannelConfigs([...channelConfigs, newConfig]);
        }
    };

    const filteredPlacements = React.useMemo(() => {
        return placements.filter(p => p.channel === selectedChannel);
    }, [placements, selectedChannel]);

    return (
        <div className="h-[calc(100vh-140px)] flex border rounded-xl bg-background shadow-sm overflow-hidden text-sm">
            {/* 1. CHANNELS LIST (LEFT) */}
            <div className="w-[240px] flex flex-col border-r bg-muted/5 z-20">
                <div className="p-4 border-b flex items-center justify-between">
                    <h2 className="font-bold text-base">Channels</h2>
                    <Button variant="ghost" size="icon" className="h-6 w-6" onClick={handleAddChannel}>
                        <Plus className="w-4 h-4" />
                    </Button>
                </div>
                <ScrollArea className="flex-1">
                    <div className="p-2 space-y-1">
                        {channels.map(channel => (
                            <div key={channel} className="group flex items-center gap-1">
                                <button
                                    onClick={() => { setSelectedChannel(channel); setActivePlacement(null); }}
                                    className={cn(
                                        "flex-1 text-left px-3 py-2 rounded-md text-xs transition-colors flex items-center justify-between",
                                        selectedChannel === channel
                                            ? "bg-primary/10 text-primary font-medium"
                                            : "hover:bg-muted/50 text-muted-foreground hover:text-foreground"
                                    )}
                                >
                                    <span>{channel}</span>
                                    {selectedChannel === channel && <ChevronRight className="w-3 h-3 opacity-50" />}
                                </button>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-6 w-6 opacity-0 group-hover:opacity-100 text-destructive"
                                    onClick={() => handleDeleteChannel(channel)}
                                >
                                    <Trash2 className="w-3 h-3" />
                                </Button>
                            </div>
                        ))}
                    </div>
                </ScrollArea>
                <div className="p-4 border-t bg-background">
                    <Button className="w-full font-bold" onClick={handleSave} disabled={saving}>
                        {saving ? <span className="animate-spin mr-2">⏳</span> : <Save className="w-4 h-4 mr-2" />}
                        Save Changes
                    </Button>
                </div>
            </div>

            {/* 2. PLACEMENTS LIST (CENTER) */}
            <div className="w-[300px] flex flex-col border-r bg-background z-10">
                <div className="p-4 border-b flex items-center justify-between h-14 bg-muted/5">
                    <span className="font-semibold text-xs text-muted-foreground uppercase tracking-wider">
                        {selectedChannel} Placements
                    </span>
                    <Button variant="outline" size="sm" className="h-7 text-xs gap-1" onClick={handleAddPlacement} disabled={!selectedChannel}>
                        <Plus className="w-3 h-3" /> Add
                    </Button>
                </div>
                <ScrollArea className="flex-1">
                    <div className="p-2 space-y-1">
                        {filteredPlacements.map(p => (
                            <div key={p.id} className="group relative">
                                <button
                                    onClick={() => setActivePlacement(p)}
                                    className={cn(
                                        "w-full text-left p-3 rounded-md border text-xs transition-all hover:shadow-sm",
                                        activePlacement?.id === p.id
                                            ? "bg-primary/5 border-primary/50 ring-1 ring-primary/20"
                                            : "bg-card border-border hover:border-primary/20"
                                    )}
                                >
                                    <div className="font-medium truncate pr-6">{p.name}</div>
                                    <div className="flex items-center gap-2 mt-1 text-[10px] text-muted-foreground font-mono">
                                        <span>{p.width}x{p.height}</span>
                                        <span className="w-px h-2 bg-border" />
                                        <span className="uppercase">{p.format}</span>
                                    </div>
                                </button>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="absolute top-2 right-2 h-6 w-6 opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-destructive"
                                    onClick={(e) => { e.stopPropagation(); handleDeletePlacement(p.id); }}
                                >
                                    <Trash2 className="w-3 h-3" />
                                </Button>
                            </div>
                        ))}
                        {filteredPlacements.length === 0 && (
                            <div className="p-8 text-center text-muted-foreground text-xs italic">
                                No placements in this channel.
                            </div>
                        )}
                    </div>
                </ScrollArea>
            </div>

            {/* 3. DETAILS EDITOR (RIGHT) */}
            <div className="flex-1 flex flex-col bg-muted/5/50">
                {selectedChannel && !activePlacement && (
                    <div className="p-6 space-y-6">
                        <div className="flex items-center gap-2 mb-6">
                            <div className="p-2 bg-blue-100 text-blue-700 rounded-lg dark:bg-blue-900/30 dark:text-blue-400">
                                <Settings2 className="w-5 h-5" />
                            </div>
                            <div>
                                <h3 className="font-bold text-lg">Channel Defaults</h3>
                                <p className="text-xs text-muted-foreground">Default technical specs for {selectedChannel}</p>
                            </div>
                        </div>

                        <div className="space-y-4 max-w-md bg-background p-6 rounded-xl border shadow-sm">
                            <div className="space-y-2">
                                <Label>Default Format</Label>
                                <Select
                                    value={getChannelConfig(selectedChannel).defaultFormat}
                                    onValueChange={(v: any) => updateChannelConfig(selectedChannel, { defaultFormat: v })}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select format" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="img">Image (Static)</SelectItem>
                                        <SelectItem value="vid">Video</SelectItem>
                                        <SelectItem value="html5">HTML5</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label>Max File Size (KB)</Label>
                                <Input
                                    type="number"
                                    placeholder="e.g. 150"
                                    value={getChannelConfig(selectedChannel).defaultMaxFileSize || ''}
                                    onChange={(e) => updateChannelConfig(selectedChannel, { defaultMaxFileSize: parseInt(e.target.value) || undefined })}
                                />
                                <p className="text-[10px] text-muted-foreground">Leave empty for no limit</p>
                            </div>

                            <div className="space-y-2">
                                <Label>Output Formats</Label>
                                <Input
                                    placeholder="e.g. jpg, png"
                                    value={getChannelConfig(selectedChannel).defaultOutputFormats?.join(', ') || ''}
                                    onChange={(e) => updateChannelConfig(selectedChannel, { defaultOutputFormats: e.target.value.split(',').map(s => s.trim()).filter(Boolean) })}
                                />
                                <p className="text-[10px] text-muted-foreground">Comma separated extensions</p>
                            </div>
                        </div>
                    </div>
                )}

                {activePlacement && (
                    <div className="flex-1 flex flex-col">
                        <div className="h-14 border-b bg-background px-6 flex items-center justify-between">
                            <div className="font-bold flex items-center gap-2">
                                <FileCode className="w-4 h-4 text-primary" />
                                Edit Placement
                            </div>
                            <Badge variant="outline" className="font-mono text-[10px]">{activePlacement.id}</Badge>
                        </div>
                        <ScrollArea className="flex-1">
                            <div className="p-8 max-w-xl space-y-8">
                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <Label>Name</Label>
                                        <Input
                                            value={activePlacement.name}
                                            onChange={(e) => updateActivePlacement({ name: e.target.value })}
                                            className="font-bold"
                                        />
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label>Width (px)</Label>
                                            <Input
                                                type="number"
                                                value={activePlacement.width}
                                                onChange={(e) => updateActivePlacement({ width: parseInt(e.target.value) || 0 })}
                                                className="font-mono"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Height (px)</Label>
                                            <Input
                                                type="number"
                                                value={activePlacement.height}
                                                onChange={(e) => updateActivePlacement({ height: parseInt(e.target.value) || 0 })}
                                                className="font-mono"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label>Format Type</Label>
                                        <div className="grid grid-cols-3 gap-2">
                                            {[
                                                { id: 'img', label: 'Image', icon: ImageIcon },
                                                { id: 'vid', label: 'Video', icon: Film },
                                                { id: 'html5', label: 'HTML5', icon: FileCode },
                                            ].map(type => (
                                                <button
                                                    key={type.id}
                                                    onClick={() => updateActivePlacement({ format: type.id as any })}
                                                    className={cn(
                                                        "flex flex-col items-center justify-center gap-2 p-3 rounded-lg border transition-all",
                                                        activePlacement.format === type.id
                                                            ? "bg-primary text-primary-foreground border-primary"
                                                            : "bg-background hover:bg-muted"
                                                    )}
                                                >
                                                    <type.icon className="w-4 h-4" />
                                                    <span className="text-xs font-medium">{type.label}</span>
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {activePlacement.format === 'vid' && (
                                        <div className="space-y-2 animate-in slide-in-from-top-2">
                                            <Label>Duración (segundos)</Label>
                                            <Select
                                                value={activePlacement.seconds}
                                                onValueChange={(v) => updateActivePlacement({ seconds: v })}
                                            >
                                                <SelectTrigger>
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="na">N/A</SelectItem>
                                                    <SelectItem value="06">06s</SelectItem>
                                                    <SelectItem value="10">10s</SelectItem>
                                                    <SelectItem value="15">15s</SelectItem>
                                                    <SelectItem value="30">30s</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    )}
                                </div>

                                <Separator />

                                <div className="space-y-4">
                                    <div className="flex items-center gap-2">
                                        <h3 className="font-bold text-sm">Technical Requirements</h3>
                                        <Badge variant="secondary" className="text-[10px]">Optional overrides</Badge>
                                    </div>

                                    <div className="space-y-2">
                                        <Label>Max File Size (KB)</Label>
                                        <Input
                                            type="number"
                                            placeholder={`Default: ${getChannelConfig(activePlacement.channel as string).defaultMaxFileSize || 'None'}`}
                                            value={activePlacement.maxFileSize || ''}
                                            onChange={(e) => updateActivePlacement({ maxFileSize: parseInt(e.target.value) || undefined })}
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label>Output Formats</Label>
                                        <Input
                                            placeholder={`Default: ${getChannelConfig(activePlacement.channel as string).defaultOutputFormats?.join(', ') || 'None'}`}
                                            value={activePlacement.outputFormats?.join(', ') || ''}
                                            onChange={(e) => updateActivePlacement({ outputFormats: e.target.value.split(',').map(s => s.trim()).filter(Boolean) })}
                                        />
                                        <p className="text-[10px] text-muted-foreground">Comma separated extensions (e.g., mp4, mov)</p>
                                    </div>
                                </div>
                            </div>
                        </ScrollArea>
                    </div>
                )}

                {!selectedChannel && (
                    <div className="flex-1 flex flex-col items-center justify-center text-muted-foreground p-8 text-center">
                        <MonitorSmartphone className="w-16 h-16 mb-4 opacity-10" />
                        <h3 className="text-lg font-bold text-foreground">Placement Manager</h3>
                        <p className="text-sm max-w-xs mx-auto">Select a channel to manage its placements and technical specifications.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
