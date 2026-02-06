namespace NursingEducationalBackend.DTOs.Assessments
{
    public class PatientLabsDiagnosticsAndBloodDTO
    {
        //Labs/Specimens
        public string? Labs { get; set; }
        public DateOnly? LabsOrderedDate { get; set; }
        public DateOnly? LabsCompletedDate { get; set; }

        //Diagnostics/Xray/Procedure
        public string? Diagnostics { get; set; }
        public DateOnly? DiagnosticsOrderedDate { get; set; }
        public DateOnly? DiagnosticsCompletedDate { get; set; }

        public string? BloodWork { get; set; }
        public DateOnly? BloodWorkOrderedDate { get; set; }
        public DateOnly? BloodWorkCompletedDate { get; set; }
    }
}
