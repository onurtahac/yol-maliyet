/**
 * Hesaplama Yardımcı Fonksiyonları
 */

/**
 * Fiyat dizisinin toplamını hesaplar
 * @param {number[]} prices
 * @returns {number}
 */
function calculateTotalCost(prices) {
    return prices.reduce((sum, price) => sum + price, 0);
}

/**
 * Türkçe karakterleri ASCII'ye normalize eder
 * @param {string} str
 * @returns {string}
 */
function normalizeText(str) {
    return str
        .replace(/İ/g, "i")
        .replace(/I/g, "i")
        .replace(/ı/g, "i")
        .replace(/Ğ/g, "g")
        .replace(/ğ/g, "g")
        .replace(/Ü/g, "u")
        .replace(/ü/g, "u")
        .replace(/Ş/g, "s")
        .replace(/ş/g, "s")
        .replace(/Ö/g, "o")
        .replace(/ö/g, "o")
        .replace(/Ç/g, "c")
        .replace(/ç/g, "c")
        .toLowerCase()
        .trim();
}

/**
 * "İlçe, İl" veya "İl" formatını parse eder
 * @param {string} locationString - "Kadıköy, İstanbul" veya "İstanbul"
 * @returns {{ district: string|null, province: string, original: string }}
 */
function parseLocation(locationString) {
    const trimmed = locationString.trim();
    const parts = trimmed.split(",").map((s) => s.trim());

    if (parts.length >= 2) {
        return {
            district: parts[0],
            province: parts[1],
            original: trimmed,
        };
    }

    return {
        district: null,
        province: parts[0],
        original: trimmed,
    };
}

/**
 * Parse edilmiş konumu Google API'ye gönderilecek formata çevirir
 * @param {{ district: string|null, province: string }} parsed
 * @returns {string} - "Kadıköy, İstanbul, Turkey" veya "İstanbul, Turkey"
 */
function buildLocationQuery(parsed) {
    if (parsed.district) {
        return `${parsed.district}, ${parsed.province}, Turkey`;
    }
    return `${parsed.province}, Turkey`;
}

/**
 * Şehir isimlerinden normalize edilmiş rota anahtarı oluşturur
 * İlçe bilgisi varsa sadece il bilgisini kullanır (toll eşleştirme il bazlı)
 * @param {string} from - "Kadıköy, İstanbul" veya "İstanbul"
 * @param {string} to - "Çankaya, Ankara" veya "Ankara"
 * @returns {string} - Örn: "istanbul-ankara"
 */
function getRouteKey(from, to) {
    const fromParsed = parseLocation(from);
    const toParsed = parseLocation(to);

    const normalizeForKey = (str) =>
        normalizeText(str).replace(/\s+/g, "-");

    return `${normalizeForKey(fromParsed.province)}-${normalizeForKey(toParsed.province)}`;
}

/**
 * Sayıyı 2 ondalık basamağa yuvarlar
 * @param {number} num
 * @returns {number}
 */
function roundToTwo(num) {
    return Math.round(num * 100) / 100;
}

/**
 * İstanbul'un yakasını belirler
 * @param {string} district
 * @returns {"europe"|"anatolia"|null}
 */
function getIstanbulSide(district) {
    if (!district) return null;
    const normalized = normalizeText(district);

    const europe = [
        "arnavutkoy", "avcilar", "bagcilar", "bahcelievler", "bakirkoy",
        "basaksehir", "bayrampasa", "besiktas", "beylikduzu", "beyoglu",
        "buyukcekmece", "catalca", "esenler", "esenyurt", "eyupsultan", "eyup",
        "fatih", "gaziosmanpasa", "gungoren", "kagithane", "kucukcekmece",
        "sariyer", "silivri", "sultangazi", "sisli", "zeytinburnu"
    ];

    const anatolia = [
        "adalar", "atasehir", "beykoz", "cekmekoy", "kadikoy", "kartal",
        "maltepe", "pendik", "sancaktepe", "sultanbeyli", "sile", "tuzla",
        "umraniye", "uskudar"
    ];

    if (europe.includes(normalized)) return "europe";
    if (anatolia.includes(normalized)) return "anatolia";
    return null;
}

