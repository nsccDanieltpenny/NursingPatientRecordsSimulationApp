using System.ComponentModel.DataAnnotations;

namespace NursingEducationalBackend.Models
{
    public class AssessmentSubmission
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public int RecordId { get; set; }

        [Required]
        public int AssessmentTypeId { get; set; }

        [Required]
        public int TableRecordId { get; set; } //The actual ID of the submission in its assessment table.

        //Navigation properties
        public virtual Record Record { get; set; }
        public virtual AssessmentType AssessmentType { get; set; }
    }
}
