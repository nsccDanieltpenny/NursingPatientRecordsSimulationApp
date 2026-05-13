using System;

namespace NursingEducationalBackend.Models
{
    public class PendingInvite
    {
        public int PendingInviteId { get; set; }
        public string Email { get; set; } = string.Empty;
        public string? DisplayName { get; set; }
        public string? GraphInviteId { get; set; }
        public string Status { get; set; } = "Sent";
        public DateTime CreatedAtUtc { get; set; } = DateTime.UtcNow;
        public DateTime? LastUpdatedUtc { get; set; }
        public string? InvitedByEmail { get; set; }
        public string? ErrorMessage { get; set; }
    }
}
