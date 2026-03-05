/**
 * Sunucu Başlatma Noktası
 *
 * dotenv yükler, config'den port alır ve uygulamayı dinlemeye başlatır.
 */

require("dotenv").config();

const app = require("./app");
const config = require("./config/app.config");

const PORT = config.port;

app.listen(PORT, () => {
    console.log(`
╔══════════════════════════════════════════════╗
║   🚗 Yol Ücreti Hesaplama API               ║
║   Port: ${String(PORT).padEnd(36)}║
║   Ortam: ${String(config.nodeEnv).padEnd(35)}║
║   API: http://localhost:${PORT}/api/calculate  ║
╚══════════════════════════════════════════════╝
  `);
});
