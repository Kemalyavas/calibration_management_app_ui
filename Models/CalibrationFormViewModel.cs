using CalibrationMvc.DTOs;

namespace CalibrationMvc.Models;

public class CalibrationFormViewModel
{
    public List<DeviceDto> TestDevices { get; set; } = new();
    public List<DeviceDto> ReferenceDevices { get; set; } = new();
    public DeviceDto? SelectedDevice { get; set; }
    public DeviceDto? SelectedReferenceDevice { get; set; }
    public CreateCalibrationDto Form { get; set; } = new();
}
