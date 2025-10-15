using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace NursingEducationalBackend.Models;

public partial class ProgressNote
{
    [DatabaseGenerated(DatabaseGeneratedOption.None)]
    public int ProgressNoteId { get; set; }

    [Range(typeof(DateTime), "1900-01-01 00:00:00", "3000-12-31 00:00:00")]
    public DateTime Timestamp { get; set; }

    public string Note { get; set; } = null!;
}
