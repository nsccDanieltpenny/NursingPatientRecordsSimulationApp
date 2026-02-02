namespace NursingEducationalBackend.DTOs
{
    public class PatientMobilityAndSafetyDTO
    {    
        //Mobility
        public string? Transfer { get; set; }
        public string? Aids { get; set; }
        public string? BedMobility { get; set; }

        //Safety
        public string? HipProtectors { get; set; }

        public string? SideRails { get; set; }

        public string? FallRiskScale { get; set; }

        public string? CrashMats { get; set; }

        public string? BedAlarm { get; set; }
    }
}
