namespace NursingEducationalBackend.DTOs.Assessments
{
    public class PatientLabsDiagnosticsBloodUpsertDTO
    {
        public int RotationId { get; set; }
        public List<PatientLabsDiagnosticsAndBloodDTO> Labs { get; set; }
    }   
}
