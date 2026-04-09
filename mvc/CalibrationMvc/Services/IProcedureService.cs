using CalibrationMvc.DTOs;

namespace CalibrationMvc.Services;

public interface IProcedureService
{
    Task<List<ProcedureDto>> GetProceduresAsync();
    Task<ProcedureDto?> GetProcedureByIdAsync(int id);
}
