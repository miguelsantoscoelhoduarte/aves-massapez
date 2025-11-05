const PT_FALLBACK_NAME = 'Produto Desconhecido';
const EN_FALLBACK_NAME = 'Unknown Product';

const AGE_BUCKETS = [
  { id: '1week', minDays: 0, maxDays: 6 },
  { id: '2weeks', minDays: 7, maxDays: 13 },
  { id: '3weeks', minDays: 14, maxDays: 20 },
  { id: '1month', minDays: 21, maxDays: 44 },
  { id: '2months', minDays: 45, maxDays: 74 },
  { id: '3months', minDays: 75, maxDays: 104 },
  { id: '4months', minDays: 105, maxDays: 134 },
  { id: '5months', minDays: 135, maxDays: 164 },
  { id: '6months', minDays: 165, maxDays: 194 },
  { id: '7months', minDays: 195, maxDays: 224 },
  { id: '8months', minDays: 225, maxDays: 254 },
  { id: '9months', minDays: 255, maxDays: 284 },
  { id: '10months', minDays: 285, maxDays: 314 },
  { id: '11months', minDays: 315, maxDays: 344 },
  { id: '12months', minDays: 345, maxDays: 374 },
  { id: 'adult', minDays: 375, maxDays: Infinity }
];

const AGE_ORDER = AGE_BUCKETS.reduce((acc, bucket, index) => {
  acc[bucket.id] = index;
  return acc;
}, { egg: -1 });

const AGE_LABELS = {
  pt: {
    egg: 'Ovo',
    '1week': '1 semana',
    '2weeks': '2 semanas',
    '3weeks': '3 semanas',
    '1month': '1 mês',
    '2months': '2 meses',
    '3months': '3 meses',
    '4months': '4 meses',
    '5months': '5 meses',
    '6months': '6 meses',
    '7months': '7 meses',
    '8months': '8 meses',
    '9months': '9 meses',
    '10months': '10 meses',
    '11months': '11 meses',
    '12months': '12 meses',
    adult: 'Adulto'
  },
  en: {
    egg: 'Egg',
    '1week': '1 week',
    '2weeks': '2 weeks',
    '3weeks': '3 weeks',
    '1month': '1 month',
    '2months': '2 months',
    '3months': '3 months',
    '4months': '4 months',
    '5months': '5 months',
    '6months': '6 months',
    '7months': '7 months',
    '8months': '8 months',
    '9months': '9 months',
    '10months': '10 months',
    '11months': '11 months',
    '12months': '12 months',
    adult: 'Adult'
  }
};

const HEADER_ALIASES = {
  speciesid: 'SpeciesID',
  speciesnamept: 'SpeciesName_PT',
  speciesnameen: 'SpeciesName_EN',
  speciesbaseprice: 'SpeciesBasePrice',
  specieseggprice: 'SpeciesEggPrice',
  speciesimage: 'SpeciesImage',
  speciesdescriptionpt: 'SpeciesDescription_PT',
  speciesdescriptionen: 'SpeciesDescription_EN',
  speciesstock: 'SpeciesStock',
  colorid: 'ColorID',
  colornamept: 'ColorName_PT',
  colornameen: 'ColorName_EN',
  birthdate: 'BirthDate',
  agecategoryoverride: 'AgeCategoryOverride',
  variantprice: 'VariantPrice',
  quantity: 'Quantity',
  sold: 'Sold',
  variantimage: 'VariantImage',
  notes: 'Notes'
};

