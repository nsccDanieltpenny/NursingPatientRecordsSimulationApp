using System;
using System.ComponentModel.DataAnnotations;

namespace NursingEducationalBackend.DTOs
{
    public class ResetPasswordRequest
    {
        [Required]
        [StringLength(100, MinimumLength = 6)]
        public string NewPassword { get; set; }
    }

    public class ChangePasswordRequest
    {
        [Required]
        public string CurrentPassword { get; set; }

        [Required]
        [StringLength(100, MinimumLength = 6)]
        public string NewPassword { get; set; }
    }
    
    public class CreateAdminRequest
    {
        [Required]
        [EmailAddress]
        public string Email { get; set; }
        
        [Required]
        [StringLength(100, MinimumLength = 6)]
        public string Password { get; set; }
        
        [Required]
        public string FullName { get; set; }
        
        public string StudentNumber { get; set; }
        
        public string Campus { get; set; }
    }

    public class UpdatePatientRequest
    {
        public int? NurseId { get; set; }
        public string? ImageFilename { get; set; }
        public int? BedNumber { get; set; }
        
        [Required]
        public string NextOfKin { get; set; }
        
        [Required]
        [Phone]
        public string NextOfKinPhone { get; set; }
        
        [Required]
        public string FullName { get; set; }
        
        [Required]
        public string Sex { get; set; }
        
        [Required]
        public string PatientWristId { get; set; }
        
        [Required]
        public DateOnly Dob { get; set; }
        
        [Required]
        public DateOnly AdmissionDate { get; set; }
        
        public DateOnly? DischargeDate { get; set; }
        
        public string? MaritalStatus { get; set; }
        
        public string? MedicalHistory { get; set; }
        
        [Required]
        [Range(1, 1000)]
        public int Weight { get; set; }
        
        [Required]
        public string Height { get; set; }
        
        [Required]
        public string Allergies { get; set; }
        
        [Required]
        public string IsolationPrecautions { get; set; }
        
        [Required]
        public string Unit { get; set; }
        
        public string? RoamAlertBracelet { get; set; }
    }
}