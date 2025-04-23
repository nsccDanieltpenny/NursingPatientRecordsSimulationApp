using System.ComponentModel.DataAnnotations;

namespace NursingEducationalBackend.DTOs
{
    public class PatientSkinDTO
    {
        //public int SkinAndSensoryAidsId { get; set; }
        public string? Glasses { get; set; }

        public string? Hearing { get; set; }

        public string? SkinIntegrityPressureUlcerRisk { get; set; }

        public string? SkinIntegrityTurningSchedule { get; set; }

        public string? SkinIntegrityBradenScale { get; set; }

        public string? SkinIntegrityDressings { get; set; }
    }
}
