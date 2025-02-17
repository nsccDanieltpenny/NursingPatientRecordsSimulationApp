using System;
using System.Collections.Generic;

namespace NursingEducationalBackend.Models;

public partial class Cognitive
{
    public int CognitiveId { get; set; }

    public string Speech { get; set; } = null!;

    public string? Loc { get; set; }

    public string? Mmse { get; set; }

    public string? Confusion { get; set; }
}
