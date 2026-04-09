using CalibrationMvc.Enums;

namespace CalibrationMvc.Entities;

public class Device
{
    public int Id { get; set; }
    public string DeviceCode { get; set; } = string.Empty;
    public string DeviceName { get; set; } = string.Empty;
    public DeviceType DeviceType { get; set; }
    public string? Brand { get; set; }
    public string? Model { get; set; }
    public string? Manufacturer { get; set; }
    public string? Unit { get; set; }
    public string? LocationOfUse { get; set; }
    public int? MachineId { get; set; }
    public string? ProcedureNumber { get; set; }
    public string? CalibratedBy { get; set; }
    public string? MeasurementAccuracy { get; set; }
    public string? ReferenceCode { get; set; }
    public string? CalibrationFrequency { get; set; }
    public DateTime? CalibrationDate { get; set; }
    public DateTime? NextCalibrationDate { get; set; }
    public decimal MinRange { get; set; }
    public decimal MaxRange { get; set; }
    public string? TechnicalTolerance { get; set; }

    public bool IsActive { get; set; } = true;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

    // Navigation
    public Machine? Machine { get; set; }
    public ICollection<Calibration> Calibrations { get; set; } = new List<Calibration>();
    public ICollection<DeviceVerificationValue> VerificationValues { get; set; } = new List<DeviceVerificationValue>();
}
