/**
 * Türkiye Ücretli Yol ve Köprü Verileri
 *
 * Kaynak: KGM / HGS / OGS resmi tarife verileri (Magdeburger Blog 2026)
 * Geçerlilik: 2026
 * Para birimi: TRY
 */

// ─────────────────────────────────────────────
// Ücretli Yapılar — Köprüler, Tüneller, Otoyollar
// ─────────────────────────────────────────────

const tolls = [
    // ══════════ KÖPRÜLER ══════════
    {
        code: "15TEMMUZ",
        name: "15 Temmuz Şehitler Köprüsü",
        type: "bridge",
        direction: "tek_yon",
        prices: {
            otomobil: 59.00,
            hafif_ticari: 75.00,
            motosiklet: 25.00,
            sinif_3: 168.00,
            sinif_4: 333.00,
            sinif_5: 440.00
        }
    },
    {
        code: "FSM",
        name: "Fatih Sultan Mehmet Köprüsü",
        type: "bridge",
        direction: "tek_yon",
        prices: {
            otomobil: 59.00,
            hafif_ticari: 75.00,
            motosiklet: 25.00,
            sinif_3: 168.00,
            sinif_4: 333.00,
            sinif_5: 440.00
        }
    },
    {
        code: "YSS",
        name: "Yavuz Sultan Selim Köprüsü",
        type: "bridge",
        direction: "tek_yon",
        prices: {
            otomobil: 95.00,
            hafif_ticari: 125.00,
            motosiklet: 65.00,
            sinif_3: 235.00,
            sinif_4: 595.00,
            sinif_5: 740.00
        }
    },
    {
        code: "OSMANGAZI",
        name: "Osmangazi Köprüsü",
        type: "bridge",
        direction: "tek_yon",
        prices: {
            otomobil: 995.00,
            hafif_ticari: 1590.00,
            motosiklet: 695.00,
            sinif_3: 1890.00,
            sinif_4: 2505.00,
            sinif_5: 3165.00
        }
    },
    {
        code: "CANAKKALE1915",
        name: "1915 Çanakkale Köprüsü",
        type: "bridge",
        direction: "tek_yon",
        prices: {
            otomobil: 995.00,
            hafif_ticari: 1245.00,
            motosiklet: 250.00,
            sinif_3: 2240.00,
            sinif_4: 2490.00,
            sinif_5: 3755.00
        }
    },

    // ══════════ TÜNELLER ══════════
    {
        code: "AVRASYA",
        name: "Avrasya Tüneli",
        type: "tunnel",
        prices: {
            // Gündüz tarifesini varsayılan olarak kullanıyoruz
            otomobil: 280.00,
            hafif_ticari: 420.00,
            motosiklet: 218.40
        },
        nightPrices: {
            otomobil: 140.00,
            hafif_ticari: 210.00,
            motosiklet: 109.20
        }
    },

    // ══════════ OTOYOLLAR ══════════
    {
        code: "ISTANBUL_IZMIR",
        name: "İstanbul - İzmir Otoyolu (İzmir Çıkış)",
        type: "motorway",
        prices: {
            otomobil: 1965.00,
            hafif_ticari: 3165.00,
            motosiklet: 1415.00,
            sinif_3: 3750.00,
            sinif_4: 4975.00,
            sinif_5: 6250.00
        }
    },
    {
        code: "O4",
        name: "KGM Anadolu Otoyolu (Çamlıca – Akıncı)",
        type: "motorway",
        prices: { otomobil: 338.00 }
    },
    {
        code: "O32",
        name: "İzmir - Çeşme Otoyolu",
        type: "motorway",
        prices: { otomobil: 53.00 }
    },
    {
        code: "O31",
        name: "İzmir - Aydın Otoyolu",
        type: "motorway",
        prices: { otomobil: 73.00 }
    },
    {
        code: "CUKUROVA_1",
        name: "KGM Çukurova Otoyolları (Adana Doğu - Şanlıurfa)",
        type: "motorway",
        prices: { otomobil: 102.00 }
    },
    {
        code: "CUKUROVA_2",
        name: "KGM Çukurova Otoyolları (Niğde Kuzey - Mersin)",
        type: "motorway",
        prices: { otomobil: 197.00 }
    },
    {
        code: "O3",
        name: "KGM Avrupa Otoyolu (Mahmutbey - Edirne)",
        type: "motorway",
        prices: { otomobil: 168.00 }
    },
    {
        code: "GEBZE_IZMIR",
        name: "Gebze - Orhangazi - İzmir (Osmangazi Dahil)",
        type: "motorway",
        prices: { otomobil: 995.00 }
    },
    {
        code: "KUZEY_CEVRE",
        name: "Kuzey Çevre Otoyolu (Fenertepe - Kurnaköy)",
        type: "motorway",
        prices: { otomobil: 525.00 }
    },
    {
        code: "KMO_AVRUPA",
        name: "Kuzey Marmara Avrupa Otoyolu (Kınalı - Fatih)",
        type: "motorway",
        prices: { otomobil: 230.00 }
    },
    {
        code: "KMO_ANADOLU",
        name: "Kuzey Marmara Anadolu Otoyolu (Kurnaköy - Akyazı)",
        type: "motorway",
        prices: { otomobil: 535.00 }
    },
    {
        code: "ANKARA_NIGDE",
        name: "Ankara - Niğde Otoyolu",
        type: "motorway",
        prices: { otomobil: 820.00 }
    },
    {
        code: "MENEMEN_CANDARLI",
        name: "Menemen - Aliağa - Çandarlı Otoyolu",
        type: "motorway",
        prices: { otomobil: 225.00 }
    },
    {
        code: "MALKARA_CANAKKALE",
        name: "Malkara - Çanakkale Otoyolu (Köprü Dahil)",
        type: "motorway",
        prices: { otomobil: 1285.00 }
    },
    {
        code: "AYDIN_DENIZLI",
        name: "Aydın - Denizli Otoyolu",
        type: "motorway",
        prices: { otomobil: 290.00 }
    }
];

