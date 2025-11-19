using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace NursingEducationalBackend.Models;

public partial class Nutrition
{
    public int NutritionId { get; set; }

    public string? Diet { get; set; }

    public string? Assist { get; set; }

    public string? Intake { get; set; }

    [Range(typeof(DateTime), "1900-01-01 00:00:00", "3000-12-31 00:00:00")]
    public DateTime? Time { get; set; }

    public string? DietarySupplementInfo { get; set; }

    [Range(1,1000)]
    public int? Weight { get; set; }

    [Range(typeof(DateOnly), "1900-01-01", "3000-12-31")]
    public DateOnly? Date { get; set; }

    public string? Method { get; set; }

    public string? IvSolutionRate { get; set; }

    public string? SpecialNeeds { get; set; }
}
