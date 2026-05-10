using CalibrationMvc.Data;
using CalibrationMvc.DTOs;
using CalibrationMvc.Enums;
using Microsoft.EntityFrameworkCore;

namespace CalibrationMvc.Services;

public class ApprovalService : IApprovalService
{
    private readonly CalibrationDbContext _context;

    public ApprovalService(CalibrationDbContext context) => _context = context;

    public async Task<List<ApprovalDto>> GetPendingApprovalsAsync()
    {
        var approvals = await _context.ApprovalRequests
            .Include(a => a.SubmittedByUser)
            .Include(a => a.Device).ThenInclude(d => d!.Machine)
            .Include(a => a.Calibration).ThenInclude(c => c!.Device)
            .Include(a => a.Calibration).ThenInclude(c => c!.ReferenceDevice)
            .Include(a => a.Calibration).ThenInclude(c => c!.MeasurementPoints)
            .Include(a => a.Calibration).ThenInclude(c => c!.CreatedByUser)
            .Where(a => a.Status == ApprovalStatus.Pending)
            .OrderByDescending(a => a.SubmittedAt)
            .ToListAsync();

        return approvals.Select(MapToDto).ToList();
    }

    public async Task<ApprovalDto?> GetApprovalByIdAsync(int id)
    {
        var approval = await _context.ApprovalRequests
            .Include(a => a.SubmittedByUser)
            .Include(a => a.ReviewedByUser)
            .Include(a => a.Device).ThenInclude(d => d!.Machine)
            .Include(a => a.Calibration).ThenInclude(c => c!.Device)
            .Include(a => a.Calibration).ThenInclude(c => c!.ReferenceDevice)
            .Include(a => a.Calibration).ThenInclude(c => c!.MeasurementPoints)
            .Include(a => a.Calibration).ThenInclude(c => c!.CreatedByUser)
            .Include(a => a.Calibration).ThenInclude(c => c!.Files)
            .FirstOrDefaultAsync(a => a.Id == id);

        return approval == null ? null : MapToDto(approval);
    }

    public async Task<bool> ApproveAsync(int id, int reviewerUserId)
    {
        var approval = await _context.ApprovalRequests.FindAsync(id);
        if (approval == null || approval.Status != ApprovalStatus.Pending) return false;

        approval.Status = ApprovalStatus.Approved;
        approval.ReviewedByUserId = reviewerUserId;
        approval.ReviewedAt = DateTime.UtcNow;
        await _context.SaveChangesAsync();
        return true;
    }

    public async Task<bool> RejectAsync(int id, int reviewerUserId)
    {
        var approval = await _context.ApprovalRequests
            .Include(a => a.Device)
            .FirstOrDefaultAsync(a => a.Id == id);
        if (approval == null || approval.Status != ApprovalStatus.Pending) return false;

        approval.Status = ApprovalStatus.Rejected;
        approval.ReviewedByUserId = reviewerUserId;
        approval.ReviewedAt = DateTime.UtcNow;

        // Yeni cihaz ekleme reddedilirse cihazı pasif yap
        if (approval.Type == "device_update" && approval.Device != null && approval.Changes != null && approval.Changes.Contains("Yeni cihaz eklendi"))
        {
            approval.Device.IsActive = false;
        }

        await _context.SaveChangesAsync();
        return true;
    }

    private static ApprovalDto MapToDto(Entities.ApprovalRequest a)
    {
        var device = a.Type == "calibration" ? a.Calibration?.Device : a.Device;

        var dto = new ApprovalDto
        {
            Id = a.Id,
            Type = a.Type,
            Status = a.Status.ToString().ToLower(),
            Changes = a.Changes,
            SubmittedBy = a.SubmittedByUser?.FullName ?? "",
            SubmittedAt = a.SubmittedAt,
            ReviewedBy = a.ReviewedByUser?.FullName,
            ReviewedAt = a.ReviewedAt,
            DeviceCode = device?.DeviceCode,
            DeviceName = device?.DeviceName,
            MachineName = device?.Machine?.Name,
        };

        if (a.Type == "calibration" && a.Calibration != null)
        {
            var c = a.Calibration;
            dto.Calibration = new CalibrationDto
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
                    Id = f.Id, FileName = f.FileName, ContentType = f.ContentType,
                    FileSize = f.FileSize, UploadedAt = f.UploadedAt,
                }).ToList(),
            };
        }

        return dto;
    }
}