// ─────────────────────────────────────────────
// Araç Tipi → Araç Sınıfı Eşleştirmesi
// ─────────────────────────────────────────────

const vehicleClassMap = {
    car: "otomobil",
    minibus: "hafif_ticari",
    bus: "sinif_3",
    truck: "sinif_4",
    motorcycle: "motosiklet",
};

// ─────────────────────────────────────────────
// Rota Tanımları
// Her rotada geçilen ücretli yapıların code'ları sırayla verilir
// ─────────────────────────────────────────────

const routes = {
    "istanbul-ankara": {
        description: "İstanbul → Ankara (TEM)",
        tollCodes: ["15TEMMUZ", "O4"],
    },
    "ankara-istanbul": {
        description: "Ankara → İstanbul (TEM)",
        tollCodes: ["O4", "15TEMMUZ"],
    },
    "istanbul-izmir": {
        description: "İstanbul → İzmir (O-5)",
        tollCodes: ["ISTANBUL_IZMIR"],
    },
    "izmir-istanbul": {
        description: "İzmir → İstanbul (O-5)",
        tollCodes: ["ISTANBUL_IZMIR"],
    },
    "istanbul-edirne": {
        description: "İstanbul → Edirne (O-3)",
        tollCodes: ["O3"],
    },
    "edirne-istanbul": {
        description: "Edirne → İstanbul (O-3)",
        tollCodes: ["O3"],
    },
    "istanbul-bursa": {
        description: "İstanbul → Bursa (Osmangazi)",
        tollCodes: ["OSMANGAZI"],
    },
    "istanbul-canakkale": {
        description: "İstanbul → Çanakkale (1915 Köprüsü)",
        tollCodes: ["MALKARA_CANAKKALE"],
    },
    "ankara-adana": {
        description: "Ankara → Adana (Niğde Otoyolu)",
        tollCodes: ["ANKARA_NIGDE"],
    },
    "ankara-gaziantep": {
        description: "Ankara → Gaziantep (Niğde + Çukurova)",
        tollCodes: ["ANKARA_NIGDE", "CUKUROVA_1"],
    },
    "izmir-cesme": {
        description: "İzmir → Çeşme",
        tollCodes: ["O32"],
    },
    "izmir-aydin": {
        description: "İzmir → Aydın",
        tollCodes: ["O31"],
    },
    "izmir-denizli": {
        description: "İzmir → Denizli (Aydın-Denizli)",
        tollCodes: ["O31", "AYDIN_DENIZLI"],
    },
    "adana-gaziantep": {
        description: "Adana → Gaziantep",
        tollCodes: ["CUKUROVA_1"],
    },
    "mersin-adana": {
        description: "Mersin → Adana",
        tollCodes: ["CUKUROVA_2"],
    },
    "istanbul-sakarya": {
        description: "İstanbul → Sakarya (Kuzey Marmara)",
        tollCodes: ["KMO_ANADOLU"],
    }
};

// ─────────────────────────────────────────────
// Google Rota Açıklaması → Toll Eşleştirme Haritası
// Google Routes API'nin "description" alanındaki anahtar kelimeler
// ile toll kodları eşleştirilir.
// ─────────────────────────────────────────────

