namespace NursingEducationalBackend.DTOs
{
    public class ProvisionRequest
    {
        public string ClassCode { get; set; } = string.Empty;
        public string? StudentNumber { get; set; }
        public string? FullName { get; set; }
    }
}
