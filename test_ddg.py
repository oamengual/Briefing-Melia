import urllib.request
import urllib.parse
import re
import json

queries = [
    "Meliá Hotels International logo svg transparent OR png",
    "Gran Meliá Hotels logo svg transparent OR png",
    "ME by Meliá logo svg transparent OR png",
    "The Meliá Collection logo svg transparent OR png",
    "Paradisus by Meliá logo svg transparent OR png",
    "Meliá Hotels & Resorts logo svg transparent OR png",
    "ZEL hotels logo svg transparent OR png",
    "INNSiDE by Meliá logo svg transparent OR png",
    "Sol by Meliá logo svg transparent OR png",
    "Affiliated by Meliá logo svg transparent OR png",
    "Falcon's Resorts by Meliá logo svg transparent OR png",
    "MeliáRewards logo svg transparent OR png",
    "Meliá PRO logo svg transparent OR png",
    "Meliá Escapes logo svg transparent OR png"
]

def ddg_images(query):
    url = f"https://duckduckgo.com/?q={urllib.parse.quote(query)}&t=h_&iax=images&ia=images"
    req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
    try:
        html = urllib.request.urlopen(req).read().decode("utf-8")
        match = re.search(r"vqd=([\d-]+)", html)
        if not match: return []
        vqd = match.group(1)
        api_url = f"https://duckduckgo.com/i.js?q={urllib.parse.quote(query)}&o=json&vqd={vqd}"
        req2 = urllib.request.Request(api_url, headers={"User-Agent": "Mozilla/5.0"})
        res2 = urllib.request.urlopen(req2).read().decode("utf-8")
        data = json.loads(res2)
        return [r["image"] for r in data["results"][:3]]
    except Exception as e:
        return [str(e)]

for q in queries:
    print(q)
    for img in ddg_images(q):
        print("  " + img)

