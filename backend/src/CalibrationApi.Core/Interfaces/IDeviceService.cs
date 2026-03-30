using CalibrationApi.Core.DTOs;

namespace CalibrationApi.Core.Interfaces;

public interface IDeviceService
{
    Task<PagedResult<DeviceDto>> GetDevicesAsync(DeviceListQuery query);
    Task<DeviceDto?> GetDeviceByIdAsync(int id);
    Task<DeviceDto> CreateDeviceAsync(CreateDeviceDto dto, int userId);
    Task<DeviceDto?> UpdateDeviceAsync(int id, UpdateDeviceDto dto, int userId);
}
