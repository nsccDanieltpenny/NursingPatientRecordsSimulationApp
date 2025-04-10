using System.ComponentModel.DataAnnotations;

namespace NursingEducationalBackend.DTOs
{
    public class PatientNutritionDTO
    {
        public int NutritionId { get; set; }
        public string Diet { get; set; } = null!;

        public string Assit { get; set; } = null!;

        public string Intake { get; set; } = null!;

        public string Time { get; set; } = null!;

        public string DietarySupplementInfo { get; set; } = null!;

        [Range(1, 1000)]
        public int Weight { get; set; }

        [Range(typeof(DateOnly), "1900-01-01", "3000-3-30")]
        public DateOnly Date { get; set; }

        public string Method { get; set; } = null!;

        public string IvSolutionRate { get; set; } = null!;

        public string SpecialNeeds { get; set; } = null!;
    }
}