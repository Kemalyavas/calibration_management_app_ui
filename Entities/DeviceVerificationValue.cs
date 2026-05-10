namespace CalibrationMvc.Entities;

public class DeviceVerificationValue
{
    public int Id { get; set; }
    public int DeviceId { get; set; }
    public int PointNumber { get; set; }
    public decimal VerificationValue { get; set; }
    public decimal? ToleranceValue { get; set; }    // Test cihazları için
    public decimal? UncertaintyValue { get; set; }  // Referans cihazlar için

    public Device Device { get; set; } = null!;
}
