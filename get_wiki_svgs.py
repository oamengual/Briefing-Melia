import urllib.request
import json

def get_image_url(filename):
    url = f"https://en.wikipedia.org/w/api.php?action=query&titles=File:{urllib.parse.quote(filename)}&prop=imageinfo&iiprop=url&format=json"
    req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
    try:
        data = json.loads(urllib.request.urlopen(req).read())
        pages = data['query']['pages']
        for page_id in pages:
            if 'imageinfo' in pages[page_id]:
                return pages[page_id]['imageinfo'][0]['url']
    except Exception as e:
        print(f"Error fetching {filename}: {e}")
    return None

files = [
    "Meliá_Hotels_International_logo.svg",
    "Gran_Meliá_Hotels_&_Resorts_logo.svg",
    "ME_by_Meliá_logo.svg",
    "Paradisus_by_Meliá_logo.svg",
    "INNSiDE_by_Meliá_logo.svg",
    "Sol_by_Meliá_logo.svg"
]

for f in files:
    url = get_image_url(f)
    print(f"{f}: {url}")
