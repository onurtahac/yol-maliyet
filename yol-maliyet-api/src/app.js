/**
 * Express Uygulama Kurulumu
 *
 * Middleware'leri, route'ları ve error handler'ı bağlar.
 * Server başlatma işlemi server.js'de yapılır.
 */

const express = require("express");
const cors = require("cors");
const routeRoutes = require("./routes/route.routes");
const { errorHandler } = require("./middlewares/error.middleware");

const app = express();

// ─── Global Middleware'ler ───
app.use(cors());
app.use(express.json());

// ─── Health Check ───
app.get("/api/health", (req, res) => {
    res.json({
        success: true,
        message: "Yol Ücreti Hesaplama API çalışıyor",
        timestamp: new Date().toISOString(),
    });
});

// ─── API Routes ───
app.use("/api", routeRoutes);

// ─── 404 Handler ───
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: `Endpoint bulunamadı: ${req.method} ${req.originalUrl}`,
    });
});

// ─── Global Error Handler (en sonda olmalı) ───
app.use(errorHandler);

module.exports = app;
