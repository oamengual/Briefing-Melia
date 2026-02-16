'use client';

import * as React from 'react';
import { useEditorStore } from '@/lib/editor-store';
import { EditorLayer, EditorState } from '@/lib/types';
import { cn } from '@/lib/utils';
import { DndContext, useDraggable, useSensor, useSensors, PointerSensor, DragEndEvent, DragStartEvent } from '@dnd-kit/core';

interface LayerProps {
    layer: EditorLayer;
    isSelected: boolean;
    temporaryTransform?: { x: number; y: number };
    effectiveText?: string;
    effectiveSrc?: string;
    onLayerSelect: (id: string, multi: boolean) => void;
    dragRef?: (id: string, el: HTMLElement | null) => void;
}

const RenderedLayer = React.memo(function RenderedLayer({ layer, isSelected, temporaryTransform, effectiveText, effectiveSrc, onLayerSelect, dragRef }: LayerProps) {
    const { updateLayer } = useEditorStore();
    const layerRef = React.useRef<HTMLDivElement>(null);
    const [isEditing, setIsEditing] = React.useState(false);
    const textareaRef = React.useRef<HTMLTextAreaElement>(null);

    const displayText = effectiveText ?? layer.text;
    const displaySrc = effectiveSrc ?? layer.src;

    // Direct DOM access for high-performance dragging
    React.useLayoutEffect(() => {
        if (dragRef && layerRef.current) {
            dragRef(layer.id, layerRef.current);
            return () => dragRef(layer.id, null);
        }
    }, [dragRef, layer.id]);

    // MEASUREMENT & AUTO-FIT LOGIC (Shrink to Fit)
    React.useLayoutEffect(() => {
        if (!layerRef.current || layer.type !== 'text' || isEditing) return;

        const container = layerRef.current;
        const textElement = container.querySelector('.text-content') as HTMLElement;

        if (layer.autoSize || (layer.width === 0 && layer.height === 0)) {
            // Case 1: Auto-Size (Box adapts to Text) - Legacy/Init behavior
            const measure = () => {
                if (!container) return;
                const w = container.scrollWidth;
                const h = container.scrollHeight;
                // Only update if difference is significant to avoid loops
                if (Math.abs(layer.width - w) > 1 || Math.abs(layer.height - h) > 1) {
                    updateLayer(layer.id, { width: w, height: h });
                }
            };
            // Initial Measure
            measure();
            // Observer
            const observer = new ResizeObserver(measure);
            observer.observe(container);
            return () => observer.disconnect();
        } else if (layer.shrinkToFit) {
            // Case 2: Shrink to Fit (Text adapts to Box)
            if (!textElement) return;

            const maxSize = layer.fontSize || 24;
            textElement.style.fontSize = `${maxSize}px`;

            let current = maxSize;
            const min = 6;

            const isOverflowing = () => {
                // If Single Line (No Wrap), we only care about Width overflow
                if (layer.wrapText === false) {
                    return container.scrollWidth > container.clientWidth + 1;
                }
                // If Multi Line (Wrap), we care about Height mainly (width wraps), 
                // but also check width in case a single word is too long.
                return (container.scrollHeight > container.clientHeight + 1) || (container.scrollWidth > container.clientWidth + 1);
            };

            while (isOverflowing() && current > min) {
                current--;
                textElement.style.fontSize = `${current}px`;
            }
        } else {
            // Case 3: Fixed Box, Fixed Text Size
            if (textElement) {
                textElement.style.fontSize = layer.fontSize ? `${layer.fontSize}px` : '24px';
            }
        }
    }, [layer.id, layer.type, layer.autoSize, layer.shrinkToFit, layer.width, layer.height, layer.fontSize, layer.wrapText, displayText, isEditing, updateLayer]);

    // Editing Focus
    React.useEffect(() => {
        if (isEditing && textareaRef.current) {
            textareaRef.current.focus();
        }
    }, [isEditing]);

    const handleDoubleClick = (e: React.MouseEvent) => {
        if (layer.type === 'text') {
            e.stopPropagation();
            setIsEditing(true);
        }
    };

    const handleBlur = () => {
        setIsEditing(false);
        if (textareaRef.current) {
            updateLayer(layer.id, { text: textareaRef.current.value });
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        e.stopPropagation();
        if (e.key === 'Escape') setIsEditing(false);
    };

    // Drag Logic
    const { attributes, listeners, setNodeRef } = useDraggable({
        id: layer.id,
        data: { type: 'layer', layer }
    });

    // --- STYLES ---

    // 1. Position & Frame (Outer Box)
    const x = layer.left;
    const y = layer.top;

    const frameStyle: React.CSSProperties = {
        position: 'absolute',
        left: x,
        top: y,
        // Visual Override: If autoSize, let browser calculate width/height instantly.
        width: layer.autoSize ? 'max-content' : (layer.width > 0 ? layer.width : 'auto'),
        height: layer.autoSize ? 'min-content' : (layer.height > 0 ? layer.height : 'auto'),
        transform: layer.rotation ? `rotate(${layer.rotation}deg)` : undefined,
        transformOrigin: 'center center',
        opacity: layer.opacity,
        mixBlendMode: (layer.blendMode as React.CSSProperties['mixBlendMode']) || 'normal',
        // Visuals
        cursor: isEditing ? 'text' : 'move',
        outline: 'none',
        userSelect: 'none',
        display: 'flex', // Crucial for inner alignment
        flexDirection: 'column'
    };

    // 2. Vertical Alignment (Flex on Outer Box or Inner Wrapper)
    // We use the Frame as the flex container for Vertical Align.
    let justifyContent = 'flex-start'; // Default Top
    if (layer.verticalAlign === 'middle') justifyContent = 'center';
    if (layer.verticalAlign === 'bottom') justifyContent = 'flex-end';

    frameStyle.justifyContent = justifyContent;

    // 3. Text Style (Font & Horizontal Align)
    const textStyle: React.CSSProperties = {
        fontSize: layer.fontSize ? `${layer.fontSize}px` : undefined,
        fontFamily: layer.fontFamily,
        color: layer.color,
        letterSpacing: layer.letterSpacing ? `${layer.letterSpacing}em` : undefined,
        lineHeight: layer.lineHeight && layer.fontSize ? `${layer.lineHeight}px` : undefined,
        textAlign: layer.textAlign || 'left',
        // Handling Wrap / Single Line
        whiteSpace: layer.wrapText === false ? 'nowrap' : 'pre-wrap',
        overflowWrap: 'break-word', // Ensure long words break
        textTransform: layer.textTransform || 'none',

        // New Background Properties
        backgroundColor: layer.backgroundColor,
        paddingTop: layer.padding?.top,
        paddingRight: layer.padding?.right,
        paddingBottom: layer.padding?.bottom,
        paddingLeft: layer.padding?.left,
        borderTopLeftRadius: layer.borderRadius?.tl,
        borderTopRightRadius: layer.borderRadius?.tr,
        borderBottomRightRadius: layer.borderRadius?.br,
        borderBottomLeftRadius: layer.borderRadius?.bl,
    };

    return (
        <div
            ref={(node) => {
                layerRef.current = node;
                setNodeRef(node);
            }}
            style={frameStyle}
            {...listeners}
            {...attributes}
            data-rotation={layer.rotation || 0}
            onMouseDown={(e) => {
                listeners?.onMouseDown?.(e);
                // Do NOT stop propagation if we want DnD? Actually, we handle selection manually here.
                // If we stop prop, canvas might not know? 
                // But DndKit handles drag via listeners.
                e.stopPropagation();
                onLayerSelect(layer.id, e.metaKey || e.ctrlKey || e.shiftKey);
            }}
            onDoubleClick={handleDoubleClick}
            className={cn(
                "group",
                !layer.visible && "hidden",
                isSelected && !isEditing && "ring-1 ring-primary ring-offset-1"
            )}
        >
            {layer.type === 'text' ? (
                isEditing ? (
                    <textarea
                        ref={textareaRef}
                        defaultValue={layer.text}
                        onBlur={handleBlur}
                        onKeyDown={handleKeyDown}
                        onPointerDown={(e) => e.stopPropagation()}
                        className="w-full h-full resize-none outline-none bg-transparent overflow-hidden whitespace-pre-wrap p-0 m-0 border-none"
                        style={{
                            ...textStyle,
                            pointerEvents: 'auto',
                            height: '100%' // Fill box while editing
                        }}
                    />
                ) : (
                    <div className="text-content w-full" style={textStyle}>
                        {displayText}
                    </div>
                )
            ) : (displaySrc ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                    src={displaySrc}
                    alt={layer.name}
                    onLoad={(e) => {
                        const img = e.currentTarget;
                        if (layer.width === 0 || layer.height === 0) {
                            updateLayer(layer.id, { width: img.naturalWidth, height: img.naturalHeight });
                        }
                    }}
                    className="w-full h-full object-fill pointer-events-none select-none"
                    draggable={false}
                />
            ) : (
                <div className="w-full h-full bg-muted/50 flex items-center justify-center border border-dashed border-border">
                    <span className="text-[10px] text-muted-foreground">No Image</span>
                </div>
            ))}
        </div>
    );
}, (prev, next) => {
    // Custom comparison for performance
    // Only re-render if layer props changed OR selection state changed OR transient transform changed
    return (
        prev.layer === next.layer &&
        prev.isSelected === next.isSelected &&
        prev.temporaryTransform === next.temporaryTransform &&
        prev.effectiveText === next.effectiveText &&
        prev.effectiveSrc === next.effectiveSrc
    );
});

