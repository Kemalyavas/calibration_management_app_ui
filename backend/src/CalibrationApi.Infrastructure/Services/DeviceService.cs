using CalibrationApi.Core.DTOs;
using CalibrationApi.Core.Entities;
using CalibrationApi.Core.Enums;
using CalibrationApi.Core.Interfaces;
using CalibrationApi.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace CalibrationApi.Infrastructure.Services;

public class DeviceService : IDeviceService
{
    private readonly CalibrationDbContext _context;

    public DeviceService(CalibrationDbContext context) => _context = context;

    public async Task<PagedResult<DeviceDto>> GetDevicesAsync(DeviceListQuery query)
    {
        var q = _context.Devices
            .Include(d => d.Machine).ThenInclude(m => m!.Department)
            .Include(d => d.VerificationValues.OrderBy(v => v.PointNumber))
            .Where(d => d.IsActive)
            .AsQueryable();

        if (query.DepartmentId.HasValue)
            q = q.Where(d => d.Machine != null && d.Machine.DepartmentId == query.DepartmentId);
        if (query.MachineId.HasValue)
            q = q.Where(d => d.MachineId == query.MachineId);
        if (!string.IsNullOrEmpty(query.DeviceType))
        {
            if (Enum.TryParse<DeviceType>(query.DeviceType, true, out var dt))
                q = q.Where(d => d.DeviceType == dt);
        }
        if (!string.IsNullOrEmpty(query.Search))
            q = q.Where(d => d.DeviceCode.Contains(query.Search) || d.DeviceName.Contains(query.Search));

        var page = Math.Max(1, query.Page);
        var pageSize = Math.Clamp(query.PageSize, 1, 100);

        var total = await q.CountAsync();
        var items = await q
            .OrderBy(d => d.DeviceCode)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();

        return new PagedResult<DeviceDto>
        {
            Items = items.Select(MapToDto).ToList(),
            Total = total,
            Page = query.Page,
            PageSize = query.PageSize,
        };
    }

    public async Task<DeviceDto?> GetDeviceByIdAsync(int id)
    {
        var device = await _context.Devices
            .Include(d => d.Machine).ThenInclude(m => m!.Department)
            .Include(d => d.VerificationValues.OrderBy(v => v.PointNumber))
            .FirstOrDefaultAsync(d => d.Id == id);
        return device == null ? null : MapToDto(device);
    }

    public async Task<DeviceDto> CreateDeviceAsync(CreateDeviceDto dto, int userId)
    {
        var exists = await _context.Devices.AnyAsync(d => d.DeviceCode == dto.DeviceCode && d.IsActive);
        if (exists) throw new InvalidOperationException($"'{dto.DeviceCode}' kodlu cihaz zaten mevcut.");

        var device = MapToEntity(dto);
        _context.Devices.Add(device);
        await _context.SaveChangesAsync();

        // Add verification values
        SaveVerificationValues(device.Id, dto);
        await _context.SaveChangesAsync();

        // Create approval request
        _context.ApprovalRequests.Add(new ApprovalRequest
        {
            Type = "device_update",
            DeviceId = device.Id,
            SubmittedByUserId = userId,
            Changes = $"Yeni cihaz eklendi: {device.DeviceCode} - {device.DeviceName}",
        });
        await _context.SaveChangesAsync();

        return (await GetDeviceByIdAsync(device.Id))!;
    }

    public async Task<DeviceDto?> UpdateDeviceAsync(int id, UpdateDeviceDto dto, int userId)
    {
        var device = await _context.Devices.Include(d => d.VerificationValues).FirstOrDefaultAsync(d => d.Id == id);
        if (device == null) return null;

        // Check uniqueness if code changed
        if (device.DeviceCode != dto.DeviceCode)
        {
            var exists = await _context.Devices.AnyAsync(d => d.DeviceCode == dto.DeviceCode && d.Id != id && d.IsActive);
            if (exists) throw new InvalidOperationException($"'{dto.DeviceCode}' kodlu başka bir cihaz zaten mevcut.");
        }

        UpdateEntity(device, dto);
        device.UpdatedAt = DateTime.UtcNow;

        // Replace verification values
        _context.DeviceVerificationValues.RemoveRange(device.VerificationValues);
        SaveVerificationValues(device.Id, dto);
        await _context.SaveChangesAsync();

        _context.ApprovalRequests.Add(new ApprovalRequest
        {
            Type = "device_update",
            DeviceId = device.Id,
            SubmittedByUserId = userId,
            Changes = $"Cihaz güncellendi: {device.DeviceCode} - {device.DeviceName}",
        });
        await _context.SaveChangesAsync();

        return await GetDeviceByIdAsync(id);
    }

