using CalibrationMvc.Data;
using CalibrationMvc.DTOs;
using Microsoft.EntityFrameworkCore;

namespace CalibrationMvc.Services;

public class AuthService : IAuthService
{
    private readonly CalibrationDbContext _context;

    public AuthService(CalibrationDbContext context)
    {
        _context = context;
    }

    public async Task<UserDto?> LoginAsync(LoginRequest request)
    {
        var user = await _context.Users
            .AsNoTracking()
            .FirstOrDefaultAsync(u => u.Username == request.Username);

        if (user == null)
            return null;

        if (!BCrypt.Net.BCrypt.Verify(request.Password, user.PasswordHash))
            return null;

        return new UserDto
        {
            Id = user.Id,
            Username = user.Username,
            FullName = user.FullName,
            Role = user.Role.ToString()
        };
    }

    public async Task<UserDto?> GetCurrentUserAsync(int userId)
    {
        var user = await _context.Users
            .AsNoTracking()
            .FirstOrDefaultAsync(u => u.Id == userId);

        if (user == null)
            return null;

        return new UserDto
        {
            Id = user.Id,
            Username = user.Username,
            FullName = user.FullName,
            Role = user.Role.ToString()
        };
    }
}
