using System;
using System.Collections.Generic;

namespace NursingEducationalBackend.Models;

public partial class Elimination
{
    public int EliminationId { get; set; }

    public string IncontinentOfBladder { get; set; } = null!;

    public string IncontinentOfBowel { get; set; } = null!;

    public string DayOrNightProduct { get; set; } = null!;

    public DateOnly LastBowelMovement { get; set; }

    public string BowelRoutine { get; set; } = null!;

    public string BladderRoutine { get; set; } = null!;

    public DateOnly CatheterInsertionDate { get; set; }

    public string CatheterInsertion { get; set; } = null!;
}
