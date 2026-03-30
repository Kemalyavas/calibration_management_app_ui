using CalibrationApi.Core.DTOs;
using CalibrationApi.Core.Interfaces;
using CalibrationApi.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace CalibrationApi.Infrastructure.Services;

public class ProcedureService : IProcedureService
{
    private readonly CalibrationDbContext _context;

    public ProcedureService(CalibrationDbContext context) => _context = context;

    public async Task<List<ProcedureDto>> GetProceduresAsync()
    {
        return await _context.Procedures
            .Include(p => p.CalibrationType)
            .Where(p => p.IsActive)
            .OrderBy(p => p.ProcedureNumber)
            .Select(p => new ProcedureDto
            {
                Id = p.Id,
                ProcedureNumber = p.ProcedureNumber,
                Name = p.Name,
                Version = p.Version,
                Purpose = p.Purpose,
                CalibrationTypeName = p.CalibrationType != null ? p.CalibrationType.Name : null,
            })
            .ToListAsync();
    }

    public async Task<ProcedureDto?> GetProcedureByIdAsync(int id)
    {
        return await _context.Procedures
            .Include(p => p.CalibrationType)
            .Where(p => p.Id == id)
            .Select(p => new ProcedureDto
            {
                Id = p.Id,
                ProcedureNumber = p.ProcedureNumber,
                Name = p.Name,
                Version = p.Version,
                Purpose = p.Purpose,
                Content = p.Content,
                EquipmentList = p.EquipmentList,
                CalibrationTypeName = p.CalibrationType != null ? p.CalibrationType.Name : null,
            })
            .FirstOrDefaultAsync();
    }
}
