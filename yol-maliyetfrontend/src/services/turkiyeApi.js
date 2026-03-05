import axios from 'axios';

const TURKIYE_API_BASE = 'https://turkiyeapi.dev/api/v1';

const turkiyeApi = axios.create({
    baseURL: TURKIYE_API_BASE,
    timeout: 10000,
});

// Cache for provinces data
let provincesCache = null;
let provincesCacheTimestamp = 0;
const CACHE_DURATION = 30 * 60 * 1000; // 30 minutes

/**
 * Get all provinces (with caching)
 * @returns {Promise<Array>} List of provinces with id, name, districts
 */
export async function getProvinces() {
    const now = Date.now();
    if (provincesCache && (now - provincesCacheTimestamp) < CACHE_DURATION) {
        return provincesCache;
    }

    const response = await turkiyeApi.get('/provinces', {
        params: { fields: 'name,id,districts' },
    });

    if (response.data?.status === 'OK') {
        provincesCache = response.data.data;
        provincesCacheTimestamp = now;
        return provincesCache;
    }

    throw new Error('TurkiyeAPI yanıt vermedi');
}

/**
 * Search provinces and districts by query string
 * Returns matched provinces and districts grouped under their province
 * @param {string} query - Search term
 * @returns {Promise<Array>} Formatted results: [{ type, label, provinceName, districtName, value }]
 */
export async function searchLocations(query) {
    if (!query || query.trim().length < 1) return [];

    const provinces = await getProvinces();
    const rawQuery = query.trim();
    const normalizedQuery = normalizeText(rawQuery);
    const results = [];

    for (const province of provinces) {
        const provinceName = province.name;
        const normalizedProvince = normalizeText(provinceName);

        // Check if query matches province
        const provinceStartsWith = normalizedProvince.startsWith(normalizedQuery);
        const provinceIncludes = normalizedProvince.includes(normalizedQuery);

        if (provinceIncludes) {
            results.push({
                type: 'province',
                label: provinceName,
                provinceName: provinceName,
                districtName: null,
                value: provinceName,
                id: province.id,
                score: provinceStartsWith ? 100 : 50
            });
        }

        // Search districts
        if (province.districts) {
            for (const district of province.districts) {
                const districtName = district.name;
                const normalizedDistrict = normalizeText(districtName);

                const districtStartsWith = normalizedDistrict.startsWith(normalizedQuery);
                const districtIncludes = normalizedDistrict.includes(normalizedQuery);

                if (districtIncludes) {
                    results.push({
                        type: 'district',
                        label: `${districtName}, ${provinceName}`,
                        provinceName: provinceName,
                        districtName: districtName,
                        value: `${districtName}, ${provinceName}`,
                        id: district.id,
                        score: districtStartsWith ? 80 : 30
                    });
                }
            }
        }
    }

    // Sort: 
    // 1. Score (starts-with > contains)
    // 2. Type (province > district if scores same)
    // 3. Length (shorter names first)
    // 4. Alphabetical
    results.sort((a, b) => {
        if (b.score !== a.score) return b.score - a.score;

        const aNorm = normalizeText(a.type === 'province' ? a.provinceName : a.districtName);
        const bNorm = normalizeText(b.type === 'province' ? b.provinceName : b.districtName);

        // Equal scores? Shorter name first
        if (aNorm.length !== bNorm.length) return aNorm.length - bNorm.length;

        return aNorm.localeCompare(bNorm, 'tr');
    });

    return results.slice(0, 15);
}

/**
 * Search districts within a specific province by query
 * @param {string} provinceName - Province name to search within
 * @param {string} query - District search query
 * @returns {Promise<Array>} Matching districts
 */
export async function searchDistricts(provinceName, query) {
    const provinces = await getProvinces();
    const province = provinces.find(
        p => normalizeText(p.name) === normalizeText(provinceName)
    );

    if (!province || !province.districts) return [];

    const normalizedQuery = query ? normalizeText(query.trim()) : '';

    return province.districts
        .filter(d => !normalizedQuery || normalizeText(d.name).includes(normalizedQuery))
        .map(d => ({
            type: 'district',
            label: `${d.name}, ${provinceName}`,
            provinceName: provinceName,
            districtName: d.name,
            value: `${d.name}, ${provinceName}`,
            id: d.id,
            score: normalizedQuery && normalizeText(d.name).startsWith(normalizedQuery) ? 100 : 50
        }))
        .sort((a, b) => {
            if (b.score !== a.score) return b.score - a.score;
            return a.districtName.localeCompare(b.districtName, 'tr');
        })
        .slice(0, 20);
}

/**
 * Normalize Turkish text for comparison
 * Handles İ/i, I/ı, Ö/ö, Ü/ü, Ç/ç, Ş/ş, Ğ/ğ
 */
function normalizeText(text) {
    if (!text) return '';
    return text
        .replace(/İ/g, 'i')
        .replace(/I/g, 'ı')
        .toLowerCase()
        .replace(/ı/g, 'i') // map ı to i to allow searching 'istanbul' as 'ıstanbul' or 'istanbul'
        .replace(/ö/g, 'o')
        .replace(/ü/g, 'u')
        .replace(/ç/g, 'c')
        .replace(/ş/g, 's')
        .replace(/ğ/g, 'g')
        .replace(/â/g, 'a')
        .replace(/î/g, 'i')
        .replace(/û/g, 'u')
        .trim();
}

export default turkiyeApi;
