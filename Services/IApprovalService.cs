using CalibrationMvc.DTOs;

namespace CalibrationMvc.Services;

public interface IApprovalService
{
    Task<List<ApprovalDto>> GetPendingApprovalsAsync();
    Task<ApprovalDto?> GetApprovalByIdAsync(int id);
    Task<bool> ApproveAsync(int id, int reviewerUserId);
    Task<bool> RejectAsync(int id, int reviewerUserId);
}
