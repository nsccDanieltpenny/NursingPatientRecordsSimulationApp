using System;

namespace NursingEducationalBackend.DTOs
{
    public class GraphGuestUserDTO
    {
        public string Id { get; set; } = string.Empty;
        public string? DisplayName { get; set; }
        public string? Mail { get; set; }
        public string[]? OtherMails { get; set; }
        public string? UserPrincipalName { get; set; }
        public string? UserType { get; set; }
        public DateTime? CreatedDateTime { get; set; }
    }
}
