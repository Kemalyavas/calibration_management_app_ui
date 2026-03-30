using CalibrationApi.Core.DTOs;

namespace CalibrationApi.Core.Interfaces;

public interface IProcedureService
{
    Task<List<ProcedureDto>> GetProceduresAsync();
    Task<ProcedureDto?> GetProcedureByIdAsync(int id);
}
