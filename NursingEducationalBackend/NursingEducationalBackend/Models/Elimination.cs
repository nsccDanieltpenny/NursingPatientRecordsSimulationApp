using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace NursingEducationalBackend.Models;

public partial class Elimination
{
    public int EliminationId { get; set; }

    public string IncontinentOfBladder { get; set; } = null!;

    public string IncontinentOfBowel { get; set; } = null!;

    public string DayOrNightProduct { get; set; } = null!;

    [Range(typeof(DateOnly), "1900-01-01", "3000-12-31")]
    public DateOnly LastBowelMovement { get; set; }

    public string BowelRoutine { get; set; } = null!;

    public string BladderRoutine { get; set; } = null!;

    public DateOnly? CatheterInsertionDate { get; set; }

    public string CatheterInsertion { get; set; } = null!;
}
