import { Card, CardContent } from '@/components/ui/card';
import { Layers, Star, Users, TrendingUp } from 'lucide-react';
import { cn } from "@/lib/utils";

interface StatsGridProps {
    stats: {
        totalCampaigns: number;
        totalAssets: number;
        avgMarkets: number;
        topChannel: string;
    }
}

export function StatsGrid({ stats }: StatsGridProps) {
    const statItems = [
        { label: 'Campaigns', value: stats.totalCampaigns, icon: Layers, accent: 'text-[#FF385C]' },
        { label: 'Total Assets', value: stats.totalAssets, icon: Star, accent: 'text-[#008489]' },
        { label: 'Avg Markets', value: stats.avgMarkets, icon: Users, accent: 'text-[#222222]' },
        { label: 'Top Channel', value: stats.topChannel, icon: TrendingUp, accent: 'text-[#FF385C]' },
    ];

    return (
        <div className="grid grid-cols-12 gap-4">
            {statItems.map((stat, i) => (
                <Card key={i} className="col-span-12 md:col-span-6 lg:col-span-3 border border-border shadow-card radius-card overflow-hidden bg-card">
                    <CardContent className="p-6 flex items-start justify-between">
                        <div className="space-y-1">
                            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{stat.label}</p>
                            <p className="text-3xl font-bold text-foreground">{stat.value}</p>
                        </div>
                        <div className={cn("p-2 radius-btn bg-muted", stat.accent)}>
                            <stat.icon className="w-5 h-5" />
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}
