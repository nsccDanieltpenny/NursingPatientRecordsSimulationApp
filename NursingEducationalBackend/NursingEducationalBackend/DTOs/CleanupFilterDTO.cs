namespace NursingEducationalBackend.DTOs
{
    public class CleanupFilterDTO
    {
        public int? ClassId { get; set; }
        public int? StudentId { get; set; }
        public DateTime? BeforeDate { get; set; }
        public int? RotationId { get; set; }
        //public int? CampusId { get; set; }
    }
}
