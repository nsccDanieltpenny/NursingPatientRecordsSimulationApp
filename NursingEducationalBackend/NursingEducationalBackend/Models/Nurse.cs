using System;
using System.Collections.Generic;

namespace NursingEducationalBackend.Models;

public partial class Nurse
{
    public int NurseId { get; set; }

    public int? PatientId { get; set; }

    public string? FullName { get; set; }
    public string StudentNumber { get; set; }

    public string Email { get; set; }

    public string? EntraUserId { get; set; } // Entra Object ID (oid claim)

    //public string Password { get; set; }
    public bool IsValid { get; set; }

    public bool IsInstructor { get; set; }

    public virtual ICollection<Patient>? Patients { get; set; } = new List<Patient>();

    public int? ClassId { get; set; }
    public virtual Class? Class { get; set; } = null!;
}
