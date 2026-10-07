const https = require('https');
const fs = require('fs');

const options = {
  hostname: 'www.melia.com',
  port: 443,
  path: '/en/brands',
  method: 'GET',
  headers: {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Accept': 'text/html,application/xhtml+xml',
    'Sec-Ch-Ua': '"Not_A Brand";v="8", "Chromium";v="120", "Google Chrome";v="120"',
    'Sec-Fetch-Dest': 'document',
    'Sec-Fetch-Mode': 'navigate',
    'Sec-Fetch-Site': 'none'
  }
};

const req = https.request(options, (res) => {
  let data = '';
  res.on('data', d => data += d);
  res.on('end', () => {
      const svgs = data.match(/<svg[\s\S]*?<\/svg>/gi) || [];
      fs.writeFileSync('all_svgs.txt', svgs.join('\n\n---\n\n'));
      console.log('Saved ' + svgs.length + ' SVGs to all_svgs.txt');
  });
});

req.on('error', console.error);
req.end();