const TransformControl = React.memo(function TransformControl({ bounds, onResizeStart }: { bounds: { left: number, top: number, width: number, height: number, rotation?: number }, onDragEnd?: (e: DragEndEvent) => void, onResizeStart?: () => void }) {
    const { attributes, listeners, setNodeRef } = useDraggable({
        id: 'transform-control'
    });

    const [interaction, setInteraction] = React.useState<{ type: 'resize' | 'rotate', startX: number, startY: number, startBounds: { left: number, top: number, width: number, height: number, rotation?: number } } | null>(null);
    const { startTransform, applyTransform, endTransform, scale } = useEditorStore();

    const handlePointerDown = (e: React.PointerEvent, type: 'resize' | 'rotate') => {
        e.preventDefault();
        e.stopPropagation();
        const target = e.target as HTMLElement;
        target.setPointerCapture(e.pointerId);

        if (type === 'resize' && onResizeStart) {
            onResizeStart();
        }

        startTransform();

        setInteraction({
            type,
            startX: e.clientX,
            startY: e.clientY,
            startBounds: { ...bounds },
        });
    };

    const handlePointerMove = (e: React.PointerEvent, handle: string) => {
        if (!interaction) return;
        e.stopPropagation();

        const dx = (e.clientX - interaction.startX) / scale;
        const dy = (e.clientY - interaction.startY) / scale;

        if (interaction.type === 'resize') {
            const currentW = interaction.startBounds.width || 1;
            const currentH = interaction.startBounds.height || 1;
            const rotation = (interaction.startBounds.rotation || 0) * (Math.PI / 180);

            // Project mouse delta onto rotated axes
            // Local X axis: (cos, sin)
            // Local Y axis: (-sin, cos)
            const cos = Math.cos(rotation);
            const sin = Math.sin(rotation);

            const localDx = dx * cos + dy * sin;
            const localDy = -dx * sin + dy * cos;

            let dW = 0;
            let dH = 0;

            // Use local deltas
            if (handle.includes('e')) dW += localDx;
            if (handle.includes('w')) dW -= localDx;
            if (handle.includes('s')) dH += localDy;
            if (handle.includes('n')) dH -= localDy;

            // Limit minimum size to 1px to prevent flip
            if (currentW + dW < 1) dW = 1 - currentW;
            if (currentH + dH < 1) dH = 1 - currentH;

            const scaleX = (currentW + dW) / currentW;
            const scaleY = (currentH + dH) / currentH;

            // Origin Logic: 
            // In unrotated "local" space, Top-Left is (0,0).
            // We need to pass the "pivot point" in unrotated GLOBAL coordinates to applyTransform.
            // applyTransform default behavior is scaling around a global point `origin`.
            // FOR NOW, we'll assume `applyTransform` expects the unrotated corner.

            const originX = handle.includes('w') ? interaction.startBounds.left + interaction.startBounds.width : interaction.startBounds.left;
            const originY = handle.includes('n') ? interaction.startBounds.top + interaction.startBounds.height : interaction.startBounds.top;

            applyTransform('scale', { scaleX, scaleY }, { x: originX, y: originY });
        }

        if (interaction.type === 'rotate') {
            // Simple dial rotation: 1px = 0.5 degrees
            const sensitivity = 0.5;
            const angle = (e.clientX - interaction.startX) * sensitivity;
            applyTransform('rotate', angle);
        }
    };

    const handlePointerUp = (e: React.PointerEvent) => {
        setInteraction(null);
        e.currentTarget.releasePointerCapture(e.pointerId);
        endTransform();
    };

    const style: React.CSSProperties = {
        position: 'absolute',
        left: bounds.left,
        top: bounds.top,
        width: bounds.width,
        height: bounds.height,
        border: '1px solid var(--primary)',
        pointerEvents: 'none',
        zIndex: 9999,
        transform: bounds.rotation ? `rotate(${bounds.rotation}deg)` : undefined,
        transformOrigin: 'center center',
    };

    // Safe scale
    const safeScale = scale || 1;
    // Invert scale for handles so they stay constant size visually
    const handleTransform = `translate(-50%, -50%) scale(${1 / safeScale})`;

    // Main Box Style: 2px Primary Border with White Outline
    const boxStyle: React.CSSProperties = {
        ...style,
        border: '2px solid var(--primary)',
        boxShadow: '0 0 0 1px white', // White outline
    };

    // Handle Style: 12px, Primary Fill, White Border
    // Using inline style for critical properties to avoid collisions
    const handleBaseStyle: React.CSSProperties = {
        position: 'absolute',
        width: '12px',
        height: '12px',
        backgroundColor: 'var(--primary)', // Primary fill
        border: '2px solid white', // White border
        borderRadius: '2px', // Slight round
        boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
        zIndex: 50,
        pointerEvents: 'auto',
        cursor: 'pointer'
    };

    return (
        <div ref={setNodeRef} id="transform-control-box" data-rotation={bounds.rotation || 0} style={boxStyle} {...listeners} {...attributes}>
            {/* Corners */}
            <div
                className="cursor-nw-resize"
                style={{ ...handleBaseStyle, left: 0, top: 0, transform: handleTransform }}
                onPointerDown={(e) => handlePointerDown(e, 'resize')}
                onPointerMove={(e) => handlePointerMove(e, 'nw')}
                onPointerUp={handlePointerUp}
            />
            <div
                className="cursor-ne-resize"
                style={{ ...handleBaseStyle, left: '100%', top: 0, transform: handleTransform }}
                onPointerDown={(e) => handlePointerDown(e, 'resize')}
                onPointerMove={(e) => handlePointerMove(e, 'ne')}
                onPointerUp={handlePointerUp}
            />
            <div
                className="cursor-sw-resize"
                style={{ ...handleBaseStyle, left: 0, top: '100%', transform: handleTransform }}
                onPointerDown={(e) => handlePointerDown(e, 'resize')}
                onPointerMove={(e) => handlePointerMove(e, 'sw')}
                onPointerUp={handlePointerUp}
            />
            <div
                className="cursor-se-resize"
                style={{ ...handleBaseStyle, left: '100%', top: '100%', transform: handleTransform }}
                onPointerDown={(e) => handlePointerDown(e, 'resize')}
                onPointerMove={(e) => handlePointerMove(e, 'se')}
                onPointerUp={handlePointerUp}
            />

            {/* Sides */}
            <div
                className="cursor-n-resize"
                style={{ ...handleBaseStyle, left: '50%', top: 0, transform: handleTransform }}
                onPointerDown={(e) => handlePointerDown(e, 'resize')}
                onPointerMove={(e) => handlePointerMove(e, 'n')}
                onPointerUp={handlePointerUp}
            />
            <div
                className="cursor-s-resize"
                style={{ ...handleBaseStyle, left: '50%', top: '100%', transform: handleTransform }}
                onPointerDown={(e) => handlePointerDown(e, 'resize')}
                onPointerMove={(e) => handlePointerMove(e, 's')}
                onPointerUp={handlePointerUp}
            />
            <div
                className="cursor-w-resize"
                style={{ ...handleBaseStyle, left: 0, top: '50%', transform: handleTransform }}
                onPointerDown={(e) => handlePointerDown(e, 'resize')}
                onPointerMove={(e) => handlePointerMove(e, 'w')}
                onPointerUp={handlePointerUp}
            />
            <div
                className="cursor-e-resize"
                style={{ ...handleBaseStyle, left: '100%', top: '50%', transform: handleTransform }}
                onPointerDown={(e) => handlePointerDown(e, 'resize')}
                onPointerMove={(e) => handlePointerMove(e, 'e')}
                onPointerUp={handlePointerUp}
            />

            {/* Rotation Handle */}
            <div
                className="absolute -top-6 left-1/2 w-0.5 bg-primary pointer-events-none"
                style={{ transform: `translateX(-50%)`, height: 24 / safeScale, top: -24 / safeScale }}
            />
            <div
                className="cursor-grab"
                style={{
                    ...handleBaseStyle,
                    left: '50%',
                    top: -24 / safeScale,
                    transform: handleTransform,
                    borderRadius: '50%' // Round for rotation
                }}
                onPointerDown={(e) => handlePointerDown(e, 'rotate')}
                onPointerMove={(e) => handlePointerMove(e, 'rotate')}
                onPointerUp={handlePointerUp}
            />
        </div>
    );
});

