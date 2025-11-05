const XLSX = require('xlsx');
const fs = require('fs');
const path = require('path');

const DAY = 24 * 60 * 60 * 1000;

function formatDateRelative(daysAgo) {
  const date = new Date(Date.now() - daysAgo * DAY);
  date.setHours(0, 0, 0, 0);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

const HEADER = [
  'SpeciesID',
  'SpeciesName_PT',
  'SpeciesName_EN',
  'SpeciesBasePrice',
  'SpeciesEggPrice',
  'SpeciesImage',
  'SpeciesDescription_PT',
  'SpeciesDescription_EN',
  'SpeciesStock',
  'ColorID',
  'ColorName_PT',
  'ColorName_EN',
  'BirthDate',
  'AgeCategoryOverride',
  'VariantPrice',
  'Quantity',
  'Sold',
  'VariantImage',
  'Notes'
];

const ROWS = [
  ['pavoes-azuis', 'Pavões Azuis', 'Blue Peacocks', 150, 55, './assets/images/pavoes_azuis.jpg', 'Lindos pavões azuis criados com cuidado e carinho. Aves saudáveis e bem socializadas.', 'Beautiful blue peacocks raised with great care and affection. Healthy and well-socialized birds.', 'in', 'blue', 'Azul Tradicional', 'Traditional Blue', formatDateRelative(0), 'egg', 55, 6, false, './assets/images/pavoes_azuis.jpg', 'Lote fresco para incubação imediata.'],
  ['pavoes-azuis', 'Pavões Azuis', 'Blue Peacocks', 150, 55, './assets/images/pavoes_azuis.jpg', 'Lindos pavões azuis criados com cuidado e carinho. Aves saudáveis e bem socializadas.', 'Beautiful blue peacocks raised with great care and affection. Healthy and well-socialized birds.', 'in', 'blue', 'Azul Tradicional', 'Traditional Blue', formatDateRelative(32), '', 150, 4, false, './assets/images/pavoes_azuis.jpg', 'Criação em recinto exterior.'],
  ['pavoes-azuis', 'Pavões Azuis', 'Blue Peacocks', 150, 55, './assets/images/pavoes_azuis.jpg', 'Lindos pavões azuis criados com cuidado e carinho. Aves saudáveis e bem socializadas.', 'Beautiful blue peacocks raised with great care and affection. Healthy and well-socialized birds.', 'in', 'royal-blue', 'Azul Real', 'Royal Blue', formatDateRelative(70), '', 185, 2, false, './assets/images/pavoes_azuis.jpg', 'Seleção azul real com plumagem intensa.'],
  ['pavoes-azuis', 'Pavões Azuis', 'Blue Peacocks', 150, 55, './assets/images/pavoes_azuis.jpg', 'Lindos pavões azuis criados com cuidado e carinho. Aves saudáveis e bem socializadas.', 'Beautiful blue peacocks raised with great care and affection. Healthy and well-socialized birds.', 'in', 'peacock-green', 'Verde Pavão', 'Peacock Green', formatDateRelative(95), '', 195, 1, false, './assets/images/pavoes_azuis.jpg', 'Variante verde pavão rara.'],
  ['arara', 'Arara Vermelha', 'Red Macaw', 2400, 1200, './assets/images/arara.jpeg', 'Majestosa arara vermelha, ave símbolo da fauna brasileira.', 'Majestic red macaw, symbolic bird of Brazilian fauna.', 'low', 'red', 'Vermelho Clássico', 'Classic Red', formatDateRelative(0), 'egg', 1300, 3, false, './assets/images/arara.jpeg', 'Ovos recolhidos esta semana.'],
  ['arara', 'Arara Vermelha', 'Red Macaw', 2400, 1200, './assets/images/arara.jpeg', 'Majestosa arara vermelha, ave símbolo da fauna brasileira.', 'Majestic red macaw, symbolic bird of Brazilian fauna.', 'low', 'red', 'Vermelho Clássico', 'Classic Red', formatDateRelative(118), '', 2650, 2, false, './assets/images/arara.jpeg', 'Juvenis com treino inicial de socialização.'],
  ['arara', 'Arara Vermelha', 'Red Macaw', 2400, 1200, './assets/images/arara.jpeg', 'Majestosa arara vermelha, ave símbolo da fauna brasileira.', 'Majestic red macaw, symbolic bird of Brazilian fauna.', 'low', 'scarlet', 'Escarlate', 'Scarlet', formatDateRelative(460), '', 2900, 1, false, './assets/images/arara.jpeg', 'Adulto escarlate pronto para reprodução.'],
  ['papagaio', 'Papagaio Cinzento', 'African Grey Parrot', 800, 400, './assets/images/papagaio.jpeg', 'Papagaio cinzento africano, conhecido pela inteligência.', 'African grey parrot, known for its intelligence.', 'out', 'grey', 'Cinzento', 'Grey', formatDateRelative(0), 'egg', 420, 5, false, './assets/images/papagaio.jpeg', 'Disponível apenas para incubação monitorizada.'],
  ['papagaio', 'Papagaio Cinzento', 'African Grey Parrot', 800, 400, './assets/images/papagaio.jpeg', 'Papagaio cinzento africano, conhecido pela inteligência.', 'African grey parrot, known for its intelligence.', 'out', 'grey', 'Cinzento', 'Grey', formatDateRelative(182), '', 950, 1, false, './assets/images/papagaio.jpeg', 'Jovem com vocalização inicial.']
];

const workbook = XLSX.utils.book_new();
const worksheet = XLSX.utils.aoa_to_sheet([HEADER, ...ROWS]);

worksheet['!cols'] = [
  { width: 16 },
  { width: 22 },
  { width: 22 },
  { width: 16 },
  { width: 16 },
  { width: 36 },
  { width: 52 },
  { width: 52 },
  { width: 10 },
  { width: 16 },
  { width: 24 },
  { width: 24 },
  { width: 14 },
  { width: 18 },
  { width: 16 },
  { width: 10 },
  { width: 36 },
  { width: 30 }
];

XLSX.utils.book_append_sheet(workbook, worksheet, 'Catalog');

const publicDir = path.join(__dirname, '..', 'public');
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

const excelPath = path.join(publicDir, 'catalog.xlsx');
XLSX.writeFile(workbook, excelPath, { bookType: 'xlsx', type: 'binary' });

const csvPath = path.join(publicDir, 'catalog.csv');
const csvLines = [HEADER, ...ROWS]
  .map((row) => row.map(valueToCsv).join(','))
  .join('\n');
fs.writeFileSync(csvPath, csvLines, 'utf8');

console.log('Excel catalog file created at:', excelPath);
console.log('CSV catalog file created at:', csvPath);

function valueToCsv(value) {
  if (value === null || value === undefined) return '';
  const str = String(value);
  if (/[",\n]/.test(str)) {
    return '"' + str.replace(/"/g, '""') + '"';
  }
  return str;
}
