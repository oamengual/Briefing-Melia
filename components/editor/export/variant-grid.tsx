'use client';

import * as React from 'react';
import { LayoutGrid } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { VariantCard } from './variant-card';
import { VariantGroup } from './types';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertTriangle } from 'lucide-react';

interface VariantGridProps {
    groupedVariants: VariantGroup[];
    feedData: any;
    onPreview: (variantId: string) => void;
    missingSizes: string[];
}

export function VariantGrid({ groupedVariants, feedData, onPreview, missingSizes }: VariantGridProps) {
    if (groupedVariants.length === 0) {
        return (
            <div className="flex-1 flex flex-col h-full overflow-hidden bg-background relative">
                <ScrollArea className="h-full w-full">
                    <div className="flex flex-col items-center justify-center py-32 text-muted-foreground select-none">
                        <div className="w-20 h-20 bg-secondary-container/30 rounded-full flex items-center justify-center mb-6 shadow-inner">
                            <LayoutGrid className="w-8 h-8 opacity-20" />
                        </div>
                        <h3 className="text-xl font-bold text-foreground tracking-tight">No Templates Selected</h3>
                        <p className="text-sm max-w-xs text-center mt-2 opacity-70 leading-relaxed">
                            Select templates from the sidebar to review and export your creatives.
                        </p>
                    </div>
                </ScrollArea>
            </div>
        );
    }

    return (
        <div className="flex-1 flex flex-col h-full overflow-hidden bg-background relative">
            <ScrollArea className="h-full w-full">
                <div className="p-8 max-w-[1600px] mx-auto pb-32">
                    {missingSizes.length > 0 && (
                        <Alert variant="destructive" className="mb-8 bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-800 text-amber-900 dark:text-amber-100 shadow-sm rounded-xl flex gap-4 p-5">
                            <AlertTriangle className="h-5 w-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                            <div>
                                <AlertTitle className="text-base font-bold tracking-tight mb-1">Missing Templates</AlertTitle>
                                <AlertDescription className="text-sm leading-relaxed opacity-90">
                                    The following sizes are requested in the Market Matrix but have no corresponding template uploaded:
                                    <div className="flex flex-wrap gap-2 mt-3">
                                        {missingSizes.map(size => (
                                            <span key={size} className="px-2.5 py-1 text-[11px] font-mono font-bold bg-white/60 dark:bg-black/20 border border-amber-200/50 rounded-md shadow-sm">
                                                {size}
                                            </span>
                                        ))}
                                    </div>
                                </AlertDescription>
                            </div>
                        </Alert>
                    )}
                    <div className="space-y-16">
                        <div className="space-y-20">
                            {(() => {
                                // Group by Channel
                                const byChannel: Record<string, VariantGroup[]> = {};
                                groupedVariants.forEach(g => {
                                    // Extract channel or fallback to 'Generic'
                                    let channel = g.tpl.channel ? g.tpl.channel : 'Generic';
                                    // Normalize Display Name
                                    if (channel !== 'Generic') {
                                        // Humanize: 'amazondsp' -> 'Amazon DSP' if possible, or just Capitalize
                                        // We can just use the provided channel string from the uploader which tries to be smart
                                        channel = channel.charAt(0).toUpperCase() + channel.slice(1);
                                    }
                                    if (!byChannel[channel]) byChannel[channel] = [];
                                    byChannel[channel].push(g);
                                });

                                // Sort channels: Generic first, then alphabetical
                                const channels = Object.keys(byChannel).sort((a, b) => {
                                    if (a === 'Generic') return -1;
                                    if (b === 'Generic') return 1;
                                    return a.localeCompare(b);
                                });

                                return channels.map(channel => (
                                    <div key={channel} className="space-y-6">
                                        {/* Channel Header */}
                                        <div className="flex items-center gap-4 border-b border-border/40 pb-4">
                                            <h2 className="text-2xl font-bold text-foreground tracking-tight">
                                                {channel}
                                            </h2>
                                            <Badge variant="secondary" className="text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full shadow-sm">
                                                {byChannel[channel].reduce((acc, g) => acc + g.variants.length, 0)} Variants
                                            </Badge>
                                        </div>

                                        {/* Size Groups within Channel */}
                                        <div className="space-y-12">
                                            {byChannel[channel].map((group) => (
                                                <div key={group.tpl.id} className="animate-in fade-in duration-500 slide-in-from-bottom-2">
                                                    <div className="flex items-end justify-between mb-4">
                                                        <div>
                                                            <h3 className="text-sm font-bold text-muted-foreground flex items-center gap-3 font-mono tracking-tight bg-muted/30 px-3 py-1 rounded-full w-fit">
                                                                {group.tpl.size}
                                                            </h3>
                                                        </div>
                                                    </div>

                                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4 gap-8">
                                                        {group.variants.map((v) => (
                                                            <VariantCard
                                                                key={v.id}
                                                                tpl={group.tpl}
                                                                variant={v}
                                                                feedData={feedData!}
                                                                onPreview={() => onPreview(v.id)}
                                                            />
                                                        ))}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ));
                            })()}
                        </div>
                    </div>
                </div>
            </ScrollArea>
        </div>
    );
}
