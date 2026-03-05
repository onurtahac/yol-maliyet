# 🚗 Yol Ne Kadar? - Frontend

Yol Ne Kadar projesinin React ve Vite kullanılarak geliştirilen kullanıcı arayüzü dosyalarını içerir.

## Özellikler
- Modern ve duyarlı (responsive) tasarım.
- Koyu tema (Dark UI) ve Glassmorphism efektleri.
- Google Maps entegrasyonu ile etkileşimli rota çizimi.
- Animasyonlu kartlar ve sonuç gösterimi.

## Başlangıç

Projeyi yerelde çalıştırmak için:

```bash
npm install
# Ardından .env dosyasını oluşturup VITE_GOOGLE_MAPS_API_KEY değerini girin.
npm run dev
```

## Backend Entegrasyonu
Bu uygulamanın tam çalışması için `../yol-maliyet-api` klasöründeki Node.js sunucusunun da aynı anda çalışıyor olması gerekir. Frontend varsayılan olarak `http://localhost:3000` API adresine istek atar.
