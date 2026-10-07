const https = require('https');

function fetchHtml(path) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'www.melia.com',
      port: 443,
      path: path,
      method: 'GET',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36'
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
    try {
        const html = await fetchHtml('/en/brands/gran-melia');
        // Find src attributes
        const regex = /src=["'](https:\/\/?[^"']*logo[^"']*)["']/gi;
        let match;
        while ((match = regex.exec(html)) !== null) {
            console.log("FOUND SRC:", match[1]);
        }
    } catch(e) {}
})();
