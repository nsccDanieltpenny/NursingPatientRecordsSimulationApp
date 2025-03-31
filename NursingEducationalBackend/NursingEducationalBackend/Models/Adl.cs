using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace NursingEducationalBackend.Models;

public partial class Adl
{
    public int AdlsId { get; set; }

    [Range(typeof(DateOnly), "1900-01-01", "3000-12-31")]
    public DateOnly BathDate { get; set; }

    public string TubShowerOther { get; set; } = null!;

    public string TypeOfCare { get; set; } = null!;

    public string TurningSchedule { get; set; } = null!;

    public string Teeth { get; set; } = null!;

    public string FootCare { get; set; } = null!;

    public string HairCare { get; set; } = null!;
}
