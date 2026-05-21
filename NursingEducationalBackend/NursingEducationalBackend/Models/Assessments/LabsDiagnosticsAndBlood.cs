namespace NursingEducationalBackend.Models.Assessments
{
    public class LabsDiagnosticsAndBlood
    {
        public int LabsDiagnosticsAndBloodId { get; set; }
        public int PatientId { get; set; }


        public string? Type { get; set; }
        public string? Value { get; set; }
        public DateOnly? OrderedDate { get; set; }
        public DateOnly? CompletedDate { get; set; }

        public virtual Patient Patient { get; set; }
    }
}
