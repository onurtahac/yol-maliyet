# 🚗 Yol Ne Kadar — Frontend Geliştirme Kılavuzu

## Proje Özeti

**"Yol Ne Kadar?"** — Türkiye'deki ücretli otoyol, köprü ve tünel geçiş ücretlerini + yakıt maliyetini hesaplayan modern bir web uygulaması. Kullanıcı nereden nereye gideceğini, araç tipini, yakıt türünü ve tüketimini girer; uygulama **alternatif rotalarla birlikte toplam yol maliyetini** gösterir.

**Teknoloji:** React (Vite) + Vanilla CSS
**API Base URL:** `http://localhost:3000`

---

## 📡 API Endpoint'leri

### 1. Health Check

```
GET /api/health
```

**Yanıt:**
```json
{
  "success": true,
  "message": "Yol Ücreti Hesaplama API çalışıyor",
  "timestamp": "2026-03-02T00:00:00.000Z"
}
```

---

### 2. Maliyet Hesaplama (Ana Endpoint)

```
POST /api/calculate
Content-Type: application/json
```

**Request Body:**
```json
{
  "from": "Istanbul",
  "to": "Ankara",
  "vehicleType": "car",
  "fuelConsumption": 7,
  "fuelType": "benzin"
}
```

| Alan | Tip | Zorunlu | Açıklama |
|------|-----|---------|----------|
| `from` | string | ✅ | Başlangıç şehri |
| `to` | string | ✅ | Varış şehri |
| `vehicleType` | string | ✅ | `car`, `minibus`, `bus`, `truck`, `motorcycle` |
| `fuelConsumption` | number | ❌ | Ortalama yakıt tüketimi (L/100km, 0-50 arası) |
| `fuelType` | string | ❌ | `benzin`, `motorin`, `lpg` (varsayılan: benzin) |

**Desteklenen Şehirler:**
`istanbul`, `ankara`, `izmir`, `bursa`, `antalya`, `adana`, `mersin`, `edirne`, `gaziantep`, `kocaeli`, `canakkale`, `cesme`, `aydin`, `denizli`, `nigde`, `sakarya`

**Başarılı Yanıt (200):**
```json
{
  "success": true,
  "data": {
    "from": "Istanbul",
    "to": "Ankara",
    "vehicleType": "car",
    "vehicleClass": "otomobil",
    "routes": [
      {
        "label": "fastest",
        "description": "Kuzey Marmara Otoyolu/O-7 ve Anadolu Otoyolu/O-4",
        "distanceKm": 444.6,
        "durationMin": 287,
        "fuelDetails": {
          "fuelType": "benzin",
          "fuelTypeName": "Benzin (95 Oktan)",
          "fuelPricePerLiter": 58,
          "averageSpeed": 92.95,
          "nominalConsumption": 7,
          "min": {
            "consumption": 6.3,
            "fuelUsed": 28.01,
            "fuelCost": 1624.58,
            "totalCost": 2021.58
          },
          "max": {
            "consumption": 9.1,
            "fuelUsed": 40.46,
            "fuelCost": 2346.68,
            "totalCost": 2743.68
          },
          "avg": {
            "consumption": 7,
            "fuelUsed": 31.12,
            "fuelCost": 1804.96,
            "totalCost": 2201.96
          }
        },
        "tolls": [
          {
            "code": "15TEMMUZ",
            "name": "15 Temmuz Şehitler Köprüsü",
            "type": "bridge",
            "price": 59
          },
          {
            "code": "O4",
            "name": "KGM Anadolu Otoyolu (Çamlıca – Akıncı)",
            "type": "motorway",
            "price": 338
          }
        ],
        "tollCost": 397,
        "totalCostRange": {
          "min": 2021.58,
          "avg": 2201.96,
          "max": 2743.68
        }
      },
      {
        "label": "cheapest",
        "description": "Kuzey Marmara Otoyolu/O-7",
        "distanceKm": 438.2,
        "durationMin": 350,
        "fuelDetails": { "..." : "aynı yapı" },
        "tolls": [],
        "tollCost": 0,
        "totalCostRange": {
          "min": 1601.38,
          "avg": 1778.86,
          "max": 2313.04
        }
      },
      {
        "label": "alternative",
        "description": "D200",
        "distanceKm": 536.8,
        "durationMin": 372,
        "fuelDetails": { "..." : "aynı yapı" },
        "tolls": [],
        "tollCost": 0,
        "totalCostRange": {
          "min": 1961.56,
          "avg": 2179.64,
          "max": 2833.3
        }
      }
    ],
    "currency": "TRY"
  }
}
```

