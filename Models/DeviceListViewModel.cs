using CalibrationMvc.DTOs;

namespace CalibrationMvc.Models;

public class DeviceListViewModel
{
    public List<DeviceDto> Devices { get; set; } = new();
    public int TotalCount { get; set; }
    public int CurrentPage { get; set; } = 1;
    public int PageSize { get; set; } = 50;
    public int TotalPages => (int)Math.Ceiling((double)TotalCount / PageSize);

    // Filtre değerleri
    public int? SelectedDepartmentId { get; set; }
    public int? SelectedMachineId { get; set; }
    public string? SelectedDeviceType { get; set; }
    public string? SearchTerm { get; set; }

    // Dropdown verileri
    public List<DepartmentDto> Departments { get; set; } = new();
    public List<MachineDto> Machines { get; set; } = new();
}
