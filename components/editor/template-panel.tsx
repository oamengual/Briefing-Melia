import * as React from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Plus, Trash2, CheckCircle, Image as ImageIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { parsePsd } from '@/lib/psd-utils';
import { PLACEMENTS as SEED_PLACEMENTS } from '@/lib/constants';
import { getPlacements } from '@/lib/storage';
import { Placement } from '@/lib/types'; // Import Placement type
import { savePsd } from '@/lib/psd-storage';

import { EditorState, PsdTemplate as Template } from '@/lib/types';

import { MatrixState } from '@/lib/types';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangle, FolderInput } from "lucide-react";

interface TemplatePanelProps {
    templates: Template[];
    activeId?: string;
    matrix?: MatrixState;
    onSelect: (id: string) => void;
    onAdd: (template: Template) => void;
    onAddMany?: (templates: Template[]) => void;
    onRemove: (id: string) => void;
}

// Helper to determine platform from size or explicit channel
const getPlatform = (t: Template, placements: Placement[]): string => {
    // 1. Explicit Channel from Folder
    if (t.channel) {
        // Humanize it: "amazon_dsp" -> "Amazon DSP" ? 
        // Or just map to nearest known channel in PLACEMENTS 
        const match = placements.find(p =>
            p.channel.toLowerCase().replace(/[^a-z0-9]/g, '') === t.channel?.toLowerCase().replace(/[^a-z0-9]/g, '')
        );
        if (match) return match.channel;

        // Return raw folder name capitalized if no match
        return t.channel.charAt(0).toUpperCase() + t.channel.slice(1);
    }

    // 2. Fallback: Check strict match by size
    const match = placements.find(p => p.size === t.size);
    if (match) return match.channel;

    // 3. Last resort
    return 'Other';
};

