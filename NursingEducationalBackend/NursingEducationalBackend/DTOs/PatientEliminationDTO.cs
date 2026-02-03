using System.ComponentModel.DataAnnotations;

namespace NursingEducationalBackend.DTOs
{
    public class PatientEliminationDTO
    {
        //public int EliminationId { get; set; }
        public string? DayOrNightProduct { get; set; }

        [Range(typeof(DateTime), "1900-01-01 00:00:00", "3000-03-30 00:00:00")]
        public DateTime? LastBowelMovement { get; set; }
        
        public string? Routine { get; set; }

        [Range(typeof(DateOnly), "1900-01-01", "3000-03-30")]
        public DateOnly? CatheterInsertionDate { get; set; }
        
        public string? CatheterInsertion { get; set; }
        
        public string? CatheterSize { get; set; }
    }
}