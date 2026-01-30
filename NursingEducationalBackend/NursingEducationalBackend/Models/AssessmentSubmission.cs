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

        //Navigation properties
        public virtual Record Record { get; set; }
        public virtual AssessmentType AssessmentType { get; set; }
    }
}
