using System;
using System.Collections.Generic;

namespace NursingEducationalBackend.Models
{
    public partial class Nurse
    {
        public int NurseId { get; set; }
        public int? PatientId { get; set; }
        public string? FullName { get; set; }
        public string StudentNumber { get; set; }
        public string Email { get; set; }
        public string Campus { get; set; }
        //public string Password { get; set; }
        
        // New property for class assignment (one student can only be in one class)
        public int? ClassId { get; set; }
        
        // Navigation properties
        public virtual ICollection<Patient>? Patients { get; set; } = new List<Patient>();
        
        // Navigation property to the class
        public virtual Class? Class { get; set; }
    }
}