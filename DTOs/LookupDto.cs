namespace CalibrationMvc.DTOs;

public class DepartmentDto
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
}

public class MachineDto
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public int DepartmentId { get; set; }
}

public class CalibrationTypeDto
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
}

public class ProcedureDto
{
    public int Id { get; set; }
    public string ProcedureNumber { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public string? Version { get; set; }
    public string? Purpose { get; set; }
    public string? Content { get; set; }
    public string? EquipmentList { get; set; }
    public string? CalibrationTypeName { get; set; }
}

public class PagedResult<T>
{
    public List<T> Items { get; set; } = new();
    public int Total { get; set; }
    public int Page { get; set; }
    public int PageSize { get; set; }
    public int TotalPages => (int)Math.Ceiling((double)Total / PageSize);
}
