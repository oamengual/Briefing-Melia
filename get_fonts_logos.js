const puppeteer = require('puppeteer');
const fs = require('fs');

(async () => {
    try {
        const browser = await puppeteer.launch({ headless: 'new' });
        const page = await browser.newPage();
        await page.setUserAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36');
        
        console.log("Navigating to Meliá...");
        const response = await page.goto('https://www.melia.com/en/brands', { waitUntil: 'networkidle2' });
        console.log("Status:", response.status());

        if (response.status() === 403) {
            console.log("Blocked by WAF.");
            const body = await page.content();
            console.log(body.substring(0, 500));
            await browser.close();
            return;
        }

        const fonts = await page.evaluate(() => {
            const elements = document.querySelectorAll('h1, h2, h3, p, a, span');
            const fontSet = new Set();
            elements.forEach(el => {
                const family = window.getComputedStyle(el).fontFamily;
                if (family) fontSet.add(family);
            });
            return Array.from(fontSet);
        });
        
        console.log("Fonts found:", fonts);

        const svgs = await page.evaluate(() => {
            const svgEls = document.querySelectorAll('svg');
            const arr = [];
            svgEls.forEach(svg => {
                arr.push(svg.outerHTML);
            });
            return arr;
        });

        console.log(`Found ${svgs.length} SVGs`);
        fs.writeFileSync('melia_svgs.json', JSON.stringify(svgs));

        await browser.close();
    } catch (e) {
        console.error(e);
    }
})();
