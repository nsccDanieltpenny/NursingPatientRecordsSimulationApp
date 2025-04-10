using System.ComponentModel.DataAnnotations;

namespace NursingEducationalBackend.DTOs
{
    public class PatientProfileDTO
    {      

        public int? BedNumber { get; set; }

        public string NextOfKin { get; set; } = null!;

        [Phone]
        public string NextOfKinPhone { get; set; }

        public string FullName { get; set; } = null!;

        public string Sex { get; set; } = null!;

        public string PatientWristId { get; set; } = null!;

        [Range(typeof(DateOnly), "1900-01-01", "3000-12-31")]
        public DateOnly Dob { get; set; }

        [Range(typeof(DateOnly), "1900-01-01", "3000-12-31")]
        public DateOnly AdmissionDate { get; set; }

        public DateOnly? DischargeDate { get; set; }  // New nullable discharge date


        public string? MaritalStatus { get; set; }

        public string? MedicalHistory { get; set; }

        [Range(1, 1000)]
        public int Weight { get; set; }

        public string Height { get; set; } = null!;

        public string Allergies { get; set; } = null!;

        public string IsolationPrecautions { get; set; } = null!;

        public string? RoamAlertBracelet { get; set; }
    }
}
