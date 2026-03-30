using CalibrationApi.Core.Enums;

namespace CalibrationApi.Core.Entities;

public class MeasurementPoint
{
    public int Id { get; set; }
    public int CalibrationId { get; set; }
    public int PointNumber { get; set; }
    public decimal VerificationValue { get; set; }
    public decimal AscendingValue { get; set; }
    public decimal DescendingValue { get; set; }
    public decimal Hysteresis { get; set; }
    public decimal AbsoluteDifference { get; set; }
    public decimal Tolerance { get; set; }
    public decimal Uncertainty { get; set; }
    public MeasurementStatus Status { get; set; } = MeasurementStatus.Bekliyor;

    // Navigation
    public Calibration Calibration { get; set; } = null!;
}