const getSelectedLeafIds = (layers: EditorLayer[], selectedIds: string[]): string[] => {
    const ids: string[] = [];
    const traverse = (nodes: EditorLayer[]) => {
        nodes.forEach(node => {
            const isSelected = selectedIds.includes(node.id);
            if (isSelected) {
                if (node.children) {
                    const addAll = (n: EditorLayer) => {
                        if (n.children) n.children.forEach(addAll);
                        else ids.push(n.id);
                    };
                    addAll(node);
                } else {
                    ids.push(node.id);
                }
            } else if (node.children) {
                traverse(node.children);
            }
        });
    };
    traverse(layers);
    return ids;
};

const calculateBounds = (layers: EditorLayer[], ids: string[]): { left: number, top: number, width: number, height: number, rotation?: number } | null => {
    // Single selection with rotation support
    if (ids.length === 1) {
        let foundNode: EditorLayer | null = null;
        const find = (nodes: EditorLayer[]) => {
            for (const node of nodes) {
                if (node.id === ids[0]) {
                    foundNode = node;
                    return;
                }
                if (node.children) find(node.children);
            }
        };
        find(layers);
        if (foundNode) {
            const n = foundNode as EditorLayer;
            return { left: n.left, top: n.top, width: n.width, height: n.height, rotation: n.rotation || 0 };
        }
    }

    // Multi-selection (AABB)
    let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
    let found = false;

    // Helper to get AABB of rotated rect
    const getRotatedAABB = (l: number, t: number, w: number, h: number, r: number) => {
        if (!r) return { minX: l, minY: t, maxX: l + w, maxY: t + h };
        const rad = r * Math.PI / 180;
        const cx = l + w / 2;
        const cy = t + h / 2;
        const points = [
            { x: l, y: t },
            { x: l + w, y: t },
            { x: l + w, y: t + h },
            { x: l, y: t + h }
        ];
        // Rotate points around center
        const rotated = points.map(p => {
            const dx = p.x - cx;
            const dy = p.y - cy;
            return {
                x: cx + dx * Math.cos(rad) - dy * Math.sin(rad),
                y: cy + dx * Math.sin(rad) + dy * Math.cos(rad)
            };
        });
        const xs = rotated.map(p => p.x);
        const ys = rotated.map(p => p.y);
        return {
            minX: Math.min(...xs),
            maxX: Math.max(...xs),
            minY: Math.min(...ys),
            maxY: Math.max(...ys)
        };
    };

    const traverse = (nodes: EditorLayer[]) => {
        nodes.forEach(node => {
            if (ids.includes(node.id)) {
                if (node.type !== 'group') {
                    found = true;
                    // If single node inside multi-select logic (shouldn't happen if ids.length==1 branch taken)
                    // But if ids has many, some rotated:
                    const box = getRotatedAABB(node.left, node.top, node.width, node.height, node.rotation || 0);
                    minX = Math.min(minX, box.minX);
                    minY = Math.min(minY, box.minY);
                    maxX = Math.max(maxX, box.maxX);
                    maxY = Math.max(maxY, box.maxY);
                }
            }
            if (node.children) traverse(node.children);
        });
    };
    traverse(layers);

    if (!found) return null;
    return { left: minX, top: minY, width: maxX - minX, height: maxY - minY, rotation: 0 };
};

