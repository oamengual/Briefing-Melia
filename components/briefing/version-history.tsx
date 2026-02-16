'use client';

import * as React from 'react';
import { History, RotateCcw, Clock, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { formatDistanceToNow } from 'date-fns';
import { getBriefVersions } from '@/lib/storage';
import { BriefVersion } from '@/lib/types';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';

interface VersionHistoryProps {
    briefId: string;
    onRevert: (version: BriefVersion) => void;
}

export function VersionHistory({ briefId, onRevert }: VersionHistoryProps) {
    const [versions, setVersions] = React.useState<BriefVersion[]>([]);
    const [loading, setLoading] = React.useState(false);
    const [open, setOpen] = React.useState(false);

    const loadVersions = React.useCallback(async () => {
        setLoading(true);
        try {
            const data = await getBriefVersions(briefId);
            setVersions(data);
        } finally {
            setLoading(false);
        }
    }, [briefId]);

    React.useEffect(() => {
        if (open) {
            loadVersions();
        }
    }, [open, loadVersions]);

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="h-8 gap-2">
                    <History className="w-4 h-4" />
                    <span className="hidden sm:inline">History</span>
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <History className="w-5 h-5 text-primary" />
                        Briefing History
                    </DialogTitle>
                    <DialogDescription>
                        View and restore previous versions of this briefing. Local history is kept for the last 10 versions.
                    </DialogDescription>
                </DialogHeader>

                <div className="mt-4 relative flex flex-col h-[60vh]">
                    <ScrollArea className="flex-1 pr-4">
                        {loading ? (
                            <div className="flex items-center justify-center p-8 text-muted-foreground">
                                <Clock className="w-4 h-4 mr-2 animate-spin" />
                                Loading history...
                            </div>
                        ) : versions.length === 0 ? (
                            <div className="text-center py-12 text-muted-foreground">
                                <History className="w-8 h-8 mx-auto mb-3 opacity-20" />
                                <p className="text-sm">No version history found.</p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {versions.map((version, idx) => (
                                    <div
                                        key={version.id}
                                        className={cn(
                                            "relative p-4 rounded-xl border transition-all group",
                                            idx === 0
                                                ? "bg-primary/5 border-primary/20 ring-1 ring-primary/10"
                                                : "bg-card hover:bg-muted/50 border-border"
                                        )}
                                    >
                                        <div className="flex justify-between items-start mb-2">
                                            <div className="space-y-1">
                                                <div className="flex items-center gap-2">
                                                    <span className="text-sm font-bold tracking-tight">
                                                        {idx === 0 ? 'Current Version' : `Version ${versions.length - idx}`}
                                                    </span>
                                                    {idx === 0 && (
                                                        <Badge variant="outline" className="text-[9px] uppercase tracking-widest bg-primary/10 border-primary/20 text-primary">
                                                            Active
                                                        </Badge>
                                                    )}
                                                </div>
                                                <div className="text-[11px] text-muted-foreground flex items-center gap-1.5">
                                                    <Clock className="w-3 h-3" />
                                                    {formatDistanceToNow(version.timestamp, { addSuffix: true })}
                                                </div>
                                            </div>

                                            {idx !== 0 && (
                                                <Button
                                                    size="sm"
                                                    variant="secondary"
                                                    className="h-8 px-3 gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-primary hover:text-primary-foreground"
                                                    onClick={() => {
                                                        if (confirm('Are you sure you want to revert to this version? Current unsaved changes will be lost.')) {
                                                            onRevert(version);
                                                            setOpen(false);
                                                        }
                                                    }}
                                                >
                                                    <RotateCcw className="w-3.5 h-3.5" />
                                                    Revert
                                                </Button>
                                            )}
                                        </div>

                                        {/* Visual Change Summary */}
                                        {version.changes && version.changes.length > 0 ? (
                                            <div className="flex flex-wrap gap-1.5 mt-3 mb-2">
                                                {/* Group and Deduplicate Categories */}
                                                {Array.from(new Set(version.changes.map(c => {
                                                    const f = c.field.toLowerCase();
                                                    if (f.startsWith('market:')) return 'Matrix';
                                                    if (['claim', 'cta', 'discount', 'usp1', 'usp2', 'usp3'].includes(f)) return 'Content';
                                                    return 'Strategic';
                                                }))).map(category => (
                                                    <Badge
                                                        key={category}
                                                        variant="secondary"
                                                        className={cn(
                                                            "text-[9px] px-1.5 py-0 h-4 border-none",
                                                            category === 'Matrix' && "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300",
                                                            category === 'Content' && "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300",
                                                            category === 'Strategic' && "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300"
                                                        )}
                                                    >
                                                        {category}
                                                    </Badge>
                                                ))}
                                                <span className="text-[10px] text-muted-foreground ml-1 self-center">
                                                    ({version.changes.length} {version.changes.length === 1 ? 'change' : 'changes'})
                                                </span>
                                            </div>
                                        ) : idx === 0 ? (
                                            <div className="text-[9px] text-muted-foreground/50 italic mt-3 mb-2">
                                                Current session state
                                            </div>
                                        ) : (
                                            <div className="text-[9px] text-muted-foreground/50 italic mt-3 mb-2">
                                                Initial creation
                                            </div>
                                        )}

                                        {/* Brief summary of state if possible */}
                                        <div className="text-[10px] text-muted-foreground/60 font-mono line-clamp-2 bg-black/5 dark:bg-white/5 p-2 rounded border border-black/5 dark:border-white/5">
                                            {(version.state as any).inputs?.campaignName || 'Untitled'} - {(version.state as any).inputs?.brand || 'No Brand'}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </ScrollArea>
                </div>
            </DialogContent>
        </Dialog>
    );
}
