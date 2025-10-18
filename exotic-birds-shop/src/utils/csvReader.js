export async function loadCatalogFromCSV(filePath, language = 'pt') {
  try {
    const response = await fetch(filePath);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const csvText = await response.text();
    const lines = csvText.split('\n');
    
    if (lines.length < 2) {
      throw new Error('CSV file must have header row and at least one data row');
    }
    
    const headers = parseCSVLine(lines[0]);
    const products = [];
    
    for (let i = 1; i < lines.length; i++) {
      if (!lines[i].trim()) continue; // Skip empty lines
      
      const values = parseCSVLine(lines[i]);
      console.log(`Row ${i} parsed:`, values);
      if (!values[0]) continue; // Skip rows without ID
      
      const product = {
        id: values[0] || `product-${i}`,
        name: language === 'pt' ? (values[1] || 'Produto Desconhecido') : (values[2] || 'Unknown Product'),
        basePrice: Number(values[3]) || 0,
        eggPrice: Number(values[4]) || 0,
        image: values[5] || '',
        description: language === 'pt' ? (values[6] || '') : (values[7] || ''),
        stock: values[8] || 'in',
        colors: parseSimpleField(values[9], language),
        ages: parseAgesField(values[10], language)
      };
      
      console.log('Created product:', product);
      products.push(product);
    }
    
    return products;
  } catch (error) {
    console.error('Error loading catalog from CSV:', error);
    throw error;
  }
}

function parseCSVLine(line) {
  const result = [];
  let current = '';
  let inQuotes = false;
  
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    
    if (char === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"';
        i++; // Skip next quote
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
  
  result.push(current); // Add last field
  return result;
}

function parseSimpleField(field, language = 'pt') {
  if (!field) return [];
  
  return field.split('|').map(item => ({
    id: item.trim().toLowerCase().replace(/\s+/g, '-'),
    name: item.trim(),
    priceModifier: 0
  }));
}

function parseAgesField(field, language = 'pt') {
  if (!field) return [];
  
  return field.split('|').map(item => {
    const [ageName, price] = item.split(':');
    if (!ageName || !price) return null;
    
    const trimmedAge = ageName.trim();
    let displayName = trimmedAge;
    
    // Translate age names if needed
    if (language === 'en') {
      displayName = trimmedAge
        .replace('Ovo', 'Egg')
        .replace('semana', 'week')
        .replace('semanas', 'weeks')
        .replace('mês', 'month')
        .replace('meses', 'months');
    }
    
    return {
      id: trimmedAge.toLowerCase().replace(/\s+/g, ''),
      name: displayName,
      priceModifier: 0, // Price is absolute, not a modifier
      absolutePrice: Number(price)
    };
  }).filter(Boolean);
}