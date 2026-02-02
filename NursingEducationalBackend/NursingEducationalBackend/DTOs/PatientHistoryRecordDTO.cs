namespace NursingEducationalBackend.DTOs
{
    public class PatientHistoryRecordDTO
    {
        public int RecordId { get; set; }
        public DateTime SubmittedDate { get; set; }
        public int NurseId { get; set; }
        public required string SubmittedNurse { get; set; }
        public int RotationId { get; set;}
        public required string RotationName { get; set; }

        public List<AssessmentSubmissionSummaryDTO> AssessmentSubmissions { get; set; }
    }
}