**Hata Yanıtları:**

```json
// 400 — Eksik alan
{ "success": false, "message": "Eksik alan: 'from', 'to' ve 'vehicleType' alanları zorunludur." }

// 400 — Geçersiz araç tipi
{ "success": false, "message": "Desteklenmeyen araç tipi: 'bicycle'. Geçerli tipler: car, minibus, bus, truck, motorcycle" }

// 404 — Tanımsız rota
{ "success": false, "message": "'Paris' → 'Berlin' güzergahı için rota bulunamadı." }
```

---

## 🏗️ Frontend Mimari

### Proje Yapısı (React + Vite)

```
src/
├── assets/
│   ├── icons/              → SVG ikonları (araç, yakıt, yol)
│   └── images/             → Hero ve background görselleri
│
├── components/
│   ├── common/
│   │   ├── Button.jsx
│   │   ├── Select.jsx
│   │   ├── Input.jsx
│   │   ├── Slider.jsx      → Yakıt tüketimi slider'ı
│   │   ├── Badge.jsx        → "En Hızlı", "En Ucuz" etiketleri
│   │   ├── Tooltip.jsx
│   │   └── Loader.jsx       → Skeleton / pulse animasyonu
│   │
│   ├── layout/
│   │   ├── Header.jsx       → Logo + navigasyon
│   │   ├── Footer.jsx
│   │   └── Container.jsx
│   │
│   ├── calculator/
│   │   ├── RouteForm.jsx        → Ana form (nereden, nereye, araç, yakıt)
│   │   ├── CitySelect.jsx       → Akıllı şehir arama/seçme
│   │   ├── VehicleSelector.jsx  → Görsel araç tipi seçici (ikon kartları)
│   │   ├── FuelConfig.jsx       → Yakıt türü + tüketim slider'ı
│   │   └── SwapButton.jsx       → Nereden ↔ Nereye yer değiştirme
│   │
│   ├── results/
│   │   ├── ResultsPanel.jsx     → Sonuç container'ı
│   │   ├── RouteCard.jsx        → Tek bir rota kartı
│   │   ├── RouteCompare.jsx     → Rotaları yan yana karşılaştırma
│   │   ├── CostBreakdown.jsx    → Yakıt + geçiş ücreti dağılımı (chart)
│   │   ├── TollList.jsx         → Geçilen ücretli yapılar listesi
│   │   ├── FuelGauge.jsx        → Yakıt göstergesi animasyonu
│   │   └── SaveBadge.jsx        → "423₺ Tasarruf!" rozeti
│   │
│   └── hero/
│       ├── HeroSection.jsx      → Ana sayfa hero alanı
│       └── StatsCounter.jsx     → Animasyonlu sayaç (rota sayısı, köprü vb.)
│
├── hooks/
│   ├── useCalculate.js      → API çağrısı + loading/error state
│   └── useDebounce.js       → Input debounce
│
├── services/
│   └── api.js               → Axios instance + endpoint fonksiyonları
│
├── utils/
│   ├── formatters.js        → Para, mesafe, süre formatlama
│   └── constants.js         → Şehir listesi, araç tipleri, yakıt tipleri
│
├── styles/
│   ├── index.css            → Global stiller + CSS variables (design tokens)
│   ├── animations.css       → Keyframe animasyonları
│   └── components/          → Component bazlı CSS dosyaları
│
├── App.jsx
└── main.jsx
```

### Veri Akışı

```
[RouteForm] ──onSubmit──→ [useCalculate hook] ──POST /api/calculate──→ [Backend API]
                                    │
                                    ↓
                            [ResultsPanel]
                                    │
                    ┌───────────────┼───────────────┐
                    ↓               ↓               ↓
              [RouteCard]     [RouteCard]     [RouteCard]
              "fastest"       "cheapest"      "alternative"
```

---

## 🎨 Tasarım Sistemi — 2026 Modern UI

### Tema & Renk Paleti

