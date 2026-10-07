import urllib.request
import json
import urllib.parse

def search_commons(query):
    url = f"https://commons.wikimedia.org/w/api.php?action=query&list=search&srsearch={urllib.parse.quote(query)}+mime:image/svg%2Bxml&utf8=&format=json"
    req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
    res = json.loads(urllib.request.urlopen(req).read())["query"]["search"]
    return [r["title"] for r in res]

for q in ["Gran Melia", "Paradisus logo", "Innside logo", "Sol Melia logo", "Zel logo"]:
    print(q, search_commons(q))
