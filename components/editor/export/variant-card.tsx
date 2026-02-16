'use client';

import * as React from 'react';
import { Loader2, ZoomIn } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { PreviewCanvas } from './preview-canvas';
import { Template, VariantItem } from './types';

interface VariantCardProps {
    tpl: Template;
    variant: VariantItem;
    feedData: any;
    onPreview: () => void;
}

export function VariantCard({ tpl, variant, feedData, onPreview }: VariantCardProps) {
    const [isVisible, setIsVisible] = React.useState(false);
    const cardRef = React.useRef<HTMLDivElement>(null);

    React.useEffect(() => {
        const observer = new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting) {
                setIsVisible(true);
                observer.disconnect();
            }
        }, { rootMargin: '400px' });

        if (cardRef.current) {
            observer.observe(cardRef.current);
        }

        return () => observer.disconnect();
    }, []);

    const hasState = !!tpl.editorState;

    const displayedFilename = React.useMemo(() => {
        let name = variant.row.filenamePattern || variant.row.filename || '';
        // Replace size tokens with actual template size
        name = name.replace(/\{\{size\}\}/gi, tpl.size).replace(/\{size\}/gi, tpl.size);
        // We can't easily resolve {{channel}} or {{format}} here without the target placement context, 
        // which splits into multiple files on export. 
        // But for preview, we show the size-resolved name.
        return name;
    }, [variant.row, tpl.size]);

    return (
        <div
            ref={cardRef}
            className="bg-card rounded-2xl border border-border/40 overflow-hidden shadow-airbnb hover:shadow-airbnb-hover transition-all duration-300 flex flex-col group w-full ring-0 hover:ring-2 hover:ring-primary/20"
        >
            {/* Preview Container */}
            <div className="h-48 xl:h-56 w-full bg-[url('/checker.png')] bg-secondary-container/20 border-b border-border relative overflow-hidden group-hover:bg-secondary-container/40 transition-colors">

                {/* Click area for preview */}
                <div
                    className="absolute inset-0 flex items-center justify-center p-6 cursor-pointer"
                    onClick={onPreview}
                >
                    <div className="relative w-full h-full flex items-center justify-center pointer-events-none transition-transform duration-300 group-hover:scale-[1.02]">
                        {isVisible && hasState ? (
                            <PreviewCanvas
                                id={`preview-card-${variant.id}`}
                                state={tpl.editorState!}
                                feedData={feedData}
                                currentRow={variant.rowIdx}
                            />
                        ) : (
                            <div className="flex flex-col items-center justify-center gap-3 opacity-60 w-full h-full relative">
                                {tpl.preview && (
                                    // eslint-disable-next-line @next/next/no-img-element
                                    <img
                                        src={tpl.preview}
                                        className="max-h-full max-w-full object-contain blur-[2px] opacity-30 absolute inset-0 m-auto grayscale"
                                        alt=""
                                    />
                                )}
                                <div className="relative z-10 flex flex-col items-center gap-2">
                                    {!isVisible ? (
                                        <span className="text-[9px] font-bold text-muted-foreground/30 uppercase tracking-widest">Waiting...</span>
                                    ) : (
                                        <>
                                            <Loader2 className="w-5 h-5 animate-spin text-primary" />
                                            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-tight">Rendering...</span>
                                        </>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Hover Actions */}
                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                        size="icon"
                        variant="secondary"
                        className="h-8 w-8 rounded-full shadow-shadow-2 bg-card/90 hover:bg-card text-foreground transition-all"
                        onClick={onPreview}
                    >
                        <ZoomIn className="w-3.5 h-3.5" />
                    </Button>
                </div>
            </div>

            {/* Meta Data */}
            <div className="p-3 bg-card flex flex-col justify-end gap-2 flex-1 relative z-10">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-[9px] px-2 h-5 bg-secondary-container/50 border-border text-muted-foreground font-bold tracking-tight shadow-sm rounded-full">
                            {variant.row.market}
                        </Badge>
                        {variant.activePlacements && variant.activePlacements.length > 0 && (
                            <Badge variant="secondary" className="text-[9px] px-1.5 h-4 bg-primary/10 text-primary border-primary/20 hover:bg-primary/20 cursor-help font-bold tracking-tight shadow-sm" title={`Exports to: ${variant.activePlacements.join(', ')}`}>
                                {variant.activePlacements.length} FILE{variant.activePlacements.length !== 1 ? 'S' : ''}
                            </Badge>
                        )}
                    </div>
                    <span className="text-[9px] text-muted-foreground/50 font-mono tracking-tighter">
                        SIZE: {tpl.size}
                    </span>
                </div>
                <div
                    className="text-[11px] font-bold text-foreground truncate select-all tracking-tight leading-tight"
                    title={`Filename: ${displayedFilename}\nMatches: Match #${variant.rowIdx + 1}`}
                >
                    {displayedFilename}
                </div>
            </div>
        </div>
    );
}
