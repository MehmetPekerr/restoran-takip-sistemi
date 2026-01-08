# Jenkins Kurulum ve Yapılandırma Rehberi

Bu döküman, YDG dersi kapsamında geliştirilen "Restoran Takip Sistemi" projesinin Jenkins CI/CD pipeline'ının kurulumu için adım adım talimatları içermektedir.

## 📋 İçindekiler

1. [Jenkins Kurulumu](#1-jenkins-kurulumu)
2. [Gerekli Eklentilerin Yüklenmesi](#2-gerekli-eklentilerin-yüklenmesi)
3. [Kimlik Bilgilerinin Oluşturulması](#3-kimlik-bilgilerinin-oluşturulması)
4. [Pipeline Job Oluşturma](#4-pipeline-job-oluşturma)
5. [GitHub Webhook Yapılandırması](#5-github-webhook-yapılandırması)
6. [İlk Build'in Çalıştırılması](#6-ilk-buildin-çalıştırılması)
7. [Sorun Giderme](#7-sorun-giderme)

---

## 1. Jenkins Kurulumu

### Windows'ta Kurulum

#### Seçenek A: Jenkins Installer ile Kurulum (Önerilen)

1. **Jenkins'i İndirin:**
   - https://www.jenkins.io/download/ adresine gidin
   - "Windows" sekmesinden "Windows Installer" seçeneğini indirin

2. **Kurulumu Başlatın:**
   ```cmd
   jenkins.msi
   ```
   - Kurulum sihirbazını takip edin
   - Varsayılan port: `8080`
   - Servis olarak çalıştırma önerilir

3. **İlk Erişim:**
   - Tarayıcınızda `http://localhost:8080` adresine gidin
   - Unlock Jenkins sayfasında istenen şifreyi alın:
   ```cmd
   type C:\ProgramData\Jenkins\.jenkins\secrets\initialAdminPassword
   ```

4. **Başlangıç Yapılandırması:**
   - "Install suggested plugins" seçeneğini seçin
   - Admin kullanıcısı oluşturun
   - Jenkins URL'sini onaylayın: `http://localhost:8080/`

#### Seçenek B: Docker ile Kurulum

```bash
docker run -d ^
  -p 8080:8080 ^
  -p 50000:50000 ^
  -v jenkins_home:/var/jenkins_home ^
  --name jenkins ^
  jenkins/jenkins:lts
```

İlk şifreyi almak için:
```bash
docker exec jenkins cat /var/jenkins_home/secrets/initialAdminPassword
```

---

## 2. Gerekli Eklentilerin Yüklenmesi

Jenkins Dashboard → **Manage Jenkins** → **Manage Plugins** → **Available** sekmesi

### Yüklenecek Eklentiler:

✅ **Git Plugin** - Git repository entegrasyonu
✅ **Pipeline** - Pipeline job desteği
✅ **Docker Pipeline** - Docker entegrasyonu
✅ **JUnit Plugin** - Test raporları
✅ **HTML Publisher Plugin** - HTML raporları (coverage)
✅ **GitHub Plugin** - GitHub entegrasyonu
✅ **NodeJS Plugin** - Node.js kurulum yönetimi

#### Kurulum Adımları:

1. Her eklentiyi arama kutusundan bulun
2. Checkbox'ı işaretleyin
3. "Install without restart" butonuna tıklayın
4. Kurulum tamamlanınca "Go back to the top page" tıklayın

---

## 3. Kimlik Bilgilerinin Oluşturulması

### GitHub Personal Access Token (PAT)

#### 3.1. GitHub'da Token Oluşturma

1. GitHub hesabınıza giriş yapın
2. **Settings** → **Developer settings** → **Personal access tokens** → **Tokens (classic)**
3. "Generate new token" → "Generate new token (classic)"
4. Token ayarları:
   - **Note:** `Jenkins CI/CD - Restoran Takip`
   - **Expiration:** 90 days veya ihtiyacınıza göre
   - **Scopes (izinler):**
     - ✅ `repo` (tüm alt seçenekler)
     - ✅ `admin:repo_hook` (webhook için)
5. "Generate token" butonuna tıklayın
6. **ÖNEMLİ:** Token'ı kopyalayıp güvenli bir yere kaydedin (bir daha gösterilmeyecek)

#### 3.2. Jenkins'e Token Ekleme

1. Jenkins Dashboard → **Manage Jenkins** → **Manage Credentials**
2. **(global)** → **Add Credentials**
3. Aşağıdaki bilgileri doldurun:
   - **Kind:** `Username with password`
   - **Scope:** `Global`
   - **Username:** GitHub kullanıcı adınız (örn: `mehmet123`)
   - **Password:** Kopyaladığınız Personal Access Token
   - **ID:** `github-credentials` (**ÖNEMLİ:** Bu ID Jenkinsfile'da kullanılıyor)
   - **Description:** `GitHub PAT for Restoran Takip Sistemi`
4. "Create" butonuna tıklayın

---

## 4. Pipeline Job Oluşturma

### 4.1. Yeni Job Oluşturma

1. Jenkins Dashboard → **New Item**
2. Job ayarları:
   - **Enter an item name:** `Restoran-Takip-Sistemi-Pipeline`
   - **Tür:** `Pipeline` seçin
   - "OK" butonuna tıklayın

### 4.2. Pipeline Yapılandırması

#### General Ayarları:

- **Description:** `YDG Dersi - Restoran Masa/Menü/Sipariş Takip Sistemi CI/CD Pipeline`
- ✅ **GitHub project:** İşaretleyin
  - **Project url:** `https://github.com/KULLANICI_ADINIZ/takipsistemi/`

#### Build Triggers:

- ✅ **GitHub hook trigger for GITScm polling** (Webhook için gerekli)

#### Pipeline Ayarları:

- **Definition:** `Pipeline script from SCM`
- **SCM:** `Git`
- **Repository URL:** `https://github.com/KULLANICI_ADINIZ/takipsistemi.git`
- **Credentials:** `github-credentials` (dropdown'dan seçin)
- **Branch Specifier:** `*/main` (veya `*/master`)
- **Script Path:** `Jenkinsfile`

### 4.3. Kaydetme

"Save" butonuna tıklayın.

---

### 4.4. Pipeline Parametreleri (Jenkinsfile)

Bu proje Jenkinsfile içinde parametrik yapı destekler. Job’ınızı kaydettikten sonra “This project is parameterized” ile aşağıdaki parametreler otomatik tanınır ve Build with Parameters ekranında görünür:

| Parametre | Tip | Varsayılan | Açıklama |
|---|---|---|---|
| `GITHUB_REPO` | String | `https://github.com/YOUR_USERNAME/restoran-takip-sistemi.git` | Checkout aşamasında kullanılacak repo URL’si. Boş bırakılırsa ortam değişkeni `GITHUB_REPO` kullanılır. |
| `RUN_CORE_E2E` | Boolean | `true` | Çekirdek E2E senaryolarını (REQ-050, REQ-051, REQ-052) çalıştırır. |
| `EXTRA_SCENARIOS` | String | boş | Virgülle ayrılmış ek E2E senaryoları (örn: `REQ-053,REQ-054`). |

Notlar:
- `GITHUB_REPO` parametresi doluysa Jenkinsfile içindeki `git url` çağrısında bu değer önceliklidir.
- E2E aşaması Windows ajanında `HEADLESS=1` ve `SCENARIO=<REQ-XXX>` ortam değişkenleri ile koşar; tek tek senaryolar başarısız olsa bile pipeline’ı bloklamayacak şekilde yapılandırılmıştır.

---

## 5. GitHub Webhook Yapılandırması

Webhook, GitHub'a her push yapıldığında Jenkins'in otomatik build tetiklemesini sağlar.

### 5.1. Jenkins URL'sini Öğrenme

Jenkins'inizin dışarıdan erişilebilir URL'si gereklidir:

- **Lokal test:** `http://localhost:8080/github-webhook/`
- **Dış erişim (gerekiyorsa):** `http://JENKINS_SUNUCU_IP:8080/github-webhook/`
- **Ngrok ile test (opsiyonel):**
  ```bash
  ngrok http 8080
  ```
  Ardından: `https://NGROK_SUBDOMAIN.ngrok.io/github-webhook/`

### 5.2. GitHub Repository Ayarları

1. GitHub'da projenizin repository'sine gidin
2. **Settings** (repo ayarları) → **Webhooks** → **Add webhook**
3. Webhook ayarları:
   - **Payload URL:** `http://JENKINS_IP:8080/github-webhook/`
   - **Content type:** `application/json`
   - **Secret:** (boş bırakabilirsiniz veya güvenlik için bir secret girebilirsiniz)
   - **Which events would you like to trigger this webhook?**
     - ✅ `Just the push event`
4. "Add webhook" butonuna tıklayın

### 5.3. Webhook Doğrulama

- Webhook eklendiğinde GitHub bir ping gönderir
- Webhook listesinde yeşil tik işareti görünmeli
- Eğer kırmızı X varsa:
  - Jenkins'in webhook URL'sine dışarıdan erişilebildiğinden emin olun
  - Firewall/port ayarlarını kontrol edin

---

## 6. İlk Build'in Çalıştırılması

### Manuel Tetikleme

1. Job sayfasına gidin: `http://localhost:8080/job/Restoran-Takip-Sistemi-Pipeline/`
2. Eğer parametre girişi yapmak istiyorsanız **"Build with Parameters"** butonuna tıklayın
   - `GITHUB_REPO`: Boş bırakabilir veya repo URL’siyle doldurabilirsiniz
   - `RUN_CORE_E2E`: Çekirdek E2E senaryoları çalışsın (önerilir)
   - `EXTRA_SCENARIOS`: Örn. `REQ-053,REQ-054`
   - Ardından **Build**
3. Parametre gerek yoksa **"Build Now"** butonuna tıklayın
4. **Build History** altında `#1` görünecek
5. Build numarasına tıklayıp **Console Output** ile logları izleyin

#### Ekran Görüntülü Kısa Akış

1) Job ana sayfası (Build with Parameters):

![Build with Parameters](docs/images/jenkins-build-with-parameters.png)

2) Parametrelerin doldurulması (çekirdek + ekstra):

![Parametre Formu](docs/images/jenkins-parameters-form.png)

3) Blue Ocean / aşama görünümleri (opsiyonel):

![Pipeline Stages](docs/images/jenkins-pipeline-stages.png)

4) Console Output ve raporlar (JUnit, Coverage):

![Console Output](docs/images/jenkins-console-output.png)

### Otomatik Tetikleme (Git Push)

```bash
git add .
git commit -m "Jenkins pipeline test"
git push origin main
```

Jenkins otomatik olarak build'i başlatmalı.

---

### 6.1. REST API ile Tetikleme (curl)

Jenkins REST API ile parametreli build tetikleyebilirsiniz. Kullanıcı/Token ve CSRF Crumb gerektirebilir.

1) Crumb alın:

```bash
curl -s -u KULLANICI_ADI:JENKINS_TOKEN \
   http://localhost:8080/crumbIssuer/api/json
```

Yanıttaki `crumbRequestField` ve `crumb` değerlerini kullanın (ör. `Jenkins-Crumb`).

2) Parametreli build çağrısı:

```bash
curl -X POST \
   -u KULLANICI_ADI:JENKINS_TOKEN \
   -H "Jenkins-Crumb: <CRUMB_DEGERI>" \
   "http://localhost:8080/job/Restoran-Takip-Sistemi-Pipeline/buildWithParameters?GITHUB_REPO=https%3A%2F%2Fgithub.com%2FYOUR_USERNAME%2Frestoran-takip-sistemi.git&RUN_CORE_E2E=true&EXTRA_SCENARIOS=REQ-053%2CREQ-054"
```

3) Build kuyruğunu/sonucunu izleme:

```bash
curl -s -u KULLANICI_ADI:JENKINS_TOKEN \
   http://localhost:8080/job/Restoran-Takip-Sistemi-Pipeline/api/json?tree=builds[number,status,result,url]
```

Not: Token oluşturma ve kullanıcı adı için Jenkins kullanıcı ayarlarınızı kullanın. Token yerine API Key ya da klasik şifre kullanımı önerilmez.

---

## 7. Sorun Giderme

### 7.1. "ERROR: Couldn't find any revision to build"

**Neden:** GitHub credentials hatalı veya repository erişilemiyor.

**Çözüm:**
- Credentials'ın doğru olduğunu kontrol edin
- Personal Access Token'ın süresinin dolmadığından emin olun
- Repository URL'sinin doğru olduğunu kontrol edin

### 7.2. Docker Build Hatası

**Hata:** `docker-compose: command not found`

**Çözüm (Windows):**
```cmd
# Docker Desktop kurulu olmalı
docker-compose --version
```

Eğer yoksa:
- Docker Desktop'ı yükleyin: https://www.docker.com/products/docker-desktop/
- Jenkins servisini yeniden başlatın

### 7.3. npm/node Komutları Bulunamıyor

**Çözüm:**
1. Jenkins → **Manage Jenkins** → **Global Tool Configuration**
2. **NodeJS** bölümüne gidin
3. "Add NodeJS" tıklayın:
   - **Name:** `NodeJS 16`
   - **Version:** `16.x` (en son 16.x sürümü)
   - ✅ Install automatically
4. "Save" tıklayın
5. Jenkinsfile'da `tools` bloğu ekleyin:
   ```groovy
   pipeline {
       agent any
       tools {
           nodejs 'NodeJS 16'
       }
       // ...
   }
   ```

### 7.4. Selenium Testleri ChromeDriver Hatası

**Hata:** `session not created: This version of ChromeDriver only supports Chrome version X`

**Çözüm:**
- Jenkins çalışan makinede Google Chrome yüklü olmalı
- ChromeDriver sürümü otomatik olarak güncellenir (selenium-webdriver paketi)
- Eğer hata devam ederse:
  ```bash
  npm update selenium-webdriver
  ```

### 7.5. Health Check Timeout

**Hata:** Jenkins Stage 5'te `Invoke-WebRequest` timeout alıyor

**Çözüm:**
```groovy
// Jenkinsfile'da bekleme süresini artırın
timeout /t 10 /nobreak > NUL
```

veya Docker container'ın başladığını kontrol edin:
```bash
docker ps -a
docker logs restoran-takip-sistemi
```

### 7.6. Port 3000 Zaten Kullanımda

**Çözüm:**
```cmd
# Kullanılan portu bulun
netstat -ano | findstr :3000

# Process'i sonlandırın
taskkill /PID <PID_NUMARASI> /F

# Veya Docker container'ı durdurun
docker-compose -f docker/docker-compose.yml down
```

---

## 📊 Pipeline Stages Özeti

| Stage | Puan | Açıklama |
|-------|------|----------|
| 1. GitHub Checkout | 5 | Repository'den kod çekme |
| 2. Build | 5 | npm install ve hazırlık |
| 3. Unit Tests | 15 | Jest ile birim testleri |
| 4. Integration Tests | 15 | Supertest ile API testleri |
| 5. Docker | 5 | Docker build, up, health check |
| 6. Selenium E2E | 55 | 10 senaryo (her biri ~5.5 puan) |
| **TOPLAM** | **100** | |

### Bonus Puanlar:
- 10 E2E senaryosu (3 yerine): +14 puan
- Test raporları (HTML Publisher): Ekstra değerlendirme

---

## 🎯 Başarı Kriterleri

✅ Tüm 6 stage başarıyla tamamlanmalı
✅ Unit test coverage %50+ olmalı
✅ Integration testler hatasız geçmeli
✅ Docker container başarıyla başlamalı
✅ En az 3 E2E senaryo başarılı olmalı (10/10 için +14 puan)

---

## 📚 Ek Kaynaklar

- Jenkins Resmi Dokümantasyon: https://www.jenkins.io/doc/
- Pipeline Syntax: https://www.jenkins.io/doc/book/pipeline/syntax/
- GitHub Webhook Guide: https://docs.github.com/en/webhooks
- Docker Compose: https://docs.docker.com/compose/

---

**Not:** Bu döküman YDG dersi 2024-2025 dönemi ödev gereksinimlerine göre hazırlanmıştır.

Tarih: Ocak 2026
Proje: Restoran Masa/Menü/Sipariş Takip Sistemi
