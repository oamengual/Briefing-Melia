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

// 1. Export USPs (simple copy with rename if needed, but the user wants individual tables)
const uspsPath = path.join(__dirname, '..', 'usps.csv');
if (fs.existsSync(uspsPath)) {
    fs.copyFileSync(uspsPath, path.join(CSV_DIR, 'USPs.csv'));
    console.log('Exported USPs.csv');
}

// 2. Export tables from data validation.csv
const dataValidationPath = path.join(__dirname, '..', 'data validation.csv');
if (fs.existsSync(dataValidationPath)) {
    const { headers, data } = parseCSV(dataValidationPath);

    const tables = {
        'Tamanos': ['Tamaño'],
        'Formatos': ['Formato', 'Formato_Abr'],
        'Estrategias': ['Estrategia'],
        'Brands': ['Brand'],
        'Canales': ['Canal', 'Abr_Canal'],
        'Hoteles_Destinos': ['Hotel/Destino/Categorización', 'Abr_Hotel/Destino/Categorización'],
        'Campanas': ['Campaña', 'Abr_Campaña'],
        'Mercado_Idioma': ['Mercado-Idioma'],
        'Agencias': ['Agencias', 'Abr_Agencias'],
        'Contenidos': ['Contenido', 'Abr_Contenido']
    };

    Object.entries(tables).forEach(([tableName, columnNames]) => {
        const tableRows = data
            .map(row => columnNames.map(col => row[col]))
            .filter(rowValues => rowValues.some(val => val !== '')) // Remove empty rows
            // Deduplicate
            .filter((value, index, self) => 
                index === self.findIndex((t) => JSON.stringify(t) === JSON.stringify(value))
            );

        if (tableRows.length > 0) {
            const csvContent = [
                columnNames.join(','),
                ...tableRows.map(row => row.join(','))
            ].join('\n');
            fs.writeFileSync(path.join(CSV_DIR, `${tableName}.csv`), csvContent);
            console.log(`Exported ${tableName}.csv`);
        }
    });
}

console.log('Data validation tables exported successfully to /CSV folder.');
