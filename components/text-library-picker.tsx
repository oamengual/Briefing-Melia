'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { LibraryText, searchTexts, saveTextToLibrary, deleteTextFromLibrary } from '@/lib/text-library';
import { Search, Plus, Trash2, Clock, Check } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

interface TextLibraryPickerProps {
    category: string;
    onSelect: (text: string) => void;
    currentValue?: string;
    trigger?: React.ReactNode;
}

export function TextLibraryPicker({ category, onSelect, currentValue, trigger }: TextLibraryPickerProps) {
    const [open, setOpen] = React.useState(false);
    const [query, setQuery] = React.useState('');
    const [texts, setTexts] = React.useState<LibraryText[]>([]);
    const [loading, setLoading] = React.useState(false);

    const loadTexts = React.useCallback(async () => {
        setLoading(true);
        const results = await searchTexts(query, category);
        setTexts(results);
        setLoading(false);
    }, [query, category]);

    React.useEffect(() => {
        if (open) {
            loadTexts();
        }
    }, [open, loadTexts]);

    // Auto-save effect removed as per user request (saving will happen on briefing save/step change)
    // React.useEffect(() => { ... });

    const handleSaveCurrent = async () => {
        if (!currentValue?.trim()) return;
        await saveTextToLibrary(currentValue, category);
        toast.success("Text saved to library!");
        loadTexts();
    };

    const handleDelete = async (e: React.MouseEvent, id: string) => {
        e.stopPropagation();
        await deleteTextFromLibrary(id);
        toast.success("Text removed from library");
        loadTexts();
    };

    const handleSelect = (text: string) => {
        onSelect(text);
        setOpen(false);
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {trigger || (
                    <Button variant="ghost" size="icon" className="h-6 w-6 ml-2 text-muted-foreground hover:text-primary">
                        <Search className="h-3 w-3" />
                    </Button>
                )}
            </DialogTrigger>
            <DialogContent className="max-w-xl p-0 gap-0 overflow-hidden bg-white border border-[#EBEBEB] radius-card shadow-2xl">
                <DialogHeader className="p-4 border-b border-[#EBEBEB] bg-[#FAFAFA]">
                    <DialogTitle className="text-sm font-bold uppercase tracking-wider text-[#717171] flex items-center justify-between">
                        <span>Text Library: {category}</span>
                        <div className="flex items-center gap-2">
                            {/* Optional visual indicator that auto-save is active could go here */}
                            {currentValue && (
                                <Button size="sm" variant="outline" onClick={handleSaveCurrent} className="h-7 text-xs font-semibold radius-btn gap-2">
                                    <Plus className="h-3 w-3" />
                                    Save Now
                                </Button>
                            )}
                        </div>
                    </DialogTitle>
                </DialogHeader>

                <div className="p-4 border-b border-[#EBEBEB] bg-white">
                    <div className="relative">
                        <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search stored texts..."
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            className="pl-9 bg-[#FAFAFA] border-transparent focus:bg-white focus:border-primary radius-input transition-all"
                        />
                    </div>
                </div>

                <ScrollArea className="h-[400px] bg-[#FAFAFA]">
                    <div className="p-4 space-y-3">
                        {loading ? (
                            <div className="text-center py-8 text-muted-foreground text-sm">Loading...</div>
                        ) : texts.length === 0 ? (
                            <div className="text-center py-12 text-muted-foreground">
                                <p className="text-sm mb-2">No texts found for this category.</p>
                                <p className="text-xs opacity-70">Type in the field to auto-save, or click 'Save Now'.</p>
                            </div>
                        ) : (
                            texts.map((item) => (
                                <div
                                    key={item.id}
                                    onClick={() => handleSelect(item.content)}
                                    className="group relative bg-white border border-[#EBEBEB] p-4 rounded-xl hover:border-primary hover:shadow-sm cursor-pointer transition-all"
                                >
                                    <p className="text-sm text-[#222222] font-medium leading-relaxed pr-8">
                                        {item.content}
                                    </p>

                                    <div className="mt-3 flex items-center justify-between text-[10px] text-muted-foreground">
                                        <div className="flex items-center gap-2">
                                            <Badge variant="secondary" className="h-4 px-1.5 font-normal bg-muted text-muted-foreground">
                                                Used {item.usageCount}x
                                            </Badge>
                                            <span className="flex items-center gap-1">
                                                <Clock className="w-3 h-3" />
                                                {formatDistanceToNow(item.lastUsed, { addSuffix: true })}
                                            </span>
                                        </div>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-6 w-6 text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
                                            onClick={(e) => handleDelete(e, item.id)}
                                        >
                                            <Trash2 className="w-3 h-3" />
                                        </Button>
                                    </div>

                                    <div className="absolute right-4 top-4 text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                                        <Check className="w-4 h-4" />
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </ScrollArea>

                <div className="p-3 bg-muted/20 border-t border-[#EBEBEB] text-[10px] text-center text-muted-foreground">
                    Tip: Texts are auto-saved as you type.
                </div>
            </DialogContent>
        </Dialog>
    );
}
