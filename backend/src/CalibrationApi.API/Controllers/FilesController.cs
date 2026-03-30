using System.Security.Claims;
using CalibrationApi.Core.Entities;
using CalibrationApi.Infrastructure.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace CalibrationApi.API.Controllers;

[ApiController]
[Route("api")]
public class FilesController : ControllerBase
{
    private readonly CalibrationDbContext _context;
    private readonly IWebHostEnvironment _env;

    public FilesController(CalibrationDbContext context, IWebHostEnvironment env)
    {
        _context = context;
        _env = env;
    }

    private static readonly HashSet<string> AllowedExtensions = new(StringComparer.OrdinalIgnoreCase)
    {
        ".pdf", ".jpg", ".jpeg", ".png", ".gif", ".doc", ".docx", ".xls", ".xlsx"
    };

    private const long MaxFileSize = 50 * 1024 * 1024; // 50MB

    [HttpPost("calibrations/{calibrationId}/files")]
    [Authorize(Roles = "Operator,Manager")]
    [RequestSizeLimit(50 * 1024 * 1024)]
    public async Task<IActionResult> Upload(int calibrationId, IFormFile file)
    {
        var calibration = await _context.Calibrations.FindAsync(calibrationId);
        if (calibration == null) return NotFound();

        if (file.Length > MaxFileSize)
            return BadRequest(new { error = "Dosya boyutu 50MB'ı aşamaz." });

        var safeFileName = Path.GetFileName(file.FileName);
        var extension = Path.GetExtension(safeFileName);
        if (!AllowedExtensions.Contains(extension))
            return BadRequest(new { error = $"Desteklenmeyen dosya tipi: {extension}. İzin verilenler: {string.Join(", ", AllowedExtensions)}" });

        var uploadsDir = Path.Combine(_env.ContentRootPath, "uploads");
        Directory.CreateDirectory(uploadsDir);

        var storedFileName = $"{Guid.NewGuid()}{extension}";
        var filePath = Path.Combine(uploadsDir, storedFileName);

        using (var stream = new FileStream(filePath, FileMode.Create))
        {
            await file.CopyToAsync(stream);
        }

        var calFile = new CalibrationFile
        {
            CalibrationId = calibrationId,
            FileName = safeFileName,
            StoredFileName = storedFileName,
            ContentType = file.ContentType,
            FileSize = file.Length,
        };
        _context.CalibrationFiles.Add(calFile);
        await _context.SaveChangesAsync();

        return Ok(new { id = calFile.Id, fileName = calFile.FileName, fileSize = calFile.FileSize });
    }

    [HttpGet("files/{id}")]
    [Authorize]
    public async Task<IActionResult> Download(int id)
    {
        var file = await _context.CalibrationFiles.FindAsync(id);
        if (file == null) return NotFound();

        var filePath = Path.Combine(_env.ContentRootPath, "uploads", file.StoredFileName);
        if (!System.IO.File.Exists(filePath)) return NotFound();

        return PhysicalFile(filePath, file.ContentType, file.FileName);
    }
}
