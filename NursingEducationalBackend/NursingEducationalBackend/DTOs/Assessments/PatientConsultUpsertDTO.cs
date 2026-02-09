namespace NursingEducationalBackend.DTOs.Assessments
{
    public class PatientConsultUpsertDTO
    {
        public int RotationId { get; set; }
        public IEnumerable<PatientConsultDTO> Consults { get; set; }
        public string? CurrentIllness { get; set; }
    }
}
