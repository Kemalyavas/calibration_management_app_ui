namespace CalibrationApi.Core.Entities;

public class Department
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public bool IsActive { get; set; } = true;

    public ICollection<Machine> Machines { get; set; } = new List<Machine>();
}
