namespace NursingEducationalBackend.DTOs.Assessments
{
    public class PatientLabsDiagnosticsAndBloodDTO
    {
        public int? Id { get; set; }
        public int PatientId { get; set; }

        public string? Type { get; set; }
        public string? Value { get; set; }
        public DateOnly? OrderedDate { get; set; }
        public DateOnly? CompletedDate { get; set; }
    }
}
