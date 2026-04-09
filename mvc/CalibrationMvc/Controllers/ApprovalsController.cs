using System.Security.Claims;
using CalibrationMvc.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace CalibrationMvc.Controllers;

[Authorize(Roles = "Manager")]
public class ApprovalsController : Controller
{
    private readonly IApprovalService _approvalService;

    public ApprovalsController(IApprovalService approvalService)
    {
        _approvalService = approvalService;
    }

    [HttpGet]
    public async Task<IActionResult> Index(string? typeFilter)
    {
        var approvals = await _approvalService.GetPendingApprovalsAsync();

        if (!string.IsNullOrEmpty(typeFilter))
            approvals = approvals.Where(a => a.Type == typeFilter).ToList();

        ViewBag.TypeFilter = typeFilter;
        return View(approvals);
    }

    [HttpPost]
    [ValidateAntiForgeryToken]
    public async Task<IActionResult> Approve(int id)
    {
        var userIdStr = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (!int.TryParse(userIdStr, out var userId))
        {
            TempData["Error"] = "Oturum bilgisi alınamadı.";
            return RedirectToAction(nameof(Index));
        }

        var success = await _approvalService.ApproveAsync(id, userId);
        if (!success)
            TempData["Error"] = "Onaylama işlemi başarısız oldu veya kayıt bulunamadı.";
        else
            TempData["Success"] = "Talep başarıyla onaylandı.";

        return RedirectToAction(nameof(Index));
    }

    [HttpPost]
    [ValidateAntiForgeryToken]
    public async Task<IActionResult> Reject(int id)
    {
        var userIdStr = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (!int.TryParse(userIdStr, out var userId))
        {
            TempData["Error"] = "Oturum bilgisi alınamadı.";
            return RedirectToAction(nameof(Index));
        }

        var success = await _approvalService.RejectAsync(id, userId);
        if (!success)
            TempData["Error"] = "Reddetme işlemi başarısız oldu veya kayıt bulunamadı.";
        else
            TempData["Success"] = "Talep reddedildi.";

        return RedirectToAction(nameof(Index));
    }
}
