using System.ComponentModel.DataAnnotations;

namespace NursingEducationalBackend.DTOs.Assessments
{
    public class PatientAcuteProgressDTO
    {

        [Range(typeof(DateTime), "1900-01-01 00:00:00", "3000-12-31 00:00:00")]
        public DateTime Timestamp { get; set; }

        public string? Note { get; set; } = null!;

        public string? Treatment { get; set; }

        public string? Procedures { get; set; }

        public string? SpecialInstructions { get; set; }
    }
}
