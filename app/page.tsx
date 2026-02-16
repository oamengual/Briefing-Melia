'use client';

import * as React from 'react';
import { getBriefs, deleteBrief, duplicateBrief, getSettings } from '@/lib/storage';
import { Brief } from '@/lib/types';
import { DashboardHeader } from '@/components/dashboard/dashboard-header';
import { StatsGrid } from '@/components/dashboard/stats-grid';
import { DashboardControls } from '@/components/dashboard/dashboard-controls';
import { BriefGrid } from '@/components/dashboard/brief-grid';

export default function Dashboard() {
  const [briefs, setBriefs] = React.useState<Brief[]>([]);

  // Search & Filter State
  const [searchTerm, setSearchTerm] = React.useState('');
  const [selectedBrand, setSelectedBrand] = React.useState<string>('all');
  const [availableBrands, setAvailableBrands] = React.useState<string[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);

  // Initial Data Load
  React.useEffect(() => {
    // Dynamic import to avoid SSR issues with IDB if any, though regular import is fine as functions handle window check
    Promise.all([getBriefs(), getSettings()]).then(([data, settings]) => {
      setBriefs(data);
      setAvailableBrands(settings.defaultBrands || []); // Fallback to legacy defaultBrands if needed, or extract from briefs?
      setIsLoading(false);
    });
  }, []);

  // Filtering Logic
  const filteredBriefs = React.useMemo(() => {
    return briefs.filter(b => {
      const matchesSearch = b.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesBrand = selectedBrand === 'all' || b.state.inputs.brand === selectedBrand;
      return matchesSearch && matchesBrand;
    });
  }, [briefs, searchTerm, selectedBrand]);

  // Derived Stats Calculation
  const stats = React.useMemo(() => {
    let totalAssets = 0;
    let totalMarkets = 0;
    const channelCounts: Record<string, number> = {};

    filteredBriefs.forEach(brief => {
      const matrix = brief.state.matrix || {};
      const briefMarkets = Object.keys(matrix).length;
      totalMarkets += briefMarkets;

      Object.values(matrix).forEach(assets => {
        totalAssets += assets.length;
        assets.forEach(a => {
          // Simple heuristic to guess channel from ID if not explicit, but ID usually contains it
          // Or we can rely on placement definitions if we fetched them, but for stats this is approximate
          const type = a.includes('Social') || a.includes('instagram') || a.includes('tiktok') ? 'Social' : 'Display';
          channelCounts[type] = (channelCounts[type] || 0) + 1;
        });
      });
    });

    return {
      totalCampaigns: filteredBriefs.length,
      totalAssets,
      avgMarkets: filteredBriefs.length ? Math.round(totalMarkets / filteredBriefs.length) : 0,
      topChannel: Object.keys(channelCounts).sort((a, b) => channelCounts[b] - channelCounts[a])[0] || '-'
    };
  }, [filteredBriefs]);


  // Actions
  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (confirm('Delete item?')) {
      await deleteBrief(id);
      const updated = await getBriefs();
      setBriefs(updated);
    }
  };

  const handleDuplicate = async (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const newId = await duplicateBrief(id);
    if (newId) {
      const updated = await getBriefs();
      setBriefs(updated);
    }
  };

  const handleClearFilters = () => {
    setSearchTerm('');
    setSelectedBrand('all');
  };

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-background text-foreground pb-32">
      <div className="container pt-8 space-y-8">

        <DashboardHeader totalCampaigns={stats.totalCampaigns} />

        <StatsGrid stats={stats} />

        <DashboardControls
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          selectedBrand={selectedBrand}
          setSelectedBrand={setSelectedBrand}
          availableBrands={availableBrands}
        />

        <BriefGrid
          briefs={filteredBriefs}
          onDelete={handleDelete}
          onDuplicate={handleDuplicate}
          onClearFilters={handleClearFilters}
        />

      </div>
    </div>
  );
}
