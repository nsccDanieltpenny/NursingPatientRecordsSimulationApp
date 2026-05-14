namespace NursingEducationalBackend.DTOs
{
    public class InviteUserRequest
    {
        public string Email { get; set; } = string.Empty;
        public string? DisplayName { get; set; }
    }
}
