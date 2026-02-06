using System.ComponentModel.DataAnnotations;

namespace NursingEducationalBackend.DTOs.Assessments
{
    public class PatientSkinDTO
    {
        //public int SkinAndSensoryAidsId { get; set; }

        public string? SkinIntegrity { get; set; }

        public string? SkinIntegrityFrequency { get; set; }
        
        public string? Glasses { get; set; }

        public string? Hearing { get; set; }

        public string? HearingAidSide { get; set; }

        public string? PressureUlcerRisk { get; set; }

        public string? SkinIntegrityTurningSchedule { get; set; }

        public string? TurningScheduleFrequency { get; set; }

        public string? SkinIntegrityDressings { get; set; }
    }
}
