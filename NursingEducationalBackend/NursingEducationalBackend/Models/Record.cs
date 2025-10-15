using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace NursingEducationalBackend.Models;

public partial class Record
{
    [DatabaseGenerated(DatabaseGeneratedOption.None)]
    public int RecordId { get; set; }

    public int? PatientId { get; set; }

    public int? CognitiveId { get; set; }

    public int? NutritionId { get; set; }

    public int? EliminationId { get; set; }

    public int? MobilityId { get; set; }

    public int? SafetyId { get; set; }

    public int? AdlsId { get; set; }

    public int? SkinId { get; set; }

    public int? BehaviourId { get; set; }

    public int? ProgressNoteId { get; set; }

    [JsonIgnore]
    public virtual Patient? Patient { get; set; }
}
