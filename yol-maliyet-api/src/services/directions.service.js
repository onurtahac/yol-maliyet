/**
 * Directions Service
 *
 * Google API ile rota ve mesafe bilgisi alır.
 * İki ayrı istek yapar:
 *   1. Normal (en hızlı + alternatifler)
 *   2. avoidTolls (ücretsiz yol alternatifi)
 * Sonuçları birleştirir ve her zaman en az 2 seçenek sunar.
 */

const axios = require("axios");
const config = require("../config/app.config");

// ─── Google Routes API v2 ───
const ROUTES_API_URL =
    "https://routes.googleapis.com/directions/v2:computeRoutes";

/**
 * Routes API'ye tek bir istek yapar
 * @param {object} body - İstek gövdesi
 * @param {string} apiKey
 * @returns {Array} - Parse edilmiş rota dizisi
 */
async function callRoutesApi(body, apiKey) {
    const { data } = await axios.post(ROUTES_API_URL, body, {
        headers: {
            "Content-Type": "application/json",
            "X-Goog-Api-Key": apiKey,
            "X-Goog-FieldMask":
                "routes.distanceMeters,routes.duration,routes.description,routes.routeLabels,routes.polyline",
        },
    });

    const routes = data?.routes;
    if (!routes || routes.length === 0) return [];

    return routes.map((route, index) => {
        const distanceKm = route.distanceMeters
            ? Math.round((route.distanceMeters / 1000) * 10) / 10
            : 0;
        const durationSeconds = route.duration
            ? parseInt(route.duration.replace("s", ""), 10)
            : 0;

        const isDefault = route.routeLabels?.includes("DEFAULT_ROUTE");

        return {
            index,
            isDefault,
            distanceKm,
            durationMin: Math.round(durationSeconds / 60),
            summary: route.description || "",
            polyline: route.polyline?.encodedPolyline || null,
            avoidsTolls: false,
        };
    });
}

// ─── Google Directions API (legacy fallback) ───
const DIRECTIONS_URL = "https://maps.googleapis.com/maps/api/directions/json";

async function tryDirectionsApi(origin, destination, apiKey) {
    const { data } = await axios.get(DIRECTIONS_URL, {
        params: {
            origin,
            destination,
            key: apiKey,
            mode: "driving",
            language: "tr",
            region: "tr",
            alternatives: true,
        },
    });

    if (data.status !== "OK") {
        throw new Error(data.error_message || `Directions API: ${data.status}`);
    }

    const routes = data.routes;
    if (!routes || routes.length === 0) return [];

    return routes.map((route, index) => {
        const leg = route.legs?.[0];
        const distanceKm = leg?.distance?.value
            ? Math.round((leg.distance.value / 1000) * 10) / 10
            : 0;
        const durationMin = leg?.duration?.value
            ? Math.round(leg.duration.value / 60)
            : 0;

        return {
            index,
            isDefault: index === 0,
            distanceKm,
            durationMin,
            summary: route.summary || "",
            polyline: route.overview_polyline?.points || null,
            avoidsTolls: false,
        };
    });
}

// ─── Ana Fonksiyon — Dual Request Stratejisi ───

/**
 * Google API ile rota bilgilerini getirir.
 * 2 ayrı istek yaparak her zaman alternatif sunar:
 *   1. Normal rotalar (en hızlı + Google alternatifleri)
 *   2. Ücretsiz yol rotası (avoidTolls: true)
 *
 * @param {string} origin
 * @param {string} destination
 * @returns {Promise<Array>}
 */
async function getRouteInfo(origin, destination) {
    const apiKey = config.googleApiKey;

    if (!apiKey) {
        throw Object.assign(
            new Error("GOOGLE_API_KEY tanımlı değil. Lütfen .env dosyasını kontrol edin."),
            { statusCode: 500 }
        );
    }

    let allRoutes = [];

    // ─── 1. Routes API v2 dene ───
    try {
        // İstek 1: Normal rotalar + alternatifler
        const normalBody = {
            origin: { address: origin },
            destination: { address: destination },
            travelMode: "DRIVE",
            languageCode: "tr",
            regionCode: "TR",
            computeAlternativeRoutes: true,
        };

        // İstek 2: Ücretsiz yol (avoidTolls)
        const tollFreeBody = {
            origin: { address: origin },
            destination: { address: destination },
            travelMode: "DRIVE",
            languageCode: "tr",
            regionCode: "TR",
            routeModifiers: { avoidTolls: true },
            computeAlternativeRoutes: false,
        };

        // İki isteği paralel gönder
        const [normalRoutes, tollFreeRoutes] = await Promise.all([
            callRoutesApi(normalBody, apiKey),
            callRoutesApi(tollFreeBody, apiKey).catch(() => []),
        ]);

        // Normal rotaları ekle
        allRoutes.push(...normalRoutes);

        // Toll-free rotayı ekle (eğer farklıysa)
        for (const tfRoute of tollFreeRoutes) {
            // Aynı rota zaten var mı kontrol et (mesafe ve süre benzerliği)
            const isDuplicate = allRoutes.some(
                (r) =>
                    Math.abs(r.distanceKm - tfRoute.distanceKm) < 5 &&
                    Math.abs(r.durationMin - tfRoute.durationMin) < 10
            );

            if (!isDuplicate) {
                tfRoute.avoidsTolls = true;
                tfRoute.isDefault = false;
                allRoutes.push(tfRoute);
            }
        }

        if (allRoutes.length > 0) return allRoutes;
    } catch (routesErr) {
        console.log("[INFO] Routes API başarısız, Directions API deneniyor...");
    }

    // ─── 2. Directions API fallback ───
    try {
        allRoutes = await tryDirectionsApi(origin, destination, apiKey);
        if (allRoutes.length > 0) return allRoutes;
    } catch (dirErr) {
        const message =
            dirErr.response?.data?.error?.message ||
            dirErr.message ||
            "Bilinmeyen API hatası";

        throw Object.assign(
            new Error(`Google API hatası: ${message}`),
            { statusCode: 502 }
        );
    }

    return allRoutes;
}

module.exports = { getRouteInfo };
