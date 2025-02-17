using System;
using System.Collections.Generic;

namespace NursingEducationalBackend.Models;

public partial class Record
{
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

    public virtual Patient? Patient { get; set; }
}
