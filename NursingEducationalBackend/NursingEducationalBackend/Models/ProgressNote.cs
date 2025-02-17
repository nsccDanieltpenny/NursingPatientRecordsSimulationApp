using System;
using System.Collections.Generic;

namespace NursingEducationalBackend.Models;

public partial class ProgressNote
{
    public int ProgressNoteId { get; set; }

    public DateTime Timestamp { get; set; }

    public string Note { get; set; } = null!;
}
