import os
import urllib.request
import base64
import json

os.makedirs("downloaded_fonts", exist_ok=True)

fonts = {
    "playfair": "https://raw.githubusercontent.com/google/fonts/main/ofl/playfairdisplay/PlayfairDisplay%5Bwght%5D.ttf",
    "montserrat": "https://raw.githubusercontent.com/google/fonts/main/ofl/montserrat/Montserrat%5Bwght%5D.ttf",
    "jost": "https://raw.githubusercontent.com/google/fonts/main/ofl/jost/Jost%5Bwght%5D.ttf",
    "poppins": "https://raw.githubusercontent.com/google/fonts/main/ofl/poppins/Poppins-Regular.ttf",
    "nunito": "https://raw.githubusercontent.com/google/fonts/main/ofl/nunito/Nunito%5Bwght%5D.ttf",
    "lora": "https://raw.githubusercontent.com/google/fonts/main/ofl/lora/Lora%5Bwght%5D.ttf"
}

for name, url in fonts.items():
    try:
        print(f"Downloading {name}...")
        urllib.request.urlretrieve(url, f"downloaded_fonts/{name}.ttf")
    except Exception as e:
        print(f"Failed {name}: {e}")
