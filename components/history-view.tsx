'use client';

import * as React from 'react';
import { ActivityLog } from '@/lib/types';
import { getLogs } from '@/lib/storage';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import { ArrowRight, CornerDownRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

function TimeAgo({ timestamp }: { timestamp: number }) {
    // Basic relative time formatter
    const [now, setNow] = React.useState<number | null>(null);

    React.useEffect(() => {
        setNow(Date.now());
    }, []);

    const getRelativeTime = (ts: number) => {
        if (!now) return '';
        const diff = now - ts;
        const seconds = Math.floor(diff / 1000);
        const minutes = Math.floor(seconds / 60);
        const hours = Math.floor(minutes / 60);
        const days = Math.floor(hours / 24);

        if (seconds < 60) return 'just now';
        if (minutes < 60) return `${minutes}m ago`;
        if (hours < 24) return `${hours}h ago`;
        return `${days}d ago`;
    };

    return <span className="text-muted-foreground text-xs tabular-nums">{getRelativeTime(timestamp)}</span>;
}

function FormatValue({ value, type }: { value: any, type: 'old' | 'new' }) {
    if (value === null || value === undefined) return <span className="text-muted-foreground/40 italic text-[10px] font-medium">empty</span>;

    // Matrix Changes (Added/Removed lists)
    if (typeof value === 'object' && ('added' in value || 'removed' in value)) {
        const items = (value.added || value.removed) as string[];
        const isAdded = 'added' in value;
        return (
            <div className="flex flex-wrap gap-1.5">
                {items.map((item, i) => (
                    <Badge key={i} variant="outline" className={cn(
                        "text-[10px] font-bold h-6 border-none radius-btn px-2.5",
                        isAdded
                            ? "bg-emerald-50 text-emerald-600 border border-emerald-100"
                            : "bg-red-50 text-red-600 line-through opacity-60 border border-red-100"
                    )}>
                        {isAdded ? '+ ' : '- '}{item}
                    </Badge>
                ))}
            </div>
        );
    }

    // Fallback for other objects
    if (typeof value === 'object') return <span className="font-mono text-[10px] truncate max-w-[150px] bg-muted/20 px-2 py-1 rounded-md border border-border/30">{JSON.stringify(value)}</span>;

    // Boolean
    if (typeof value === 'boolean') {
        const str = value ? 'True' : 'False';
        return (
            <Badge variant="outline" className={cn(
                "text-[10px] font-bold h-6 border-none radius-btn px-2.5",
                value
                    ? "bg-emerald-50 text-emerald-600 border border-emerald-100"
                    : "bg-red-50 text-red-600 border border-red-100"
            )}>
                {str}
            </Badge>
        );
    }

    // String/Number
    return (
        <span className={cn(
            "text-sm font-medium",
            type === 'old' ? "text-muted-foreground line-through decoration-border" : "text-foreground"
        )}>
            {String(value)}
        </span>
    );
}


interface HistoryViewProps {
    briefId: string;
}

export function HistoryView({ briefId }: HistoryViewProps) {
    const [logs, setLogs] = React.useState<ActivityLog[]>([]);

    React.useEffect(() => {
        const fetch = async () => {
            const data = await getLogs(briefId);
            setLogs(data);
        };
        fetch();
    }, [briefId]);

    if (logs.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center p-12 text-muted-foreground bg-muted/30 radius-card border-dashed border-2 border-border">
                <p>No history recorded for this campaign.</p>
            </div>
        );
    }

    return (
        <ScrollArea className="h-[calc(100vh-220px)] pr-6 -mr-6">
            <div className="relative border-l border-border ml-4 space-y-10 py-6">
                {logs.map((log) => (
                    <div key={log.id} className="relative pl-8 animate-in slide-in-from-left-4 duration-500">
                        {/* Dot */}
                        <div className={cn(
                            "absolute -left-[9px] top-1 h-4 w-4 rounded-full border-4 border-background ring-1 ring-border shadow-sm",
                            log.action === 'created' ? "bg-emerald-500" :
                                log.action === 'deleted' ? "bg-red-500" :
                                    log.action === 'duplicated' ? "bg-amber-500" :
                                        "bg-primary"
                        )} />

                        <div className="space-y-3">
                            {/* Header */}
                            <div className="flex items-center gap-3 flex-wrap">
                                <span className="text-sm font-bold text-foreground tracking-tight">
                                    {log.userName}
                                </span>
                                <Badge className={cn(
                                    "text-[10px] font-bold h-6 px-2.5 border-none radius-btn shadow-none",
                                    log.action === 'created' ? "bg-emerald-50 text-emerald-600 border border-emerald-100" :
                                        log.action === 'deleted' ? "bg-red-50 text-red-600 border border-red-100" :
                                            log.action === 'duplicated' ? "bg-amber-50 text-amber-600 border border-amber-100" :
                                                "bg-muted text-foreground"
                                )}>
                                    {log.action}
                                </Badge>
                                <TimeAgo timestamp={log.timestamp} />
                            </div>

                            {/* Details Text */}
                            {log.details && (
                                <p className="text-sm text-muted-foreground leading-relaxed max-w-2xl">
                                    {log.details}
                                </p>
                            )}

                            {/* Changes Accordion */}
                            {log.changes && log.changes.length > 0 && (
                                <div className="w-full max-w-2xl">
                                    <Accordion type="single" collapsible>
                                        <AccordionItem value="changes" className="border-none">
                                            <AccordionTrigger className="py-2 hover:no-underline flex justify-start gap-3 group">
                                                <div className="flex items-center gap-2 px-3 py-1.5 radius-btn bg-muted/30 border border-transparent transition-all group-hover:border-border group-hover:shadow-sm">
                                                    <span className="w-5 h-5 rounded-full bg-foreground text-background text-[10px] flex items-center justify-center font-bold shadow-sm">{log.changes.length}</span>
                                                    <span className="text-xs font-semibold text-foreground">Changes Recorded</span>
                                                </div>
                                            </AccordionTrigger>
                                            <AccordionContent>
                                                <div className="bg-card radius-card border border-border shadow-card divide-y divide-border mt-2 overflow-hidden">
                                                    {log.changes.map((change, i) => (
                                                        <div key={i} className="grid grid-cols-1 sm:grid-cols-[140px,1fr] gap-4 items-center p-4 hover:bg-muted/30 transition-colors">

                                                            {/* Field Name */}
                                                            <div className="flex items-center gap-2">
                                                                <CornerDownRight className="w-3.5 h-3.5 text-muted-foreground opacity-40 shrink-0" />
                                                                <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider truncate" title={change.field}>
                                                                    {change.field}
                                                                </span>
                                                            </div>

                                                            {/* Values */}
                                                            <div className="flex items-center gap-4 flex-wrap">
                                                                <div className="flex-1 min-w-[30%]">
                                                                    <FormatValue value={change.oldValue} type="old" />
                                                                </div>
                                                                <ArrowRight className="w-3.5 h-3.5 text-border shrink-0" />
                                                                <div className="flex-1 min-w-[30%]">
                                                                    <FormatValue value={change.newValue} type="new" />
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </AccordionContent>
                                        </AccordionItem>
                                    </Accordion>
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </ScrollArea>
    );
}
