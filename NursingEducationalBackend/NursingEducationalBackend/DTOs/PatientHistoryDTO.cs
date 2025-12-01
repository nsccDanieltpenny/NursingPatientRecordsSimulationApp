namespace NursingEducationalBackend.DTOs
{
    public class PatientHistoryDTO
    {
        public int PatientId { get; set; }
        public required string PatientName { get; set; }
        public required ICollection<PatientHistoryRecordDTO> History { get; set; }
    }
}
