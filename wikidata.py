import urllib.request
import json
import urllib.parse

query = """
SELECT ?item ?itemLabel ?logo WHERE {
  ?item wdt:P361*|wdt:P127* wd:Q3305330.
  OPTIONAL { ?item wdt:P154 ?logo. }
  SERVICE wikibase:label { bd:serviceParam wikibase:language "[AUTO_LANGUAGE],en". }
}
"""
url = "https://query.wikidata.org/sparql?query=" + urllib.parse.quote(query) + "&format=json"
req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
try:
    data = json.loads(urllib.request.urlopen(req).read())
    for b in data["results"]["bindings"]:
        print(b["itemLabel"]["value"], b.get("logo", {}).get("value", "No logo"))
except Exception as e:
    print(e)
