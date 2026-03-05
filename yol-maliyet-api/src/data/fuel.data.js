/**
 * Yakıt Fiyat Verileri
 *
 * Türkiye güncel yakıt fiyatları (TL/Litre)
 * Bu veriler periyodik olarak güncellenmelidir.
 */

const fuelPrices = {
    benzin: {
        name: "Benzin (95 Oktan)",
        pricePerLiter: 59.33,
    },
    motorin: {
        name: "Motorin (Dizel)",
        pricePerLiter: 63.52,
    },
    lpg: {
        name: "LPG (Otogaz)",
        pricePerLiter: 30.0,
    },
};

/**
 * Yakıt tipine göre litre fiyatını döner
 * @param {string} fuelType - "benzin", "motorin", "lpg"
 * @returns {object|undefined}
 */
function getFuelPrice(fuelType) {
    return fuelPrices[fuelType] || null;
}

/**
 * Desteklenen yakıt tiplerini döner
 * @returns {string[]}
 */
function getAvailableFuelTypes() {
    return Object.keys(fuelPrices);
}

module.exports = { fuelPrices, getFuelPrice, getAvailableFuelTypes };
