namespace NursingEducationalBackend.DTOs.Assessments
{
    public class PatientConsultDTO
    {
        public int? ConsultId { get; set; }
        public int PatientId { get; set; }

        public string ConsultType { get; set; }
        public DateOnly? DateSent { get; set; }
        public DateOnly? DateReplied { get; set; }
        public string ConsultName { get; set; }
    }
}
