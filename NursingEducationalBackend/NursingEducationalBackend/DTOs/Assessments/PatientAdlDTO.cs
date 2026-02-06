using System.ComponentModel.DataAnnotations;

namespace NursingEducationalBackend.DTOs.Assessments
{
    public class PatientAdlDTO
    {
        //public int AdlsId { get; set; }

        [Range(typeof(DateTime), "1900-01-01 00:00:00", "3000-12-31 00:00:00")]
        public DateTime? BathDate { get; set; }

        public string? TubShowerOther { get; set; } 

        public string? TypeOfCare { get; set; } 

        public string? Turning { get; set; }

        public string? TurningFrequency { get; set; }

        public string? Teeth { get; set; } 
    
        public string? DentureType { get; set; }

        public string? MouthCare { get; set; }

        public string? FootCare { get; set; } 

        public string? HairCare { get; set; }
    }
}
