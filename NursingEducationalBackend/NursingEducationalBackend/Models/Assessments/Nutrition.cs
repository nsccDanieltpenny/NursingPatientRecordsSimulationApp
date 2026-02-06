using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace NursingEducationalBackend.Models.Assessments;

public partial class Nutrition
{
    public int NutritionId { get; set; }

    public string? Diet { get; set; }

    public string? Assist { get; set; }

    public string? Intake { get; set; }

    [Range(1, 1000)]
    public int? Weight { get; set; }

    [Range(typeof(DateOnly), "1900-01-01", "3000-12-31")]
    public DateOnly? Date { get; set; }

    public string? Method { get; set; }

    public string? SpecialNeeds { get; set; }

    public string? NGTube { get; set; }

    public DateOnly? NGTubeDate { get; set; }

    public string? FeedingTube { get; set; }

    public DateOnly? FeedingTubeDate { get; set; }
}
