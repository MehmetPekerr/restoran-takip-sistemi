/**
 * TEST SENARYO RAPORU ŞABLONu
 * Yazılım Doğrulama ve Geçerleme (YDG) Dersi
 * 
 * Bu dosya, YDG dersi sırasında yazılacak test senaryolarının
 * raporlanması için kullanılacak şablonu içerir.
 */

const testReportTemplate = {
  projectName: "Restoran Masa, Menü, Sipariş Takip Sistemi",
  reportDate: new Date().toISOString().split('T')[0],
  reportVersion: "1.0",
  preparedBy: "Mehmet",
  
  // Test Senaryo Şablonu
  testScenarioTemplate: {
    // 1. Test Durumu Kimliği
    testCaseId: "REQ-XXX",
    
    // 2. İlgili Gereksinimler
    relatedRequirements: [
      "Sistem Gereksinimi 1",
      "Sistem Gereksinimi 2"
    ],
    
    // 3. Ön Koşullar
    preconditions: [
      "Ön Koşul 1",
      "Ön Koşul 2"
    ],
    
    // 4. Adım Adım Uygulanacak İşlemler
    steps: [
      {
        stepNumber: 1,
        action: "İşlem açıklaması",
        expectedInterimResult: "Beklenen ara sonuç"
      },
      {
        stepNumber: 2,
        action: "Sonraki işlem",
        expectedInterimResult: "Ara sonuç"
      }
    ],
    
    // 5. Beklenen Sonuç
    expectedResult: [
      "Beklenen sonuç 1",
      "Beklenen sonuç 2"
    ],
    
    // 6. Son Koşullar / Beklenen Sistem Durumu
    postconditions: [
      "Son koşul 1",
      "Son koşul 2"
    ],
    
    // Ek Bilgiler
    testType: "Unit|Integration|E2E",
    priority: "High|Medium|Low",
    executionDate: "YYYY-MM-DD",
    executionResult: "Pass|Fail",
    notes: "Ek notlar"
  },
  
  // Örnek Test Senaryoları
  examples: [
    {
      testCaseId: "REQ-E2E-001",
      title: "Restoran Oluşturma Senaryosu",
      relatedRequirements: [
        "Yeni restoran kaydı oluşturma",
        "Restoran bilgilerini depolama"
      ],
      preconditions: [
        "Sistem çalışıyor",
        "Tarayıcı açılabilir",
        "Veritabanı bağlantısı aktif"
      ],
      steps: [
        {
          stepNumber: 1,
          action: "http://localhost:3000 adresine git",
          expectedInterimResult: "Ana sayfa yüklenir"
        },
        {
          stepNumber: 2,
          action: "'Yeni Restoran' butonuna tıkla",
          expectedInterimResult: "Restoran oluşturma formu açılır"
        },
        {
          stepNumber: 3,
          action: "Restoran adı alanına 'Leziz Restoran' yaz",
          expectedInterimResult: "Text alanına veri girişi başarılı"
        },
        {
          stepNumber: 4,
          action: "Adres alanına 'Merkez Sokak No:10' yaz",
          expectedInterimResult: "Adres bilgisi girilir"
        },
        {
          stepNumber: 5,
          action: "Telefon alanına '5551234567' yaz",
          expectedInterimResult: "Telefon bilgisi girilir"
        },
        {
          stepNumber: 6,
          action: "'Kaydet' butonuna tıkla",
          expectedInterimResult: "Form gönderilir, işlem başlar"
        }
      ],
      expectedResult: [
        "Restoran başarıyla veritabanına kaydedilir",
        "Başarı mesajı gösterilir",
        "Restoran listesine eklenir"
      ],
      postconditions: [
        "Restoran listesinde yeni restoran görünür",
        "Restoran kimliği otomatik atanır",
        "Diğer operasyonlar için hazır durumda"
      ],
      testType: "E2E",
      priority: "High",
      executionDate: "2025-12-28",
      executionResult: "Pass"
    },
    
    {
      testCaseId: "REQ-UNIT-001",
      title: "Restoran Servisine Veri Ekleme Testi",
      relatedRequirements: [
        "Restaurant service veri ekleme işlevi"
      ],
      preconditions: [
        "Restaurant service başlatılmış",
        "Mock database hazırlanmış"
      ],
      steps: [
        {
          stepNumber: 1,
          action: "restaurantService.createRestaurant('Test', 'Address') çağır",
          expectedInterimResult: "Fonksiyon çalışır"
        },
        {
          stepNumber: 2,
          action: "Dönüş değerini kontrol et",
          expectedInterimResult: "Object döner"
        }
      ],
      expectedResult: [
        "name alanı 'Test' içerir",
        "address alanı 'Address' içerir",
        "ID otomatik atanır"
      ],
      postconditions: [
        "Mock veritabanında kayıt oluşur"
      ],
      testType: "Unit",
      priority: "High",
      executionDate: "2025-12-28",
      executionResult: "Pass"
    },
    
    {
      testCaseId: "REQ-INT-001",
      title: "Restoran API Endpoint Testi",
      relatedRequirements: [
        "POST /api/restaurants endpoint",
        "HTTP 201 response dönmesi"
      ],
      preconditions: [
        "Sunucu çalışıyor",
        "API accessible"
      ],
      steps: [
        {
          stepNumber: 1,
          action: "POST /api/restaurants çağır",
          expectedInterimResult: "İstek gönderilir"
        },
        {
          stepNumber: 2,
          action: "JSON body gönder: {name: 'Test', address: 'Addr'}",
          expectedInterimResult: "Body başarıyla gönderilir"
        }
      ],
      expectedResult: [
        "Status Code: 201",
        "Response body success: true",
        "Response body data: object"
      ],
      postconditions: [
        "Restoran veritabanında kaydedilir"
      ],
      testType: "Integration",
      priority: "High",
      executionDate: "2025-12-28",
      executionResult: "Pass"
    }
  ]
};

