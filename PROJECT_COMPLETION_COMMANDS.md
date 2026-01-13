## CI/CD Adım Komutları (Yerel Çalıştırma Sırası)

### Jenkins'in Rolü

**Jenkins ne yapıyor:**
1. **Otomasyon**: `git push origin main` yaptığında GitHub webhook ile otomatik tetikleniyor.
2. **Pipeline çalıştırıyor**: Jenkinsfile'daki 6 aşamayı sırayla koşuyor (checkout → build → unit → integration → docker → e2e).
3. **Test raporlama**: JUnit sonuçları, coverage raporu, console logları Jenkins UI'de saklanıyor ve görüntüleniyor.
4. **Sürekli entegrasyon (CI)**: Her değişiklikte tüm testlerin geçtiğini doğruluyor.

**Jenkins olmasaydı ne değişirdi:**
- ❌ Her push'tan sonra manuel olarak tüm komutları çalıştırmak gerekecekti.
- ❌ Test sonuçları kaybolacak, raporlama olmayacaktı.
- ❌ Unutma/hata riski: bir aşamayı atlamak, yanlış sırada çalıştırmak mümkün.
- ❌ "CI/CD ile test işlemleri yürütülecek" şartını karşılayamazdı → gereksinim yerine gelmezdi.

**Sunumda gösterilecekler**: Jenkins arayüzünden son başarılı build (Console Output, Stage görünümü, Test raporları).

**Aşağıdaki komutlar**: Jenkins'in yaptığını yerel olarak doğrulama amaçlı (opsiyonel demo için).

### Otomatik Tetikleme (Webhook + Poll SCM)

- **GitHub Webhook**: Repo → Settings → Webhooks → Add webhook
   - Payload URL: `http://<jenkins-host>/github-webhook/`
   - Content type: `application/json`
   - Secret: (opsiyonel, Jenkins tarafında aynı secret tanımlanmalı)
- **Jenkins Job Ayarı**: Job → Configure
   - General → GitHub project: GitHub repo URL'si
   - Build Triggers → GitHub hook trigger for GITScm polling (işaretli)
   - (Opsiyonel yedek) Build Triggers → Poll SCM: `H/5 * * * *`
- **Jenkinsfile**: Otomatik tetik için `triggers { githubPush(); pollSCM('H/5 * * * *') }` eklendi.
- **Doğrulama**: Küçük bir commit/push yap → Jenkins otomatik build başlar; webhook yoksa Poll SCM en geç 5 dakika içinde tetikler.

### Yerel Komut Sırası

0. **Değişiklik Yap ve CI Tetikle (Commit + Push)**
```bash
git status
git add .
git commit -m "chore: sunum için küçük değişiklik"
git push origin main
```
> Push sonrası Jenkins webhook/Poll SCM ile otomatik build başlar.

1. **Kod Çekme (Stage 1 – Checkout, 5 puan)**
```
git pull origin main
```

2. **Build (Stage 2 – Build, 5 puan)**
```
npm ci
npm run build
```

3. **Birim Testleri (Stage 3 – Unit, 15 puan)**
```
npm run test:unit -- --passWithNoTests
```

4. **Entegrasyon Testleri (Stage 4 – Integration, 15 puan)**
```
npm run test:integration -- --passWithNoTests
```

5. **Docker Build & Run + Health Check (Stage 5 – Docker, 5 puan)**
```
docker-compose -f docker/docker-compose.yml build
docker-compose -f docker/docker-compose.yml up -d
powershell -NoProfile -Command "for($i=0; $i -lt 30; $i++){ try { $r = Invoke-WebRequest -Uri http://localhost:3000/health -UseBasicParsing -ErrorAction Stop; if($r.StatusCode -eq 200){ Write-Host 'Health check passed'; exit 0 } } catch { Start-Sleep -Seconds 1 } } exit 1"
```

6. **E2E Test Senaryoları (Stage 6 – Selenium, 55 puan)**
   - Tüm senaryoları (REQ-050..059) birlikte çalıştır:
```
cmd /c "cd /d C:\Users\Mehmet\visualstudio\takipsistemi && set HEADLESS=1 && set SCENARIO= && npm run test:e2e"
```
   - Tek senaryo örneği (REQ-051):
```
cmd /c "cd /d C:\Users\Mehmet\visualstudio\takipsistemi && set HEADLESS=1 && set SCENARIO=REQ-051 && npm run test:e2e"
```

7. **Temizlik (isteğe bağlı)**
```
docker-compose -f docker/docker-compose.yml down
```

> **Notlar:**
> - **Jenkins otomatik çalışır**: `git push origin main` yapınca pipeline tüm aşamaları koşar.
> - Webhook kurulu değilse Poll SCM yedeği devreye girer (5 dk aralık).
> - **Sunumda**: Jenkins UI'den son build (commit: 3c09386); Console Output, Stage 1–6 PASS durumu ve E2E çıktıları gösterilecek.
> - **Yukarıdaki komutlar**: İsteğe bağlı canlı demo için yerel çalıştırma (opsiyonel; Jenkins zaten kanıtlıyor).
> - HEADLESS=1 headless Chrome ile koşar.
> - SCENARIO boş bırakılırsa tüm senaryolar (REQ-050..059) ardışık çalışır.