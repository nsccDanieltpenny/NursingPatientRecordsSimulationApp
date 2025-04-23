using System.ComponentModel.DataAnnotations;

namespace NursingEducationalBackend.DTOs
{
    public class PatientSafetyDTO
    {
        //public int SafetyId { get; set; }
        public string? HipProtectors { get; set; }

        public string? SideRails { get; set; }

        public string? FallRiskScale { get; set; }

        public string? CrashMats { get; set; }

        public string? BedAlarm { get; set; }
    }
}
