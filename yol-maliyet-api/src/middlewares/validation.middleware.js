/**
 * Validation Middleware
 *
 * Request body kontrolü yapar.
 * 81 il + ilçe desteği — şehir kısıtlaması yoktur.
 */

const config = require("../config/app.config");
const { getAvailableFuelTypes } = require("../data/fuel.data");

function validateCalculateRequest(req, res, next) {
    const { from, to, vehicleType, fuelConsumption, fuelType } = req.body;

    // ── Zorunlu alan kontrolü ──
    if (!from || !to || !vehicleType) {
        return res.status(400).json({
            success: false,
            message:
                "Eksik alan: 'from', 'to' ve 'vehicleType' alanları zorunludur.",
        });
    }

    // ── Tip kontrolü — string olmalı ──
    if (
        typeof from !== "string" ||
        typeof to !== "string" ||
        typeof vehicleType !== "string"
    ) {
        return res.status(400).json({
            success: false,
            message: "'from', 'to' ve 'vehicleType' alanları metin olmalıdır.",
        });
    }

    // ── from/to minimum uzunluk kontrolü ──
    if (from.trim().length < 2 || to.trim().length < 2) {
        return res.status(400).json({
            success: false,
            message: "'from' ve 'to' alanları en az 2 karakter olmalıdır.",
        });
    }

    // ── Araç tipi doğrulama ──
    const normalizedVehicleType = vehicleType.toLowerCase().trim();
    if (!config.vehicleTypes.includes(normalizedVehicleType)) {
        return res.status(400).json({
            success: false,
            message: `Desteklenmeyen araç tipi: '${vehicleType}'. Geçerli tipler: ${config.vehicleTypes.join(", ")}`,
        });
    }

    // ── Yakıt tüketimi doğrulama (opsiyonel) ──
    if (fuelConsumption !== undefined && fuelConsumption !== null) {
        const consumption = Number(fuelConsumption);
        if (isNaN(consumption) || consumption <= 0 || consumption > 50) {
            return res.status(400).json({
                success: false,
                message:
                    "'fuelConsumption' alanı 0-50 arası bir sayı olmalıdır (L/100km).",
            });
        }
        req.body.fuelConsumption = consumption;
    }

    // ── Yakıt tipi doğrulama (opsiyonel) ──
    if (fuelType !== undefined && fuelType !== null) {
        const normalizedFuelType = String(fuelType).toLowerCase().trim();
        const validFuelTypes = getAvailableFuelTypes();
        if (!validFuelTypes.includes(normalizedFuelType)) {
            return res.status(400).json({
                success: false,
                message: `Desteklenmeyen yakıt tipi: '${fuelType}'. Geçerli tipler: ${validFuelTypes.join(", ")}`,
            });
        }
        req.body.fuelType = normalizedFuelType;
    }

    // ── Normalize edilmiş değerleri yaz ──
    req.body.vehicleType = normalizedVehicleType;
    req.body.from = from.trim();
    req.body.to = to.trim();

    next();
}

module.exports = { validateCalculateRequest };
