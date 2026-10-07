import urllib.request
import urllib.parse
import re
import json

def ddg_images(query):
    url = f"https://duckduckgo.com/?q={urllib.parse.quote(query)}&t=h_&iax=images&ia=images"
    req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)"})
    try:
        html = urllib.request.urlopen(req).read().decode("utf-8")
        match = re.search(r"vqd=([\d-]+)", html)
        if not match:
            return None
        vqd = match.group(1)
        api_url = f"https://duckduckgo.com/i.js?q={urllib.parse.quote(query)}&o=json&vqd={vqd}"
        req2 = urllib.request.Request(api_url, headers={"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)"})
        res2 = urllib.request.urlopen(req2).read().decode("utf-8")
        data = json.loads(res2)
        return [r["image"] for r in data["results"][:3]]
    except Exception as e:
        return str(e)

print("Meliá", ddg_images("Meliá Hotels International logo svg OR png transparent"))
print("Gran Meliá", ddg_images("Gran Meliá logo svg OR png transparent"))
print("ME", ddg_images("ME by Meliá logo svg OR png transparent"))
print("Paradisus", ddg_images("Paradisus by Meliá logo svg OR png transparent"))
print("INNSiDE", ddg_images("INNSiDE by Meliá logo svg OR png transparent"))
print("Sol", ddg_images("Sol by Meliá logo svg OR png transparent"))
print("ZEL", ddg_images("ZEL Hotels logo svg OR png transparent"))
