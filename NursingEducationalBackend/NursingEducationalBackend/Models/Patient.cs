using System;
using System.Collections.Generic;

namespace NursingEducationalBackend.Models;

public class Patient
{
    public int PatientId { get; set; }
    public string PatientWristId { get; set; } = string.Empty;
    public int BedNumber { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Dob { get; set; } = string.Empty;
    public string MaritalStatus { get; set; } = string.Empty;
    public string Height { get; set; } = string.Empty;
    public string Weight { get; set; } = string.Empty;
    public string NextOfKin { get; set; } = string.Empty;
    public string Phone { get; set; } = string.Empty;
    public string AdmissionReason { get; set; } = string.Empty;
    public bool RoamAlert { get; set; }
    public string Allergies { get; set; } = string.Empty;
    public string MedicalHistory { get; set; } = string.Empty;
    public string IsolationPrecautions { get; set; } = string.Empty;
    public int NurseId { get; set; }
    public virtual Nurse? Nurse { get; set; }
    public virtual ICollection<Record> Records { get; set; } = new List<Record>();
}
