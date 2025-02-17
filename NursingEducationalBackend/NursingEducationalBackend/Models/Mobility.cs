using System;
using System.Collections.Generic;

namespace NursingEducationalBackend.Models;

public partial class Mobility
{
    public int MobilityId { get; set; }

    public string Transfer { get; set; } = null!;

    public string Aids { get; set; } = null!;

    public string BedMobility { get; set; } = null!;
}
