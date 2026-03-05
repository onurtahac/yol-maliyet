/**
 * Uygulama yapılandırma ayarları
 * Merkezi config yönetimi
 */

const config = {
  // Sunucu ayarları
  port: process.env.PORT || 3000,
  nodeEnv: process.env.NODE_ENV || "development",

  // Google API
  googleApiKey: process.env.GOOGLE_API_KEY || "",

  // Desteklenen araç tipleri (vehicleType → vehicleClass eşleşmesi toll.data.js'de)
  vehicleTypes: ["car", "minibus", "bus", "truck", "motorcycle"],

  // Geçerli şehirler (rota validasyonu için)
  validCities: [
    "istanbul",
    "ankara",
    "izmir",
    "bursa",
    "antalya",
    "adana",
    "mersin",
    "edirne",
    "gaziantep",
    "kocaeli",
    "canakkale",
    "cesme",
    "aydin",
    "denizli",
    "nigde",
  ],
};

module.exports = config;
