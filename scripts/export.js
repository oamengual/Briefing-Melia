const fs = require('fs');
const path = require('path');

const MARKETS = [
    { code: 'US', name: 'Estados Unidos', selector: 'US (Estados Unidos)', defaultLang: 'en' },
    { code: 'MX', name: 'México', selector: 'MX (México)', defaultLang: 'es' },
    { code: 'ES', name: 'España', selector: 'ES (España)', defaultLang: 'es' },
    { code: 'GB', name: 'Reino Unido', selector: 'GB (Reino Unido)', defaultLang: 'en' },
    { code: 'DE', name: 'Alemania', selector: 'DE (Alemania)', defaultLang: 'de' },
    { code: 'AE', name: 'Emiratos Árabes', selector: 'AE (Emiratos Árabes)', defaultLang: 'en' }
];

const PLACEMENTS = [
    { id: 'billboard_amazon_dsp', name: 'Billboard', size: '970x250', format: 'img', channel: 'Amazon', seconds: 'na' },
    { id: 'leaderboard_amazon_dsp', name: 'Leaderboard', size: '728x90', format: 'img', channel: 'Amazon', seconds: 'na' },
    { id: 'image_feed_meta', name: 'Image Feed', size: '1080x1080', format: 'img', channel: 'Meta', seconds: 'na' },
    { id: 'stories_image_meta', name: 'Stories Image', size: '1080x1920', format: 'img', channel: 'Meta', seconds: 'na' },
    { id: 'leaderboard_criteo_rtg', name: 'Leaderboard', size: '728x90', format: 'img', channel: 'Criteo RTG', seconds: 'na' },
    { id: 'vídeo_vertical_tiktok', name: 'Vídeo vertical', size: '1080x1920', format: 'vid', channel: 'Tik Tok', seconds: '10' },
    { id: 'billboard_criteo_rtg', name: 'Billboard', size: '970x250', format: 'img', channel: 'Criteo RTG', seconds: 'na' },
    { id: 'slide_paquetes_riu_paquetes', name: 'Slide Meliá Escapes', size: '1366x600', format: 'img', channel: 'Paquetes', seconds: 'na' },
    { id: 'paquetes_mx_banner_1_paquetes', name: 'Paquetes MX Banner 1', size: '1920x450', format: 'img', channel: 'Paquetes', seconds: 'na' }
];

const campaign = {
    inputs: {
        campaignName: 'Black Friday 2026 Global',
        brand: 'Meliá',
        strategy: 'Flash',
        year: '2026',
        month: '11',
        agency: 'Internal',
        startDate: '2026-11-20',
        endDate: '2026-12-01',
        landingPageUrl: 'https://www.riu.com/black-friday'
    },
    creative: {
        claim: 'Black Friday Sale',
        discount: 'Up to 50% OFF',
        cta: 'Book Now',
        usp1: 'Best Price Guaranteed',
        usp2: 'Free Cancellation',
        usp3: 'All Inclusive'
    },
    translations: {
        'es': { claim: 'Oferta Black Friday', cta: 'Reserva Ya', discount: 'Hasta 50% Dto' },
        'de': { claim: 'Black Friday Angebote', cta: 'Jetzt Buchen', discount: 'Bis zu 50% Rabatt' },
        'fr': { claim: 'Offres Black Friday', cta: 'Réserver', discount: 'Jusqu\'à 50% de réduction' }
    },
    matrix: {
        'US (Estados Unidos)': ['billboard_amazon_dsp', 'leaderboard_amazon_dsp', 'image_feed_meta', 'stories_image_meta'],
        'GB (Reino Unido)': ['leaderboard_criteo_rtg', 'vídeo_vertical_tiktok'],
        'DE (Alemania)': ['billboard_criteo_rtg', 'image_feed_meta'],
        'ES (España)': ['image_feed_meta', 'slide_paquetes_riu_paquetes'],
        'MX (México)': ['paquetes_mx_banner_1_paquetes', 'image_feed_meta'],
        'AE (Emiratos Árabes)': ['image_feed_meta']
    }
};

const CSV_DIR = path.join(__dirname, '..', 'CSV');
if (!fs.existsSync(CSV_DIR)) {
    fs.mkdirSync(CSV_DIR);
}