export function buildProductsFromSheet(rows = [], language = 'pt') {
  if (!Array.isArray(rows) || rows.length < 2) return [];

  const header = rows[0].map(normaliseHeaderCell);
  const today = startOfDay(new Date());
  const productsById = new Map();

  for (let i = 1; i < rows.length; i++) {
    const row = rows[i];
    if (!row || row.length === 0 || row.every(isCellEmpty)) continue;

    const record = buildRecord(header, row);
    if (toBoolean(record.Sold)) continue;
    const quantity = toPositiveInt(record.Quantity);
    if (!quantity) continue;

    const variantPrice = toNumber(record.VariantPrice, null);
    if (variantPrice == null) continue;

    const speciesId = toId(record.SpeciesID || record.SpeciesName_PT || record.SpeciesName_EN);
    if (!speciesId) continue;

    const colorInfo = buildColorInfo(record, language);
    if (!colorInfo) continue;

    const ageInfo = buildAgeInfo(record, today, language);
    if (!ageInfo) continue;

    let product = productsById.get(speciesId);
    if (!product) {
      product = initProduct(record, language, speciesId);
      if (!product) continue;
      productsById.set(speciesId, product);
    }

    addVariant(product, record, colorInfo, ageInfo, quantity, variantPrice);
  }

  const products = [];
  for (const product of productsById.values()) {
    finalizeProduct(product);
    if (product.variants.length > 0) {
      products.push(product);
    }
  }

  return products;
}

function normaliseHeaderCell(value) {
  const raw = toString(value).replace(/[^a-z0-9_]/gi, '');
  const key = raw.toLowerCase();
  return HEADER_ALIASES[key] || raw;
}

function buildRecord(header, row) {
  const record = {};
  for (let i = 0; i < header.length; i++) {
    const key = header[i];
    if (!key) continue;
    const cell = row[i];
    if (typeof cell === 'string') {
      record[key] = cell.trim();
    } else {
      record[key] = cell;
    }
  }
  return record;
}

function initProduct(record, language, speciesId) {
  const namePt = toString(record.SpeciesName_PT);
  const nameEn = toString(record.SpeciesName_EN);
  const basePrice = toNumber(record.SpeciesBasePrice, 0);
  const eggPrice = toNumber(record.SpeciesEggPrice, null);
  const image = toString(record.SpeciesImage);
  const descriptionPt = toString(record.SpeciesDescription_PT);
  const descriptionEn = toString(record.SpeciesDescription_EN);
  const description = language === 'pt'
    ? descriptionPt || descriptionEn
    : descriptionEn || descriptionPt;

  const name = language === 'pt'
    ? namePt || nameEn || PT_FALLBACK_NAME
    : nameEn || namePt || EN_FALLBACK_NAME;

  return {
    id: speciesId,
    name,
    basePrice,
    eggPrice,
    price: basePrice,
    image,
    description,
    stock: normaliseStock(record.SpeciesStock),
    colors: [],
    ages: [],
    variants: [],
    variantMatrix: {},
    images: [],
    totalQuantity: 0,
    _language: language,
    _namePt: namePt,
    _nameEn: nameEn,
    _descriptionPt: descriptionPt,
    _descriptionEn: descriptionEn,
    _colors: new Map(),
    _ages: new Map(),
    _variants: new Map(),
    _imageSet: image ? new Set([image]) : new Set()
  };
}

function addVariant(product, record, colorInfo, ageInfo, quantity, variantPrice) {
  product.totalQuantity += quantity;

  const variantImage = toString(record.VariantImage);
  if (variantImage) {
    product._imageSet.add(variantImage);
  }

  const colorEntry = ensureColorEntry(product, colorInfo);
  colorEntry.quantity += quantity;
  colorEntry.variantPrices.push(variantPrice);
  colorEntry.availableAgeIds.add(ageInfo.id);

  const ageEntry = ensureAgeEntry(product, ageInfo);
  ageEntry.quantity += quantity;
  ageEntry.variantPrices.push(variantPrice);
  ageEntry.availableColorIds.add(colorInfo.id);

  const variantKey = `${colorInfo.id}::${ageInfo.id}`;
  const birthDate = normaliseDateString(record.BirthDate);
  let variant = product._variants.get(variantKey);
  if (!variant) {
    variant = {
      id: variantKey,
      colorId: colorInfo.id,
      ageId: ageInfo.id,
      price: variantPrice,
      quantity: 0,
      images: new Set(),
      birthDates: []
    };
    product._variants.set(variantKey, variant);
  }
  variant.quantity += quantity;
  variant.price = Math.min(variant.price, variantPrice);
  if (variantImage) {
    variant.images.add(variantImage);
  }
  if (birthDate) {
    variant.birthDates.push(birthDate);
  }
}

