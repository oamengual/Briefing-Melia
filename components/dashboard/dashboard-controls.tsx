import { Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from "@/lib/utils";

interface DashboardControlsProps {
    searchTerm: string;
    setSearchTerm: (val: string) => void;
    selectedBrand: string;
    setSelectedBrand: (val: string) => void;
    availableBrands: string[];
}

export function DashboardControls({
    searchTerm,
    setSearchTerm,
    selectedBrand,
    setSelectedBrand,
    availableBrands
}: DashboardControlsProps) {
    return (
        <div className="flex flex-col lg:flex-row gap-4 items-center pt-4">
            <div className="w-full lg:w-[320px] relative group">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                    type="text"
                    placeholder="Search campaigns"
                    className="pl-10 h-10 radius-input border-border bg-background focus:ring-primary transition-all font-medium"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            <div className="flex flex-1 items-center gap-2 overflow-x-auto no-scrollbar py-2">
                <Button
                    variant={selectedBrand === 'all' ? 'default' : 'secondary'}
                    className={cn("h-8 radius-btn px-4 text-xs font-medium transition-all shrink-0")}
                    onClick={() => setSelectedBrand('all')}
                >
                    All Brands
                </Button>
                {availableBrands.map(b => (
                    <Button
                        key={b}
                        variant={selectedBrand === b ? 'default' : 'secondary'}
                        className={cn("h-8 radius-btn px-4 text-xs font-medium transition-all shrink-0")}
                        onClick={() => setSelectedBrand(b)}
                    >
                        {b}
                    </Button>
                ))}
            </div>
        </div>
    );
}
