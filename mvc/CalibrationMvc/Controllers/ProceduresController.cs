using CalibrationMvc.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace CalibrationMvc.Controllers;

[Authorize]
public class ProceduresController : Controller
{
    private readonly IProcedureService _procedureService;

    public ProceduresController(IProcedureService procedureService)
    {
        _procedureService = procedureService;
    }

    [HttpGet]
    public async Task<IActionResult> Index()
    {
        var procedures = await _procedureService.GetProceduresAsync();
        return View(procedures);
    }

    [HttpGet]
    public async Task<IActionResult> Details(int id)
    {
        var procedure = await _procedureService.GetProcedureByIdAsync(id);
        if (procedure == null)
        {
            TempData["Error"] = "Prosedür bulunamadı.";
            return RedirectToAction(nameof(Index));
        }

        return View(procedure);
    }
}
