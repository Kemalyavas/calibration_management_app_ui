namespace CalibrationMvc.Entities;

public class CalibrationFile
{
    public int Id { get; set; }
    public int CalibrationId { get; set; }
    public string FileName { get; set; } = string.Empty;
    public string StoredFileName { get; set; } = string.Empty;
    public string ContentType { get; set; } = string.Empty;
    public long FileSize { get; set; }
    public DateTime UploadedAt { get; set; } = DateTime.UtcNow;

    // Navigation
    public Calibration Calibration { get; set; } = null!;
}
