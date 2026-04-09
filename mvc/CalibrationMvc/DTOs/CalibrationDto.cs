namespace CalibrationMvc.DTOs;

public class CalibrationDto
{
    public int Id { get; set; }
    public int DeviceId { get; set; }
    public string DeviceCode { get; set; } = string.Empty;
    public string DeviceName { get; set; } = string.Empty;
    public int ReferenceDeviceId { get; set; }
    public string ReferenceDeviceName { get; set; } = string.Empty;
    public string ReferenceDeviceSerial { get; set; } = string.Empty;
    public DateTime CalibrationDate { get; set; }
    public decimal? Temperature { get; set; }
    public decimal? Humidity { get; set; }
    public decimal? Pressure { get; set; }
    public string CalibratedBy { get; set; } = string.Empty;
    public string OverallStatus { get; set; } = string.Empty;
    public string CreatedByUserName { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }
    public List<MeasurementPointDto> MeasurementPoints { get; set; } = new();
    public List<CalibrationFileDto> Files { get; set; } = new();
}

public class MeasurementPointDto
{
    public int PointNumber { get; set; }
    public decimal VerificationValue { get; set; }
    public decimal AscendingValue { get; set; }
    public decimal DescendingValue { get; set; }
    public decimal Hysteresis { get; set; }
    public decimal AbsoluteDifference { get; set; }
    public decimal Tolerance { get; set; }
    public decimal Uncertainty { get; set; }
    public string Status { get; set; } = string.Empty;
}

public class CreateCalibrationDto
{
    public int DeviceId { get; set; }
    public int ReferenceDeviceId { get; set; }
    public DateTime CalibrationDate { get; set; }
    public decimal? Temperature { get; set; }
    public decimal? Humidity { get; set; }
    public decimal? Pressure { get; set; }
    public string CalibratedBy { get; set; } = string.Empty;
    public List<CreateMeasurementPointDto> MeasurementPoints { get; set; } = new();
}

public class CreateMeasurementPointDto
{
    public int PointNumber { get; set; }
    public decimal VerificationValue { get; set; }
    public decimal AscendingValue { get; set; }
    public decimal DescendingValue { get; set; }
    public decimal Tolerance { get; set; }
    public decimal Uncertainty { get; set; }
}

public class CalibrationFileDto
{
    public int Id { get; set; }
    public string FileName { get; set; } = string.Empty;
    public string ContentType { get; set; } = string.Empty;
    public long FileSize { get; set; }
    public DateTime UploadedAt { get; set; }
}
