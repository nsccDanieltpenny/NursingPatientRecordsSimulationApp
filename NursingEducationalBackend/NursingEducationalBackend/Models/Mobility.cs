using System;
using System.Collections.Generic;

namespace NursingEducationalBackend.Models;

public partial class Mobility
{
    public int MobilityId { get; set; }

    public string? Transfer { get; set; }

    public string? Aids { get; set; }

    public string? BedMobility { get; set; }
}