function ensureColorEntry(product, colorInfo) {
  let entry = product._colors.get(colorInfo.id);
  if (!entry) {
    entry = {
      id: colorInfo.id,
      namePt: colorInfo.namePt,
      nameEn: colorInfo.nameEn,
      quantity: 0,
      variantPrices: [],
      availableAgeIds: new Set()
    };
    product._colors.set(colorInfo.id, entry);
  }
  return entry;
}

function ensureAgeEntry(product, ageInfo) {
  let entry = product._ages.get(ageInfo.id);
  if (!entry) {
    entry = {
      id: ageInfo.id,
      namePt: ageInfo.namePt,
      nameEn: ageInfo.nameEn,
      quantity: 0,
      variantPrices: [],
      availableColorIds: new Set()
    };
    product._ages.set(ageInfo.id, entry);
  }
  return entry;
}

function finalizeProduct(product) {
  const language = product._language;
  const basePrice = Number.isFinite(product.basePrice) && product.basePrice > 0
    ? product.basePrice
    : determineFallbackBasePrice(product);

  const colors = Array.from(product._colors.values()).map(entry => {
    const minPrice = Math.min(...entry.variantPrices);
    const modifier = Number.isFinite(minPrice) ? minPrice - basePrice : 0;
    return {
      id: entry.id,
      name: language === 'pt'
        ? entry.namePt || entry.nameEn || ''
        : entry.nameEn || entry.namePt || '',
      priceModifier: Number.isFinite(modifier) ? modifier : 0,
      availableAgeIds: Array.from(entry.availableAgeIds).sort(sortAgeIds),
      quantity: entry.quantity
    };
  }).sort((a, b) => a.name.localeCompare(b.name, language === 'pt' ? 'pt' : 'en'));

  const ages = Array.from(product._ages.values()).map(entry => {
    const minPrice = Math.min(...entry.variantPrices);
    const absolutePrice = Number.isFinite(minPrice) ? minPrice : basePrice;
    const modifier = absolutePrice - basePrice;
    return {
      id: entry.id,
      name: language === 'pt'
        ? entry.namePt || AGE_LABELS.pt[entry.id] || entry.id
        : entry.nameEn || AGE_LABELS.en[entry.id] || entry.id,
      priceModifier: Number.isFinite(modifier) ? modifier : 0,
      absolutePrice,
      availableColorIds: Array.from(entry.availableColorIds).sort(),
      quantity: entry.quantity
    };
  }).sort((a, b) => sortAgeIds(a.id, b.id));

  const variants = [];
  const matrix = {};
  for (const rawVariant of product._variants.values()) {
    const variant = {
      id: rawVariant.id,
      colorId: rawVariant.colorId,
      ageId: rawVariant.ageId,
      price: rawVariant.price,
      quantity: rawVariant.quantity,
      available: rawVariant.quantity > 0,
      images: Array.from(rawVariant.images),
      birthDates: rawVariant.birthDates.slice().sort()
    };
    variants.push(variant);
    if (!matrix[variant.colorId]) {
      matrix[variant.colorId] = {};
    }
    matrix[variant.colorId][variant.ageId] = variant;
  }

  variants.sort((a, b) => {
    if (a.colorId === b.colorId) {
      return sortAgeIds(a.ageId, b.ageId);
    }
    return a.colorId.localeCompare(b.colorId);
  });

  const images = Array.from(product._imageSet);
  if (product.image && !images.includes(product.image)) {
    images.unshift(product.image);
  }

  product.basePrice = basePrice;
  product.price = basePrice;
  product.colors = colors;
  product.ages = ages;
  product.variants = variants;
  product.variantMatrix = matrix;
  product.images = images;
  product.stock = resolveStock(product.stock, product.totalQuantity);

  delete product._colors;
  delete product._ages;
  delete product._variants;
  delete product._imageSet;
  delete product._language;
  delete product._namePt;
  delete product._nameEn;
  delete product._descriptionPt;
  delete product._descriptionEn;
}

