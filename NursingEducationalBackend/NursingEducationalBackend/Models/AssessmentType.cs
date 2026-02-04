using System.ComponentModel.DataAnnotations;

namespace NursingEducationalBackend.Models
{
    public class AssessmentType
    {
        [Key]
        public int AssessmentTypeId { get; set; }

        [Required]
        public required string Name { get; set; }

        [Required]
        public required string RouteKey { get; set; }
    }
}
