export type BrandAssetType = 'font' | 'logo';

export interface BrandAsset {
    id: string; // UUID
    type: BrandAssetType;
    name: string; // filename
    mimeType: string;
    data: string; // Base64 string or Blob URL (stored in IDB)
}

export interface Brand {
    id: string;
    name: string;
    colors: string[]; // Hex codes
    fontIds: {
        heading?: string;
        body?: string;
    };
    logoIds: string[]; // References to BrandAsset IDs
}
