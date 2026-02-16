'use client';

import * as React from 'react';
import {
    format,
    startOfMonth,
    endOfMonth,
    startOfWeek,
    endOfWeek,
    eachDayOfInterval,
    isSameMonth,
    isSameDay,
    addMonths,
    subMonths,
    isWithinInterval,
    parseISO,
    isValid
} from 'date-fns';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, ArrowRight, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Brief } from '@/lib/types';
import { cn } from '@/lib/utils';
import { useRouter } from 'next/navigation';

interface CalendarViewProps {
    briefs: Brief[];
}

export function CalendarView({ briefs }: CalendarViewProps) {
    const router = useRouter();
    const [currentMonth, setCurrentMonth] = React.useState(new Date());

    // Navigation handlers
    const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));
    const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));
    const goToToday = () => setCurrentMonth(new Date());

    // Generate Calendar Grid
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart, { weekStartsOn: 1 }); // Monday start
    const endDate = endOfWeek(monthEnd, { weekStartsOn: 1 });

    const calendarDays = eachDayOfInterval({
        start: startDate,
        end: endDate,
    });

    // Weekday headers
    const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

    // Status Colors
    const getStatusColor = (status: string) => {
        switch (status) {
            case 'approved': return 'bg-emerald-100 text-emerald-700 border-emerald-200 hover:bg-emerald-200';
            case 'review': return 'bg-amber-100 text-amber-700 border-amber-200 hover:bg-amber-200';
            case 'completed': return 'bg-blue-100 text-blue-700 border-blue-200 hover:bg-blue-200';
            default: return 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200'; // draft
        }
    };

    // Helper to check if a brief is active on a given day
    const getBriefsForDay = (day: Date) => {
        return briefs.filter(brief => {
            const startStr = brief.state.inputs?.startDate;
            const endStr = brief.state.inputs?.endDate;
            if (!startStr || !endStr) return false;
            const start = parseISO(startStr);
            const end = parseISO(endStr);
            if (!isValid(start) || !isValid(end)) return false;
            return isWithinInterval(day, { start, end });
        }).sort((a, b) => {
            // Sort by start date, then duration (longer first)
            const aStart = a.state.inputs.startDate || '';
            const bStart = b.state.inputs.startDate || '';
            if (aStart !== bStart) return aStart.localeCompare(bStart);
            return a.id.localeCompare(b.id);
        });
    };

    return (
        <div className="h-full flex flex-col space-y-4">
            {/* Calendar Header */}
            <div className="flex items-center justify-between shrink-0">
                <div className="flex items-center gap-4">
                    <h2 className="text-2xl font-bold tracking-tight text-foreground">
                        {format(currentMonth, 'MMMM yyyy')}
                    </h2>
                    <div className="flex items-center rounded-md border border-border shadow-sm bg-card">
                        <Button variant="ghost" size="icon" onClick={prevMonth} className="h-8 w-8 rounded-r-none border-r border-border hover:bg-muted">
                            <ChevronLeft className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={goToToday} className="h-8 rounded-none px-3 font-medium text-xs hover:bg-muted">
                            Today
                        </Button>
                        <Button variant="ghost" size="icon" onClick={nextMonth} className="h-8 w-8 rounded-l-none border-l border-border hover:bg-muted">
                            <ChevronRight className="w-4 h-4" />
                        </Button>
                    </div>
                </div>

                {/* Legend */}
                <div className="flex gap-4 text-xs font-medium text-muted-foreground bg-muted/30 px-3 py-1.5 rounded-full border border-border/50">
                    <div className="flex items-center gap-1.5">
                        <div className="w-2 h-2 rounded-full bg-slate-400" />
                        <span>Draft</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                        <div className="w-2 h-2 rounded-full bg-amber-400" />
                        <span>Review</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                        <div className="w-2 h-2 rounded-full bg-emerald-400" />
                        <span>Approved</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                        <div className="w-2 h-2 rounded-full bg-blue-400" />
                        <span>Completed</span>
                    </div>
                </div>
            </div>

            {/* Grid Container */}
            <div className="flex-1 flex flex-col border border-border shadow-sm rounded-xl overflow-hidden bg-card min-h-0">
                {/* Week Headers */}
                <div className="grid grid-cols-7 bg-muted/40 border-b border-border text-center">
                    {weekDays.map(day => (
                        <div key={day} className="py-2 text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
                            {day}
                        </div>
                    ))}
                </div>

                {/* Days Grid - Flex grow to fill remaining height */}
                <div className="flex-1 grid grid-cols-7 grid-rows-5 lg:grid-rows-5 bg-background min-h-0">
                    {calendarDays.map((day, dayIdx) => {
                        const isCurrentMonth = isSameMonth(day, monthStart);
                        const isToday = isSameDay(day, new Date());
                        const dayBriefs = getBriefsForDay(day);

                        return (
                            <div
                                key={day.toISOString()}
                                className={cn(
                                    "border-b border-r border-border/40 relative flex flex-col group hover:bg-muted/5 transition-colors",
                                    !isCurrentMonth && "bg-muted/5 text-muted-foreground/30",
                                    dayIdx % 7 === 6 && "border-r-0", // No right border last col
                                    dayIdx >= 28 && "border-b-0",      // No bottom border last row (approx)
                                    "p-0" // Remove padding for seamless look
                                )}
                                onClick={() => {
                                    // Optional: Open day view or Create new
                                }}
                            >
                                {/* Date Number */}
                                <div className="flex items-center justify-between p-1">
                                    <span className={cn(
                                        "text-xs font-semibold w-6 h-6 flex items-center justify-center rounded-full mb-0.5",
                                        isToday ? "bg-primary text-primary-foreground shadow-sm" : "text-muted-foreground"
                                    )}>
                                        {format(day, 'd')}
                                    </span>
                                </div>

                                {/* Brief Bars */}
                                <div className="flex flex-col gap-1 overflow-y-auto no-scrollbar pb-1 w-full">
                                    {dayBriefs.map(brief => {
                                        const startStr = brief.state.inputs?.startDate || '';
                                        const endStr = brief.state.inputs?.endDate || '';
                                        const isStart = isSameDay(parseISO(startStr), day);
                                        const isEnd = isSameDay(parseISO(endStr), day);
                                        const isMonday = day.getDay() === 1; // 1 = Monday

                                        // Visual Logic for "Connected" bars
                                        // Since we are in a grid cell, we can't physically connect them across DOM nodes without complex absolute positioning.
                                        // But we can Style them to LOOK connected.
                                        // If not start, remove left border radius and margin.
                                        // If not end, remove right border radius and margin.

                                        return (
                                            <div
                                                key={brief.id}
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    router.push(`/briefing/${brief.id}`);
                                                }}
                                                className={cn(
                                                    "h-5 px-1.5 text-[10px] font-bold truncate cursor-pointer transition-all shadow-sm select-none relative z-10 flex items-center",
                                                    getStatusColor(brief.status || 'draft'),
                                                    isStart ? "rounded-l-md ml-1" : "border-l-0 -ml-[1px] rounded-l-none pl-0.5",
                                                    isEnd ? "rounded-r-md mr-1" : "border-r-0 -mr-[1px] rounded-r-none",
                                                    (isStart || isEnd) && "z-20", // Bring ends to front over borders
                                                )}
                                                title={`${brief.name} (${brief.status})`}
                                            >
                                                {/* Text only on Start or Monday */}
                                                {(isStart || isMonday) && (
                                                    <span className="truncate w-full block">
                                                        {brief.name}
                                                    </span>
                                                )}
                                                {/* If middle day, empty content maintains height */}
                                                {!(isStart || isMonday) && <span className="opacity-0">.</span>}
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}

export function UpcomingListView({ briefs }: CalendarViewProps) {
    const router = useRouter();
    const upcoming = briefs
        .filter(b => {
            // Only show future starts
            if (!b.state.inputs?.startDate) return false;
            return parseISO(b.state.inputs.startDate) > new Date(); // Strictly future
        })
        .sort((a, b) => (a.state.inputs?.startDate || '').localeCompare(b.state.inputs?.startDate || ''))
        .slice(0, 5);

    if (upcoming.length === 0) return (
        <div className="text-center py-4 text-xs text-muted-foreground">No upcoming campaigns scheduled</div>
    );

    return (
        <Card className="border-none shadow-none bg-transparent">
            {/* ... keeping simplified list ... */}
            <CardHeader className="px-0 pt-0 pb-2">
                <CardTitle className="text-sm font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-2">
                    <CalendarIcon className="w-3.5 h-3.5" />
                    Upcoming Starts
                </CardTitle>
            </CardHeader>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
                {upcoming.map(brief => (
                    <div
                        key={brief.id}
                        className="flex flex-col p-3 bg-card border border-border radius-card shadow-sm hover:border-primary/50 hover:shadow-md transition-all cursor-pointer group space-y-2"
                        onClick={() => router.push(`/briefing/${brief.id}`)}
                    >
                        <div className="flex items-center justify-between">
                            <h4 className="font-semibold text-sm text-foreground group-hover:text-primary truncate" title={brief.name}>{brief.name}</h4>
                            <ArrowRight className="w-3 h-3 text-muted-foreground opacity-50 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
                        </div>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <span className="bg-muted px-1.5 py-0.5 rounded text-[10px] font-medium uppercase tracking-wide">
                                {format(parseISO(brief.state.inputs?.startDate || ''), 'MMM d')}
                            </span>
                            <span className="text-[10px] opacity-70">to</span>
                            <span className="bg-muted px-1.5 py-0.5 rounded text-[10px] font-medium uppercase tracking-wide">
                                {format(parseISO(brief.state.inputs?.endDate || ''), 'MMM d')}
                            </span>
                        </div>
                    </div>
                ))}
            </div>
        </Card>
    );
}
