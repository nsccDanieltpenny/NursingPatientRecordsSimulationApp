using System.ComponentModel.DataAnnotations;

namespace NursingEducationalBackend.DTOs.Assessments
{
    public class PatientCognitiveDTO
    {
        //public int CognitiveId { get; set; }
        public string? Speech { get; set; }
        public string? Loc { get; set; }
        public string? Mmse { get; set; }
        public string? Confusion { get; set; }
    }
}
