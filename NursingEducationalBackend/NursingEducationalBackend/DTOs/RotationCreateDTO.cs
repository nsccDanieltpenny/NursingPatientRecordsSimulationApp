using System.ComponentModel.DataAnnotations;

namespace NursingEducationalBackend.DTOs
{
    public class RotationCreateDTO
    {
        [Required]
        [MaxLength(50)]
        public required string Name { get; set; }
    }
}