function buildColorInfo(record, language) {
  const rawId = record.ColorID || record.ColorName_PT || record.ColorName_EN;
  const id = toId(rawId);
  if (!id) return null;

  const namePt = toString(record.ColorName_PT) || (language === 'pt' ? toString(record.ColorName_EN) : '');
  const nameEn = toString(record.ColorName_EN) || (language === 'en' ? toString(record.ColorName_PT) : '');

  return {
    id,
    namePt,
    nameEn
  };
}

function buildAgeInfo(record, today, language) {
  const override = toId(record.AgeCategoryOverride);
  if (override) {
    return {
      id: override,
      namePt: AGE_LABELS.pt[override] || override,
      nameEn: AGE_LABELS.en[override] || override
    };
  }

  const birthDate = parseDate(record.BirthDate);
  if (!birthDate) return null;

  const diff = diffInDays(today, birthDate);
  const bucket = AGE_BUCKETS.find(({ minDays, maxDays }) => diff >= minDays && diff <= maxDays);
  if (!bucket) return null;

  return {
    id: bucket.id,
    namePt: AGE_LABELS.pt[bucket.id] || bucket.id,
    nameEn: AGE_LABELS.en[bucket.id] || bucket.id
  };
}

function determineFallbackBasePrice(product) {
  const prices = [];
  for (const variant of product._variants.values()) {
    if (Number.isFinite(variant.price)) {
      prices.push(variant.price);
    }
  }
  return prices.length > 0 ? Math.min(...prices) : 0;
}

function normaliseStock(stock) {
  const value = toString(stock).toLowerCase();
  if (value === 'in' || value === 'low' || value === 'out') {
    return value;
  }
  return '';
}

function resolveStock(stock, quantity) {
  if (stock === 'in' || stock === 'low' || stock === 'out') {
    return stock;
  }
  return quantity > 0 ? 'in' : 'out';
}

function sortAgeIds(a, b) {
  const orderA = AGE_ORDER[a] ?? 999;
  const orderB = AGE_ORDER[b] ?? 999;
  return orderA - orderB;
}

function toNumber(value, fallback = 0) {
  if (value === null || value === undefined || value === '') return fallback;
  if (typeof value === 'number' && Number.isFinite(value)) return value;
  const sanitised = String(value).replace(',', '.').trim();
  const number = Number(sanitised);
  return Number.isFinite(number) ? number : fallback;
}

function toString(value) {
  if (value === null || value === undefined) return '';
  return String(value).trim();
}

function toId(value) {
  const str = toString(value)
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
  return str;
}

function toPositiveInt(value) {
  const number = toNumber(value, 0);
  const int = Math.floor(number);
  return int > 0 ? int : 0;
}

function toBoolean(value) {
  if (typeof value === 'boolean') return value;
  if (value === null || value === undefined) return false;
  const str = String(value).trim().toLowerCase();
  if (!str) return false;
  return str === 'true' || str === '1' || str === 'yes' || str === 'y';
}

function parseDate(value) {
  const str = toString(value);
  if (!str) return null;
  const date = new Date(str);
  return Number.isFinite(date.getTime()) ? startOfDay(date) : null;
}

function normaliseDateString(value) {
  const str = toString(value);
  if (!str) return '';
  if (/^\d{4}-\d{2}-\d{2}$/.test(str)) return str;
  const date = parseDate(str);
  if (!date) return '';
  return formatDate(date);
}

function startOfDay(date) {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
}

function diffInDays(a, b) {
  const diff = (a.getTime() - b.getTime()) / (24 * 60 * 60 * 1000);
  if (!Number.isFinite(diff)) return 0;
  return Math.max(0, Math.floor(diff));
}

function formatDate(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function isCellEmpty(cell) {
  return cell === null || cell === undefined || cell === '';
}
