namespace NursingEducationalBackend.DTOs
{
    public class InviteUserResponse
    {
        public bool Success { get; set; }
        public string? Message { get; set; }
        public InviteListItemDTO? Invite { get; set; }
    }
}