```css
:root {
  /* ── Primary — Koyu Lacivert / Mavi gradyanları ── */
  --color-bg-primary:    #0a0e1a;        /* Ana arka plan (koyu uzay mavisi) */
  --color-bg-secondary:  #111827;        /* Kart arka planı */
  --color-bg-glass:      rgba(17, 24, 39, 0.6); /* Glassmorphism */

  /* ── Accent — Neon Turkuaz + Mavi gradyan ── */
  --color-accent:        #06d6a0;        /* Birincil aksan (turkuaz yeşil) */
  --color-accent-hover:  #05c090;
  --color-accent-glow:   rgba(6, 214, 160, 0.3); /* Glow efekti */

  /* ── Gradient ── */
  --gradient-primary:    linear-gradient(135deg, #667eea 0%, #06d6a0 100%);
  --gradient-card:       linear-gradient(145deg, rgba(255,255,255,0.05), rgba(255,255,255,0.02));
  --gradient-fastest:    linear-gradient(135deg, #f093fb 0%, #f5576c 100%); /* Pembe-kırmızı */
  --gradient-cheapest:   linear-gradient(135deg, #4facfe 0%, #00f2fe 100%); /* Mavi-cyan */

  /* ── Etiket Renkleri ── */
  --color-fastest:       #f5576c;
  --color-cheapest:      #06d6a0;
  --color-alternative:   #667eea;

  /* ── Metin ── */
  --color-text-primary:  #f1f5f9;
  --color-text-secondary:#94a3b8;
  --color-text-muted:    #64748b;

  /* ── Kenarlıklar ── */
  --border-glass:        1px solid rgba(255, 255, 255, 0.08);
  --border-radius-sm:    8px;
  --border-radius-md:    16px;
  --border-radius-lg:    24px;
  --border-radius-xl:    32px;

  /* ── Gölgeler ── */
  --shadow-card:         0 8px 32px rgba(0, 0, 0, 0.3);
  --shadow-glow:         0 0 40px var(--color-accent-glow);
  --shadow-float:        0 20px 60px rgba(0, 0, 0, 0.4);

  /* ── Tipografi ── */
  --font-family:         'Inter', 'SF Pro Display', -apple-system, sans-serif;
  --font-display:        'Outfit', 'Inter', sans-serif; /* Başlıklar */
  --font-mono:           'JetBrains Mono', monospace;    /* Fiyatlar */
}
```

### Tipografi Hiyerarşisi

| Element | Font | Size | Weight | Kullanım |
|---------|------|------|--------|----------|
| Hero Başlık | Outfit | 56px / 3.5rem | 800 | "Yol Ne Kadar?" ana başlık |
| Section Başlık | Outfit | 32px / 2rem | 700 | Sonuçlar, form başlıkları |
| Kart Başlık | Inter | 20px / 1.25rem | 600 | Rota açıklaması |
| Body | Inter | 16px / 1rem | 400 | Genel metin |
| Badge/Etiket | Inter | 12px / 0.75rem | 700 | "EN HIZLI", "EN UCUZ" |
| Fiyat (Büyük) | JetBrains Mono | 40px / 2.5rem | 700 | totalCost gösterimi |
| Fiyat (Küçük) | JetBrains Mono | 18px / 1.125rem | 500 | Toll detay fiyatları |

---

## 📐 Sayfa Yapısı & Bileşenler

### 1. Hero Section

```
┌─────────────────────────────────────────────────┐
│  🚗 Yol Ne Kadar?                               │
│  Türkiye'nin ücretli yol maliyet hesaplayıcısı  │
│                                                  │
│  ┌─────────┐  ┌─────────┐  ┌─────────┐         │
│  │ 19+ Yol │  │ 5 Köprü │  │ 16 Şehir│         │
│  └─────────┘  └─────────┘  └─────────┘         │
│  (animasyonlu sayaçlar, counter-up efekti)       │
│                                                  │
│  Parçacıklı / paralax arka plan efekti           │
└─────────────────────────────────────────────────┘
```

**Tasarım detayları:**
- Arka plan: Koyu uzay mavisi üzerine hafif yol haritası deseni veya parçacık animasyonu
- Başlık: Gradient text efekti (turkuaz → mavi)
- Sayaçlar: Sayfa yüklendiğinde 0'dan hedefe doğru count-up animasyonu
- Scroll indicator: Aşağı yönlü ok + bounce animasyonu

---

### 2. Hesaplama Formu (RouteForm)

