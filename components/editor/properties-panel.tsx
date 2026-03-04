'use client';

import * as React from 'react';
import { useEditorStore } from '@/lib/editor-store';
import { EditorLayer, Brand, BrandAsset } from '@/lib/types';
import {
    AlignLeft, AlignCenter, AlignRight, AlignJustify,
    AlignStartVertical, AlignCenterVertical, AlignEndVertical,
    Type, Image as ImageIcon, Box, Move, RotateCw, Hash,
    WrapText, Minimize2, Maximize, ArrowDown, ArrowRight, ScanLine,
    ChevronsUpDown, ChevronsLeftRight, CaseUpper, CaseLower, CaseSensitive
} from 'lucide-react';
import { cn } from '@/lib/utils';

// Icon Map with new semantic colors
const LayerIcon = ({ type }: { type: string }) => {
    switch (type) {
        case 'text': return <Type className="w-3 h-3 text-blue-400" />;
        case 'image': return <ImageIcon className="w-3 h-3 text-green-400" />;
        case 'group': return <Box className="w-3 h-3 text-orange-400" />;
        default: return <Box className="w-3 h-3 text-muted-foreground" />;
    }
};

const SectionHeader = ({ title }: { title: string }) => (
    <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-2 mt-4 first:mt-0 select-none">
        {title}
    </div>
);

const PropertyRow = ({ label, children, className }: { label?: React.ReactNode, children: React.ReactNode, className?: string }) => (
    <div className={cn("flex items-center gap-2 h-7", className)}>
        {label && <div className="w-6 text-[10px] text-muted-foreground shrink-0 select-none pl-1">{label}</div>}
        <div className="flex-1 min-w-0">{children}</div>
    </div>
);

const INPUT_CLASS = "w-full h-8 bg-muted/30 border border-transparent hover:border-border rounded-lg text-[11px] px-2 appearance-none outline-none focus:border-primary transition-all placeholder:text-muted-foreground/50";
const SEGMENT_CONTAINER_CLASS = "flex bg-muted p-1 rounded-lg border border-border/50 gap-1";
const SEGMENT_ITEM_CLASS = (isActive: boolean) => cn(
    "flex-1 flex items-center justify-center p-1.5 rounded-sm transition-all relative overflow-hidden",
    isActive
        ? "bg-background text-foreground shadow-sm ring-1 ring-border"
        : "text-muted-foreground hover:bg-background/50 hover:text-foreground"
);

interface NumberInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'prefix'> {
    inputPrefix?: React.ReactNode;
}

const NumberInput = ({ value, onChange, inputPrefix, ...props }: NumberInputProps) => (
    <div className="relative group flex items-center w-full">
        {inputPrefix && (
            <div className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[10px] text-muted-foreground pointer-events-none font-medium select-none group-focus-within:text-primary transition-colors">
                {inputPrefix}
            </div>
        )}
        <input
            type="number"
            className={cn(
                INPUT_CLASS,
                inputPrefix && "pl-7"
            )}
            value={value}
            onChange={onChange}
            {...props}
        />
    </div>
);

interface PropertiesPanelProps {
    brand?: Brand | null;
    brandFonts?: BrandAsset[];
}

