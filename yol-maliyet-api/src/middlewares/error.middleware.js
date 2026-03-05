/**
 * Error Middleware
 *
 * Tüm hataları merkezi olarak yakalar.
 * Standart JSON hata formatı döner.
 */

// eslint-disable-next-line no-unused-vars
function errorHandler(err, req, res, next) {
    console.error(`[ERROR] ${err.message}`);

    const statusCode = err.statusCode || 500;
    const response = {
        success: false,
        message: err.message || "Sunucu hatası oluştu",
    };

    // Development ortamında stack trace ekle
    if (process.env.NODE_ENV === "development") {
        response.stack = err.stack;
    }

    res.status(statusCode).json(response);
}

module.exports = { errorHandler };
