namespace NursingEducationalBackend.DTOs
{
    public class RotationDTO
    {
        public int RotationId { get; set; }
        public string Name { get; set; } = string.Empty;
        public List<string> AssessmentNames { get; set; } = new();
    }
}
