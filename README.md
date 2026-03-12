Bu uygulama, Prometeon Turkey için geliştirilmiş endüstriyel kalibrasyon süreçlerini dijitalleştiren, yöneten ve izleyen modern bir web uygulamasıdır. 1920x1080 ekranlar için optimize edilmiş , temiz kurumsal tasarıma sahip ve operasyonel verimliliği artırmak için tasarlanmıştır.

✨ Özellikler
🔐 Kullanıcı Yetkilendirme Sistemi
GUEST Kullanıcı: Sadece görüntüleme yetkileri (Cihaz Görüntüle, Prosedür Görüntüle)
OPERATOR: Kalibrasyon girişi ve cihaz yönetimi (approval hariç tüm yetkiler)
Kullanıcı Adı: operator
Şifre: asdfgh123
MANAGER: Tüm yetkiler dahil approval onayı
Kullanıcı Adı: manager
Şifre: asdfgh456
🎯 Ana Fonksiyonlar
1. Cihaz Yönetimi
Test cihazları ve referans cihazlar için ayrı yönetim
Cihaz ekleme, güncelleme ve görüntüleme
Kalibrasyon geçmişi takibi
Tolerans değerleri yönetimi (6 ölçüm noktası)
Belirsizlik değerleri yönetimi (referans cihazlar için)
2. Kalibrasyon Girişi
6 ölçüm noktası için detaylı veri girişi
Artan/Azalan ölçüm değerleri
Otomatik hesaplamalar:
Histerisis: |Artan - Azalan|
Mutlak Fark: max(|Artan - Doğrulama|, |Azalan - Doğrulama|) + Belirsizlik
Durum Kontrolü: Mutlak Fark > Tolerans → UYGUNSUZ, aksi halde UYGUN
Ortam şartları kaydı (Sıcaklık, Nem, Basınç)
Dosya yükleme desteği (Sertifikalar, fotoğraflar, dokümanlar)
3. Onay Sistemi
Manager onaylı iki aşamalı kontrol
Pending (Beklemede) kalibrasyon kayıtları
Onaylanan kayıtların otomatik arşivlenmesi
4. Prosedür Yönetimi
Kalibrasyon prosedürlerini görüntüleme
Detaylı adım adım talimatlar
Gerekli doküman ve ekipman listeleri
5. Dashboard ve Raporlama
Anlık kalibrasyon durumu
Yaklaşan kalibrasyonlar
İstatistiksel özetler
Görsel durum göstergeleri
🎨 Tasarım Özellikleri
Renk Paleti:

Ana Renk: #1F2A44 (Koyu Mavi)
Arka Plan: Açık Gri tonları
Durum Renkleri: Yeşil (UYGUN), Kırmızı (UYGUNSUZ), Gri (BEKLEMEDE)
UI/UX:

Yuvarlak kartlar (rounded-2xl)
Gradient arka planlar
Responsive tasarım
Dokunmatik ekran dostu büyük butonlar
Açık ve okunabilir tipografi
🛠️ Teknolojiler
Frontend Framework: React 18+ with TypeScript
Routing: React Router v6
Styling: Tailwind CSS v4
UI Components: Radix UI (Accessible component library)
Icons: Lucide React
Build Tool: Vite

📦 Kurulum
Gereksinimler
Node.js 18+
npm, pnpm veya yarn
Adımlar
# 1. Projeyi klonlayın

# 2. Bağımlılıkları yükleyin
npm install
# veya
pnpm install
# veya
yarn install

# 3. Development server'ı başlatın
npm run dev

# 4. Tarayıcınızda açın
http://localhost:5173
Production Build
# Build oluşturma
npm run build

