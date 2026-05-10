# Kalibrasyon Yönetim Uygulaması (MVC + Razor)

Prometeon için geliştirilen kalibrasyon yönetim uygulamasının **.NET 8 MVC + Razor** sürümü. Tek proje altında backend ve frontend birlikte çalışır — ayrı bir API'ye veya Node.js kurulumuna gerek yoktur.

## Gereksinimler

- **.NET 8 SDK** ([indir](https://dotnet.microsoft.com/download/dotnet/8.0))
- **Microsoft SQL Server** (Express, Developer veya tam sürüm)

## Kurulum

### 1. Veritabanı bağlantısını ayarla

`appsettings.json` dosyasındaki `ConnectionStrings:DefaultConnection` değerini ortamınıza göre düzenleyin:

```json
"ConnectionStrings": {
  "DefaultConnection": "Server=localhost;Database=CalibrationDb;Trusted_Connection=true;TrustServerCertificate=true;"
}
```

- **Windows Authentication** kullanıyorsanız yukarıdaki satır yeterlidir.
- **SQL Authentication** kullanacaksanız:
  ```
  Server=localhost;Database=CalibrationDb;User Id=sa;Password=YourPassword;TrustServerCertificate=true;
  ```

### 2. Projeyi çalıştır

Repo klasöründe terminal/PowerShell açıp:

```bash
dotnet run
```

Visual Studio kullanıyorsanız `CalibrationMvc.sln` dosyasını açıp F5 ile de başlatabilirsiniz.

Uygulama ilk başlatıldığında:
- Veritabanını otomatik olarak oluşturur (migration'lar uygulanır)
- Başlangıç verilerini (seed data) yükler — 3 kullanıcı, 6 departman, 40+ makine, 7 kalibrasyon tipi, örnek cihazlar

### 3. Tarayıcıda aç

Terminal çıktısında görünen adresi açın (varsayılan `http://localhost:5000` veya `https://localhost:5001`).

### 4. IIS Deployment

Publish klasörünü oluşturmak için:

```bash
dotnet publish -c Release -o ./publish
```

Oluşan `publish/` klasörünü mevcut prosedürünüze uygun şekilde IIS'e yükleyebilirsiniz (IIS'te .NET 8 Hosting Bundle kurulu olmalı).

## Test Kullanıcıları

| Kullanıcı Adı | Şifre | Rol |
|---|---|---|
| `guest` | `guest123` | Misafir (sadece görüntüleme) |
| `operator` | `asdfgh123` | Operatör (cihaz ekler, kalibrasyon girer) |
| `manager` | `asdfgh456` | Yönetici (onaylar/reddeder, tüm raporlara erişir) |

## Özellikler

- **Rol bazlı yetkilendirme** — Guest, Operator, Manager (cookie tabanlı authentication)
- **Cihaz yönetimi** — Departman, makine ve tip bazında cihazlar, dinamik doğrulama değerleri, kalan gün renkli takibi
- **Kalibrasyon girişi** — 6 ölçüm noktası, histerezis/mutlak fark/uygunluk hesaplaması hem sunucuda hem tarayıcıda anlık yapılır
- **Onay mekanizması** — Operator giriş yapar, Manager onaylar veya reddeder
- **Dosya yükleme** — Sertifika, fotoğraf, doküman yükleme/indirme
- **Filtreleme ve arama** — Cihaz listesinde departman, makine, tip ve metin bazlı filtre
- **Excel export** — Cihaz listesini ClosedXML ile sunucu taraflı Excel'e aktarma

## Proje Yapısı

```
├── Controllers/      Account, Dashboard, Devices, Calibrations, Approvals, Procedures, Files
├── Data/             CalibrationDbContext (EF Core)
├── Entities/         11 entity (User, Device, Calibration, Approval, ...)
├── Enums/            UserRole, DeviceType, MeasurementStatus, ApprovalStatus
├── DTOs/             Form ve ViewModel sınıfları
├── Services/         AuthService, DeviceService, CalibrationService, ApprovalService, ProcedureService
├── Seed/             DataSeeder (başlangıç verileri)
├── Migrations/       EF Core migration dosyaları
├── Views/            Razor (.cshtml) sayfalar
├── wwwroot/          Bootstrap 5, site.css, calibration-form.js, device-form.js
├── uploads/          Yüklenen dosyalar (runtime'da oluşur)
├── appsettings.json  Yapılandırma
└── Program.cs        Uygulama başlatma + DI + auth yapılandırması
```

## Notlar

- **Node.js gerektirmez.** Frontend Razor view'ları, Bootstrap 5 ve vanilla JS ile geliştirildi; `npm install` veya `npm run` gibi komutlara ihtiyaç yoktur.
- **Kalibrasyon hesaplamaları hem sunucuda hem tarayıcıda** yapılır. Tarayıcıda kullanıcı değer girerken anlık olarak histerezis/mutlak fark/durum görünür; gönderildiğinde sunucu aynı hesaplamayı tekrar yapar ve kaydeder.
- **Connection string'deki `TrustServerCertificate=true`** development ortamı içindir. Production'da sertifika doğrulaması için kaldırılabilir.
