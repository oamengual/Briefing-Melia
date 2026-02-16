'use client';

import * as React from 'react';
import { useEditorStore } from '@/lib/editor-store';
import { EditorLayer } from '@/lib/types';
import {
    Eye, Folder, ChevronRight, ChevronDown,
    Image as ImageIcon, Type, Link as LinkIcon,
    Trash2
} from 'lucide-react';
import { cn } from '@/lib/utils';
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    DragOverlay,
    DragEndEvent
} from '@dnd-kit/core';
import {
    SortableContext,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy,
    useSortable
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface FlatItem extends EditorLayer {
    depth: number;
    parentId?: string;
}

function SortableLayerItem({ item, selectedIds, expanded, onToggleExpand, onSelect, onToggleVisible, onRename, style: propStyle }: any) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging
    } = useSortable({ id: item.id, data: item });

    const [isEditing, setIsEditing] = React.useState(false);
    const [editValue, setEditValue] = React.useState(item.name);
    const inputRef = React.useRef<HTMLInputElement>(null);

    React.useEffect(() => {
        if (isEditing && inputRef.current) {
            inputRef.current.focus();
            inputRef.current.select();
        }
    }, [isEditing]);

    const handleDoubleClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        setIsEditing(true);
        setEditValue(item.name);
    };

    const handleSave = () => {
        setIsEditing(false);
        if (editValue.trim() && editValue.trim() !== item.name) {
            onRename(item.id, editValue.trim());
        } else {
            setEditValue(item.name);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        e.stopPropagation();
        if (e.key === 'Enter') handleSave();
        if (e.key === 'Escape') {
            setIsEditing(false);
            setEditValue(item.name);
        }
    };

    const style = {
        transform: CSS.Translate.toString(transform),
        transition,
        paddingLeft: `${item.depth * 12 + 4}px`,
        opacity: isDragging ? 0.5 : 1,
        ...propStyle
    };

    const isSelected = selectedIds.includes(item.id);
    const isGroup = item.type === 'group';

    const handleClick = (e: React.MouseEvent) => {
        const isMulti = e.metaKey || e.ctrlKey || e.shiftKey;
        onSelect(item.id, isMulti);
    };

    return (
        <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
            <div
                className={cn(
                    "flex items-center gap-1 cursor-pointer select-none text-[11px] h-6 border-b border-sidebar-border pr-1",
                    isSelected
                        ? "bg-sidebar-accent text-sidebar-accent-foreground"
                        : "bg-sidebar text-sidebar-foreground hover:bg-sidebar-accent/50"
                )}
                onClick={handleClick}
            >
                {/* Eye Visibility */}
                <div
                    onPointerDown={(e) => e.stopPropagation()}
                    onClick={(e) => { e.stopPropagation(); onToggleVisible(item.id, !item.visible); }}
                    className="w-6 h-full flex items-center justify-center cursor-pointer border-r border-sidebar-border text-muted-foreground hover:text-sidebar-foreground"
                >
                    {item.visible ? <Eye className="w-3 h-3" /> : <div className="w-1 h-1 rounded-full bg-muted-foreground" />}
                </div>

                {/* Indent Spacer handled by paddingLeft style */}

                {/* Expansion Arrow */}
                {isGroup ? (
                    <div
                        onPointerDown={(e) => e.stopPropagation()}
                        onClick={(e) => { e.stopPropagation(); onToggleExpand(item.id); }}
                        className="w-4 h-full flex items-center justify-center cursor-pointer"
                    >
                        {expanded ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
                    </div>
                ) : <div className="w-1" />}

                {/* Layer Icon */}
                <div className="opacity-70">
                    {isGroup ? (
                        <Folder className="w-3.5 h-3.5 text-muted-foreground" />
                    ) : (
                        item.type === 'image' ? (
                            <div className="w-5 h-5 bg-muted border border-border flex items-center justify-center overflow-hidden">
                                {item.src ? <img src={item.src} className="w-full h-full object-cover" /> : <ImageIcon className="w-3 h-3" />}
                            </div>
                        ) : <Type className="w-4 h-4 text-muted-foreground" />
                    )}
                </div>

                {/* Name */}
                <div className="flex-1 min-w-0 pl-1 font-normal tracking-wide" onDoubleClick={handleDoubleClick}>
                    {isEditing ? (
                        <input
                            ref={inputRef}
                            value={editValue}
                            onChange={(e) => setEditValue(e.target.value)}
                            onBlur={handleSave}
                            onKeyDown={handleKeyDown}
                            onClick={(e) => e.stopPropagation()}
                            className="w-full h-5 bg-background text-foreground text-[11px] px-1 rounded-sm border border-primary outline-none"
                        />
                    ) : (
                        <div className="truncate">{item.name}</div>
                    )}
                </div>

                {item.variableName && (
                    <LinkIcon className="w-3 h-3 text-primary" />
                )}

                {/* Lock (Visual placeholder) */}
                <div className="w-6 h-full flex items-center justify-center text-muted-foreground">
                    {/* <Lock className="w-2.5 h-2.5" /> */}
                </div>
            </div>
        </div>
    );
}

export function LayerPanel() {
    const { layers, selectedLayerIds, selectLayer, updateLayer, moveLayer, addLayer, removeLayer, feedData } = useEditorStore();
    const [expandedIds, setExpandedIds] = React.useState<Set<string>>(new Set());
    const [activeId, setActiveId] = React.useState<string | null>(null);

    const sensors = useSensors(
        useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
        useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
    );

    // Initial Expand Logic (unchanged)
    React.useEffect(() => {
        if (expandedIds.size === 0 && layers.length > 0) {
            const ids = new Set<string>();
            const visit = (nodes: EditorLayer[]) => {
                nodes.forEach(n => {
                    if (n.type === 'group') ids.add(n.id);
                    if (n.children) visit(n.children);
                });
            };
            visit(layers);
            setExpandedIds(ids);
        }
    }, [layers.length]);

    const [mounted, setMounted] = React.useState(false);

    React.useEffect(() => {
        setMounted(true);
    }, []);

    const handleDeleteSelected = () => {
        [...selectedLayerIds].forEach(id => removeLayer(id));
        if (selectedLayerIds.length > 0) useEditorStore.getState().deselectAll();
    };

    const items = React.useMemo(() => {
        const flat: FlatItem[] = [];
        const traverse = (nodes: EditorLayer[], depth: number, parentId?: string) => {
            [...nodes].reverse().forEach(node => {
                flat.push({ ...node, depth, parentId } as FlatItem);
                if (node.children && node.type === 'group' && expandedIds.has(node.id)) {
                    traverse(node.children, depth + 1, node.id);
                }
            });
        };
        traverse(layers, 0);
        return flat;
    }, [layers, expandedIds]);

    if (!mounted) return <div className="flex flex-col h-full bg-sidebar" />;

    const handleRename = (id: string, newName: string) => {
        const updates: any = { name: newName };
        if (feedData && feedData.headers) {
            const match = feedData.headers.find(h => h.toLowerCase() === newName.toLowerCase());
            if (match) {
                updates.variableName = match.toLowerCase();
            }
        }
        updateLayer(id, updates);
    };

    const handleCreateLayer = () => {
        addLayer({
            id: crypto.randomUUID(),
            type: 'image',
            name: `Layer ${layers.length + 1}`,
            visible: true,
            opacity: 1,
            width: 300,
            height: 200,
            left: 50,
            top: 50,
            src: '' // Empty/Placeholder
        });
    };

    const handleCreateGroup = () => {
        addLayer({
            id: crypto.randomUUID(),
            type: 'group',
            name: `Group ${layers.length + 1}`,
            visible: true,
            opacity: 1,
            width: 0,
            height: 0,
            left: 0,
            top: 0,
            children: []
        });
    };

    const handleDragStart = (event: any) => setActiveId(event.active.id);
    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;
        setActiveId(null);
        if (over && active.id !== over.id) {
            const overIndex = items.findIndex(i => i.id === over.id);
            const activeIndex = items.findIndex(i => i.id === active.id);
            if (overIndex === -1 || activeIndex === -1) return;

            const overItem = items[overIndex];

            // Prevent dropping parent into child
            const activeItem = items[activeIndex];
            if (activeItem.type === 'group') {
                let current: FlatItem | undefined = items[overIndex];
                let isDescendant = false;
                while (current && current.parentId) {
                    if (current.parentId === active.id) {
                        isDescendant = true;
                        break;
                    }
                    current = items.find(i => i.id === current!.parentId);
                }
                if (isDescendant) return;
            }

            const targetId = overItem.id;
            let position: 'before' | 'after' | 'inside' = activeIndex < overIndex ? 'before' : 'after';
            if (activeIndex < overIndex && overItem.type === 'group' && expandedIds.has(overItem.id)) {
                position = 'inside';
            }
            moveLayer(active.id as string, targetId, position);
        }
    };

    const handleToggleExpand = (id: string) => {
        const next = new Set(expandedIds);
        if (next.has(id)) next.delete(id);
        else next.add(id);
        setExpandedIds(next);
    };

    const selectedItem = items.find(i => selectedLayerIds.includes(i.id));
    const blendMode = selectedItem?.blendMode || 'normal';
    const opacity = Math.round((selectedItem?.opacity ?? 1) * 100);

    const handleBlendChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        selectedLayerIds.forEach(id => updateLayer(id, { blendMode: e.target.value }));
    };
    const handleOpacityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = Math.max(0, Math.min(100, parseInt(e.target.value) || 100)) / 100;
        selectedLayerIds.forEach(id => updateLayer(id, { opacity: val }));
    };

    return (
        <div className="flex flex-col h-full bg-sidebar">
            {/* Blending & Opacity */}
            <div className="h-8 border-b border-sidebar-border px-2 flex items-center gap-2 bg-sidebar-accent/50 text-[10px] shrink-0">
                <select
                    className="bg-sidebar-accent border border-sidebar-border rounded-sm px-1 h-5 text-sidebar-foreground outline-none w-24"
                    value={blendMode}
                    onChange={handleBlendChange}
                >
                    <option value="normal">Normal</option>
                    <option value="multiply">Multiply</option>
                    <option value="screen">Screen</option>
                    <option value="overlay">Overlay</option>
                    <option value="darken">Darken</option>
                    <option value="lighten">Lighten</option>
                    <option value="color-dodge">Color Dodge</option>
                    <option value="color-burn">Color Burn</option>
                    <option value="hard-light">Hard Light</option>
                    <option value="soft-light">Soft Light</option>
                    <option value="difference">Difference</option>
                    <option value="exclusion">Exclusion</option>
                    <option value="hue">Hue</option>
                    <option value="saturation">Saturation</option>
                    <option value="color">Color</option>
                    <option value="luminosity">Luminosity</option>
                </select>
                <span className="opacity-50">Op:</span>
                <input
                    type="number"
                    value={opacity}
                    onChange={handleOpacityChange}
                    className="bg-sidebar-accent border border-sidebar-border w-12 text-center h-5 rounded-sm outline-none focus:border-primary"
                />
                <span className="opacity-50">%</span>
            </div>

            {/* Layer List */}
            <div className="flex-1 overflow-y-auto">
                <DndContext
                    sensors={sensors}
                    collisionDetection={closestCenter}
                    onDragStart={handleDragStart}
                    onDragEnd={handleDragEnd}
                >
                    <SortableContext items={items.map(i => i.id)} strategy={verticalListSortingStrategy}>
                        {items.map(item => (
                            <SortableLayerItem
                                key={item.id}
                                item={item}
                                selectedIds={selectedLayerIds}
                                expanded={expandedIds.has(item.id)}
                                onToggleExpand={handleToggleExpand}
                                onSelect={selectLayer}
                                onToggleVisible={(id: string, v: boolean) => updateLayer(id, { visible: v })}
                                onRename={handleRename}
                            />
                        ))}
                    </SortableContext>
                    <DragOverlay>
                        {activeId ? (
                            <div className="p-1 px-2 bg-popover border border-border rounded-sm text-xs text-popover-foreground opacity-90">
                                Layer
                            </div>
                        ) : null}
                    </DragOverlay>
                </DndContext>
            </div>

            {/* Footer Actions */}
            <div className="h-7 border-t border-sidebar-border flex items-center justify-around px-2 bg-sidebar text-muted-foreground shrink-0">
                <div className="p-1 hover:bg-sidebar-accent rounded cursor-pointer transition-colors" title="Delete Layer" onClick={handleDeleteSelected}>
                    <Trash2 className="w-3.5 h-3.5 hover:text-destructive" />
                </div>
                <div className="p-1 hover:bg-sidebar-accent rounded cursor-pointer transition-colors" title="New Group" onClick={handleCreateGroup}>
                    <Folder className="w-3.5 h-3.5" />
                </div>
                <div className="p-1 hover:bg-sidebar-accent rounded cursor-pointer transition-colors" title="New Layer" onClick={handleCreateLayer}>
                    <Type className="w-3.5 h-3.5" />
                </div>
            </div>
        </div>
    );
}
