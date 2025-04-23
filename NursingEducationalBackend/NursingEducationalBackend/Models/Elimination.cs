using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace NursingEducationalBackend.Models;

public partial class Elimination
{
    public int EliminationId { get; set; }

    public string? IncontinentOfBladder { get; set; }

    public string? IncontinentOfBowel { get; set; }

    public string? DayOrNightProduct { get; set; }

    [Range(typeof(DateTime), "1900-01-01 00:00:00", "3000-03-30 00:00:00")]
    public DateTime? LastBowelMovement { get; set; }

    public string? BowelRoutine { get; set; } 

    public string? BladderRoutine { get; set; }

    [Range(typeof(DateOnly), "1900-01-01", "3000-03-30")]
    public DateOnly? CatheterInsertionDate { get; set; }

    public string? CatheterInsertion { get; set; }
}
