'use client';

import * as React from 'react';
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    DragEndEvent
} from '@dnd-kit/core';
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    horizontalListSortingStrategy,
    useSortable
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { NamingConvention, NamingToken } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

import { Plus, X, GripVertical, Save, Trash2, RotateCcw } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';

// Available tokens for the user to add
// Available tokens for the user to add, categorized
const AVAILABLE_TOKENS: { type: NamingToken; label: string; category: string }[] = [
    { type: 'size', label: 'Size (300x250)', category: 'Specs' },
    { type: 'format', label: 'Format (img/vid)', category: 'Specs' },
    { type: 'content_type', label: 'Content Type', category: 'Specs' },
    { type: 'duration', label: 'Duration', category: 'Specs' },
    { type: 'version', label: 'Version (v1)', category: 'Specs' },

    { type: 'strategy', label: 'Strategy', category: 'Campaign' },
    { type: 'brand', label: 'Brand', category: 'Campaign' },
    { type: 'channel', label: 'Channel', category: 'Campaign' },
    { type: 'campaign_name', label: 'Campaign Name', category: 'Campaign' },
    { type: 'market_code', label: 'Market (US)', category: 'Campaign' },

    { type: 'year', label: 'Year (YYYY)', category: 'Date' },
    { type: 'month', label: 'Month (MM)', category: 'Date' },

    { type: 'language', label: 'Language (en)', category: 'Meta' },
    { type: 'agency', label: 'Agency', category: 'Meta' },
];

const TOKEN_CATEGORIES = ['Specs', 'Campaign', 'Date', 'Meta'];

const DEFAULT_STRUCTURE: NamingToken[] = [
    'size', 'format', 'strategy', 'year', 'month', 'brand', 'channel', 'campaign_name', 'market_code', 'language', 'agency', 'content_type', 'duration', 'version'
];

interface SortableItemProps {
    id: string;
    token: NamingToken;
    onRemove: () => void;
}

// Sortable Item
function SortableItem({ id, token, onRemove }: SortableItemProps) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging
    } = useSortable({ id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        zIndex: isDragging ? 50 : 'auto',
    };

    const tokenDef = AVAILABLE_TOKENS.find(t => t.type === token);

    // Determine color based on category
    const categoryColor = tokenDef?.category === 'Specs' ? 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-200 dark:border-blue-800' :
        tokenDef?.category === 'Campaign' ? 'bg-primary/5 text-primary border-primary/20 dark:bg-primary/20 dark:text-primary dark:border-primary/40' :
            tokenDef?.category === 'Date' ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-200 dark:border-emerald-800' :
                'bg-secondary-container text-foreground border-border';

    return (
        <div
            ref={setNodeRef}
            style={style}
            {...attributes}
            className={cn(
                "group relative flex items-center border rounded-full shadow-sm pl-3 pr-2 py-1.5 min-w-[120px] select-none transition-all",
                categoryColor,
                isDragging ? "opacity-75 scale-105 shadow-[0_6px_16px_rgba(0,0,0,0.12)] ring-2 ring-primary/50" : "hover:shadow-md"
            )}
        >
            <div {...listeners} className="cursor-grab text-muted-foreground hover:text-foreground mr-2 active:cursor-grabbing">
                <GripVertical className="w-4 h-4" />
            </div>
            <span className="text-xs font-bold whitespace-nowrap">{tokenDef?.label.split('(')[0]}</span>
            <button
                onClick={onRemove}
                className="ml-auto p-1 rounded-full hover:bg-black/5 dark:hover:bg-white/10 text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-all"
                aria-label="Remove token"
            >
                <X className="w-3.5 h-3.5" />
            </button>
        </div>
    );
}

interface NamingConventionEditorProps {
    activeConvention?: NamingConvention;
    templates: NamingConvention[];
    onSave: (active: NamingConvention, templates: NamingConvention[]) => void;
}

