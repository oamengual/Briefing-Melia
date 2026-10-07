import urllib.request
import urllib.parse
import re
import json

queries = [
    "Meliá Hotels International",
    "Gran Meliá",
    "ME by Meliá",
    "The Meliá Collection",
    "Paradisus by Meliá",
    "Meliá Hotels & Resorts",
    "ZEL hotels",
    "INNSiDE by Meliá",
    "Sol by Meliá",
    "Affiliated by Meliá",
    "Falcon's Resorts by Meliá",
    "MeliáRewards",
    "Meliá PRO",
    "Meliá Escapes"
]

def search_logo(q):
    url = f"https://duckduckgo.com/?q={urllib.parse.quote(q + ' logo filetype:png OR filetype:svg')}&t=h_&iax=images&ia=images"
    req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)"})
    try:
        html = urllib.request.urlopen(req).read().decode("utf-8")
        match = re.search(r"vqd=([\d-]+)", html)
        if not match: return []
        vqd = match.group(1)
        api_url = f"https://duckduckgo.com/i.js?q={urllib.parse.quote(q + ' logo svg OR png transparent')}&o=json&vqd={vqd}"
        req2 = urllib.request.Request(api_url, headers={"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)"})
        res2 = urllib.request.urlopen(req2).read().decode("utf-8")
        data = json.loads(res2)
        return [r["image"] for r in data["results"][:4]]
    except Exception as e:
        return []

out = {}
for q in queries:
    out[q] = search_logo(q)

with open('logo_urls.json', 'w') as f:
    json.dump(out, f, indent=2)

print("Done")
