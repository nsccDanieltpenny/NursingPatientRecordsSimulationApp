using System.ComponentModel.DataAnnotations;

namespace NursingEducationalBackend.Models
{
    public class Rotation
    {
        [Key]
        public int RotationId { get; set;}

        [Required]
        public required string Name { get; set;}

        public virtual ICollection<RotationAssessment> RotationAssessments { get; set; } = [];
    }
}
