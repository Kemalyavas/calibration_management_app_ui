using CalibrationApi.Core.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace CalibrationApi.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class ProceduresController : ControllerBase
{
    private readonly IProcedureService _procedureService;

    public ProceduresController(IProcedureService procedureService) => _procedureService = procedureService;

    [HttpGet]
    public async Task<IActionResult> GetProcedures()
    {
        var result = await _procedureService.GetProceduresAsync();
        return Ok(result);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetProcedure(int id)
    {
        var procedure = await _procedureService.GetProcedureByIdAsync(id);
        if (procedure == null) return NotFound();
        return Ok(procedure);
    }
}