const resolveToken = (token, placement, market, inputs) => {
    switch (token) {
        case 'size': return placement.size;
        case 'format': return placement.format;
        case 'strategy': return inputs.strategy;
        case 'year': return inputs.year;
        case 'month': return inputs.month;
        case 'brand': return inputs.brand;
        case 'channel': return placement.channel;
        case 'campaign_name': return inputs.campaignName;
        case 'market_code': return market.code;
        case 'language': return market.defaultLang;
        case 'agency': return inputs.agency;
        case 'content_type': return 'content';
        case 'duration': return placement.seconds;
        case 'version': return 'v1';
        default: return '';
    }
};

const structure = [
    'size', 'format', 'strategy', 'year', 'month', 'brand', 'channel',
    'campaign_name', 'market_code', 'language', 'agency', 'content_type',
    'duration', 'version'
];

const mediaRows = [];
const seenMarkets = new Set();
const creativeRows = [];
const salesforceRows = [];

Object.entries(campaign.matrix).forEach(([selector, pids]) => {
    const market = MARKETS.find(m => m.selector === selector);
    if (!market) return;

    pids.forEach(pid => {
        const placement = PLACEMENTS.find(p => p.id === pid);
        if (!placement) return;

        const parts = structure.map(token => {
            const raw = resolveToken(token, placement, market, campaign.inputs);
            return raw.trim().replace(/\s+/g, '_');
        });
        const filename = parts.join('-').toLowerCase();
        mediaRows.push({ filename, marketCode: market.code, placementName: placement.name, size: placement.size, format: placement.format });
    });

    const lang = market.defaultLang;
    const trans = campaign.translations[lang] || {};
    const content = {
        claim: trans.claim || campaign.creative.claim,
        discount: trans.discount || campaign.creative.discount,
        cta: trans.cta || campaign.creative.cta,
        usp1: trans.usp1 || campaign.creative.usp1,
        usp2: trans.usp2 || campaign.creative.usp2,
        usp3: trans.usp3 || campaign.creative.usp3
    };

    if (!seenMarkets.has(`${market.code}-${lang}`)) {
        seenMarkets.add(`${market.code}-${lang}`);
        creativeRows.push({
            filename: `generic-${campaign.inputs.strategy}-${campaign.inputs.brand}-${campaign.inputs.campaignName}-${market.code}-${lang}`.toLowerCase().replace(/\s+/g, '_'),
            marketLang: `${market.code.toLowerCase()}-${lang.toLowerCase()}`,
            ...content
        });
    }

    salesforceRows.push({
        campaign: campaign.inputs.campaignName,
        market: market.code,
        lang: lang,
        ...content
    });
});

// 1. Naming CSV
const namingHeaders = ['Filename', 'Market', 'Placement', 'Size', 'Format'];
const namingContent = [
    namingHeaders.join(','),
    ...mediaRows.map(row => [row.filename, row.marketCode, `"${row.placementName}"`, row.size, row.format].join(','))
].join('\n');
fs.writeFileSync(path.join(CSV_DIR, 'file_management_black_friday.csv'), namingContent);

// 2. Photoshop CSV
const photoshopHeaders = ['dataset_name', 'market_language', 'Claim', 'Discount', 'CTA', 'USP1', 'USP2', 'USP3'];
const photoshopContent = [
    photoshopHeaders.join(','),
    ...creativeRows.map(row => [
        row.filename,
        row.marketLang,
        `"${row.claim}"`,
        `"${row.discount}"`,
        `"${row.cta}"`,
        `"${row.usp1}"`,
        `"${row.usp2}"`,
        `"${row.usp3}"`
    ].join(','))
].join('\n');
fs.writeFileSync(path.join(CSV_DIR, 'photoshop_content_black_friday.csv'), photoshopContent);

// 3. Salesforce CSV
const salesforceHeaders = ['Campaign_Name', 'Market', 'Language', 'Claim', 'Discount', 'CTA', 'USP1', 'USP2', 'USP3'];
const salesforceContent = [
    salesforceHeaders.join(','),
    ...salesforceRows.map(row => [
        `"${row.campaign}"`,
        `"${row.market}"`,
        `"${row.lang}"`,
        `"${row.claim}"`,
        `"${row.discount}"`,
        `"${row.cta}"`,
        `"${row.usp1}"`,
        `"${row.usp2}"`,
        `"${row.usp3}"`
    ].join(','))
].join('\n');
fs.writeFileSync(path.join(CSV_DIR, 'salesforce_feed_black_friday.csv'), salesforceContent);

console.log('CSVs generated successfully in /CSV folder.');
