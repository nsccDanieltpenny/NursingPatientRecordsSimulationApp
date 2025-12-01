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

    [Range(typeof(DateTime), "1900-01-01 00:00:00", "3000-03-30 00:00:00")]
    public DateTime CreatedDate { get; set; }

    public int? CognitiveId { get; set; }
    [JsonIgnore]
    public virtual Cognitive? Cognitive { get; set; }

    public int? NutritionId { get; set; }
    [JsonIgnore]
    public virtual Nutrition? Nutrition { get; set; }

    public int? EliminationId { get; set; }
    [JsonIgnore]
    public virtual Elimination? Elimination { get; set; }

    public int? MobilityId { get; set; }
    [JsonIgnore]
    public virtual Mobility? Mobility { get; set; }

    public int? SafetyId { get; set; }
    [JsonIgnore]
    public virtual Safety? Safety { get; set; }

    public int? AdlId { get; set; }
    [JsonIgnore]
    public virtual Adl? Adl { get; set; }

    public int? SkinId { get; set; }
    [JsonIgnore]
    public virtual SkinAndSensoryAid? SkinAndSensory { get; set; }

    public int? BehaviourId { get; set; }
    [JsonIgnore]
    public virtual Behaviour? Behaviour { get; set; }

    public int? ProgressNoteId { get; set; }
    [JsonIgnore]
    public virtual ProgressNote? ProgressNote { get; set; }

    [JsonIgnore]
    public virtual Patient Patient { get; set; }

    [JsonIgnore]
    public virtual Nurse Nurse { get; set; }
}
