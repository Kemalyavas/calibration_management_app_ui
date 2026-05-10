using CalibrationMvc.DTOs;

namespace CalibrationMvc.Services;

public interface ICalibrationService
{
    Task<List<CalibrationDto>> GetCalibrationsAsync();
    Task<CalibrationDto?> GetCalibrationByIdAsync(int id);
    Task<CalibrationDto> CreateCalibrationAsync(CreateCalibrationDto dto, int userId);
}
