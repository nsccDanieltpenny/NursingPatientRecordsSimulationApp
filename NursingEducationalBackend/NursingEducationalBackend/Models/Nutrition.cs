using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace NursingEducationalBackend.Models;

public partial class Nutrition
{
    public int NutritionId { get; set; }

    public string Diet { get; set; } = null!;

    public string Assit { get; set; } = null!;

    public string Intake { get; set; } = null!;

    [Range(typeof(DateTime), "1900-01-01 00:00:00", "3000-12-31 00:00:00")]
    public DateTime Time { get; set; }

    public string DietarySupplementInfo { get; set; } = null!;

    [Range(1,1000)]
    public int Weight { get; set; }

    [Range(typeof(DateOnly), "1900-01-01", "3000-12-31")]
    public DateOnly Date { get; set; }

    public string Method { get; set; } = null!;

    public string IvSolutionRate { get; set; } = null!;

    public string SpecialNeeds { get; set; } = null!;
}
