/**
 * Route Service
 *
 * İş mantığının bulunduğu katman.
 * Google API'den birden fazla rota alır → her biri için yakıt + toll hesaplar → sıralar.
 */

const { getRoute, getTollByCode, getVehicleClass, detectTollsFromDescription } = require("../data/toll.data");
const { getFuelPrice } = require("../data/fuel.data");
const {
    getRouteKey,
    calculateTotalCost,
    roundToTwo,
    parseLocation,
    buildLocationQuery,
    isCrossingBosphorus,
    getPreferredBosphorusToll,
} = require("../utils/calculation.helper");
const { getRouteInfo } = require("./directions.service");

/**
 * Tek bir rota için yakıt detayını hesaplar
 */
function calculateFuelDetails(distanceKm, durationMin, fuelConsumption, fuelType, tollCost) {
    if (!fuelConsumption || !distanceKm) {
        if (fuelConsumption && !distanceKm) {
            return {
                fuelType: fuelType || "benzin",
                fuelConsumption,
                note: "Mesafe bilgisi alınamadığı için yakıt maliyeti hesaplanamadı.",
            };
        }
        return null;
    }

    const averageSpeed = durationMin
        ? roundToTwo(distanceKm / (durationMin / 60))
        : null;

    const activeFuelType = fuelType || "benzin";
    const fuelData = getFuelPrice(activeFuelType);
    const pricePerLiter = fuelData ? fuelData.pricePerLiter : 0;

    // Minimum (Ekonomik sürüş: %90 tüketim)
    const consumptionMin = roundToTwo(fuelConsumption * 0.9);
    const fuelUsedMin = roundToTwo((distanceKm * consumptionMin) / 100);
    const fuelCostMin = roundToTwo(fuelUsedMin * pricePerLiter);

    // Maximum (Hızlı sürüş: %130 tüketim)
    const consumptionMax = roundToTwo(fuelConsumption * 1.3);
    const fuelUsedMax = roundToTwo((distanceKm * consumptionMax) / 100);
    const fuelCostMax = roundToTwo(fuelUsedMax * pricePerLiter);

    // Ortalama
    const fuelUsedAvg = roundToTwo((distanceKm * fuelConsumption) / 100);
    const fuelCostAvg = roundToTwo(fuelUsedAvg * pricePerLiter);

    return {
        fuelType: activeFuelType,
        fuelTypeName: fuelData ? fuelData.name : activeFuelType,
        fuelPricePerLiter: pricePerLiter,
        averageSpeed,
        nominalConsumption: fuelConsumption,
        min: {
            consumption: consumptionMin,
            fuelUsed: fuelUsedMin,
            fuelCost: fuelCostMin,
            totalCost: roundToTwo(tollCost + fuelCostMin),
        },
        max: {
            consumption: consumptionMax,
            fuelUsed: fuelUsedMax,
            fuelCost: fuelCostMax,
            totalCost: roundToTwo(tollCost + fuelCostMax),
        },
        avg: {
            consumption: fuelConsumption,
            fuelUsed: fuelUsedAvg,
            fuelCost: fuelCostAvg,
            totalCost: roundToTwo(tollCost + fuelCostAvg),
        },
    };
}

/**
 * Toll kodları listesinden toll bilgisi ve maliyet hesaplar
 */
function calculateTollsFromCodes(tollCodes, vehicleClass) {
    const tolls = [];
    for (const tollCode of tollCodes) {
        const toll = getTollByCode(tollCode);

        if (!toll) {
            tolls.push({ code: tollCode, name: "Bilinmeyen", type: "unknown", price: 0 });
            continue;
        }

        const price = toll.prices[vehicleClass];

        if (price === null || price === undefined) {
            tolls.push({
                code: toll.code,
                name: toll.name,
                type: toll.type,
                price: 0,
                note: `${vehicleClass} sınıfı için fiyat bilgisi mevcut değil`,
            });
            continue;
        }

        tolls.push({
            code: toll.code,
            name: toll.name,
            type: toll.type,
            price: roundToTwo(price),
        });
    }

    const tollCost = roundToTwo(calculateTotalCost(tolls.map((t) => t.price)));
    return { tolls, tollCost };
}

/**
 * İki konum arası toplam yol maliyetini hesaplar (81 il + ilçe desteği)
 * Tüm rotalar için Google description'dan akıllı toll tespiti yapar.
 */
