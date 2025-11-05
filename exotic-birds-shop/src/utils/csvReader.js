import { buildProductsFromSheet } from './catalogParser';

export async function loadCatalogFromCSV(filePath, language = 'pt') {
  const response = await fetch(filePath);
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const csvText = (await response.text()).trim();
  if (!csvText) {
    throw new Error('CSV file is empty');
  }

  const lines = csvText.split(/\r?\n/);
  if (lines.length < 2) {
    throw new Error('CSV file must have header row and at least one data row');
  }

  const rows = lines.map(line => parseCsvLine(line));
  return buildProductsFromSheet(rows, language);
}

function parseCsvLine(line) {
  const result = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];

    if (char === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      result.push(current);
      current = '';
    } else {
      current += char;
    }
  }

  result.push(current);
  return result.map(value => (typeof value === 'string' ? value.trim() : value));
}
