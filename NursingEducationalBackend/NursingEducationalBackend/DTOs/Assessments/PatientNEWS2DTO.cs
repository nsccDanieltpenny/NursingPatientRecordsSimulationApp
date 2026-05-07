namespace NursingEducationalBackend.DTOs.Assessments
{
    public class PatientNEWS2DTO
    {
        public int? RespirationRate { get; set; }

        public int? SpO2Scale1 { get; set; }

        public int? SpO2Scale2 { get; set; }

        public bool? OnOxygen { get; set; }

        public int OxygenFlowRate { get; set; }

        public string? OxygenDevice { get; set; }

        public int? BPSystolic { get; set; }

        public int? BPDiastolic { get; set; }

        public int? PulseBPM { get; set; }

        public string? Consciousness { get; set; }

        public int? TemperatureC { get; set; }

        public int? TotalScore { get; set; }

        public int? MonitoringFrequency { get; set; }

        public bool? EscalationOfCare { get; set; }
    }
}
