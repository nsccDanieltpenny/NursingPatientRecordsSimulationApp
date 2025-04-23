using System.ComponentModel.DataAnnotations;

namespace NursingEducationalBackend.DTOs
{
    public class PatientMobilityDTO
    {
        //public int MobilityId { get; set; }
        public string? Transfer { get; set; }
        public string? Aids { get; set; }
        public string? BedMobility { get; set; }
    }
}
