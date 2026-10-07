import json
import base64

brands = [
    {
        "id": "brand_meliarewards", "name": "MeliáRewards", "font": "sans-serif", "color": "#0A1C2A",
        "colors": ["#0A1C2A", "#D4AF37", "#FFFFFF"]
    },
    {
        "id": "brand_granmelia", "name": "Gran Meliá", "font": "serif", "color": "#000000",
        "colors": ["#000000", "#D4AF37", "#FFFFFF"]
    },
    {
        "id": "brand_me", "name": "ME by Meliá", "font": "sans-serif", "color": "#000000", "weight": "bold",
        "colors": ["#000000", "#D81B60", "#FFFFFF"]
    },
    {
        "id": "brand_paradisus", "name": "Paradisus", "font": "serif", "color": "#006994",
        "colors": ["#006994", "#EEDC9A", "#FFFFFF"]
    },
    {
        "id": "brand_melia", "name": "Meliá Hotels & Resorts", "font": "sans-serif", "color": "#002C5F", "letter-spacing": "2px",
        "colors": ["#002C5F", "#FFFFFF"]
    },
    {
        "id": "brand_innside", "name": "INNSiDE by Meliá", "font": "sans-serif", "color": "#000000", "weight": "900",
        "colors": ["#FFC107", "#000000", "#FFFFFF"]
    },
    {
        "id": "brand_sol", "name": "Sol by Meliá", "font": "sans-serif", "color": "#00BCD4",
        "colors": ["#00BCD4", "#FFEB3B", "#FFFFFF"]
    },
    {
        "id": "brand_zel", "name": "ZEL", "font": "sans-serif", "color": "#556B2F", "letter-spacing": "5px",
        "colors": ["#556B2F", "#E2725B", "#C2B280"]
    }
]

ts_code = "import { Brand, BrandAsset } from './types';\n\n"
ts_code += "export const INITIAL_MELIA_BRANDS: Brand[] = [];\n"
ts_code += "export const INITIAL_MELIA_ASSETS: BrandAsset[] = [];\n\n"

for b in brands:
    weight = b.get("weight", "normal")
    spacing = b.get("letter-spacing", "normal")
    svg = f'''<svg xmlns="http://www.w3.org/2000/svg" width="400" height="150" viewBox="0 0 400 150">
        <rect width="100%" height="100%" fill="transparent" />
        <text x="50%" y="50%" font-family="{b['font']}" font-size="42" font-weight="{weight}" letter-spacing="{spacing}" fill="{b['color']}" dominant-baseline="middle" text-anchor="middle">{b['name']}</text>
    </svg>'''
    b64 = "data:image/svg+xml;base64," + base64.b64encode(svg.encode('utf-8')).decode('utf-8')
    
    asset_id = f"asset_logo_{b['id']}"
    
    # Push asset
    ts_code += f"INITIAL_MELIA_ASSETS.push({{ id: '{asset_id}', type: 'logo', name: '{b['name']} Logo Primary', mimeType: 'image/svg+xml', data: '{b64}' }});\n"
    
    # Push brand
    colors_json = json.dumps(b['colors'])
    ts_code += f"""INITIAL_MELIA_BRANDS.push({{
        id: '{b['id']}',
        name: '{b['name']}',
        colors: {colors_json},
        logoIds: ['{asset_id}'],
        fontIds: {{}}
    }});\n"""

with open('lib/melia-brands.ts', 'w', encoding='utf-8') as f:
    f.write(ts_code)

