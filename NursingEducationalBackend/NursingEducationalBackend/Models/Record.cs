using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace NursingEducationalBackend.Models;

public partial class Record
{
    public int RecordId { get; set; }

    public int PatientId { get; set; }
    
    public int NurseId { get; set; }

    public int RotationId { get; set; }

    [Range(typeof(DateTime), "1900-01-01 00:00:00", "3000-03-30 00:00:00")]
    public DateTime CreatedDate { get; set; }

    [JsonIgnore]
    public virtual Rotation Rotation { get; set; }

    [JsonIgnore]
    public virtual Patient Patient { get; set; }

    [JsonIgnore]
    public virtual Nurse Nurse { get; set; }

    public virtual ICollection<AssessmentSubmission> AssessmentSubmissions { get; set; } = new List<AssessmentSubmission>();
}
