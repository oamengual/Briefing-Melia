'use client';

import * as React from 'react';
import { Check, Download, Loader2, Palette, Database } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { Template } from './types';

interface ExportSidebarProps {
    templates: Template[];
    selectedTemplateIds: Set<string>;
    onToggleTemplate: (id: string) => void;
    onToggleAll: () => void;
    isExporting: boolean;
    exportProgress: number;
    onExport: () => void;
    canExport: boolean;
    totalAssets: number;
    onLaunchDashboard: () => void;
    onClinchExport: () => void;
}

export function ExportSidebar({
    templates,
    selectedTemplateIds,
    onToggleTemplate,
    onToggleAll,
    isExporting,
    exportProgress,
    onExport,
    canExport,
    totalAssets,
    onLaunchDashboard,
    onClinchExport
}: ExportSidebarProps) {
    const allSelected = selectedTemplateIds.size === templates.length;

    return (
        <div className="w-80 bg-background border-r border-border/40 flex flex-col shrink-0 z-20 shadow-sm relative transition-all duration-300">
            <div className="p-6 border-b border-border/40">
                <h2 className="text-xl font-bold text-foreground tracking-tight">Review & Export</h2>
                <div className="flex flex-col gap-2 mt-3">
                    <p className="text-xs text-muted-foreground font-medium">Select creative sizes for bundle.</p>
                    <Button variant="outline" size="sm" className="w-full gap-2 text-xs font-semibold h-8" onClick={onLaunchDashboard}>
                        <Palette className="w-3.5 h-3.5 text-primary" />
                        Open Designer Board
                    </Button>
                </div>
            </div>

            <div className="p-4 border-b border-border/40 bg-muted/20 flex items-center justify-between">
                <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Templates ({templates.length})</span>
                <button
                    onClick={onToggleAll}
                    className="text-[10px] text-primary hover:text-primary/80 font-bold px-3 py-1.5 rounded-full hover:bg-primary/10 transition-colors bg-background border border-border/50 shadow-sm"
                >
                    {allSelected ? 'Deselect All' : 'Select All'}
                </button>
            </div>

            <ScrollArea className="flex-1">
                <div className="p-4 space-y-6">
                    {(() => {
                        // Group templates by channel
                        const byChannel: Record<string, Template[]> = {};
                        templates.forEach(t => {
                            let channel = t.channel || 'Generic';
                            if (channel !== 'Generic') {
                                channel = channel.charAt(0).toUpperCase() + channel.slice(1);
                            }
                            if (!byChannel[channel]) byChannel[channel] = [];
                            byChannel[channel].push(t);
                        });

                        const channels = Object.keys(byChannel).sort((a, b) => {
                            if (a === 'Generic') return -1;
                            if (b === 'Generic') return 1;
                            return a.localeCompare(b);
                        });

                        return channels.map(channel => (
                            <div key={channel} className="space-y-2">
                                <div className="px-2 py-1 text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1 opacity-70">
                                    {channel}
                                </div>
                                <div className="space-y-2">
                                    {byChannel[channel].map(tpl => {
                                        const isSelected = selectedTemplateIds.has(tpl.id);
                                        return (
                                            <div
                                                key={tpl.id}
                                                className={cn(
                                                    "flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all border group",
                                                    isSelected
                                                        ? "bg-primary/5 border-primary/30 text-primary shadow-sm"
                                                        : "bg-background hover:bg-muted/50 text-muted-foreground border-transparent hover:border-border/50"
                                                )}
                                                onClick={() => onToggleTemplate(tpl.id)}
                                            >
                                                <div className={cn(
                                                    "w-5 h-5 rounded-full border flex items-center justify-center shrink-0 transition-all shadow-sm",
                                                    isSelected
                                                        ? "bg-primary border-primary shadow-primary/20"
                                                        : "border-input bg-background group-hover:border-foreground/30"
                                                )}>
                                                    {isSelected && <Check className="w-3 h-3 text-primary-foreground stroke-[3px]" />}
                                                </div>
                                                <div className="flex flex-col min-w-0">
                                                    <div className="flex items-center gap-2">
                                                        <span className={cn(
                                                            "text-[10px] font-bold font-mono px-2 py-0.5 rounded-md border tracking-tighter",
                                                            isSelected ? "bg-background border-primary/30 text-primary" : "bg-muted border-border text-muted-foreground"
                                                        )}>{tpl.size}</span>
                                                    </div>
                                                    <span className="text-xs font-bold opacity-80 truncate mt-1 leading-none">{tpl.name}</span>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        ));
                    })()}

                    <div className="pt-4 pb-8">
                        {isExporting ? (
                            <div className="w-full bg-secondary-container/50 rounded-xl p-4 border border-border shadow-inner">
                                <div className="flex items-center gap-3 mb-2">
                                    <Loader2 className="w-3.5 h-3.5 animate-spin text-primary" />
                                    <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-tight">Exporting...</span>
                                    <span className="ml-auto text-xs font-bold text-foreground">{exportProgress}%</span>
                                </div>
                                <div className="h-2 w-full bg-muted rounded-full overflow-hidden shadow-inner border border-border/50">
                                    <div className="h-full bg-primary transition-all duration-300" style={{ width: `${exportProgress}%` }} />
                                </div>
                            </div>
                        ) : (
                            <Button
                                className="w-full py-6 rounded-full shadow-airbnb hover:shadow-airbnb-hover transition-all hover:scale-[1.01] text-base font-bold"
                                size="lg"
                                onClick={onExport}
                                disabled={!canExport}
                            >
                                <Download className="w-5 h-5 mr-2" />
                                Export {totalAssets} Assets
                            </Button>
                        )}
                    </div>

                </div>
            </ScrollArea>
        </div>
    );
}
