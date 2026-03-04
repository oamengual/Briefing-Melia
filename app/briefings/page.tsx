'use client';

import * as React from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { Card, CardContent } from '@/components/ui/card';
import { Plus, Copy, Trash2, Download, Search, Filter, Loader2, ArrowRight, FileText } from 'lucide-react';
import { getBriefs, deleteBrief, duplicateBrief } from '@/lib/storage';
import { Brief } from '@/lib/types';
import { formatDistanceToNow } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { MARKETS } from '@/lib/constants';

export default function BriefingsPage() {
    const [briefs, setBriefs] = React.useState<Brief[]>([]);
    const [isLoading, setIsLoading] = React.useState(true);
    const [searchQuery, setSearchQuery] = React.useState('');
    const [statusFilter, setStatusFilter] = React.useState('all');
    const [sortBy, setSortBy] = React.useState('updated');

    const fetchData = React.useCallback(async () => {
        setIsLoading(true);
        const data = await getBriefs();
        setBriefs(data);
        setIsLoading(false);
    }, []);

    React.useEffect(() => {
        fetchData();
    }, [fetchData]);

    const handleDelete = async (id: string) => {
        if (confirm('Are you sure you want to delete this brief?')) {
            await deleteBrief(id);
            await fetchData();
        }
    };

    const handleDuplicate = async (id: string) => {
        const newId = await duplicateBrief(id);
        if (newId) {
            await fetchData();
        }
    };

    const handleDownloadCSV = () => {
        if (!briefs.length) return;
        const headers = ['Campaign ID', 'Name', 'Status', 'Updated', 'Markets', 'Total Assets'];
        const rows = briefs.map(b => {
            const matrix = b.state.matrix || {};
            const markets = Object.keys(matrix).join('; ');
            const assetCount = getBriefAssetCount(b);
            return [
                b.id,
                `"${b.name}"`,
                b.status || 'draft',
                new Date(b.updatedAt).toISOString().split('T')[0],
                `"${markets}"`,
                assetCount
            ].join(',');
        });
        const csvContent = "data:text/csv;charset=utf-8," + [headers.join(','), ...rows].join('\n');
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "campaigns_export.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    // --- Helpers ---
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

    const getStatusColor = (status: Brief['status'] = 'draft') => {
        switch (status) {
            case 'approved': return 'success';
            case 'review': return 'warning';
            case 'completed': return 'info';
            default: return 'neutral';
        }
    };

    // --- Derived State ---
    const filteredBriefs = React.useMemo(() => {
        let result = briefs;

        // Search
        if (searchQuery) {
            const lower = searchQuery.toLowerCase();
            result = result.filter(b =>
                b.name.toLowerCase().includes(lower) ||
                b.state.inputs.brand?.toLowerCase().includes(lower)
            );
        }

        // Tab Filter (Status)
        if (statusFilter !== 'all') {
            if (statusFilter === 'active') {
                result = result.filter(b => ['review', 'approved'].includes(b.status || ''));
            } else if (statusFilter === 'draft') {
                result = result.filter(b => !b.status || b.status === 'draft');
            } else if (statusFilter === 'completed') {
                result = result.filter(b => b.status === 'completed');
            }
        }

        // Sort
        return result.sort((a, b) => {
            if (sortBy === 'name') return a.name.localeCompare(b.name);
            if (sortBy === 'assets') return getBriefAssetCount(b) - getBriefAssetCount(a);
            return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(); // Default: Newest first
        });
    }, [briefs, searchQuery, statusFilter, sortBy]);

    // Stats
    const stats = {
        total: briefs.length,
        active: briefs.filter(b => ['review', 'approved'].includes(b.status || '')).length,
        drafts: briefs.filter(b => !b.status || b.status === 'draft').length,
        completed: briefs.filter(b => b.status === 'completed').length
    };

    return (
        <div className="min-h-screen bg-background text-foreground pb-32">
            <div className="container pt-8 space-y-8">

                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 border-b border-border pb-6">
                    <div className="space-y-1">
                        <h1 className="h1 tracking-tight">Campaign Briefings</h1>
                        <p className="text-lg text-muted-foreground font-normal">
                            Access and manage all your active and archived content campaigns.
                        </p>
                    </div>
                    <div className="flex items-center gap-4">
                        <Button variant="outline" onClick={handleDownloadCSV} disabled={briefs.length === 0}>
                            <Download className="mr-2 h-5 w-5" />
                            Export
                        </Button>
                        <Link href="/briefing/new">
                            <Button variant="cta">
                                <Plus className="w-5 h-5 mr-2" />
                                New Campaign
                            </Button>
                        </Link>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-12 gap-4">
                    {[
                        { label: 'All Briefs', value: stats.total, accent: 'text-[#172B4D]' },
                        { label: 'Drafts', value: stats.drafts, accent: 'text-[#42526E]' },
                        { label: 'Active', value: stats.active, accent: 'text-[#0052CC]' },
                        { label: 'Completed', value: stats.completed, accent: 'text-[#008DA6]' }
                    ].map((stat, i) => (
                        <Card key={i} className="col-span-12 md:col-span-6 lg:col-span-3 shadow-card border border-border radius-card overflow-hidden bg-white">
                            <CardContent className="p-5 space-y-1">
                                <p className="text-[11px] font-bold uppercase tracking-wide text-muted-foreground">{stat.label}</p>
                                <p className={cn("text-2xl font-bold", stat.accent)}>{stat.value}</p>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* Filtering Section */}
                <div className="flex flex-col lg:flex-row gap-8 items-center border-b border-[#EBEBEB] pb-6">
                    <div className="w-full lg:w-auto">
                        <Tabs value={statusFilter} onValueChange={setStatusFilter}>
                            <TabsList className="bg-transparent gap-6 h-auto p-0">
                                <TabsTrigger className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:text-foreground data-[state=active]:bg-transparent data-[state=active]:shadow-none font-medium text-muted-foreground hover:text-foreground transition-colors px-0 pb-3" value="all">All</TabsTrigger>
                                <TabsTrigger className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:text-foreground data-[state=active]:bg-transparent data-[state=active]:shadow-none font-medium text-muted-foreground hover:text-foreground transition-colors px-0 pb-3" value="draft">Drafts</TabsTrigger>
                                <TabsTrigger className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:text-foreground data-[state=active]:bg-transparent data-[state=active]:shadow-none font-medium text-muted-foreground hover:text-foreground transition-colors px-0 pb-3" value="active">Active</TabsTrigger>
                                <TabsTrigger className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:text-foreground data-[state=active]:bg-transparent data-[state=active]:shadow-none font-medium text-muted-foreground hover:text-foreground transition-colors px-0 pb-3" value="completed">Completed</TabsTrigger>
                            </TabsList>
                        </Tabs>
                    </div>

                    <div className="flex flex-1 flex-col md:flex-row items-center justify-end gap-3 w-full">
                        <div className="relative w-full md:w-auto max-w-sm">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Search campaigns"
                                className="h-9 pl-9 w-full md:w-[240px] radius-input border-border bg-background focus:ring-primary transition-all"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                        <Select value={sortBy} onValueChange={setSortBy}>
                            <SelectTrigger className="w-full md:w-[160px] h-9 radius-input border-border bg-background font-medium text-sm">
                                <div className="flex items-center gap-2">
                                    <Filter className="w-3.5 h-3.5 text-muted-foreground" />
                                    <SelectValue placeholder="Sort" />
                                </div>
                            </SelectTrigger>
                            <SelectContent className="radius-card shadow-card border-border">
                                <SelectItem value="updated" className="rounded-md">Last Updated</SelectItem>
                                <SelectItem value="name" className="rounded-md">Name (A-Z)</SelectItem>
                                <SelectItem value="assets" className="rounded-md">Asset Count</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                {/* Campaign Grid */}
                {/* Campaign List */}
                {isLoading ? (
                    <div className="flex h-64 items-center justify-center">
                        <Loader2 className="h-10 w-10 animate-spin text-primary opacity-50" />
                    </div>
                ) : filteredBriefs.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-32 rounded-3xl bg-muted/10 border border-dashed border-border space-y-4">
                        <div className="bg-card p-6 rounded-full shadow-sm border border-border">
                            <Search className="h-8 w-8 text-muted-foreground" />
                        </div>
                        <div className="space-y-1 text-center">
                            <h3 className="text-lg font-bold text-foreground">No campaigns found</h3>
                            <p className="text-sm text-muted-foreground max-w-sm">
                                We couldn&apos;t find any campaigns matching your criteria.
                            </p>
                        </div>
                        <Button variant="outline" className="rounded-full h-10 px-6 font-bold" onClick={() => { setSearchQuery(''); setStatusFilter('all'); }}>Clear Filters</Button>
                    </div>
                ) : (
                    <div className="rounded-xl border border-border overflow-hidden bg-card shadow-sm">
                        <table className="w-full text-left text-sm">
                            <thead className="bg-muted/50 border-b border-border">
                                <tr>
                                    <th className="h-10 px-4 font-semibold text-muted-foreground w-[40%]">Campaign Name</th>
                                    <th className="h-10 px-4 font-semibold text-muted-foreground w-[15%]">Brand</th>
                                    <th className="h-10 px-4 font-semibold text-muted-foreground w-[15%]">Status</th>
                                    <th className="h-10 px-4 font-semibold text-muted-foreground w-[10%] text-center">Assets</th>
                                    <th className="h-10 px-4 font-semibold text-muted-foreground w-[10%] text-right">Updated</th>
                                    <th className="h-10 px-4 font-semibold text-muted-foreground w-[10%] text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border">
                                {filteredBriefs.map((brief) => {
                                    const assetCount = getBriefAssetCount(brief);
                                    const updated = formatDistanceToNow(new Date(brief.updatedAt), { addSuffix: true });
                                    const status = brief.status || 'draft';
                                    const brand = brief.state.inputs.brand || 'Unbranded';

                                    return (
                                        <tr key={brief.id} className="group hover:bg-muted/30 transition-colors">
                                            <td className="p-4 align-middle">
                                                <Link href={`/briefing/${brief.id}`} className="block font-bold text-foreground hover:text-primary transition-colors truncate">
                                                    {brief.name}
                                                </Link>
                                            </td>
                                            <td className="p-4 align-middle">
                                                <Badge variant="outline" className="text-xs font-medium text-muted-foreground border-border bg-muted/20">
                                                    {brand}
                                                </Badge>
                                            </td>
                                            <td className="p-4 align-middle">
                                                <Badge variant={getStatusColor(status)} className="shadow-none font-semibold capitalize border-transparent">
                                                    {status.replace('_', ' ')}
                                                </Badge>
                                            </td>
                                            <td className="p-4 align-middle text-center">
                                                <span className="font-mono text-xs font-bold text-muted-foreground bg-muted/50 px-2 py-0.5 rounded-sm">
                                                    {assetCount}
                                                </span>
                                            </td>
                                            <td className="p-4 align-middle text-right">
                                                <span className="text-xs text-muted-foreground/70 whitespace-nowrap">
                                                    {updated}
                                                </span>
                                            </td>
                                            <td className="p-4 align-middle text-right">
                                                <div className="flex items-center justify-end gap-1 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-8 w-8 hover:bg-muted hover:text-foreground radius-btn"
                                                        onClick={(e) => { e.preventDefault(); e.stopPropagation(); handleDuplicate(brief.id); }}
                                                        title="Duplicate"
                                                    >
                                                        <Copy className="h-3.5 w-3.5 text-muted-foreground" />
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-8 w-8 hover:bg-destructive/10 hover:text-destructive radius-btn"
                                                        onClick={(e) => { e.preventDefault(); e.stopPropagation(); handleDelete(brief.id); }}
                                                        title="Delete"
                                                    >
                                                        <Trash2 className="h-3.5 w-3.5 text-muted-foreground" />
                                                    </Button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}
