namespace CalibrationApi.Core.Entities;

public class Machine
{
    public int Id { get; set; }
    public int DepartmentId { get; set; }
    public string Name { get; set; } = string.Empty;
    public bool IsActive { get; set; } = true;

    public Department Department { get; set; } = null!;
    public ICollection<Device> Devices { get; set; } = new List<Device>();
}
