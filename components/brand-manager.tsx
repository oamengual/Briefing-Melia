'use client';

import * as React from 'react';
import { Brand, BrandAsset, BrandAssetType } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Plus, X, Upload, Palette, Type, Image as ImageIcon, Trash2, Loader2, Check } from 'lucide-react';
import { saveAsset, getAsset, deleteAsset } from '@/lib/brand-storage';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";

interface BrandManagerProps {
    brands: Brand[];
    onUpdate: (brands: Brand[]) => void;
}

export function BrandManager({ brands, onUpdate }: BrandManagerProps) {
    const [selectedBrandId, setSelectedBrandId] = React.useState<string | null>(null);
    const [isCreateDialogOpen, setIsCreateDialogOpen] = React.useState(false);
    const [newBrandName, setNewBrandName] = React.useState('');

    const selectedBrand = React.useMemo(() =>
        brands.find(b => b.id === selectedBrandId),
        [brands, selectedBrandId]);

    const handleCreateBrand = () => {
        if (!newBrandName.trim()) return;
        const newBrand: Brand = {
            id: crypto.randomUUID(),
            name: newBrandName.trim(),
            colors: [],
            fontIds: {},
            logoIds: []
        };
        onUpdate([...brands, newBrand]);
        setNewBrandName('');
        setIsCreateDialogOpen(false);
        setSelectedBrandId(newBrand.id);
    };

    const handleDeleteBrand = (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        if (confirm('Are you sure you want to delete this brand and all its assets?')) {
            const brand = brands.find(b => b.id === id);
            if (brand) {
                // Cleanup assets
                brand.logoIds.forEach(assetId => deleteAsset(assetId));
                if (brand.fontIds.heading) deleteAsset(brand.fontIds.heading);
                if (brand.fontIds.body) deleteAsset(brand.fontIds.body);
            }
            onUpdate(brands.filter(b => b.id !== id));
            if (selectedBrandId === id) setSelectedBrandId(null);
        }
    };

    const updateBrand = (updated: Brand) => {
        onUpdate(brands.map(b => b.id === updated.id ? updated : b));
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 min-h-[600px]">
            {/* Sidebar: Brand List */}
            <div className="lg:col-span-3 flex flex-col gap-4">
                <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Brands</h3>
                    <Button onClick={() => setIsCreateDialogOpen(true)} size="sm" variant="ghost" className="h-8 w-8 p-0 rounded-full hover:bg-primary/10 hover:text-primary">
                        <Plus className="w-4 h-4" />
                    </Button>
                </div>

                <div className="space-y-2">
                    {brands.length === 0 && (
                        <div className="text-center py-8 px-4 border border-dashed rounded-lg">
                            <p className="text-xs text-muted-foreground">No brands configured.</p>
                        </div>
                    )}
                    {brands.map(brand => (
                        <div
                            key={brand.id}
                            onClick={() => setSelectedBrandId(brand.id)}
                            className={cn(
                                "group flex items-center justify-between p-3 rounded-xl border transition-all cursor-pointer",
                                selectedBrandId === brand.id
                                    ? "bg-primary text-primary-foreground border-primary shadow-md"
                                    : "bg-card hover:bg-accent/50 border-transparent hover:border-border"
                            )}
                        >
                            <span className="font-bold text-sm truncate">{brand.name}</span>
                            <button
                                onClick={(e) => handleDeleteBrand(brand.id, e)}
                                className={cn(
                                    "p-1.5 rounded-full transition-all opacity-0 group-hover:opacity-100",
                                    selectedBrandId === brand.id
                                        ? "hover:bg-black/20 text-white/70 hover:text-white"
                                        : "hover:bg-destructive/10 text-muted-foreground hover:text-destructive"
                                )}
                            >
                                <Trash2 className="w-3.5 h-3.5" />
                            </button>
                        </div>
                    ))}
                </div>
            </div>

            {/* Main Content: Brand Details */}
            <div className="lg:col-span-9">
                {selectedBrand ? (
                    <BrandEditor brand={selectedBrand} onUpdate={updateBrand} />
                ) : (
                    <div className="h-full flex flex-col items-center justify-center text-muted-foreground border-2 border-dashed rounded-3xl bg-muted/5 min-h-[400px]">
                        <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
                            <Palette className="w-8 h-8 opacity-20" />
                        </div>
                        <p className="text-sm font-medium">Select a brand to manage assets</p>
                    </div>
                )}
            </div>

            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                <DialogContent className="max-w-sm">
                    <DialogHeader>
                        <DialogTitle>Add Brand</DialogTitle>
                        <DialogDescription>Create a new brand profile.</DialogDescription>
                    </DialogHeader>
                    <div className="py-4">
                        <Label>Brand Name</Label>
                        <Input
                            value={newBrandName}
                            onChange={e => setNewBrandName(e.target.value)}
                            placeholder="e.g. Nike"
                            className="mt-2"
                        />
                    </div>
                    <DialogFooter>
                        <Button onClick={handleCreateBrand} disabled={!newBrandName.trim()}>Create</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}

// Sub-component for editing a specific brand
function BrandEditor({ brand, onUpdate }: { brand: Brand; onUpdate: (b: Brand) => void }) {

    // --- Colors ---
    const [newColor, setNewColor] = React.useState('#000000');

    const addColor = () => {
        if (brand.colors.includes(newColor)) return;
        onUpdate({ ...brand, colors: [...brand.colors, newColor] });
    };

    const removeColor = (color: string) => {
        onUpdate({ ...brand, colors: brand.colors.filter(c => c !== color) });
    };

    // --- Assets (Logos & Fonts) ---
    // We need to manage async loading of asset metadata if we want to show names
    // For now, let's just store IDs in the Brand object and fetch details when needed or just show "Logo 1", "Logo 2" if we can't get names easily. 
    // Actually, let's load the asset details for the list.

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div className="flex items-center justify-between border-b pb-4">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">{brand.name}</h2>
                    <p className="text-sm text-muted-foreground">Manage identity assets</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Colors Section */}
                <Card className="border-border shadow-sm">
                    <CardContent className="p-6 space-y-6">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-300 rounded-lg">
                                <Palette className="w-5 h-5" />
                            </div>
                            <div>
                                <h3 className="font-bold text-foreground">Color Palette</h3>
                                <p className="text-xs text-muted-foreground">Corporate identity colors</p>
                            </div>
                        </div>

                        <div className="flex items-end gap-3">
                            <div className="space-y-2 flex-1">
                                <Label className="text-xs">Pick Color</Label>
                                <div className="flex gap-2">
                                    <input
                                        type="color"
                                        value={newColor}
                                        onChange={e => setNewColor(e.target.value)}
                                        className="h-9 w-9 p-0 border-0 rounded-md cursor-pointer ring-1 ring-border"
                                    />
                                    <Input
                                        value={newColor}
                                        onChange={e => setNewColor(e.target.value)}
                                        className="font-mono uppercase"
                                        maxLength={7}
                                    />
                                </div>
                            </div>
                            <Button onClick={addColor} size="sm" className="mb-[1px]">Add</Button>
                        </div>

                        <div className="flex flex-wrap gap-3 pt-2">
                            {brand.colors.length === 0 && <span className="text-xs text-muted-foreground italic">No colors added</span>}
                            {brand.colors.map(color => (
                                <div key={color} className="group relative w-12 h-12 rounded-full ring-1 ring-border shadow-sm transition-transform hover:scale-105" style={{ backgroundColor: color }}>
                                    <button
                                        onClick={() => removeColor(color)}
                                        className="absolute -top-1 -right-1 bg-destructive text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity shadow-sm"
                                    >
                                        <X className="w-3 h-3" />
                                    </button>
                                    <div className="absolute top-full left-1/2 -translate-x-1/2 mt-1 px-1.5 py-0.5 bg-background border rounded text-[10px] font-mono opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                                        {color}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* Fonts Section */}
                <Card className="border-border shadow-sm">
                    <CardContent className="p-6 space-y-6">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 rounded-lg">
                                <Type className="w-5 h-5" />
                            </div>
                            <div>
                                <h3 className="font-bold text-foreground">Typography</h3>
                                <p className="text-xs text-muted-foreground">Headlines and body text</p>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <FontUploader
                                label="Heading Font"
                                currentAssetId={brand.fontIds.heading}
                                onAssetChange={(id) => onUpdate({ ...brand, fontIds: { ...brand.fontIds, heading: id } })}
                            />
                            <div className="h-px bg-border/50" />
                            <FontUploader
                                label="Body Font"
                                currentAssetId={brand.fontIds.body}
                                onAssetChange={(id) => onUpdate({ ...brand, fontIds: { ...brand.fontIds, body: id } })}
                            />
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Logos Section */}
            <Card className="border-border shadow-sm">
                <CardContent className="p-6 space-y-6">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300 rounded-lg">
                            <ImageIcon className="w-5 h-5" />
                        </div>
                        <div>
                            <h3 className="font-bold text-foreground">Logos & Assets</h3>
                            <p className="text-xs text-muted-foreground">SVG format recommended</p>
                        </div>
                    </div>

                    <LogoManager
                        logoIds={brand.logoIds}
                        onUpdateLogos={(ids) => onUpdate({ ...brand, logoIds: ids })}
                    />
                </CardContent>
            </Card>
        </div>
    );
}

// --- Helper Components ---

function FontUploader({ label, currentAssetId, onAssetChange }: { label: string, currentAssetId?: string, onAssetChange: (id?: string) => void }) {
    const [assetName, setAssetName] = React.useState<string | null>(null);
    const [loading, setLoading] = React.useState(false);

    React.useEffect(() => {
        if (!currentAssetId) {
            setAssetName(null);
            return;
        }
        getAsset(currentAssetId).then(a => {
            if (a) setAssetName(a.name);
        });
    }, [currentAssetId]);

    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setLoading(true);
        try {
            // Convert to base64
            const reader = new FileReader();
            reader.onload = async () => {
                const base64 = reader.result as string;
                const assetId = crypto.randomUUID();
                const newAsset: BrandAsset = {
                    id: assetId,
                    type: 'font',
                    name: file.name,
                    mimeType: file.type,
                    data: base64
                };

                await saveAsset(newAsset);
                // If replacing, optional: clean up old asset? Let's keep it simple for now.
                // ideally we should delete old asset if it's orphan, but maybe later.

                onAssetChange(assetId);
                setLoading(false);
            };
            reader.readAsDataURL(file);
        } catch (err) {
            console.error(err);
            setLoading(false);
        }
    };

    const handleRemove = async () => {
        if (currentAssetId) {
            await deleteAsset(currentAssetId);
            onAssetChange(undefined);
        }
    };

    return (
        <div className="flex items-center justify-between">
            <div className="space-y-0.5">
                <p className="text-sm font-medium">{label}</p>
                {assetName ? (
                    <p className="text-xs text-muted-foreground font-mono bg-muted inline-block px-1.5 rounded">{assetName}</p>
                ) : (
                    <p className="text-xs text-muted-foreground italic">Not set</p>
                )}
            </div>

            <div className="flex items-center gap-2">
                {loading ? (
                    <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
                ) : currentAssetId ? (
                    <Button onClick={handleRemove} variant="outline" size="sm" className="h-8 text-destructive hover:text-destructive">
                        Remove
                    </Button>
                ) : (
                    <div className="relative">
                        <input
                            type="file"
                            accept=".ttf,.otf,.woff,.woff2"
                            onChange={handleUpload}
                            className="absolute inset-0 opacity-0 cursor-pointer"
                        />
                        <Button size="sm" variant="secondary" className="h-8">
                            <Upload className="w-3.5 h-3.5 mr-2" />
                            Upload
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
}

function LogoManager({ logoIds, onUpdateLogos }: { logoIds: string[], onUpdateLogos: (ids: string[]) => void }) {
    const [logos, setLogos] = React.useState<BrandAsset[]>([]);
    const [loading, setLoading] = React.useState(false);

    React.useEffect(() => {
        const load = async () => {
            const loaded = await Promise.all(logoIds.map(id => getAsset(id)));
            setLogos(loaded.filter((l): l is BrandAsset => !!l));
        };
        load();
    }, [logoIds]);

    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files || files.length === 0) return;

        setLoading(true);
        const newIds: string[] = [];

        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            try {
                const base64 = await new Promise<string>((resolve) => {
                    const reader = new FileReader();
                    reader.onload = () => resolve(reader.result as string);
                    reader.readAsDataURL(file);
                });

                const assetId = crypto.randomUUID();
                const newAsset: BrandAsset = {
                    id: assetId,
                    type: 'logo',
                    name: file.name,
                    mimeType: file.type,
                    data: base64
                };

                await saveAsset(newAsset);
                newIds.push(assetId);
            } catch (err) {
                console.error("Error uploading logo", err);
            }
        }

        onUpdateLogos([...logoIds, ...newIds]);
        setLoading(false);
    };

    const handleRemove = async (id: string) => {
        await deleteAsset(id);
        onUpdateLogos(logoIds.filter(lid => lid !== id));
    };

    return (
        <div className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {logos.map(logo => (
                    <div key={logo.id} className="group relative aspect-square bg-muted/20 border rounded-xl flex items-center justify-center p-4">
                        <img src={logo.data} alt={logo.name} className="max-w-full max-h-full object-contain" />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-xl">
                            <Button
                                onClick={() => handleRemove(logo.id)}
                                variant="destructive"
                                size="icon"
                                className="h-8 w-8 rounded-full"
                            >
                                <Trash2 className="w-4 h-4" />
                            </Button>
                        </div>
                        <div className="absolute bottom-1 left-1 right-1 px-2 py-1 bg-background/80 backdrop-blur rounded text-[10px] truncate border opacity-0 group-hover:opacity-100 transition-opacity">
                            {logo.name}
                        </div>
                    </div>
                ))}

                <label className="aspect-square flex flex-col items-center justify-center border-2 border-dashed border-border rounded-xl cursor-pointer hover:border-primary/50 hover:bg-primary/5 transition-all">
                    <input type="file" accept=".svg,.png,.jpg,.jpeg" multiple onChange={handleUpload} className="hidden" />
                    {loading ? (
                        <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
                    ) : (
                        <>
                            <Upload className="w-6 h-6 text-muted-foreground mb-2" />
                            <span className="text-xs font-semibold text-muted-foreground">Upload</span>
                        </>
                    )}
                </label>
            </div>
        </div>
    );
}
