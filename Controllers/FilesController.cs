using CalibrationMvc.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace CalibrationMvc.Controllers;

[Authorize]
public class FilesController : Controller
{
    private readonly CalibrationDbContext _db;

    public FilesController(CalibrationDbContext db)
    {
        _db = db;
    }

    [HttpGet]
    public async Task<IActionResult> Download(int id)
    {
        var file = await _db.CalibrationFiles
            .FirstOrDefaultAsync(f => f.Id == id);

        if (file == null)
        {
            TempData["Error"] = "Dosya bulunamadı.";
            return RedirectToAction("Index", "Devices");
        }

        var uploadDir = Path.Combine(
            Directory.GetCurrentDirectory(),
            "uploads", "calibrations",
            file.CalibrationId.ToString());

        var filePath = Path.Combine(uploadDir, file.StoredFileName);

        if (!System.IO.File.Exists(filePath))
        {
            TempData["Error"] = "Dosya sunucuda bulunamadı.";
            return RedirectToAction("Details", "Calibrations", new { id = file.CalibrationId });
        }

        return PhysicalFile(filePath, file.ContentType, file.FileName);
    }
}
