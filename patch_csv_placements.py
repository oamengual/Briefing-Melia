import csv
import re

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
    if not line: continue
    match = re.search(r'(\d+)x(\d+)$', line)
    if not match: continue
    width, height = match.group(1), match.group(2)
    size_str = f"{width}x{height}"
    
    rest = line[:match.start()].strip()
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
        
    fmt = 'img'
    if 'MP4' in name or 'video' in name.lower() or 'anim' in name.lower(): fmt = 'vid'
    if 'HTML5' in name: fmt = 'html5'
    if 'GIF' in name: fmt = 'gif'
    
    size_limit = 150
    if '5MB' in name or '5 MB' in name: size_limit = 5000
    elif '600 KB' in name: size_limit = 600
        
    placements.append({
        "channel": found_channel,
        "name": name,
        "size": size_str,
        "width": width,
        "height": height,
        "weight": size_limit,
        "type": fmt
    })

# Read CSV and update rows
rows = []
with open('data validation.csv', 'r', encoding='utf-8') as f:
    reader = csv.reader(f)
    header = next(reader)
    for row in reader:
        rows.append(row)

# Indices for Placement columns
# Placement_Channel,Placement_Name,Placement_Size,Placement_Width,Placement_Height,Placement_Weight,Placement_Type
idx_channel = header.index("Placement_Channel")
idx_name = header.index("Placement_Name")
idx_size = header.index("Placement_Size")
idx_w = header.index("Placement_Width")
idx_h = header.index("Placement_Height")
idx_weight = header.index("Placement_Weight")
idx_type = header.index("Placement_Type")

# Ensure rows have enough columns
for i, row in enumerate(rows):
    # clear existing placement data
    row[idx_channel] = ""
    row[idx_name] = ""
    row[idx_size] = ""
    row[idx_w] = ""
    row[idx_h] = ""
    row[idx_weight] = ""
    row[idx_type] = ""

# Extend rows if placements is longer than rows
while len(rows) < len(placements):
    rows.append(["" for _ in range(len(header))])

for i, p in enumerate(placements):
    rows[i][idx_channel] = p["channel"]
    rows[i][idx_name] = p["name"]
    rows[i][idx_size] = p["size"]
    rows[i][idx_w] = p["width"]
    rows[i][idx_h] = p["height"]
    rows[i][idx_weight] = p["weight"]
    rows[i][idx_type] = p["type"]

with open('data validation.csv', 'w', encoding='utf-8', newline='') as f:
    writer = csv.writer(f)
    writer.writerow(header)
    writer.writerows(rows)

