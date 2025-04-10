using System.ComponentModel.DataAnnotations;

namespace NursingEducationalBackend.DTOs
{
    public class PatientEliminationDTO
    {
        public int EliminationId { get; set; }
        public string IncontinentOfBladder { get; set; } = null!;
        public string IncontinentOfBowel { get; set; } = null!;
        public string DayOrNightProduct { get; set; } = null!;

        [Range(typeof(DateTime), "1900-01-01 00:00:00", "3000-3-30 00:00:00")]
        public DateTime LastBowelMovement { get; set; }
        public string BowelRoutine { get; set; } = null!;
        public string BladderRoutine { get; set; } = null!;
        public DateOnly? CatheterInsertionDate { get; set; }
        public string CatheterInsertion { get; set; } = null!;
    }
}