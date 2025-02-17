using System;
using System.Collections.Generic;

namespace NursingEducationalBackend.Models;

public partial class Patient
{
    public string PatientWristId { get; set; } = null!;

    public int? NurseId { get; set; }

    public string NextOfKin { get; set; } = null!;

    public long NextOfKinPhone { get; set; }

    public int PatientId { get; set; }

    public string FullName { get; set; } = null!;

    public string Sex { get; set; } = null!;

    public DateOnly Dob { get; set; }

    public DateOnly Admission { get; set; }

    public string? MaritalStatus { get; set; }

    public string? MedicalHistory { get; set; }

    public int Weight { get; set; }

    public string Height { get; set; } = null!;

    public string Allergies { get; set; } = null!;

    public string IsolationPrecautions { get; set; } = null!;

    public string? RoamAlertBracelet { get; set; }

    public virtual Nurse? Nurse { get; set; }

    public virtual ICollection<Record> Records { get; set; } = new List<Record>();
}