const descriptionToTollMap = [
    // Otoyollar
    { keywords: ["O-4", "O4", "Anadolu Otoyolu"], tollCode: "O4" },
    { keywords: ["O-3", "O3", "Avrupa Otoyolu"], tollCode: "O3" },
    { keywords: ["O-7", "O7", "Kuzey Marmara"], tollCode: "KMO_ANADOLU" },
    { keywords: ["O-6", "O6"], tollCode: "KMO_AVRUPA" },
    { keywords: ["O-32", "O32", "İzmir-Çeşme", "Çeşme Otoyolu"], tollCode: "O32" },
    { keywords: ["O-31", "O31", "İzmir-Aydın", "Aydın Otoyolu"], tollCode: "O31" },
    { keywords: ["İstanbul-İzmir Otoyolu", "İstanbul İzmir Otoyolu", "O-5", "O5"], tollCode: "ISTANBUL_IZMIR" },
    { keywords: ["Gebze-İzmir", "Gebze İzmir"], tollCode: "GEBZE_IZMIR" },
    { keywords: ["Osmangazi Köprüsü"], tollCode: "OSMANGAZI" },
    { keywords: ["Ankara-Niğde", "Ankara Niğde"], tollCode: "ANKARA_NIGDE" },
    { keywords: ["Çukurova Otoyolu"], tollCode: "CUKUROVA_1" },
    { keywords: ["Malkara", "Çanakkale Otoyolu"], tollCode: "MALKARA_CANAKKALE" },
    { keywords: ["Aydın-Denizli", "Denizli Otoyolu"], tollCode: "AYDIN_DENIZLI" },
    { keywords: ["Menemen", "Çandarlı"], tollCode: "MENEMEN_CANDARLI" },
    { keywords: ["Kuzey Çevre"], tollCode: "KUZEY_CEVRE" },

    // Köprüler & Tünel (Boğaz Geçişleri - Gruplandırılmış Priority ile)
    {
        tollCode: "15TEMMUZ",
        specific: ["15 Temmuz", "Boğaziçi Köprüsü", "15 Temmuz Şehitler"],
        generic: ["D-100", "D100", "E-5", "E5", "O-1", "O1"]
    },
    {
        tollCode: "FSM",
        specific: ["FSM", "Fatih Sultan Mehmet", "2. Köprü"],
        generic: ["O-2", "O2"]
    },
    {
        tollCode: "YSS",
        specific: ["Yavuz Sultan Selim", "3. Köprü", "Kuzey Marmara Köprüsü"],
        generic: ["O-7", "O7"]
    },
    {
        tollCode: "AVRASYA",
        specific: ["Avrasya", "Avrasya Tüneli", "Kennedy Caddesi", "Ayrılık Çeşmesi"],
        generic: []
    },
    {
        tollCode: "CANAKKALE1915",
        specific: ["1915", "Çanakkale Köprüsü"],
        generic: []
    },
];

/**
 * Google Routes API'nin döndürdüğü rota açıklamasından
 * geçilen ücretli yapıları tespit eder
 */
function detectTollsFromDescription(description) {
    if (!description) return [];

    const normalizedDesc = description
        .replace(/\//g, " ")
        .replace(/-/g, "-");

    const matches = [];

    // 1. Tüm olası eşleşmeleri topla
    for (const entry of descriptionToTollMap) {
        let foundSpecific = false;
        let foundGeneric = false;

        // Statik keywords olanlar için (Otoyollar vb.)
        if (entry.keywords) {
            for (const keyword of entry.keywords) {
                if (normalizedDesc.includes(keyword)) {
                    foundSpecific = true;
                    break;
                }
            }
        } else {
            // Boğaz geçişleri için (Specific vs Generic ayrımı)
            for (const s of entry.specific) {
                if (normalizedDesc.includes(s)) {
                    foundSpecific = true;
                    break;
                }
            }
            if (!foundSpecific) {
                for (const g of entry.generic) {
                    if (normalizedDesc.includes(g)) {
                        foundGeneric = true;
                        break;
                    }
                }
            }
        }

        if (foundSpecific) {
            matches.push({ code: entry.tollCode, priority: 2 });
        } else if (foundGeneric) {
            matches.push({ code: entry.tollCode, priority: 1 });
        }
    }

    // 2. BOĞAZ GEÇİŞİ ÇAKIŞMA KONTROLÜ
    // Eğer spesifik bir geçiş ismi (Avrasya, YSS vb.) varsa, jenerik yol ismi (D100, E5) üzerinden gelenleri ele.
    const bosphorusTolls = ["15TEMMUZ", "FSM", "YSS", "AVRASYA"];
    const detectedBosphorus = matches.filter(m => bosphorusTolls.includes(m.code));

    // Eğer herhangi bir "Specific" (Priority 2) Boğaz geçişi varsa, "Generic" olanları sil
    const hasSpecificBosphorus = detectedBosphorus.some(m => m.priority === 2);

    let finalMatches = matches;
    if (hasSpecificBosphorus) {
        finalMatches = matches.filter(m => {
            if (!bosphorusTolls.includes(m.code)) return true; // Boğaz dışındakilere dokunma
            return m.priority === 2; // Sadece spesifik olanları tut
        });
    }

    // 3. Sadece kodları döndür (unique)
    return [...new Set(finalMatches.map(m => m.code))];
}

// ─────────────────────────────────────────────
// Yardımcı Fonksiyonlar
// ─────────────────────────────────────────────

function getTollByCode(code) {
    return tolls.find((t) => t.code === code);
}

function getRoute(routeKey) {
    return routes[routeKey];
}

function getAvailableRoutes() {
    return Object.keys(routes).map((key) => ({
        key,
        description: routes[key].description,
    }));
}

function getVehicleClass(vehicleType) {
    return vehicleClassMap[vehicleType] || null;
}

module.exports = {
    tolls,
    routes,
    vehicleClassMap,
    getTollByCode,
    getRoute,
    getAvailableRoutes,
    getVehicleClass,
    detectTollsFromDescription,
};
