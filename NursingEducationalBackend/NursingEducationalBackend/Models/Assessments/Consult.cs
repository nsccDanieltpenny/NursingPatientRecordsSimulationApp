namespace NursingEducationalBackend.Models.Assessments
{
    public class Consult
    {
        public int ConsultId { get; set; }
        public int PatientId { get; set; }

        public string ConsultType { get; set; }
        public DateOnly? DateSent { get; set; }
        public DateOnly? DateReplied { get; set; }
        public string ConsultName { get; set; }

        public virtual Patient Patient { get; set; }
    }
}
