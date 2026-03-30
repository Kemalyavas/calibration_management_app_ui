using CalibrationApi.Core.DTOs;
using CalibrationApi.Core.Entities;
using CalibrationApi.Core.Enums;
using CalibrationApi.Core.Interfaces;
using CalibrationApi.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace CalibrationApi.Infrastructure.Services;

public class CalibrationService : ICalibrationService
{
    private readonly CalibrationDbContext _context;

    public CalibrationService(CalibrationDbContext context) => _context = context;

    public async Task<List<CalibrationDto>> GetCalibrationsAsync()
    {
        var calibrations = await _context.Calibrations
            .Include(c => c.Device)
            .Include(c => c.ReferenceDevice)
            .Include(c => c.CreatedByUser)
            .Include(c => c.MeasurementPoints)
            .Include(c => c.Files)
            .OrderByDescending(c => c.CreatedAt)
            .ToListAsync();

        return calibrations.Select(MapToDto).ToList();
    }

    public async Task<CalibrationDto?> GetCalibrationByIdAsync(int id)
    {
        var calibration = await _context.Calibrations
            .Include(c => c.Device)
            .Include(c => c.ReferenceDevice)
            .Include(c => c.CreatedByUser)
            .Include(c => c.MeasurementPoints.OrderBy(m => m.PointNumber))
            .Include(c => c.Files)
            .FirstOrDefaultAsync(c => c.Id == id);

        return calibration == null ? null : MapToDto(calibration);
    }

    public async Task<CalibrationDto> CreateCalibrationAsync(CreateCalibrationDto dto, int userId)
    {
        // Validation
        var device = await _context.Devices.FindAsync(dto.DeviceId);
        if (device == null) throw new InvalidOperationException("Belirtilen test cihazı bulunamadı.");

        var refDevice = await _context.Devices.FindAsync(dto.ReferenceDeviceId);
        if (refDevice == null) throw new InvalidOperationException("Belirtilen referans cihaz bulunamadı.");

        if (dto.MeasurementPoints == null || dto.MeasurementPoints.Count == 0)
            throw new InvalidOperationException("En az bir ölçüm noktası girilmelidir.");

        var calibration = new Calibration
        {
            DeviceId = dto.DeviceId,
            ReferenceDeviceId = dto.ReferenceDeviceId,
            CalibrationDate = dto.CalibrationDate,
            Temperature = dto.Temperature,
            Humidity = dto.Humidity,
            Pressure = dto.Pressure,
            CalibratedBy = dto.CalibratedBy,
            CreatedByUserId = userId,
        };

        // Calculate measurement points
        bool anyUygunsuz = false;
        foreach (var mp in dto.MeasurementPoints)
        {
            var hysteresis = Math.Abs(mp.AscendingValue - mp.DescendingValue);
            var maxDiff = Math.Max(
                Math.Abs(mp.AscendingValue - mp.VerificationValue),
                Math.Abs(mp.DescendingValue - mp.VerificationValue)
            );
            var absoluteDifference = maxDiff + mp.Uncertainty;
            var status = absoluteDifference > mp.Tolerance ? MeasurementStatus.Uygunsuz : MeasurementStatus.Uygun;

            if (status == MeasurementStatus.Uygunsuz) anyUygunsuz = true;

            calibration.MeasurementPoints.Add(new MeasurementPoint
            {
                PointNumber = mp.PointNumber,
                VerificationValue = mp.VerificationValue,
                AscendingValue = mp.AscendingValue,
                DescendingValue = mp.DescendingValue,
                Hysteresis = Math.Round(hysteresis, 7),
                AbsoluteDifference = Math.Round(absoluteDifference, 7),
                Tolerance = mp.Tolerance,
                Uncertainty = mp.Uncertainty,
                Status = status,
            });
        }

        calibration.OverallStatus = anyUygunsuz ? MeasurementStatus.Uygunsuz : MeasurementStatus.Uygun;

        _context.Calibrations.Add(calibration);
        await _context.SaveChangesAsync();

        // Create approval request
        _context.ApprovalRequests.Add(new ApprovalRequest
        {
            Type = "calibration",
            CalibrationId = calibration.Id,
            DeviceId = calibration.DeviceId,
            SubmittedByUserId = userId,
        });
        await _context.SaveChangesAsync();

        return (await GetCalibrationByIdAsync(calibration.Id))!;
    }

    private static CalibrationDto MapToDto(Calibration c) => new()
    {
        Id = c.Id,
        DeviceId = c.DeviceId,
        DeviceCode = c.Device?.DeviceCode ?? "",
        DeviceName = c.Device?.DeviceName ?? "",
        ReferenceDeviceId = c.ReferenceDeviceId,
        ReferenceDeviceName = c.ReferenceDevice?.DeviceName ?? "",
        ReferenceDeviceSerial = c.ReferenceDevice?.DeviceCode ?? "",
        CalibrationDate = c.CalibrationDate,
        Temperature = c.Temperature,
        Humidity = c.Humidity,
        Pressure = c.Pressure,
        CalibratedBy = c.CalibratedBy,
        OverallStatus = c.OverallStatus.ToString(),
        CreatedByUserName = c.CreatedByUser?.FullName ?? "",
        CreatedAt = c.CreatedAt,
        MeasurementPoints = c.MeasurementPoints.OrderBy(m => m.PointNumber).Select(m => new MeasurementPointDto
        {
            PointNumber = m.PointNumber,
            VerificationValue = m.VerificationValue,
            AscendingValue = m.AscendingValue,
            DescendingValue = m.DescendingValue,
            Hysteresis = m.Hysteresis,
            AbsoluteDifference = m.AbsoluteDifference,
            Tolerance = m.Tolerance,
            Uncertainty = m.Uncertainty,
            Status = m.Status.ToString(),
        }).ToList(),
        Files = c.Files.Select(f => new CalibrationFileDto
        {
            Id = f.Id,
            FileName = f.FileName,
            ContentType = f.ContentType,
            FileSize = f.FileSize,
            UploadedAt = f.UploadedAt,
        }).ToList(),
    };
}
