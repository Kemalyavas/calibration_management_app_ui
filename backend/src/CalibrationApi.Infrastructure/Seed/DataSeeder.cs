using CalibrationApi.Core.Entities;
using CalibrationApi.Core.Enums;
using CalibrationApi.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace CalibrationApi.Infrastructure.Seed;

public static class DataSeeder
{
    public static async Task SeedAsync(CalibrationDbContext context)
    {
        if (await context.Users.AnyAsync()) return;

        // Users
        var users = new List<User>
        {
            new() { Username = "guest", PasswordHash = BCrypt.Net.BCrypt.HashPassword("guest123"), FullName = "Misafir Kullanıcı", Role = UserRole.Guest },
            new() { Username = "operator", PasswordHash = BCrypt.Net.BCrypt.HashPassword("asdfgh123"), FullName = "Operator Mehmet", Role = UserRole.Operator },
            new() { Username = "manager", PasswordHash = BCrypt.Net.BCrypt.HashPassword("asdfgh456"), FullName = "Manager Ali", Role = UserRole.Manager },
        };
        context.Users.AddRange(users);

        // Departments
        var departments = new List<Department>
        {
            new() { Name = "Banbury" },
            new() { Name = "Sıcak Yarımamul" },
            new() { Name = "Soğuk Yarımamul" },
            new() { Name = "Konfeksiyon" },
            new() { Name = "Pişirme" },
            new() { Name = "Finisaj" },
        };
        context.Departments.AddRange(departments);
        await context.SaveChangesAsync();

        // Machines per department
        var machineData = new Dictionary<string, string[]>
        {
            ["Banbury"] = new[] { "BANBURY 9", "BANBURY 10", "BANBURY 11", "BANBURY 12", "BANBURY 13", "BANBURY 14", "BANBURY 15", "BANBURY 16", "BANBURY 17" },
            ["Sıcak Yarımamul"] = new[] { "3 TRAFILA", "4 TRAFILA", "5 TRAFILA", "6 TRAFILA", "7 TRAFILA", "8 TRAFILA", "9 TRAFILA", "10 TRAFILA", "11 TRAFILA", "12 TRAFILA", "13 TRAFILA", "14 TRAFILA", "15 TRAFILA", "16 TRAFILA", "17 TRAFILA", "18 TRAFILA", "19 TRAFILA" },
            ["Soğuk Yarımamul"] = new[] { "SOĞUK Y. HAT 1", "SOĞUK Y. HAT 2", "SOĞUK Y. HAT 3" },
            ["Konfeksiyon"] = new[] { "KON. MAKİNA 1", "KON. MAKİNA 2", "KON. MAKİNA 3", "KON. MAKİNA 4", "KON. MAKİNA 5" },
            ["Pişirme"] = new[] { "PRES 1", "PRES 2", "PRES 3", "PRES 4", "PRES 5", "PRES 6" },
            ["Finisaj"] = new[] { "FİNİSAJ HAT 1", "FİNİSAJ HAT 2", "FİNİSAJ HAT 3" },
        };

        foreach (var dept in departments)
        {
            if (machineData.TryGetValue(dept.Name, out var names))
            {
                foreach (var name in names)
                {
                    context.Machines.Add(new Machine { DepartmentId = dept.Id, Name = name });
                }
            }
        }
        await context.SaveChangesAsync();

        // Calibration Types
        var calibrationTypes = new List<CalibrationType>
        {
            new() { Name = "Basınç" },
            new() { Name = "Kütle" },
            new() { Name = "Terazi" },
            new() { Name = "Sıcaklık" },
            new() { Name = "pH" },
            new() { Name = "Uzunluk" },
            new() { Name = "Açı" },
        };
        context.CalibrationTypes.AddRange(calibrationTypes);
        await context.SaveChangesAsync();

        // Sample Devices
        var banbury9 = await context.Machines.FirstAsync(m => m.Name == "BANBURY 9");
        var trafila3 = await context.Machines.FirstAsync(m => m.Name == "3 TRAFILA");
        var mixer01 = await context.Machines.FirstOrDefaultAsync(m => m.Name == "KON. MAKİNA 1");

        var devices = new List<Device>
        {
            new()
            {
                DeviceCode = "A002", DeviceName = "BASINÇ ÖLÇER", DeviceType = DeviceType.Test,
                Brand = "Wika", Model = "P-30", Manufacturer = "Wika Instruments",
                Unit = "PSI", LocationOfUse = "Hat 2", MachineId = banbury9.Id,
                ProcedureNumber = "PR-001", CalibrationFrequency = "6 ay",
                CalibrationDate = new DateTime(2025, 8, 23), NextCalibrationDate = new DateTime(2026, 2, 23),
                MinRange = 0, MaxRange = 100, TechnicalTolerance = "±1%",
            },
            new()
            {
                DeviceCode = "B007", DeviceName = "Uzunluk Ölçer", DeviceType = DeviceType.Test,
                Brand = "Mitutoyo", Model = "CD-15DCX", Manufacturer = "Mitutoyo Corporation",
                Unit = "mm", LocationOfUse = "Hat 3", MachineId = trafila3.Id,
                ProcedureNumber = "PR-005", CalibrationFrequency = "6 ay",
                CalibrationDate = new DateTime(2025, 9, 15), NextCalibrationDate = new DateTime(2026, 3, 15),
                MinRange = 0, MaxRange = 150, TechnicalTolerance = "±0.02 mm",
            },
            new()
            {
                DeviceCode = "DR01", DeviceName = "GE / Druck DPI 620 Gemi 35 bar", DeviceType = DeviceType.Reference,
                Unit = "bar", MinRange = 0, MaxRange = 35,
            },
            new()
            {
                DeviceCode = "R100", DeviceName = "AMETEK / IPIMKII 03KG / 200 bar", DeviceType = DeviceType.Reference,
                Unit = "bar", MinRange = 0, MaxRange = 200,
            },
        };
        context.Devices.AddRange(devices);
        await context.SaveChangesAsync();

        // Verification values for A002
        var a002 = devices.First(d => d.DeviceCode == "A002");
        var a002Values = new[] { (10m, 0.5m), (25m, 0.5m), (40m, 0.5m), (60m, 0.5m), (80m, 0.5m), (100m, 0.5m) };
        for (int i = 0; i < a002Values.Length; i++)
        {
            context.DeviceVerificationValues.Add(new DeviceVerificationValue
            {
                DeviceId = a002.Id, PointNumber = i + 1,
                VerificationValue = a002Values[i].Item1, ToleranceValue = a002Values[i].Item2,
            });
        }

        // Verification values for B007
        var b007 = devices.First(d => d.DeviceCode == "B007");
        var b007Values = new[] { (25m, 1.0m), (50m, 1.0m), (75m, 1.0m), (100m, 1.0m), (125m, 1.0m), (150m, 1.0m) };
        for (int i = 0; i < b007Values.Length; i++)
        {
            context.DeviceVerificationValues.Add(new DeviceVerificationValue
            {
                DeviceId = b007.Id, PointNumber = i + 1,
                VerificationValue = b007Values[i].Item1, ToleranceValue = b007Values[i].Item2,
            });
        }

        // Uncertainty values for DR01
        var dr01 = devices.First(d => d.DeviceCode == "DR01");
        for (int i = 1; i <= 6; i++)
        {
            context.DeviceVerificationValues.Add(new DeviceVerificationValue
            {
                DeviceId = dr01.Id, PointNumber = i,
                VerificationValue = i * 5m, UncertaintyValue = 0.5m,
            });
        }

        // Uncertainty values for R100
        var r100 = devices.First(d => d.DeviceCode == "R100");
        for (int i = 1; i <= 6; i++)
        {
            context.DeviceVerificationValues.Add(new DeviceVerificationValue
            {
                DeviceId = r100.Id, PointNumber = i,
                VerificationValue = i * 30m, UncertaintyValue = 0.3m,
            });
        }
        await context.SaveChangesAsync();

        // Sample Procedures
        var pressureType = calibrationTypes.First(t => t.Name == "Basınç");
        context.Procedures.Add(new Procedure
        {
            ProcedureNumber = "PR-001",
            Name = "Basınç Ölçer Kalibrasyon Prosedürü",
            Version = "1.0",
            Purpose = "Bu prosedür, endüstriyel basınç ölçüm cihazlarının kalibrasyonu için standart adımları tanımlar.",
            Content = "1. Cihazı kontrol edin ve temizleyin\n2. Referans cihazı bağlayın\n3. Ortam şartlarını kaydedin\n4. 6 doğrulama noktasında artan ve azalan ölçümler yapın\n5. Histerisis ve mutlak fark hesaplamalarını kontrol edin\n6. Sonuçları kaydedin ve onaya gönderin",
            EquipmentList = "Referans basınç ölçer (DPI 620), bağlantı hortumları, temizlik malzemesi",
            CalibrationTypeId = pressureType.Id,
        });
        await context.SaveChangesAsync();
    }
}