```
┌────────────────────────────────────────────────────┐
│  Glassmorphism kart (backdrop-blur: 20px)          │
│                                                     │
│  ┌──────────────────┐  ⇄  ┌──────────────────┐    │
│  │ 📍 Nereden       │     │ 📍 Nereye         │    │
│  │ [ İstanbul    ▼ ]│     │ [ Ankara       ▼ ]│    │
│  └──────────────────┘     └──────────────────┘    │
│                                                     │
│  ── Araç Seçimi (İkon Kartlar) ─────────────────    │
│  ┌─────┐ ┌─────┐ ┌─────┐ ┌─────┐ ┌──────┐        │
│  │ 🚗  │ │ 🚐  │ │ 🚌  │ │ 🚛  │ │ 🏍️  │        │
│  │ Oto  │ │ Mini│ │ Otob│ │ Kam │ │ Moto │        │
│  └─────┘ └─────┘ └─────┘ └─────┘ └──────┘        │
│  (seçili olanda glow + scale animasyonu)           │
│                                                     │
│  ── Yakıt Ayarları ────────────────────────────     │
│  Yakıt Türü:  ● Benzin  ○ Motorin  ○ LPG          │
│  Tüketim:     ◄━━━━━●━━━━━━━► 7.0 L/100km         │
│               (animasyonlu slider, tooltip)         │
│                                                     │
│  ┌─────────────────────────────────────────────┐   │
│  │        🔍  HESAPLA   (gradient buton)       │   │
│  └─────────────────────────────────────────────┘   │
│  (hover'da scale 1.02 + glow, tıklamada ripple)    │
└────────────────────────────────────────────────────┘
```

**UX Detayları:**
- Şehir seçimi: Autocomplete dropdown (yazarken filtrele)
- Swap butonu (⇄): Tıklandığında 180° rotate animasyonu
- Araç kartları: Hover'da yukarı kayma + gölge artışı, seçili olanda neon glow border
- Slider: Gradient track, thumb'da değer tooltip'i
- Hesapla butonu: `var(--gradient-primary)` arka plan, hover'da parlama dalgası

---

### 3. Sonuçlar (ResultsPanel + RouteCards)

```
┌────────────────────────────────────────────────────┐
│  İstanbul → Ankara   ·   Otomobil   ·   Benzin    │
│                                                     │
│  ┌─ EN HIZLI ──────────────────────────────────┐   │
│  │  🏷️ fastest                                  │   │
│  │  O-7 + O-4 Anadolu Otoyolu                  │   │
│  │                                              │   │
│  │  444.6 km  ·  4s 47dk  ·  ⌀ 93 km/s         │   │
│  │                                              │   │
│  │  ┌────────────┐  ┌────────────────────────┐ │   │
│  │  │ YAKIT      │  │ GEÇİŞ ÜCRETLERİ       │ │   │
│  │  │ 1.804₺     │  │ 15 Temmuz Köprü  59₺  │ │   │
│  │  │ 31.1 L     │  │ O-4 Otoyol      338₺  │ │   │
│  │  └────────────┘  │ Toplam:          397₺  │ │   │
│  │                   └────────────────────────┘ │   │
│  │                                              │   │
│  │  ₺ 2.021 ━━━━━━━━▓▓▓▓▓▓━━━━━━━━ ₺ 2.743   │   │
│  │         min    ▲ 2.201 ort.         max      │   │
│  │                (maliyet range bar)            │   │
│  └──────────────────────────────────────────────┘   │
│                                                     │
│  ┌─ EN UCUZ ───────────────────────────────────┐   │
│  │  🏷️ cheapest         💚 423₺ TASARRUF!      │   │
│  │  O-7 Kuzey Marmara (ücretsiz yol)           │   │
│  │  438 km  ·  5s50dk  ·  Geçiş: 0₺            │   │
│  │  ₺ 1.601 ━━━━━━━━▓▓▓▓━━━━━━━━━━ ₺ 2.313    │   │
│  └──────────────────────────────────────────────┘   │
│                                                     │
│  ┌─ ALTERNATİF ────────────────────────────────┐   │
│  │  🏷️ alternative                              │   │
│  │  D200 Devlet Yolu                            │   │
│  │  536 km  ·  6s12dk  ·  Geçiş: 0₺            │   │
│  │  ₺ 1.961 ━━━━━━━━▓▓▓▓▓━━━━━━━━━ ₺ 2.833    │   │
│  └──────────────────────────────────────────────┘   │
└────────────────────────────────────────────────────┘
```

**Tasarım detayları:**
- Her rota kartı: Glassmorphism arka plan + sol kenarda renkli accent bar
  - fastest → pembe-kırmızı (`--gradient-fastest`)
  - cheapest → mavi-cyan (`--gradient-cheapest`)
  - alternative → lavanta (`--color-alternative`)
- Etiket badge'leri: Gradient arka planlı yuvarlak rozetler
- Tasarruf rozeti: Pulse animasyonlu yeşil badge
- Maliyet range bar: Gradient progress bar (min → max arası)
- Kart açılışı: Staggered slide-up + fade-in animasyonu (her kart 100ms gecikmeyle)
- Toll listesi: Expand/collapse (accordion tarzı)

---

### 4. Cost Breakdown Chart

