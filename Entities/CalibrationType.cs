namespace CalibrationMvc.Entities;

public class CalibrationType
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public bool IsActive { get; set; } = true;
}
