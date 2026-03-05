/**
 * Format currency in Turkish Lira
 * @param {number} amount
 * @returns {string} e.g. "2.201₺" or "2.201,96₺"
 */
export function formatCurrency(amount, decimals = 0) {
    if (amount == null || isNaN(amount)) return '—';
    return new Intl.NumberFormat('tr-TR', {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
    }).format(amount) + '₺';
}

/**
 * Format distance
 * @param {number} km
 * @returns {string} e.g. "444,6 km"
 */
export function formatDistance(km) {
    if (km == null) return '—';
    return new Intl.NumberFormat('tr-TR', {
        minimumFractionDigits: 1,
        maximumFractionDigits: 1,
    }).format(km) + ' km';
}

/**
 * Format duration from minutes
 * @param {number} minutes
 * @returns {string} e.g. "4s 47dk"
 */
export function formatDuration(minutes) {
    if (minutes == null) return '—';
    const hours = Math.floor(minutes / 60);
    const mins = Math.round(minutes % 60);
    if (hours === 0) return `${mins}dk`;
    return `${hours}s ${mins}dk`;
}

/**
 * Format fuel amount
 * @param {number} liters
 * @returns {string} e.g. "31,1 L"
 */
export function formatFuel(liters) {
    if (liters == null) return '—';
    return new Intl.NumberFormat('tr-TR', {
        minimumFractionDigits: 1,
        maximumFractionDigits: 1,
    }).format(liters) + ' L';
}

/**
 * Format speed
 * @param {number} speed km/h
 * @returns {string} e.g. "93 km/s"
 */
export function formatSpeed(speed) {
    if (speed == null) return '—';
    return Math.round(speed) + ' km/s';
}

/**
 * Format consumption
 * @param {number} consumption L/100km
 * @returns {string} e.g. "7,0 L/100km"
 */
export function formatConsumption(consumption) {
    if (consumption == null) return '—';
    return new Intl.NumberFormat('tr-TR', {
        minimumFractionDigits: 1,
        maximumFractionDigits: 1,
    }).format(consumption) + ' L/100km';
}
