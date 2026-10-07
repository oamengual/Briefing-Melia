import urllib.request
import base64
import json
import os
import re

logo_urls = {
    "brand_corporate": "https://vectorseek.com/wp-content/uploads/2023/09/MELIA-HOTELS-INTERNATIONAL-Logo-Vector.svg-.png",
    "brand_meliarewards": None,
    "brand_granmelia": "https://companieslogo.com/img/orig/MEL.MC_BIG-0632a8a9.png",
    "brand_me": "https://searchlogovector.com/wp-content/uploads/2018/11/me-by-melia-logo-vector.png",
    "brand_collection": None,
    "brand_paradisus": "https://seeklogo.com/images/P/paradisus-by-melia-logo-8A168319CB-seeklogo.com.png",
    "brand_melia": "https://cdn.freelogovectors.net/svg04/melia-logo.svg",
    "brand_zel": None,
    "brand_innside": "https://images.seeklogo.com/logo-png/34/1/innside-by-melia-logo-png_seeklogo-342413.png",
    "brand_sol": "https://searchlogovector.com/wp-content/uploads/2018/11/sol-by-melia-logo-vector.png",
    "brand_affiliated": None,
    "brand_falcons": None,
    "brand_pro": None,
    "brand_escapes": None
}

brands = [
    {"id": "brand_corporate", "name": "Meliá Hotels International", "colors": ["#002C5F", "#FFFFFF"], "font": "sans-serif"},
    {"id": "brand_meliarewards", "name": "MeliáRewards", "colors": ["#0A1C2A", "#D4AF37", "#FFFFFF"], "font": "sans-serif"},
    {"id": "brand_granmelia", "name": "Gran Meliá", "colors": ["#000000", "#D4AF37", "#FFFFFF"], "font": "serif"},
    {"id": "brand_me", "name": "ME by Meliá", "colors": ["#000000", "#D81B60", "#FFFFFF"], "font": "sans-serif"},
    {"id": "brand_collection", "name": "The Meliá Collection", "colors": ["#4A4A4A", "#E8E4D9", "#FFFFFF"], "font": "serif"},
    {"id": "brand_paradisus", "name": "Paradisus", "colors": ["#006994", "#EEDC9A", "#FFFFFF"], "font": "serif"},
    {"id": "brand_melia", "name": "Meliá Hotels & Resorts", "colors": ["#002C5F", "#FFFFFF"], "font": "sans-serif"},
    {"id": "brand_zel", "name": "ZEL", "colors": ["#556B2F", "#E2725B", "#C2B280"], "font": "sans-serif"},
    {"id": "brand_innside", "name": "INNSiDE by Meliá", "colors": ["#FFC107", "#000000", "#FFFFFF"], "font": "sans-serif"},
    {"id": "brand_sol", "name": "Sol by Meliá", "colors": ["#00BCD4", "#FFEB3B", "#FFFFFF"], "font": "sans-serif"},
    {"id": "brand_affiliated", "name": "Affiliated by Meliá", "colors": ["#2C3E50", "#FFFFFF"], "font": "sans-serif"},
    {"id": "brand_falcons", "name": "Falcon's Resorts", "colors": ["#8E44AD", "#FFFFFF"], "font": "sans-serif"},
    {"id": "brand_pro", "name": "Meliá PRO", "colors": ["#002C5F", "#000000", "#FFFFFF"], "font": "sans-serif"},
    {"id": "brand_escapes", "name": "Meliá Escapes", "colors": ["#002C5F", "#FFFFFF"], "font": "sans-serif"}
]

def get_base64(url):
    if not url: return None
    try:
        req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
        data = urllib.request.urlopen(req, timeout=5).read()
        ctype = "image/png"
        if b"<svg" in data:
            ctype = "image/svg+xml"
        elif data.startswith(b'\xff\xd8'):
            ctype = "image/jpeg"
        b64 = base64.b64encode(data).decode('utf-8')
        return f"data:{ctype};base64,{b64}"
    except Exception as e:
        print(f"Error fetching {url}: {e}")
        return None

ts_code = "import { Brand, BrandAsset } from './types';\n\n"
ts_code += "export const INITIAL_MELIA_BRANDS: Brand[] = [];\n"
ts_code += "export const INITIAL_MELIA_ASSETS: BrandAsset[] = [];\n\n"

for b in brands:
    print(f"Processing {b['name']}...")
    b64_url = get_base64(logo_urls[b['id']])
    
    if not b64_url:
        print(f"Fallback for {b['name']}")
        svg = f'''<svg xmlns="http://www.w3.org/2000/svg" width="400" height="150" viewBox="0 0 400 150">
            <rect width="100%" height="100%" fill="transparent" />
            <text x="50%" y="50%" font-family="{b['font']}" font-size="38" fill="{b['colors'][0]}" font-weight="bold" dominant-baseline="middle" text-anchor="middle">{b['name']}</text>
        </svg>'''
        b64_url = "data:image/svg+xml;base64," + base64.b64encode(svg.encode('utf-8')).decode('utf-8')
    
    asset_id = f"asset_logo_{b['id']}"
    mime = "image/svg+xml" if "svg" in b64_url[:30] else ("image/jpeg" if "jpeg" in b64_url[:30] else "image/png")
    
    ts_code += f"INITIAL_MELIA_ASSETS.push({{ id: '{asset_id}', type: 'logo', name: '{b['name']} Logo Primary', mimeType: '{mime}', data: '{b64_url}' }});\n"
    
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

print("Done generating lib/melia-brands.ts")
