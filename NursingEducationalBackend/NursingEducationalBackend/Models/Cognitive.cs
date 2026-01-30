using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;

namespace NursingEducationalBackend.Models;

public partial class Cognitive
{
    public int CognitiveId { get; set; }
    public int AssessmentSubmissionId { get; set; }

    public string? Speech { get; set; }
    public string? Loc { get; set; }

    public string? Mmse { get; set; }

    public string? Confusion { get; set; }
}
