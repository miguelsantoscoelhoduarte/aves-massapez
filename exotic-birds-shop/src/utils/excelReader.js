import { buildProductsFromSheet } from './catalogParser';

export async function loadCatalogFromExcel(filePath, language = 'pt') {
  const response = await fetch(filePath);
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const arrayBuffer = await response.arrayBuffer();
  const XLSXModule = await import('xlsx');
  const XLSX = XLSXModule.default || XLSXModule;

  const workbook = XLSX.read(arrayBuffer, { type: 'array' });
  const sheetName = workbook.SheetNames[0];
  if (!sheetName) {
    throw new Error('Excel workbook has no sheets');
  }

  const worksheet = workbook.Sheets[sheetName];
  const rows = XLSX.utils.sheet_to_json(worksheet, { header: 1, defval: '' });
  if (rows.length < 2) {
    throw new Error('Excel file must have header row and at least one data row');
  }

  return buildProductsFromSheet(rows, language);
}
