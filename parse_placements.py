import re
import json

raw_text = """EMAILEmail hero Next Gen - Clean image1100x734
EMAILEmail hero Next Gen - GIF image1100x734
EMAILPush APP - Clean image980x519
EMAILWhatsApp Business - Clean image (Max 5MB)1200x628
EMAILEmail signature800x190
SOCIALFacebook MP4 Animation1080x1350
SOCIALInstagram Stories MP4 Animation (Stories Safe Zone)1080x1920
SOCIALInstagram Reels MP4 Animation (Reels Safe Zone)1080x1920
SOCIALFacebook JPG1080x1080
DISPLAYHTML5120x600
DISPLAYHTML5160x600
DISPLAYHTML5300x50
DISPLAYHTML5300x250
DISPLAYHTML5300x600
DISPLAYHTML5320x50
DISPLAYHTML5468x60
DISPLAYHTML5728x90
DISPLAYHTML5970x250
DISPLAYRetargeting Cortinillas JPG336x280
DISPLAYRetargeting Cortinillas JPG468x60
DISPLAYRetargeting Cortinillas JPG728x90
DISPLAYRetargeting Cortinillas JPG970x90
DISPLAYRetargeting Cortinillas JPG970x250
DISPLAYRetargeting Cortinillas JPG320x480
DISPLAYRetargeting Cortinillas JPG480x320
DISPLAYAmazon120x600
DISPLAYAmazon160x600
DISPLAYAmazon300x50
DISPLAYAmazon300x250
DISPLAYAmazon300x600
DISPLAYAmazon320x50
DISPLAYAmazon468x60
DISPLAYAmazon728x90
DISPLAYAmazon970x250
DISPLAY NATIVOCreatividades nativas alta resolución (máx. 600 KB)1800x1200
SEMImagen Horizontal JPG1200x628
SEMImagen Cuadrada JPG1200x1200
SEMImagen Vertical JPG960x1200
SEMImagen Horizontal JPG APP (Max 5 MB)1200x628
SEMImagen Cuadrada JPG APP (Max 5 MB)1200x1200
SEMImagen Vertical JPG APP (Max 5 MB)1200x1500
GOOGLE BUSINESS PROFILEJPG fondo sólido (logo campaña + dto.)1920x1080
PORTUGAL HOTELSWhite2560x1440
PORTUGAL HOTELSJPG1121x900
PORTUGAL HOTELSWhite cuadrado500x500
PORTUGAL HOTELSWhite vertical768x1500
PROMO APPAPP (imagen limpia)2160x3840
PORTAL EMPLEADOBanner carrusel portada (imagen limpia)1170x500
PORTAL EMPLEADOBanner miniatura noticias274x154
PORTAL EMPLEADOBanner estático680x370
PORTAL EMPLEADONewsfeed (imagen limpia)300x300
PORTAL EMPLEADOBanner carrusel portada1204x250
OTA / APACCtrip & Meituan Flagship Store Banner1125x531
OTA / APACMeituan Flagship Store Brandzone Banner710x380
OTA / APACWeChat750x556
OTA / APACWeChat + PSD768x1024
OTA / APACWeChat + PSD1280x720
OTA / APACBaidu SEM PC Sitelink1200x400
OTA / APACBaidu SEM Mobile Sitelink518x292"""

placements = []
for line in raw_text.splitlines():
    line = line.strip()
    if not line:
        continue
    
    # Extract dimensions at the end
    match = re.search(r'(\d+)x(\d+)$', line)
    if not match:
        continue
    width = int(match.group(1))
    height = int(match.group(2))
    size_str = f"{width}x{height}"
    
    rest = line[:match.start()].strip()
    
    # Identify channels
    channels = ["EMAIL", "SOCIAL", "DISPLAY NATIVO", "DISPLAY", "SEM", "GOOGLE BUSINESS PROFILE", "PORTUGAL HOTELS", "PROMO APP", "PORTAL EMPLEADO", "OTA / APAC"]
    
    found_channel = None
    for c in channels:
        if rest.startswith(c):
            found_channel = c
            break
    
    if not found_channel:
        found_channel = "UNKNOWN"
        name = rest
    else:
        name = rest[len(found_channel):].strip()
    
    # format and maxFileSize based on name
    fmt = 'img'
    if 'MP4' in name or 'video' in name.lower() or 'anim' in name.lower():
        fmt = 'vid'
    if 'HTML5' in name:
        fmt = 'html5'
    if 'GIF' in name:
        fmt = 'gif'
        
    size_limit = 150
    if '5MB' in name or '5 MB' in name:
        size_limit = 5000
    elif '600 KB' in name or '600 KB' in name:
        size_limit = 600
        
    id_str = re.sub(r'[^a-z0-9]+', '_', f"{name} {found_channel}".lower()).strip('_')
    
    placements.append({
        "id": id_str,
        "name": name,
        "size": size_str,
        "width": width,
        "height": height,
        "format": fmt,
        "channel": found_channel,
        "seconds": "na",
        "maxFileSize": size_limit
    })

import pprint
pprint.pprint(placements)

# Now inject this into lib/constants.ts
with open('lib/constants.ts', 'r', encoding='utf-8') as f:
    constants_ts = f.read()

# Replace export const PLACEMENTS: Placement[] = [ ... ];
def generate_ts():
    lines = ["export const PLACEMENTS: Placement[] = ["]
    for p in placements:
        lines.append(f"    {{ id: '{p['id']}', name: '{p['name']}', size: '{p['size']}', width: {p['width']}, height: {p['height']}, format: '{p['format']}', channel: '{p['channel']}', seconds: '{p['seconds']}', maxFileSize: {p['maxFileSize']} }},")
    lines.append("];")
    return "\n".join(lines)

new_placements_code = generate_ts()

constants_ts = re.sub(r'export const PLACEMENTS: Placement\[\] = \[.*?\n\];', new_placements_code, constants_ts, flags=re.DOTALL)

with open('lib/constants.ts', 'w', encoding='utf-8') as f:
    f.write(constants_ts)
