namespace CalibrationMvc.Entities;

public class Procedure
{
    public int Id { get; set; }
    public string ProcedureNumber { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public string? Version { get; set; }
    public string? Purpose { get; set; }
    public string? Content { get; set; }
    public string? EquipmentList { get; set; }
    public int? CalibrationTypeId { get; set; }
    public bool IsActive { get; set; } = true;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

    // Navigation
    public CalibrationType? CalibrationType { get; set; }
}
