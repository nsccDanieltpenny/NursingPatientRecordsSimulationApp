public class AssessmentSubmissionSummaryDTO
{
    public int SubmissionId { get; set; }
    public int AssessmentTypeId { get; set; }
    public string AssessmentTypeName { get; set; } = string.Empty;
    public int TableRecordId { get; set; }
}