// Rapor Üreteci
class TestReportGenerator {
  constructor(templateData) {
    this.template = templateData;
  }
  
  generateMarkdownReport(testScenario) {
    return `
# TEST SENARYOSU RAPORU

## Temel Bilgiler
- **Test Durumu Kimliği**: ${testScenario.testCaseId}
- **Başlık**: ${testScenario.title}
- **Test Tipi**: ${testScenario.testType}
- **Öncelik**: ${testScenario.priority}
- **Yürütülme Tarihi**: ${testScenario.executionDate}
- **Sonuç**: ${testScenario.executionResult}

## 1. İlgili Gereksinimler
${testScenario.relatedRequirements.map(r => `- ${r}`).join('\n')}

## 2. Ön Koşullar
${testScenario.preconditions.map(p => `- ✓ ${p}`).join('\n')}

## 3. Adım Adım Uygulanacak İşlemler
${testScenario.steps.map(s => `
### Adım ${s.stepNumber}
- **İşlem**: ${s.action}
- **Beklenen Ara Sonuç**: ${s.expectedInterimResult}
`).join('\n')}

## 4. Beklenen Sonuç
${testScenario.expectedResult.map(r => `✓ ${r}`).join('\n')}

## 5. Son Koşullar / Beklenen Sistem Durumu
${testScenario.postconditions.map(p => `✓ ${p}`).join('\n')}

## Sonuç: ${testScenario.executionResult === 'Pass' ? '✅ BAŞARILI' : '❌ BAŞARIŞIZ'}
    `;
  }
  
