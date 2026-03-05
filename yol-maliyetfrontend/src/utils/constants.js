// ── City List ──
export const CITIES = [
  { value: 'istanbul', label: 'İstanbul' },
  { value: 'ankara', label: 'Ankara' },
  { value: 'izmir', label: 'İzmir' },
  { value: 'bursa', label: 'Bursa' },
  { value: 'antalya', label: 'Antalya' },
  { value: 'adana', label: 'Adana' },
  { value: 'mersin', label: 'Mersin' },
  { value: 'edirne', label: 'Edirne' },
  { value: 'gaziantep', label: 'Gaziantep' },
  { value: 'kocaeli', label: 'Kocaeli' },
  { value: 'canakkale', label: 'Çanakkale' },
  { value: 'cesme', label: 'Çeşme' },
  { value: 'aydin', label: 'Aydın' },
  { value: 'denizli', label: 'Denizli' },
  { value: 'nigde', label: 'Niğde' },
  { value: 'sakarya', label: 'Sakarya' },
];

// ── Vehicle Types ──
export const VEHICLE_TYPES = [
  { value: 'car', label: 'Otomobil', icon: '🚗', defaultConsumption: 7 },
  { value: 'minibus', label: 'Minibüs', icon: '🚐', defaultConsumption: 12 },
  { value: 'bus', label: 'Otobüs', icon: '🚌', defaultConsumption: 25 },
  { value: 'truck', label: 'Kamyon', icon: '🚛', defaultConsumption: 30 },
  { value: 'motorcycle', label: 'Motosiklet', icon: '🏍️', defaultConsumption: 4 },
];

// ── Fuel Types ──
export const FUEL_TYPES = [
  { value: 'benzin', label: 'Benzin' },
  { value: 'motorin', label: 'Motorin' },
  { value: 'lpg', label: 'LPG' },
];

// ── Route Labels ──
export const ROUTE_LABELS = {
  fastest: { label: 'EN HIZLI', labelTr: 'En Hızlı', icon: '⚡' },
  cheapest: { label: 'EN UCUZ', labelTr: 'En Ucuz', icon: '💰' },
  alternative: { label: 'ALTERNATİF', labelTr: 'Alternatif', icon: '🔄' },
};

// ── Toll Type Icons ──
export const TOLL_TYPE_ICONS = {
  bridge: '🌉',
  tunnel: '🚇',
  motorway: '🛣️',
};

// ── Stats for Hero ──
export const HERO_STATS = [
  { value: 19, suffix: '+', label: 'Ücretli Yol', icon: '🛣️' },
  { value: 5, suffix: '', label: 'Köprü & Tünel', icon: '🌉' },
  { value: 81, suffix: '', label: 'Şehir', icon: '🏙️' },
];
