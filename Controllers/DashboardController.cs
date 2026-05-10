using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace CalibrationMvc.Controllers;

[Authorize]
public class DashboardController : Controller
{
    [HttpGet]
    public IActionResult Index()
    {
        var role = User.FindFirstValue(ClaimTypes.Role) ?? string.Empty;
        var fullName = User.FindFirstValue("FullName") ?? User.FindFirstValue(ClaimTypes.Name) ?? string.Empty;

        ViewBag.UserRole = role;
        ViewBag.FullName = fullName;

        return View();
    }
}
