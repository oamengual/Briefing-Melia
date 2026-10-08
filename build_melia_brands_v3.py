import base64
import json
import os

assets_dir = "/Users/oamengual/Desktop/Projectes/Briefing-Station/Briefing Station V3/assets"
public_logos = "/Users/oamengual/Desktop/Projectes/Briefing-Station/Briefing Station V3/public/logos"
fonts_dir = "/Users/oamengual/Desktop/Projectes/Briefing-Station/Briefing Station V3/downloaded_fonts"

brands_config = [
    {
        "id": "brand_corporate", "name": "Meliá Hotels International", "colors": ["#002C5F", "#FFFFFF"],
        "logo_path": os.path.join(assets_dir, "MHI-Brand-Logo-Main-Gray-rgb.svg"), "font": "jost"
    },
    {
        "id": "brand_meliarewards", "name": "MeliáRewards", "colors": ["#0A1C2A", "#D4AF37", "#FFFFFF"],
        "logo_path": os.path.join(assets_dir, "MREW-main-logo-ver-gray-rgb.svg"), "font": "jost"
    },
    {
        "id": "brand_granmelia", "name": "Gran Meliá", "colors": ["#000000", "#D4AF37", "#FFFFFF"],
        "logo_path": os.path.join(assets_dir, "GM-Brand-Logo-Carbon-rgb.svg"), "font": "playfair"
    },
    {
        "id": "brand_me", "name": "ME by Meliá", "colors": ["#000000", "#D81B60", "#FFFFFF"],
        "logo_path": os.path.join(assets_dir, "ME-Brand-Logo-Black-rgb.svg"), "font": "montserrat"
    },
    {
        "id": "brand_collection", "name": "The Meliá Collection", "colors": ["#4A4A4A", "#E8E4D9", "#FFFFFF"],
        "logo_path": os.path.join(assets_dir, "MC-Brand-Logo-Main-Gray-rgb.svg"), "font": "playfair"
    },
    {
        "id": "brand_paradisus", "name": "Paradisus", "colors": ["#006994", "#EEDC9A", "#FFFFFF"],
        "logo_path": os.path.join(assets_dir, "PA-Brand-Logo-Main-Color-rgb.svg"), "font": "lora"
    },
    {
        "id": "brand_melia", "name": "Meliá Hotels & Resorts", "colors": ["#002C5F", "#FFFFFF"],
        "logo_path": os.path.join(assets_dir, "MEL-Brand-Logo-Main-Gray-rgb.svg"), "font": "jost"
    },
    {
        "id": "brand_zel", "name": "ZEL", "colors": ["#556B2F", "#E2725B", "#C2B280"],
        "logo_path": os.path.join(assets_dir, "ZEL-Brand-Logo-Blue-rgb.svg"), "font": "montserrat"
    },
    {
        "id": "brand_innside", "name": "INNSiDE by Meliá", "colors": ["#FFC107", "#000000", "#FFFFFF"],
        "logo_path": os.path.join(assets_dir, "IN-Brand-Logo-Black-rgb.svg"), "font": "poppins"
    },
    {
        "id": "brand_sol", "name": "Sol by Meliá", "colors": ["#00BCD4", "#FFEB3B", "#FFFFFF"],
        "logo_path": os.path.join(assets_dir, "SOL-Brand-Logo-Black-rgb.svg"), "font": "nunito"
    },
    {
        "id": "brand_affiliated", "name": "Affiliated by Meliá", "colors": ["#2C3E50", "#FFFFFF"],
        "logo_path": os.path.join(assets_dir, "AFFILIATED-Logo-Black-rgb.svg"), "font": "jost"
    },
    {
        "id": "brand_falcons", "name": "Falcon's Resorts", "colors": ["#8E44AD", "#FFFFFF"],
        "logo_path": None, "font": "montserrat"
    },
    {
        "id": "brand_pro", "name": "Meliá PRO", "colors": ["#002C5F", "#000000", "#FFFFFF"],
        "logo_path": os.path.join(assets_dir, "Melia-PRO-vertical-gray-rgb.svg"), "font": "jost"
    },
    {
        "id": "brand_escapes", "name": "Meliá Escapes", "colors": ["#002C5F", "#FFFFFF"],
        "logo_path": os.path.join(assets_dir, "Destinations-vert-color-rgb.svg"), "font": "jost"
    },
    {
        "id": "brand_mme", "name": "Meliá Meetings & Events", "colors": ["#002C5F", "#FFFFFF"],
        "logo_path": os.path.join(public_logos, "melia_meetings_events.svg"), "font": "jost"
    }
]

def read_b64(path, mime):
    if not path or not os.path.exists(path):
        return None
    with open(path, "rb") as f:
        data = f.read()
    b64 = base64.b64encode(data).decode("utf-8")
    return f"data:{mime};base64,{b64}"

fonts_data = {
    "playfair": read_b64(os.path.join(fonts_dir, "playfair.ttf"), "font/ttf"),
    "montserrat": read_b64(os.path.join(fonts_dir, "montserrat.ttf"), "font/ttf"),
    "jost": read_b64(os.path.join(fonts_dir, "jost.ttf"), "font/ttf"),
    "poppins": read_b64(os.path.join(fonts_dir, "poppins.ttf"), "font/ttf"),
    "nunito": read_b64(os.path.join(fonts_dir, "nunito.ttf"), "font/ttf"),
    "lora": read_b64(os.path.join(fonts_dir, "lora.ttf"), "font/ttf"),
}

ts_code = "import { Brand, BrandAsset } from './types';\n\n"
ts_code += "export const INITIAL_MELIA_BRANDS: Brand[] = [];\n"
ts_code += "export const INITIAL_MELIA_ASSETS: BrandAsset[] = [];\n\n"

# Inject fonts
for font_name, b64_data in fonts_data.items():
    if b64_data:
        ts_code += f"INITIAL_MELIA_ASSETS.push({{ id: 'asset_font_{font_name}', type: 'font', name: '{font_name.capitalize()}', mimeType: 'font/ttf', data: '{b64_data}' }});\n"

for b in brands_config:
    b64_url = read_b64(b["logo_path"], "image/svg+xml")
    
    name_esc = b['name'].replace("'", "\\'")
    
    if not b64_url:
        svg = f'''<svg xmlns="http://www.w3.org/2000/svg" width="400" height="150" viewBox="0 0 400 150">
            <rect width="100%" height="100%" fill="transparent" />
            <text x="50%" y="50%" font-family="sans-serif" font-size="36" fill="{b['colors'][0]}" dominant-baseline="middle" text-anchor="middle">{name_esc}</text>
        </svg>'''
        b64_url = "data:image/svg+xml;base64," + base64.b64encode(svg.encode('utf-8')).decode('utf-8')
    
    asset_id = f"asset_logo_{b['id']}"
    ts_code += f"INITIAL_MELIA_ASSETS.push({{ id: '{asset_id}', type: 'logo', name: \"{name_esc} Logo\", mimeType: 'image/svg+xml', data: '{b64_url}' }});\n"
    
    colors_json = json.dumps(b['colors'])
    font_id = f"asset_font_{b['font']}"
    font_ids = f"{{ heading: '{font_id}', body: '{font_id}' }}"
    
    ts_code += f"""INITIAL_MELIA_BRANDS.push({{
        id: '{b['id']}',
        name: "{name_esc}",
        colors: {colors_json},
        logoIds: ['{asset_id}'],
        fontIds: {font_ids}
    }});\n"""

with open('lib/melia-brands.ts', 'w', encoding='utf-8') as f:
    f.write(ts_code)

print("Done generating melia-brands.ts")
