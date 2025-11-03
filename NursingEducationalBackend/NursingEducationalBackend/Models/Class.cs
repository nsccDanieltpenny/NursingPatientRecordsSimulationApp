using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;

namespace NursingEducationalBackend.Models
{
    public partial class Class
    {
        [Key]
        public int ClassId { get; set; }

        [Required]
        public string Name { get; set; } = null!;
        public string Description { get; set; } = null!;

        [Required]
        [MaxLength(6)]
        public string JoinCode { get; set; } = null!;

        public int InstructorId { get; set; }
        public virtual Nurse Instructor { get; set; } = null!;

        [Range(typeof(DateOnly), "2025-01-01", "3000-12-31")]
        public DateOnly StartDate { get; set; }

        [Range(typeof(DateOnly), "2025-01-01", "3000-12-31")]
        public DateOnly EndDate { get; set; }

        public virtual ICollection<Nurse>? Students { get; set; } = [];
    }
}