  generateHTMLReport(testScenarios) {
    let html = `
    <!DOCTYPE html>
    <html lang="tr">
    <head>
        <meta charset="UTF-8">
        <title>Test Senaryo Raporu</title>
        <style>
            body { font-family: Arial, sans-serif; margin: 20px; background: #f5f5f5; }
            .container { max-width: 1200px; margin: 0 auto; background: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
            h1 { color: #333; border-bottom: 3px solid #007bff; padding-bottom: 10px; }
            .scenario { margin: 20px 0; padding: 15px; border-left: 4px solid #007bff; background: #f9f9f9; }
            .scenario.pass { border-left-color: #28a745; }
            .scenario.fail { border-left-color: #dc3545; }
            .header { display: flex; justify-content: space-between; margin-bottom: 15px; }
            .status { padding: 5px 10px; border-radius: 4px; color: white; font-weight: bold; }
            .pass { background: #28a745; }
            .fail { background: #dc3545; }
            .requirements, .steps, .results { margin: 10px 0; }
            .requirements h4, .steps h4, .results h4 { color: #007bff; margin-top: 10px; }
            ul { margin: 5px 0 5px 20px; }
            .step { background: white; padding: 10px; margin: 5px 0; border-radius: 4px; }
            .footer { text-align: center; margin-top: 30px; color: #666; border-top: 1px solid #ddd; padding-top: 10px; }
        </style>
    </head>
    <body>
        <div class="container">
            <h1>📋 Test Senaryo Raporu</h1>
            <p><strong>Proje:</strong> ${this.template.projectName}</p>
            <p><strong>Tarih:</strong> ${this.template.reportDate}</p>
            <p><strong>Hazırlayan:</strong> ${this.template.preparedBy}</p>
            <hr>
    `;
    
    testScenarios.forEach(scenario => {
      html += `
      <div class="scenario ${scenario.executionResult.toLowerCase()}">
          <div class="header">
              <div>
                  <h3>${scenario.testCaseId}: ${scenario.title}</h3>
                  <p><strong>Tip:</strong> ${scenario.testType} | <strong>Öncelik:</strong> ${scenario.priority}</p>
              </div>
              <div class="status ${scenario.executionResult.toLowerCase()}">
                  ${scenario.executionResult === 'Pass' ? '✓ BAŞARILI' : '✗ BAŞARIŞIZ'}
              </div>
          </div>
          
          <div class="requirements">
              <h4>İlgili Gereksinimler</h4>
              <ul>
                  ${scenario.relatedRequirements.map(r => `<li>${r}</li>`).join('')}
              </ul>
          </div>
          
          <div class="requirements">
              <h4>Ön Koşullar</h4>
              <ul>
                  ${scenario.preconditions.map(p => `<li>✓ ${p}</li>`).join('')}
              </ul>
          </div>
          
          <div class="steps">
              <h4>Adımlar</h4>
              ${scenario.steps.map(s => `
              <div class="step">
                  <strong>Adım ${s.stepNumber}:</strong> ${s.action}<br>
                  <em>Beklenen Sonuç:</em> ${s.expectedInterimResult}
              </div>
              `).join('')}
          </div>
          
          <div class="results">
              <h4>Beklenen Sonuç</h4>
              <ul>
                  ${scenario.expectedResult.map(r => `<li>✓ ${r}</li>`).join('')}
              </ul>
          </div>
          
          <div class="results">
              <h4>Son Koşullar</h4>
              <ul>
                  ${scenario.postconditions.map(p => `<li>✓ ${p}</li>`).join('')}
              </ul>
          </div>
      </div>
      `;
    });
    
    html += `
        <div class="footer">
            <p>✅ Toplam ${testScenarios.length} test senaryosu | 
               ✓ Başarılı: ${testScenarios.filter(s => s.executionResult === 'Pass').length} | 
               ✗ Başarısız: ${testScenarios.filter(s => s.executionResult === 'Fail').length}</p>
            <p>Rapor Tarihi: ${new Date().toLocaleString('tr-TR')}</p>
        </div>
    </body>
    </html>
    `;
    
    return html;
  }
}

// Kullanım Örneği
if (require.main === module) {
  const generator = new TestReportGenerator(testReportTemplate);
  
  // Markdown rapor oluştur
  console.log('=== Markdown Report ===');
  console.log(generator.generateMarkdownReport(testReportTemplate.examples[0]));
  
  // HTML rapor oluştur (dosyaya kaydedilir)
  const fs = require('fs');
  const htmlReport = generator.generateHTMLReport(testReportTemplate.examples);
  fs.writeFileSync('reports/test-report.html', htmlReport);
  console.log('\n✅ HTML rapor oluşturuldu: reports/test-report.html');
}

module.exports = { TestReportGenerator, testReportTemplate };
