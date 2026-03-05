/**
 * Standart API Response Yardımcıları
 *
 * Tüm API yanıtları tutarlı bir formatta döner.
 */

/**
 * Başarılı yanıt döner
 * @param {object} res - Express response objesi
 * @param {object} data - Döndürülecek veri
 * @param {number} statusCode - HTTP status kodu (varsayılan: 200)
 */
function successResponse(res, data, statusCode = 200) {
    return res.status(statusCode).json({
        success: true,
        data,
    });
}

/**
 * Hata yanıtı döner
 * @param {object} res - Express response objesi
 * @param {string} message - Hata mesajı
 * @param {number} statusCode - HTTP status kodu (varsayılan: 500)
 */
function errorResponse(res, message, statusCode = 500) {
    return res.status(statusCode).json({
        success: false,
        message,
    });
}

module.exports = { successResponse, errorResponse };