export function NamingConventionEditor({ activeConvention, templates, onSave }: NamingConventionEditorProps) {
    const [structure, setStructure] = React.useState<NamingToken[]>(
        activeConvention?.structure || DEFAULT_STRUCTURE
    );
    const [separator, setSeparator] = React.useState(activeConvention?.separator || '-');
    const [templateName, setTemplateName] = React.useState('');

    // Update internal state if activeConvention changes externally
    React.useEffect(() => {
        if (activeConvention?.structure) setStructure(activeConvention.structure);
        if (activeConvention?.separator) setSeparator(activeConvention.separator);
    }, [activeConvention]);

    // Dnd Sensors
    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
    );

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;
        if (over && active.id !== over.id) {
            const oldIndex = structure.indexOf(active.id as NamingToken);
            const newIndex = structure.indexOf(over.id as NamingToken);
            const newOrder = arrayMove(structure, oldIndex, newIndex);

            setStructure(newOrder);
            // Auto-save on drag
            onSave({ id: 'active', name: 'Custom', structure: newOrder, separator }, templates);
        }
    };

    const addToken = (token: NamingToken) => {
        const newStruct = [...structure, token];
        setStructure(newStruct);
        onSave({ id: 'active', name: 'Custom', structure: newStruct, separator }, templates);
    };

    const removeToken = (index: number) => {
        const newStruct = [...structure];
        newStruct.splice(index, 1);
        setStructure(newStruct);
        onSave({ id: 'active', name: 'Custom', structure: newStruct, separator }, templates);
    };

    const handleSaveTemplate = () => {
        if (!templateName.trim()) return;
        const newTemplate: NamingConvention = {
            id: crypto.randomUUID(),
            name: templateName,
            structure,
            separator
        };
        const updatedTemplates = [...templates, newTemplate];
        onSave({ ...newTemplate, id: 'active' }, updatedTemplates);
        setTemplateName('');
    };

    const loadTemplate = (tpl: NamingConvention) => {
        if (confirm(`Load template "${tpl.name}"? Unsaved changes will be lost.`)) {
            setStructure(tpl.structure);
            setSeparator(tpl.separator);
            onSave({ ...tpl, id: 'active' }, templates);
        }
    };

    const deleteTemplate = (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        if (confirm('Delete this template?')) {
            const upTpl = templates.filter(t => t.id !== id);
            // If deleting active, technically we stay on it but it's gone from list
            onSave({ id: 'active', name: 'Custom', structure, separator }, upTpl);
        }
    }

    const resetToDefault = () => {
        if (confirm('Reset to system default?')) {
            setStructure(DEFAULT_STRUCTURE);
            setSeparator('-');
            onSave({ id: 'active', name: 'Default', structure: DEFAULT_STRUCTURE, separator: '-' }, templates);
        }
    };



    return (
        <div className="space-y-8">
            {/* 1. Live Preview Section (Hero) */}
            <div className="bg-white rounded-3xl p-8 shadow-[0_6px_16px_rgba(0,0,0,0.12)] border-none flex flex-col items-center justify-center gap-6">
                <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-tight">Filename Preview</span>
                </div>

                <div className="font-mono text-base md:text-xl tracking-tight break-all bg-[#F7F7F7] px-8 py-6 rounded-2xl border border-[#DDDDDD] w-full text-center shadow-inner text-[#222222]">
                    {structure.map((t, i) => {
                        const tokenDef = AVAILABLE_TOKENS.find(def => def.type === t);
                        const value = (() => {
                            switch (t) {
                                case 'size': return '300x250';
                                case 'format': return 'html5';
                                case 'strategy': return 'prospecting';
                                case 'year': return '2025';
                                case 'month': return '01';
                                case 'brand': return 'Acme_Brand';
                                case 'channel': return 'Meta';
                                case 'campaign_name': return 'Summer_Sale';
                                case 'market_code': return 'US';
                                case 'language': return 'en';
                                case 'agency': return 'Creative_Agency';
                                case 'content_type': return 'video';
                                case 'duration': return '15s';
                                case 'version': return 'v1';
                                default: return t;
                            }
                        })();

                        // Subtle text coloring based on category for the preview
                        const colorClass = tokenDef?.category === 'Specs' ? 'text-blue-600 dark:text-blue-400' :
                            tokenDef?.category === 'Campaign' ? 'text-primary' :
                                tokenDef?.category === 'Date' ? 'text-emerald-600 dark:text-emerald-400' :
                                    'text-foreground';

                        return (
                            <React.Fragment key={`${t}-${i}`}>
                                <span className={colorClass}>{value}</span>
                                {i < structure.length - 1 && <span className="text-muted-foreground/30 mx-px font-bold">{separator}</span>}
                            </React.Fragment>
                        );
                    })}
                    <span className="text-muted-foreground/50">.{structure.includes('format') ? 'zip' : 'jpg'}</span>
                </div>

                <div className="flex items-center gap-3 mt-2">
                    <span className="text-xs text-muted-foreground font-semibold">Separator</span>
                    <div className="flex gap-1 p-1 bg-[#F7F7F7] rounded-full border border-[#DDDDDD]">
                        {['-', '.'].map((sep) => (
                            <button
                                key={sep}
                                onClick={() => {
                                    setSeparator(sep);
                                    onSave({ id: 'active', name: 'Custom', structure, separator: sep }, templates);
                                }}
                                className={cn(
                                    "w-8 h-8 flex items-center justify-center rounded-full text-sm font-bold transition-all",
                                    separator === sep
                                        ? "bg-primary text-primary-foreground shadow-shadow-2"
                                        : "text-muted-foreground hover:bg-black/5 dark:hover:bg-white/5"
                                )}
                            >
                                {sep}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* 2. Construction Zone */}
                <div className="lg:col-span-8 space-y-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="text-lg font-bold">Structure Builder</h3>
                            <p className="text-sm text-muted-foreground">Drag tokens to reorder your naming convention.</p>
                        </div>
                        <span className="text-[10px] bg-primary/10 text-primary px-2 py-1 rounded-md font-bold uppercase tracking-tight border border-primary/20">
                            {structure.length} Tokens Active
                        </span>
                    </div>
                    <div className="bg-[#F7F7F7] rounded-3xl border-2 border-dashed border-[#DDDDDD] min-h-[120px] p-8 transition-colors hover:border-[#222222]">
                        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                            <SortableContext items={structure} strategy={horizontalListSortingStrategy}>
                                <div className="flex flex-wrap gap-3">
                                    {structure.length === 0 ? (
                                        <div className="w-full text-center py-12 text-muted-foreground italic font-medium opacity-50">
                                            No tokens added. Drag or click tokens below to build your name.
                                        </div>
                                    ) : (
                                        structure.map((token, idx) => (
                                            <React.Fragment key={`${token}-${idx}`}>
                                                <SortableItem
                                                    id={token as string}
                                                    token={token}
                                                    onRemove={() => removeToken(idx)}
                                                />
                                                {idx < structure.length - 1 && (
                                                    <div className="flex items-center justify-center w-4 text-muted-foreground/30 font-bold select-none">
                                                        {separator}
                                                    </div>
                                                )}
                                            </React.Fragment>
                                        ))
                                    )}
                                </div>
                            </SortableContext>
                        </DndContext>
                    </div>
                </div>

                {/* 3. Available Tokens (Sidebar) */}
                <div className="lg:col-span-4 space-y-6">
                    <div>
                        <h3 className="text-sm font-bold text-foreground mb-4 uppercase tracking-tight opacity-70">Available Tokens</h3>
                        <div className="space-y-6">
                            {TOKEN_CATEGORIES.map((category) => (
                                <div key={category}>
                                    <h4 className="text-[10px] font-bold text-muted-foreground uppercase tracking-tight mb-2 opacity-50">{category}</h4>
                                    <div className="flex flex-wrap gap-2">
                                        {AVAILABLE_TOKENS.filter(t => t.category === category).map(t => (
                                            <button
                                                key={t.type}
                                                onClick={() => addToken(t.type)}
                                                className={cn(
                                                    "px-3 py-1.5 border rounded-full text-[10px] font-bold uppercase tracking-tight transition-all text-left flex items-center gap-1.5 shadow-sm hover:shadow-md hover:-translate-y-0.5 active:translate-y-0",
                                                    category === 'Specs' ? "bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100 dark:bg-blue-900/20 dark:border-blue-800 dark:text-blue-400 dark:hover:bg-blue-900/40" :
                                                        category === 'Campaign' ? "bg-primary/5 border-primary/20 text-primary hover:bg-primary/10" :
                                                            category === 'Date' ? "bg-emerald-50 border-emerald-200 text-emerald-700 hover:bg-emerald-100 dark:bg-emerald-900/20 dark:border-emerald-800 dark:text-emerald-400 dark:hover:bg-emerald-900/40" :
                                                                "bg-card border-border text-foreground hover:bg-secondary-container"
                                                )}
                                            >
                                                <Plus className="w-3 h-3 opacity-50" />
                                                {t.label.split('(')[0]}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* 4. Templates Section */}
            <div className="pt-8 border-t border-border mt-8">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-sm font-bold text-foreground uppercase tracking-tight opacity-70">Saved Presets</h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                    <Card className="p-6 border-none shadow-[0_6px_16px_rgba(0,0,0,0.12)] hover:scale-[1.02] cursor-pointer bg-[#F7F7F7] transition-all group rounded-3xl" onClick={resetToDefault}>
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-md bg-card border border-border flex items-center justify-center text-muted-foreground shadow-sm group-hover:text-primary transition-colors">
                                <RotateCcw className="w-4 h-4" />
                            </div>
                            <div>
                                <h4 className="text-sm font-bold">Restore Default</h4>
                                <p className="text-[10px] text-muted-foreground">System standard</p>
                            </div>
                        </div>
                    </Card>
                    {templates.map(tpl => (
                        <Card
                            key={tpl.id}
                            onClick={() => loadTemplate(tpl)}
                            className="p-6 border-none shadow-[0_6px_16px_rgba(0,0,0,0.12)] hover:scale-[1.02] cursor-pointer bg-white transition-all group relative rounded-3xl"
                        >
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-md bg-primary/5 flex items-center justify-center text-primary border border-primary/10 shadow-sm">
                                    <FileText className="w-4 h-4" />
                                </div>
                                <div>
                                    <h4 className="text-sm font-bold">{tpl.name}</h4>
                                    <p className="text-[10px] text-muted-foreground flex items-center gap-1">
                                        {tpl.structure.length} tokens
                                        <span className="w-1 h-1 rounded-full bg-border" />
                                        Sep: &quot;{tpl.separator}&quot;
                                    </p>
                                </div>
                            </div>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="absolute top-2 right-2 h-7 w-7 text-muted-foreground/30 hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    deleteTemplate(tpl.id, e); // Call the existing deleteTemplate function
                                }}
                            >
                                <Trash2 className="w-3.5 h-3.5" />
                            </Button>
                        </Card>
                    ))}
                </div>

                <div className="flex gap-3 max-w-md">
                    <Input
                        placeholder="Name your current setup..."
                        value={templateName}
                        onChange={(e) => setTemplateName(e.target.value)}
                        className="bg-background shadow-sm"
                    />
                    <Button onClick={handleSaveTemplate} disabled={!templateName.trim()} className="bg-slate-900 dark:bg-slate-800 text-white shadow-md hover:bg-slate-800 dark:hover:bg-slate-700">
                        <Save className="w-4 h-4 mr-2" />
                        Save Preset
                    </Button>
                </div>
            </div>
        </div>
    );
}

import { FileText } from 'lucide-react';
