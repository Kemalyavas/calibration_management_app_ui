using System.Security.Claims;
using CalibrationApi.Core.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace CalibrationApi.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize(Roles = "Manager")]
public class ApprovalsController : ControllerBase
{
    private readonly IApprovalService _approvalService;

    public ApprovalsController(IApprovalService approvalService) => _approvalService = approvalService;

    [HttpGet]
    public async Task<IActionResult> GetPendingApprovals()
    {
        var result = await _approvalService.GetPendingApprovalsAsync();
        return Ok(result);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetApproval(int id)
    {
        var approval = await _approvalService.GetApprovalByIdAsync(id);
        if (approval == null) return NotFound();
        return Ok(approval);
    }

    [HttpPut("{id}/approve")]
    public async Task<IActionResult> Approve(int id)
    {
        var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
        var result = await _approvalService.ApproveAsync(id, userId);
        if (!result) return NotFound();
        return Ok(new { message = "Onaylandı" });
    }

    [HttpPut("{id}/reject")]
    public async Task<IActionResult> Reject(int id)
    {
        var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
        var result = await _approvalService.RejectAsync(id, userId);
        if (!result) return NotFound();
        return Ok(new { message = "Reddedildi" });
    }
}
