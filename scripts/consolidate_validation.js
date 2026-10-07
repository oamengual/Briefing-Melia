const fs = require('fs');
const path = require('path');

const CSV_DIR = path.join(__dirname, '..', 'CSV');
const OUTPUT_FILE = path.join(CSV_DIR, 'DATA_VALIDATION.csv');

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
    const content = fs.readFileSync(path.join(CSV_DIR, filename), 'utf-8');
    const lines = content.split('\n').filter(line => line.trim() !== '');
    const headers = lines[0].split(',');
    const rows = lines.slice(1).map(line => line.split(','));
    return { headers, rows };
}

const allData = tablesToMerge
    .filter(file => fs.existsSync(path.join(CSV_DIR, file)))
    .map(readCSV);

if (allData.length === 0) {
    console.log('No tables found to merge.');
    process.exit(1);
}

// Get max rows
const maxRows = Math.max(...allData.map(d => d.rows.length));

// Build combined CSV
const combinedHeaders = allData.flatMap(d => d.headers);
const combinedRows = [];

for (let i = 0; i < maxRows; i++) {
    const row = allData.flatMap(d => {
        const tableRow = d.rows[i];
        if (tableRow) return tableRow;
        // Pad with empty strings for shorter tables
        return new Array(d.headers.length).fill('');
    });
    combinedRows.push(row.join(','));
}

const csvOutput = [
    combinedHeaders.join(','),
    ...combinedRows
].join('\n');

fs.writeFileSync(OUTPUT_FILE, csvOutput);
console.log(`Successfully consolidated ${tablesToMerge.length} tables into ${OUTPUT_FILE}`);