// --- SNAP & GUIDES LOGIC ---

interface SnapGuide {
    type: 'vertical' | 'horizontal';
    value: number;
}

const SNAP_THRESHOLD = 2; // Pixels (screen space, so we must account for scale? No, logical space is usually better for consistency)

// Helper: Get unique snap lines from layers and canvas
const getSnapLines = (layers: EditorLayer[], excludeIds: string[], canvasW: number, canvasH: number) => {
    const xLines: number[] = [0, canvasW / 2, canvasW];
    const yLines: number[] = [0, canvasH / 2, canvasH];

    const traverse = (nodes: EditorLayer[]) => {
        nodes.forEach(node => {
            // Exclude moving nodes and their children
            if (excludeIds.includes(node.id)) return;
            if (!node.visible) return;

            // Add Edges and Center
            xLines.push(node.left, node.left + node.width / 2, node.left + node.width);
            yLines.push(node.top, node.top + node.height / 2, node.top + node.height);

            if (node.children) traverse(node.children);
        });
    };
    traverse(layers);

    // Dedup and sort
    return {
        x: [...new Set(xLines)].sort((a, b) => a - b),
        y: [...new Set(yLines)].sort((a, b) => a - b)
    };
};

function SnapOverlay({ guides }: { guides: SnapGuide[] }) {
    if (guides.length === 0) return null;
    return (
        <div className="absolute inset-0 pointer-events-none z-[10000] overflow-visible">
            {guides.map((g, i) => (
                <div
                    key={i}
                    className="absolute bg-red-500/80 shadow-[0_0_2px_rgba(255,255,255,0.5)]"
                    style={{
                        left: g.type === 'vertical' ? g.value : 0,
                        top: g.type === 'horizontal' ? g.value : 0,
                        width: g.type === 'vertical' ? '1px' : '100%',
                        height: g.type === 'horizontal' ? '1px' : '100%',
                    }}
                />
            ))}
        </div>
    );
}


