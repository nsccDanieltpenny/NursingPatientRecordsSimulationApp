using System.ComponentModel.DataAnnotations;

namespace NursingEducationalBackend.DTOs
{
    public class PatientSafetyDTO
    {
        //public int SafetyId { get; set; }
        public string HipProtectors { get; set; } = null!;

        public string SideRails { get; set; } = null!;

        public string FallRiskScale { get; set; } = null!;

        public string CrashMats { get; set; } = null!;

        public string BedAlarm { get; set; } = null!;
    }
}
