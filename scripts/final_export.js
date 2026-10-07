const fs = require('fs');
const path = require('path');

// 1. Data Validation Consolidation (excluding USPs)
const CSV_DIR = path.join(__dirname, '..', 'CSV');
const OUTPUT_VALIDATION = path.join(CSV_DIR, 'DATA_VALIDATION.csv');

const tablesToMerge = [
    'Tamanos.csv',
    'Formatos.csv',
    'Estrategias.csv',
    'Brands.csv',
    'Canales.csv',
    'Hoteles_Destinos.csv',
    'Campanas.csv',
    'Mercado_Idioma.csv',
    'Agencias.csv',
    'Contenidos.csv'
];

function readCSV(filename) {
    const fullPath = path.join(CSV_DIR, filename);
    if (!fs.existsSync(fullPath)) return null;
    const content = fs.readFileSync(fullPath, 'utf-8');
    const lines = content.split('\n').filter(line => line.trim() !== '');
    if (lines.length === 0) return null;
    const headers = lines[0].split(',');
    const rows = lines.slice(1).map(line => line.split(','));
    return { headers, rows };
}

const validationData = tablesToMerge
    .map(readCSV)
    .filter(d => d !== null);

if (validationData.length > 0) {
    const maxRows = Math.max(...validationData.map(d => d.rows.length));
    const combinedHeaders = validationData.flatMap(d => d.headers);
    const combinedRows = [];

    for (let i = 0; i < maxRows; i++) {
        const row = validationData.flatMap(d => {
            const tableRow = d.rows[i];
            if (tableRow) return tableRow;
            return new Array(d.headers.length).fill('');
        });
        combinedRows.push(row.join(','));
    }

    const csvOutput = [combinedHeaders.join(','), ...combinedRows].join('\n');
    fs.writeFileSync(OUTPUT_VALIDATION, csvOutput);
    console.log(`Consolidated DATA_VALIDATION.csv created.`);
}

