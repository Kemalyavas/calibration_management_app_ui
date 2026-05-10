using System.Security.Claims;
using CalibrationMvc.Data;
using CalibrationMvc.DTOs;
using CalibrationMvc.Entities;
using CalibrationMvc.Models;
using CalibrationMvc.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace CalibrationMvc.Controllers;

[Authorize]
public class CalibrationsController : Controller
{
    private readonly ICalibrationService _calibrationService;
    private readonly IDeviceService _deviceService;
    private readonly CalibrationDbContext _db;

    public CalibrationsController(ICalibrationService calibrationService, IDeviceService deviceService, CalibrationDbContext db)
    {
        _calibrationService = calibrationService;
        _deviceService = deviceService;
        _db = db;
    }

    [HttpGet]
    [Authorize(Roles = "Operator,Manager")]
    public async Task<IActionResult> Create(int? deviceId)
    {
        var vm = await BuildCalibrationFormViewModelAsync();

        if (deviceId.HasValue)
        {
            vm.SelectedDevice = vm.TestDevices.FirstOrDefault(d => d.Id == deviceId.Value);
            vm.Form.DeviceId = deviceId.Value;
        }

        return View(vm);
    }

    [HttpPost]
    [Authorize(Roles = "Operator,Manager")]
    [ValidateAntiForgeryToken]
    public async Task<IActionResult> Create([Bind(Prefix = "Form")] CreateCalibrationDto dto, List<IFormFile>? files)
    {
        if (!ModelState.IsValid)
        {
            var vm = await BuildCalibrationFormViewModelAsync();
            vm.Form = dto;
            return View(vm);
        }

        var userIdStr = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (!int.TryParse(userIdStr, out var userId))
        {
            TempData["Error"] = "Oturum bilgisi alınamadı.";
            return RedirectToAction("Index", "Devices");
        }

        try
        {
            var calibration = await _calibrationService.CreateCalibrationAsync(dto, userId);

            // Dosya yükleme
            if (files != null && files.Count > 0)
            {
                var uploadDir = Path.Combine(Directory.GetCurrentDirectory(), "uploads", "calibrations", calibration.Id.ToString());
                Directory.CreateDirectory(uploadDir);

                foreach (var file in files.Where(f => f.Length > 0))
                {
                    var storedName = $"{Guid.NewGuid()}{Path.GetExtension(file.FileName)}";
                    var filePath = Path.Combine(uploadDir, storedName);

                    using var stream = new FileStream(filePath, FileMode.Create);
                    await file.CopyToAsync(stream);

                    _db.CalibrationFiles.Add(new CalibrationFile
                    {
                        CalibrationId = calibration.Id,
                        FileName = file.FileName,
                        StoredFileName = storedName,
                        ContentType = file.ContentType,
                        FileSize = file.Length,
                        UploadedAt = DateTime.Now
                    });
                }
                await _db.SaveChangesAsync();
            }

            TempData["Success"] = "Kalibrasyon başarıyla oluşturuldu.";
            return RedirectToAction(nameof(Details), new { id = calibration.Id });
        }
        catch (Exception ex)
        {
            TempData["Error"] = $"Kalibrasyon oluşturulurken hata oluştu: {ex.Message}";
            var vm = await BuildCalibrationFormViewModelAsync();
            vm.Form = dto;
            return View(vm);
        }
    }

    [HttpGet]
    public async Task<IActionResult> Details(int id)
    {
        var calibration = await _calibrationService.GetCalibrationByIdAsync(id);
        if (calibration == null)
        {
            TempData["Error"] = "Kalibrasyon kaydı bulunamadı.";
            return RedirectToAction("Index", "Devices");
        }

        return View(calibration);
    }

    [HttpGet]
    public async Task<IActionResult> GetDeviceInfo(int id)
    {
        var device = await _deviceService.GetDeviceByIdAsync(id);
        if (device == null)
            return NotFound();

        return Json(new
        {
            id = device.Id,
            deviceCode = device.DeviceCode,
            deviceName = device.DeviceName,
            unit = device.Unit,
            minRange = device.MinRange,
            maxRange = device.MaxRange,
            verificationValues = device.VerificationValues,
            toleranceValues = device.ToleranceValues,
            uncertaintyValues = device.UncertaintyValues
        });
    }

    private async Task<CalibrationFormViewModel> BuildCalibrationFormViewModelAsync()
    {
        var allDevicesResult = await _deviceService.GetDevicesAsync(new DeviceListQuery
        {
            Page = 1,
            PageSize = int.MaxValue
        });

        var testDevices = allDevicesResult.Items
            .Where(d => d.DeviceType == "test" || d.DeviceType == "Test")
            .ToList();

        var referenceDevices = allDevicesResult.Items
            .Where(d => d.DeviceType == "reference" || d.DeviceType == "Reference")
            .ToList();

        return new CalibrationFormViewModel
        {
            TestDevices = testDevices,
            ReferenceDevices = referenceDevices,
            Form = new CreateCalibrationDto()
        };
    }
}
