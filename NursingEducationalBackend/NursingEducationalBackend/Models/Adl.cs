using System;
using System.Collections.Generic;

namespace NursingEducationalBackend.Models;

public partial class Adl
{
    public int AdlsId { get; set; }

    public DateOnly BathData { get; set; }

    public string TubShowerOther { get; set; } = null!;

    public string TypeOfCare { get; set; } = null!;

    public string TurningSchedule { get; set; } = null!;

    public string Teeth { get; set; } = null!;

    public string FootCare { get; set; } = null!;

    public string HairCare { get; set; } = null!;
}
