import urllib.request
import re
import base64

urls = [
    ("brand_granmelia", "https://brandfetch.com/granmelia.com"),
    ("brand_paradisus", "https://brandfetch.com/paradisus.com"),
    ("brand_me", "https://brandfetch.com/mebymelia.com"),
    ("brand_zel", "https://brandfetch.com/hellozel.com"),
    ("brand_innside", "https://brandfetch.com/innside.com"),
    ("brand_sol", "https://brandfetch.com/solbymelia.com")
]

for bid, url in urls:
    try:
        req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
        html = urllib.request.urlopen(req).read().decode('utf-8')
        match = re.search(r'https://asset\.brandfetch\.io/[^"]+', html)
        if match:
            print(f"{bid}: {match.group(0)}")
        else:
            print(f"{bid}: Not found in HTML")
    except Exception as e:
        print(f"Error {bid}: {e}")
