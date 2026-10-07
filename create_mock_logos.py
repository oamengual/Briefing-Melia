import json
import base64
import os

# Create base64 SVGs for each brand
brands = [
    {"id": "brand_meliarewards", "name": "MeliáRewards", "font": "sans-serif", "color": "#0A1C2A"},
    {"id": "brand_granmelia", "name": "Gran Meliá", "font": "serif", "color": "#000000"},
    {"id": "brand_me", "name": "ME by Meliá", "font": "sans-serif", "color": "#000000", "weight": "bold"},
    {"id": "brand_paradisus", "name": "Paradisus", "font": "serif", "color": "#006994"},
    {"id": "brand_melia", "name": "Meliá", "font": "sans-serif", "color": "#002C5F", "letter-spacing": "2px"},
    {"id": "brand_innside", "name": "INNSiDE", "font": "sans-serif", "color": "#000000", "weight": "900"},
    {"id": "brand_sol", "name": "Sol", "font": "sans-serif", "color": "#00BCD4"},
    {"id": "brand_zel", "name": "ZEL", "font": "sans-serif", "color": "#556B2F", "letter-spacing": "5px"}
]

ts_code = "import { Brand } from './types';\n\nexport const INITIAL_MELIA_BRANDS: Brand[] = [\n"

for b in brands:
    weight = b.get("weight", "normal")
    spacing = b.get("letter-spacing", "normal")
    svg = f'''<svg xmlns="http://www.w3.org/2000/svg" width="300" height="100" viewBox="0 0 300 100">
        <rect width="100%" height="100%" fill="transparent" />
        <text x="50%" y="50%" font-family="{b['font']}" font-size="32" font-weight="{weight}" letter-spacing="{spacing}" fill="{b['color']}" dominant-baseline="middle" text-anchor="middle">{b['name']}</text>
    </svg>'''
    b64 = "data:image/svg+xml;base64," + base64.b64encode(svg.encode('utf-8')).decode('utf-8')
    
    # We will just inject these into a new `melia-brands.ts` file, but wait, logos are managed by BrandAsset!
    # The `INITIAL_MELIA_BRANDS` needs `logoIds`, but we don't save assets synchronously here.
    # Actually, in `lib/brand-storage.ts`, when we seed the initial brands, we can ALSO seed the assets!
    pass

