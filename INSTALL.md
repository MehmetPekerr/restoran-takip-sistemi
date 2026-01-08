# KURULUM VE KULLANIM REHBERİ
## Restoran Masa, Menü, Sipariş Takip Sistemi

### 📋 İçindekiler
1. [Gereksinimler](#gereksinimler)
2. [Hızlı Başlangıç](#hızlı-başlangıç)
3. [Lokal Geliştirme](#lokal-geliştirme)
4. [Testleri Çalıştırma](#testleri-çalıştırma)
5. [Docker ile Çalıştırma](#docker-ile-çalıştırma)
6. [Jenkins Pipeline Kurulumu](#jenkins-pipeline-kurulumu)

---

## Gereksinimler

### Sistem Gereksinimleri
- **Node.js**: 16.x veya üzeri
- **npm**: 8.x veya üzeri
- **Git**: 2.30 veya üzeri
- **Docker & Docker Compose**: 20.10+
- **Java**: 11+ (Jenkins için)
- **Python**: 3.8+ (Selenium testleri için)
- **Chrome/Chromium**: En son sürüm (E2E testleri için)

### Windows Kurulum Örneği

```powershell
# Node.js indir ve kur
# https://nodejs.org/ adresinden LTS versiyonu indir

# Kurulumu doğrula
node --version
npm --version

# Git indir ve kur
# https://git-scm.com/ adresinden indir

# Docker Desktop indir ve kur
# https://www.docker.com/products/docker-desktop
```

---

## Hızlı Başlangıç

### 1. Projeyi Klonla
```bash
git clone https://github.com/YOUR_USERNAME/restoran-takip-sistemi.git
cd restoran-takip-sistemi
```

### 2. Bağımlılıkları Yükle
```bash
npm install
```

### 3. Sunucuyu Başlat
```bash
npm start
```

Sunucu başarıyla başlatılırsa:
```
Restoran Takip Sistemi sunucusu 3000 portunda çalışıyor
```

### 4. Health Check
```bash
curl http://localhost:3000/health
```

Beklenen yanıt:
```json
{"status":"OK","timestamp":"2025-12-28T10:30:00.000Z"}
```

---

## Lokal Geliştirme

### Geliştirme Modunda Çalıştırma (Auto-reload)
```bash
npm run dev
```

Bu `nodemon` kullanarak dosya değişikliklerinde otomatik olarak sunucuyu yeniden başlatır.

### Proje Yapısı

```
restoran-takip-sistemi/
│
├── src/
│   ├── app.js                 # Express uygulama giriş noktası
│   ├── models/
│   │   └── database.js        # SQLite veritabanı bağlantısı
│   ├── services/
│   │   ├── restaurantService.js
│   │   ├── tableService.js
│   │   ├── menuService.js
│   │   └── orderService.js
│   └── routes/
│       ├── restaurants.js
│       ├── tables.js
│       ├── menus.js
│       └── orders.js
│
├── tests/
│   ├── unit/                  # Jest Unit Testleri
│   │   ├── restaurantService.test.js
│   │   ├── tableService.test.js
│   │   ├── menuService.test.js
│   │   └── orderService.test.js
│   ├── integration/           # Supertest Integration Testleri
│   │   ├── restaurants.integration.test.js
│   │   ├── tables.integration.test.js
│   │   ├── menus.integration.test.js
│   │   └── orders.integration.test.js
│   └── e2e/                   # Selenium E2E Testleri
│       ├── selenium-runner.js
│       └── test-scenarios-report.js
│
├── docker/
│   ├── Dockerfile
│   └── docker-compose.yml
│
├── reports/                   # Test raporları
│   ├── coverage/              # Coverage raporları
│   └── test-results.xml       # JUnit format sonuçlar
│
├── package.json
├── jest.config.js
├── Jenkinsfile               # CI/CD pipeline tanımı
├── README.md
└── INSTALL.md               # Bu dosya
```

---

## Testleri Çalıştırma

### Unit Testleri
```bash
npm run test:unit
```

**Çıktı:**
- Jest tarafından tüm unit testleri çalıştırılır
- Coverage raporu `reports/coverage/` dizinine kaydedilir
- Terminal'de özet bilgi gösterilir

### Integration Testleri
```bash
npm run test:integration
```

**Çıktı:**
- Supertest tarafından API endpoint testleri çalıştırılır
- Sunucunun çalışıyor olması gerekli

### E2E / Selenium Testleri
```bash
npm run test:e2e
```

**Ön Koşullar:**
- Sunucu çalışıyor (3000 portunda)
- Chrome tarayıcısı kurulu
- Chromedriver indirmiş olmalı

### Tüm Testleri Çalıştır
```bash
npm run test:all
```

Bu sırasıyla unit, integration ve e2e testlerini çalıştırır.

### Test Coverage İncelemek
```bash
npm run test:unit
# Tarayıcıda aç:
# reports/coverage/index.html
```

---

## Docker ile Çalıştırma

### Docker Compose ile Başlat
```bash
docker-compose -f docker/docker-compose.yml up -d
```

### Kontainer Durumunu Kontrol Et
```bash
docker-compose -f docker/docker-compose.yml ps
```

### Uygulamaya Erişim
```
http://localhost:3000
```

### Docker Kontaineri Durdur
```bash
docker-compose -f docker/docker-compose.yml down
```

### Logs Görüntüle
```bash
docker-compose -f docker/docker-compose.yml logs -f app
```

### Manual Docker Build
```bash
# Dockerfile'dan image oluştur
docker build -t restoran-takip-sistemi:latest -f docker/Dockerfile .

# Container çalıştır
docker run -d -p 3000:3000 --name restoran-app restoran-takip-sistemi:latest

# Container'ı durdur
docker stop restoran-app

# Container'ı sil
docker rm restoran-app
```

---

## Jenkins Pipeline Kurulumu

### Jenkins Sunucusu Kurulumu (Windows)

#### 1. Jenkins İndir ve Kur
```powershell
# Jenkins'i indir: https://www.jenkins.io/download/

# Windows Installer (WAR dosyası) kullan
java -jar jenkins.war
```

#### 2. Jenkins'e Erişim
```
http://localhost:8080
```

#### 3. Başlangıç Parolası
Kurulum sırasında gösterilen parolayı girin.

#### 4. Gerekli Eklentileri Yükle
Jenkins Dashboard → Manage Jenkins → Plugin Manager

Yüklenecek eklentiler:
- Git plugin
- Pipeline plugin
- Docker Pipeline
- JUnit plugin
- HTML Publisher plugin
- Email Extension Plugin

### Pipeline Kurulumu

#### 1. Yeni Pipeline Job Oluştur
- Jenkins Dashboard'da "New Item" tıkla
- Job adı: "Restoran-Takip-Sistemi"
- "Pipeline" seç
- "OK" tıkla

#### 2. Pipeline Konfigürasyonu

**Definition** bölümünde:
```
Pipeline script from SCM
SCM: Git
Repository URL: https://github.com/YOUR_USERNAME/restoran-takip-sistemi.git
Credentials: GitHub token (eklemek gerekebilir)
Script Path: Jenkinsfile
```

#### 3. Credentials Ekleme

**Jenkins → Manage Jenkins → Manage Credentials:**

1. GitHub Credentials
   - Kind: Username with password
   - Username: github_username
   - Password: GitHub Personal Access Token
   - ID: github-credentials

2. Docker Registry (opsiyonel)
   - Kind: Username with password
   - Username: docker_username
   - Password: docker_password
   - ID: docker-credentials

#### 4. Git Webhook Kurulumu

GitHub Repository Settings → Webhooks:
- Payload URL: `http://jenkins-server:8080/github-webhook/`
- Content type: application/json
- Which events: Push events
- Active: ✓

### Pipeline Çalıştırma

#### Manuel Çalıştırma
1. Jenkins Dashboard'da job'u seç
2. "Build Now" tıkla
3. Build History'de sonuçları izle

#### Otomatik Çalıştırma
- GitHub'a push yaptığında otomatik trigger olur
- Webhook'lar yapılandırıldıktan sonra

### Pipeline Aşamaları

```
1. GitHub Checkout (5 puan)
   ├─ Depo klonlanır
   └─ main branch çekilir

2. Build (5 puan)
   ├─ npm install çalıştırılır
   └─ Build tamamlanır

3. Unit Tests (15 puan)
   ├─ Jest çalıştırılır
   ├─ Coverage raporu oluşturulur
   └─ Raporlar kaydedilir

4. Integration Tests (15 puan)
   ├─ Supertest çalıştırılır
   ├─ API testleri yapılır
   └─ Sonuçlar kaydedilir

5. Docker Build & Run (5 puan)
   ├─ Docker image oluşturulur
   ├─ Container başlatılır
   └─ Health check yapılır

6. Selenium E2E Tests (55 puan)
   ├─ Selenium testleri çalıştırılır
   ├─ Test senaryoları doğrulanır
   └─ Raporlar oluşturulur
```

---

## API Endpoint'leri

### Restoranlar
```bash
# Tüm restoranları listele
GET /api/restaurants

# Restoran oluştur
POST /api/restaurants
Body: {
  "name": "Restaurant Name",
  "address": "Address",
  "phone": "5551234567"
}

# Belirli restoranı getir
GET /api/restaurants/:id

# Restoranı güncelle
PUT /api/restaurants/:id

# Restoranı sil
DELETE /api/restaurants/:id
```

### Masalar
```bash
# Restorandaki masaları listele
GET /api/restaurants/:restaurantId/tables

# Masa ekle
POST /api/restaurants/:restaurantId/tables
Body: {
  "tableNumber": 1,
  "capacity": 4
}

# Masa durumunu güncelle
PUT /api/tables/:id/status
Body: { "status": "occupied" }

# Boş masaları listele
GET /api/restaurants/:restaurantId/tables/available/list
```

### Menü
```bash
# Menüyü listele
GET /api/restaurants/:restaurantId/menus

# Menü öğesi ekle
POST /api/restaurants/:restaurantId/menus
Body: {
  "itemName": "Pizza",
  "description": "Description",
  "price": 25.50
}

# Menü öğesini sil
DELETE /api/menus/:id
```

### Siparişler
```bash
# Sipariş oluştur
POST /api/orders
Body: {
  "restaurantId": 1,
  "tableId": 1,
  "menuId": 1,
  "quantity": 2
}

# Sipariş durumunu güncelle
PUT /api/orders/:id/status
Body: { "status": "preparing" }

# Siparişi tamamla
PUT /api/orders/:id/complete

# Sipariş detaylarını getir
GET /api/orders/:id
```

---

## Sorun Giderme

### Port 3000 Zaten Kullanımda
```bash
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Linux/Mac
lsof -i :3000
kill -9 <PID>
```

### Database Hataları
```bash
# Veritabanını sıfırla
rm restoran.db
npm start
```

### Docker Sorunları
```bash
# Tüm container'ları durdur
docker-compose down -v

# Yeniden başlat
docker-compose up -d
```

### Jest Test Hataları
```bash
# Cache'i temizle
npm test -- --clearCache

# Verbose output
npm test -- --verbose
```

---

## Performans İpuçları

1. **Test Parallelization**: Jest otomatik olarak testleri paralel çalıştırır
2. **Coverage Threshold**: %50+ coverage hedeflenir
3. **Docker Optimization**: Multi-stage build kullanılır
4. **Database Indexing**: Sık kullanılan alanlar indekslenir

---

## Notlar

- Proje 3 hafta içinde tamamlanmalıdır
- Tüm testler pass durumda olmalıdır
- Docker kontainer'ı sağlıklı çalışmalıdır
- Jenkins pipeline'ı tüm aşamaları tamamlamalıdır
- Sınav sırasında ek test senaryosu yazılması gerekecektir

---

**Son Güncelleme:** 28 Aralık 2025