export function TemplatePanel({ templates, activeId, onSelect, onAdd, onAddMany, onRemove, matrix }: TemplatePanelProps) {
    const fileInputRef = React.useRef<HTMLInputElement>(null);
    const folderInputRef = React.useRef<HTMLInputElement>(null);
    const [loading, setLoading] = React.useState(false);
    const [progress, setProgress] = React.useState({ current: 0, total: 0 });
    const [missingSizes, setMissingSizes] = React.useState<string[]>([]);

    // Dynamic Placements State
    const [placements, setPlacements] = React.useState<Placement[]>(SEED_PLACEMENTS);
    React.useEffect(() => {
        setPlacements(getPlacements());
    }, []);

    // Determine required sizes from Matrix
    const requiredSizes = React.useMemo(() => {
        if (!matrix) return new Set<string>();
        const sizes = new Set<string>();
        Object.values(matrix).forEach(placementIds => {
            placementIds.forEach(pid => {
                const p = placements.find(pl => pl.id === pid);
                if (p) sizes.add(p.size);
            });
        });
        return sizes;
    }, [matrix, placements]);

    // Check for missing sizes whenever templates or requirements change
    React.useEffect(() => {
        if (!requiredSizes || requiredSizes.size === 0) {
            setMissingSizes([]);
            return;
        }

        const currentSizes = new Set(templates.map(t => t.size));
        const missing = Array.from(requiredSizes).filter(s => !currentSizes.has(s));
        setMissingSizes(missing);
    }, [requiredSizes, templates]);

    // Group templates
    const groupedTemplates = React.useMemo(() => {
        const groups: Record<string, Template[]> = {};
        templates.forEach(t => {
            const platform = getPlatform(t, placements);
            if (!groups[platform]) groups[platform] = [];
            groups[platform].push(t);
        });
        return groups;
    }, [templates, placements]);

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement> | React.DragEvent) => {
        let filesToProcess: { file: File; path: string }[] = [];

        if ('files' in e.target && e.target.files) {
            filesToProcess = Array.from(e.target.files).map(f => ({ file: f, path: (f as any).webkitRelativePath || f.name }));
        } else if ('dataTransfer' in e && e.dataTransfer.items) {
            // Robust Recursive Traversal for Drag and Drop
            const items = Array.from(e.dataTransfer.items);
            const filePromises: Promise<{ file: File; path: string }[]>[] = items.map(async (item) => {
                const entry = item.webkitGetAsEntry();
                if (!entry) return [];
                return traverseEntry(entry);
            });
            const fileArrays = await Promise.all(filePromises);
            filesToProcess = fileArrays.flat();
        }

        if (!filesToProcess || filesToProcess.length === 0) return;

        setLoading(true);
        const newTemplatesInProgress: Template[] = [];
        const total = filesToProcess.length;
        setProgress({ current: 0, total });

        try {
            // Process in smaller chunks to keep UI responsive and avoid IDB bottlenecks
            const CHUNK_SIZE = 5;
            for (let i = 0; i < filesToProcess.length; i += CHUNK_SIZE) {
                const chunk = filesToProcess.slice(i, i + CHUNK_SIZE);

                await Promise.all(chunk.map(async ({ file, path: fullPath }, idx) => {
                    const currentIndex = i + idx + 1;
                    if (currentIndex <= total) {
                        setProgress(p => ({ ...p, current: Math.min(currentIndex, total) }));
                    }

                    // Skip non-PSD files and Mac metadata files (._)
                    if (!file.name.toLowerCase().endsWith('.psd') || file.name.startsWith('._')) return;

                    try {
                        const { state, preview } = await parsePsd(file);
                        const id = crypto.randomUUID();
                        await savePsd(id, file);
                        const size = `${state.width}x${state.height}`;

                        let channel: string | undefined;

                        // Improved Channel Detection from Path
                        const pathParts = fullPath.toLowerCase().split('/');

                        // 1. Check for exact or partial channel matches in path
                        for (const part of pathParts) {
                            const match = placements.find(p => {
                                const cleanPart = part.replace(/[^a-z0-9]/g, '');
                                const cleanChannel = p.channel.toLowerCase().replace(/[^a-z0-9]/g, '');
                                return cleanChannel === cleanPart || (cleanPart.length > 3 && cleanChannel.includes(cleanPart));
                            });
                            if (match) {
                                channel = match.channel;
                                break;
                            }
                        }

                        // 2. Fallback to immediate parent if it's not a generic name
                        if (!channel && pathParts.length >= 2) {
                            const parent = pathParts[pathParts.length - 2];
                            const genericFolders = ['psd', '_psd', 'templates', 'designs', 'linked', 'brief-generator', 'desktop', 'documents', 'downloads'];
                            if (!genericFolders.includes(parent.toLowerCase())) {
                                channel = parent.charAt(0).toUpperCase() + parent.slice(1);
                            }
                        }

                        const name = file.name.replace('.psd', '');
                        newTemplatesInProgress.push({ id, name, size, preview, channel, editorState: state });

                        // If we don't have onAddMany, call onAdd immediately for better responsiveness
                        if (!onAddMany) {
                            onAdd({ id, name, size, preview, channel, editorState: state });
                        }

                    } catch (innerErr) {
                        console.error(`Failed to process file ${file.name}`, innerErr);
                    }
                }));
            }

            if (onAddMany && newTemplatesInProgress.length > 0) {
                onAddMany(newTemplatesInProgress);
            }

        } catch (err) {
            console.error("Batch processing failed", err);
            alert("An error occurred while processing files.");
        } finally {
            setLoading(false);
            setProgress({ current: 0, total: 0 });
            if (fileInputRef.current) fileInputRef.current.value = '';
            if (folderInputRef.current) folderInputRef.current.value = '';
        }
    };

    // Helper to traverse DirectoryEntry and preserve paths
    const traverseEntry = async (entry: any): Promise<{ file: File; path: string }[]> => {
        if (entry.isFile) {
            return new Promise((resolve) => {
                entry.file((file: File) => resolve([{ file, path: entry.fullPath || file.name }]));
            });
        } else if (entry.isDirectory) {
            const reader = entry.createReader();
            const entries = await new Promise<any[]>((resolve) => {
                reader.readEntries((results: any[]) => resolve(results));
            });
            const results = await Promise.all(entries.map(e => traverseEntry(e)));
            return results.flat();
        }
        return [];
    };

    return (
        <div className="flex flex-col gap-4">
            {/* Missing Sizes Warning */}
            {missingSizes.length > 0 && (
                <Alert variant="destructive" className="bg-destructive/10 text-destructive border-destructive/20 shadow-none radius-card flex gap-3 p-4">
                    <AlertTriangle className="h-5 w-5 text-destructive shrink-0" />
                    <div>
                        <AlertTitle className="text-sm font-bold tracking-tight mb-1">Missing Templates</AlertTitle>
                        <AlertDescription className="text-xs space-y-2 opacity-90 leading-relaxed">
                            <p>For full coverage, please add PSDs for:</p>
                            <div className="space-y-1.5 py-2">
                                {(() => {
                                    const grouped: Record<string, string[]> = {};
                                    missingSizes.forEach(size => {
                                        const platform = getPlatform({ id: '', name: '', size } as Template, placements);
                                        if (!grouped[platform]) grouped[platform] = [];
                                        grouped[platform].push(size);
                                    });

                                    return Object.entries(grouped).map(([platform, sizes]) => (
                                        <div key={platform} className="flex flex-wrap gap-2 items-center">
                                            <span className="font-bold text-destructive uppercase text-[9px] tracking-widest">{platform}</span>
                                            {sizes.map(s => (
                                                <span key={s} className="font-mono bg-background text-destructive px-2 py-0.5 rounded-full border border-destructive/20 text-[10px] shadow-sm">{s}</span>
                                            ))}
                                        </div>
                                    ));
                                })()}
                            </div>
                        </AlertDescription>
                    </div>
                </Alert>
            )}

            <div
                className={cn(
                    "flex items-center justify-between p-3 radius-card border border-dashed transition-all cursor-pointer group hover:bg-muted/50",
                    loading ? "bg-muted border-foreground" : "border-border hover:border-foreground"
                )}
                onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); }}
                onDrop={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    handleFileChange(e as any);
                }}
                onClick={() => fileInputRef.current?.click()}
            >
                <div className="flex flex-col ml-1">
                    <h3 className="text-[11px] font-bold text-foreground uppercase tracking-widest group-hover:text-foreground">Linked Designs</h3>
                    {loading && progress.total > 0 && (
                        <span className="text-[10px] font-bold text-primary animate-pulse">
                            Processing {progress.current}/{progress.total}
                        </span>
                    )}
                </div>
                <div className="flex gap-2">
                    <Button
                        variant="secondary"
                        size="sm"
                        className="h-8 radius-btn border border-border bg-background hover:bg-muted text-foreground text-[10px] font-bold shadow-sm"
                        onClick={(e) => { e.stopPropagation(); folderInputRef.current?.click(); }}
                        disabled={loading}
                    >
                        <FolderInput className="w-3.5 h-3.5 mr-1.5" />
                        Link Folder
                    </Button>
                    <Button
                        variant="secondary"
                        size="sm"
                        className="h-8 w-8 p-0 radius-btn border border-border bg-background hover:bg-muted text-foreground shadow-sm"
                        onClick={(e) => { e.stopPropagation(); fileInputRef.current?.click(); }}
                        disabled={loading}
                    >
                        <Plus className="w-4 h-4" />
                    </Button>
                </div>
            </div>

            <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept=".psd"
                multiple
                onChange={handleFileChange}
            />
            <input
                type="file"
                ref={folderInputRef}
                className="hidden"
                // @ts-expect-error - webkitdirectory is non-standard but supported
                webkitdirectory=""
                multiple
                onChange={handleFileChange}
            />

            <div className="flex flex-col gap-6">
                {Object.entries(groupedTemplates).map(([platform, groupTpls]) => (
                    <div key={platform}>
                        <div className="text-[10px] font-bold text-[#717171] uppercase tracking-widest mb-3 px-2">
                            {platform}
                        </div>
                        <div className="space-y-3">
                            {groupTpls.map(tpl => {
                                const isActive = activeId === tpl.id;
                                return (
                                    <div key={tpl.id} className="relative group px-1">
                                        <div
                                            className={cn(
                                                "relative overflow-hidden cursor-pointer transition-all flex items-center p-2 gap-3 radius-card group border-2",
                                                isActive
                                                    ? "border-foreground bg-card shadow-md scale-[1.02]"
                                                    : "border-transparent bg-card hover:bg-muted/50 hover:scale-[1.01]"
                                            )}
                                            onClick={() => onSelect(tpl.id)}
                                        >
                                            {/* Mini Preview */}
                                            <div className={cn(
                                                "w-12 h-12 shrink-0 radius-lg flex items-center justify-center overflow-hidden border transition-colors shadow-sm",
                                                isActive ? "bg-muted border-border" : "bg-muted border-transparent"
                                            )}>
                                                {tpl.preview ? (
                                                    <img
                                                        src={tpl.preview}
                                                        alt={tpl.name}
                                                        className="w-full h-full object-contain"
                                                    />
                                                ) : (
                                                    <ImageIcon className="w-5 h-5 text-muted-foreground" />
                                                )}
                                            </div>

                                            {/* Info Area */}
                                            <div className="flex-1 min-w-0 pr-8">
                                                <div className="text-[11px] font-bold text-foreground truncate leading-tight mb-1" title={tpl.name}>
                                                    {tpl.name}
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <span className="text-[9px] font-mono font-bold text-muted-foreground bg-muted px-1.5 py-0.5 rounded-sm border border-border">
                                                        {tpl.size}
                                                    </span>
                                                    {requiredSizes.has(tpl.size) && (
                                                        <span className="text-[8px] font-bold uppercase tracking-wider text-green-600 flex items-center gap-0.5">
                                                            <CheckCircle className="w-2.5 h-2.5 fill-current" />
                                                            Req
                                                        </span>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Status & Actions */}
                                            <div className="absolute right-3 flex items-center">
                                                {isActive ? (
                                                    <div className="w-5 h-5 bg-foreground rounded-full flex items-center justify-center animate-in zoom-in duration-300">
                                                        <CheckCircle className="w-3 h-3 text-background" />
                                                    </div>
                                                ) : (
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        className="h-7 w-7 p-0 radius-btn bg-transparent hover:bg-muted text-muted-foreground hover:text-destructive transition-all opacity-0 group-hover:opacity-100"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            if (confirm('Unlink this PSD?')) onRemove(tpl.id);
                                                        }}
                                                    >
                                                        <Trash2 className="w-3.5 h-3.5" />
                                                    </Button>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                ))}

                {templates.length === 0 && (
                    <div
                        className="border-2 border-dashed border-border radius-card p-8 flex flex-col items-center justify-center text-center cursor-pointer bg-muted/30 hover:bg-muted hover:border-foreground transition-all group"
                        onClick={() => fileInputRef.current?.click()}
                    >
                        <div className="w-14 h-14 rounded-full bg-background shadow-sm flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                            <Plus className="w-6 h-6 text-foreground" />
                        </div>
                        <span className="text-xs font-bold uppercase tracking-widest text-foreground">Link PSD Templates</span>
                        <p className="text-[10px] mt-2 text-muted-foreground font-medium">Drag designs here or click to browse</p>
                    </div>
                )}
            </div>
        </div>
    );
}