async function calculateRouteCost(from, to, vehicleType, fuelConsumption, fuelType) {
    // 1. Araç sınıfını belirle
    const vehicleClass = getVehicleClass(vehicleType);
    if (!vehicleClass) {
        throw Object.assign(
            new Error(`Geçersiz araç tipi: '${vehicleType}'`),
            { statusCode: 400 }
        );
    }

    // 2. Konum parse — "Kadıköy, İstanbul" → { district, province }
    const fromParsed = parseLocation(from);
    const toParsed = parseLocation(to);

    // 3. Statik rota tanımını al (il bazlı toll eşleştirme — fallback)
    const routeKey = getRouteKey(from, to);
    const routeData = getRoute(routeKey);

    // 4. Google API'ye ilçe seviyesinde konum gönder
    const fromQuery = buildLocationQuery(fromParsed);
    const toQuery = buildLocationQuery(toParsed);

    let googleRoutes = [];
    try {
        googleRoutes = await getRouteInfo(fromQuery, toQuery);
    } catch (apiError) {
        console.log(`[WARN] Google API'den rota bilgisi alınamadı: ${apiError.message}`);
    }

    // Google API başarısızsa ve statik rota da yoksa hata ver
    if (googleRoutes.length === 0 && !routeData) {
        throw Object.assign(
            new Error(
                `'${from}' → '${to}' güzergahı için henüz rota verisi bulunamamaktadır. Lütfen farklı bir güzergah deneyin.`
            ),
            { statusCode: 404 }
        );
    }

    // Google API çalışmadıysa statik veriyle single rota dön
    if (googleRoutes.length === 0) {
        const { tolls, tollCost } = calculateTollsFromCodes(routeData.tollCodes, vehicleClass);
        const fuelDetails = calculateFuelDetails(null, null, fuelConsumption, fuelType, tollCost);

        return {
            from,
            to,
            vehicleType,
            vehicleClass,
            routes: [{
                label: "default",
                description: routeData.description,
                distanceKm: null,
                durationMin: null,
                fuelDetails,
                tolls,
                tollCost,
                totalCostRange: null,
            }],
            currency: "TRY",
        };
    }

    // 5. Her Google rotası için AKILLI toll tespiti + maliyet hesapla
    const calculatedRoutes = googleRoutes.map((gRoute) => {
        let tollCodes = [];

        if (gRoute.avoidsTolls) {
            // Ücretsiz yol rotası — toll yok
            tollCodes = [];
        } else if (gRoute.isDefault && routeData) {
            // Varsayılan rota: statik tanım varsa onu kullan (en güvenilir)
            tollCodes = routeData.tollCodes;
        } else {
            // Alternatif rotalar veya statik tanımı olmayan rotalar:
            // Google description'dan akıllı toll tespiti yap
            tollCodes = detectTollsFromDescription(gRoute.summary);
        }

        // 5. BOĞAZ GEÇİŞİ KONTROLÜ
        // Eğer rota İstanbul'da yaka değiştiriyorsa ancak hiç köprü/tünel tespit edilmediyse 
        // muhtemelen Google description'da eksiktir. Varsayılan bir geçiş ekleyelim.
        if (!gRoute.avoidsTolls && isCrossingBosphorus(fromParsed, toParsed)) {
            const bosphorusTolls = ["15TEMMUZ", "FSM", "YSS", "AVRASYA"];
            // Eğer spesifik bir geçiş bulunamadıysa ama yaka değişiyorsa:
            const preferredToll = getPreferredBosphorusToll(fromParsed.district);
            const hasBosphorusToll = tollCodes.some((code) => bosphorusTolls.includes(code));

            if (!hasBosphorusToll) {
                // Hiçbir geçiş bulunamadıysa (Google summary boşsa):
                // En mantıklı tahmini yap (Zeytinburnu -> Avrasya, Beşiktaş -> Köprü vb.)
                tollCodes.unshift(preferredToll);
            }
            // NOT: Eğer sistem "15TEMMUZ" (Köprü) bulduysa buna dokunmuyoruz.
            // Çünkü kullanıcı gerçekten E-5 üzerinden Köprü'yü kullanıyor olabilir.
        }

        const { tolls, tollCost } = calculateTollsFromCodes(tollCodes, vehicleClass);

        const fuelDetails = calculateFuelDetails(
            gRoute.distanceKm,
            gRoute.durationMin,
            fuelConsumption,
            fuelType,
            tollCost
        );

        const totalCostRange = fuelDetails && fuelDetails.min
            ? {
                min: fuelDetails.min.totalCost,
                avg: fuelDetails.avg.totalCost,
                max: fuelDetails.max.totalCost,
            }
            : tollCost > 0 ? { min: tollCost, avg: tollCost, max: tollCost } : null;

        return {
            description: gRoute.summary,
            distanceKm: gRoute.distanceKm,
            durationMin: gRoute.durationMin,
            fuelDetails,
            tolls,
            tollCost,
            totalCostRange,
            polyline: gRoute.polyline,
            // Etiketleme için kullanılacak ham değerler
            _avgTotalCost: totalCostRange ? totalCostRange.avg : Infinity,
            _durationMin: gRoute.durationMin,
        };
    });

    // 5. Etiketleme — en hızlı ve en ucuz rotayı bul
    let fastestIdx = 0;
    let cheapestIdx = 0;

    for (let i = 1; i < calculatedRoutes.length; i++) {
        if (calculatedRoutes[i]._durationMin < calculatedRoutes[fastestIdx]._durationMin) {
            fastestIdx = i;
        }
        if (calculatedRoutes[i]._avgTotalCost < calculatedRoutes[cheapestIdx]._avgTotalCost) {
            cheapestIdx = i;
        }
    }

    // Label ata ve geçici alanları temizle
    const labeledRoutes = calculatedRoutes.map((route, i) => {
        let label = "alternative";

        // Bir rotaya tek bir birincil etiket atayalım (Frontend uyumluluğu için)
        // Eğer aynı rota hem ucuz hem hızlıysa 'cheapest' öncelikli olsun (veya her ikisini de destekleyen bir yapı)
        if (i === cheapestIdx) label = "cheapest";
        else if (i === fastestIdx) label = "fastest";

        const { _avgTotalCost, _durationMin, ...cleanRoute } = route;
        return {
            label,
            ...cleanRoute,
        };
    });

    return {
        from,
        to,
        vehicleType,
        vehicleClass,
        routes: labeledRoutes,
        currency: "TRY",
    };
}

module.exports = { calculateRouteCost };
