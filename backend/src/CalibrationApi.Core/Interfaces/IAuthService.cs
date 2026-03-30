using CalibrationApi.Core.DTOs;

namespace CalibrationApi.Core.Interfaces;

public interface IAuthService
{
    Task<LoginResponse?> LoginAsync(LoginRequest request);
    Task<UserDto?> GetCurrentUserAsync(int userId);
}