/**
 * Rotanın İstanbul boğazını geçip geçmediğini kontrol eder
 * @param {object} fromParsed
 * @param {object} toParsed
 * @returns {boolean}
 */
function isCrossingBosphorus(fromParsed, toParsed) {
    const fromProv = normalizeText(fromParsed.province);
    const toProv = normalizeText(toParsed.province);

    // Senaryo 1: İstanbul içi yaka değişimi
    if (fromProv === "istanbul" && toProv === "istanbul") {
        const fromSide = getIstanbulSide(fromParsed.district);
        const toSide = getIstanbulSide(toParsed.district);
        return fromSide && toSide && fromSide !== toSide;
    }

    // Senaryo 2: Avrupa yakasından Anadolu'ya çıkış (veya tersi)
    // İzmir, Ankara, Bursa vb. hepsi Anadolu tarafındadır.
    // Edirne, Tekirdağ, Kırklareli Avrupa tarafındadır.
    const anatoliaProvinces = [
        "ankara", "izmir", "bursa", "antalya", "adana", "mersin", "gaziantep",
        "kocaeli", "sakarya", "bolu", "duzce", "bilecik", "eskisehir", "yalova"
    ];
    const europeProvinces = ["edirne", "tekirdag", "kirklareli"];

    if (fromProv === "istanbul") {
        const fromSide = getIstanbulSide(fromParsed.district);
        if (fromSide === "europe" && anatoliaProvinces.includes(toProv)) return true;
        if (fromSide === "anatolia" && europeProvinces.includes(toProv)) return true;
    }

    if (toProv === "istanbul") {
        const toSide = getIstanbulSide(toParsed.district);
        if (toSide === "europe" && anatoliaProvinces.includes(fromProv)) return true;
        if (toSide === "anatolia" && europeProvinces.includes(fromProv)) return true;
    }

    // Not: Şehirler arası iki taraf da dışarıdaysa (örn: Edirne -> Ankara), 
    // İstanbul'dan geçiyorsa mutlaka geçiyordur ama description tespiti zaten yapar.
    // Biz burada İstanbul başlangıçlı/bitişli kaçırılanları yakalıyoruz.

    return false;
}

/**
 * İlçeye göre en mantıklı Boğaz geçişini önerir.
 * @param {string} district
 * @returns {string} - Toll kodu (AVRASYA, 15TEMMUZ, FSM, YSS)
 */
function getPreferredBosphorusToll(district) {
    if (!district) return "15TEMMUZ";
    const normalized = normalizeText(district);

    // Güney hattı -> Avrasya Tüneli
    const southernDistricts = [
        "zeytinburnu", "fatih", "bakirkoy", "bahcelievler", "gungoren",
        "bagcilar", "kucukcekmece", "avcilar", "esenyurt", "beylikduzu",
        "buyukcekmece", "silivri", "catalca", "adalar", "kadikoy"
    ];

    // Kuzey hattı -> FSM veya YSS
    const northernDistricts = [
        "buyukcekmece", "sariyer", "beykoz", "cekmece", "arnavutkoy", "basaksehir"
    ];

    // Boğaz hattı (Orta) -> 15 Temmuz Şehitler
    const centralDistricts = [
        "besiktas", "sisli", "beyoglu", "kagithane", "uskudar", "umraniye", "atasehir"
    ];

    if (southernDistricts.includes(normalized)) return "AVRASYA";
    if (northernDistricts.includes(normalized)) return "FSM";
    if (centralDistricts.includes(normalized)) return "15TEMMUZ";

    return "15TEMMUZ"; // Varsayılan
}

module.exports = {
    calculateTotalCost,
    getRouteKey,
    roundToTwo,
    normalizeText,
    parseLocation,
    buildLocationQuery,
    getIstanbulSide,
    isCrossingBosphorus,
    getPreferredBosphorusToll,
};