// 2. Placements Extraction from constants.ts
// We'll manually define the placements from the constants file since it's cleaner than regex parsing for this structure
const PLACEMENTS = [
    { channel: 'Amazon', name: 'Wide Skyscraper', size: '160x600', width: 160, height: 600, weight: 150, type: 'img' },
    { channel: 'Amazon', name: 'Half Page Ad', size: '300x600', width: 300, height: 600, weight: 150, type: 'img' },
    { channel: 'Amazon', name: 'Medium Rectangle', size: '300x250', width: 300, height: 250, weight: 150, type: 'img' },
    { channel: 'Amazon', name: 'Mobile Leaderboard', size: '320x50', width: 320, height: 50, weight: 150, type: 'img' },
    { channel: 'Amazon', name: 'Leaderboard', size: '728x90', width: 728, height: 90, weight: 150, type: 'img' },
    { channel: 'Amazon', name: 'Billboard', size: '970x250', width: 970, height: 250, weight: 150, type: 'img' },
    { channel: 'App', name: 'Fondo', size: '1080x1200', width: 1080, height: 1200, weight: 500, type: 'img' },
    { channel: 'App', name: 'Stories', size: '1080x1700', width: 1080, height: 1700, weight: 500, type: 'img' },
    { channel: 'Criteo RTG', name: 'Banner Genérico', size: '1200x628', width: 1200, height: 628, weight: 150, type: 'img' },
    { channel: 'Criteo RTG', name: 'Banner Cuadrado', size: '1200x1200', width: 1200, height: 1200, weight: 150, type: 'img' },
    { channel: 'Criteo RTG', name: 'Banner Vertical', size: '800x1200', width: 800, height: 1200, weight: 150, type: 'img' },
    { channel: 'Criteo RTG', name: 'Skyscraper', size: '120x600', width: 120, height: 600, weight: 150, type: 'img' },
    { channel: 'Criteo RTG', name: 'Wide Skyscraper', size: '160x600', width: 160, height: 600, weight: 150, type: 'img' },
    { channel: 'Criteo RTG', name: 'Half Page Ad', size: '300x600', width: 300, height: 600, weight: 150, type: 'img' },
    { channel: 'Criteo RTG', name: 'Medium Rectangle', size: '300x250', width: 300, height: 250, weight: 150, type: 'img' },
    { channel: 'Criteo RTG', name: 'Large Rectangle', size: '336x280', width: 336, height: 280, weight: 150, type: 'img' },
    { channel: 'Criteo RTG', name: 'Mobile Leaderboard', size: '320x50', width: 320, height: 50, weight: 150, type: 'img' },
    { channel: 'Criteo RTG', name: 'Full Banner', size: '468x60', width: 468, height: 60, weight: 150, type: 'img' },
    { channel: 'Criteo RTG', name: 'Leaderboard', size: '728x90', width: 728, height: 90, weight: 150, type: 'img' },
    { channel: 'Criteo RTG', name: 'Large Leaderboard', size: '970x90', width: 970, height: 90, weight: 150, type: 'img' },
    { channel: 'Criteo RTG', name: 'Billboard', size: '970x250', width: 970, height: 250, weight: 150, type: 'img' },
    { channel: 'YT / Demand Gen', name: 'Landscape', size: '1200x628', width: 1200, height: 628, weight: 150, type: 'img' },
    { channel: 'YT / Demand Gen', name: 'Square', size: '1200x1200', width: 1200, height: 1200, weight: 150, type: 'img' },
    { channel: 'YT / Demand Gen', name: 'Portrait', size: '960x1200', width: 960, height: 1200, weight: 150, type: 'img' },
    { channel: 'Meta', name: 'Image Feed', size: '1080x1080', width: 1080, height: 1080, weight: 150, type: 'img' },
    { channel: 'Meta', name: 'Stories Image', size: '1080x1920', width: 1080, height: 1920, weight: 150, type: 'img' },
    { channel: 'Meta', name: 'Vídeo feed', size: '1080x1080', width: 1080, height: 1080, weight: 4096, type: 'vid' },
    { channel: 'Meta', name: 'Vídeo stories', size: '1080x1920', width: 1080, height: 1920, weight: 4096, type: 'vid' },
    { channel: 'Newsletter', name: 'Desktop', size: '1200x900', width: 1200, height: 900, weight: 500, type: 'img' },
    { channel: 'Newsletter', name: 'Mobile', size: '1200x1200', width: 1200, height: 1200, weight: 500, type: 'img' },
    { channel: 'Newsletter', name: 'Footer', size: '1200x900', width: 1200, height: 900, weight: 500, type: 'img' },
    { channel: 'Paquetes', name: 'Slide Paquetes RIU', size: '1366x600', width: 1366, height: 600, weight: 500, type: 'img' },
    { channel: 'Paquetes', name: 'Slide Mobile Paquetes RIU', size: '480x400', width: 480, height: 400, weight: 500, type: 'img' },
    { channel: 'Paquetes', name: 'Slide Paquetes US/CA', size: '1366x400', width: 1366, height: 400, weight: 500, type: 'img' },
    { channel: 'Paquetes', name: 'Paquetes MX Banner 1', size: '1920x450', width: 1920, height: 450, weight: 500, type: 'img' },
    { channel: 'Meta', name: 'Videotemplate vertical', size: '1080x1920', width: 1080, height: 1920, weight: 10240, type: 'vid' },
    { channel: 'Meta', name: 'Videotemplate cuadrado', size: '1080x1080', width: 1080, height: 1080, weight: 10240, type: 'vid' },
    { channel: 'Tik Tok', name: 'Vídeo vertical', size: '1080x1920', width: 1080, height: 1920, weight: 10240, type: 'vid' },
    { channel: 'Web', name: 'Slide ofertas desktop', size: '1366x600', width: 1366, height: 600, weight: 500, type: 'img' },
    { channel: 'Web', name: 'Landing desktop', size: '2732x1200', width: 2732, height: 1200, weight: 1024, type: 'img' }
];

const PLACEMENT_HEADERS = ['canal', 'placement', 'nombre', 'ancho', 'alto', 'peso max', 'tipologia'];
const placementRows = PLACEMENTS.map(p => [
    `"${p.channel}"`,
    `"${p.name}"`,
    `"${p.size}"`,
    p.width,
    p.height,
    p.weight,
    p.type
].join(','));

const placementOutput = [PLACEMENT_HEADERS.join(','), ...placementRows].join('\n');
fs.writeFileSync(path.join(CSV_DIR, 'placements.csv'), placementOutput);
console.log(`Exported placements.csv with ${PLACEMENTS.length} records.`);
