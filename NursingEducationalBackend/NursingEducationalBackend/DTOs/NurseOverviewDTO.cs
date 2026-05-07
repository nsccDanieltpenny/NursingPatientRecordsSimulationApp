using NursingEducationalBackend.Models;

namespace NursingEducationalBackend.DTOs
{
    public class NurseOverviewDTO
    {
        public int NurseId { get; set; }

        public int? PatientId { get; set; }

        public string? FullName { get; set; }
        public string StudentNumber { get; set; } = string.Empty;

        public string Email { get; set; } = string.Empty;

        //public string Password { get; set; }
        public bool IsInstructor { get; set; }

        public virtual ICollection<Patient>? Patients { get; set; } = new List<Patient>();

        public int? ClassId { get; set; }
    }
}