export function PropertiesPanel({ brand, brandFonts }: PropertiesPanelProps) {
    const { layers, selectedLayerIds, updateLayer, alignSelectedLayers, feedData } = useEditorStore();

    // Helper to find specific layer if single
    const findLayer = (nodes: EditorLayer[]): EditorLayer | undefined => {
        for (const node of nodes) {
            if (node.id === selectedLayerIds[0]) return node;
            if (node.children) {
                const found = findLayer(node.children);
                if (found) return found;
            }
        }
    };

    const isSingle = selectedLayerIds.length === 1;
    const isMulti = selectedLayerIds.length > 1;
    const selectedLayer = isSingle ? findLayer(layers) : undefined;

    if (!isSingle && !isMulti) {
        return (
            <div className="flex flex-col items-center justify-center p-8 text-center h-full opacity-50">
                <Box className="w-8 h-8 text-muted-foreground mb-2 opacity-20" />
                <div className="text-xs text-muted-foreground">Select a layer to edit properties</div>
            </div>
        );
    }

    if (isMulti) {
        return (
            <div className="flex flex-col p-4 gap-4">
                <SectionHeader title="Alignment" />
                <div className="p-3 bg-muted/20 rounded-2xl border border-border/50 space-y-3">
                    <div className={SEGMENT_CONTAINER_CLASS}>
                        <button className={SEGMENT_ITEM_CLASS(false)} onClick={() => alignSelectedLayers('left')} title="Align Left"><AlignLeft className="w-3.5 h-3.5" /></button>
                        <button className={SEGMENT_ITEM_CLASS(false)} onClick={() => alignSelectedLayers('center')} title="Align Center"><AlignCenter className="w-3.5 h-3.5" /></button>
                        <button className={SEGMENT_ITEM_CLASS(false)} onClick={() => alignSelectedLayers('right')} title="Align Right"><AlignRight className="w-3.5 h-3.5" /></button>
                    </div>
                    <div className="h-[1px] bg-border/50 my-2" />
                    <div className={SEGMENT_CONTAINER_CLASS}>
                        <button className={SEGMENT_ITEM_CLASS(false)} onClick={() => alignSelectedLayers('top')} title="Align Top"><AlignStartVertical className="w-3.5 h-3.5" /></button>
                        <button className={SEGMENT_ITEM_CLASS(false)} onClick={() => alignSelectedLayers('middle')} title="Align Middle"><AlignCenterVertical className="w-3.5 h-3.5" /></button>
                        <button className={SEGMENT_ITEM_CLASS(false)} onClick={() => alignSelectedLayers('bottom')} title="Align Bottom"><AlignEndVertical className="w-3.5 h-3.5" /></button>
                    </div>
                </div>
                <div className="text-xs text-muted-foreground text-center mt-4">
                    {selectedLayerIds.length} Layers Selected
                </div>
            </div>
        );
    }

    if (!selectedLayer) return null;

    return (
        <div className="p-4 space-y-6 pb-20"> {/* pb-20 for scroll space */}

            {/* Header */}
            <div className="flex items-center gap-2 pb-4 border-b border-border">
                <div className="w-8 h-8 flex items-center justify-center bg-muted rounded-xl border border-border/50">
                    <LayerIcon type={selectedLayer.type} />
                </div>
                <input
                    className="flex-1 bg-transparent text-sm font-medium text-foreground border-none p-0 focus:outline-none focus:ring-0 placeholder:text-muted-foreground/50 transition-colors hover:text-primary"
                    value={selectedLayer.name}
                    onChange={(e) => updateLayer(selectedLayer.id, { name: e.target.value })}
                    placeholder="Layer Name"
                />
            </div>





            {/* Layout Section */}
            <div>
                <SectionHeader title="Layout" />
                <div className="bg-muted/10 p-2 rounded-2xl border border-border/40 space-y-2">
                    <div className="grid grid-cols-2 gap-2">
                        <NumberInput
                            inputPrefix="X"
                            value={Math.round(selectedLayer.left)}
                            onChange={(e) => updateLayer(selectedLayer.id, { left: Number(e.target.value) })}
                        />
                        <NumberInput
                            inputPrefix="Y"
                            value={Math.round(selectedLayer.top)}
                            onChange={(e) => updateLayer(selectedLayer.id, { top: Number(e.target.value) })}
                        />
                        <NumberInput
                            inputPrefix="W"
                            value={Math.round(selectedLayer.width)}
                            onChange={(e) => updateLayer(selectedLayer.id, { width: Number(e.target.value) })}
                        />
                        <NumberInput
                            inputPrefix="H"
                            value={Math.round(selectedLayer.height)}
                            onChange={(e) => updateLayer(selectedLayer.id, { height: Number(e.target.value) })}
                        />
                    </div>
                    <div className="pt-1">
                        <NumberInput
                            inputPrefix="R"
                            value={Math.round(selectedLayer.rotation || 0)}
                            onChange={(e) => updateLayer(selectedLayer.id, { rotation: Number(e.target.value) })}
                            placeholder="Angle"
                        />
                    </div>
                </div>
            </div>

            <div className="h-[1px] bg-border/50 my-2" />

            {/* Layer Section */}
            <div>
                <SectionHeader title="Appearance" />
                <div className="space-y-3">
                    <div className="flex items-center gap-2">
                        <div className="w-16 text-[10px] text-muted-foreground font-medium shrink-0">Blend</div>
                        <select
                            className={INPUT_CLASS}
                            value={selectedLayer.blendMode || 'normal'}
                            onChange={(e) => updateLayer(selectedLayer.id, { blendMode: e.target.value })}
                        >
                            <option value="normal">Normal</option>
                            <option value="multiply">Multiply</option>
                            <option value="screen">Screen</option>
                            <option value="overlay">Overlay</option>
                            <option value="darken">Darken</option>
                            <option value="lighten">Lighten</option>
                            <option value="color-dodge">Color Dodge</option>
                            <option value="soft-light">Soft Light</option>
                            <option value="difference">Difference</option>
                            <option value="exclusion">Exclusion</option>
                            <option value="hue">Hue</option>
                            <option value="saturation">Saturation</option>
                            <option value="color">Color</option>
                            <option value="luminosity">Luminosity</option>
                        </select>
                    </div>

                    <div className="flex items-center gap-2">
                        <div className="w-16 text-[10px] text-muted-foreground font-medium shrink-0">Opacity</div>
                        <div className="flex-1 flex gap-2 items-center">
                            <input
                                type="range"
                                min="0" max="100"
                                className="flex-1 h-1.5 bg-muted rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3.5 [&::-webkit-slider-thumb]:h-3.5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-primary [&::-webkit-slider-thumb]:border-[2px] [&::-webkit-slider-thumb]:border-background [&::-webkit-slider-thumb]:shadow-sm"
                                value={Math.round((selectedLayer.opacity || 1) * 100)}
                                onChange={(e) => updateLayer(selectedLayer.id, { opacity: Number(e.target.value) / 100 })}
                                aria-label="Opacity"
                                title="Opacity"
                            />
                            <div className="w-12">
                                <NumberInput
                                    value={Math.round((selectedLayer.opacity || 1) * 100)}
                                    onChange={(e) => updateLayer(selectedLayer.id, { opacity: Number(e.target.value) / 100 })}
                                    max={100}
                                    min={0}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="h-[1px] bg-border/50 my-2" />

            {/* Text Section (Conditional) */}
            {selectedLayer.type === 'text' && (
                <>
                    <div>
                        <SectionHeader title="Typography" />
                        <div className="space-y-2">
                            {/* Font Family */}
                            <select
                                className={cn(INPUT_CLASS, "font-sans")}
                                value={selectedLayer.fontFamily || 'Inter'}
                                onChange={(e) => updateLayer(selectedLayer.id, { fontFamily: e.target.value })}
                            >
                                {brandFonts && brandFonts.length > 0 && (
                                    <optgroup label="Brand Fonts">
                                        {brandFonts.map(font => {
                                            const fontName = font.name.split('.')[0];
                                            return <option key={font.id} value={fontName}>{fontName}</option>;
                                        })}
                                    </optgroup>
                                )}
                                <optgroup label="Standard Fonts">
                                    <option value="Inter">Inter</option>
                                    <option value="Roboto">Roboto</option>
                                    <option value="Outfit">Outfit</option>
                                    <option value="Arial">Arial</option>
                                    <option value="Helvetica">Helvetica</option>
                                    <option value="Times New Roman">Times New Roman</option>
                                    <option value="Courier New">Courier New</option>
                                </optgroup>
                            </select>

                            {/* Font Details & Spacing */}
                            <div className="grid grid-cols-2 gap-2">
                                <select className={INPUT_CLASS} disabled>
                                    <option>Regular</option>
                                    <option>Bold</option>
                                </select>
                                <NumberInput
                                    inputPrefix={<span className="text-[9px] font-bold">Sz</span>}
                                    value={selectedLayer.fontSize || 12}
                                    onChange={(e) => updateLayer(selectedLayer.id, { fontSize: Number(e.target.value) })}
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-2">
                                <NumberInput
                                    inputPrefix={<ChevronsUpDown className="w-3 h-3" />}
                                    value={selectedLayer.lineHeight || 0}
                                    placeholder="Auto"
                                    onChange={(e) => updateLayer(selectedLayer.id, { lineHeight: Number(e.target.value) })}
                                    title="Line Height"
                                />
                                <NumberInput
                                    inputPrefix={<ChevronsLeftRight className="w-3 h-3" />}
                                    step="0.01"
                                    value={selectedLayer.letterSpacing || 0}
                                    onChange={(e) => updateLayer(selectedLayer.id, { letterSpacing: Number(e.target.value) })}
                                    title="Letter Spacing"
                                />
                            </div>

                            {/* Text Case */}
                            <div className={SEGMENT_CONTAINER_CLASS}>
                                <button
                                    className={SEGMENT_ITEM_CLASS((selectedLayer.textTransform || 'none') === 'none')}
                                    onClick={() => updateLayer(selectedLayer.id, { textTransform: 'none' })}
                                    title="Normal Case"
                                >
                                    <span className="text-[10px]">Aa</span>
                                </button>
                                <button
                                    className={SEGMENT_ITEM_CLASS(selectedLayer.textTransform === 'uppercase')}
                                    onClick={() => updateLayer(selectedLayer.id, { textTransform: 'uppercase' })}
                                    title="Uppercase"
                                >
                                    <CaseUpper className="w-3.5 h-3.5" />
                                </button>
                                <button
                                    className={SEGMENT_ITEM_CLASS(selectedLayer.textTransform === 'lowercase')}
                                    onClick={() => updateLayer(selectedLayer.id, { textTransform: 'lowercase' })}
                                    title="Lowercase"
                                >
                                    <CaseLower className="w-3.5 h-3.5" />
                                </button>
                                <button
                                    className={SEGMENT_ITEM_CLASS(selectedLayer.textTransform === 'capitalize')}
                                    onClick={() => updateLayer(selectedLayer.id, { textTransform: 'capitalize' })}
                                    title="Capitalize"
                                >
                                    <CaseSensitive className="w-3.5 h-3.5" />
                                </button>
                            </div>

                            {/* Alignment Group */}
                            <div className="pt-2 space-y-2">
                                <div className={SEGMENT_CONTAINER_CLASS}>
                                    {[
                                        { v: 'left', i: AlignLeft, l: 'Align Left' },
                                        { v: 'center', i: AlignCenter, l: 'Align Center' },
                                        { v: 'right', i: AlignRight, l: 'Align Right' },
                                        { v: 'justify', i: AlignJustify, l: 'Justify' }
                                    ].map(opt => (
                                        <button
                                            key={opt.v}
                                            onClick={() => updateLayer(selectedLayer.id, { textAlign: opt.v as any })}
                                            title={opt.l}
                                            className={SEGMENT_ITEM_CLASS(selectedLayer.textAlign === opt.v)}
                                        >
                                            <opt.i className="w-3.5 h-3.5" />
                                        </button>
                                    ))}
                                </div>
                                <div className={SEGMENT_CONTAINER_CLASS}>
                                    {[
                                        { v: 'top', i: AlignStartVertical, l: 'Align Top' },
                                        { v: 'middle', i: AlignCenterVertical, l: 'Align Middle' },
                                        { v: 'bottom', i: AlignEndVertical, l: 'Align Bottom' }
                                    ].map(opt => (
                                        <button
                                            key={opt.v}
                                            onClick={() => updateLayer(selectedLayer.id, { verticalAlign: opt.v as any })}
                                            title={opt.l}
                                            className={SEGMENT_ITEM_CLASS(selectedLayer.verticalAlign === opt.v)}
                                        >
                                            <opt.i className="w-3.5 h-3.5" />
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="h-[1px] bg-border/50 my-2" />

                    {/* Resizing & Behavior */}
                    <div>
                        <SectionHeader title="Text Behavior" />
                        <div className="space-y-2.5">
                            {/* Row 1: Line Wrapping */}
                            <div className="flex items-center gap-2">
                                <span className="text-[10px] text-muted-foreground w-10 font-medium">Lines</span>
                                <div className={cn(SEGMENT_CONTAINER_CLASS, "flex-1")}>
                                    <button
                                        className={SEGMENT_ITEM_CLASS(selectedLayer.wrapText === false)}
                                        onClick={() => updateLayer(selectedLayer.id, { wrapText: false })}
                                        title="Single Line (Overflows)"
                                    >
                                        <ArrowRight className="w-3.5 h-3.5" />
                                        <span className="ml-1.5 hidden sm:inline-block">Single</span>
                                    </button>
                                    <button
                                        className={SEGMENT_ITEM_CLASS(selectedLayer.wrapText !== false)}
                                        onClick={() => updateLayer(selectedLayer.id, { wrapText: true })}
                                        title="Multi Line (Wraps)"
                                    >
                                        <WrapText className="w-3.5 h-3.5" />
                                        <span className="ml-1.5 hidden sm:inline-block">Multi</span>
                                    </button>
                                </div>
                            </div>

                            {/* Row 2: Scaling */}
                            <div className="flex items-center gap-2">
                                <span className="text-[10px] text-muted-foreground w-10 font-medium">Size</span>
                                <div className={cn(SEGMENT_CONTAINER_CLASS, "flex-1")}>
                                    <button
                                        className={SEGMENT_ITEM_CLASS(!selectedLayer.shrinkToFit)}
                                        onClick={() => updateLayer(selectedLayer.id, { shrinkToFit: false, autoSize: false })}
                                        title="Fixed Font Size"
                                    >
                                        <Type className="w-3.5 h-3.5" />
                                        <span className="ml-1.5 hidden sm:inline-block">Fixed</span>
                                    </button>
                                    <button
                                        className={SEGMENT_ITEM_CLASS(selectedLayer.shrinkToFit === true)}
                                        onClick={() => updateLayer(selectedLayer.id, { shrinkToFit: true, autoSize: false })}
                                        title="Auto Scale (Shrink to Box)"
                                    >
                                        <Minimize2 className="w-3.5 h-3.5" />
                                        <span className="ml-1.5 hidden sm:inline-block">Fit Box</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="h-[1px] bg-border/50 my-2" />
                </>
            )}

            {/* Fill Section */}
            {selectedLayer.type === 'text' && (
                <>
                    <div>
                        <div className="flex items-center justify-between mb-2">
                            <SectionHeader title="Fill" />
                            {/* Potential + button here? */}
                        </div>
                        <div className="flex items-center gap-2 p-1.5 border border-border/60 hover:border-border rounded bg-muted/20 hover:bg-muted/40 transition-colors group">
                            <div className="w-8 h-8 rounded border border-border shadow-sm overflow-hidden shrink-0 relative">
                                <input
                                    type="color"
                                    className="absolute -top-[50%] -left-[50%] w-[200%] h-[200%] cursor-pointer p-0 m-0 border-none"
                                    value={selectedLayer.color || '#000000'}
                                    onChange={(e) => updateLayer(selectedLayer.id, { color: e.target.value })}
                                />
                            </div>
                            <div className="flex-1 text-[11px] font-mono text-muted-foreground uppercase group-hover:text-foreground transition-colors">
                                {selectedLayer.color || '#000000'}
                            </div>
                            <div className="text-[10px] text-muted-foreground/50">100%</div>
                        </div>

                        {/* Brand Colors */}
                        {brand?.colors && brand.colors.length > 0 && (
                            <div className="mt-3">
                                <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-wider mb-2 block">Brand Colors</span>
                                <div className="flex flex-wrap gap-1.5">
                                    {brand.colors.map((c, i) => (
                                        <button
                                            key={i}
                                            className="w-5 h-5 rounded-full border border-border/50 shadow-sm hover:scale-110 transition-transform focus:outline-none focus:ring-1 focus:ring-primary"
                                            style={{ backgroundColor: c }}
                                            onClick={() => updateLayer(selectedLayer.id, { color: c })}
                                            title={c}
                                        />
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                    <div className="h-[1px] bg-border/50 my-2" />
                </>
            )}



            {/* Background & Spacing Section */}
            {
                selectedLayer.type === 'text' && (
                    <>
                        <div>
                            <SectionHeader title="Background" />
                            <div className="space-y-3">
                                <div className="flex items-center gap-2 p-1.5 border border-border/60 hover:border-border rounded bg-muted/20 hover:bg-muted/40 transition-colors relative">
                                    <div className="w-8 h-8 rounded border border-border shadow-sm overflow-hidden shrink-0 relative">
                                        <input
                                            type="color"
                                            className="absolute -top-[50%] -left-[50%] w-[200%] h-[200%] cursor-pointer p-0 m-0 border-none"
                                            value={selectedLayer.backgroundColor || '#ffffff'}
                                            onChange={(e) => updateLayer(selectedLayer.id, { backgroundColor: e.target.value })}
                                        />
                                    </div>
                                    <div className="flex-1 text-[11px] font-mono text-muted-foreground uppercase group-hover:text-foreground transition-colors">
                                        {selectedLayer.backgroundColor ? selectedLayer.backgroundColor : 'None'}
                                    </div>
                                    {selectedLayer.backgroundColor && (
                                        <button
                                            onClick={() => updateLayer(selectedLayer.id, { backgroundColor: undefined })}
                                            className="text-muted-foreground hover:text-destructive transition-colors p-1"
                                            title="Remove Background"
                                        >
                                            <Minimize2 className="w-3 h-3 rotate-45" />
                                        </button>
                                    )}
                                </div>

                                {/* Padding */}
                                <div className="space-y-1">
                                    <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-wider">Padding</span>
                                    <div className="grid grid-cols-2 gap-2">
                                        <NumberInput
                                            inputPrefix={<span className="text-[9px] font-bold">T</span>}
                                            value={selectedLayer.padding?.top || 0}
                                            onChange={(e) => updateLayer(selectedLayer.id, { padding: { ...selectedLayer.padding, top: Number(e.target.value) } as any })}
                                        />
                                        <NumberInput
                                            inputPrefix={<span className="text-[9px] font-bold">R</span>}
                                            value={selectedLayer.padding?.right || 0}
                                            onChange={(e) => updateLayer(selectedLayer.id, { padding: { ...selectedLayer.padding, right: Number(e.target.value) } as any })}
                                        />
                                        <NumberInput
                                            inputPrefix={<span className="text-[9px] font-bold">B</span>}
                                            value={selectedLayer.padding?.bottom || 0}
                                            onChange={(e) => updateLayer(selectedLayer.id, { padding: { ...selectedLayer.padding, bottom: Number(e.target.value) } as any })}
                                        />
                                        <NumberInput
                                            inputPrefix={<span className="text-[9px] font-bold">L</span>}
                                            value={selectedLayer.padding?.left || 0}
                                            onChange={(e) => updateLayer(selectedLayer.id, { padding: { ...selectedLayer.padding, left: Number(e.target.value) } as any })}
                                        />
                                    </div>
                                </div>

                                {/* Border Radius */}
                                <div className="space-y-1">
                                    <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-wider">Corner Radius</span>
                                    <div className="grid grid-cols-2 gap-2">
                                        <NumberInput
                                            inputPrefix={<span className="text-[9px] font-bold">TL</span>}
                                            value={selectedLayer.borderRadius?.tl || 0}
                                            onChange={(e) => updateLayer(selectedLayer.id, { borderRadius: { ...selectedLayer.borderRadius, tl: Number(e.target.value) } as any })}
                                        />
                                        <NumberInput
                                            inputPrefix={<span className="text-[9px] font-bold">TR</span>}
                                            value={selectedLayer.borderRadius?.tr || 0}
                                            onChange={(e) => updateLayer(selectedLayer.id, { borderRadius: { ...selectedLayer.borderRadius, tr: Number(e.target.value) } as any })}
                                        />
                                        <NumberInput
                                            inputPrefix={<span className="text-[9px] font-bold">BR</span>}
                                            value={selectedLayer.borderRadius?.br || 0}
                                            onChange={(e) => updateLayer(selectedLayer.id, { borderRadius: { ...selectedLayer.borderRadius, br: Number(e.target.value) } as any })}
                                        />
                                        <NumberInput
                                            inputPrefix={<span className="text-[9px] font-bold">BL</span>}
                                            value={selectedLayer.borderRadius?.bl || 0}
                                            onChange={(e) => updateLayer(selectedLayer.id, { borderRadius: { ...selectedLayer.borderRadius, bl: Number(e.target.value) } as any })}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="h-[1px] bg-border/50 my-2" />
                    </>
                )
            }

            {/* Content / Data Section */}
            <div>
                <SectionHeader title="Content & Data" />
                <div className="space-y-3">
                    {selectedLayer.type === 'text' && (
                        <textarea
                            className={cn(INPUT_CLASS, "h-20 p-2 leading-relaxed resize-y")}
                            value={selectedLayer.text}
                            onChange={(e) => updateLayer(selectedLayer.id, { text: e.target.value })}
                            placeholder="Text content..."
                        />
                    )}

                    <div className="relative group">
                        <div className="absolute left-2 top-2 text-muted-foreground/50 group-focus-within:text-purple-500 transition-colors z-10 pointer-events-none">
                            <Hash className="w-4 h-4" />
                        </div>
                        {feedData && feedData.headers && feedData.headers.length > 0 ? (
                            <div className="relative w-full">
                                <select
                                    className={cn(
                                        "w-full h-8 bg-purple-500/5 border border-purple-500/20 hover:border-purple-500/40 rounded text-[11px] pl-8 pr-6 focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500/20 transition-all font-mono appearance-none cursor-pointer",
                                        !selectedLayer.variableName && "text-muted-foreground"
                                    )}
                                    value={selectedLayer.variableName || ''}
                                    onChange={(e) => updateLayer(selectedLayer.id, { variableName: e.target.value })}
                                    title="Select Data Feed Variable"
                                >
                                    <option value="">Select Variable...</option>
                                    {feedData.headers.map(header => (
                                        <option key={header} value={header.toLowerCase()}>
                                            {header.toLowerCase()}
                                        </option>
                                    ))}
                                </select>
                                <div className="absolute right-2 top-2.5 pointer-events-none text-muted-foreground/50">
                                    <ChevronsUpDown className="w-3 h-3" />
                                </div>
                            </div>
                        ) : (
                            <input
                                className={cn(
                                    "w-full h-8 bg-purple-500/5 border border-purple-500/20 hover:border-purple-500/40 rounded text-[11px] pl-8 pr-2 focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500/20 transition-all font-mono",
                                    "placeholder:text-muted-foreground/40"
                                )}
                                placeholder="Data Feed Variable..."
                                value={selectedLayer.variableName || ''}
                                onChange={(e) => updateLayer(selectedLayer.id, { variableName: e.target.value })}
                            />
                        )}
                    </div>
                </div>
            </div>

        </div >
    );
}
