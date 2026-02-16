'use client';

import * as React from 'react';
import { useBriefingStore } from '@/lib/store';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Copy, Calendar, Type, LayoutTemplate, Mail, Megaphone } from 'lucide-react';
import { cn } from '@/lib/utils';
import { TextLibraryPicker } from './text-library-picker';
import { CreativeInputs, LandingTexts, NewsletterTexts } from '@/lib/types';

export function ContentForm() {
    const { creative, setCreative, lockedFields, toggleFieldLock } = useBriefingStore();

    const handleCreativeChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setCreative({ [name]: value });
    };

    const handleLandingChange = (field: keyof LandingTexts, value: string) => {
        setCreative({
            landing: {
                ...creative.landing,
                [field]: value
            } as LandingTexts
        });
    };

    const handleNewsletterChange = (field: keyof NewsletterTexts, value: string) => {
        setCreative({
            newsletter: {
                ...creative.newsletter,
                [field]: value
            } as NewsletterTexts
        });
    };

    return (
        <div className="space-y-6 text-[#222222] animate-in fade-in duration-500">
            <Card className="shadow-card border border-border radius-card overflow-hidden bg-white">
                <CardHeader className="px-6 pt-6 pb-0">
                    <CardTitle className="text-lg font-bold text-foreground flex items-center gap-3">
                        <Type className="w-5 h-5 text-primary" />
                        Creative Content & Copy
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                    <Tabs defaultValue="banners" className="w-full">
                        <TabsList className="grid w-full grid-cols-3 mb-8 bg-muted/20 p-1 rounded-xl">
                            <TabsTrigger value="banners" className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm">
                                <Megaphone className="w-4 h-4 mr-2" />
                                Banners & Ads
                            </TabsTrigger>
                            <TabsTrigger value="landing" className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm">
                                <LayoutTemplate className="w-4 h-4 mr-2" />
                                Landing Page
                            </TabsTrigger>
                            <TabsTrigger value="newsletter" className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm">
                                <Mail className="w-4 h-4 mr-2" />
                                Newsletter
                            </TabsTrigger>
                        </TabsList>

                        {/* --- BANNERS TAB --- */}
                        <TabsContent value="banners" className="space-y-6 animate-in slide-in-from-left-4 duration-300">
                            {/* Main Claim */}
                            <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <Label className="text-xs font-semibold text-foreground ml-1">Main Claim / Headline</Label>
                                        <TextLibraryPicker
                                            category="claim"
                                            currentValue={creative.claim}
                                            onSelect={(val) => setCreative({ claim: val })}
                                        />
                                    </div>
                                    <label className="flex items-center gap-2 cursor-pointer group px-2 py-1 rounded-sm hover:bg-muted transition-all border border-transparent hover:border-border">
                                        <input
                                            type="checkbox"
                                            checked={lockedFields.includes('claim')}
                                            onChange={() => toggleFieldLock('claim')}
                                            className="w-3.5 h-3.5 rounded-sm border-input text-primary focus:ring-primary"
                                        />
                                        <span className="text-[10px] font-semibold text-muted-foreground group-hover:text-foreground transition-colors uppercase tracking-wider">
                                            Lock
                                        </span>
                                    </label>
                                </div>
                                <Input
                                    name="claim"
                                    value={creative.claim || ''}
                                    onChange={handleCreativeChange}
                                    placeholder="Enter main headline..."
                                    readOnly={lockedFields.includes('claim')}
                                    className={cn(
                                        "h-10 font-semibold text-base radius-input border-input focus:ring-primary px-3 shadow-sm transition-colors",
                                        lockedFields.includes('claim') && "bg-muted text-muted-foreground cursor-not-allowed border-dashed"
                                    )}
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Call to Action */}
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <Label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider ml-1">Call to Action</Label>
                                            <TextLibraryPicker
                                                category="cta"
                                                currentValue={creative.cta}
                                                onSelect={(val) => setCreative({ cta: val })}
                                            />
                                        </div>
                                        <label className="flex items-center gap-1.5 cursor-pointer group hover:bg-muted px-2 py-0.5 rounded-sm transition-colors">
                                            <input
                                                type="checkbox"
                                                checked={lockedFields.includes('cta')}
                                                onChange={() => toggleFieldLock('cta')}
                                                className="w-3 h-3 rounded-sm border-input text-primary focus:ring-primary"
                                            />
                                            <span className="text-[9px] font-bold text-muted-foreground group-hover:text-foreground">LOCK</span>
                                        </label>
                                    </div>
                                    <Input
                                        name="cta"
                                        value={creative.cta || ''}
                                        onChange={handleCreativeChange}
                                        readOnly={lockedFields.includes('cta')}
                                        placeholder="e.g. Shop Now"
                                        className={cn(
                                            "h-9 radius-input border-input font-medium text-sm focus:ring-primary",
                                            lockedFields.includes('cta') && "bg-muted text-muted-foreground cursor-not-allowed border-dashed"
                                        )}
                                    />
                                </div>

                                {/* Discount */}
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <Label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider ml-1">Discount / Offer</Label>
                                            <TextLibraryPicker
                                                category="discount"
                                                currentValue={creative.discount}
                                                onSelect={(val) => setCreative({ discount: val })}
                                            />
                                        </div>
                                        <label className="flex items-center gap-1.5 cursor-pointer group hover:bg-muted px-2 py-0.5 rounded-sm transition-colors">
                                            <input
                                                type="checkbox"
                                                checked={lockedFields.includes('discount')}
                                                onChange={() => toggleFieldLock('discount')}
                                                className="w-3 h-3 rounded-sm border-input text-primary focus:ring-primary"
                                            />
                                            <span className="text-[9px] font-bold text-muted-foreground group-hover:text-foreground">LOCK</span>
                                        </label>
                                    </div>
                                    <Input
                                        name="discount"
                                        value={creative.discount || ''}
                                        onChange={handleCreativeChange}
                                        readOnly={lockedFields.includes('discount')}
                                        placeholder="e.g. 50% OFF"
                                        className={cn(
                                            "h-9 radius-input border-input font-medium text-sm focus:ring-primary",
                                            lockedFields.includes('discount') && "bg-muted text-muted-foreground cursor-not-allowed border-dashed"
                                        )}
                                    />
                                </div>
                            </div>

                            <div className="h-[1px] bg-[#EBEBEB] w-full" />

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                {/* USP 1 */}
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <Label className="text-[10px] font-bold text-muted-foreground ml-1">USP 1</Label>
                                            <TextLibraryPicker
                                                category="usp"
                                                currentValue={creative.usp1}
                                                onSelect={(val) => setCreative({ usp1: val })}
                                            />
                                        </div>
                                        <label className="flex items-center gap-1.5 cursor-pointer group hover:bg-muted px-2 py-0.5 rounded-sm transition-colors">
                                            <input
                                                type="checkbox"
                                                checked={lockedFields.includes('usp1')}
                                                onChange={() => toggleFieldLock('usp1')}
                                                className="w-3 h-3 rounded-sm border-input text-primary focus:ring-primary"
                                            />
                                        </label>
                                    </div>
                                    <Input
                                        name="usp1"
                                        value={creative.usp1 || ''}
                                        onChange={handleCreativeChange}
                                        readOnly={lockedFields.includes('usp1')}
                                        placeholder="USP 1"
                                        className={cn(
                                            "h-9 radius-input border-input font-medium text-sm focus:ring-primary",
                                            lockedFields.includes('usp1') && "bg-muted text-muted-foreground cursor-not-allowed border-dashed"
                                        )}
                                    />
                                </div>

                                {/* USP 2 */}
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <Label className="text-[10px] font-bold text-muted-foreground ml-1">USP 2</Label>
                                            <TextLibraryPicker
                                                category="usp"
                                                currentValue={creative.usp2}
                                                onSelect={(val) => setCreative({ usp2: val })}
                                            />
                                        </div>
                                        <label className="flex items-center gap-1.5 cursor-pointer group hover:bg-muted px-2 py-0.5 rounded-sm transition-colors">
                                            <input
                                                type="checkbox"
                                                checked={lockedFields.includes('usp2')}
                                                onChange={() => toggleFieldLock('usp2')}
                                                className="w-3 h-3 rounded-sm border-input text-primary focus:ring-primary"
                                            />
                                        </label>
                                    </div>
                                    <Input
                                        name="usp2"
                                        value={creative.usp2 || ''}
                                        onChange={handleCreativeChange}
                                        readOnly={lockedFields.includes('usp2')}
                                        placeholder="USP 2"
                                        className={cn(
                                            "h-9 radius-input border-input font-medium text-sm focus:ring-primary",
                                            lockedFields.includes('usp2') && "bg-muted text-muted-foreground cursor-not-allowed border-dashed"
                                        )}
                                    />
                                </div>

                                {/* USP 3 */}
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <Label className="text-[10px] font-bold text-muted-foreground ml-1">USP 3</Label>
                                            <TextLibraryPicker
                                                category="usp"
                                                currentValue={creative.usp3}
                                                onSelect={(val) => setCreative({ usp3: val })}
                                            />
                                        </div>
                                        <label className="flex items-center gap-1.5 cursor-pointer group hover:bg-muted px-2 py-0.5 rounded-sm transition-colors">
                                            <input
                                                type="checkbox"
                                                checked={lockedFields.includes('usp3')}
                                                onChange={() => toggleFieldLock('usp3')}
                                                className="w-3 h-3 rounded-sm border-input text-primary focus:ring-primary"
                                            />
                                        </label>
                                    </div>
                                    <Input
                                        name="usp3"
                                        value={creative.usp3 || ''}
                                        onChange={handleCreativeChange}
                                        readOnly={lockedFields.includes('usp3')}
                                        placeholder="USP 3"
                                        className={cn(
                                            "h-9 radius-input border-input font-medium text-sm focus:ring-primary",
                                            lockedFields.includes('usp3') && "bg-muted text-muted-foreground cursor-not-allowed border-dashed"
                                        )}
                                    />
                                </div>
                            </div>
                        </TabsContent>

                        {/* --- LANDING TAB --- */}
                        <TabsContent value="landing" className="space-y-6 animate-in slide-in-from-right-4 duration-300">
                            <div className="grid gap-6">
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <Label className="text-sm font-semibold">Page Title (H1)</Label>
                                            <TextLibraryPicker
                                                category="landing_title"
                                                currentValue={creative.landing?.title}
                                                onSelect={(val) => handleLandingChange('title', val)}
                                            />
                                        </div>
                                    </div>
                                    <Input
                                        value={creative.landing?.title || ''}
                                        onChange={(e) => handleLandingChange('title', e.target.value)}
                                        placeholder="Landing Page Main Headline"
                                    />
                                </div>

                                <div className="space-y-3">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <Label className="text-sm font-semibold">Subtitle (H2)</Label>
                                            <TextLibraryPicker
                                                category="landing_subtitle"
                                                currentValue={creative.landing?.subtitle}
                                                onSelect={(val) => handleLandingChange('subtitle', val)}
                                            />
                                        </div>
                                    </div>
                                    <Input
                                        value={creative.landing?.subtitle || ''}
                                        onChange={(e) => handleLandingChange('subtitle', e.target.value)}
                                        placeholder="Supporting text..."
                                    />
                                </div>

                                <div className="space-y-3">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <Label className="text-sm font-semibold">Body Copy</Label>
                                            <TextLibraryPicker
                                                category="landing_body"
                                                currentValue={creative.landing?.body}
                                                onSelect={(val) => handleLandingChange('body', val)}
                                            />
                                        </div>
                                    </div>
                                    <Textarea
                                        value={creative.landing?.body || ''}
                                        onChange={(e) => handleLandingChange('body', e.target.value)}
                                        placeholder="Main content paragraph..."
                                        className="min-h-[120px]"
                                    />
                                </div>

                                <div className="space-y-3">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <Label className="text-sm font-semibold">Primary CTA</Label>
                                            <TextLibraryPicker
                                                category="landing_cta"
                                                currentValue={creative.landing?.cta}
                                                onSelect={(val) => handleLandingChange('cta', val)}
                                            />
                                        </div>
                                    </div>
                                    <Input
                                        value={creative.landing?.cta || ''}
                                        onChange={(e) => handleLandingChange('cta', e.target.value)}
                                        placeholder="Button text..."
                                    />
                                </div>
                            </div>
                        </TabsContent>

                        {/* --- NEWSLETTER TAB --- */}
                        <TabsContent value="newsletter" className="space-y-6 animate-in slide-in-from-right-4 duration-300">
                            <div className="grid gap-6">
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <Label className="text-sm font-semibold">Subject Line</Label>
                                            <TextLibraryPicker
                                                category="newsletter_subject"
                                                currentValue={creative.newsletter?.subject}
                                                onSelect={(val) => handleNewsletterChange('subject', val)}
                                            />
                                        </div>
                                    </div>
                                    <Input
                                        value={creative.newsletter?.subject || ''}
                                        onChange={(e) => handleNewsletterChange('subject', e.target.value)}
                                        placeholder="Email subject..."
                                    />
                                </div>

                                <div className="space-y-3">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <Label className="text-sm font-semibold">Preview Text (Preheader)</Label>
                                            <TextLibraryPicker
                                                category="newsletter_preview"
                                                currentValue={creative.newsletter?.preview}
                                                onSelect={(val) => handleNewsletterChange('preview', val)}
                                            />
                                        </div>
                                    </div>
                                    <Input
                                        value={creative.newsletter?.preview || ''}
                                        onChange={(e) => handleNewsletterChange('preview', e.target.value)}
                                        placeholder="Short preview text shown in inbox..."
                                    />
                                </div>

                                <div className="space-y-3">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <Label className="text-sm font-semibold">Headline</Label>
                                            <TextLibraryPicker
                                                category="newsletter_header"
                                                currentValue={creative.newsletter?.header}
                                                onSelect={(val) => handleNewsletterChange('header', val)}
                                            />
                                        </div>
                                    </div>
                                    <Input
                                        value={creative.newsletter?.header || ''}
                                        onChange={(e) => handleNewsletterChange('header', e.target.value)}
                                        placeholder="Main email headline..."
                                    />
                                </div>

                                <div className="space-y-3">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <Label className="text-sm font-semibold">Body Copy</Label>
                                            <TextLibraryPicker
                                                category="newsletter_body"
                                                currentValue={creative.newsletter?.body}
                                                onSelect={(val) => handleNewsletterChange('body', val)}
                                            />
                                        </div>
                                    </div>
                                    <Textarea
                                        value={creative.newsletter?.body || ''}
                                        onChange={(e) => handleNewsletterChange('body', e.target.value)}
                                        placeholder="Email body content..."
                                        className="min-h-[120px]"
                                    />
                                </div>

                                <div className="space-y-3">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <Label className="text-sm font-semibold">Button CTA</Label>
                                            <TextLibraryPicker
                                                category="newsletter_cta"
                                                currentValue={creative.newsletter?.cta}
                                                onSelect={(val) => handleNewsletterChange('cta', val)}
                                            />
                                        </div>
                                    </div>
                                    <Input
                                        value={creative.newsletter?.cta || ''}
                                        onChange={(e) => handleNewsletterChange('cta', e.target.value)}
                                        placeholder="Button text..."
                                    />
                                </div>
                            </div>
                        </TabsContent>
                    </Tabs>
                </CardContent>
            </Card>
        </div >
    );
}
