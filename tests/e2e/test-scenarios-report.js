/**
 * TEST SENARYO RAPORU
 * Yazılım Doğrulama ve Geçerleme (YDG) Dersi - E2E Test Senaryoları
 * Proje: Restoran Masa, Menü, Sipariş Takip Sistemi
 */

const testScenarios = [
  {
    scenarioId: 'REQ-050',
    title: 'Restoran Oluşturma ve Listeleme',
    requirements: [
      'Yeni restoran kaydı oluşturma',
      'Restoran listesinde görüntüleme',
      'Form validasyonu'
    ],
    preConditions: [
      'Sunucu http://localhost:3000 üzerinden çalışıyor',
      'Tarayıcı (Chrome) hazır durumda',
      'Veritabanı bağlantısı aktif'
    ],
    steps: [
      '1. http://localhost:3000 URL\'sine git',
      '2. "Yeni Restoran" butonuna tıkla',
      '3. "Restoran Adı" alanına "Test Restoran E2E" yaz',
      '4. "Adres" alanına "E2E Test Sokak No:1" yaz',
      '5. "Telefon" alanına "5551234567" yaz',
      '6. "Kaydet" butonuna tıkla',
      '7. Başarı mesajını kontrol et'
    ],
    expectedResult: [
      'Yeni restoran başarıyla oluşturulur',
      'Listede görüntülenir',
      'Başarı mesajı gösterilir',
      'Veritabanına kaydedilir'
    ],
    postConditions: [
      'Restoran listesinde en son eklenen yer olarak görünür',
      'Veriler veritabanında saklanır',
      'Diğer işlemler için restoran kullanılabilir durumda'
    ]
  },

  {
    scenarioId: 'REQ-051',
    title: 'Masa Durumu Değiştirme',
    requirements: [
      'Masa oluşturma',
      'Masa durumunu (available/occupied/reserved) değiştirme',
      'Durum değişikliğinin kaydedilmesi'
    ],
    preConditions: [
      'En az bir restoran kayıtlı',
      'Masalar sekmesi açık',
      'Restoran seçilmiş'
    ],
    steps: [
      '1. Masalar (Tables) sekmesine tıkla',
      '2. "Yeni Masa Ekle" butonuna tıkla',
      '3. Masa Numarası: "5" gir',
      '4. Kapasite: "4" gir',
      '5. "Kaydet" butonuna tıkla',
      '6. Oluşturulan masanın durumu dropdown\'ından "Occupied" seç',
      '7. "Güncelle" butonuna tıkla'
    ],
    expectedResult: [
      'Yeni masa başarıyla oluşturulur',
      'Masa listesinde görünür (durum: available)',
      'Durum başarıyla "occupied" olarak değiştirilir',
      'Güncellenmiş durumu kaydedilir'
    ],
    postConditions: [
      'Masa "occupied" durumunda görünür',
      'Diğer masalarla karıştırılmaz',
      'Sipariş oluşturma için hazır'
    ]
  },

  {
    scenarioId: 'REQ-052',
    title: 'Sipariş Oluşturma ve Yönetimi',
    requirements: [
      'Sipariş oluşturma',
      'Masa ve menü seçimi',
      'Miktar belirtme',
      'Sipariş durumu (pending) kontrolü'
    ],
    preConditions: [
      'En az bir restoran kayıtlı',
      'En az bir masa oluşturulmuş',
      'Menüde en az bir öğe kayıtlı',
      'Siparişler sekmesi açık'
    ],
    steps: [
      '1. Siparişler (Orders) sekmesine tıkla',
      '2. "Yeni Sipariş Ekle" butonuna tıkla',
      '3. Masa dropdown\'ından bir masa seç',
      '4. Menü dropdown\'ından bir ürün seç',
      '5. Miktar: "2" gir',
      '6. "Sipariş Oluştur" butonuna tıkla',
      '7. Sipariş listesinde göründüğünü ve durumunu kontrol et'
    ],
    expectedResult: [
      'Sipariş başarıyla oluşturulur',
      'Sipariş listesinde görünür',
      'Durumu "pending" gösterilir',
      'Masa ve ürün bilgileri doğru kaydedilir',
      'Veritabanına kaydedilir'
    ],
    postConditions: [
      'Sipariş beklemede durumunda',
      'Aynı masaya başka siparişler eklenebilir',
      'Sipariş durumu sonradan değiştirilebilir'
    ]
  }
];

module.exports = testScenarios;

// Rapor oluştur
if (require.main === module) {
  console.log('\n╔════════════════════════════════════════════════════════╗');
  console.log('║        TEST SENARYO RAPORU (E2E)                       ║');
  console.log('║        Restoran Takip Sistemi                          ║');
  console.log('╚════════════════════════════════════════════════════════╝\n');

  testScenarios.forEach(scenario => {
    console.log(`\n📋 SENARYO ID: ${scenario.scenarioId}`);
    console.log(`📌 Başlık: ${scenario.title}`);
    console.log('\n📋 İlgili Gereksinimler:');
    scenario.requirements.forEach(req => console.log(`   - ${req}`));
    
    console.log('\n📋 Ön Koşullar:');
    scenario.preConditions.forEach(cond => console.log(`   ✓ ${cond}`));
    
    console.log('\n📋 Adım Adım İşlemler:');
    scenario.steps.forEach(step => console.log(`   ${step}`));
    
    console.log('\n📋 Beklenen Sonuç:');
    scenario.expectedResult.forEach(result => console.log(`   ✓ ${result}`));
    
    console.log('\n📋 Son Koşullar / Beklenen Sistem Durumu:');
    scenario.postConditions.forEach(cond => console.log(`   ✓ ${cond}`));
    
    console.log('\n' + '─'.repeat(60));
  });

  console.log('\n✅ Toplam ' + testScenarios.length + ' E2E test senaryosu hazırdır.\n');
}
