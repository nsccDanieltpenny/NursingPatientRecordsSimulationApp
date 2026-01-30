using System.ComponentModel.DataAnnotations;

namespace NursingEducationalBackend.Models
{
    public class Rotation
    {
        [Key]
        public int RotationId { get; set;}

        [Required]
        public string Name { get; set;}
    }
}
