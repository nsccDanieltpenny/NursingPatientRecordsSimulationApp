namespace NursingEducationalBackend.DTOs
{
    public class SubmitDataDTO
    {
        public int RotationId { get; set; }
        public required Dictionary<string, object> AssessmentData { get; set; }
    }
}
