using CalibrationApi.Core.DTOs;

namespace CalibrationApi.Core.Interfaces;

public interface ICalibrationService
{
    Task<List<CalibrationDto>> GetCalibrationsAsync();
    Task<CalibrationDto?> GetCalibrationByIdAsync(int id);
    Task<CalibrationDto> CreateCalibrationAsync(CreateCalibrationDto dto, int userId);
}
