import * as XLSX from 'xlsx';

export async function loadCatalogFromExcel(filePath, language = 'pt') {
  try {
    const response = await fetch(filePath);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const arrayBuffer = await response.arrayBuffer();
    const workbook = XLSX.read(arrayBuffer, { type: 'array' });
    
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];
    const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
    
    if (jsonData.length < 2) {
      throw new Error('Excel file must have header row and at least one data row');
    }
    
    const products = [];
    
    for (let i = 1; i < jsonData.length; i++) {
      const row = jsonData[i];
      if (!row[0]) continue; // Skip empty rows
      
      const product = {
        id: row[0] || `product-${i}`,
        name: language === 'pt' ? (row[1] || 'Produto Desconhecido') : (row[2] || 'Unknown Product'),
        basePrice: Number(row[3]) || 0,
        eggPrice: Number(row[4]) || 0,
        image: row[5] || '',
        description: language === 'pt' ? (row[6] || '') : (row[7] || ''),
        stock: row[8] || 'in',
        colors: parseArrayField(row[9], language),
        ages: parseArrayField(row[10], language)
      };
      
      products.push(product);
    }
    
    return products;
  } catch (error) {
    console.error('Error loading catalog from Excel:', error);
    throw error;
  }
}

function getDefaultImageForAnimal(animalName) {
  const name = animalName.toLowerCase();
  if (name.includes('pavão') || name.includes('peacock')) return './assets/images/pavoes_azuis.jpg';
  if (name.includes('arara') || name.includes('macaw')) return './assets/images/arara.jpeg';
  if (name.includes('papagaio') || name.includes('parrot')) return './assets/images/papagaio.jpeg';
  return './assets/images/logo.jpeg'; // fallback
}

function parseArrayField(field, language = 'pt') {
  if (!field) return [];
  
  try {
    const parsed = JSON.parse(field);
    return parsed.map(item => ({
      ...item,
      name: language === 'pt' ? (item.name_pt || item.name) : (item.name_en || item.name)
    }));
  } catch {
    // If JSON parsing fails, treat as simple comma-separated values
    return field.split(',').map(item => ({
      id: item.trim().toLowerCase().replace(/\s+/g, '-'),
      name: item.trim(),
      priceModifier: 0
    }));
  }
}