# Restoran Masa, Menü ve Sipariş Takip Sistemi

**Yazılım Doğrulama ve Geçerleme (YDG) Dersi - Proje**

[![Tests](https://img.shields.io/badge/tests-51%20passing-brightgreen)](.)
[![Coverage](https://img.shields.io/badge/coverage-85%25-brightgreen)](.)
[![E2E](https://img.shields.io/badge/E2E-10%20scenarios-blue)](.)
[![Docker](https://img.shields.io/badge/docker-ready-blue)](.)
[![Jenkins](https://img.shields.io/badge/jenkins-configured-blue)](.)
[![Status](https://img.shields.io/badge/status-completed-success)](.)
[![CI/CD](https://img.shields.io/badge/CI%2FCD-automated-success)](.)

---

## Proje Tanımı
Bu proje, bir restoranda masa rezervasyonları, menü yönetimi ve sipariş takibini yapan kapsamlı bir sistemdir.

**Özellikler:**
- 🍽️ Restoran yönetimi (CRUD)
- 🪑 Masa takibi ve rezervasyon
- 📋 Menü oluşturma ve güncelleme
- 🧾 Sipariş yönetimi
- ✅ Kapsamlı test coverage (%85+)
- 🐳 Docker containerization
- 🔄 Jenkins CI/CD pipeline (6 stage)

## Gereksinimler

### Sistem Gereksinimleri
- Node.js 16+
- Git
- Docker & Docker Compose
- Jenkins (CI/CD için)
- Python 3.8+ (Selenium testleri için)

### Yazılım Bağımlılıkları
- Express.js - Web Framework
- SQLite - Database
- Jest - Unit Testing
- Supertest - Integration Testing
- Selenium WebDriver - E2E Testing

## Kurulum

```bash
# Bağımlılıkları yükle
npm install

# Veri tabanını oluştur
npm run db:init

# Geliştirme sunucusunu başlat
npm run dev
```

## Test Senaryoları

### 1. Birim Testleri (Unit Tests)
```bash
npm run test:unit
```
- **Coverage:** Servis katmanının %50+ kapsanması
- **Raporlar:** `reports/coverage/`

### 2. Entegrasyon Testleri (Integration Tests)
```bash
npm run test:integration
```
- API endpoint'leri database ile test edilir
- **Toplam:** 22 test
- API endpoint'leri gerçek database ile test edilir

### 3. End-to-End Testleri (Selenium)
```bash
npm run test:e2e
```
- **Senaryolar:** 10 adet (REQ-050 to REQ-059)
   - REQ-050: Restoran oluşturma
   - REQ-051: Masa durumu değiştirme
   - REQ-052: Sipariş oluşturma
   - REQ-053: Menü güncelleme
   - REQ-054: Restoran silme
   - REQ-055: Masa rezervasyon
   - REQ-056: Sipariş iptal
   - REQ-057: Sipariş geçmişi
   - REQ-058: Restoran arama
   - REQ-059: Fatura oluşturma
- **Headless Mode:** `HEADLESS=1 npm run test:e2e`
- **Tek senaryo:** `SCENARIO=REQ-050 npm run test:e2e`

## Docker ile Çalıştırma

```bash
# Build ve başlat
docker-compose -f docker/docker-compose.yml up -d

# Logları izle
docker logs -f restoran-takip-sistemi

# Health check
curl http://localhost:3000/health

# Durdur
docker-compose -f docker/docker-compose.yml down
```

**Not:** SQLite Windows binary'si Linux container'da çalışmaz. Dockerfile içinde `--build-from-source` ile rebuild edilir.

## Jenkins CI/CD Pipeline

6 stage'li pipeline:

| Stage | Puan | Açıklama |
|-------|------|----------|
| 1. GitHub Checkout | 5 | Repository'den kod çekme |
| 2. Build | 5 | npm install |
| 3. Unit Tests | 15 | 29 test, %86+ coverage |
| 4. Integration Tests | 15 | 22 test |
| 5. Docker | 5 | Build, up, health check |
| 6. Selenium E2E | 55 | 10 senaryo |
| **TOPLAM** | **100** | |

### Jenkins Kurulumu

Detaylı kurulum rehberi için: [JENKINS_SETUP.md](JENKINS_SETUP.md)

Hızlı adımlar:
1. Jenkins kurulumu (Windows/Docker)
2. Eklentileri yükle (Git, Pipeline, Docker, JUnit, HTML Publisher)
3. GitHub credentials oluştur (ID: `github-credentials`)
4. Pipeline job oluştur (`Jenkinsfile` kullanarak)
5. GitHub webhook yapılandır
6. Build başlat
## Proje Yapısı

```
restoran-takip-sistemi/
├── src/
│   ├── app.js
│   ├── routes/
│   │   ├── restaurants.js
│   │   ├── tables.js
│   │   ├── menus.js
│   │   └── orders.js
│   ├── services/
│   │   ├── restaurantService.js
│   │   ├── tableService.js
│   │   ├── menuService.js
│   │   └── orderService.js
│   └── models/
│       └── database.js
├── tests/
│   ├── unit/
│   ├── integration/
│   └── e2e/
├── docker/
│   ├── Dockerfile
│   └── docker-compose.yml
├── Jenkinsfile
├── package.json
└── README.md
```

## API Endpoint'leri

### Restoran Yönetimi
- `GET /api/restaurants` - Tüm restoranları listele
- `POST /api/restaurants` - Yeni restoran ekle
- `GET /api/restaurants/:id` - Belirli restoranı getir

### Masa Yönetimi
- `GET /api/restaurants/:id/tables` - Restorandaki masaları listele
- `POST /api/restaurants/:id/tables` - Yeni masa ekle
- `PUT /api/tables/:id/status` - Masa durumunu güncelle

### Menü Yönetimi
- `GET /api/restaurants/:id/menus` - Restoran menüsünü getir
- `POST /api/restaurants/:id/menus` - Yeni menü öğesi ekle
- `DELETE /api/menus/:id` - Menü öğesi sil

### Sipariş Yönetimi
- `POST /api/orders` - Sipariş oluştur
- `GET /api/orders/:id` - Sipariş detaylarını getir
- `PUT /api/orders/:id/status` - Sipariş durumunu güncelle

## Test Raporu Şablonu

Her test senaryosu için aşağıdaki başlıklar kullanılacak:
- **Test Durumu Kimliği**: REQ-00X
- **İlgili Gereksinimler**: Sistemin hangi bölümünü test ediyor
- **Ön Koşullar**: Test başlamadan önce gerekli durum
- **Adım Adım İşlemler**: Test adımları
- **Beklenen Sonuç**: Başarılı sonuç
- **Son Koşullar**: Sistem son durumu

## Değerlendirme Kriterleri

| Aşama | Puan | Başarı Kriteri |
|-------|------|-----------------|
| GitHub Checkout | 5 | Kod başarıyla klonlanır |
| Build | 5 | Tüm bağımlılıklar yüklenir |
| Unit Tests | 15 | %50+ test coverage |
| Integration Tests | 15 | Tüm endpoint'ler başarılı |
| Docker | 5 | Container başarıyla çalışır |
| Selenium (3 senaryo) | 55 | Tüm senaryolar pass |
| Ek Senaryolar | +2 c/a | (max 10 puan) |
| **Toplam** | **100** | - |

## Son Teslim Tarihi
**3 hafta**

---
**Not:** Proje teslimi sonrası sınav sırasında ek bir test senaryosu yazılması beklenir.
