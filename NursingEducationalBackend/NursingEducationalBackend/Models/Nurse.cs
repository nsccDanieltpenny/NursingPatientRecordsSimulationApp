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

    //public string Password { get; set; }

    public virtual ICollection<Patient>? Patients { get; set; } = new List<Patient>();
}
