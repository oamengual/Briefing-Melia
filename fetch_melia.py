import requests
import csv

url = "https://query.wikidata.org/sparql"
query = """
SELECT ?hotel ?hotelLabel ?countryLabel ?cityLabel WHERE {
  ?hotel wdt:P31/wdt:P279* wd:Q27686 . # Instance of hotel
  ?hotel wdt:P127|wdt:P137 wd:Q1544321 . # Owned by or operated by Meliá Hotels International
  OPTIONAL { ?hotel wdt:P17 ?country . }
  OPTIONAL { ?hotel wdt:P131 ?city . }
  SERVICE wikibase:label { bd:serviceParam wikibase:language "en,es". }
}
"""
headers = {'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)'}
r = requests.get(url, params={'format': 'json', 'query': query}, headers=headers)
data = r.json()

with open('wikidata_melia.csv', 'w') as f:
    writer = csv.writer(f)
    for item in data['results']['bindings']:
        writer.writerow([item.get('hotelLabel', {}).get('value', ''), item.get('countryLabel', {}).get('value', ''), item.get('cityLabel', {}).get('value', '')])

