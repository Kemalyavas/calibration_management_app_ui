using System.Security.Claims;
using CalibrationMvc.Data;
using CalibrationMvc.DTOs;
using CalibrationMvc.Models;
using CalibrationMvc.Services;
using ClosedXML.Excel;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace CalibrationMvc.Controllers;

[Authorize]
public class DevicesController : Controller
{
    private readonly IDeviceService _deviceService;
    private readonly CalibrationDbContext _db;

    public DevicesController(IDeviceService deviceService, CalibrationDbContext db)
    {
        _deviceService = deviceService;
        _db = db;
    }

    [HttpGet]
    public async Task<IActionResult> Index(
        int? departmentId,
        int? machineId,
        string? deviceType,
        string? search,
        int page = 1)
    {
        var query = new DeviceListQuery
        {
            DepartmentId = departmentId,
            MachineId = machineId,
            DeviceType = deviceType,
            Search = search,
            Page = page,
            PageSize = 50
        };

        var result = await _deviceService.GetDevicesAsync(query);

        var departments = await _db.Departments
            .OrderBy(d => d.Name)
            .Select(d => new DepartmentDto { Id = d.Id, Name = d.Name })
            .ToListAsync();

        var machines = await _db.Machines
            .Where(m => departmentId == null || m.DepartmentId == departmentId)
            .OrderBy(m => m.Name)
            .Select(m => new MachineDto { Id = m.Id, Name = m.Name, DepartmentId = m.DepartmentId })
            .ToListAsync();

        var vm = new DeviceListViewModel
        {
            Devices = result.Items,
            TotalCount = result.Total,
            CurrentPage = result.Page,
            PageSize = result.PageSize,
            SelectedDepartmentId = departmentId,
            SelectedMachineId = machineId,
            SelectedDeviceType = deviceType,
            SearchTerm = search,
            Departments = departments,
            Machines = machines
        };

        return View(vm);
    }

    [HttpGet]
    public async Task<IActionResult> Details(int id)
    {
        var device = await _deviceService.GetDeviceByIdAsync(id);
        if (device == null)
        {
            TempData["Error"] = "Cihaz bulunamadı.";
            return RedirectToAction(nameof(Index));
        }

        return View(device);
    }

    [HttpGet]
    [Authorize(Roles = "Operator,Manager")]
    public async Task<IActionResult> Create()
    {
        var vm = await BuildDeviceFormViewModelAsync();
        return View(vm);
    }

    [HttpPost]
    [Authorize(Roles = "Operator,Manager")]
    [ValidateAntiForgeryToken]
    public async Task<IActionResult> Create(CreateDeviceDto dto)
    {
        if (!ModelState.IsValid)
        {
            var vm = await BuildDeviceFormViewModelAsync();
            vm.Device = dto;
            return View(vm);
        }

        var userIdStr = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (!int.TryParse(userIdStr, out var userId))
        {
            TempData["Error"] = "Oturum bilgisi alınamadı.";
            return RedirectToAction(nameof(Index));
        }

        try
        {
            await _deviceService.CreateDeviceAsync(dto, userId);
            TempData["Success"] = "Cihaz başarıyla oluşturuldu.";
            return RedirectToAction(nameof(Index));
        }
        catch (Exception ex)
        {
            TempData["Error"] = $"Cihaz oluşturulurken hata oluştu: {ex.Message}";
            var vm = await BuildDeviceFormViewModelAsync();
            vm.Device = dto;
            return View(vm);
        }
    }

    [HttpGet]
    [Authorize(Roles = "Operator,Manager")]
    public async Task<IActionResult> Edit(int id)
    {
        var device = await _deviceService.GetDeviceByIdAsync(id);
        if (device == null)
        {
            TempData["Error"] = "Cihaz bulunamadı.";
            return RedirectToAction(nameof(Index));
        }

        var updateDto = new UpdateDeviceDto
        {
            DeviceCode = device.DeviceCode,
            DeviceName = device.DeviceName,
            DeviceType = device.DeviceType,
            Brand = device.Brand,
            Model = device.Model,
            Manufacturer = device.Manufacturer,
            Unit = device.Unit,
            LocationOfUse = device.LocationOfUse,
            MachineId = device.MachineId,
            ProcedureNumber = device.ProcedureNumber,
            CalibratedBy = device.CalibratedBy,
            MeasurementAccuracy = device.MeasurementAccuracy,
            ReferenceCode = device.ReferenceCode,
            CalibrationFrequency = device.CalibrationFrequency,
            CalibrationDate = device.CalibrationDate,
            NextCalibrationDate = device.NextCalibrationDate,
            MinRange = device.MinRange,
            MaxRange = device.MaxRange,
            TechnicalTolerance = device.TechnicalTolerance,
            VerificationValues = device.VerificationValues,
            ToleranceValues = device.ToleranceValues,
            UncertaintyValues = device.UncertaintyValues
        };

        var vm = await BuildDeviceFormViewModelAsync();
        vm.Device = updateDto;

        ViewBag.DeviceId = id;
        return View(vm);
    }

