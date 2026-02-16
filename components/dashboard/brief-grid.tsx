import Link from 'next/link';
import { Layers, Copy, Trash2, Search } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Brief } from '@/lib/types';
import { MARKETS } from '@/lib/constants';
import { formatDistanceToNow } from 'date-fns';

interface BriefGridProps {
    briefs: Brief[];
    onDuplicate: (id: string, e: React.MouseEvent) => void;
    onDelete: (id: string, e: React.MouseEvent) => void;
    onClearFilters: () => void;
}

const getStatusColor = (status: Brief['status'] = 'draft'): "default" | "secondary" | "destructive" | "outline" | "success" | "warning" | "info" | "neutral" => {
    switch (status) {
        case 'approved': return 'success';
        case 'review': return 'warning';
        case 'completed': return 'info';
        case 'draft':
        default: return 'neutral';
    }
}

const getBriefAssetCount = (brief: Brief) => {
    let count = 0;
    const matrix = brief.state.matrix || {};
    const regions = brief.state.inputs.regions || [];

    Object.entries(matrix).forEach(([marketSelector, ids]) => {
        let lookup = marketSelector;
        if (lookup.startsWith('ZH')) lookup = 'CN (China)';
        const market = MARKETS.find(m => m.selector === lookup);
        if (market && regions.includes(market.region)) {
            count += ids.length;
        }
    });
    return count;
};

export function BriefGrid({ briefs, onDuplicate, onDelete, onClearFilters }: BriefGridProps) {
    if (briefs.length === 0) {
        return (
            <div className="col-span-12 py-32 text-center space-y-6">
                <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                    <Search className="w-6 h-6 text-muted-foreground" />
                </div>
                <div className="space-y-1">
                    <h3 className="text-lg font-bold text-foreground">No campaigns found</h3>
                    <p className="text-sm text-muted-foreground">Try searching for something else or adjusting your filters.</p>
                </div>
                <Button variant="outline" onClick={onClearFilters}>
                    Clear filters
                </Button>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {briefs.map(brief => (
                <div key={brief.id} className="group relative">
                    <Link href={`/briefing/${brief.id}`} className="block h-full outline-none">
                        <Card className="h-full overflow-hidden hover:shadow-card transition-all duration-300 border border-border shadow-sm radius-card bg-card">
                            {/* Preview Area (Simulated) */}
                            <div className="aspect-[3/2] bg-muted relative flex items-center justify-center overflow-hidden group-hover:scale-105 transition-transform duration-500">
                                <Layers className="w-12 h-12 text-muted-foreground/30" />
                                <div className="absolute top-3 left-3">
                                    <Badge variant={getStatusColor(brief.status)} className="shadow-sm font-semibold">
                                        {brief.status || 'Draft'}
                                    </Badge>
                                </div>
                            </div>

                            <CardContent className="p-5 space-y-3 relative bg-card z-10">
                                <div>
                                    <h3 className="text-base font-bold text-foreground leading-tight line-clamp-1 group-hover:text-primary transition-colors">{brief.name}</h3>
                                    <p className="text-xs font-semibold text-muted-foreground mt-1 uppercase tracking-wide">{brief.state.inputs.brand}</p>
                                </div>

                                <div className="flex items-center justify-between pt-3 border-t border-border">
                                    <span className="text-xs font-medium text-muted-foreground">{getBriefAssetCount(brief)} assets</span>
                                    <span className="text-xs font-medium text-muted-foreground whitespace-nowrap">{formatDistanceToNow(new Date(brief.updatedAt))} ago</span>
                                </div>
                            </CardContent>
                        </Card>
                    </Link>

                    {/* Quick Actions (Hover Overlay) */}
                    <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity z-20">
                        <Button
                            variant="secondary"
                            size="icon"
                            className="h-8 w-8 bg-background/90 backdrop-blur-sm border shadow-sm hover:bg-background radius-btn text-foreground"
                            onClick={(e) => onDuplicate(brief.id, e)}
                        >
                            <Copy className="w-3.5 h-3.5" />
                        </Button>
                        <Button
                            variant="destructive"
                            size="icon"
                            className="h-8 w-8 bg-background/90 backdrop-blur-sm border shadow-sm hover:bg-destructive hover:text-white text-destructive radius-btn"
                            onClick={(e) => onDelete(brief.id, e)}
                        >
                            <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                    </div>
                </div>
            ))}
        </div>
    );
}
