using CalibrationMvc.DTOs;

namespace CalibrationMvc.Models;

public class DeviceFormViewModel
{
    public CreateDeviceDto? Device { get; set; }
    public List<DepartmentDto> Departments { get; set; } = new();
    public List<MachineDto> Machines { get; set; } = new();
    public List<DeviceDto>? ExistingDevices { get; set; } // Kopyalama için
}
