/**
 * Route Controller
 *
 * HTTP katmanı — request alır, service'e iletir, response döner.
 * İş mantığı içermez.
 */

const { calculateRouteCost } = require("../services/route.service");
const { successResponse } = require("../utils/response.helper");

/**
 * POST /api/calculate
 * Rota maliyet hesaplama endpoint handler
 */
async function calculateRoute(req, res, next) {
    try {
        const { from, to, vehicleType, fuelConsumption, fuelType } = req.body;

        const result = await calculateRouteCost(
            from,
            to,
            vehicleType,
            fuelConsumption || null,
            fuelType || null
        );

        return successResponse(res, result);
    } catch (error) {
        next(error);
    }
}

module.exports = { calculateRoute };
