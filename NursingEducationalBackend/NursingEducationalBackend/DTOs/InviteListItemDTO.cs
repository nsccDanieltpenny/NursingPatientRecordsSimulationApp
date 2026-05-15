using System;

namespace NursingEducationalBackend.DTOs
{
    public class InviteListItemDTO
    {
        public int PendingInviteId { get; set; }
        public string Email { get; set; } = string.Empty;
        public string? DisplayName { get; set; }
        public string Status { get; set; } = string.Empty;
        public DateTime CreatedAtUtc { get; set; }
        public string? InvitedByEmail { get; set; }
        public string? GraphInviteId { get; set; }
    }
}
