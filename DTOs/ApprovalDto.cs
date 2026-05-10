namespace CalibrationMvc.DTOs;

public class ApprovalDto
{
    public int Id { get; set; }
    public string Type { get; set; } = string.Empty;
    public string Status { get; set; } = string.Empty;
    public string? Changes { get; set; }
    public string SubmittedBy { get; set; } = string.Empty;
    public DateTime SubmittedAt { get; set; }
    public string? ReviewedBy { get; set; }
    public DateTime? ReviewedAt { get; set; }

    // Device info
    public string? DeviceCode { get; set; }
    public string? DeviceName { get; set; }
    public string? MachineName { get; set; }

    // Calibration detail (if type == calibration)
    public CalibrationDto? Calibration { get; set; }
}
