using NursingEducationalBackend.Models;
using System.ComponentModel.DataAnnotations;

namespace NursingEducationalBackend.DTOs
{
    public class ClassOverviewDTO
    {
        [Key]
        public int ID { get; set; }

        [Required]
        public string Name { get; set; } = null!;
        public string Description { get; set; } = null!;

        public int StudentCount { get; set; }

        [Required]
        [MaxLength(6)]
        public string JoinCode { get; set; } = null!;

        public int InstructorId { get; set; }


        [Range(typeof(DateOnly), "2025-01-01", "3000-12-31")]
        public DateOnly StartDate { get; set; }

        [Range(typeof(DateOnly), "2025-01-01", "3000-12-31")]
        public DateOnly EndDate { get; set; }
    }
}
