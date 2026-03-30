using CalibrationApi.Core.DTOs;
using CalibrationApi.Infrastructure.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace CalibrationApi.API.Controllers;

[ApiController]
[Route("api")]
[Authorize]
public class LookupController : ControllerBase
{
    private readonly CalibrationDbContext _context;

    public LookupController(CalibrationDbContext context) => _context = context;

    [HttpGet("departments")]
    public async Task<IActionResult> GetDepartments()
    {
        var departments = await _context.Departments
            .Where(d => d.IsActive)
            .OrderBy(d => d.Name)
            .Select(d => new DepartmentDto { Id = d.Id, Name = d.Name })
            .ToListAsync();
        return Ok(departments);
    }

    [HttpGet("machines")]
    public async Task<IActionResult> GetMachines([FromQuery] int? departmentId)
    {
        var query = _context.Machines.Where(m => m.IsActive).AsQueryable();
        if (departmentId.HasValue)
            query = query.Where(m => m.DepartmentId == departmentId);

        var machines = await query
            .OrderBy(m => m.Name)
            .Select(m => new MachineDto { Id = m.Id, Name = m.Name, DepartmentId = m.DepartmentId })
            .ToListAsync();
        return Ok(machines);
    }

    [HttpGet("calibration-types")]
    public async Task<IActionResult> GetCalibrationTypes()
    {
        var types = await _context.CalibrationTypes
            .Where(t => t.IsActive)
            .OrderBy(t => t.Name)
            .Select(t => new CalibrationTypeDto { Id = t.Id, Name = t.Name })
            .ToListAsync();
        return Ok(types);
    }
}
