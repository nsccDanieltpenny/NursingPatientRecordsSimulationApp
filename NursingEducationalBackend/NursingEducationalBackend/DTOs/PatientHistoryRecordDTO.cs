namespace NursingEducationalBackend.DTOs
{
    public class PatientHistoryRecordDTO
    {
        public int RecordId { get; set; }
        public DateTime SubmittedDate { get; set; }
        public int NurseId { get; set; }
        public required string SubmittedNurse { get; set; }
        public int? AdlId { get; set; }
        public int? BehaviourId { get; set; }
        public int? CognitiveId { get; set; }
        public int? EliminationId { get; set; }
        public int? MobilityId { get; set; }
        public int? NutritionId { get; set; }
        public int? ProgressId { get; set; }
        public int? SafetyId { get; set; }
        public int? SkinAndSensoryId { get; set; }
    }
}
