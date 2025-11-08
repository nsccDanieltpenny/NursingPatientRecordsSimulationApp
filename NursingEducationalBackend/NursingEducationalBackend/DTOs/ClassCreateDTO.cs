using System.ComponentModel.DataAnnotations;

namespace NursingEducationalBackend.DTOs
{
    public class ClassCreateDTO
    {
        [Required]
        public required string Name { get; set; }
        public string? Description { get; set; }

        [Range(typeof(DateOnly), "2025-01-01", "3000-12-31")]
        public DateOnly StartDate { get; set; }

        [Range(typeof(DateOnly), "2025-01-01", "3000-12-31")]
        public DateOnly EndDate { get; set; }

    }
}
