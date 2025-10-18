const XLSX = require('xlsx');
const fs = require('fs');
const path = require('path');

// Sample catalog data with translations
const catalogData = [
  ['ID', 'Name_PT', 'Name_EN', 'Base Price', 'Egg Price', 'Image', 'Description_PT', 'Description_EN', 'Stock', 'Colors', 'Ages'],
  [
    'pavoes-azuis',
    'Pavões Azuis',
    'Blue Peacocks',
    120,
    50,
    './assets/images/pavoes_azuis.jpg',
    'Lindos pavões azuis criados com muito cuidado e carinho. Aves saudáveis e bem socializadas.',
    'Beautiful blue peacocks raised with great care and affection. Healthy and well-socialized birds.',
    'in',
    JSON.stringify([
      { id: "blue", name_pt: "Azul Tradicional", name_en: "Traditional Blue", priceModifier: 0 },
      { id: "royal-blue", name_pt: "Azul Real", name_en: "Royal Blue", priceModifier: 30 },
      { id: "peacock-green", name_pt: "Verde Pavão", name_en: "Peacock Green", priceModifier: 20 }
    ]),
    JSON.stringify([
      { id: "egg", name_pt: "Ovo", name_en: "Egg", priceModifier: -70 },
      { id: "1week", name_pt: "1 semana", name_en: "1 week", priceModifier: -60 },
      { id: "2weeks", name_pt: "2 semanas", name_en: "2 weeks", priceModifier: -50 },
      { id: "3weeks", name_pt: "3 semanas", name_en: "3 weeks", priceModifier: -40 },
      { id: "1month", name_pt: "1 mês", name_en: "1 month", priceModifier: 0 },
      { id: "2months", name_pt: "2 meses", name_en: "2 months", priceModifier: 10 },
      { id: "3months", name_pt: "3 meses", name_en: "3 months", priceModifier: 20 },
      { id: "4months", name_pt: "4 meses", name_en: "4 months", priceModifier: 30 },
      { id: "5months", name_pt: "5 meses", name_en: "5 months", priceModifier: 40 },
      { id: "6months", name_pt: "6 meses", name_en: "6 months", priceModifier: 50 },
      { id: "7months", name_pt: "7 meses", name_en: "7 months", priceModifier: 60 },
      { id: "8months", name_pt: "8 meses", name_en: "8 months", priceModifier: 70 },
      { id: "9months", name_pt: "9 meses", name_en: "9 months", priceModifier: 80 },
      { id: "10months", name_pt: "10 meses", name_en: "10 months", priceModifier: 90 },
      { id: "11months", name_pt: "11 meses", name_en: "11 months", priceModifier: 100 },
      { id: "12months", name_pt: "12 meses", name_en: "12 months", priceModifier: 110 }
    ])
  ],
  [
    'arara',
    'Arara Vermelha',
    'Red Macaw',
    2400,
    1200,
    './assets/images/arara.jpeg',
    'Majestosa arara vermelha, ave símbolo da fauna brasileira.',
    'Majestic red macaw, symbolic bird of Brazilian fauna.',
    'low',
    JSON.stringify([
      { id: "red", name_pt: "Vermelho Clássico", name_en: "Classic Red", priceModifier: 0 },
      { id: "scarlet", name_pt: "Escarlate", name_en: "Scarlet", priceModifier: 100 }
    ]),
    JSON.stringify([
      { id: "egg", name_pt: "Ovo", name_en: "Egg", priceModifier: -1200 },
      { id: "1week", name_pt: "1 semana", name_en: "1 week", priceModifier: -1000 },
      { id: "2weeks", name_pt: "2 semanas", name_en: "2 weeks", priceModifier: -800 },
      { id: "3weeks", name_pt: "3 semanas", name_en: "3 weeks", priceModifier: -600 },
      { id: "1month", name_pt: "1 mês", name_en: "1 month", priceModifier: 0 },
      { id: "2months", name_pt: "2 meses", name_en: "2 months", priceModifier: 100 },
      { id: "3months", name_pt: "3 meses", name_en: "3 months", priceModifier: 200 },
      { id: "4months", name_pt: "4 meses", name_en: "4 months", priceModifier: 250 },
      { id: "5months", name_pt: "5 meses", name_en: "5 months", priceModifier: 280 },
      { id: "6months", name_pt: "6 meses", name_en: "6 months", priceModifier: 300 },
      { id: "7months", name_pt: "7 meses", name_en: "7 months", priceModifier: 320 },
      { id: "8months", name_pt: "8 meses", name_en: "8 months", priceModifier: 340 },
      { id: "9months", name_pt: "9 meses", name_en: "9 months", priceModifier: 360 },
      { id: "10months", name_pt: "10 meses", name_en: "10 months", priceModifier: 380 },
      { id: "11months", name_pt: "11 meses", name_en: "11 months", priceModifier: 400 },
      { id: "12months", name_pt: "12 meses", name_en: "12 months", priceModifier: 450 }
    ])
  ],
  [
    'papagaio',
    'Papagaio Cinzento',
    'African Grey Parrot',
    800,
    400,
    './assets/images/papagaio.jpeg',
    'Papagaio cinzento africano, conhecido pela inteligência.',
    'African grey parrot, known for its intelligence.',
    'out',
    JSON.stringify([
      { id: "grey", name_pt: "Cinzento", name_en: "Grey", priceModifier: 0 }
    ]),
    JSON.stringify([
      { id: "egg", name_pt: "Ovo", name_en: "Egg", priceModifier: -400 },
      { id: "1week", name_pt: "1 semana", name_en: "1 week", priceModifier: -350 },
      { id: "2weeks", name_pt: "2 semanas", name_en: "2 weeks", priceModifier: -300 },
      { id: "3weeks", name_pt: "3 semanas", name_en: "3 weeks", priceModifier: -250 },
      { id: "1month", name_pt: "1 mês", name_en: "1 month", priceModifier: 0 },
      { id: "2months", name_pt: "2 meses", name_en: "2 months", priceModifier: 20 },
      { id: "3months", name_pt: "3 meses", name_en: "3 months", priceModifier: 40 },
      { id: "4months", name_pt: "4 meses", name_en: "4 months", priceModifier: 60 },
      { id: "5months", name_pt: "5 meses", name_en: "5 months", priceModifier: 80 },
      { id: "6months", name_pt: "6 meses", name_en: "6 months", priceModifier: 100 },
      { id: "7months", name_pt: "7 meses", name_en: "7 months", priceModifier: 120 },
      { id: "8months", name_pt: "8 meses", name_en: "8 months", priceModifier: 140 },
      { id: "9months", name_pt: "9 meses", name_en: "9 months", priceModifier: 150 },
      { id: "10months", name_pt: "10 meses", name_en: "10 months", priceModifier: 160 },
      { id: "11months", name_pt: "11 meses", name_en: "11 months", priceModifier: 170 },
      { id: "12months", name_pt: "12 meses", name_en: "12 months", priceModifier: 180 }
    ])
  ]
];

// Create workbook and worksheet
const wb = XLSX.utils.book_new();
const ws = XLSX.utils.aoa_to_sheet(catalogData);

// Set column widths
ws['!cols'] = [
  { width: 15 }, // ID
  { width: 20 }, // Name_PT
  { width: 20 }, // Name_EN
  { width: 12 }, // Base Price
  { width: 30 }, // Image
  { width: 50 }, // Description_PT
  { width: 50 }, // Description_EN
  { width: 10 }, // Stock
  { width: 40 }, // Colors
  { width: 40 }  // Ages
];

XLSX.utils.book_append_sheet(wb, ws, 'Catalog');

// Ensure public directory exists
const publicDir = path.join(__dirname, '..', 'public');
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

// Write the file with specific options for better compatibility
const filePath = path.join(publicDir, 'catalog.xlsx');
XLSX.writeFile(wb, filePath, { bookType: 'xlsx', type: 'binary' });

console.log('Excel catalog file created at:', filePath);