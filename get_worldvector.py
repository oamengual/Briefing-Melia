import urllib.request
import re
import base64

urls = [
    "https://worldvectorlogo.com/logo/melia-hoteles",
    "https://worldvectorlogo.com/logo/sol-melia",
    "https://worldvectorlogo.com/logo/me-by-melia",
    "https://worldvectorlogo.com/logo/paradisus-resorts",
    "https://worldvectorlogo.com/logo/gran-melia",
    "https://worldvectorlogo.com/logo/innside"
]

for url in urls:
    try:
        req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
        html = urllib.request.urlopen(req).read().decode('utf-8')
        match = re.search(r'href="(https://cdn\.worldvectorlogo\.com/logos/[^"]+\.svg)"', html)
        if match:
            print(f"FOUND: {match.group(1)}")
        else:
            print(f"Not found: {url}")
    except Exception as e:
        print(f"Error {url}: {e}")
