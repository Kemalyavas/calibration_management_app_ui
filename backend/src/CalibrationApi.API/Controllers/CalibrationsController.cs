using System.Security.Claims;
using CalibrationApi.Core.DTOs;
using CalibrationApi.Core.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace CalibrationApi.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class CalibrationsController : ControllerBase
{
    private readonly ICalibrationService _calibrationService;

    public CalibrationsController(ICalibrationService calibrationService) => _calibrationService = calibrationService;

    [HttpGet]
    [Authorize]
    public async Task<IActionResult> GetCalibrations()
    {
        var result = await _calibrationService.GetCalibrationsAsync();
        return Ok(result);
    }

    [HttpGet("{id}")]
    [Authorize]
    public async Task<IActionResult> GetCalibration(int id)
    {
        var calibration = await _calibrationService.GetCalibrationByIdAsync(id);
        if (calibration == null) return NotFound();
        return Ok(calibration);
    }

    [HttpPost]
    [Authorize(Roles = "Operator,Manager")]
    public async Task<IActionResult> CreateCalibration([FromBody] CreateCalibrationDto dto)
    {
        try
        {
            var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
            var calibration = await _calibrationService.CreateCalibrationAsync(dto, userId);
            return CreatedAtAction(nameof(GetCalibration), new { id = calibration.Id }, calibration);
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new { error = ex.Message });
        }
    }
}
