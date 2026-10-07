const https = require('https');

function fetchHtml(path) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'www.melia.com',
      port: 443,
      path: path,
      method: 'GET',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
        'Accept': 'text/html,application/xhtml+xml',
        'Sec-Fetch-Dest': 'document'
      }
    };
    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', d => data += d);
      res.on('end', () => resolve(data));
    });
    req.on('error', reject);
    req.end();
  });
}

(async () => {
    const urls = [
        "/en/brands/gran-melia",
        "/en/brands/paradisus",
        "/en/brands/me",
        "/en/brands/zel",
        "/en/brands/innside",
        "/en/brands/sol"
    ];
    for (const u of urls) {
        try {
            const html = await fetchHtml(u);
            const matches = html.match(/"\/_next\/static\/media\/[^"]+\.svg[^"]*"/g);
            if (matches) {
                const unique = [...new Set(matches)];
                console.log(u, "=>", unique.filter(m => m.includes('logo') || m.includes('brand')));
            }
        } catch(e) {
            console.error(u, e.message);
        }
    }
})();
