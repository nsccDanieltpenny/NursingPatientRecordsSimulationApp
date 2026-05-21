namespace NursingEducationalBackend.DTOs
{
    public class CleanupResultDTO
    {
        public int RecordsDeleted { get; set; }
        public int AssessmentsDeleted { get; set; }
        public int StudentsDeleted { get; set; }
        public DateTime ExecutedAt { get; set; }
        public string ExecutedBy { get; set; }
    }
}
