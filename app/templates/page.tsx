'use client';

import * as React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { getTemplates } from '@/lib/storage';
import { Template } from '@/lib/types';
import { LayoutTemplate, ArrowRight, Globe, Target, BarChart2, Share2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useBriefingStore } from '@/lib/store';
import { cn } from '@/lib/utils';

export default function TemplatesPage() {
    const router = useRouter();
    const setInputs = useBriefingStore(state => state.setInputs);
    const [templates, setTemplates] = React.useState<Template[]>([]);
    const [category, setCategory] = React.useState<string>('All');

    React.useEffect(() => {
        getTemplates().then(data => setTemplates(data));
    }, []);

    const categories = ['All', 'Market', 'Region', 'Channel', 'Objective'];

    const filteredTemplates = category === 'All'
        ? templates
        : templates.filter(t => t.category === category);

    const getIcon = (cat: string) => {
        switch (cat) {
            case 'Market': return <Globe className="w-4 h-4" />;
            case 'Region': return <Globe className="w-4 h-4 text-blue-500" />;
            case 'Objective': return <Target className="w-4 h-4 text-red-500" />;
            case 'Channel': return <Share2 className="w-4 h-4 text-green-500" />;
            default: return <LayoutTemplate className="w-4 h-4" />;
        }
    };

    const handleUseTemplate = (template: Template) => {
        // Reset store first to clear any old state
        useBriefingStore.getState().reset();

        // Load template state
        const { matrix, inputs, creative } = template.state;

        // 1. Matrix
        useBriefingStore.setState({ matrix: matrix });

        // 2. Inputs (merge with defaults)
        if (inputs) {
            setInputs(inputs);
        }

        // 3. Creative (optional)
        if (creative) {
            useBriefingStore.setState(state => ({ creative: { ...state.creative, ...creative } }));
        }

        // Navigate to builder
        router.push('/briefing/new');
    };

    return (
        <div className="min-h-screen bg-background text-foreground pb-32">
            <div className="container pt-8 space-y-8">

                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 border-b border-border pb-6">
                    <div className="space-y-1">
                        <h1 className="h1 tracking-tight">Campaign Templates</h1>
                        <p className="text-lg text-muted-foreground font-normal">
                            Accelerate your workflow with pre-configured placement mixes and strategies.
                        </p>
                    </div>
                </div>

                {/* Categories / Tabs - ADS Style */}
                <div className="border-b border-border pb-0">
                    <Tabs defaultValue="All" onValueChange={setCategory}>
                        <TabsList className="bg-transparent gap-6 h-auto p-0">
                            {categories.map(cat => (
                                <TabsTrigger
                                    key={cat}
                                    value={cat}
                                    className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:text-foreground data-[state=active]:bg-transparent data-[state=active]:shadow-none font-medium text-muted-foreground hover:text-foreground transition-colors px-1 pb-3 text-sm mb-[-2px]"
                                >
                                    {cat}
                                </TabsTrigger>
                            ))}
                        </TabsList>
                    </Tabs>
                </div>

                {/* Templates Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {filteredTemplates.map(template => (
                        <div key={template.id} className="group h-full">
                            <Card className="h-full flex flex-col hover:shadow-card transition-all duration-300 shadow-sm border border-border radius-card overflow-hidden bg-card">
                                <CardHeader className="p-5 pb-2 space-y-3">
                                    <div className="flex justify-between items-start">
                                        <Badge className="flex items-center gap-2 bg-muted text-foreground border-transparent shadow-none px-2 py-0.5 rounded-md font-bold text-[11px] uppercase tracking-wide">
                                            {getIcon(template.category)}
                                            {template.category}
                                        </Badge>
                                    </div>
                                    <h3 className="text-lg font-bold text-foreground group-hover:text-primary transition-colors leading-tight">
                                        {template.name}
                                    </h3>
                                    <p className="text-muted-foreground font-normal leading-relaxed text-sm line-clamp-2">
                                        {template.description}
                                    </p>
                                </CardHeader>
                                <CardContent className="flex-1 flex flex-col p-5 pt-4">
                                    <div className="flex flex-wrap gap-2 mb-6">
                                        {template.tags.map(tag => (
                                            <Badge key={tag} variant="secondary" className="bg-muted text-muted-foreground border-none shadow-none font-bold text-[10px] rounded-md px-2 py-0.5 uppercase tracking-wide">
                                                {tag}
                                            </Badge>
                                        ))}
                                    </div>

                                    <div className="mt-auto">
                                        <Button
                                            onClick={() => handleUseTemplate(template)}
                                            size="default"
                                            className="w-full radius-btn font-bold text-sm h-9 shadow-sm group-hover:bg-primary group-hover:text-primary-foreground transition-colors"
                                        >
                                            Use Template
                                            <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