export function EditorCanvas() {
    const { width, height, layers, selectedLayerIds, selectLayer, updateLayer, scale, setScale, pan, setPan, moveSelectedLayers, feedData, currentFeedRow, activeTool } = useEditorStore();

    const [dragDelta, setDragDelta] = React.useState<{ x: number, y: number } | undefined>(undefined);
    const [guides, setGuides] = React.useState<SnapGuide[]>([]);

    const [isSpacePressed, setIsSpacePressed] = React.useState(false);
    const [isSnapDisabled, setIsSnapDisabled] = React.useState(false);
    const [isPanning, setIsPanning] = React.useState(false);
    const lastPan = React.useRef<{ x: number, y: number } | null>(null);

    const handleResizeStart = () => {
        selectedLayerIds.forEach(id => {
            // Only disable "Auto Box Size" when manually resizing.
            // KEEP "Shrink to Fit" enabled if it was active, so text scales dynamically.
            updateLayer(id, { autoSize: false });
        });
    };

    // Track Keys (Space & Modifier)
    React.useEffect(() => {
        const down = (e: KeyboardEvent) => {
            // Ignore inputs
            if ((e.target as HTMLElement).tagName === 'INPUT' || (e.target as HTMLElement).tagName === 'TEXTAREA') return;

            // Layer Movement
            if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
                if (useEditorStore.getState().selectedLayerIds.length > 0) {
                    e.preventDefault();
                    const step = e.shiftKey ? 10 : 1;
                    const dx = e.key === 'ArrowLeft' ? -step : (e.key === 'ArrowRight' ? step : 0);
                    const dy = e.key === 'ArrowUp' ? -step : (e.key === 'ArrowDown' ? step : 0);
                    moveSelectedLayers(dx, dy);
                }
            }

            if (e.code === 'Space' && !e.repeat) {
                e.preventDefault(); // Prevent scroll
                setIsSpacePressed(true);
            }
            if (e.key === 'Control' || e.key === 'Meta') {
                setIsSnapDisabled(true);
            }
        };
        const up = (e: KeyboardEvent) => {
            if (e.code === 'Space') setIsSpacePressed(false);
            if (e.key === 'Control' || e.key === 'Meta') setIsSnapDisabled(false);
        };
        window.addEventListener('keydown', down);
        window.addEventListener('keyup', up);
        return () => {
            window.removeEventListener('keydown', down);
            window.removeEventListener('keyup', up);
        };
    }, [moveSelectedLayers]);

    // Wheel Zoom
    const handleWheel = (e: React.WheelEvent) => {
        if (e.ctrlKey || e.metaKey) {
            // Zoom
            e.preventDefault();
            const delta = -e.deltaY;
            const factor = delta > 0 ? 1.1 : 0.9;
            const newScale = Math.min(Math.max(scale * factor, 0.1), 5);
            setScale(newScale);
        } else {
            // Pan
            // e.preventDefault();
            // Optional: Wheel pans? 
            // setPan({ x: pan.x - e.deltaX, y: pan.y - e.deltaY });
        }
    };

    // Pan Logic
    const handlePointerDown = (e: React.PointerEvent) => {
        if (activeTool === 'hand' || isSpacePressed) {
            setIsPanning(true);
            lastPan.current = { x: e.clientX, y: e.clientY };
            (e.target as HTMLElement).setPointerCapture(e.pointerId);
        }
    };

    const handlePointerMove = (e: React.PointerEvent) => {
        if (isPanning && lastPan.current) {
            const dx = e.clientX - lastPan.current.x;
            const dy = e.clientY - lastPan.current.y;
            setPan({ x: pan.x + dx, y: pan.y + dy });
            lastPan.current = { x: e.clientX, y: e.clientY };
        }
    };

    const handlePointerUp = (e: React.PointerEvent) => {
        if (isPanning) {
            setIsPanning(false);
            lastPan.current = null;
            (e.target as HTMLElement).releasePointerCapture(e.pointerId);
        }
    };

    // Cursor style
    const cursor = (activeTool === 'hand' || isSpacePressed) ? (isPanning ? 'grabbing' : 'grab') : 'default';

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 5,
            },
        })
    );

    // Prevent DnD activation if Panning
    const leafIds = getSelectedLeafIds(layers, selectedLayerIds);
    const selectionBounds = calculateBounds(layers, leafIds);

    // Optimized: Cache snap lines on DragStart
    const snapCacheRef = React.useRef<{ x: number[], y: number[] } | null>(null);

    // Direct DOM Refs for Dragging
    const layerRefsRef = React.useRef<Map<string, HTMLElement>>(new Map());
    const handleRegisterRef = React.useCallback((id: string, el: HTMLElement | null) => {
        if (el) layerRefsRef.current.set(id, el);
        else layerRefsRef.current.delete(id);
    }, []);

    const handleDragStart = (e: any) => {
        // Pre-calculate snap lines once at the start of the drag
        if (!isSnapDisabled) {
            snapCacheRef.current = getSnapLines(layers, selectedLayerIds, width, height);
        } else {
            snapCacheRef.current = null;
        }
    };

    const handleDragMove = (event: { delta: { x: number, y: number } }) => {
        // Handle drag for TransformControl or any Layer
        const rawDelta = { x: event.delta.x / scale, y: event.delta.y / scale };

        let finalDelta = rawDelta;
        let activeGuides: SnapGuide[] = [];

        // Snapping Logic
        if (selectionBounds && !isSnapDisabled) {
            const startX = selectionBounds.left;
            const startY = selectionBounds.top;
            const w = selectionBounds.width;
            const h = selectionBounds.height;

            const currentLeft = startX + rawDelta.x;
            const currentTop = startY + rawDelta.y;
            const currentRight = currentLeft + w;
            const currentBottom = currentTop + h;
            const currentCenterX = currentLeft + w / 2;
            const currentCenterY = currentTop + h / 2;

            // Use cached snap lines
            const snapLines = snapCacheRef.current || { x: [], y: [] };

            let snappedX = rawDelta.x;
            let snappedY = rawDelta.y;

            // Threshold in logical pixels (adjust if needed to be screen relative: 5 / scale)
            const threshold = SNAP_THRESHOLD / scale;

            // Check X Snaps
            let guidePos: number | null = null;
            let minDist = Infinity; // Helper for best X match

            snapLines.x.forEach(line => {
                let match = false;
                let dist = Infinity;

                if (Math.abs(currentLeft - line) < threshold) { dist = currentLeft - line; match = true; }
                else if (Math.abs(currentCenterX - line) < threshold) { dist = currentCenterX - line; match = true; }
                else if (Math.abs(currentRight - line) < threshold) { dist = currentRight - line; match = true; }

                if (match && Math.abs(dist) < Math.abs(minDist)) {
                    minDist = dist;
                    guidePos = line;
                }
            });

            if (guidePos !== null && Math.abs(minDist) < threshold) {
                snappedX -= minDist;
                activeGuides.push({ type: 'vertical', value: guidePos });
            }

            // Check Y Snaps
            let guidePosY: number | null = null;
            let minDistY = Infinity;

            snapLines.y.forEach(line => {
                let match = false;
                let dist = Infinity;

                if (Math.abs(currentTop - line) < threshold) { dist = currentTop - line; match = true; }
                else if (Math.abs(currentCenterY - line) < threshold) { dist = currentCenterY - line; match = true; }
                else if (Math.abs(currentBottom - line) < threshold) { dist = currentBottom - line; match = true; }

                if (match && Math.abs(dist) < Math.abs(minDistY)) {
                    minDistY = dist;
                    guidePosY = line;
                }
            });

            if (guidePosY !== null && Math.abs(minDistY) < threshold) {
                snappedY -= minDistY;
                activeGuides.push({ type: 'horizontal', value: guidePosY });
            }

            finalDelta = { x: snappedX, y: snappedY };
        }

        // --- DIRECT DOM MANIPULATION ---
        // Instead of setState, we update styles directly.
        // We only update state for Guides if they changed significantly (optimization could be added, but simple check is ok)

        // 1. Move Selected Layers
        leafIds.forEach(id => {
            const el = layerRefsRef.current.get(id);
            if (el) {
                // We need to respect rotation. 
                // The element style has `transform: rotate(...)` set by React.
                // We append translate.
                // BUT, parsing current transform is slow.
                // We know the rotation from the layer object.
                // Optimization: Store rotation in a map or dataset-attr?
                // Let's assume we can get it from the layer list. Lookup might be slow?
                // `leafIds` is available. We can find the layer in `layers`? No, expensive.
                // Let's just use `el.style.transform`.
                // Actually, if we just set `transform`, we overwrite rotation.
                // Better approach: Use `translate` property if supported? No, standard is transform.
                // We can set `top/left` via style? No, `left/top` are set by React. modifying them conflicts with React reconciliation later?
                // Yes, but for transient drag it's fine as long as we reset or React updates them on Drop.
                // Actually, modifying `left/top` causes Layout Thrashing. `transform` does not.
                // So we MUST use transform.

                // Hack: Read current rotation from dataset? or just assume 0 for now?
                // If we overwrite transform, we lose rotation during drag. That's bad.
                // Solution: We can stash the initial transform on DragStart?
                // Or: RenderedLayer can accept a ref for `transformControl` type logic?

                // Let's assume we read the rotation from the initial style string?
                // Or better: The `RenderedLayer` sets `rotate(...)`. We append `translate(...)`.
                // Wait, order matters. rotate(45deg) translate(10px,0) moves along rotated axis.
                // translate(10px,0) rotate(45deg) moves global x.
                // We want global translation. So Translate MUST come FIRST (or LAST depending on matrix math, usually Translate * Rotate * Scale).
                // CSS: transform functions are applied right to left? No, left to right.
                // `transform: translate(x,y) rotate(r)` -> Translate then Rotate?
                // If I want to move in global space, I should Translate THEN Rotate?
                // Actually, if I translate an element that is rotated, the axes are rotated.
                // So I need to use `left/top` for global movement?
                // BUT `left/top` triggers layout.

                // Alternative: Wrapper div?
                // Outer div: Position (Left/Top)
                // Inner div: Rotation.
                // Only drag the Outer div via Transform?
                // Current structure: Single div with `left, top, transform: rotate`.
                // If I change `left/top` directly on DOM, it triggers layout but it IS correct for global movement.
                // Is Layout Thrashing bad for 1-10 elements? At 60fps? 
                // Modern browsers are fast. `top/left` animation is often flagged as slow, but for an editor it might be acceptable if "only" few elements.
                // TRANSFORM is preferred.
                // To use transform for global movement on a rotated element:
                // We just add `transform: translate3d(dx, dy, 0) rotate(...)`.
                // Wait, if we use `matrix`, we can compose.

                // Let's stick to `transform`. We need to preserve rotation.
                // For this pass, I will set `transform: translate(...) rotate(...)`.
                // I need to retrieve rotation.
                const currentRot = el.dataset.rotation || '0';
                el.style.transform = `translate3d(${finalDelta.x}px, ${finalDelta.y}px, 0) rotate(${currentRot}deg)`;
            }
        });

        // 2. Move Transform Box (if exists)
        // TransformControl is an overlay. It also needs to move.
        // I can just find it by ID since I gave it one?
        // Or ref it.
        const transformControl = document.getElementById('transform-control-box'); // I need to add this ID
        if (transformControl) {
            // It has its own rotation logic.
            // But dragging moves the whole box.
            const currentRot = transformControl.dataset.rotation || '0';
            transformControl.style.transform = `translate3d(${finalDelta.x}px, ${finalDelta.y}px, 0) rotate(${currentRot}deg)`;
        }

        // 3. Update Guides (State)
        // Only update if changed to avoid renders
        // Simple distinct check
        setGuides(prev => {
            if (prev.length === 0 && activeGuides.length === 0) return prev;
            // Deep compare?
            const isSame = prev.length === activeGuides.length && prev.every((g, i) => g.type === activeGuides[i].type && Math.abs(g.value - activeGuides[i].value) < 0.1);
            return isSame ? prev : activeGuides;
        });

        // Keep track of delta for DragEnd
        deltaRef.current = finalDelta;
    };

    // Fix for Stale Closure in DragEnd: Use a Ref
    const deltaRef = React.useRef<{ x: number, y: number }>({ x: 0, y: 0 });
    // Remove the effect that synced dragDelta to deltaRef, we write to deltaRef directly now.

    const handleDragEndAction = () => {
        if (deltaRef.current.x !== 0 || deltaRef.current.y !== 0) {
            moveSelectedLayers(deltaRef.current.x, deltaRef.current.y);
        }

        // Reset DOM styles immediately before React re-renders with new positions
        leafIds.forEach(id => {
            const el = layerRefsRef.current.get(id);
            if (el) {
                el.style.transform = `rotate(${el.dataset.rotation || 0}deg)`;
            }
        });
        const transformControl = document.getElementById('transform-control-box');
        if (transformControl) {
            transformControl.style.transform = `rotate(${transformControl.dataset.rotation || 0}deg)`;
        }

        setDragDelta(undefined); // Should trigger re-render if we were using it? We removed it.
        setGuides([]);
        deltaRef.current = { x: 0, y: 0 };
    };

    return (
        <div
            className="relative w-full h-full bg-muted/20 overflow-hidden flex items-center justify-center select-none"
            onWheel={handleWheel}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            style={{ cursor, touchAction: 'none' }}
        >
            <div
                id="canvas-export-target"
                className="relative shadow-[0_0_40px_rgba(0,0,0,0.5)]"
                style={{
                    width: width,
                    height: height,
                    minWidth: width,
                    minHeight: height,
                    transform: `translate(${pan.x}px, ${pan.y}px) scale(${scale})`,
                    transformOrigin: 'center center',
                    // Dark Checkerboard standard
                    backgroundImage: `
                        linear-gradient(45deg, #333 25%, transparent 25%), 
                        linear-gradient(-45deg, #333 25%, transparent 25%), 
                        linear-gradient(45deg, transparent 75%, #333 75%), 
                        linear-gradient(-45deg, transparent 75%, #333 75%)
                    `,
                    backgroundColor: '#444',
                    backgroundSize: '20px 20px',
                    backgroundPosition: '0 0, 0 10px, 10px -10px, -10px 0px'
                }}
            >
                {!isPanning && (
                    <DndContext sensors={sensors} onDragStart={handleDragStart} onDragMove={handleDragMove} onDragEnd={handleDragEndAction}>
                        <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', overflow: 'hidden' }}>
                            <LayerRenderer
                                layers={layers}
                                leafIds={leafIds}
                                selectedIds={selectedLayerIds}
                                feedData={feedData}
                                currentRow={currentFeedRow}
                                onSelect={selectLayer}
                                dragRef={handleRegisterRef}
                            />
                            {/* GUIDES OVERLAY */}
                            <SnapOverlay guides={guides} />
                        </div>

                        {selectionBounds && (
                            <div className="transform-control absolute inset-0 pointer-events-none z-[9999]">
                                <TransformControl
                                    bounds={selectionBounds}
                                    onDragEnd={() => { }}
                                    onResizeStart={handleResizeStart}
                                />
                            </div>
                        )}
                    </DndContext>
                )}
                {/* Fallback Rendering while Panning for performance/stability */}
                {isPanning && (
                    <>
                        <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', overflow: 'hidden' }}>
                            <LayerRenderer
                                layers={layers}
                                leafIds={leafIds}
                                selectedIds={selectedLayerIds}
                                dragDelta={undefined}
                                feedData={feedData}
                                currentRow={currentFeedRow}
                                onSelect={() => { }}
                            />
                        </div>
                        {selectionBounds && (
                            <div className="transform-control absolute top-0 left-0 w-full h-full pointer-events-none">
                                <div style={{
                                    position: 'absolute',
                                    left: selectionBounds.left,
                                    top: selectionBounds.top,
                                    width: selectionBounds.width,
                                    height: selectionBounds.height,
                                    border: '1px solid var(--primary)',
                                    transform: selectionBounds.rotation ? `rotate(${selectionBounds.rotation}deg)` : undefined,
                                }} />
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}

interface LayerRendererProps {
    layers: EditorLayer[];
    leafIds?: string[];
    selectedIds: string[];
    dragDelta?: { x: number; y: number };
    feedData?: EditorState['feedData'];
    currentRow: number;
    onSelect: (id: string, multi: boolean) => void;
    dragRef?: (id: string, el: HTMLElement | null) => void;
}

// Helper to resolve content from row data

function resolveVariableContent(layer: EditorLayer, row: any): { text?: string, src?: string } | null {
    if (layer.type === 'text' && layer.text) {
        // 1. Explicit Token Replacement: {key}
        // Check if text contains {tokens}
        if (/\{([^}]+)\}/.test(layer.text)) {
            const resolved = layer.text.replace(/\{([^}]+)\}/g, (match, key) => {
                const foundKey = Object.keys(row).find(k => k.toLowerCase() === key.toLowerCase().trim());
                const val = foundKey ? row[foundKey] : undefined;
                return (val !== undefined && val !== null) ? String(val) : match;
            });
            // Only return if different
            if (resolved !== layer.text) return { text: resolved };
        }

        // 2. Implicit Name Match (Case Insensitive)
        // If content is just static default text, maybe the Layer Name matches a column?
        const foundKey = Object.keys(row).find(k => k.toLowerCase() === (layer.variableName || layer.name).toLowerCase().trim());
        const val = foundKey ? row[foundKey] : undefined;
        if (val !== undefined && val !== null) {
            return { text: String(val) };
        }
    } else if (layer.type === 'image') {
        // Image Name Match
        const foundKey = Object.keys(row).find(k => k.toLowerCase() === (layer.variableName || layer.name).toLowerCase().trim());
        const val = foundKey ? row[foundKey] : undefined;
        if (val && typeof val === 'string') {
            return { src: val };
        }
    }
    return null;
}

export function LayerRenderer({ layers, leafIds, selectedIds, dragDelta, feedData, currentRow, onSelect, dragRef }: LayerRendererProps) {
    return layers.map((layer: EditorLayer) => {
        if (!layer.visible) return null;

        if (layer.children) {
            return (
                <React.Fragment key={layer.id}>
                    <LayerRenderer
                        layers={layer.children}
                        leafIds={leafIds}
                        selectedIds={selectedIds}
                        dragDelta={dragDelta}
                        feedData={feedData}
                        currentRow={currentRow}
                        onSelect={onSelect}
                        dragRef={dragRef}
                    />
                </React.Fragment>
            );
        }

        const isEffectivelySelected = leafIds?.includes(layer.id);
        const isSelected = selectedIds.includes(layer.id);
        const temporaryTransform = isEffectivelySelected ? dragDelta : undefined;

        let effectiveText, effectiveSrc;
        if (feedData && feedData.rows.length > 0) {
            // Ensure currentRow is valid
            const safeRowIndex = Math.min(Math.max(0, currentRow), feedData.rows.length - 1);
            const row = feedData.rows[safeRowIndex];

            if (row) {
                const resolved = resolveVariableContent(layer, row);
                if (resolved) {
                    if (resolved.text) effectiveText = resolved.text;
                    if (resolved.src) effectiveSrc = resolved.src;
                }
            }
        }

        return (
            <RenderedLayer
                key={layer.id}
                layer={layer}
                isSelected={isSelected}
                temporaryTransform={temporaryTransform}
                effectiveText={effectiveText}
                effectiveSrc={effectiveSrc}
                onLayerSelect={onSelect}
                dragRef={dragRef}
            />
        )
    });
}
