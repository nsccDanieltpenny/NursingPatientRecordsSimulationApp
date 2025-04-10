using System.ComponentModel.DataAnnotations;

namespace NursingEducationalBackend.DTOs
{
    public class PatientProgressNoteDTO
    {
        public int ProgressNoteId { get; set; }

        [Range(typeof(DateTime), "1900-01-01 00:00:00", "3000-12-31 00:00:00")]
        public DateTime Timestamp { get; set; }

        public string Note { get; set; } = null!;
    }
}
