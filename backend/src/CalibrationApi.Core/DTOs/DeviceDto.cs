namespace CalibrationApi.Core.DTOs;

public class DeviceVerificationValueDto
{
    public int PointNumber { get; set; }
    public decimal VerificationValue { get; set; }
    public decimal? ToleranceValue { get; set; }
    public decimal? UncertaintyValue { get; set; }
}

public class DeviceDto
{
    public int Id { get; set; }
    public string DeviceCode { get; set; } = string.Empty;
    public string DeviceName { get; set; } = string.Empty;
    public string DeviceType { get; set; } = string.Empty;
    public string? Brand { get; set; }
    public string? Model { get; set; }
    public string? Manufacturer { get; set; }
    public string? Unit { get; set; }
    public string? LocationOfUse { get; set; }
    public int? MachineId { get; set; }
    public string? MachineName { get; set; }
    public string? DepartmentName { get; set; }
    public string? ProcedureNumber { get; set; }
    public string? CalibratedBy { get; set; }
    public string? MeasurementAccuracy { get; set; }
    public string? ReferenceCode { get; set; }
    public string? CalibrationFrequency { get; set; }
    public DateTime? CalibrationDate { get; set; }
    public DateTime? NextCalibrationDate { get; set; }
    public int? DaysRemaining { get; set; }
    public decimal MinRange { get; set; }
    public decimal MaxRange { get; set; }
    public string? TechnicalTolerance { get; set; }
    // Backward compatible arrays for frontend
    public decimal?[] VerificationValues { get; set; } = Array.Empty<decimal?>();
    public decimal?[] ToleranceValues { get; set; } = Array.Empty<decimal?>();
    public decimal?[] UncertaintyValues { get; set; } = Array.Empty<decimal?>();
}

public class CreateDeviceDto
{
    public string DeviceCode { get; set; } = string.Empty;
    public string DeviceName { get; set; } = string.Empty;
    public string DeviceType { get; set; } = "test";
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
    public decimal?[] VerificationValues { get; set; } = Array.Empty<decimal?>();
    public decimal?[] ToleranceValues { get; set; } = Array.Empty<decimal?>();
    public decimal?[] UncertaintyValues { get; set; } = Array.Empty<decimal?>();
}

public class UpdateDeviceDto : CreateDeviceDto { }

public class DeviceListQuery
{
    public int? DepartmentId { get; set; }
    public int? MachineId { get; set; }
    public string? DeviceType { get; set; }
    public string? Search { get; set; }
    public int Page { get; set; } = 1;
    public int PageSize { get; set; } = 20;
}