    [HttpPost]
    [Authorize(Roles = "Operator,Manager")]
    [ValidateAntiForgeryToken]
    public async Task<IActionResult> Edit(int id, UpdateDeviceDto dto)
    {
        if (!ModelState.IsValid)
        {
            var vm = await BuildDeviceFormViewModelAsync();
            vm.Device = dto;
            ViewBag.DeviceId = id;
            return View(vm);
        }

        var userIdStr = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (!int.TryParse(userIdStr, out var userId))
        {
            TempData["Error"] = "Oturum bilgisi alınamadı.";
            return RedirectToAction(nameof(Index));
        }

        try
        {
            var updated = await _deviceService.UpdateDeviceAsync(id, dto, userId);
            if (updated == null)
            {
                TempData["Error"] = "Cihaz bulunamadı.";
                return RedirectToAction(nameof(Index));
            }

            TempData["Success"] = "Cihaz başarıyla güncellendi.";
            return RedirectToAction(nameof(Index));
        }
        catch (Exception ex)
        {
            TempData["Error"] = $"Cihaz güncellenirken hata oluştu: {ex.Message}";
            var vm = await BuildDeviceFormViewModelAsync();
            vm.Device = dto;
            ViewBag.DeviceId = id;
            return View(vm);
        }
    }

    [HttpGet]
    public async Task<IActionResult> ExportExcel()
    {
        var query = new DeviceListQuery { Page = 1, PageSize = int.MaxValue };
        var result = await _deviceService.GetDevicesAsync(query);
        var devices = result.Items;

        using var workbook = new XLWorkbook();
        var ws = workbook.Worksheets.Add("Cihazlar");

        // Başlıklar
        var headers = new[]
        {
            "Cihaz Kodu", "Cihaz Adı", "Tip", "Marka", "Model", "Üretici",
            "Birim", "Kullanım Yeri", "Makine", "Departman", "Prosedür No",
            "Kalibrasyon Yapan", "Ölçüm Doğruluğu", "Referans Kodu",
            "Kalibrasyon Periyodu", "Son Kalibrasyon", "Sonraki Kalibrasyon",
            "Kalan Gün", "Min Aralık", "Max Aralık", "Teknik Tolerans"
        };

        for (int col = 1; col <= headers.Length; col++)
        {
            ws.Cell(1, col).Value = headers[col - 1];
            ws.Cell(1, col).Style.Font.Bold = true;
            ws.Cell(1, col).Style.Fill.BackgroundColor = XLColor.LightGray;
        }

        // Veriler
        int row = 2;
        foreach (var d in devices)
        {
            ws.Cell(row, 1).Value = d.DeviceCode;
            ws.Cell(row, 2).Value = d.DeviceName;
            ws.Cell(row, 3).Value = d.DeviceType;
            ws.Cell(row, 4).Value = d.Brand ?? "";
            ws.Cell(row, 5).Value = d.Model ?? "";
            ws.Cell(row, 6).Value = d.Manufacturer ?? "";
            ws.Cell(row, 7).Value = d.Unit ?? "";
            ws.Cell(row, 8).Value = d.LocationOfUse ?? "";
            ws.Cell(row, 9).Value = d.MachineName ?? "";
            ws.Cell(row, 10).Value = d.DepartmentName ?? "";
            ws.Cell(row, 11).Value = d.ProcedureNumber ?? "";
            ws.Cell(row, 12).Value = d.CalibratedBy ?? "";
            ws.Cell(row, 13).Value = d.MeasurementAccuracy ?? "";
            ws.Cell(row, 14).Value = d.ReferenceCode ?? "";
            ws.Cell(row, 15).Value = d.CalibrationFrequency ?? "";
            ws.Cell(row, 16).Value = d.CalibrationDate?.ToString("dd.MM.yyyy") ?? "";
            ws.Cell(row, 17).Value = d.NextCalibrationDate?.ToString("dd.MM.yyyy") ?? "";
            ws.Cell(row, 18).Value = d.DaysRemaining?.ToString() ?? "";
            ws.Cell(row, 19).Value = d.MinRange;
            ws.Cell(row, 20).Value = d.MaxRange;
            ws.Cell(row, 21).Value = d.TechnicalTolerance ?? "";
            row++;
        }

        ws.Columns().AdjustToContents();

        using var stream = new MemoryStream();
        workbook.SaveAs(stream);
        stream.Seek(0, SeekOrigin.Begin);

        var fileName = $"Cihazlar_{DateTime.Now:yyyyMMdd_HHmmss}.xlsx";
        return File(stream.ToArray(),
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            fileName);
    }

    [HttpGet]
    public async Task<IActionResult> GetMachines(int departmentId)
    {
        var machines = await _db.Machines
            .Where(m => m.DepartmentId == departmentId)
            .OrderBy(m => m.Name)
            .Select(m => new { id = m.Id, name = m.Name })
            .ToListAsync();

        return Json(machines);
    }

    private async Task<DeviceFormViewModel> BuildDeviceFormViewModelAsync()
    {
        var departments = await _db.Departments
            .OrderBy(d => d.Name)
            .Select(d => new DepartmentDto { Id = d.Id, Name = d.Name })
            .ToListAsync();

        var machines = await _db.Machines
            .OrderBy(m => m.Name)
            .Select(m => new MachineDto { Id = m.Id, Name = m.Name, DepartmentId = m.DepartmentId })
            .ToListAsync();

        return new DeviceFormViewModel
        {
            Departments = departments,
            Machines = machines
        };
    }
}
