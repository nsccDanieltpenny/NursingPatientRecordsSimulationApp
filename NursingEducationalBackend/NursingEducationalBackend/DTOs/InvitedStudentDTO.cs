namespace NursingEducationalBackend.DTOs
{
    public class InvitedStudentDTO
    {
        public int NurseId { get; set; }
        public string? FullName { get; set; }
        public string Email { get; set; } = string.Empty;
        public string StudentNumber { get; set; } = string.Empty;
        public int? ClassId { get; set; }
        public string? ClassName { get; set; }
        public bool IsInstructor { get; set; }
        public bool IsValid { get; set; }
    }
}