```
┌─────────────────────────────────────┐
│  Maliyet Dağılımı (Donut Chart)     │
│                                      │
│       ╭────────╮                     │
│      ╱  YAKIT   ╲    🟢 Yakıt: 82%  │
│     │   1.804₺   │   🔵 Geçiş: 18%  │
│      ╲  GEÇİŞ  ╱                    │
│       ╰────────╯                     │
│     Toplam: 2.201₺                   │
└─────────────────────────────────────┘
```

- Donut/pie chart: CSS-only veya lightweight chart library (Chart.js mini)
- Animasyonlu dolum: Sayfa yüklendiğinde 0'dan hedefe doğru çizim

---

## ✨ Animasyon & Mikroetkileşim Listesi

| Element | Animasyon | Detay |
|---------|-----------|-------|
| Sayfa yükleme | Fade-in + slide-up | 0.6s ease-out |
| Hero sayaçlar | Count-up | 0 → hedef, 2s ease-out |
| Araç kartı (hover) | Scale + lift | `transform: translateY(-4px) scale(1.03)` |
| Araç kartı (seçili) | Neon glow | `box-shadow: 0 0 20px var(--color-accent-glow)` |
| Swap butonu | Rotate | 180° / 0.4s |
| Hesapla butonu | Ripple + glow | Radial gradient wave |
| Loading state | Skeleton pulse | Gradient shimmer animasyonu |
| Sonuç kartları | Staggered entry | Her kart 100ms gecikmeyle slide-up |
| Maliyet bar | Width animasyonu | 0% → hesaplanmış % / 1.2s ease-out |
| Tasarruf badge | Pulse | Scale 1 → 1.1 → 1 / 2s infinite |
| Toll listesi | Accordion | Height 0 → auto / 0.3s |
| Tooltip | Fade-in + scale | 0.2s |

---

## 📱 Responsive Breakpoint'ler

```css
/* Mobil öncelikli (Mobile-first) */
@media (min-width: 480px)  { /* Büyük telefon */  }
@media (min-width: 768px)  { /* Tablet */          }
@media (min-width: 1024px) { /* Laptop */          }
@media (min-width: 1280px) { /* Masaüstü */        }
```

| Breakpoint | Form Layout | Kart Layout | Özel Davranış |
|------------|-------------|-------------|---------------|
| < 480px | Tek kolon, full-width | Tek kolon | Araç seçici yatay scroll |
| 480-768px | Tek kolon, padding artışı | Tek kolon + genişleme | Swap butonu yatay |
| 768-1024px | İki kolon (nereden/nereye) | İki kolon grid | Yan yana kart |
| > 1024px | Yatay form satırı | Üç kolon grid | Tam genişlik experience |

---

## 🚀 Performans & UX Kuralları

1. **İlk Yükleme < 2s** — Code splitting, lazy loading, optimize edilmiş font yükleme
2. **API çağrısı sırasında** — Skeleton loader göster (boş kart şablonları pulse eder)
3. **Hata durumunda** — Toast notification (kırmızı) + form alanında inline hata
4. **Boş state** — "Rotanızı seçin ve maliyeti hesaplayın" ikonu + metin
5. **Font yükleme** — `font-display: swap`, Google Fonts (Inter 400/500/600/700, Outfit 700/800, JetBrains Mono 500/700)
6. **Erişilebilirlik** — Tüm butonlarda `aria-label`, form input'larında `label`, kontrast oranı ≥ 4.5:1

---

## 📋 Geliştirme Sırası

1. Vite + React projesini oluştur
2. `index.css` → Tüm design token'ları ve global stilleri yaz
3. `services/api.js` → Axios instance + `calculateRoute()` fonksiyonu
4. `utils/constants.js` → Şehir listesi ve araç/yakıt tipleri
5. Layout bileşenleri → Header, Footer, Container
6. `RouteForm` → Form + validasyon + submit
7. `useCalculate` hook → API çağrısı + state yönetimi
8. `ResultsPanel` + `RouteCard` → Sonuç gösterimi
9. Animasyonlar + mikroetkileşimler
10. Responsive ayarlar + son polish

---

## 💡 İlham Kaynakları

- **Google Flights** — Rota karşılaştırma kartları, minimal ama bilgi dolu
- **Wise (TransferWise)** — Para dönüşüm arayüzü, gradient'ler, şeffaf maliyet dağılımı
- **Linear App** — Koyu tema, glassmorphism, mikro-animasyonlar
- **Vercel Dashboard** — Modern dark UI, temiz tipografi
- **Apple Maps** — Rota seçim kartları, dokunmatik etkileşimler
