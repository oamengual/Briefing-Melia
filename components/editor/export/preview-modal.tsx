'use client';

import * as React from 'react';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { PreviewCanvas } from './preview-canvas';
import { Template, VariantItem } from './types';

interface PreviewModalProps {
    isOpen: boolean;
    activeVariant: { tpl: Template, variant: VariantItem } | undefined;
    onClose: () => void;
    onNext: () => void;
    onPrev: () => void;
    feedData: any;
}

export function PreviewModal({
    isOpen,
    activeVariant,
    onClose,
    onNext,
    onPrev,
    feedData
}: PreviewModalProps) {

    // Keyboard Navigation
    React.useEffect(() => {
        if (!isOpen) return;

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'ArrowRight') onNext();
            if (e.key === 'ArrowLeft') onPrev();
            if (e.key === 'Escape') onClose();
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isOpen, onNext, onPrev, onClose]);

    if (!activeVariant) return null;

    const { tpl, variant } = activeVariant;

    return (
        <Dialog open={isOpen} onOpenChange={(o) => !o && onClose()}>
            <DialogContent className="max-w-[100vw] w-full h-[100vh] p-0 overflow-hidden flex flex-col border-none shadow-none rounded-none outline-none">
                <div className="bg-background/95 backdrop-blur-md border-b border-border flex justify-between items-center shrink-0 h-16 px-6 shadow-sm">
                    <div className="flex items-center gap-6">
                        <div>
                            <DialogTitle className="text-sm font-bold tracking-tight text-foreground">{variant.row.filename}</DialogTitle>
                            <p className="text-[10px] font-bold text-muted-foreground mt-0.5 font-mono uppercase tracking-tighter">
                                {tpl.size} • {variant.row.market}
                            </p>
                        </div>
                        {/* Navigation Controls in Header */}
                        <div className="flex items-center bg-secondary-container/50 rounded-lg p-1 border border-border ml-2 shadow-inner">
                            <Button size="sm" variant="ghost" className="h-8 w-8 p-0 hover:bg-card hover:text-primary rounded-md transition-all shadow-sm" onClick={onPrev}>
                                <ChevronLeft className="w-4 h-4" />
                            </Button>
                            <div className="w-[1px] h-4 bg-border mx-1"></div>
                            <Button size="sm" variant="ghost" className="h-8 w-8 p-0 hover:bg-card hover:text-primary rounded-md transition-all shadow-sm" onClick={onNext}>
                                <ChevronRight className="w-4 h-4" />
                            </Button>
                        </div>
                    </div>

                    <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground hover:bg-secondary-container transition-colors" onClick={onClose}>
                        <X className="w-5 h-5" />
                    </Button>
                </div>

                {/* Main Preview Area */}
                <div className="flex-1 flex items-center justify-center p-8 bg-[url('/checker.png')] overflow-hidden relative group">
                    {/* On Canvas Navigation Hover Targets */}
                    <div className="absolute left-0 top-0 bottom-0 w-24 z-10 hover:bg-gradient-to-r from-black/5 to-transparent flex items-center justify-start pl-6 cursor-pointer opacity-0 hover:opacity-100 transition-all group/nav" onClick={onPrev}>
                        <div className="w-12 h-12 bg-card/90 backdrop-blur rounded-full shadow-shadow-4 flex items-center justify-center text-foreground border border-border group-hover/nav:scale-110 transition-transform">
                            <ChevronLeft className="w-6 h-6" />
                        </div>
                    </div>
                    <div className="absolute right-0 top-0 bottom-0 w-24 z-10 hover:bg-gradient-to-l from-black/5 to-transparent flex items-center justify-end pr-6 cursor-pointer opacity-0 hover:opacity-100 transition-all group/nav" onClick={onNext}>
                        <div className="w-12 h-12 bg-card/90 backdrop-blur rounded-full shadow-shadow-4 flex items-center justify-center text-foreground border border-border group-hover/nav:scale-110 transition-transform">
                            <ChevronRight className="w-6 h-6" />
                        </div>
                    </div>

                    {tpl.editorState && (
                        /* Constrain container to 100% of available space */
                        <div className="relative w-full h-full flex items-center justify-center pointer-events-none">
                            <PreviewCanvas
                                id={`preview-modal-global`}
                                state={tpl.editorState}
                                feedData={feedData}
                                currentRow={variant.rowIdx}
                            />
                        </div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}