# Build'i preview etme
npm run preview
📁 Proje Yapısı
/src
├── /app
│   ├── /components
│   │   ├── /calibration         # Kalibrasyon alt-componentleri
│   │   │   ├── MeasurementPointCard.tsx
│   │   │   ├── DeviceInfoCard.tsx
│   │   │   ├── EnvironmentConditions.tsx
│   │   │   ├── ReferenceDeviceInfo.tsx
│   │   │   └── FileUploadSection.tsx
│   │   ├── /ui                  # Temel UI componentleri
│   │   ├── CalibrationEntry.tsx
│   │   ├── DeviceListPage.tsx
│   │   ├── LoginPage.tsx
│   │   ├── MainDashboard.tsx
│   │   ├── ApprovalList.tsx
│   │   └── ...
│   ├── /contexts                # React Context (User management)
│   │   └── UserContext.tsx
│   ├── /constants               # Sabitler ve veri
│   │   └── calibrationData.ts
│   ├── /utils                   # Yardımcı fonksiyonlar
│   │   └── calibrationCalculations.ts
│   ├── /styles                  # Global CSS
│   │   ├── theme.css
│   │   └── fonts.css
│   └── App.tsx                  # Ana routing
└── main.tsx                     # Entry point
🔍 Clean Code Prensipleri
Bu proje aşağıdaki clean code prensiplerine uygun olarak geliştirilmiştir:

1. Separation of Concerns
Component'ler küçük ve tek sorumluluğa sahip
Business logic utils dosyalarında
Constants ayrı dosyalarda
2. DRY (Don't Repeat Yourself)
Tekrar eden kodlar component'lere dönüştürüldü
Ortak fonksiyonlar utils'te toplandı
3. Meaningful Names
Fonksiyon ve değişken isimleri açıklayıcı
TypeScript interface'leri tip güvenliği sağlıyor
4. Small Functions
Her fonksiyon tek bir iş yapıyor
Maksimum okunabilirlik
🔐 Güvenlik Notları
⚠️ Önemli: Bu demo uygulama development amaçlıdır. Production ortamında:

Kullanıcı kimlik doğrulama backend'de yapılmalı
Şifreler hash'lenmeli
JWT token kullanılmalı
HTTPS zorunlu olmalı
Rate limiting eklenmeli
🎯 Kullanım Senaryoları
Senaryo 1: Yeni Kalibrasyon Kaydı
Operator olarak giriş yapın
Dashboard'dan "Kalibrasyon Girişi" seçin
Cihaz seçin (otomatik bilgiler yüklenir)
6 ölçüm noktası için artan/azalan değerler girin
Ortam şartlarını girin
İsteğe bağlı dosya yükleyin
Kaydı tamamlayın
Manager onayına gider
Senaryo 2: Kalibrasyon Onaylama
Manager olarak giriş yapın
"Onay Listesi"ne gidin
Bekleyen kayıtları görüntüleyin
Detayları inceleyin
Onayla veya Reddet
Senaryo 3: Cihaz Ekleme
Operator/Manager olarak giriş yapın
"Cihaz Listesi"ne gidin
"Yeni Cihaz Ekle"ye tıklayın
Test Cihazı veya Referans Cihaz seçin
Gerekli bilgileri doldurun
Kaydedin
📊 Kalibrasyon Formülleri
Histerisis
Histerisis = |Artan Ölçüm - Azalan Ölçüm|
Mutlak Fark
Mutlak Fark = max(|Artan - Doğrulama Değeri|, |Azalan - Doğrulama Değeri|) + Belirsizlik
Durum Kontrolü
Eğer (Mutlak Fark > Tolerans):
    Durum = UYGUNSUZ ✗
Aksi halde:
    Durum = UYGUN ✓
🚀 Gelecek Geliştirmeler (Roadmap)
 Backend entegrasyonu (API)
 Veritabanı bağlantısı (PostgreSQL/MongoDB)
 Excel/PDF export
 E-posta bildirimleri
 Mobil responsive iyileştirmeler
 Grafik ve analitik dashboard'lar
 QR kod ile cihaz etiketleme
 Çoklu dil desteği
 Offline çalışma modu (PWA)
