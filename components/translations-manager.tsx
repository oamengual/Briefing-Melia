'use client';

import * as React from 'react';
import { useBriefingStore } from '@/lib/store';
import { MARKETS } from '@/lib/constants';
import { useTranslation } from '@/hooks/use-translation';
import { CreativeInputs, LandingTexts, NewsletterTexts } from '@/lib/types';
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
    Wand2,
    CheckCircle2,
    Globe,
    Languages,
    Megaphone,
    LayoutTemplate,
    Mail
} from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export function TranslationsManager() {
    const { inputs, creative, translations, matrix, setTranslation, lockedFields } = useBriefingStore();
    const { t } = useTranslation();
    const masterLang = inputs.defaultLanguage || 'en';

    // --- Data Derivation ---
    const activeMarketSelectors = React.useMemo(() => {
        return Object.keys(matrix).filter(k => {
            if (!matrix[k] || matrix[k].length === 0) return false;
            let lookupSelector = k;
            if (k.startsWith('ZH')) lookupSelector = 'CN (China)';
            const m = MARKETS.find(m => m.selector === lookupSelector);
            if (m && inputs.regions && !inputs.regions.includes(m.region)) return false;
            return true;
        });
    }, [matrix, inputs.regions]);

    const targetLanguages = React.useMemo(() => {
        const codes = new Set(activeMarketSelectors.map(sel => {
            let lookupSelector = sel;
            if (sel.startsWith('ZH')) lookupSelector = 'CN (China)';
            const m = MARKETS.find(m => m.selector === lookupSelector);
            return m ? m.defaultLang : 'en';
        }));
        return Array.from(codes).filter(c => c !== masterLang);
    }, [activeMarketSelectors, masterLang]);

    const hiddenMarkets = React.useMemo(() => {
        return activeMarketSelectors
            .map(sel => MARKETS.find(m => m.selector === (sel.startsWith('ZH') ? 'CN (China)' : sel)))
            .filter(m => m && m.defaultLang === masterLang);
    }, [activeMarketSelectors, masterLang]);


    // --- State ---
    const [activeLang, setActiveLang] = React.useState<string | null>(null);
    const [isTranslating, setIsTranslating] = React.useState(false);

    // Auto-select first language
    React.useEffect(() => {
        if (!activeLang && targetLanguages.length > 0) {
            setActiveLang(targetLanguages[0]);
        }
    }, [targetLanguages, activeLang]);


    // --- Logic ---
    const calculateProgress = (lang: string) => {
        let total = 0;
        let completed = 0;

        const checkField = (val: string | undefined, trans: string | undefined) => {
            if (val) {
                total++;
                if (trans) completed++;
            }
        };

        // Banners
        const bannerFields: (keyof CreativeInputs)[] = ['claim', 'discount', 'cta', 'usp1', 'usp2', 'usp3'];
        bannerFields.forEach(f => checkField(creative[f] as string, translations[lang]?.[f] as string));

        // Landing
        if (creative.landing) {
            checkField(creative.landing.title, translations[lang]?.landing?.title);
            checkField(creative.landing.subtitle, translations[lang]?.landing?.subtitle);
            checkField(creative.landing.body, translations[lang]?.landing?.body);
            checkField(creative.landing.cta, translations[lang]?.landing?.cta);
        }

        // Newsletter
        if (creative.newsletter) {
            checkField(creative.newsletter.subject, translations[lang]?.newsletter?.subject);
            checkField(creative.newsletter.preview, translations[lang]?.newsletter?.preview);
            checkField(creative.newsletter.header, translations[lang]?.newsletter?.header);
            checkField(creative.newsletter.body, translations[lang]?.newsletter?.body);
            checkField(creative.newsletter.cta, translations[lang]?.newsletter?.cta);
        }

        return total === 0 ? 100 : Math.round((completed / total) * 100);
    };

    const handleAutoTranslate = async (targetLang?: string) => {
        setIsTranslating(true);
        const langsToProcess = targetLang ? [targetLang] : targetLanguages;

        try {
            const promises: Promise<void>[] = [];
            for (const lang of langsToProcess) {
                const newValues: Partial<CreativeInputs> = { ...translations[lang] };
                if (!newValues.landing) newValues.landing = {};
                if (!newValues.newsletter) newValues.newsletter = {};

                let hasUpdates = false;

                const translateField = async (text: string, path: string[]) => {
                    try {
                        const response = await fetch('/api/translate', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ text, targetLang: lang })
                        });
                        const data = await response.json();
                        if (data.translatedText) {
                            if (path.length === 1) {
                                (newValues as any)[path[0]] = data.translatedText;
                            } else if (path.length === 2) {
                                (newValues as any)[path[0]][path[1]] = data.translatedText;
                            }
                            hasUpdates = true;
                        }
                    } catch (e) { console.error(e) }
                };

                const p = (async () => {
                    // Banners
                    const bannerFields: (keyof CreativeInputs)[] = ['claim', 'discount', 'cta', 'usp1', 'usp2', 'usp3'];
                    await Promise.all(bannerFields.map(f => {
                        if (lockedFields.includes(f) || !creative[f] || newValues[f]) return;
                        return translateField(creative[f] as string, [f]);
                    }));

                    // Landing
                    if (creative.landing) {
                        const l = creative.landing;
                        if (l.title && !newValues.landing?.title) await translateField(l.title, ['landing', 'title']);
                        if (l.subtitle && !newValues.landing?.subtitle) await translateField(l.subtitle, ['landing', 'subtitle']);
                        if (l.body && !newValues.landing?.body) await translateField(l.body, ['landing', 'body']);
                        if (l.cta && !newValues.landing?.cta) await translateField(l.cta, ['landing', 'cta']);
                    }

                    // Newsletter
                    if (creative.newsletter) {
                        const n = creative.newsletter;
                        if (n.subject && !newValues.newsletter?.subject) await translateField(n.subject, ['newsletter', 'subject']);
                        if (n.preview && !newValues.newsletter?.preview) await translateField(n.preview, ['newsletter', 'preview']);
                        if (n.header && !newValues.newsletter?.header) await translateField(n.header, ['newsletter', 'header']);
                        if (n.body && !newValues.newsletter?.body) await translateField(n.body, ['newsletter', 'body']);
                        if (n.cta && !newValues.newsletter?.cta) await translateField(n.cta, ['newsletter', 'cta']);
                    }

                    if (hasUpdates) setTranslation(lang, newValues);
                })();
                promises.push(p);
            }
            await Promise.all(promises);
        } catch (e) {
            console.error("Translation error", e);
        } finally {
            setIsTranslating(false);
        }
    };


    // --- Render Helpers ---

    const renderFieldGroup = (
        title: string,
        icon: React.ReactNode,
        fields: { key: string, label: string, value?: string, transPath: string[] }[]
    ) => {
        const validFields = fields.filter(f => f.value);
        if (validFields.length === 0) return (
            <div className="flex flex-col items-center justify-center p-8 text-center text-muted-foreground bg-muted/5 rounded-xl border border-dashed border-border/50">
                <div className="opacity-20 mb-2">{icon}</div>
                <p className="text-xs font-medium">No content to translate in {title}</p>
            </div>
        );

        return (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
                {validFields.map((field) => {
                    const currentVal = field.transPath.length === 1
                        ? translations[activeLang!]?.[field.transPath[0] as keyof CreativeInputs]
                        : (translations[activeLang!] as any)?.[field.transPath[0]]?.[field.transPath[1]];

                    const isTranslated = !!currentVal;

                    return (
                        <div key={field.key} className="group">
                            <div className="flex items-center justify-between mb-2">
                                <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
                                    {field.label}
                                    {isTranslated ? (
                                        <CheckCircle2 className="w-3 h-3 text-green-500" />
                                    ) : (
                                        <div className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                                    )}
                                </label>
                            </div>

                            <div className="grid gap-3">
                                <div className="text-sm text-foreground/80 leading-relaxed px-3 py-2 bg-muted/30 p-2 rounded-md border border-transparent">
                                    {field.value}
                                </div>

                                <div className="relative">
                                    <div className="absolute left-3 top-3 text-muted-foreground/30">
                                        <CornerDownIcon />
                                    </div>
                                    <Textarea
                                        value={currentVal || ''}
                                        onChange={(e) => {
                                            const val = e.target.value;
                                            const newTrans = { ...translations[activeLang!] };
                                            if (field.transPath.length === 1) {
                                                (newTrans as any)[field.transPath[0]] = val;
                                            } else {
                                                if (!(newTrans as any)[field.transPath[0]]) (newTrans as any)[field.transPath[0]] = {};
                                                (newTrans as any)[field.transPath[0]][field.transPath[1]] = val;
                                            }
                                            setTranslation(activeLang!, newTrans);
                                        }}
                                        placeholder={`Translate to ${activeLang}...`}
                                        className={cn(
                                            "min-h-[80px] pl-8 resize-none transition-all",
                                            isTranslated
                                                ? "bg-muted/10 border-border focus:bg-background focus:border-primary"
                                                : "bg-amber-50/50 dark:bg-amber-950/10 border-amber-200/50 dark:border-amber-800/30 focus:border-amber-500"
                                        )}
                                    />
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        );
    };

    // --- Main Render ---

    if (targetLanguages.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center p-12 border-2 border-dashed border-border radius-card bg-muted/10 text-center">
                <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-4">
                    <CheckCircle2 className="w-6 h-6 text-muted-foreground" />
                </div>
                <h3 className="text-sm font-bold text-foreground">No Translations Needed</h3>
                <p className="text-sm text-muted-foreground mt-1 max-w-xs">
                    All active markets use the Master Language ({masterLang.toUpperCase()}).
                </p>
                {hiddenMarkets.length > 0 && (
                    <div className="mt-6 flex flex-wrap gap-2 justify-center">
                        {hiddenMarkets.map(m => (
                            <Badge key={m?.code} variant="secondary" className="radius-btn font-mono text-xs">
                                {m?.code}
                            </Badge>
                        ))}
                    </div>
                )}
            </div>
        );
    }

    return (
        <div className="flex flex-col h-[700px] border border-border radius-card bg-card overflow-hidden shadow-sm">
            {/* Toolbar */}
            <div className="h-16 shrink-0 border-b border-border flex items-center justify-between px-6 bg-card">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                        <Languages className="w-4 h-4" />
                    </div>
                    <div>
                        <h2 className="text-sm font-bold text-foreground">Localization Manager</h2>
                        <p className="text-[10px] text-muted-foreground font-medium">
                            {targetLanguages.length} languages required
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    {hiddenMarkets.length > 0 && (
                        <div className="flex items-center gap-2 mr-4 text-xs text-muted-foreground bg-muted/30 px-3 py-1 rounded-full">
                            <span className="font-semibold">{hiddenMarkets.length} markets use Master</span>
                        </div>
                    )}
                    <Button
                        size="sm"
                        variant="default"
                        disabled={isTranslating}
                        onClick={() => handleAutoTranslate()}
                        className="h-9 radius-btn text-xs font-bold shadow-sm"
                    >
                        <Wand2 className={cn("w-3.5 h-3.5 mr-2", isTranslating && "animate-spin")} />
                        Auto-Translate All
                    </Button>
                </div>
            </div>

            <div className="flex-1 flex overflow-hidden">
                {/* Sidebar */}
                <aside className="w-[280px] border-r border-border bg-muted/10 flex flex-col">
                    <ScrollArea className="flex-1">
                        <div className="p-4 space-y-3">
                            <div className="px-2 pb-2 text-[10px] font-bold uppercase tracking-wider text-muted-foreground opacity-70">
                                Language Queue
                            </div>
                            {targetLanguages.map(lang => {
                                const progress = calculateProgress(lang);
                                const isActive = lang === activeLang;
                                return (
                                    <button
                                        key={lang}
                                        onClick={() => setActiveLang(lang)}
                                        className={cn(
                                            "w-full flex flex-col gap-2 p-3 text-left radius-btn transition-all border",
                                            isActive
                                                ? "bg-background border-border shadow-sm ring-1 ring-primary/5"
                                                : "bg-transparent border-transparent hover:bg-muted/50 hover:border-border/50 text-muted-foreground"
                                        )}
                                    >
                                        <div className="flex items-center justify-between w-full">
                                            <div className="flex items-center gap-3">
                                                <span className={cn(
                                                    "w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold uppercase border transition-colors",
                                                    isActive ? "bg-primary text-primary-foreground border-primary" : "bg-muted border-border"
                                                )}>
                                                    {lang}
                                                </span>
                                                <span className="text-sm font-semibold capitalize">
                                                    {lang === 'es' ? 'Spanish' : lang === 'fr' ? 'French' : lang === 'de' ? 'German' : lang}
                                                </span>
                                            </div>
                                            <span className="text-xs font-mono font-medium text-muted-foreground">
                                                {progress}%
                                            </span>
                                        </div>
                                        {/* Progress Bar */}
                                        <div className="w-full h-1.5 bg-muted/50 rounded-full overflow-hidden">
                                            <div
                                                className={cn("h-full transition-all duration-500 rounded-full", progress === 100 ? "bg-green-500" : "bg-primary")}
                                                style={{ width: `${progress}%` }}
                                            />
                                        </div>
                                    </button>
                                );
                            })}
                        </div>
                    </ScrollArea>
                </aside>

                {/* Detail Area */}
                <main className="flex-1 flex flex-col bg-card min-w-0">
                    {activeLang ? (
                        <>
                            <div className="h-14 shrink-0 border-b border-border flex items-center justify-between px-8 bg-card/50 backdrop-blur-sm sticky top-0 z-10">
                                <div className="flex items-center gap-3">
                                    <Globe className="w-4 h-4 text-muted-foreground" />
                                    <span className="text-base font-bold text-foreground capitalize">
                                        Translating to {activeLang === 'es' ? 'Spanish' : activeLang === 'fr' ? 'French' : activeLang === 'de' ? 'German' : activeLang}
                                    </span>
                                </div>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-8 radius-btn text-xs hover:bg-muted font-medium"
                                    onClick={() => handleAutoTranslate(activeLang)}
                                    disabled={isTranslating}
                                >
                                    <Wand2 className="w-3.5 h-3.5 mr-2" />
                                    Translate Page
                                </Button>
                            </div>

                            <div className="flex-1 overflow-hidden">
                                <Tabs defaultValue="banners" className="h-full flex flex-col">
                                    <div className="px-8 pt-6 pb-2">
                                        <TabsList className="bg-muted/40 w-full justify-start h-10 p-1">
                                            <TabsTrigger value="banners" className="flex items-center gap-2 text-xs font-bold uppercase tracking-wide px-4">
                                                <Megaphone className="w-3.5 h-3.5" /> Banners
                                            </TabsTrigger>
                                            <TabsTrigger value="landing" className="flex items-center gap-2 text-xs font-bold uppercase tracking-wide px-4" disabled={!creative.landing}>
                                                <LayoutTemplate className="w-3.5 h-3.5" /> Landing Page
                                            </TabsTrigger>
                                            <TabsTrigger value="newsletter" className="flex items-center gap-2 text-xs font-bold uppercase tracking-wide px-4" disabled={!creative.newsletter}>
                                                <Mail className="w-3.5 h-3.5" /> Newsletter
                                            </TabsTrigger>
                                        </TabsList>
                                    </div>

                                    <ScrollArea className="flex-1">
                                        <div className="p-8 max-w-3xl mx-auto pb-20">
                                            <TabsContent value="banners" className="mt-0 focus-visible:outline-none">
                                                {renderFieldGroup("Banners & Ads", <Megaphone className="w-4 h-4 text-primary" />, [
                                                    { key: 'claim', label: 'Main Claim', value: creative.claim, transPath: ['claim'] },
                                                    { key: 'discount', label: 'Discount', value: creative.discount, transPath: ['discount'] },
                                                    { key: 'cta', label: 'Call to Action', value: creative.cta, transPath: ['cta'] },
                                                    { key: 'usp1', label: 'USP 1', value: creative.usp1, transPath: ['usp1'] },
                                                    { key: 'usp2', label: 'USP 2', value: creative.usp2, transPath: ['usp2'] },
                                                    { key: 'usp3', label: 'USP 3', value: creative.usp3, transPath: ['usp3'] },
                                                ])}
                                            </TabsContent>

                                            <TabsContent value="landing" className="mt-0 focus-visible:outline-none">
                                                {creative.landing && renderFieldGroup("Landing Page", <LayoutTemplate className="w-4 h-4 text-primary" />, [
                                                    { key: 'l_title', label: 'Title (H1)', value: creative.landing.title, transPath: ['landing', 'title'] },
                                                    { key: 'l_sub', label: 'Subtitle', value: creative.landing.subtitle, transPath: ['landing', 'subtitle'] },
                                                    { key: 'l_body', label: 'Body Copy', value: creative.landing.body, transPath: ['landing', 'body'] },
                                                    { key: 'l_cta', label: 'CTA', value: creative.landing.cta, transPath: ['landing', 'cta'] },
                                                ])}
                                            </TabsContent>

                                            <TabsContent value="newsletter" className="mt-0 focus-visible:outline-none">
                                                {creative.newsletter && renderFieldGroup("Newsletter", <Mail className="w-4 h-4 text-primary" />, [
                                                    { key: 'n_subj', label: 'Subject Line', value: creative.newsletter.subject, transPath: ['newsletter', 'subject'] },
                                                    { key: 'n_prev', label: 'Preview Text', value: creative.newsletter.preview, transPath: ['newsletter', 'preview'] },
                                                    { key: 'n_head', label: 'Headline', value: creative.newsletter.header, transPath: ['newsletter', 'header'] },
                                                    { key: 'n_body', label: 'Body Copy', value: creative.newsletter.body, transPath: ['newsletter', 'body'] },
                                                    { key: 'n_cta', label: 'Button CTA', value: creative.newsletter.cta, transPath: ['newsletter', 'cta'] },
                                                ])}
                                            </TabsContent>
                                        </div>
                                    </ScrollArea>
                                </Tabs>
                            </div>
                        </>
                    ) : (
                        <div className="flex-1 flex flex-col items-center justify-center text-muted-foreground animate-in zoom-in-95 duration-500">
                            <div className="w-16 h-16 bg-muted/20 rounded-full flex items-center justify-center mb-4">
                                <Languages className="w-8 h-8 text-muted-foreground/50" />
                            </div>
                            <p className="font-medium">Select a language to start translating</p>
                            <p className="text-xs max-w-xs text-center mt-2 opacity-60">
                                Use the auto-translate button to instantly fill all fields with AI translations.
                            </p>
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
}

function CornerDownIcon() {
    return (
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="9 10 4 15 9 20" />
            <path d="M20 4v7a4 4 0 0 1-4 4H4" />
        </svg>
    )
}
