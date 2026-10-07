const fs = require('fs');
const path = require('path');

const CSV_DIR = path.join(__dirname, '..', 'CSV');
if (!fs.existsSync(CSV_DIR)) {
    fs.mkdirSync(CSV_DIR);
}

function parseCSV(filePath) {
    const content = fs.readFileSync(filePath, 'utf-8');
    const lines = content.split('\n').filter(line => line.trim() !== '');
    const headers = lines[0].split(',');
    const data = lines.slice(1).map(line => {
        const values = line.split(',');
        const obj = {};
        headers.forEach((header, index) => {
            obj[header] = values[index] ? values[index].trim() : '';
        });
        return obj;
    });
    return { headers, data };
}

const dataValidationPath = path.join(__dirname, '..', 'data validation.csv');
if (fs.existsSync(dataValidationPath)) {
    const { headers, data } = parseCSV(dataValidationPath);

    const tables = {
        'Tamanos': ['Tamaño'],
        'Formatos': ['Formato', 'Formato_Abr'],
        'Estrategias': ['Estrategia'],
        'Brands': ['Brand'],
        'Canales': ['Canal', 'Abr_Canal'],
        'Hoteles': ['Hotel', 'Abr_Hotel'],
        'Destinos': ['Destino', 'Abr_Destino'],
        'Campanas': ['Campaña', 'Abr_Campaña'],
        'Mercado_Idioma': ['Mercado-Idioma'],
        'Agencias': ['Agencias', 'Abr_Agencias'],
        'Contenidos': ['Contenido', 'Abr_Contenido'],
        'USPs': [
            'USP_ID', 'USP_es-es', 'USP_en-us', 'USP_de-de', 
            'USP_fr-fr', 'USP_nl-nl', 'USP_it-it', 'USP_pt-pt', 'USP_pl-pl'
        ],
        'placements': [
            'Placement_Channel', 'Placement_Name', 'Placement_Size', 
            'Placement_Width', 'Placement_Height', 'Placement_Weight', 'Placement_Type'
        ]
    };

    Object.entries(tables).forEach(([tableName, columnNames]) => {
        // Only export if all columns exist in the header
        if (!columnNames.every(col => headers.includes(col))) {
            console.warn(`Skipping ${tableName}.csv - missing columns in data validation.csv`);
            return;
        }

        let outputHeaders = columnNames;
        // Strip prefixes for USPs and Placements so the app still works identically
        if (tableName === 'USPs') {
            outputHeaders = columnNames.map(col => col.replace('USP_', ''));
        } else if (tableName === 'placements') {
            outputHeaders = columnNames.map(col => col.replace('Placement_', ''));
            // placement original headers use exactly Channel,Name,Size,Width,Height,Weight,Type
        }

        const tableRows = data
            .map(row => columnNames.map(col => row[col]))
            .filter(rowValues => rowValues.some(val => val !== '')) // Remove empty rows
            // Deduplicate
            .filter((value, index, self) => 
                index === self.findIndex((t) => JSON.stringify(t) === JSON.stringify(value))
            );

        if (tableRows.length > 0) {
            const csvContent = [
                outputHeaders.join(','),
                ...tableRows.map(row => row.join(','))
            ].join('\n');
            fs.writeFileSync(path.join(CSV_DIR, `${tableName}.csv`), csvContent);
            console.log(`Exported ${tableName}.csv`);
        }
    });
}

console.log('Data validation tables exported successfully to /CSV folder.');
