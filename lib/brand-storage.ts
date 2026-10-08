'use client';

import { Brand, BrandAsset } from './types';
import { get, set, del } from 'idb-keyval';

import { INITIAL_MELIA_BRANDS, INITIAL_MELIA_ASSETS } from './melia-brands';

const BRANDS_KEY = 'mockup_brands';
const ASSETS_PREFIX = 'mockup_asset_';

export async function getBrands(): Promise<Brand[]> {
    try {
        const brands = await get<Brand[]>(BRANDS_KEY);
        const hasPoppins = await get(ASSETS_PREFIX + 'asset_font_poppins');
        if (!brands || brands.length < 15 || !hasPoppins) {
            // Seed with Meliá brands if empty or missing new typography
            await set(BRANDS_KEY, INITIAL_MELIA_BRANDS);
            for (const asset of INITIAL_MELIA_ASSETS) {
                await set(ASSETS_PREFIX + asset.id, asset);
            }
            return INITIAL_MELIA_BRANDS;
        }
        return brands;
    } catch (e) {
        console.error("Failed to load brands", e);
        return INITIAL_MELIA_BRANDS;
    }
}

export async function saveBrand(brand: Brand) {
    try {
        const brands = await getBrands();
        const existingIndex = brands.findIndex(b => b.id === brand.id);
        if (!brand.id) brand.id = crypto.randomUUID();
        
        if (existingIndex >= 0) {
            brands[existingIndex] = brand;
        } else {
            brands.push(brand);
        }
        await set(BRANDS_KEY, brands);
        return brand;
    } catch (e) {
        console.error("Failed to save brand", e);
        throw e;
    }
}

export async function deleteBrand(id: string) {
    try {
        const brands = await getBrands();
        const filtered = brands.filter(b => b.id !== id);
        await set(BRANDS_KEY, filtered);
    } catch (e) {
        console.error("Failed to delete brand", e);
    }
}

export async function getAsset(id: string): Promise<BrandAsset | undefined> {
    try {
        return await get<BrandAsset>(ASSETS_PREFIX + id);
    } catch {
        return undefined;
    }
}

export async function saveAsset(asset: BrandAsset): Promise<string> {
    try {
        if (!asset.id) asset.id = crypto.randomUUID();
        await set(ASSETS_PREFIX + asset.id, asset);
        return asset.id;
    } catch (e) {
        console.error("Failed to upload asset", e);
        throw e;
    }
}

export async function deleteAsset(id: string) {
    try {
        await del(ASSETS_PREFIX + id);
    } catch (e) {
        console.error("Failed to delete asset", e);
    }
}

export function fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = error => reject(error);
    });
}
