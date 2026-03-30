using CalibrationApi.Core.Enums;

namespace CalibrationApi.Core.Entities;

public class Calibration
{
    public int Id { get; set; }
    public int DeviceId { get; set; }
    public int ReferenceDeviceId { get; set; }
    public DateTime CalibrationDate { get; set; }
    public decimal? Temperature { get; set; }
    public decimal? Humidity { get; set; }
    public decimal? Pressure { get; set; }
    public string CalibratedBy { get; set; } = string.Empty;
    public MeasurementStatus OverallStatus { get; set; } = MeasurementStatus.Bekliyor;
    public int CreatedByUserId { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    // Navigation
    public Device Device { get; set; } = null!;
    public Device ReferenceDevice { get; set; } = null!;
    public User CreatedByUser { get; set; } = null!;
    public ICollection<MeasurementPoint> MeasurementPoints { get; set; } = new List<MeasurementPoint>();
    public ICollection<CalibrationFile> Files { get; set; } = new List<CalibrationFile>();
}
