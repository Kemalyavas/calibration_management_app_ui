using System.Security.Claims;
using CalibrationApi.Core.DTOs;
using CalibrationApi.Core.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace CalibrationApi.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class DevicesController : ControllerBase
{
    private readonly IDeviceService _deviceService;

    public DevicesController(IDeviceService deviceService) => _deviceService = deviceService;

    [HttpGet]
    [Authorize]
    public async Task<IActionResult> GetDevices([FromQuery] DeviceListQuery query)
    {
        var result = await _deviceService.GetDevicesAsync(query);
        return Ok(result);
    }

    [HttpGet("{id}")]
    [Authorize]
    public async Task<IActionResult> GetDevice(int id)
    {
        var device = await _deviceService.GetDeviceByIdAsync(id);
        if (device == null) return NotFound();
        return Ok(device);
    }

    [HttpPost]
    [Authorize(Roles = "Operator,Manager")]
    public async Task<IActionResult> CreateDevice([FromBody] CreateDeviceDto dto)
    {
        try
        {
            var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
            var device = await _deviceService.CreateDeviceAsync(dto, userId);
            return CreatedAtAction(nameof(GetDevice), new { id = device.Id }, device);
        }
        catch (InvalidOperationException ex)
        {
            return Conflict(new { error = ex.Message });
        }
    }

    [HttpPut("{id}")]
    [Authorize(Roles = "Operator,Manager")]
    public async Task<IActionResult> UpdateDevice(int id, [FromBody] UpdateDeviceDto dto)
    {
        try
        {
            var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
            var device = await _deviceService.UpdateDeviceAsync(id, dto, userId);
            if (device == null) return NotFound();
            return Ok(device);
        }
        catch (InvalidOperationException ex)
        {
            return Conflict(new { error = ex.Message });
        }
    }
}
