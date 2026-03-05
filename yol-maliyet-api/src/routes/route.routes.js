/**
 * Route Routes
 *
 * API endpoint tanımları.
 * Routes sadece controller'a yönlendirir, iş mantığı içermez.
 */

const express = require("express");
const router = express.Router();

const { calculateRoute } = require("../controllers/route.controller");
const {
    validateCalculateRequest,
} = require("../middlewares/validation.middleware");

// POST /api/calculate — Rota maliyet hesaplama
router.post("/calculate", validateCalculateRequest, calculateRoute);

module.exports = router;
