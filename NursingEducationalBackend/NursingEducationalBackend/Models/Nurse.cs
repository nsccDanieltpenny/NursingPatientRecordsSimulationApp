using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace NursingEducationalBackend.Models;

public partial class Nurse
{
    [Key]
    public int NurseId { get; set; }

    public int? PatientId { get; set; }

    public string? FullName { get; set; }

    [Required]
    public string StudentNumber { get; set; } = string.Empty;

    [Required]
    [EmailAddress]
    public string Email { get; set; } = string.Empty;

    public string? EntraUserId { get; set; } // Entra Object ID (oid claim)

    public string? InvitedByEmail { get; set; }

    //public string Password { get; set; }
    public bool IsValid { get; set; }

    public bool IsInstructor { get; set; }

    public virtual ICollection<Patient> Patients { get; set; } = new List<Patient>();

    public int? ClassId { get; set; }
    public virtual Class? Class { get; set; }
}
