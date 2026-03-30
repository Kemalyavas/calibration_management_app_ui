using CalibrationApi.Core.Enums;

namespace CalibrationApi.Core.Entities;

public class ApprovalRequest
{
    public int Id { get; set; }
    public string Type { get; set; } = string.Empty; // "calibration" or "device_update"
    public int? CalibrationId { get; set; }
    public int? DeviceId { get; set; }
    public ApprovalStatus Status { get; set; } = ApprovalStatus.Pending;
    public string? Changes { get; set; }
    public int SubmittedByUserId { get; set; }
    public int? ReviewedByUserId { get; set; }
    public DateTime SubmittedAt { get; set; } = DateTime.UtcNow;
    public DateTime? ReviewedAt { get; set; }

    // Navigation
    public Calibration? Calibration { get; set; }
    public Device? Device { get; set; }
    public User SubmittedByUser { get; set; } = null!;
    public User? ReviewedByUser { get; set; }
}
