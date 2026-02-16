'use client';

import * as React from 'react';
import { getBriefs } from '@/lib/storage';
import { Brief } from '@/lib/types';
import { CalendarView, UpcomingListView } from '@/components/calendar-view';
import { Loader2 } from 'lucide-react';

export default function CalendarPage() {
    const [briefs, setBriefs] = React.useState<Brief[]>([]);
    const [loading, setLoading] = React.useState(true);

    React.useEffect(() => {
        const fetchBriefs = async () => {
            const data = await getBriefs();
            setBriefs(data);
            setLoading(false);
        };
        fetchBriefs();
    }, []);

    if (loading) {
        return (
            <div className="h-screen w-full flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="p-6 h-[calc(100vh-4rem)] flex flex-col space-y-4">
            <div className="flex items-center justify-between shrink-0">
                <div className="space-y-1">
                    <h1 className="text-2xl font-bold tracking-tight text-foreground">Campaign Calendar</h1>
                    <p className="text-muted-foreground text-sm">Timeline view of all scheduled campaigns.</p>
                </div>
            </div>

            <div className="flex-1 min-h-0 w-full overflow-hidden flex flex-col">
                <CalendarView briefs={briefs} />
            </div>

            <div className="shrink-0 pt-4 border-t border-border">
                <UpcomingListView briefs={briefs} />
            </div>
        </div>
    );
}
