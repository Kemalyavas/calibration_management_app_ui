using CalibrationMvc.DTOs;

namespace CalibrationMvc.Services;

public interface IAuthService
{
    Task<UserDto?> LoginAsync(LoginRequest request);
    Task<UserDto?> GetCurrentUserAsync(int userId);
}
