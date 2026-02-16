import Link from 'next/link';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ModeToggle } from '@/components/mode-toggle';

interface DashboardHeaderProps {
    totalCampaigns: number;
}

export function DashboardHeader({ totalCampaigns }: DashboardHeaderProps) {
    const timeOfDay = new Date().getHours() < 12 ? 'Morning' : new Date().getHours() < 18 ? 'Afternoon' : 'Evening';

    return (
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-border pb-6">
            <div className="space-y-1">
                <h1 className="h1 tracking-normal font-bold">Good {timeOfDay}, John</h1>
                <p className="text-lg text-muted-foreground font-normal">
                    You've created <span className="font-semibold text-foreground">{totalCampaigns}</span> briefings this month.
                </p>
            </div>
            <div className="flex items-center gap-4">
                <ModeToggle />
                <Link href="/briefing/new">
                    <Button variant="cta" size="default">
                        <Plus className="w-5 h-5 mr-2" />
                        New Briefing
                    </Button>
                </Link>
            </div>
        </div>
    );
}
