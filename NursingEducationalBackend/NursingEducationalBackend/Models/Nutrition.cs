using System;
using System.Collections.Generic;

namespace NursingEducationalBackend.Models;

public partial class Nutrition
{
    public int NutritionId { get; set; }

    public string Diet { get; set; } = null!;

    public string Assit { get; set; } = null!;

    public string Intake { get; set; } = null!;

    public string Time { get; set; } = null!;

    public string DietarySupplementInfo { get; set; } = null!;

    public int Weight { get; set; }

    public DateOnly Date { get; set; }

    public string Method { get; set; } = null!;

    public string IvSolutionRate { get; set; } = null!;

    public string SpecialNeeds { get; set; } = null!;
}