    private void SaveVerificationValues(int deviceId, CreateDeviceDto dto)
    {
        var maxCount = Math.Max(dto.VerificationValues.Length, Math.Max(dto.ToleranceValues.Length, dto.UncertaintyValues.Length));
        for (int i = 0; i < maxCount; i++)
        {
            var vv = i < dto.VerificationValues.Length ? dto.VerificationValues[i] : null;
            if (vv == null) continue;

            _context.DeviceVerificationValues.Add(new DeviceVerificationValue
            {
                DeviceId = deviceId,
                PointNumber = i + 1,
                VerificationValue = vv.Value,
                ToleranceValue = i < dto.ToleranceValues.Length ? dto.ToleranceValues[i] : null,
                UncertaintyValue = i < dto.UncertaintyValues.Length ? dto.UncertaintyValues[i] : null,
            });
        }
    }

    private static DeviceDto MapToDto(Device d)
    {
        int? daysRemaining = null;
        if (d.NextCalibrationDate.HasValue)
            daysRemaining = (int)(d.NextCalibrationDate.Value - DateTime.UtcNow).TotalDays;

        var vvList = d.VerificationValues.OrderBy(v => v.PointNumber).ToList();

        return new DeviceDto
        {
            Id = d.Id,
            DeviceCode = d.DeviceCode,
            DeviceName = d.DeviceName,
            DeviceType = d.DeviceType.ToString().ToLower(),
            Brand = d.Brand,
            Model = d.Model,
            Manufacturer = d.Manufacturer,
            Unit = d.Unit,
            LocationOfUse = d.LocationOfUse,
            MachineId = d.MachineId,
            MachineName = d.Machine?.Name,
            DepartmentName = d.Machine?.Department?.Name,
            ProcedureNumber = d.ProcedureNumber,
            CalibratedBy = d.CalibratedBy,
            MeasurementAccuracy = d.MeasurementAccuracy,
            ReferenceCode = d.ReferenceCode,
            CalibrationFrequency = d.CalibrationFrequency,
            CalibrationDate = d.CalibrationDate,
            NextCalibrationDate = d.NextCalibrationDate,
            DaysRemaining = daysRemaining,
            MinRange = d.MinRange,
            MaxRange = d.MaxRange,
            TechnicalTolerance = d.TechnicalTolerance,
            VerificationValues = vvList.Select(v => (decimal?)v.VerificationValue).ToArray(),
            ToleranceValues = vvList.Select(v => v.ToleranceValue).ToArray(),
            UncertaintyValues = vvList.Select(v => v.UncertaintyValue).ToArray(),
        };
    }

    private static Device MapToEntity(CreateDeviceDto dto) => new()
    {
        DeviceCode = dto.DeviceCode,
        DeviceName = dto.DeviceName,
        DeviceType = Enum.TryParse<DeviceType>(dto.DeviceType, true, out var dt) ? dt : DeviceType.Test,
        Brand = dto.Brand, Model = dto.Model, Manufacturer = dto.Manufacturer,
        Unit = dto.Unit, LocationOfUse = dto.LocationOfUse, MachineId = dto.MachineId,
        ProcedureNumber = dto.ProcedureNumber, CalibratedBy = dto.CalibratedBy,
        MeasurementAccuracy = dto.MeasurementAccuracy, ReferenceCode = dto.ReferenceCode,
        CalibrationFrequency = dto.CalibrationFrequency,
        CalibrationDate = dto.CalibrationDate, NextCalibrationDate = dto.NextCalibrationDate,
        MinRange = dto.MinRange, MaxRange = dto.MaxRange, TechnicalTolerance = dto.TechnicalTolerance,
    };

    private static void UpdateEntity(Device device, UpdateDeviceDto dto)
    {
        device.DeviceCode = dto.DeviceCode;
        device.DeviceName = dto.DeviceName;
        device.DeviceType = Enum.TryParse<DeviceType>(dto.DeviceType, true, out var dt) ? dt : DeviceType.Test;
        device.Brand = dto.Brand; device.Model = dto.Model; device.Manufacturer = dto.Manufacturer;
        device.Unit = dto.Unit; device.LocationOfUse = dto.LocationOfUse; device.MachineId = dto.MachineId;
        device.ProcedureNumber = dto.ProcedureNumber; device.CalibratedBy = dto.CalibratedBy;
        device.MeasurementAccuracy = dto.MeasurementAccuracy; device.ReferenceCode = dto.ReferenceCode;
        device.CalibrationFrequency = dto.CalibrationFrequency;
        device.CalibrationDate = dto.CalibrationDate; device.NextCalibrationDate = dto.NextCalibrationDate;
        device.MinRange = dto.MinRange; device.MaxRange = dto.MaxRange; device.TechnicalTolerance = dto.TechnicalTolerance;
    }
}
