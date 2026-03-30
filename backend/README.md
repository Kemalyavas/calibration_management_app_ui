# Kalibrasyon Yönetim Sistemi — Backend API

.NET 8 Web API + MSSQL backend for the Prometeon Turkey Calibration Management System.

## Gereksinimler

- .NET 8 SDK
- MSSQL Server (veya Docker ile MSSQL container)

## Kurulum

```bash
cd backend

# Build
dotnet build

# Veritabanı oluştur (ilk çalıştırmada otomatik migration + seed data)
dotnet run --project src/CalibrationApi.API
```

API varsayılan olarak `http://localhost:5097` adresinde çalışır.
Swagger UI: `http://localhost:5097/swagger`

## Yapılandırma

`src/CalibrationApi.API/appsettings.json` dosyasında:

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=localhost;Database=CalibrationDb;Trusted_Connection=true;TrustServerCertificate=true;"
  },
  "Jwt": {
    "Key": "your-secret-key-here",
    "Issuer": "CalibrationApi",
    "Audience": "CalibrationApp"
  }
}
```

Docker MSSQL kullanıyorsanız connection string:
```
Server=localhost,1433;Database=CalibrationDb;User Id=sa;Password=YourPassword;TrustServerCertificate=true;
```

## Seed Data

İlk çalıştırmada otomatik oluşturulur:

**Kullanıcılar:**
| Kullanıcı | Şifre | Rol |
|-----------|-------|-----|
| guest | guest123 | Misafir (sadece görüntüleme) |
| operator | asdfgh123 | Operatör (veri girişi) |
| manager | asdfgh456 | Yönetici (onay yetkisi) |

**Departmanlar:** Banbury, Sıcak Yarımamul, Soğuk Yarımamul, Konfeksiyon, Pişirme, Finisaj

**Kalibrasyon Tipleri:** Basınç, Kütle, Terazi, Sıcaklık, pH, Uzunluk, Açı

**Makineler:** 40+ makine (departmanlara bağlı)

**Örnek Cihazlar:** A002 (Basınç Ölçer), B007 (Uzunluk Ölçer), DR01 ve R100 (Referans cihazlar)

## API Endpoint'leri

### Auth
| Method | Endpoint | Rol | Açıklama |
|--------|----------|-----|----------|
| POST | `/api/auth/login` | Hepsi | JWT token al |
| GET | `/api/auth/me` | Hepsi | Mevcut kullanıcı bilgisi |

### Cihazlar
| Method | Endpoint | Rol | Açıklama |
|--------|----------|-----|----------|
| GET | `/api/devices` | Hepsi | Cihaz listesi (filtreleme + sayfalama) |
| GET | `/api/devices/{id}` | Hepsi | Cihaz detay |
| POST | `/api/devices` | Op/Mgr | Cihaz ekle (onay talebi oluşturur) |
| PUT | `/api/devices/{id}` | Op/Mgr | Cihaz güncelle (onay talebi oluşturur) |

### Kalibrasyonlar
| Method | Endpoint | Rol | Açıklama |
|--------|----------|-----|----------|
| GET | `/api/calibrations` | Hepsi | Kalibrasyon listesi |
| GET | `/api/calibrations/{id}` | Hepsi | Kalibrasyon detay |
| POST | `/api/calibrations` | Op/Mgr | Kalibrasyon girişi (otomatik hesaplama + onay talebi) |

### Onaylar
| Method | Endpoint | Rol | Açıklama |
|--------|----------|-----|----------|
| GET | `/api/approvals` | Manager | Bekleyen onaylar |
| GET | `/api/approvals/{id}` | Manager | Onay detay |
| PUT | `/api/approvals/{id}/approve` | Manager | Onayla |
| PUT | `/api/approvals/{id}/reject` | Manager | Reddet |

### Dosyalar
| Method | Endpoint | Rol | Açıklama |
|--------|----------|-----|----------|
| POST | `/api/calibrations/{id}/files` | Op/Mgr | Dosya yükle (max 50MB) |
| GET | `/api/files/{id}` | Hepsi | Dosya indir |

### Lookup
| Method | Endpoint | Rol | Açıklama |
|--------|----------|-----|----------|
| GET | `/api/departments` | Hepsi | Departman listesi |
| GET | `/api/machines?departmentId={id}` | Hepsi | Makine listesi |
| GET | `/api/calibration-types` | Hepsi | Kalibrasyon tipleri |

### Prosedürler
| Method | Endpoint | Rol | Açıklama |
|--------|----------|-----|----------|
| GET | `/api/procedures` | Hepsi | Prosedür listesi |
| GET | `/api/procedures/{id}` | Hepsi | Prosedür detay |

## Kalibrasyon Hesaplamaları

Backend her kalibrasyon girişinde otomatik hesaplama yapar:

```
Histerezis = |Artan Ölçüm - Azalan Ölçüm|
Mutlak Fark = max(|Artan - Doğrulama|, |Azalan - Doğrulama|) + Belirsizlik
Durum = Mutlak Fark > Tolerans → UYGUNSUZ, aksi halde UYGUN
Genel Durum = Herhangi bir nokta UYGUNSUZ ise → UYGUNSUZ
```

## Proje Yapısı

```
backend/
├── CalibrationApi.sln
└── src/
    ├── CalibrationApi.API/           # Controllers, Program.cs, appsettings
    ├── CalibrationApi.Core/          # Entities, DTOs, Enums, Interfaces
    └── CalibrationApi.Infrastructure/ # DbContext, Services, Seed Data
```

## Frontend Entegrasyonu

Frontend `http://localhost:5097/api` adresine bağlanır. API client: `src/app/services/api.ts`

Frontend'i başlatmak için:
```bash
cd ..  # ana dizine dön
npm install
npm run dev  # http://localhost:5173
```
