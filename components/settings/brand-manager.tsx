'use client';

import * as React from 'react';
import { Plus, Trash2, Upload, Type, Palette, Image as ImageIcon, Save, ArrowLeft, Loader2, Edit2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Brand, BrandAsset } from '@/lib/types';
import { getBrands, saveBrand, deleteBrand, saveAsset, getAsset, fileToBase64 } from '@/lib/brand-storage';
import { cn } from "@/lib/utils";
import JSZip from 'jszip';
import { toast } from 'sonner';

export function BrandManager() {
    const [brands, setBrands] = React.useState<Brand[]>([]);
    const [selectedBrand, setSelectedBrand] = React.useState<Brand | null>(null);
    const [isLoading, setIsLoading] = React.useState(true);
    const [isSaving, setIsSaving] = React.useState(false);

    // Editor State
    const [brandName, setBrandName] = React.useState('');
    const [brandColors, setBrandColors] = React.useState<string[]>([]);
    const [fontAssets, setFontAssets] = React.useState<BrandAsset[]>([]);
    const [logoAssets, setLogoAssets] = React.useState<BrandAsset[]>([]);

    React.useEffect(() => {
        loadBrands();
    }, []);

    const loadBrands = async () => {
        setIsLoading(true);
        const data = await getBrands();
        setBrands(data);
        setIsLoading(false);
    };

    const handleSelectBrand = async (brand: Brand) => {
        setIsLoading(true); // Show loading while fetching assets
        setSelectedBrand(brand);
        setBrandName(brand.name);
        setBrandColors(brand.colors || []);

        // Load Assets
        try {
            const fontIds: string[] = Array.isArray(brand.fontIds) ? brand.fontIds : [];
            const fonts = await Promise.all(fontIds.map(id => getAsset(id)));
            setFontAssets(fonts.filter((f): f is BrandAsset => !!f));

            const logos = await Promise.all((brand.logoIds || []).map(id => getAsset(id)));
            setLogoAssets(logos.filter((l): l is BrandAsset => !!l));
        } catch (e) {
            console.error("Error loading assets", e);
        } finally {
            setIsLoading(false);
        }
    };

    const handleCreateBrand = () => {
        const newBrand: Brand = {
            id: crypto.randomUUID(),
            name: 'New Brand',
            colors: ['#000000', '#FFFFFF'],
            fontIds: [],
            logoIds: []
        };
        handleSelectBrand(newBrand);
    };

    const handleSave = async () => {
        if (!selectedBrand) return;
        setIsSaving(true);

        const updatedBrand: Brand = {
            ...selectedBrand,
            name: brandName,
            colors: brandColors,
            fontIds: fontAssets.map(f => f.id),
            logoIds: logoAssets.map(l => l.id)
        };

        await saveBrand(updatedBrand);
        await loadBrands();
        setSelectedBrand(updatedBrand);
        setIsSaving(false);
    };

    const handleDelete = async () => {
        if (!selectedBrand || !confirm('Delete this brand permanently? This action cannot be undone.')) return;
        await deleteBrand(selectedBrand.id);
        setSelectedBrand(null);
        await loadBrands();
    };

    // --- COLOR HANDLERS ---
    const addColor = () => setBrandColors([...brandColors, '#000000']);
    const updateColor = (index: number, val: string) => {
        const newColors = [...brandColors];
        newColors[index] = val;
        setBrandColors(newColors);
    };
    const removeColor = (index: number) => {
        const newColors = [...brandColors];
        newColors.splice(index, 1);
        setBrandColors(newColors);
    };

    // --- ASSET HANDLERS ---
    const handleFontUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files || files.length === 0) return;

        const newAssets: BrandAsset[] = [];
        let successCount = 0;

        try {
            for (let i = 0; i < files.length; i++) {
                const file = files[i];

                if (file.name.endsWith('.zip')) {
                    // Handle Zip
                    try {
                        const zip = await JSZip.loadAsync(file);
                        const fontFiles: { name: string, data: string }[] = [];

                        // Extract font files
                        await Promise.all(
                            Object.keys(zip.files).map(async (filename) => {
                                if (filename.match(/\.(ttf|woff|woff2)$/i) && !filename.startsWith('__MACOSX')) {
                                    const blob = await zip.files[filename].async('blob');
                                    // Manually convert blob to base64 to avoid double encoding issues if fileToBase64 does it
                                    // But utilizing fileToBase64 for consistency if possible, or manual:
                                    const base64 = await new Promise<string>((resolve) => {
                                        const reader = new FileReader();
                                        reader.onloadend = () => resolve(reader.result as string);
                                        reader.readAsDataURL(blob);
                                    });
                                    fontFiles.push({ name: filename.split('/').pop() || filename, data: base64 });
                                }
                            })
                        );

                        for (const font of fontFiles) {
                            const asset: BrandAsset = {
                                id: crypto.randomUUID(),
                                type: 'font',
                                name: font.name,
                                mimeType: 'font/' + font.name.split('.').pop(),
                                data: font.data
                            };
                            await saveAsset(asset);
                            newAssets.push(asset);
                            successCount++;
                        }
                    } catch (err) {
                        console.error("Error unzipping", err);
                        toast.error(`Failed to unzip ${file.name}`);
                    }
                } else {
                    // Handle Regular Font File
                    if (!file.name.match(/\.(ttf|woff|woff2)$/i)) continue;

                    const base64 = await fileToBase64(file);
                    const asset: BrandAsset = {
                        id: crypto.randomUUID(),
                        type: 'font',
                        name: file.name,
                        mimeType: file.type,
                        data: base64
                    };
                    await saveAsset(asset);
                    newAssets.push(asset);
                    successCount++;
                }
            }

            if (newAssets.length > 0) {
                setFontAssets(prev => [...prev, ...newAssets]);
                toast.success(`Successfully added ${successCount} font(s)`);
            } else if (successCount === 0) {
                toast.warning("No valid font files found.");
            }

        } catch (error) {
            console.error("Upload error", error);
            toast.error("An error occurred while uploading fonts.");
        }

        // Reset input
        e.target.value = '';
    };

    const removeFont = (id: string) => {
        setFontAssets(prev => prev.filter(f => f.id !== id));
    };

    const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const base64 = await fileToBase64(file);
        const asset: BrandAsset = {
            id: crypto.randomUUID(),
            type: 'logo',
            name: file.name,
            mimeType: file.type,
            data: base64
        };
        await saveAsset(asset);
        setLogoAssets(prev => [...prev, asset]);
    };

    const removeLogo = (id: string) => {
        setLogoAssets(prev => prev.filter(l => l.id !== id));
    };


    if (isLoading && brands.length === 0) {
        return <div className="p-12 text-center text-muted-foreground flex items-center justify-center"><Loader2 className="w-5 h-5 animate-spin mr-2" /> Loading brands...</div>;
    }

    // LIST VIEW
    if (!selectedBrand) {
        return (
            <div className="space-y-6">
                <div className="flex justify-between items-center">
                    <div className="space-y-1">
                        <h2 className="text-lg font-bold text-foreground">Brand Directory</h2>
                        <p className="text-sm text-muted-foreground">Manage brand identities, assets, and styles.</p>
                    </div>
                    <Button onClick={handleCreateBrand} size="sm" className="radius-btn font-bold">
                        <Plus className="w-4 h-4 mr-2" /> Create Brand
                    </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {brands.map(brand => (
                        <Card
                            key={brand.id}
                            className="cursor-pointer group hover:border-primary/50 transition-all overflow-hidden border border-border shadow-card radius-card"
                            onClick={() => handleSelectBrand(brand)}
                        >
                            <CardContent className="p-6 space-y-4">
                                <div className="flex items-center justify-between">
                                    <h3 className="font-bold text-lg text-foreground">{brand.name}</h3>
                                    <Edit2 className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                                </div>

                                <div className="space-y-3">
                                    {/* Color Preview */}
                                    <div className="flex gap-1.5 flex-wrap">
                                        {brand.colors?.slice(0, 5).map((c, i) => (
                                            <div key={i} className="w-6 h-6 rounded-full border border-border/50 shadow-sm" style={{ backgroundColor: c }} title={c} />
                                        ))}
                                        {(brand.colors?.length || 0) > 5 && (
                                            <div className="w-6 h-6 rounded-full bg-muted flex items-center justify-center text-[9px] font-bold text-muted-foreground border border-border">
                                                +{brand.colors.length - 5}
                                            </div>
                                        )}
                                    </div>

                                    <div className="flex items-center gap-4 text-xs font-medium text-muted-foreground pt-2 border-t border-border">
                                        <span className="flex items-center gap-1.5"><Type className="w-3.5 h-3.5" /> {(brand.fontIds || []).length} Fonts</span>
                                        <span className="flex items-center gap-1.5"><Image className="w-3.5 h-3.5" /> {(brand.logoIds || []).length} Logos</span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}

                    {/* Add New Card (Empty State) */}
                    <button
                        onClick={handleCreateBrand}
                        className="flex flex-col items-center justify-center gap-3 p-6 border-2 border-dashed border-border rounded-xl text-muted-foreground hover:bg-muted/30 hover:border-primary/50 hover:text-primary transition-all group min-h-[160px]"
                    >
                        <div className="w-10 h-10 rounded-full bg-muted group-hover:bg-primary/10 flex items-center justify-center transition-colors">
                            <Plus className="w-5 h-5" />
                        </div>
                        <span className="text-sm font-semibold">Create New Brand</span>
                    </button>
                </div>
            </div>
        );
    }

    // EDITOR VIEW
    return (
        <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
            <div className="flex items-center justify-between pb-6 border-b border-border">
                <div className="flex items-center gap-4">
                    <Button variant="outline" size="icon" onClick={() => setSelectedBrand(null)} className="h-9 w-9 radius-btn">
                        <ArrowLeft className="w-4 h-4" />
                    </Button>
                    <div>
                        <Input
                            value={brandName}
                            onChange={e => setBrandName(e.target.value)}
                            className="text-xl font-bold h-auto py-1 px-2 -ml-2 border-transparent hover:border-border focus:border-primary w-[300px] bg-transparent"
                            placeholder="Brand Name"
                        />
                    </div>
                </div>
                <div className="flex gap-2">
                    <Button variant="ghost" size="sm" onClick={handleDelete} className="text-destructive hover:bg-destructive/10 hover:text-destructive radius-btn font-semibold">
                        <Trash2 className="w-4 h-4 mr-2" /> Delete
                    </Button>
                    <Button variant="default" size="sm" onClick={handleSave} disabled={isSaving} className="min-w-[130px] radius-btn font-semibold shadow-sm">
                        {isSaving ? <Loader2 className="w-3.5 h-3.5 animate-spin mr-2" /> : <Save className="w-3.5 h-3.5 mr-2" />}
                        {isSaving ? 'Saving...' : 'Save Changes'}
                    </Button>
                </div>
            </div>

            <Tabs defaultValue="colors" className="w-full">
                <TabsList className="w-full justify-start border-b rounded-none h-auto p-0 bg-transparent gap-8 mb-6">
                    <TabsTrigger value="colors" className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-0 py-3 text-sm font-medium text-muted-foreground data-[state=active]:text-foreground">
                        <Palette className="w-4 h-4 mr-2" /> Colors
                    </TabsTrigger>
                    <TabsTrigger value="typography" className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-0 py-3 text-sm font-medium text-muted-foreground data-[state=active]:text-foreground">
                        <Type className="w-4 h-4 mr-2" /> Typography
                    </TabsTrigger>
                    <TabsTrigger value="logos" className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-0 py-3 text-sm font-medium text-muted-foreground data-[state=active]:text-foreground">
                        <ImageIcon className="w-4 h-4 mr-2" /> Logos
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="colors" className="space-y-6 focus-visible:outline-none">
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                        {brandColors.map((color, idx) => (
                            <div key={idx} className="space-y-2 group relative">
                                <div className="aspect-[4/3] rounded-lg border shadow-sm flex items-center justify-center relative overflow-hidden transition-all hover:ring-2 hover:ring-primary/50" style={{ backgroundColor: color }}>
                                    <Button
                                        variant="destructive" size="icon"
                                        className="absolute top-1 right-1 w-6 h-6 opacity-0 group-hover:opacity-100 transition-opacity shadow-sm h-6 w-6 p-0 rounded-full"
                                        onClick={() => removeColor(idx)}
                                    >
                                        <Trash2 className="w-3 h-3" />
                                    </Button>
                                </div>
                                <div className="relative">
                                    <div className="absolute left-2 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full border shadow-sm" style={{ backgroundColor: color }} />
                                    <Input
                                        value={color}
                                        onChange={(e) => updateColor(idx, e.target.value)}
                                        className="font-mono text-xs text-center pl-6 h-8 radius-input uppercase"
                                        maxLength={7}
                                    />
                                </div>
                            </div>
                        ))}
                        <Button
                            variant="outline"
                            className="aspect-[4/3] h-auto border-dashed flex flex-col items-center justify-center gap-2 hover:bg-muted/50 hover:border-primary/50 transition-colors"
                            onClick={addColor}
                        >
                            <Plus className="w-6 h-6 text-muted-foreground" />
                            <span className="text-xs font-medium text-muted-foreground">Add Color</span>
                        </Button>
                    </div>
                </TabsContent>

                <TabsContent value="typography" className="space-y-6 focus-visible:outline-none">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {fontAssets.map((font) => (
                            <Card key={font.id} className="border-border shadow-card radius-card relative group overflow-hidden">
                                <CardContent className="p-6 space-y-4">
                                    <Button
                                        variant="destructive" size="icon"
                                        className="absolute top-2 right-2 w-8 h-8 opacity-0 group-hover:opacity-100 transition-opacity z-10"
                                        onClick={() => removeFont(font.id)}
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </Button>

                                    <div className="space-y-2 w-full">
                                        <style>{`
                                            @font-face {
                                                font-family: 'Font-${font.id}';
                                                src: url('${font.data}');
                                            }
                                        `}</style>
                                        <div className="min-h-[80px] flex items-center justify-center bg-muted/30 rounded-lg p-4">
                                            <p className="text-3xl text-center" style={{ fontFamily: `'Font-${font.id}', sans-serif` }}>Aa Bb Cc</p>
                                        </div>
                                        <div className="text-center space-y-1">
                                            <p className="font-medium text-sm truncate" title={font.name}>{font.name}</p>
                                            <p className="text-xs text-muted-foreground truncate" style={{ fontFamily: `'Font-${font.id}', sans-serif` }}>The quick brown fox jumps over the lazy dog</p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}

                        <div className="aspect-[4/3] md:aspect-auto md:min-h-[240px] border-2 border-dashed border-border rounded-xl flex flex-col items-center justify-center hover:bg-muted/30 hover:border-primary/50 transition-colors group">
                            <Label htmlFor="upload-font" className="cursor-pointer text-center w-full h-full flex flex-col items-center justify-center p-6">
                                <div className="w-12 h-12 bg-background rounded-full border border-dashed border-border flex items-center justify-center mb-3 group-hover:border-primary group-hover:text-primary transition-colors shadow-sm">
                                    <Upload className="w-5 h-5 text-muted-foreground group-hover:text-primary" />
                                </div>
                                <span className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors">Upload Font File</span>
                                <p className="text-xs text-muted-foreground mt-1">.ttf, .woff, .woff2, .zip</p>
                                <Input id="upload-font" type="file" accept=".ttf,.woff,.woff2,.zip" multiple className="hidden" onChange={handleFontUpload} />
                            </Label>
                        </div>
                    </div>
                </TabsContent>

                <TabsContent value="logos" className="space-y-6 focus-visible:outline-none">
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                        {logoAssets.map((logo) => (
                            <div key={logo.id} className="group relative aspect-square border rounded-md p-4 flex items-center justify-center bg-white/50 pattern-grid-lg">
                                <img src={logo.data} alt={logo.name} className="max-w-full max-h-full object-contain" />
                                <Button
                                    variant="destructive" size="icon"
                                    className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity h-8 w-8 radius-btn shadow-sm"
                                    onClick={() => removeLogo(logo.id)}
                                >
                                    <Trash2 className="w-4 h-4" />
                                </Button>
                                <div className="absolute bottom-0 left-0 right-0 bg-background/90 backdrop-blur-sm text-foreground text-[10px] font-medium p-2 text-center opacity-0 group-hover:opacity-100 transition-opacity border-t border-border truncate">
                                    {logo.name}
                                </div>
                            </div>
                        ))}

                        <div className="aspect-square border-2 border-dashed rounded-xl flex flex-col items-center justify-center hover:bg-muted/30 hover:border-primary/50 transition-colors">
                            <Label htmlFor="upload-logo" className="cursor-pointer text-center w-full h-full flex flex-col items-center justify-center p-4">
                                <Upload className="w-8 h-8 text-muted-foreground mb-3" />
                                <span className="text-sm font-semibold text-foreground">Upload SVG</span>
                                <span className="text-xs text-muted-foreground mt-1">Vector format only</span>
                                <Input id="upload-logo" type="file" accept=".svg" className="hidden" onChange={handleLogoUpload} />
                            </Label>
                        </div>
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    );
}

function Image(props: any) {
    return <ImageIcon {...props} />
}
